import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function DarkVeilBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, veilSettings} = toggleBackgroundSettings();

    return (
        <>
            <div className="mt-[20px]">

                <Form.Item 
                    style={{width: 300 }}
                    name="speed"
                    label={'Speed'}
                    initialValue={veilSettings.veilBackgroundSettings.speed}
                    >
                    <Slider 
                    min={veilSettings.veilFormSettings.speed.min}
                    max={veilSettings.veilFormSettings.speed.max}
                    step={veilSettings.veilFormSettings.speed.step} 
                    />
                </Form.Item> 

                <Form.Item 
                    style={{width: 300 }}
                    name="hueShift"
                    label={'Hue Shift'}
                    initialValue={veilSettings.veilBackgroundSettings.hueShift}
                    >
                    <Slider 
                    min={veilSettings.veilFormSettings.hueShift.min}
                    max={veilSettings.veilFormSettings.hueShift.max}
                    step={veilSettings.veilFormSettings.hueShift.step} 
                    />
                </Form.Item>   


                <Form.Item 
                    style={{width: 300 }}
                    name="scanlineFrequency"
                    label={'Scanline Frequency'}
                    initialValue={veilSettings.veilBackgroundSettings.scanlineFrequency}
                    >
                    <Slider 
                    min={veilSettings.veilFormSettings.scanlineFrequency.min}
                    max={veilSettings.veilFormSettings.scanlineFrequency.max}
                    step={veilSettings.veilFormSettings.scanlineFrequency.step} 
                    />
                </Form.Item> 

                <Form.Item 
                    style={{width: 300 }}
                    name="scanlineIntensity"
                    label={'Scanline Intensity'}
                    initialValue={veilSettings.veilBackgroundSettings.scanlineIntensity}
                    >
                    <Slider 
                    min={veilSettings.veilFormSettings.scanlineIntensity.min}
                    max={veilSettings.veilFormSettings.scanlineIntensity.max}
                    step={veilSettings.veilFormSettings.scanlineIntensity.step} 
                    />
                </Form.Item>   

                <Form.Item 
                    style={{width: 300 }}
                    name="warpAmount"
                    label={'Warp Amount'}
                    initialValue={veilSettings.veilBackgroundSettings.warpAmount}
                    >
                    <Slider 
                    min={veilSettings.veilFormSettings.warpAmount.min}
                    max={veilSettings.veilFormSettings.warpAmount.max}
                    step={veilSettings.veilFormSettings.warpAmount.step} 
                    />
                </Form.Item>        
            </div> 
        </>
    )
}

export default DarkVeilBackground;