import { Button, Select, Form, Input, ColorPicker, ConfigProvider, Slider, Switch} from "antd";
import { useState } from "react";
import { toggleBackgroundSettings } from "../context/BackgroundSettingsContext";
import { hyperspeedPresets } from "../background/hyperspeedPresets/HyperspeedPresets";
import { Color } from '@rc-component/color-picker';
import SquaresBackground from "../background/squares/SquaresBackground";
import AuroraBackground from "../background/aurora/AuroraBackground";
import DarkVeilBackground from "../background/darkVeil/DarkVeilBackground";

function SelectBackground(){
    const {background, setChosenBackground, reset,
        auroraSettings, veilSettings, galaxySettings, 
        lightningSettings, faultyTerminalSettings,
        dotGridSettings, hyperspeedSettings,
        iridescenceSettings, wavesSettings,
        letterGlitchSettings
    } = toggleBackgroundSettings();

    const [selectChosen, setSelectChosen] = useState('')
    const [labelColor, setLabelColor] = useState('')
    const [backgroundForm] = Form.useForm();
    const [formData, setFormData] = useState({});
    const [selectedPreset, setSelectedPreset] = useState('')


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
    ]

    const hyperspeedPresetOptions = [
        { value: 'Default', label: 'Default' },
        { value: 'cyberpunk', label: 'CyberPunk' },
        { value: 'akira', label: 'Akira' },
        { value: 'golden', label: 'Golden' },
        { value: 'split', label: 'Split' },
        { value: 'highway', label: 'Highway' },
        { value: 'other', label: 'other' },
    ]

    const changeBackground = (e) => {
        // setSelectedItem(e)
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
                    // if (formData.blend){
                    //     auroraSettings.setAuroraBackgroundSettings(prev => {
                    //         return {...prev, blend : formData.blend}
                    //     })
                    // }

                    // if (formData.speed){
                    //     auroraSettings.setAuroraBackgroundSettings(prev => {
                    //         return {...prev, speed : formData.speed}
                    //     })
                    // }


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
                    if (formData.blue) iridescenceSettings.updateIridescenceColorIndex(1, formData.blue) 
                    if (formData.green) iridescenceSettings.updateIridescenceColorIndex(2, formData.green)   
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

                // console.log(letterGlitchSettings.letterGlitchBackgroundSettings.glitchColors)
            }
        }
        setChosenBackground(selectChosen)
        // await axios.post('http://localhost:8080/savebackgroundsettings', formData, {params : {'background' : selectChosen}})
    }

    const handleDefaultSettings = () => {
        reset(backgroundForm)
        setFormData({})
    }


    
    return (
        <>
            <div className="-mt-[30px]">
                <Select
                    defaultValue=""
                    style={{ width: 120 }}
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
                                // <div className="mt-[20px]">
                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="blend"
                                //         initialValue={auroraSettings.auroraBackgroundSettings.blend} 
                                //         label={'Blend'}>
                                //         <Slider 
                                //         min={auroraSettings.auroraFormSettings.blend.min}
                                //         max={auroraSettings.auroraFormSettings.blend.max}
                                //         step={auroraSettings.auroraFormSettings.blend.step} 
                                //         />
                                //     </Form.Item> 

                                //     {/* <Form.Item 
                                //         style={{width: 300 }}
                                //         name="amplitude"
                                //         label={'Amplitude'}>
                                //         <Slider 
                                //         min={0}
                                //         max={2}
                                //         initialValues={1.0} 
                                //         step={0.1} 
                                //         />
                                //     </Form.Item>    */}

                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="speed"
                                //         initialValue={auroraSettings.auroraBackgroundSettings.speed} 
                                //         label={'Speed'}>
                                //         <Slider 
                                //         min={auroraSettings.auroraFormSettings.speed.min}
                                //         max={auroraSettings.auroraFormSettings.speed.max}
                                //         step={auroraSettings.auroraFormSettings.speed.step} 
                                //         />
                                //     </Form.Item>                           


                                //     <div className="flex justify-center mr-[60px]">
                                //         <Form.Item
                                //         name="colorPicker1"
                                //         label="Color 1"    
                                //         initialValue={auroraSettings.auroraBackgroundSettings.colorStops[0]}
                                //         >   
                                //                 <ColorPicker 
                                //                 allowClear
                                //                 onChange={c => {
                                //                     if (c.cleared){
                                //                         delete formData['color1']
                                //                     }else{
                                //                     handleFormChange({color1 : c.toHexString()}); 
                                //                     }                                                
                                //                 }}                                            
                                //                 />
                                        
                                //         </Form.Item>
                                //     </div>

                                //     <div className="flex justify-center mr-[60px]">
                                //         <Form.Item
                                //         name="colorPicker2"
                                //         label="Color 2" 
                                //         initialValue={auroraSettings.auroraBackgroundSettings.colorStops[1]}   
                                //         >
                                //             <ColorPicker
                                //             allowClear
                                //             onChange={c => {
                                //                 if (c.cleared){
                                //                     delete formData['color2']
                                //                 }else{
                                //                     handleFormChange({color2 : c.toHexString()});   
                                //                 }
                                                
                                //             }}                                           
                                //             />
                                //         </Form.Item>
                                //     </div>


                                //     <div className="flex justify-center mr-[60px]">
                                //         <Form.Item
                                //         name="colorPicker3"
                                //         label="Color 3" 
                                //         initialValue={auroraSettings.auroraBackgroundSettings.colorStops[2]}
                                //         >
                                //                 <ColorPicker 
                                //                 allowClear
                                //                 onChange={c => {
                                //                     if (c.cleared){
                                //                         delete formData['color3']
                                //                     }else{
                                //                         handleFormChange({color3 : c.toHexString()});   
                                //                     }
                                //                 }}
                                //                 />
                                            
                                //         </Form.Item>  
                                //     </div>
                                // </div> 

                                <AuroraBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            } 
                            {selectChosen === 'veil' &&
                                // <div className="mt-[20px]">

                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="speed"
                                //         label={'Speed'}
                                //         initialValue={veilSettings.veilBackgroundSettings.speed}
                                //         >
                                //         <Slider 
                                //         min={veilSettings.veilFormSettings.speed.min}
                                //         max={veilSettings.veilFormSettings.speed.max}
                                //         step={veilSettings.veilFormSettings.speed.step} 
                                //         />
                                //     </Form.Item> 

                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="hueShift"
                                //         label={'Hue Shift'}
                                //         initialValue={veilSettings.veilBackgroundSettings.hueShift}
                                //         >
                                //         <Slider 
                                //         min={veilSettings.veilFormSettings.hueShift.min}
                                //         max={veilSettings.veilFormSettings.hueShift.max}
                                //         step={veilSettings.veilFormSettings.hueShift.step} 
                                //         />
                                //     </Form.Item>   
                    

                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="scanlineFrequency"
                                //         label={'Scanline Frequency'}
                                //         initialValue={veilSettings.veilBackgroundSettings.scanlineFrequency}
                                //         >
                                //         <Slider 
                                //         min={veilSettings.veilFormSettings.scanlineFrequency.min}
                                //         max={veilSettings.veilFormSettings.scanlineFrequency.max}
                                //         step={veilSettings.veilFormSettings.scanlineFrequency.step} 
                                //         />
                                //     </Form.Item> 

                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="scanlineIntensity"
                                //         label={'Scanline Intensity'}
                                //         initialValue={veilSettings.veilBackgroundSettings.scanlineIntensity}
                                //         >
                                //         <Slider 
                                //         min={veilSettings.veilFormSettings.scanlineIntensity.min}
                                //         max={veilSettings.veilFormSettings.scanlineIntensity.max}
                                //         step={veilSettings.veilFormSettings.scanlineIntensity.step} 
                                //         />
                                //     </Form.Item>   

                                //     <Form.Item 
                                //         style={{width: 300 }}
                                //         name="warpAmount"
                                //         label={'Warp Amount'}
                                //         initialValue={veilSettings.veilBackgroundSettings.warpAmount}
                                //         >
                                //         <Slider 
                                //         min={veilSettings.veilFormSettings.warpAmount.min}
                                //         max={veilSettings.veilFormSettings.warpAmount.max}
                                //         step={veilSettings.veilFormSettings.warpAmount.step} 
                                //         />
                                //     </Form.Item>        
                                // </div> 
                                <DarkVeilBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }      
                            {selectChosen === 'galaxy' &&
                                <div className="mt-[20px]">

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="density"
                                        label={'Density'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.density}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.starSpeed.min}
                                        max={galaxySettings.galaxyFormSettings.starSpeed.max}
                                        step={galaxySettings.galaxyFormSettings.starSpeed.step}
                                        />
                                    </Form.Item> 

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="glowIntensity"
                                        label={'Glow Intensity'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.glowIntensity}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.glowIntensity.min}
                                        max={galaxySettings.galaxyFormSettings.glowIntensity.max}
                                        step={galaxySettings.galaxyFormSettings.glowIntensity.step}
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="saturation"
                                        label={'Saturation'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.saturation}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.saturation.min}
                                        max={galaxySettings.galaxyFormSettings.saturation.max}
                                        step={galaxySettings.galaxyFormSettings.saturation.step}
                                        />
                                    </Form.Item>                           

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="hueShift"
                                        label={'Hue Shift'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.hueShift}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.hueShift.min}
                                        max={galaxySettings.galaxyFormSettings.hueShift.max}
                                        step={galaxySettings.galaxyFormSettings.hueShift.step}
                                        />
                                    </Form.Item>                           

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="twinkleIntensity"
                                        label={'Twinkle Intensity'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.twinkleIntensity}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.twinkleIntensity.min}
                                        max={galaxySettings.galaxyFormSettings.twinkleIntensity.max}
                                        step={galaxySettings.galaxyFormSettings.twinkleIntensity.step}
                                        />
                                    </Form.Item>   

                                    <Form.Item
                                        style={{width: 300 }}
                                        name="transparent"
                                        label={'Transparent'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.transparent}
                                        >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="starSpeed"
                                        label={'Star Speed'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.starSpeed}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.starSpeed.min}
                                        max={galaxySettings.galaxyFormSettings.starSpeed.max}
                                        step={galaxySettings.galaxyFormSettings.starSpeed.step}
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="speed"
                                        label={'Animation Speed'}
                                        initialValue={galaxySettings.galaxyBackgroundSettings.speed}
                                        >
                                        <Slider 
                                        min={galaxySettings.galaxyFormSettings.speed.min}
                                        max={galaxySettings.galaxyFormSettings.speed.max}
                                        step={galaxySettings.galaxyFormSettings.speed.step} 
                                        />
                                    </Form.Item>   
                                </div> 
                            }  
                            {selectChosen === 'lightning' &&
                                <div className="mt-[20px]">
                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="hue"
                                        label={'Hue'}
                                        initialValue={lightningSettings.lightningBackgroundSettings.hue}
                                        >
                                        <Slider 
                                        min={lightningSettings.lightningFormSettings.hue.min}
                                        max={lightningSettings.lightningFormSettings.hue.max}
                                        step={lightningSettings.lightningFormSettings.hue.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="xOffset"
                                        label={'X Offset'}
                                        initialValue={lightningSettings.lightningBackgroundSettings.xOffset}
                                        >
                                        <Slider 
                                        min={lightningSettings.lightningFormSettings.xOffset.min}
                                        max={lightningSettings.lightningFormSettings.xOffset.max}
                                        step={lightningSettings.lightningFormSettings.xOffset.step} 
                                        />
                                    </Form.Item>   


                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="speed"
                                        label={'Speed'}
                                        iinitialValue={lightningSettings.lightningBackgroundSettings.speed}
                                        >
                                        <Slider 
                                        min={lightningSettings.lightningFormSettings.speed.min}
                                        max={lightningSettings.lightningFormSettings.speed.max}
                                        step={lightningSettings.lightningFormSettings.speed.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="intensity"
                                        label={'Intensity'}
                                        initialValue={lightningSettings.lightningBackgroundSettings.intensity}
                                        >
                                        <Slider 
                                        min={lightningSettings.lightningFormSettings.intensity.min}
                                        max={lightningSettings.lightningFormSettings.intensity.max}
                                        step={lightningSettings.lightningFormSettings.intensity.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="size"
                                        label={'Size'}
                                        initialValue={lightningSettings.lightningBackgroundSettings.size}
                                        >
                                        <Slider 
                                        min={lightningSettings.lightningFormSettings.size.min}
                                        max={lightningSettings.lightningFormSettings.size.max}
                                        step={lightningSettings.lightningFormSettings.size.step} 
                                        />
                                    </Form.Item>   

                                </div>
                            }
                            {selectChosen === 'faultyTerminal' &&
                                <div className="mt-[20px]">
                                    <div className="mr-[60px]">
                                        <Form.Item
                                        name="tintColor"
                                        label="Tint Color"    
                                        // initialValue={auroraSettings.auroraBackgroundSettings.colorStops[0]}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.tintColor}
                                        >
                                            <ColorPicker 
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['tintColor']
                                                }else{
                                                handleFormChange({tintColor : c.toHexString()}); 
                                                }                                               
                                            }}                                            
                                            /> 
                                        </Form.Item>
                                    </div>
                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="scale"
                                        label={'Scale'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.scale}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.scale.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.scale.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.scale.step} 
                                        />
                                    </Form.Item>   


                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="digitSize"
                                        label={'Digit Size'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.digitSize}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.digitSize.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.digitSize.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.digitSize.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="noiseAmplitude"
                                        label={'Noise Amplitude'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.noiseAmplitude}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.noiseAmplitude.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.noiseAmplitude.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.noiseAmplitude.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="brightness"
                                        label={'Brightness'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.brightness}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.brightness.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.brightness.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.brightness.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="scanlineIntensity"
                                        label={'Scanline Intensity'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.scanlineIntensity}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.scanlineIntensity.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.scanlineIntensity.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.scanlineIntensity.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="curvature"
                                        label={'Curvature'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.curvature}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.curvature.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.curvature.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.curvature.step} 
                                        />
                                    </Form.Item>   


                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="mouseStrength"
                                        label={'Mouse Strength'}
                                        initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.mouseStrength}
                                        >
                                        <Slider 
                                        min={faultyTerminalSettings.faultyTerminalFormSettings.mouseStrength.min}
                                        max={faultyTerminalSettings.faultyTerminalFormSettings.mouseStrength.max}
                                        step={faultyTerminalSettings.faultyTerminalFormSettings.mouseStrength.step} 
                                        />
                                    </Form.Item>   

                                    <Form.Item
                                        style={{width: 300 }}
                                        name="mouseReact"
                                        label={'Mouse React'}
                                        >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item
                                        style={{width: 300 }}
                                        name="pageLoadAnimation"
                                        label={'Page Load Animation'}
                                        >
                                        <Switch />
                                    </Form.Item>                                   

                                </div>                            
                            }
                            {selectChosen === 'dotGrid' && 
                                <div className="mt-[20px]">
                                    <div className="">
                                        <Form.Item
                                        name="baseColor"
                                        label="Base Color"
                                        valuePropName="value"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.baseColor} 
                                        >    
                                                <ColorPicker
                                                allowClear
                                                onChange={c => {
                                                    if (c.cleared){
                                                        delete formData['baseColor']
                                                    }else{
                                                        handleFormChange({baseColor : c.toHexString()});   
                                                    }
                                                }}
                                                />
                                        </Form.Item>  
                                    </div>


                                    <div className=" ">
                                        <Form.Item
                                        name="activeColor"
                                        label="Active Color" 
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.activeColor} 
                                        >       
                                                <ColorPicker 
                                                allowClear
                                                onChange={c => {
                                                    if (c.cleared){
                                                        delete formData['activeColor']
                                                    }else{
                                                        handleFormChange({activeColor : c.toHexString()});   
                                                    }
                                                }}
                                                />
                                        
                                        </Form.Item>  
                                    </div>

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="dotSize"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.dotSize} 
                                        label={'Dot Size'}>
                                        <Slider 
                                        min={0}
                                        max={50}
                                        step={1} 
                                        />
                                    </Form.Item> 

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="gap"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.gap} 
                                        label={'Gap'}>
                                        <Slider 
                                        min={0}
                                        max={100}
                                        step={1} 
                                        />
                                    </Form.Item>                           

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="proximity"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.proximity} 
                                        label={'Proximity'}>
                                        <Slider 
                                        min={0}
                                        max={500}
                                        step={10} 
                                        />
                                    </Form.Item>     

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="shockRadius"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.shockRadius} 
                                        label={'Shock Radius'}>
                                        <Slider 
                                        min={0}
                                        max={500}
                                        step={10} 
                                        />
                                    </Form.Item>     

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="shockStrength"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.shockStrength} 
                                        label={'Shock Strength'}>
                                        <Slider 
                                        min={0}
                                        max={20}
                                        step={1} 
                                        />
                                    </Form.Item>     

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="resistance"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.resistance} 
                                        label={'Resistance'}>
                                        <Slider 
                                        min={100}
                                        max={2000}
                                        step={50} 
                                        />
                                    </Form.Item>     


                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="returnDuration"
                                        initialValue={dotGridSettings.dotGridBackgroundSettings.returnDuration} 
                                        label={'Return Duration'}>
                                        <Slider 
                                        min={0.1}
                                        max={5}
                                        step={0.1} 
                                        />
                                    </Form.Item>     
                                </div>                             
                            }
                            {selectChosen === 'hyperspeed' &&
                                <div className="mt-[20px]">
                                    <Form.Item
                                        name="presets"
                                        label="presets"
                                        initialValue={'Default'}
                                    >
                                         <Select
                                            style={{ width: 120 }}
                                            onChange={(e) => setSelectedPreset(e)}
                                            options={hyperspeedPresetOptions}
                                            />
                                    </Form.Item>

                                </div> 
                            }
                            {selectChosen === 'iridescence' &&
                                <div className="mt-[20px]">
                                    <div className="columns-3 gap-[20px] w-[700px]">
                                        <Form.Item
                                            name="red"
                                            label="Red"
                                            initialValue={iridescenceSettings.iridescenceBackgroundSettings.color[0]} 
                                        >
                                            <Slider 
                                            min={iridescenceSettings.iridescenceFormSettings.red.min}
                                            max={iridescenceSettings.iridescenceFormSettings.red.max}
                                            step={iridescenceSettings.iridescenceFormSettings.red.step} 
                                            />
                                        </Form.Item> 

                                        <Form.Item
                                            name="green"
                                            label="Green"
                                            initialValue={iridescenceSettings.iridescenceBackgroundSettings.color[1]} 
                                        >
                                            <Slider 
                                            min={iridescenceSettings.iridescenceFormSettings.green.min}
                                            max={iridescenceSettings.iridescenceFormSettings.green.max}
                                            step={iridescenceSettings.iridescenceFormSettings.green.step} 
                                            />                             
                                        </Form.Item>   
                                        
                                        <Form.Item
                                            name="blue"
                                            label="Blue"
                                            initialValue={iridescenceSettings.iridescenceBackgroundSettings.color[2]} 
                                        >
                                            <Slider 
                                            min={iridescenceSettings.iridescenceFormSettings.blue.min}
                                            max={iridescenceSettings.iridescenceFormSettings.blue.max}
                                            step={iridescenceSettings.iridescenceFormSettings.blue.step} 
                                            />
                                        </Form.Item>                                                                    
                                    </div>
                                <div className="mx-auto w-[250px]">
                                   <Form.Item
                                    name="speed"
                                    label="Speed"
                                    initialValue={iridescenceSettings.iridescenceBackgroundSettings.speed} 
                                   >    
                                        <Slider 
                                        min={iridescenceSettings.iridescenceFormSettings.speed.min}
                                        max={iridescenceSettings.iridescenceFormSettings.speed.max}
                                        step={iridescenceSettings.iridescenceFormSettings.speed.step} 
                                        />
                                    </Form.Item>                                       
                                </div>
     
                                </div>
                            }                            
                            {selectChosen === 'waves' &&
                                <div className="mt-[20px]">
                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="waveSpeedX"
                                        initialValue={wavesSettings.wavesBackgroundSettings.waveSpeedX} 
                                        label={'Wave Speed X'}>
                                        <Slider 
                                        min={wavesSettings.wavesFormSettings.waveSpeedX.min}
                                        max={wavesSettings.wavesFormSettings.waveSpeedX.max}
                                        step={wavesSettings.wavesFormSettings.waveSpeedX.step} 
                                        />
                                    </Form.Item> 
                         


                                    <div className="flex justify-center mr-[60px]">
                                        <Form.Item
                                        name="wavesColor"
                                        label="Waves Color"    
                                        initialValue={wavesSettings.wavesBackgroundSettings.wavesColor}
                                        >   
                                                <ColorPicker 
                                                allowClear
                                                onChange={c => {
                                                    if (c.cleared){
                                                        delete formData['wavesColor']
                                                    }else{
                                                    handleFormChange({wavesColor : c.toHexString()}); 
                                                    }                                                
                                                }}                                            
                                                />
                                        
                                        </Form.Item>
                                    </div>
                                </div> 
                            } 
                            {selectChosen === 'letterGlitch' &&
                                <div className="mt-[20px]">
                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="glitchSpeed"
                                        initialValue={letterGlitchSettings.letterGlitchBackgroundSettings.glitchSpeed} 
                                        label={'Glitch Speed'}>
                                        <Slider 
                                        min={letterGlitchSettings.letterGlitchFormSettings.glitchSpeed.min}
                                        max={letterGlitchSettings.letterGlitchFormSettings.glitchSpeed.max}
                                        step={letterGlitchSettings.letterGlitchFormSettings.glitchSpeed.step} 
                                        />
                                    </Form.Item> 


                                    <div className="flex justify-center mr-[60px]">
                                        <Form.Item
                                        name="glitchColor1"
                                        label="Glitch color 1"    
                                        initialValue={letterGlitchSettings.letterGlitchBackgroundSettings.glitchColors[0]}
                                        >   
                                            <ColorPicker 
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['glitchColor1']
                                                }else{
                                                handleFormChange({glitchColor1 : c.toHexString()}); 
                                                }                                                
                                            }}                                            
                                            />
                                        
                                        </Form.Item>
                                    </div>

                                    <div className="flex justify-center mr-[60px]">
                                        <Form.Item
                                        name="glitchColor2"
                                        label="Glitch color 2" 
                                        initialValue={letterGlitchSettings.letterGlitchBackgroundSettings.glitchColors[1]}
                                        >
                                            <ColorPicker
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['glitchColor2']
                                                }else{
                                                    handleFormChange({glitchColor2 : c.toHexString()});   
                                                }
                                                
                                            }}                                           
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="flex justify-center mr-[60px]">
                                        <Form.Item
                                        name="glitchColor3"
                                        label="Glitch color 3" 
                                        initialValue={letterGlitchSettings.letterGlitchBackgroundSettings.glitchColors[2]}
                                        >
                                            <ColorPicker
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['glitchColor3']
                                                }else{
                                                    handleFormChange({glitchColor3 : c.toHexString()});   
                                                }
                                                
                                            }}                                           
                                            />
                                        </Form.Item>
                                    </div>

                                </div>
                            }
                            {selectChosen === 'squares' &&
                                <SquaresBackground handleFormChange={handleFormChange} formData={formData} backgroundForm={backgroundForm} setFormData={setFormData}/>
                            }








                            {selectChosen &&
                                <Form.Item>
                                    <Button type="primary" onClick={()=>saveChanges()}>OLD save</Button>
                                    <Button type="primary" onClick={()=>handleDefaultSettings()}>OLD revert to default</Button>
                                </Form.Item>        
                            }


                        </Form>
                    </div>    
                </ConfigProvider>

                {/* <Button onClick={()=> console.log(formData)} >Click me</Button> */}

            </div>
        </>
    )
}

export default SelectBackground;