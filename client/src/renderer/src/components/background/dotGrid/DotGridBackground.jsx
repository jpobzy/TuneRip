import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function DotGridBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, dotGridSettings} = toggleBackgroundSettings();

    return (
        <>
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
        </>
    )
}
export default DotGridBackground;