import { useContext, createContext, useState, useEffect } from "react";
// import SplashCursor from "../clickComponents/SplashCursor";
// import ClickSpark from "../clickComponents/ClickSpark";
// import PixelTrail from "../clickComponents/PixelTrail";
// import Ribbons from "../cursor/ribbons/Ribbons";
import SplashCursor from "../cursor/splashCursor/SplashCursor";
import ClickSpark from "../cursor/clickSpark/ClickSpark";
import axios from "axios";
import { Button } from "antd";

const toggleClickContext = createContext();

export const ClickProvider = ({children}) => {
    const [clickState, setClickState] = useState('')


//    ############################### SPLASH CURSOR SETTINGS ################################
    const defaultSplashCursorSettings = { 
        SPLAT_RADIUS : 0.1,
        SPLAT_FORCE : 5000,
    }

    const [splashCursorCursorSettings, setSplashCursorCursorSettings] = useState(defaultSplashCursorSettings) 

    const splashCursorFormSettings = {
        SPLAT_RADIUS: { min: 0.01, max: 0.1, step: 0.01 },
        SPLAT_FORCE: { min: 1000, max: 10000, step: 200 }
    }

//    ############################### ClICK SPARK SETTINGS ################################
    const defaultClickSparkSettings = { 
        sparkColor: "#fff",
        sparkSize: 10,
        sparkRadius: 15,
        sparkCount: 8,
        duration: 400,
        extraScale: 1
    }

    const [clickSparkCursorSettings, setClickSparkCursorSettings] = useState(defaultClickSparkSettings) 

    const clickSparkFormSettings = {
        sparkSize: { min: 5, max: 60, step: 1 },
        sparkRadius: { min: 10, max: 200, step: 5 },
        sparkCount: { min: 1, max: 20, step: 1 },
        duration: { min: 200, max: 2000, step: 100 },
        extraScale: { min: 0.5, max: 2, step: 0.1 }
    }

//    ############################### RESET SETTINGS ################################

    const resetCursorSettings = async (cursorForm) => {
        if (clickState === 'clickSpark') {
            setClickSparkCursorSettings(defaultClickSparkSettings)
            cursorForm.setFieldsValue({
                sparkColor : defaultClickSparkSettings.sparkColor,
                sparkRadius : defaultClickSparkSettings.sparkRadius,
                sparkCount : defaultClickSparkSettings.sparkCount,
                duration : defaultClickSparkSettings.duration,
                extraScale : defaultClickSparkSettings.extraScale,
                sparkSize : defaultClickSparkSettings.sparkSize,
            })
        }else if (clickState === 'splashCursor'){
            setClickState('')
            setSplashCursorCursorSettings(defaultSplashCursorSettings)
            await new Promise(r => setTimeout(r, 1000));      
            setClickState('splashCursor')
            cursorForm.setFieldsValue({
                splatRadius : defaultSplashCursorSettings.SPLAT_RADIUS,
                splatForce : defaultSplashCursorSettings.SPLAT_FORCE
            })
                    
        }
        const req = await axios.post('http://localhost:8080/resetcursorsettings', {params : {'cursor' : clickState}})
    }

    const disableClickState = () => {
       
    }


    async function getData() {
        const req = await axios.get('http://localhost:8080/getcursorsettings')

        setClickState(req.data[0])
        for (let i = 0; i < Object.keys(req.data[1]).length; i++) {
            const currentCursor = Object.keys(req.data[1])[i]
            const prevSettings = Object.values(req.data[1])[i]
            if (currentCursor === 'clickSpark'){
                setClickSparkCursorSettings(prevSettings)
            }else if (currentCursor === 'splashCursor'){
                setSplashCursorCursorSettings(prevSettings)
            }
        }
    }

    useEffect(() =>{
        getData()     
    }, [])



    return (
        <toggleClickContext.Provider value={{
            splashCursorSettings : {splashCursorCursorSettings, setSplashCursorCursorSettings, splashCursorFormSettings},
            clickSparkSettings : {clickSparkCursorSettings, setClickSparkCursorSettings, clickSparkFormSettings},
            clickState, setClickState, disableClickState, resetCursorSettings
            }}>

            {clickState === 'splashCursor' ?
                <>
                    <div
                        >  
                        <SplashCursor 
                        SPLAT_RADIUS={splashCursorCursorSettings.SPLAT_RADIUS}
                        SPLAT_FORCE={splashCursorCursorSettings.SPLAT_FORCE}
                        />
                                                
                    </div>
                        {children}   
                </>
            : clickState === 'clickSpark' ?
                <>
                        <ClickSpark
                        sparkColor={clickSparkCursorSettings.sparkColor}
                        sparkSize={clickSparkCursorSettings.sparkSize}
                        sparkRadius={clickSparkCursorSettings.sparkRadius}
                        sparkCount={clickSparkCursorSettings.sparkCount}
                        duration={clickSparkCursorSettings.duration}
                        extraScale={clickSparkCursorSettings.extraScale}
                        >   
                           
                        </ClickSpark>    
                        {children}                          
                </>
            :
                <>
                    <div>
                        {children}
                    </div>
                </>
            }



        </toggleClickContext.Provider>
    )
}
export const useClickToggle = () => useContext(toggleClickContext)