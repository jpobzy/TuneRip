import { useContext, createContext, useState, useEffect } from "react";
import Aurora from "../background/Aurora";
import DarkVeil from "../background/DarkVeil";
import Galaxy from "../background/Galaxy";


const toggleSettingsContext = createContext();

export const ToggleBackgroundSettingsProvider = ({children}) => {

    const [background, setBackground] = useState("galaxy");


    useEffect(()=>{
        if (background === 'veil'){
            document.body.style.backgroundColor = 'black';
        }else if (background === 'aurora'){
            document.body.style.backgroundColor = '#1a1a1afd';
        }else if (background === 'galaxy'){
            document.body.style.backgroundColor = 'black';
        }
    }, [])

    return (
        <toggleSettingsContext.Provider value={{background, setBackground}}>
            { background === 'veil' && 
                <div className='-mb-[570px]'>
                <div style={{ width: '100%', height: '600px', position: 'relative' }}>
                    <DarkVeil />
                </div>
                </div>
            } 
            { background === 'aurora' &&
                <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
                />
            }
            { background === 'galaxy' &&
                <div className=''  style={{
                    position: 'fixed', // NOT absolute
                    width: '100%',
                    height: '100vh'       // Viewport height
                }}>
                <div style={{ width: '100%', height: '100vh', position: 'fixed' }} >
                    <Galaxy
                    mouseRepulsion={false}
                    mouseInteraction={false}
                    density={1.5}
                    glowIntensity={0.5}
                    saturation={0.8}
                    hueShift={240}
                    />
                </div>
                </div>
            }
            {children}
        </toggleSettingsContext.Provider>
    )
}

export const toggleBackgroundSettings = ()=> useContext(toggleSettingsContext)