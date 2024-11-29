"use client"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
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


    const updateUsersHandler = useCallback((users) => {
        setConnectedUsers(users);
    }, []);

    const updatePresentationHandler = useCallback(async () => {
        await setThePresentation();
    }, [setThePresentation]); 
    const socketRef = useRef(socket);

    useEffect(() => {
        const currentSocket = socketRef.current;

        currentSocket.on("Update Roles", (roleData) => {
            setEditors(roleData?.editors);
            setViewers(roleData?.viewers);
            console.log(roleData);
        });

        currentSocket.on("update users", updateUsersHandler);
        currentSocket.on("New Slide", updatePresentationHandler);
        currentSocket.on("Delete Slide", updatePresentationHandler);
        currentSocket.on("Slide Change", updatePresentationHandler);

        return () => {
            currentSocket.off("Update Roles");
            currentSocket.off("update users", updateUsersHandler);
            currentSocket.off("New Slide", updatePresentationHandler);
            currentSocket.off("Delete Slide", updatePresentationHandler);
            currentSocket.off("Slide Change", updatePresentationHandler);
        };
    }, [updateUsersHandler, updatePresentationHandler]);


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
