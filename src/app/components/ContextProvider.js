"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { getPresentationById } from "../lib/actions/presentationActions"
import { socket } from "../lib/socket"
import { getAndSetSession, hasRole } from "../lib/actions/userActions"

const AppContext = createContext()

const Provider = ({ children }) => {
    
    const [activeUser, setActiveUser] = useState(null)
	const [presentation, setPresentation] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(presentation?.slides[0] || null)
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [viewers, setViewers] = useState([])
    const [editors, setEditors] = useState([])

	const setThePresentation = async () => {
		const res = await getPresentationById(presentation?._id);
		setPresentation(res?.data?.presentation);
	}

    const isUserViewer = (presentation, activeUser) => {
        return presentation?.viewers.some(viewerId => viewerId === activeUser?._id);
    };

    useEffect(() => {
        const handleNewPresentation = async () => {
            await setThePresentation(); 
        };
    
        const handleDeletePresentation = async () => {
            await setThePresentation();
        };
    
        socket.on("New Presentation", handleNewPresentation);
        socket.on("Delete Presentation", handleDeletePresentation);
    
        return () => {
            socket.off("New Presentation", handleNewPresentation);
            socket.off("Delete Presentation", handleDeletePresentation);
        };
    }, [presentation?._id]);

    useEffect(() => {
        const setUser = async () => {
            const response = await getAndSetSession()
            setActiveUser(response?.user)
        } 
        setUser()
    }, [])

	useEffect(() => {
		if (presentation?.slides?.length) {
			const existingSlide = presentation.slides.find(slide => slide._id === currentSlide?._id);
			setCurrentSlide(existingSlide || presentation.slides[0]);
		}
	}, [presentation]);


    useEffect(() => {
        const updateUsersHandler = (users) => {
            setConnectedUsers(users);
        };
    
        const updatePresentationHandler = async () => {
            await setThePresentation();
        };
    
        socket.on("Update Roles", (roleData) => {
            setViewers(roleData?.viewers);
            setEditors(roleData?.editors);
            console.log(roleData);
        });
    
        socket.on("connect_error", (error) => {
            console.error("WebSocket connection error:", error);
        });
    
        socket.on("update users", updateUsersHandler);
        socket.on("New Slide", updatePresentationHandler);
        socket.on("Delete Slide", updatePresentationHandler);
        socket.on("Slide Change", updatePresentationHandler);
    
        return () => {
            socket.off("Update Roles");
            socket.off("update users", updateUsersHandler);
            socket.off("New Slide", updatePresentationHandler);
            socket.off("Delete Slide", updatePresentationHandler);
            socket.off("Slide Change", updatePresentationHandler);
        };
    }, [presentation?._id]);

	return (
		<AppContext.Provider
			value={{
				activeUser,
				setActiveUser,
				presentation,
				setPresentation,
				currentSlide,
				setCurrentSlide,
				connectedUsers,
				setConnectedUsers,
                viewers, editors, isUserViewer
			}}>
			{children}
		</AppContext.Provider>
	)
}

export default Provider

export const useAppContext = () => useContext(AppContext)
