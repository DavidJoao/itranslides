"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { getPresentationById } from "../lib/actions/presentationActions"
import { socket } from "../lib/socket"

const AppContext = createContext()

const Provider = ({ children }) => {
	
	const [activeUser, setActiveUser] = useState(null)
	const [presentation, setPresentation] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(presentation?.slides[0] || null)

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
            socket.on("New Slide", async () => {
                await setThePresentation()
            });
            socket.on("Delete Slide", async () => {
                await setThePresentation()
            });
            socket.on("Slide Change", async () => {
                await setThePresentation()
            });
        };

        handleSocketEvents();

        return () => {
            socket.off("New Slide");
            socket.off("Delete Slide");
            socket.off("Slide Change");
        };
    }, [presentation?._id]);
	

	return (
		<AppContext.Provider value={{ activeUser, setActiveUser, presentation, setPresentation, currentSlide, setCurrentSlide }}>{children}</AppContext.Provider>
	)
}

export default Provider

export const useAppContext = () => useContext(AppContext)
