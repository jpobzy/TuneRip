import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';


function AuroraBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, auroraSettings} = toggleBackgroundSettings();

    return (
        <>
        <div className="mt-[20px]">
            <Form.Item 
                style={{width: 300 }}
                name="blend"
                initialValue={auroraSettings.auroraBackgroundSettings.blend} 
                label={'Blend'}>
                <Slider 
                min={auroraSettings.auroraFormSettings.blend.min}
                max={auroraSettings.auroraFormSettings.blend.max}
                step={auroraSettings.auroraFormSettings.blend.step} 
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
                initialValue={auroraSettings.auroraBackgroundSettings.speed} 
                label={'Speed'}>
                <Slider 
                min={auroraSettings.auroraFormSettings.speed.min}
                max={auroraSettings.auroraFormSettings.speed.max}
                step={auroraSettings.auroraFormSettings.speed.step} 
                />
            </Form.Item>                           


            <div className="flex justify-center mr-[60px]">
                <Form.Item
                name="colorPicker1"
                label="Color 1"    
                initialValue={auroraSettings.auroraBackgroundSettings.colorStops[0]}
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
                name="colorPicker2"
                label="Color 2" 
                initialValue={auroraSettings.auroraBackgroundSettings.colorStops[1]}   
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
                name="colorPicker3"
                label="Color 3" 
                initialValue={auroraSettings.auroraBackgroundSettings.colorStops[2]}
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
        </div> 
        </>
    )
}

export default AuroraBackground;