import { useContext, createContext, useState } from "react";

const toggleContext = createContext();

export const ToggleProvider = ({children}) => {
    const [showDock, setShowDock] = useState(true)
    const [disableDockFunctionality, setDisableDockFunctionality] = useState(false)

    return (
        <toggleContext.Provider value={{showDock, setShowDock, disableDockFunctionality, setDisableDockFunctionality}}>
            {children}
        </toggleContext.Provider>
    )
}

export const useToggle = ()=> useContext(toggleContext)