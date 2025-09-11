import { Button, Select, Form, Input, ColorPicker, ConfigProvider, Slider, Switch} from "antd";
import { useEffect, useState } from "react";
import { toggleBackgroundSettings } from "components/context/BackgroundSettingsContext";
import SquaresBackground from "components/background/squares/SquaresBackground";
import AuroraBackground from "components/background/aurora/AuroraBackground";
import DarkVeilBackground from "components/background/darkVeil/DarkVeilBackground";
import GalaxyBackround from "components/background/galaxy/GalaxyBackground";
import LightningBackground from "components/background/lightning/LightningBackground";
import FaultyTerminalBackground from "components/background/faultyTerminal/FaultyTerminalBackground";
import DotGridBackground from "components/background/dotGrid/DotGridBackground";
import IridescenceBackground from "components/background/iridescence/IridescenceBackground";
import HyperspeedBackground from "components/background/hyperspeed/HyperspeedBackground"; 
import WavesBackground from "components/background/waves/WavesBackground";
import LetterGlitchBackground from "components/background/letterGlitch/LetterGlitchBackground";
import LiquidChromeBackground from "components/background/liquidChrome/LiquidChromeBackground";
import BalatroBackground from "components/background/balatro/BalatroBackground";
import PrismaticBurstBackground from "components/background/prismaticBurst/PrismaticBurstBackground";
import axios from 'axios';
import { useToggle } from "components/context/UseContext";


