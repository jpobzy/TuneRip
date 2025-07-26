import { Button, Select, Form, Input, ColorPicker, ConfigProvider, Slider, Switch} from "antd";
import { useState } from "react";
import { toggleBackgroundSettings } from "../context/BackgroundSettingsContext";
function SelectBackground(){
    const {background, setChosenBackground, auroraSettings, veilSettings, galaxySettings} = toggleBackgroundSettings();

    const [selectChosen, setSelectChosen] = useState('')
    const [labelColor, setLabelColor] = useState('')
    const [backgroundForm] = Form.useForm();
    const [formData, setFormData] = useState({});


    const backgroundOptions = [
        { value: 'aurora', label: 'aurora' },
        { value: 'veil', label: 'veil' },
        { value: 'galaxy', label: 'galaxy' },
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
        }    
    }
    
    const handleFormChange = (e) => {
        setFormData(prev => ({
            // const newData ={
                ...prev, 
                ...e
            // }
            // return newData
        }))
        // if (changeBackground === 'aurora'){
            
        // }
    }

    const saveChanges = () => {
        if (Object.keys(formData).length > 0){
            if (selectChosen === 'aurora'){
                // if (Object.keys(formData).length > 0){
                    if (formData.blend){
                        auroraSettings.setAuroraBackgroundSettings(prev => {
                            return {...prev, blend : formData.blend}
                        })
                    }

                    if (formData.speed){
                        auroraSettings.setAuroraBackgroundSettings(prev => {
                            return {...prev, speed : formData.speed}
                        })
                    }

                    if (formData.color1){
                        auroraSettings.updateColorStopIndex(0, formData.color1)
                    }
                    if (formData.color2){
                        auroraSettings.updateColorStopIndex(1, formData.color2)
                    }
                    if (formData.color3){
                        auroraSettings.updateColorStopIndex(2, formData.color3)
                    }
                // }
            }else if (selectChosen === 'veil'){
                // if (Object.keys(formData).length > 0){
                    // console.log(formData)
                    if (formData.speed){
                        veilSettings.setVeilBackgroundSettings(prev => {
                            return {...prev, speed: formData.speed}
                        })                    
                    }
                    if (formData.hueShift){
                        veilSettings.setVeilBackgroundSettings(prev => {
                            return {...prev, hueShift: formData.hueShift}
                        })                    
                    }

                    if (formData.scanlineFrequency){
                        veilSettings.setVeilBackgroundSettings(prev => {
                            return {...prev, scanlineFrequency: formData.scanlineFrequency}
                        })                    
                    }
                    if (formData.scanlineIntensity){
                        veilSettings.setVeilBackgroundSettings(prev => {
                            return {...prev, scanlineIntensity: formData.scanlineIntensity}
                        })                    
                    }            
                // }
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

            }
        }

        setChosenBackground(selectChosen)
    }

    const handleDefaultSettings = () => {
        if (selectChosen === 'aurora'){
            auroraSettings.resetAllAuroraSettings()
        }else if (selectChosen === 'veil'){
            veilSettings.resetVeilSettings()
        }else if (selectChosen === 'galaxy'){

        }
    }


    
    return (
        <>
            <div>
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
                            // labelRequiredMarkColor: '#ff4d4f'
                        },
                        Slider: {
                            railBg: "rgba(255,255,255, 0.9)",
                            railHoverBg: "rgba(255,255,255, 0.9)",
                        },
                    }}}           
                >
                    <div className="flex justify-center items-center min-h-screen ">
                        <Form
                        onValuesChange={(e, a)=>handleFormChange(e, a)}
                        >
                            {selectChosen === 'aurora' &&
                                <div className="-mt-[425px]">
                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="blend"
                                        initialValue={0.5} 
                                        label={'Blend'}>
                                        <Slider 
                                        min={0}
                                        max={2}
                                        step={0.1} 
                                        />
                                    </Form.Item> 

                                    {/* <Form.Item 
                                        style={{width: 300 }}
                                        name="amplitude"
                                        label={'Amplitude'}>
                                        <Slider 
                                        min={0}
                                        max={2}
                                        initialValues={1.0} 
                                        step={0.1} 
                                        />
                                    </Form.Item>    */}

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="speed"
                                        initialValue={0.5} 
                                        label={'Speed'}>
                                        <Slider 
                                        min={0}
                                        max={2}
                                        
                                        step={0.1} 
                                        />
                                    </Form.Item>                           

                                     <Form.Item
                                    name="color-picker1"
                                    label="Color 1"    
                                    >
                                        <div className="flex justify-center mr-[60px]">
                                            <ColorPicker 
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['color1']
                                                }else{
                                                   handleFormChange({color1 : c.toHexString()}); 
                                                }                                                
                                            }}                                            
                                            />
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                    name="color-picker2"
                                    label="Color 2"    
                                    >
                                        <div className="flex justify-center mr-[60px]">
                                            <ColorPicker
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['color2']
                                                }else{
                                                    handleFormChange({color2 : c.toHexString()});   
                                                }
                                                
                                            }}                                           
                                            />
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                    name="color-picker3"
                                    label="Color 3" 
                                    >
                                        <div className="flex justify-center mr-[60px]">
                                            <ColorPicker 
                                            allowClear
                                            onChange={c => {
                                                if (c.cleared){
                                                    delete formData['color3']
                                                }else{
                                                    handleFormChange({color3 : c.toHexString()});   
                                                }
                                            }}
                                            />
                                        </div>
                                    </Form.Item>  
                                </div> 
                            }  
                            {selectChosen === 'veil' &&
                                <div className="-mt-[425px]">

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="speed"
                                        label={'Speed'}
                                        initialValue={0.5}
                                        >
                                        <Slider 
                                        min={0}
                                        max={3}
                                        step={0.1} 
                                        />
                                    </Form.Item> 

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="hueShift"
                                        label={'Hue Shift'}
                                        initialValue={0}
                                        >
                                        <Slider 
                                        min={0}
                                        max={360}
                                        step={1} 
                                        />
                                    </Form.Item>   
                    

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="scanlineFrequency"
                                        label={'Scanline Frequency'}
                                        initialValue={0}
                                        >
                                        <Slider 
                                        min={0}
                                        max={5}
                                        step={0.1} 
                                        />
                                    </Form.Item> 

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="scanlineIntensity"
                                        label={'Scanline Intensity'}
                                        initialValue={1.0}
                                        >
                                        <Slider 
                                        min={0}
                                        max={1}
                                        step={0.01} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="warpamount"
                                        label={'Warp Amount'}
                                        initialValue={0.5}
                                        >
                                        <Slider 
                                        min={0}
                                        max={5}
                                        step={0.1} 
                                        />
                                    </Form.Item>        
                                </div> 
                            }      
                            {selectChosen === 'galaxy' &&
                                <div className="-mt-[130px]">

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="density"
                                        label={'Density'}
                                        initialValue={1}
                                        >
                                        <Slider 
                                        min={0}
                                        max={3}
                                        step={0.1} 
                                        />
                                    </Form.Item> 

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="glowIntensity"
                                        label={'Glow Intensity'}
                                        initialValue={0.3}
                                        >
                                        <Slider 
                                        min={0}
                                        max={1}
                                        step={0.1} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="saturation"
                                        label={'Saturation'}
                                        initialValue={0}
                                        >
                                        <Slider 
                                        min={0}
                                        max={1}
                                        step={0.1} 
                                        />
                                    </Form.Item>                           

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="hueShift"
                                        label={'Hue Shift'}
                                        initialValue={140}
                                        >
                                        <Slider 
                                        min={0}
                                        max={360}
                                        step={1} 
                                        />
                                    </Form.Item>                           

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="twinkleIntensity"
                                        label={'Twinkle Intensity'}
                                        initialValue={0.3}
                                        >
                                        <Slider 
                                        min={0}
                                        max={1}
                                        step={0.1} 
                                        />
                                    </Form.Item>   

                                    <Form.Item
                                        style={{width: 300 }}
                                        name="transparent"
                                        label={'Transparent'}
                                        >
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="starSpeed"
                                        label={'Star Speed'}
                                        initialValue={0.5}
                                        >
                                        <Slider 
                                        min={0}
                                        max={1}
                                        step={0.1} 
                                        />
                                    </Form.Item>   

                                    <Form.Item 
                                        style={{width: 300 }}
                                        name="speed"
                                        label={'Animation Speed'}
                                        initialValue={0.5}
                                        >
                                        <Slider 
                                        min={0}
                                        max={3}
                                        step={0.1} 
                                        />
                                    </Form.Item>   
                                </div> 
                            }  
                            <Form.Item>
                                <Button type="primary" onClick={()=>saveChanges()}>save</Button>
                                <Button type="primary" onClick={()=>handleDefaultSettings()}>revert to default</Button>
                            </Form.Item>

                        </Form>
                    </div>    
                </ConfigProvider>


                <Button onClick={()=>BackgroundChosen('aurora')}>aurora</Button>
                <Button onClick={()=>BackgroundChosen('veil')}>veil</Button>
                <Button onClick={()=>BackgroundChosen('galaxy')}>galaxy</Button>
            </div>
        </>
    )
}

export default SelectBackground;