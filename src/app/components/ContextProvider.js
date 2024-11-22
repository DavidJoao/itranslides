"use client"
import { createContext, useContext, useState } from "react"

const AppContext = createContext()

const Provider = ({ children }) => {
	const [activeUser, setActiveUser] = useState(null)

	return (
		<AppContext.Provider value={{ activeUser, setActiveUser }}>{children}</AppContext.Provider>
	)
}

export default Provider

export const useAppContext = () => useContext(AppContext)
