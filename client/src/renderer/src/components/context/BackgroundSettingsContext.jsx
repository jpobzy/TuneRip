import { useContext, createContext, useState, useEffect } from "react";
import Aurora from "../background/Aurora";
import DarkVeil from "../background/DarkVeil";
import Galaxy from "../background/Galaxy";
import { Button } from "antd";


const toggleSettingsContext = createContext();

export const ToggleBackgroundSettingsProvider = ({children}) => {
    const [background, setBackground] = useState("galaxy");

    // ############################### AURORA SETTINGS
    const [auroraColorStop1, setAuroraColorStop1] = useState('#3A29FF')
    const [auroraColorStop2, setAuroraColorStop2] = useState('#FF94B4')
    const [auroraColorStop3, setAuroraColorStop3] = useState('#FF3232')
    const [auroraBackgroundSettings, setAuroraBackgroundSettings] = useState({
        blend: 0.5,
        amplitude: 1.0,
        speed: 0.5,
        colorStops : ["#3A29FF", "#FF94B4", "#FF3232"]
    })

    const auroraDefaultBackgroundSettings = { blend: 0.5,  amplitude: 1.0, speed: 0.5, colorStops : ["#3A29FF", "#FF94B4", "#FF3232"]}

    const updateColorStopIndex = (index, newColor) => {
            const updatedStops = auroraBackgroundSettings.colorStops; 
            updatedStops[index] = newColor;              
        setAuroraBackgroundSettings(prev => {
            return { ...prev, colorStops: updatedStops,}; 
        })
        delete auroraBackgroundSettings['updatedStops']
    }

    const resetAllAuroraSettings = () => {
        setAuroraBackgroundSettings(auroraDefaultBackgroundSettings)
    }

    const resetColorStopIndex = (index) => {
        // resets aurora color to its default color 
        setAuroraBackgroundSettings(prev => {
            const updatedStops = auroraBackgroundSettings.colorStops; 
            const defaultColor = auroraDefaultBackgroundSettings.colorStops[index]
            updatedStops[index] = defaultColor;          
            return { ...prev, updatedStops}; 
        })
    }
    
    
//    ############################### VEIL SETTINGS ################################
    const [veilBackgroundSettings, setVeilBackgroundSettings] = useState({
        speed: 0.5,
        hueShift: 0,
        noiseIntensity: 0,
        scanlineFrequency: 0,
        scanlineIntensity: 0,
        warpAmount: 0
    }) 

    const defaultVeilSettings = { 
        speed: 0.5,
        hueShift: 0,
        noiseIntensity: 0,
        scanlineFrequency: 0,
        scanlineIntensity: 0,
        warpAmount: 0}

    const resetVeilSettings = () =>{
        setVeilBackgroundSettings(defaultVeilSettings)
    }


//    ############################### GALAXY SETTINGS ################################
    const [galaxyBackgroundSettings, setGalaxyBackgroundSettings] = useState({
        starSpeed : 0.5,
        density : 1,
        hueShift : 140,
        speed : 1.0, 
        glowIntensity : 0.3,
        saturation : 0.0, 
        twinkleIntensity : 0.3,
        transparent : true
    })

    const defaultGalaxySettings = {
        starSpeed : 0.5,
        density : 1,
        hueShift : 140,
        speed : 1.0, 
        glowIntensity : 0.3,
        saturation : 0.0, 
        twinkleIntensity : 0.3,
        transparent : true     
    }

    const resetGalaxySettings = () => {
        setGalaxyBackgroundSettings(defaultGalaxySettings)
    }












    const setChosenBackground = (e) =>{
        setBackground(e);
        if (e === 'veil'){
            document.body.style.backgroundColor = 'black';
        }else if (e === 'aurora'){
            document.body.style.backgroundColor = '#1a1a1afd';
        }else if (e === 'galaxy'){
            document.body.style.backgroundColor = 'black';
        }      
        
    }


    useEffect(()=>{
        if (background === 'veil'){
            document.body.style.backgroundColor = 'black';
        }else if (background === 'aurora'){
            console.log(`aurora settings: ${auroraBackgroundSettings}`)
            document.body.style.backgroundColor = '#1a1a1afd';
        }else if (background === 'galaxy'){
            document.body.style.backgroundColor = 'black';
        }
        // console.log('done')
    }, [])

    return (
        <toggleSettingsContext.Provider value={{background, setChosenBackground, 
            auroraSettings : {setAuroraBackgroundSettings, updateColorStopIndex, resetColorStopIndex, resetAllAuroraSettings},
            veilSettings: {veilBackgroundSettings, setVeilBackgroundSettings, resetVeilSettings, },
            galaxySettings : {resetGalaxySettings, setGalaxyBackgroundSettings, }
    
        }}>
            { background === 'veil' && 
                <div className='-mb-[570px]'>
                    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
                        <DarkVeil 
                            speed={veilBackgroundSettings.speed}
                            hueShift={veilBackgroundSettings.hueShift}
                            noiseIntensity={veilBackgroundSettings.noiseIntensity}
                            scanlineFrequency={veilBackgroundSettings.scanlineFrequency}
                            scanlineIntensity={veilBackgroundSettings.scanlineIntensity}
                            warpAmount={veilBackgroundSettings.warpAmount}
                        />
                    </div>
                </div>
            } 
            { background === 'aurora' &&
                <div>
                    <Aurora
                    colorStops={auroraBackgroundSettings.colorStops}
                    blend={auroraBackgroundSettings.blend}
                    amplitude={auroraBackgroundSettings.amplitude}
                    speed={auroraBackgroundSettings.speed}
                    />              
                </div>

            }
            { background === 'galaxy' &&
                <div className="z-0"
                    style={{
                    position: 'fixed', 
                    width: '100%',
                    height: '100vh'  
                    }}>
                    <div style={{ width: '100%', height: '100vh', position: 'fixed' }} >
                        <Galaxy
                        density={galaxyBackgroundSettings.density}
                        glowIntensity={galaxyBackgroundSettings.glowIntensity}
                        saturation={galaxyBackgroundSettings.saturation}
                        hueShift={galaxyBackgroundSettings.hueShift}
                        twinkleIntensity={galaxyBackgroundSettings.twinkleIntensity}
                        transparent={false}
                        starSpeed={galaxyBackgroundSettings.starSpeed}
                        speed={galaxyBackgroundSettings.speed}
                        />
                    </div>
                </div>
            }
            <div className="z-10">
               {children} 
            </div>
            
        </toggleSettingsContext.Provider>
    )
}

export const toggleBackgroundSettings = ()=> useContext(toggleSettingsContext)