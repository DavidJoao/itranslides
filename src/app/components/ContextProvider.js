"use client"
import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useState } from 'react'

const AppContext = createContext();

const Provider = ( { children } ) => {
    const [activeUser, setActiveUser] = useState(null)

    return (
        <SessionProvider>
            <AppContext.Provider value={{ activeUser, setActiveUser }}>
                {children}
            </AppContext.Provider>
        </SessionProvider>
    )
}

export default Provider

export const useAppContext = () => useContext(AppContext)