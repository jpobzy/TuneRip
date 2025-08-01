import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function BalatroBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, balatroSettings} = toggleBackgroundSettings();

    return (
        <>
            <div className="mt-[20px]">
                <Form.Item
                name="color1"
                label="Color 1" 
                initialValue={balatroSettings.balatroBackgroundSettings.color1} 
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

                <Form.Item
                name="color2"
                label="Color 2" 
                initialValue={balatroSettings.balatroBackgroundSettings.color2} 
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

                <Form.Item
                name="color3"
                label="Color 3" 
                initialValue={balatroSettings.balatroBackgroundSettings.color3} 
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
            

                <Form.Item 
                    style={{width: 300 }}
                    name="pixelFilter"
                    initialValue={balatroSettings.balatroBackgroundSettings.pixelFilter} 
                    label={'Pixelation'}>
                    <Slider 
                    min={balatroSettings.balatroFormSettings.pixelFilter.min}
                    max={balatroSettings.balatroFormSettings.pixelFilter.max}
                    step={balatroSettings.balatroFormSettings.pixelFilter.step} 
                    />
                </Form.Item>                     
            </div>
        </>
    )
}
export default BalatroBackground;