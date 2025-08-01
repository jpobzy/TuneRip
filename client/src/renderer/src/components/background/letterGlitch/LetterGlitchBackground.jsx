import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function LetterGlitchBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, letterGlitchSettings} = toggleBackgroundSettings();

    return (
        <>
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
        </>
    )
}

export default LetterGlitchBackground;