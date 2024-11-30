"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getPresentationById } from "../lib/actions/presentationActions"
import { socket } from "../lib/socket"
import { getAndSetSession, hasRole } from "../lib/actions/userActions"
import { getPresentations, getMyPresentations } from "../lib/actions/presentationActions"

const AppContext = createContext()

const Provider = ({ children }) => {
    
    const [activeUser, setActiveUser] = useState(null)
	const [presentation, setPresentation] = useState(null)
    const [presentations, setPresentations] = useState([])
    const [myPresentations, setMyPresentations] = useState([])
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

    const handleLoadPresentations = useCallback(async () => {
        const allRes = await getPresentations();
        setPresentations(allRes?.data?.presentations);
        
        if (activeUser) {
            const myRes = await getMyPresentations(activeUser._id);
            setMyPresentations(myRes?.data?.presentations);
        }
    }, [activeUser]);

    useEffect(() => {
        const setUser = async () => {
            const user = await getAndSetSession();
            if (user) {
                setActiveUser(user.user);
            }
        };
        setUser();
    }, []);
    
    useEffect(() => {
        const loadPresentations = async () => {
            handleLoadPresentations()
        }
        loadPresentations();
    }, [])

    useEffect(() => {
    
        socket.on("New Presentation", handleLoadPresentations);
        socket.on("Delete Presentation", handleLoadPresentations);
    
        return () => {
            socket.off("New Presentation", handleLoadPresentations);
            socket.off("Delete Presentation", handleLoadPresentations);
        };
    }, [activeUser]);

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
    
    useEffect(() => {
        if (presentation?.slides?.length) {
            const existingSlide = presentation.slides.find(slide => slide._id === currentSlide?._id);
            setCurrentSlide(existingSlide || presentation.slides[0]);
        }
    }, [presentation]);
    
	return (
        <AppContext.Provider
        value={{
            activeUser,
            setActiveUser,
            presentation, presentations, setMyPresentations, myPresentations, setPresentations,
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
