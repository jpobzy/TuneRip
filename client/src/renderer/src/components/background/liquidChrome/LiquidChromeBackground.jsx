import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';


function LiquidChromeBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, liquidChromeSettings} = toggleBackgroundSettings();

    return (
        <>
            <div className="mt-[20px]">
                <div className="columns-3 gap-[20px] w-[700px]">
                    <Form.Item
                        name="red"
                        label="Red"
                        initialValue={liquidChromeSettings.liquidChromeBackgroundSettings.red} 
                    >
                        <Slider 
                        min={liquidChromeSettings.liquidChromeFormSettings.red.min}
                        max={liquidChromeSettings.liquidChromeFormSettings.red.max}
                        step={liquidChromeSettings.liquidChromeFormSettings.red.step} 
                        />
                    </Form.Item> 

                    <Form.Item
                        name="green"
                        label="Green"
                        initialValue={liquidChromeSettings.liquidChromeBackgroundSettings.green} 
                    >
                        <Slider 
                        min={liquidChromeSettings.liquidChromeFormSettings.green.min}
                        max={liquidChromeSettings.liquidChromeFormSettings.green.max}
                        step={liquidChromeSettings.liquidChromeFormSettings.green.step} 
                        />                             
                    </Form.Item>   
                    
                    <Form.Item
                        name="blue"
                        label="Blue"
                        initialValue={liquidChromeSettings.liquidChromeBackgroundSettings.blue} 
                    >
                        <Slider 
                        min={liquidChromeSettings.liquidChromeFormSettings.blue.min}
                        max={liquidChromeSettings.liquidChromeFormSettings.blue.max}
                        step={liquidChromeSettings.liquidChromeFormSettings.blue.step} 
                        />
                    </Form.Item>                                                                    
                </div>
                <div className="mx-auto w-[250px]">
                    <Form.Item
                    name="speed"
                    label="Speed"
                    initialValue={liquidChromeSettings.liquidChromeBackgroundSettings.speed} 
                    >    
                        <Slider 
                        min={liquidChromeSettings.liquidChromeFormSettings.speed.min}
                        max={liquidChromeSettings.liquidChromeFormSettings.speed.max}
                        step={liquidChromeSettings.liquidChromeFormSettings.speed.step} 
                        />
                    </Form.Item>                                       
                </div>
                


                <div className="mx-auto w-[250px]">
                    <Form.Item
                    name="amplitude"
                    label="Amplitude"
                    initialValue={liquidChromeSettings.liquidChromeBackgroundSettings.amplitude} 
                    >    
                        <Slider 
                        min={liquidChromeSettings.liquidChromeFormSettings.amplitude.min}
                        max={liquidChromeSettings.liquidChromeFormSettings.amplitude.max}
                        step={liquidChromeSettings.liquidChromeFormSettings.amplitude.step} 
                        />
                    </Form.Item>                                       
                </div>

            </div>
        </>
    )
}
export default LiquidChromeBackground;