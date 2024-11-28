"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { getPresentationById } from "../lib/actions/presentationActions"
import { socket } from "../lib/socket"

const AppContext = createContext()

const Provider = ({ children }) => {
	
	const [activeUser, setActiveUser] = useState(null)
	const [presentation, setPresentation] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(presentation?.slides[0] || null)
    const [connectedUsers, setConnectedUsers] = useState([]);

	const setThePresentation = async () => {
		const res = await getPresentationById(presentation?._id);
		setPresentation(res?.data?.presentation);
	}

	useEffect(() => {
		if (presentation?.slides?.length) {
			const existingSlide = presentation.slides.find(slide => slide._id === currentSlide?._id);
			setCurrentSlide(existingSlide || presentation.slides[0]);
		}
	}, [presentation]);


    useEffect(() => {
        const handleSocketEvents = () => {
            const updateUsersHandler = (users) => {
                setConnectedUsers(users);
            };
    
            const updatePresentationHandler = async () => {
                await setThePresentation();
            };
    
            socket.on("update users", updateUsersHandler);
            socket.on("New Slide", updatePresentationHandler);
            socket.on("Delete Slide", updatePresentationHandler);
            socket.on("Slide Change", updatePresentationHandler);
    
            return () => {
                socket.off("update users", updateUsersHandler);
                socket.off("New Slide", updatePresentationHandler);
                socket.off("Delete Slide", updatePresentationHandler);
                socket.off("Slide Change", updatePresentationHandler);
            };
        };
    
        const cleanup = handleSocketEvents();
    
        return cleanup;
    }, [presentation?._id]);
    


	return (
		<AppContext.Provider value={{ activeUser, setActiveUser, presentation, setPresentation, currentSlide, setCurrentSlide, connectedUsers, setConnectedUsers }}>{children}</AppContext.Provider>
	)
}

export default Provider

export const useAppContext = () => useContext(AppContext)
