import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function PrismaticBurstBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, prismaticBurstSettings} = toggleBackgroundSettings();

    return (
        <>
            <div className="mt-[20px]">
                <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="color1"
                    label="Color 1"    
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.colors[0]}
                    >   
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
                    </Form.Item>
                </div>

                <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="color2"
                    label="Color 2" 
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.colors[1]}
                    >
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
                    </Form.Item>
                </div>

                <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="color3"
                    label="Color 3" 
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.colors[2]}
                    >
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
                    </Form.Item>
                </div>

                <Form.Item 
                    style={{width: 300 }}
                    name="intensity"
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.intensity} 
                    label={'Intensity'}>
                    <Slider 
                    min={prismaticBurstSettings.prismaticBurstFormSettings.intensity.min}
                    max={prismaticBurstSettings.prismaticBurstFormSettings.intensity.max}
                    step={prismaticBurstSettings.prismaticBurstFormSettings.intensity.step} 
                    />
                </Form.Item> 


                <Form.Item 
                    style={{width: 300 }}
                    name="speed"
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.speed} 
                    label={'Speed'}>
                    <Slider 
                    min={prismaticBurstSettings.prismaticBurstFormSettings.speed.min}
                    max={prismaticBurstSettings.prismaticBurstFormSettings.speed.max}
                    step={prismaticBurstSettings.prismaticBurstFormSettings.speed.step} 
                    />
                </Form.Item> 

                <Form.Item 
                    style={{width: 300 }}
                    name="distort"
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.distort} 
                    label={'Distort'}>
                    <Slider 
                    min={prismaticBurstSettings.prismaticBurstFormSettings.distort.min}
                    max={prismaticBurstSettings.prismaticBurstFormSettings.distort.max}
                    step={prismaticBurstSettings.prismaticBurstFormSettings.distort.step} 
                    />
                </Form.Item> 


                <Form.Item 
                    style={{width: 300 }}
                    name="rayCount"
                    initialValue={prismaticBurstSettings.prismaticBurstBackgroundSettings.rayCount} 
                    label={'Ray count'}>
                    <Slider 
                    min={prismaticBurstSettings.prismaticBurstFormSettings.rayCount.min}
                    max={prismaticBurstSettings.prismaticBurstFormSettings.rayCount.max}
                    step={prismaticBurstSettings.prismaticBurstFormSettings.rayCount.step} 
                    />
                </Form.Item> 

            </div>      
        </>
    )
}

export default PrismaticBurstBackground;