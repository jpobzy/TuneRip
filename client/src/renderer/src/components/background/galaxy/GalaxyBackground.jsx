import { Button, ColorPicker, Flex, Form, Radio, Slider, Switch } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function GalaxyBackround({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, galaxySettings} = toggleBackgroundSettings();

    return (
        <>
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
        </>
    )
}

export default GalaxyBackround;