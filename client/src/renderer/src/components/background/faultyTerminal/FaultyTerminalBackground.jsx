import { Button, ColorPicker, Flex, Form, Radio, Slider, Switch } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';

function FaultyTerminalBackground({setFormData, formData, backgroundForm}){
    const {reset, faultyTerminalSettings} = toggleBackgroundSettings();

    return (
        <>
            <div className="mt-[20px]">
                <div className="mr-[60px]">
                    <Form.Item
                    name="tintColor"
                    label="Tint Color"    
                    // initialValue={auroraSettings.auroraBackgroundSettings.colorStops[0]}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.tintColor}
                    >
                        <ColorPicker 
                        allowClear
                        onChange={c => {
                            if (c.cleared){
                                delete formData['tintColor']
                            }else{
                                setFormData(prev => ({...prev, tintColor : c.toHexString()}))
                            }                                               
                        }}                                            
                        /> 
                    </Form.Item>
                </div>
                <Form.Item 
                    style={{width: 300 }}
                    name="scale"
                    label={'Scale'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.scale}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.scale.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.scale.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.scale.step} 
                    />
                </Form.Item>   


                <Form.Item 
                    style={{width: 300 }}
                    name="digitSize"
                    label={'Digit Size'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.digitSize}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.digitSize.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.digitSize.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.digitSize.step} 
                    />
                </Form.Item>   

                <Form.Item 
                    style={{width: 300 }}
                    name="noiseAmplitude"
                    label={'Noise Amplitude'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.noiseAmplitude}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.noiseAmplitude.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.noiseAmplitude.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.noiseAmplitude.step} 
                    />
                </Form.Item>   

                <Form.Item 
                    style={{width: 300 }}
                    name="brightness"
                    label={'Brightness'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.brightness}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.brightness.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.brightness.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.brightness.step} 
                    />
                </Form.Item>   

                <Form.Item 
                    style={{width: 300 }}
                    name="scanlineIntensity"
                    label={'Scanline Intensity'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.scanlineIntensity}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.scanlineIntensity.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.scanlineIntensity.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.scanlineIntensity.step} 
                    />
                </Form.Item>   

                <Form.Item 
                    style={{width: 300 }}
                    name="curvature"
                    label={'Curvature'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.curvature}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.curvature.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.curvature.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.curvature.step} 
                    />
                </Form.Item>   


                <Form.Item 
                    style={{width: 300 }}
                    name="mouseStrength"
                    label={'Mouse Strength'}
                    initialValue={faultyTerminalSettings.faultyTerminalBackgroundSettings.mouseStrength}
                    >
                    <Slider 
                    min={faultyTerminalSettings.faultyTerminalFormSettings.mouseStrength.min}
                    max={faultyTerminalSettings.faultyTerminalFormSettings.mouseStrength.max}
                    step={faultyTerminalSettings.faultyTerminalFormSettings.mouseStrength.step} 
                    />
                </Form.Item>   

                <Form.Item
                    style={{width: 300 }}
                    name="mouseReact"
                    label={'Mouse React'}
                    >
                    <Switch />
                </Form.Item>

                <Form.Item
                    style={{width: 300 }}
                    name="pageLoadAnimation"
                    label={'Page Load Animation'}
                    >
                    <Switch />
                </Form.Item>                                   

            </div> 
        </>
    )
}
export default FaultyTerminalBackground;