import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function LightningBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, lightningSettings} = toggleBackgroundSettings();


    return (
        <>
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
                    initialValue={lightningSettings.lightningBackgroundSettings.speed}
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
        </>
    )
}
export default LightningBackground;