import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function WavesBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, wavesSettings} = toggleBackgroundSettings();

    return (
        <>
            <div className="mt-[20px]">
                <Form.Item 
                    style={{width: 300 }}
                    name="waveSpeedX"
                    initialValue={wavesSettings.wavesBackgroundSettings.waveSpeedX} 
                    label={'Wave Speed X'}>
                    <Slider 
                    min={wavesSettings.wavesFormSettings.waveSpeedX.min}
                    max={wavesSettings.wavesFormSettings.waveSpeedX.max}
                    step={wavesSettings.wavesFormSettings.waveSpeedX.step} 
                    />
                </Form.Item> 
        


                <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="wavesColor"
                    label="Waves Color"    
                    initialValue={wavesSettings.wavesBackgroundSettings.wavesColor}
                    >   
                            <ColorPicker 
                            allowClear
                            onChange={c => {
                                if (c.cleared){
                                    delete formData['wavesColor']
                                }else{
                                handleFormChange({wavesColor : c.toHexString()}); 
                                }                                                
                            }}                                            
                            />
                    
                    </Form.Item>
                </div>
            </div>        
        </>
    )
}

export default WavesBackground;