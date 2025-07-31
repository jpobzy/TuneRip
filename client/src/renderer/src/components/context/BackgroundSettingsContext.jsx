import { useContext, createContext, useState, useEffect } from "react";
import Aurora from "../background/Aurora";
import DarkVeil from "../background/DarkVeil";
import Galaxy from "../background/Galaxy";
import Lightning from "../background/Lightning";
import FaultyTerminal from "../background/FaultyTerminal";
import DotGrid from "../background/DotGrid";
import Hyperspeed from "../background/Hyperspeed";
import { Color } from '@rc-component/color-picker';
import { hyperspeedPresets } from "../background/hyperspeedPresets/HyperspeedPresets";
import Iridescence from "../background/Iridescence";
import Waves from "../background/Waves";
import LetterGlitch from "../background/LetterGlitch";
import Squares from "../background/squares/Squares";
import { Button } from "antd";

const toggleSettingsContext = createContext();

export const ToggleBackgroundSettingsProvider = ({children}) => {
    const [background, setBackground] = useState("squares");

    // ############################### AURORA SETTINGS #######################################
    const [auroraBackgroundSettings, setAuroraBackgroundSettings] = useState({
        blend: 0.5,
        amplitude: 1.0,
        speed: 0.5,
        colorStops : ["#3A29FF", "#FF94B4", "#FF3232"]
    })

    const defaultAuroraBackgroundSettings = { blend: 0.5,  amplitude: 1.0, speed: 0.5, colorStops : ["#3A29FF", "#FF94B4", "#FF3232"]}

    const updateColorStopIndex = (index, newColor) => {
        const updatedStops = auroraBackgroundSettings.colorStops; 
        updatedStops[index] = newColor;              
        setAuroraBackgroundSettings(prev => {
            return { ...prev, colorStops: updatedStops,}; 
        })
        delete auroraBackgroundSettings['updatedStops']
    }


    const resetColorStopIndex = (index) => {
        // resets aurora color to its default color 
        setAuroraBackgroundSettings(prev => {
            const updatedStops = auroraBackgroundSettings.colorStops; 
            const defaultColor = defaultAuroraBackgroundSettings.colorStops[index]
            updatedStops[index] = defaultColor;          
            return { ...prev, updatedStops}; 
        })
    }

    const auroraFormSettings = {
        blend: {min: 0.1, max : 2, step : 0.1},
        speed: {min: 0.1, max: 2, step : 0.1}
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
        warpAmount: 0
    }

    const veilFormSettings = {
        speed: { min: 0, max: 3, step: 0.1 },
        hueShift: { min: 0, max: 360, step: 1 },
        noiseIntensity: { min: 0, max: 0.2, step: 0.01 },
        scanlineFrequency: { min: 0, max: 5, step: 0.1 },
        scanlineIntensity: { min: 0, max: 1, step: 0.01 },
        warpAmount: { min: 0, max: 5, step: 0.1 }
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

    const galaxyFormSettings = {
        starSpeed: { min: 0.1, max: 2, step: 0.1 },
        density: { min: 0.1, max: 3, step: 0.1 },
        hueShift: { min: 0, max: 360, step: 10 },
        speed: { min: 0.1, max: 3, step: 0.1 },
        glowIntensity: { min: 0, max: 1, step: 0.1 },
        saturation: { min: 0, max: 1, step: 0.1 },   
        twinkleIntensity: { min: 0, max: 1, step: 0.1 },
    }


//    ############################### LIGHTNING SETTINGS ################################

     const [lightningBackgroundSettings, setLightningBackgroundSettings] = useState({
        hue: 260,
        xOffset: 0,
        speed: 1,
        intensity: 1,
        size: 1
    })

    const defaultLightningSettings = {
        hue: 260,
        xOffset: 0,
        speed: 1,
        intensity: 1,
        size: 1
    }

    const lightningFormSettings = {
        hue: { min: 0, max: 360, step: 1 },
        xOffset: { min: -2, max: 1.9, step: 0.1 },
        speed: { min: 0.5, max: 2, step: 0.1 },
        intensity: { min: 0.1, max: 2, step: 0.1 },
        size: { min: 0.1, max: 2.9, step: 0.1 }
    };
    

//    ############################### FAULTY TERMINAL SETTINGS ################################

    const [faultyTerminalBackgroundSettings, setFaultyTerminalBackgroundSettings] = useState({
        tintColor: "#A7EF9E",
        scale: 1.5,
        digitSize: 1.2,
        speed: 0.5,
        noiseAmplitude: 1,
        brightness: 0.6,
        scanlineIntensity: 0.5,
        curvature: 0.1,
        mouseStrength: 0.5,
        mouseReact: true, 
        pageLoadAnimation: true 
        })

    const defaultFaultyTerminalSettings = {
        tintColor: "#A7EF9E",
        scale: 1.5,
        digitSize: 1.2,
        speed: 0.5,
        noiseAmplitude: 1,
        brightness: 0.6,
        scanlineIntensity: 0.5,
        curvature: 0.1,
        mouseStrength: 0.5,
        mouseReact: true, 
        pageLoadAnimation: true 
    }

    const faultyTerminalFormSettings = {
        scale: { min: 1, max: 3, step: 0.1 },
        digitSize: { min: 0.5, max: 3, step: 0.1 },
        speed: { min: 0, max: 3, step: 0.1 },
        noiseAmplitude: { min: 0.5, max: 1, step: 0.1 },
        brightness: { min: 0.1, max: 1, step: 0.1 },
        scanlineIntensity: { min: 0, max: 2, step: 0.1 },
        curvature: { min: 0, max: 0.5, step: 0.01 },
        mouseStrength: { min: 0, max: 2, step: 0.1 }        
    }

//    ############################### DOT GRID SETTINGS ################################
    const [dotGridBackgroundSettings, setDotGridBackgroundSettings] = useState({
        baseColor: "#5227FF",
        activeColor: "#5227FF",
        dotSize: 5,
        gap: 15,
        proximity: 120,
        shockRadius: 250,
        shockStrength: 5,
        resistance: 750, 
        returnDuration: 1.5, 
    })

    const defaultDotGridSettings = {
        baseColor: "#5227FF",
        activeColor: "#5227FF",
        dotSize: 5,
        gap: 15,
        proximity: 120,
        shockRadius: 250,
        shockStrength: 5,
        resistance: 750, 
        returnDuration: 1.5, 
    }

// ############################### HYPER SPEED SETTINGS ################################

    

    const defaultHypserspeedSettings = {
        // default : {
                    onSpeedUp: () => { },
                    onSlowDown: () => { },
                    distortion: 'turbulentDistortion',
                    length: 400,
                    roadWidth: 10,
                    islandWidth: 2,
                    lanesPerRoad: 4,
                    fov: 90,
                    fovSpeedUp: 150,
                    speedUp: 2,
                    carLightsFade: 0.4,
                    totalSideLightSticks: 20,
                    lightPairsPerRoadWay: 40,
                    shoulderLinesWidthPercentage: 0.05,
                    brokenLinesWidthPercentage: 0.1,
                    brokenLinesLengthPercentage: 0.5,
                    lightStickWidth: [0.12, 0.5],
                    lightStickHeight: [1.3, 1.7],
                    movingAwaySpeed: [60, 80],
                    movingCloserSpeed: [-120, -160],
                    carLightsLength: [400 * 0.03, 400 * 0.2],
                    carLightsRadius: [0.05, 0.14],
                    carWidthPercentage: [0.3, 0.5],
                    carShiftX: [-0.8, 0.8],
                    carFloorSeparation: [0, 5],
                    colors: {
                    roadColor: 0x080808,
                    islandColor: 0x0a0a0a,
                    background: 0x000000,
                    shoulderLines: 0xFFFFFF,
                    brokenLines: 0xFFFFFF,
                    leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                    rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                    sticks: 0x03B3C3,
                    }
                // }
    }

    const hyperspeedPresetOptions = hyperspeedPresets
    
    const [hypserspeedBackgroundSettings, setHyperspeedSettings] = useState(defaultHypserspeedSettings)

    const changeHyperspeedSettings = (presetSelected) =>{
        if (presetSelected == 'default'){
            setHyperspeedSettings(defaultHypserspeedSettings)
        }else if (presetSelected == 'cyberpunk'){
            setHyperspeedSettings(hyperspeedPresetOptions.one)
        } else if (presetSelected == 'akira'){
            setHyperspeedSettings(hyperspeedPresetOptions.two)
        } else if (presetSelected == 'golden'){
            setHyperspeedSettings(hyperspeedPresetOptions.three)
        } else if (presetSelected == 'split'){
            setHyperspeedSettings(hyperspeedPresetOptions.four)
        } else if (presetSelected == 'highway'){
            setHyperspeedSettings(hyperspeedPresetOptions.five)
        }else if (presetSelected == 'other'){
            setHyperspeedSettings(hyperspeedPresetOptions.six)
        }
    }


// ############################### IRIDESCENCE SETTINGS ################################

    const defaultIridescenceSettings = {
        color : [1, 1, 1],
        mouseReact : false,
        amplitude : 0.1,
        speed : 1.0,
    }

    const [iridescenceBackgroundSettings, setIridescenceBackgroundSettings] = useState(defaultIridescenceSettings)

    const iridescenceFormSettings = {
        red : {min : 0, max : 1, step : 0.1},
        green : {min : 0, max : 1, step : 0.1},
        blue : {min : 0, max : 1, step : 0.1},
        speed : {min : 0.1, max : 2, step : 0.1},
    }

    const updateIridescenceColorIndex = (index, newColor) => {
        const updatedStops = iridescenceBackgroundSettings.color; 
        updatedStops[index] = newColor;              
        setIridescenceBackgroundSettings(prev => {
            return { ...prev, ...updatedStops}; 
        })
    }

// ############################### WAVES SETTINGS ################################


    const defaultWavesSettings = {
        waveSpeedX : 0.0125,
        wavesColor : "#FFFFFF"
    }

    const [wavesBackgroundSettings, setWavesBackgroundSettings] = useState(defaultWavesSettings)

    const wavesFormSettings = {
        waveSpeedX : {min : 0, max : 0.1, step : 0.01},
        wavesColor : "#FFFFFF"
    }


    const updateWavesColorIndex = (index, newColor) => {
        const updatedStops = wavesBackgroundSettings.wavesColor; 
        updatedStops[index] = newColor;              
        setIridescenceBackgroundSettings(prev => {
            return { ...prev, ...updatedStops}; 
        })
    }

// ############################### LETTER GLITCH SETTINGS ################################

    const defaultLetterGlitchSettings = {
        glitchColors: ['#2b4539', '#61dca3', '#61b3dc'],
        glitchSpeed: 10,
        smoothAnimation: true,
        showCenterVignette: true,
        showOuterVignette: false
    }

    const [letterGlitchBackgroundSettings, setLetterGlitchBackgroundSettings] = useState(defaultLetterGlitchSettings)
    
    const letterGlitchFormSettings = {
        glitchSpeed : {min : 5, max : 100, step : 5},
    } 

    const updateLetterGlitchIndex = (index, newColor) => {
        const updatedStops = letterGlitchBackgroundSettings.glitchColors;
        updatedStops[index] = newColor;     
        setLetterGlitchBackgroundSettings(prev => {
            return { ...prev, glitchColors : updatedStops}; 
        })
    }

// ############################### SQUARES SETTINGS ################################
    const defaultSquaresSettings = {
        direction : 'diagonal',
        speed : 0.5,
        squareSize : 40,
        borderColor : '#fff',
        hoverFillColor : '#222'
    }

    const [squareBackgroundSettings, setSquareBackgroundSettings] = useState(defaultSquaresSettings)
    
    const squaresFormSettings = {
        squareSize : {min : 10, max : 100, step : 1},
        speed : {min : 0.1, max : 2, step : 0.01},
    }

// ###############################################################################
// ############################### RESET SETTINGS ################################
// ###############################################################################
    const reset = (backgroundForm) => {
        if (background === 'aurora'){
            setAuroraBackgroundSettings(defaultAuroraBackgroundSettings)
            backgroundForm.setFieldsValue({
                speed : defaultAuroraBackgroundSettings.speed,
                blend : defaultAuroraBackgroundSettings.blend,
                colorPicker1 :  new Color("#3A29FF"),
                colorPicker2 :  new Color("#FF94B4"),
                colorPicker3 :  new Color("#FF3232"),                
            }) 
        }else if (background === 'veil'){
            setVeilBackgroundSettings(defaultVeilSettings)
            backgroundForm.setFieldsValue({
                speed : defaultVeilSettings.speed,
                hueShift : defaultVeilSettings.hueShift,
                scanlineFrequency : defaultVeilSettings.scanlineFrequency,
                scanlineIntensity : defaultVeilSettings.scanlineIntensity,
                warpAmount : defaultVeilSettings.warpAmount,
            })
        }else if (background === 'galaxy'){
            setGalaxyBackgroundSettings(defaultGalaxySettings)
            backgroundForm.setFieldsValue({
                density : defaultGalaxySettings.density,
                glowIntensity : defaultGalaxySettings.glowIntensity,
                saturation : defaultGalaxySettings.saturation,
                hueShift : defaultGalaxySettings.hueShift,
                twinkleIntensity : defaultGalaxySettings.twinkleIntensity,
                transparent : defaultGalaxySettings.transparent,
                starSpeed : defaultGalaxySettings.starSpeed,
                speed : defaultGalaxySettings.speed,
            })
        }else if (background === 'lightning'){
            setLightningBackgroundSettings(defaultLightningSettings)
            backgroundForm.setFieldsValue({
                hue : defaultLightningSettings.hue,
                xOffset : defaultLightningSettings.xOffset,
                speed : defaultLightningSettings.speed,
                intensity : defaultLightningSettings.intensity,
                size : defaultLightningSettings.size,
            })
        }else if (background === 'faultyTerminal'){
            setFaultyTerminalBackgroundSettings(defaultFaultyTerminalSettings)
            backgroundForm.setFieldsValue({
                hue : defaultLightningSettings.hue,
                xOffset : defaultLightningSettings.xOffset,
                speed : defaultLightningSettings.speed,
                intensity : defaultLightningSettings.intensity,
                size : defaultLightningSettings.size,
                tintColor:  new Color("#A7EF9E"),
            })
        }else if (background === 'dotGrid'){
            setDotGridBackgroundSettings(defaultDotGridSettings)
            backgroundForm.setFieldsValue({
                // 'baseColor': defaultDotGridSettings.baseColor,
                // 'activeColor': defaultDotGridSettings.activeColor,
                'dotSize': defaultDotGridSettings.dotSize,
                'gap': defaultDotGridSettings.gap,
                'proximity': defaultDotGridSettings.proximity,
                'shockRadius': defaultDotGridSettings.shockRadius,
                'shockStrength': defaultDotGridSettings.shockStrength,
                'resistance': defaultDotGridSettings.resistance,
                'returnDuration': defaultDotGridSettings.returnDuration,
                baseColor:  new Color('#5227FF'),
                activeColor:  new Color('#5227FF'),
            })
        }else if (background === 'hyperspeed'){
            setHyperspeedSettings(hypserspeedDefaultSettings.default)
        }else if (background === 'iridescence'){
            setIridescenceBackgroundSettings(defaultIridescenceSettings)
        }else if (background === 'waves'){
            setWavesBackgroundSettings(defaultWavesSettings)
            backgroundForm.setFieldsValue({
                waveSpeedX : defaultWavesSettings.waveSpeedX,
                wavesColor : new Color("#FFFFFF")
            })
        }else if (background === 'letterGlitch'){
            setLetterGlitchBackgroundSettings(defaultLetterGlitchSettings)
            backgroundForm.setFieldsValue({
                glitchSpeed : defaultLetterGlitchSettings.glitchSpeed,
                glitchColor1 : new Color("2b4539"),
                glitchColor2 : new Color("61dca3"),
                glitchColor3 : new Color("61b3dc"),
            })
        }else if (background === 'squares'){
            setSquareBackgroundSettings(defaultSquaresSettings)
            backgroundForm.setFieldsValue({
                direction : defaultSquaresSettings.direction,
                squareSize : defaultSquaresSettings.squareSize,
                speed : defaultSquaresSettings.speed,
                borderColor : new Color("#fff"),
                hoverFillColor : new Color('#222')
            })
        }
    }



    const setChosenBackground = (e) =>{
        setBackground(e);

        if (e === 'aurora'){
            document.body.style.backgroundColor = '#1a1a1afd';
            // document.body.style.backgroundColor = '#1a1a1afd';
        } else if (e === 'veil'){
            document.body.style.backgroundColor = 'black';
        } else if (e === 'galaxy'){
            document.body.style.backgroundColor = 'black';
        } else if (e === 'rippleGrid'){
            document.body.style.backgroundColor = 'black';
        } else if (e === 'waves'){
            document.body.style.backgroundColor = 'black';
        } else if (e === 'letterGlitch'){
            document.body.style.backgroundColor = 'black';
        } else if (e === 'squares'){
            document.body.style.backgroundColor = 'black';
        }
    }



    // useEffect(()=>{
    //     if (background === 'veil'){
    //         document.body.style.backgroundColor = 'black';
    //     }else if (background === 'aurora'){
    //         console.log(`aurora settings: ${auroraBackgroundSettings}`)
    //         document.body.style.backgroundColor = '#1a1a1afd';
    //     }else if (background === 'galaxy'){
    //         document.body.style.backgroundColor = 'black';
    //     }else if (background === 'sqaures'){
    //         document.body.style.backgroundColor = 'black';
    //     }
        
    // }, [])

    return (
        <toggleSettingsContext.Provider value={{background, setChosenBackground, reset, 
            auroraSettings : {auroraBackgroundSettings, setAuroraBackgroundSettings, updateColorStopIndex, resetColorStopIndex, auroraFormSettings},
            veilSettings: {veilBackgroundSettings, setVeilBackgroundSettings, veilFormSettings },
            galaxySettings : {galaxyBackgroundSettings, setGalaxyBackgroundSettings, galaxyFormSettings},
            lightningSettings: {lightningBackgroundSettings, setLightningBackgroundSettings, lightningFormSettings},
            faultyTerminalSettings : {faultyTerminalBackgroundSettings, setFaultyTerminalBackgroundSettings, faultyTerminalFormSettings},
            dotGridSettings: {dotGridBackgroundSettings, setDotGridBackgroundSettings},
            hyperspeedSettings: {changeHyperspeedSettings},
            iridescenceSettings : {iridescenceBackgroundSettings, setIridescenceBackgroundSettings, iridescenceFormSettings, updateIridescenceColorIndex},
            wavesSettings : {wavesBackgroundSettings, setWavesBackgroundSettings, wavesFormSettings, updateWavesColorIndex},
            letterGlitchSettings : {letterGlitchBackgroundSettings, setLetterGlitchBackgroundSettings, updateLetterGlitchIndex, letterGlitchFormSettings},
            squaresSettings : {squareBackgroundSettings, setSquareBackgroundSettings, squaresFormSettings}
        }}>
            <div className="fixed inset-0 -z-10 relative">
                { background === 'aurora' &&
                    <div>
                        <div className='-mb-[150px]'>
                            <Aurora
                            colorStops={auroraBackgroundSettings.colorStops}
                            blend={auroraBackgroundSettings.blend}
                            amplitude={auroraBackgroundSettings.amplitude}
                            speed={auroraBackgroundSettings.speed}
                            />              
                        </div>
                    </div>
                }
                { background === 'veil' && 
                    <div className="z-0"
                        style={{
                        position: 'fixed', 
                        width: '100%',
                        height: '100vh'  
                        }}>
                        <div style={{ width: '100%', height: '100vh', position: 'fixed' }}>
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
                {background === 'lightning' && 
                    <div className="z-0"
                        style={{
                        position: 'fixed', 
                        width: '100%',
                        height: '100%'  
                        }}>
                  
                    <div style={{ width: '100%', height: '100vh', position: 'fixed' }}>
                        <Lightning 
                            hue={lightningBackgroundSettings.hue} 
                            xOffset={lightningBackgroundSettings.xOffset} 
                            speed={lightningBackgroundSettings.speed} 
                            intensity={lightningBackgroundSettings.intensity} 
                            size={lightningBackgroundSettings.size} 
                        />
                    </div>
                    </div>
                }
                {background === 'faultyTerminal' &&
                    <div className="z-0"
                            style={{
                            position: 'fixed', 
                            width: '100%',
                            height: '100%'  
                            }}>
                                
                        <div style={{ width: '100%', height: '100vh', position: 'fixed' }}>
                        <FaultyTerminal
                            scale={faultyTerminalBackgroundSettings.scale}
                            gridMul={[2, 1]}
                            digitSize={faultyTerminalBackgroundSettings.digitSize}
                            timeScale={faultyTerminalBackgroundSettings.speed}
                            pause={false}
                            scanlineIntensity={faultyTerminalBackgroundSettings.scanlineIntensity}
                            glitchAmount={1}
                            flickerAmount={1}
                            noiseAmp={faultyTerminalBackgroundSettings.noiseAmplitude}
                            chromaticAberration={0}
                            dither={0}
                            curvature={faultyTerminalBackgroundSettings.curvature}
                            tint={faultyTerminalBackgroundSettings.tintColor}
                            mouseReact={faultyTerminalBackgroundSettings.mouseReact}
                            mouseStrength={faultyTerminalBackgroundSettings.mouseStrength}
                            pageLoadAnimation={faultyTerminalBackgroundSettings.pageLoadAnimation}
                            brightness={faultyTerminalBackgroundSettings.brightness}
                        />
                        </div>
                    </div>
                }
                {background === 'dotGrid' && 
                    <div className="z-0"
                            style={{
                            position: 'fixed', 
                            width: '100%',
                            height: '100%'  
                            }}>  
                        <div style={{ width: '100%', height: '100vh', position: 'fixed' }}>
                        <DotGrid
                            dotSize={dotGridBackgroundSettings.dotSize}
                            gap={dotGridBackgroundSettings.gap}
                            baseColor={dotGridBackgroundSettings.baseColor}
                            activeColor={dotGridBackgroundSettings.activeColor}
                            proximity={dotGridBackgroundSettings.proximity}
                            shockRadius={dotGridBackgroundSettings.shockRadius}
                            shockStrength={dotGridBackgroundSettings.shockStrength}
                            resistance={dotGridBackgroundSettings.resistance}
                            returnDuration={dotGridBackgroundSettings.returnDuration}
                        />
                        </div>
                    </div>
                }
                {background === 'hyperspeed' && 
                    <div className="z-0"
                     style={{
                            position: 'fixed', 
                            width: '100%',
                            height: '100%'  
                            }}
                    >  
                        {/* <div style={{ width: '100%', height: '100vh', position: 'fixed' }}> */}
                        <Hyperspeed
                            effectOptions={
                                hypserspeedBackgroundSettings
                            }
                        />
                        {/* </div> */}
                    </div>
                }
                {background === 'iridescence' && 
                    <div className="z-0"
                     style={{
                            position: 'fixed', 
                            width: '100%',
                            height: '100%'  
                            }}
                    >  
                        {/* <div style={{position: 'relative', height: '500px', overflow: 'hidden'}}> */}
                        <div style={{ width: '100%', height: '100vh', position: 'fixed' }}>
                            <Iridescence
                            color={[iridescenceBackgroundSettings.color[0],
                                iridescenceBackgroundSettings.color[1],
                                iridescenceBackgroundSettings.color[2]
                            ]}
                            mouseReact={false}
                            amplitude={iridescenceBackgroundSettings.amplitude}
                            speed={iridescenceBackgroundSettings.speed}
                            />
                        </div>
                    </div>
                } 
                {background === 'waves' &&
                    <div className="z-0"
                    style={{
                    position: 'fixed', 
                    width: '100%',
                    height: '100%'  
                    }}
                    >
                        <Waves
                        lineColor={wavesBackgroundSettings.wavesColor}
                        backgroundColor="rgba(255, 255, 255, 0.2)"
                        // backgroundColor="rgba(230, 6, 6, 1)"
                        waveSpeedX={wavesBackgroundSettings.waveSpeedX}
                        waveSpeedY={0.01}
                        waveAmpX={40}
                        waveAmpY={20}
                        friction={0.9}
                        tension={0.01}
                        maxCursorMove={0}
                        xGap={12}
                        yGap={36}
                        />
                    </div>
                }     
                {background === 'letterGlitch' &&
                    <div className="z-0"
                    style={{
                    position: 'fixed', 
                    width: '100%',
                    height: '100%'  
                    }}>
                        <LetterGlitch
                        glitchColors={[
                            letterGlitchBackgroundSettings.glitchColors[0],
                            letterGlitchBackgroundSettings.glitchColors[1],
                            letterGlitchBackgroundSettings.glitchColors[2]
                            ]}
                        glitchSpeed={letterGlitchBackgroundSettings.glitchSpeed}
                        centerVignette={letterGlitchBackgroundSettings.showCenterVignette}
                        outerVignette={letterGlitchBackgroundSettings.showOuterVignette}
                        smooth={letterGlitchBackgroundSettings.smoothAnimation}
                        />
                    </div>
                }
                {background === 'squares' &&
                    <div className="z-0"
                    style={{
                    position: 'fixed', 
                    width: '100%',
                    height: '100%'  
                    }}>
                        <Squares 
                        speed={squareBackgroundSettings.speed} 
                        squareSize={squareBackgroundSettings.squareSize}
                        direction={squareBackgroundSettings.direction} // up, down, left, right, diagonal
                        borderColor={squareBackgroundSettings.borderColor}
                        hoverFillColor={squareBackgroundSettings.hoverFillColor}
                        />  
                    </div>                
                }
            </div>
            <div>
               {children} 
            </div>
            {/* <Button onClick={()=> console.log(letterGlitchBackgroundSettings.glitchColors)}>click me pls</Button> */}
        </toggleSettingsContext.Provider>
    )
}

export const toggleBackgroundSettings = ()=> useContext(toggleSettingsContext)