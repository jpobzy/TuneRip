import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function IridescenceBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, iridescenceSettings} = toggleBackgroundSettings();

    return (
        <>
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
        </>
    )
}

export default IridescenceBackground;