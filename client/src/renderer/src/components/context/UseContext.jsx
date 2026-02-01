import { Switch } from "antd";
import { useContext, createContext, useState } from "react";

const toggleContext = createContext();

export const ToggleProvider = ({children}) => {
    const [showDock, setShowDock] = useState(true)
    const [disableDockFunctionality, setDisableDockFunctionality] = useState(false)
    const [showUI, setShowUI] = useState(true)
    const [showSwitch, setShowSwitch] = useState(false)
    const [disableUISwitch, setDisableUISwitch] = useState(false)

    return (
        <toggleContext.Provider value={{showDock, setShowDock, disableDockFunctionality, setDisableDockFunctionality, setShowSwitch, setDisableUISwitch}}>
            <>
                <>
                    <div className={showUI ? 'visible' : 'invisible'}>
                        {children}
                    </div> 
                </>
                {showSwitch &&
                <>
                    <div className="absolute bottom-1 right-1">
                        <div className={`text-white font-[15px] ${showUI ? 'visible' : 'invisible'}`}>
                            Toggle UI
                        </div>
                        <Switch disabled={disableUISwitch} onChange={(e)=>setShowUI(!e)} />  
                    </div> 
                </>             
                }
            </>
        </toggleContext.Provider>
    )
}

export const useToggle = ()=> useContext(toggleContext)