function SelectBackground(){
    const {background, setChosenBackground, reset, 
        prevEditedBackgrounds, getData,
        auroraSettings, veilSettings, galaxySettings, 
        lightningSettings, faultyTerminalSettings,
        dotGridSettings, hyperspeedSettings,
        iridescenceSettings, wavesSettings,
        letterGlitchSettings, squaresSettings,
        liquidChromeSettings, balatroSettings,
        prismaticBurstSettings,
    } = toggleBackgroundSettings();

    const [selectChosen, setSelectChosen] = useState('')
    const [labelColor, setLabelColor] = useState('')
    const [backgroundForm] = Form.useForm();
    const [formData, setFormData] = useState({});
    const [selectedPreset, setSelectedPreset] = useState('')
    const [selectedHasPrevData, setSelectedHasPrevData] = useState(false)
    const {setShowSwitch} = useToggle()

    const newLabel = (title) => {
        return (
            <>
                <div className="flex">
                    <div className="text-red-500 mr-[5px]">
                        NEW
                    </div>
                    <div>
                        {title}
                    </div>
                </div>            
            </>
        )
    }

    const backgroundOptions = [
        { value: 'aurora', label: 'Aurora' },
        { value: 'veil', label: 'Veil' },
        { value: 'galaxy', label: 'Galaxy' },
        { value: 'lightning', label: 'Lightning' },
        { value: 'faultyTerminal', label: 'Faulty Terminal' },
        { value: 'dotGrid', label: 'Dot Grid' },  
        { value: 'hyperspeed', label: 'Hyper Speed' },  
        { value: 'iridescence', label: 'Iridescence' },  
        { value: 'waves', label: 'Waves' },    
        { value: 'letterGlitch', label: 'Letter Glitch' }, 
        { value: 'squares', label: 'Squares' }, 
        { value: 'liquidChrome', label: 'Liquid Chrome' }, 
        { value: 'balatro', label: 'Balatro' }, 
        { value: 'prismaticBurst', label: 'Prismatic Burst' }, 
    ]




    const changeBackground = (e) => {
        setSelectChosen(e)
        setFormData({})
        if (e === 'veil'){
            setLabelColor('white')
        }else if (e === 'aurora'){
            setLabelColor('white')
        }else if (e === 'galaxy'){
            setLabelColor('white')
        }else if (e === 'iridescence'){
            setLabelColor('red')
        }     
        // getData()
        if (background != e) {
            if (prevEditedBackgrounds.includes(e)){
                setSelectedHasPrevData(true)
                getData()
            }            
        }else{
            setSelectedHasPrevData(false)
        }
    }
    
    const handleFormChange = (e) => {
        setFormData(prev => ({
            ...prev, 
            ...e
        }))
    }

    const saveChanges = async() => {
        if (Object.keys(formData).length > 0){
            if (selectChosen === 'aurora'){
                auroraSettings.setAuroraBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.speed) updates.speed = formData.speed
                    if (formData.blend) updates.blend = formData.blend
                    return {...prev, ...updates}
                })
                
                if (formData.color1){
                    auroraSettings.updateColorStopIndex(0, formData.color1)
                }
                if (formData.color2){
                    auroraSettings.updateColorStopIndex(1, formData.color2)
                }
                if (formData.color3){
                    auroraSettings.updateColorStopIndex(2, formData.color3)
                }
            }else if (selectChosen === 'veil'){
                    veilSettings.setVeilBackgroundSettings(prev => {
                        const updates = {}
                        if (formData.speed) updates.speed = formData.speed
                        if (formData.hueShift) updates.hueShift = formData.hueShift
                        if (formData.scanlineFrequency) updates.scanlineFrequency = formData.scanlineFrequency
                        if (formData.scanlineIntensity) updates.scanlineIntensity = formData.scanlineIntensity
                        if (formData.warpAmount) updates.warpAmount = formData.warpAmount
                        return {...prev, ...updates}
                    })         

            } else if (selectChosen === 'galaxy'){
                if (formData.density){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, density: formData.density}
                    })                    
                }
                if (formData.starSpeed){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, starSpeed: formData.starSpeed}
                    })                    
                }

                if (formData.hueShift){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, hueShift: formData.hueShift}
                    })                    
                }
                if (formData.speed){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, speed: formData.speed}
                    })                    
                }
                if (formData.glowIntensity){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, glowIntensity: formData.glowIntensity}
                    })                    
                }
                if (formData.saturation){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, saturation: formData.saturation}
                    })                    
                }    

                if (formData.twinkleIntensity){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, twinkleIntensity: formData.twinkleIntensity}
                    })                    
                }    

                if (formData.transparent){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, transparent: formData.transparent}
                    })                    
                }    

                if (formData.scanlineIntensity){
                    galaxySettings.setGalaxyBackgroundSettings(prev => {
                        return {...prev, scanlineIntensity: formData.scanlineIntensity}
                    })                    
                }    

            } else if (selectChosen === 'lightning'){
                if (formData.hue){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, hue: formData.hue}
                    })                    
                }

                if (formData.xOffset){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, xOffset: formData.xOffset}
                    })                    
                }

                if (formData.speed){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, speed: formData.speed}
                    })                    
                }

                if (formData.intensity){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, intensity: formData.intensity}
                    })                    
                }

                if (formData.size){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, size: formData.size}
                    })                    
                }


            } else if (selectChosen === 'faultyTerminal'){
                if (formData.tintColor){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, tintColor: formData.tintColor}
                    })                    
                }       
                
                if (formData.scale){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, scale: formData.scale}
                    })                    
                }   
                
                if (formData.digitSize){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, digitSize: formData.digitSize}
                    })                    
                }   
                
                if (formData.speed){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, speed: formData.speed}
                    })                    
                }   

                if (formData.noiseAmplitude){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, noiseAmplitude: formData.noiseAmplitude}
                    })                    
                }   
                
                if (formData.brightness){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, brightness: formData.brightness}
                    })                    
                }   

                if (formData.scanlineIntensity){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, scanlineIntensity: formData.scanlineIntensity}
                    })                    
                }   

                if (formData.curvature){
                    faultyTerminalSettings.setFaultyTerminalBackgroundSettings(prev => {
                        return {...prev, curvature: formData.curvature}
                    })                    
                }   


                if (formData.mouseStrength){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, mouseStrength: formData.mouseStrength}
                    })                    
                }   

                if (formData.mouseReact){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, mouseReact: formData.mouseReact}
                    })                    
                }   

                if (formData.mouseStrength){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, mouseStrength: formData.mouseStrength}
                    })                    
                }   

                if (formData.pageLoadAnimation){
                    lightningSettings.setLightningBackgroundSettings(prev => {
                        return {...prev, pageLoadAnimation: formData.pageLoadAnimation}
                    })                    
                }   
            } else if (selectChosen === 'dotGrid'){
                dotGridSettings.setDotGridBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.baseColor) updates.baseColor = formData.baseColor
                    if (formData.activeColor) updates.activeColor = formData.activeColor
                    if (formData.dotSize) updates.dotSize = formData.dotSize
                    if (formData.gap) updates.gap = formData.gap
                    if (formData.proximity) updates.proximity = formData.proximity
                    if (formData.shockRadius) updates.shockRadius = formData.shockRadius
                    if (formData.shockStrength) updates.shockStrength = formData.shockStrength
                    if (formData.resistance) updates.resistance = formData.resistance
                    if (formData.returnDuration) updates.returnDuration = formData.returnDuration
                    return {...prev, ...updates}
                })
            } else if (selectChosen === 'hyperspeed'){
                hyperspeedSettings.changeHyperspeedSettings(selectedPreset)
            } else if (selectChosen === 'iridescence'){
                iridescenceSettings.setIridescenceBackgroundSettings(prev => {
                    if (formData.red) iridescenceSettings.updateIridescenceColorIndex(0, formData.red) 
                    if (formData.blue) iridescenceSettings.updateIridescenceColorIndex(2, formData.blue) 
                    if (formData.green) iridescenceSettings.updateIridescenceColorIndex(1, formData.green)   
                    return {...prev}
                })


                iridescenceSettings.setIridescenceBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.speed) updates.speed = formData.speed
                    return {...prev, ...updates}
                })

            } else if (selectChosen === 'waves'){
                wavesSettings.setWavesBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.waveSpeedX) updates.waveSpeedX = formData.waveSpeedX
                    if (formData.wavesColor) updates.wavesColor = formData.wavesColor
                    return {...prev, ...updates}
                })                
            } else if (selectChosen === 'letterGlitch'){
                letterGlitchSettings.setLetterGlitchBackgroundSettings(prev => {
                    const updates = {}
                    updates.glitchColors = prev.glitchColors
                    if (formData.glitchSpeed) updates.glitchSpeed = formData.glitchSpeed
                    return {...prev, ...updates}
                })

                if (formData.glitchColor1){
                    letterGlitchSettings.updateLetterGlitchIndex(0, formData.glitchColor1)
                }
                if (formData.glitchColor2){
                    letterGlitchSettings.updateLetterGlitchIndex(1, formData.glitchColor2)
                }
                
                if (formData.glitchColor3){
                    letterGlitchSettings.updateLetterGlitchIndex(2, formData.glitchColor3)
                }        
            } else if (selectChosen === 'squares'){
                squaresSettings.setSquareBackgroundSettings(prev => {
                const updates = {}
                if (formData.direction) updates.direction = formData.direction
                if (formData.squareSize) updates.squareSize = formData.squareSize
                if (formData.speed) updates.speed = formData.speed
                if (formData.borderColor) updates.borderColor = formData.borderColor
                return {...prev, ...updates}
            })  
            } else if (selectChosen === 'liquidChrome'){
                liquidChromeSettings.setLiquidChromeBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.red) updates.red = formData.red
                    if (formData.green) updates.green = formData.green
                    if (formData.blue) updates.blue = formData.blue
                    if (formData.speed) updates.speed = formData.speed
                    if (formData.amplitude) updates.amplitude = formData.amplitude
                    return {...prev, ...updates}
                })
            } else if (selectChosen === 'balatro'){
                balatroSettings.setBalatroBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.pixelFilter) updates.pixelFilter = formData.pixelFilter
                    if (formData.color1) updates.color1 = formData.color1
                    if (formData.color2) updates.color2 = formData.color2
                    if (formData.color3) updates.color3 = formData.color3
                    return {...prev, ...updates}
                })     
            } else if (selectChosen === 'prismaticBurst'){
                prismaticBurstSettings.setPrismaticBurstBackgroundSettings(prev => {
                    const updates = {}
                    if (formData.intensity) updates.intensity = formData.intensity
                    if (formData.speed) updates.speed = formData.speed
                    if (formData.distort) updates.distort = formData.distort
                    if (formData.rayCount) updates.rayCount = formData.rayCount
                    return {...prev, ...updates}
                })     

                if (formData.color1){
                    prismaticBurstSettings.updatePrismaticBurstColorIndex(0, formData.color1)
                }
                if (formData.color2){
                    prismaticBurstSettings.updatePrismaticBurstColorIndex(1, formData.color2)
                }
                if (formData.color3){
                    prismaticBurstSettings.updatePrismaticBurstColorIndex(2, formData.color3)
                }

            }
        }
        setChosenBackground(selectChosen)
        await axios.post('http://localhost:8080/savebackgroundsettings', formData, {params : {'background' : selectChosen}})
    }

    const handleDefaultSettings = () => {
        reset(backgroundForm)
        setFormData({})
    }


    const loadPrevBackgroundSettings = async () => {
        setChosenBackground(selectChosen)
        await axios.post('http://localhost:8080/savebackgroundsettings', {params : {'background' : selectChosen}})
        setSelectedHasPrevData(false)
    }   

    useEffect(()=> {
        setShowSwitch(true)

        return () =>{
            setShowSwitch(false)
        }
    }, [])

    return (
        <>
            <div className="-mt-[30px]">
                {/* {!selectChosen && 
                    <div className="flex absolute mt-[6px] ml-[200px] text-red-500">
                        NEW
                    </div>                
                } */}

                <Select
                    defaultValue=""
                    style={{ width: 220 }}
                    value={selectChosen}
                    onChange={(e) => changeBackground(e)}
                    options={backgroundOptions}
                    />


                <ConfigProvider
                    theme={{
                        components: {
                        Form: {
                            labelColor : 'white',
                        },

                        Slider: {
                            railBg: "rgba(255,255,255, 0.9)",
                            railHoverBg: "rgba(255,255,255, 0.9)",
                        },
                    }}}           
                >
                    <div className="flex justify-center items-center  mt-[px]">
                        <Form
                        form={backgroundForm}
                        onValuesChange={(e, a)=>handleFormChange(e, a)}
                        >
                            {selectChosen === 'aurora' &&
                                <AuroraBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            } 
                            {selectChosen === 'veil' &&
                                <DarkVeilBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }      
                            {selectChosen === 'galaxy' &&
                                <GalaxyBackround handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }  
                            {selectChosen === 'lightning' &&
                                <LightningBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'faultyTerminal' &&
                                <FaultyTerminalBackground formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'dotGrid' && 
                                <DotGridBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'hyperspeed' &&
                                <HyperspeedBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData} setSelectedPreset={setSelectedPreset}/>
                            }
                            {selectChosen === 'iridescence' &&
                                <IridescenceBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }                            
                            {selectChosen === 'waves' &&
                                <WavesBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            } 
                            {selectChosen === 'letterGlitch' &&
                                <LetterGlitchBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'squares' &&
                                <SquaresBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'liquidChrome' &&
                                <LiquidChromeBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'balatro' &&
                                <BalatroBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen === 'prismaticBurst' &&
                                <PrismaticBurstBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }
                            {selectChosen &&
                                <Form.Item>
                                    {/* {!selectedHasPrevData &&
                                        
                                    } */}
                                    
                                    {selectedHasPrevData  
                                        ? <Button type="primary" onClick={()=>loadPrevBackgroundSettings()}>Load prev settings</Button>
                                        : <>
                                            <Button type="primary" onClick={()=>saveChanges()}>Save</Button>
                                            { selectChosen == background &&
                                            <Button type="primary" onClick={()=>handleDefaultSettings()}>Revert to default</Button>
                                            }
                                            
                                        </>
                                    }
                                </Form.Item>                                         
                            }
                        </Form>
                    </div>    
                </ConfigProvider>
            </div>
        </>
    )
}

export default SelectBackground;