import { useContext, createContext, useState } from "react";
import SplashCursor from "../clickComponents/SplashCursor";
import ClickSpark from "../clickComponents/ClickSpark";
import PixelTrail from "../clickComponents/PixelTrail";
import Ribbons from "../clickComponents/Ribbons";

const toggleClickContext = createContext();

export const ClickProvider = ({children}) => {
    const [clickState, setClickState] = useState('')

//    ############################### SPLASH CURSOR SETTINGS ################################
    const defaultSplashCursorSettings = { 
        SPLAT_RADIUS : 0.1,
        SPLAT_FORCE : 5000,
    }

    const [splashCursorBackgroundSettings, setSplashCursorBackgroundSettings] = useState({defaultSplashCursorSettings}) 

    const splashCursorFormSettings = {
        SPLAT_RADIUS: { min: 0.01, max: 0.1, step: 0.01 },
        SPLAT_FORCE: { min: 1000, max: 10000, step: 5000 }
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

    const [clickSparkBackgroundSettings, setClickSparkBackgroundSettings] = useState({defaultClickSparkSettings}) 

    const clickSparkFormSettings = {
        sparkSize: { min: 5, max: 60, step: 1 },
        sparkRadius: { min: 10, max: 200, step: 5 },
        sparkCount: { min: 1, max: 20, step: 1 },
        duration: { min: 200, max: 2000, step: 100 },
        extraScale: { min: 0.5, max: 2, step: 0.1 }
    }

//    ############################### PIXEL TRAIL SETTINGS ################################
    const defaulPixelTrailSettings = { 
        gridSize: 50,
        trailSize: 0.1,
        maxAge: 250,
        interpolate: 5,
        color: "#5227FF",
        gooeyFilter: true,
        gooeyStrength: 2
    }

    const [pixelTrailBackgroundSettings, setPixelTrailBackgroundSettings] = useState({defaulPixelTrailSettings}) 

    const pixelTrailFormSettings = {
        gridSize:     { min: 10, max: 100, step: 1 },
        trailSize:    { min: 0.05, max: 0.5, step: 0.01 },
        maxAge:       { min: 100, max: 1000, step: 50 },
        interpolate:  { min: 0, max: 10, step: 0.1 },
        gooeyStrength:{ min: 1, max: 20, step: 1 }
    }

//    ############################### RIBBON SETTINGS ################################
    const defaulRibbonsSettings = { 
        count: 1,
        thickness: 30,
        speed: 0.5,
        maxAge: 500,
        enableFade: true,
        enableWaves: true
    }

    const [ribbonsBackgroundSettings, setRibbonsBackgroundSettings] = useState({defaulRibbonsSettings}) 

    const ribbonsFormSettings = {
        count:     { min: 1, max: 10, step: 1 },
        thickness:    { min: 1, max: 60, step: 1 },
        speed:       { min: 0.3, max: 0.7, step: 0.01 },
        maxAge:  { min: 300, max: 1000, step: 100 }
    }




    return (
        <toggleClickContext.Provider value={setClickState}>

            {clickState === 'splashCursor' &&
                <>
                    <div
                    className="z-0"
                        style={{
                        position: 'fixed', 
                        width: '100%',
                        height: '100%'  
                        }}>  
                        <SplashCursor 
                        SPLAT_RADIUS={splashCursorBackgroundSettings.SPLAT_RADIUS}
                        SPLAT_FORCE={splashCursorBackgroundSettings.SPLAT_FORCE}
                        />
                        {children}                            
                    </div>
            
                </>
            }
            {clickState === 'clickSpark' &&
                <>
                    <div
                    className="z-0"
                        style={{
                        position: 'fixed', 
                        width: '100%',
                        height: '100%'  
                        }}>  
                        <ClickSpark
                        sparkColor='#fff'
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                        >
                            {children} 
                        </ClickSpark>                         
                    </div>
                </>
            }
            {clickState === 'pixelTrail' &&
                <>
                    <div
                    className="z-0"
                        style={{
                        position: 'fixed', 
                        width: '100%',
                        height: '100%'  
                        }}>  
                            <PixelTrail
                                gridSize={50}
                                trailSize={0.1}
                                maxAge={250}
                                interpolate={5}
                                color="#fff"
                                gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
                            />
                            {children}                        
                    </div>
                </>
            }
            {clickState === 'ribbons' &&
                <>
                    <div
                    className="z-0"
                        style={{
                        position: 'fixed', 
                        width: '100%',
                        height: '100%'  
                        }}>  
                            <Ribbons
                                baseThickness={30}
                                colors={['#ffffff']}
                                speedMultiplier={0.5}
                                maxAge={500}
                                enableFade={false}
                                enableShaderEffect={true}
                            />   
                            {children}                        
                    </div>
                </> 
            }


            


        </toggleClickContext.Provider>
    )
}
export const useClickToggle = () => useContext(toggleClickContext)