import { useContext, createContext, useState } from "react";

const toggleContext = createContext();

export const ToggleProvider = ({children}) => {
    const [showDock, setShowDock] = useState(true)

    return (
        <toggleContext.Provider value={{showDock, setShowDock}}>
            {children}
        </toggleContext.Provider>
    )
}

export const useToggle = ()=> useContext(toggleContext)