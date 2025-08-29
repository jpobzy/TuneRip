import { Switch } from "antd";
import { useContext, createContext, useState } from "react";

const toggleContext = createContext();

export const ToggleProvider = ({children}) => {
    const [showDock, setShowDock] = useState(true)
    const [disableDockFunctionality, setDisableDockFunctionality] = useState(false)
    const [showUI, setShowUI] = useState(true)
    const [showSwitch, setShowSwitch] = useState(false)

    return (
        <toggleContext.Provider value={{showDock, setShowDock, disableDockFunctionality, setDisableDockFunctionality, setShowSwitch}}>
            <>
                <>
                    <div className={showUI ? 'visible' : 'invisible'}>
                        {children}
                    </div> 
                </>
                {showSwitch &&
                <>
                    {showUI &&
                        <div className="text-red-500 bottom-1 right-1 flex font-[15px] absolute  mb-[21px] mr-[62px] visible">
                            NEW
                        </div>                    
                    }

                    <div className="absolute bottom-1 right-1">
                        <div className="text-white font-[15px]">
                            Toggle UI
                        </div>
                        
                        <Switch onChange={(e)=>setShowUI(!e)} />  
                    </div> 
                </>             
                }
            </>
        </toggleContext.Provider>
    )
}

export const useToggle = ()=> useContext(toggleContext)