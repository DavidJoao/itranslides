"use client"
import { createContext, useContext, useState } from "react"

const AppContext = createContext()

const Provider = ({ children }) => {
	const [activeUser, setActiveUser] = useState(null)
	const [presentation, setPresentation] = useState(null)
	const [currentSlide, setCurrentSlide] = useState(null)

	return (
		<AppContext.Provider value={{ activeUser, setActiveUser, presentation, setPresentation, currentSlide, setCurrentSlide }}>{children}</AppContext.Provider>
	)
}

export default Provider

export const useAppContext = () => useContext(AppContext)
