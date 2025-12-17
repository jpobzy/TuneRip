import { Button, ColorPicker, Flex, Form, Radio, Slider, InputNumber, Space } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';


function FloatingLinesBackground({setFormData, handleFormChange, formData, backgroundForm, operationInProgress}){
    const {reset, floatingLinesSettings} = toggleBackgroundSettings();
    return (
        <>
            <div className="mt-[20px]">
                <Form.Item 
                name="lineCount1"
                initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.lineCount[0]} 
                label={'Top Wave Line Count'}
                >
                    <Slider 
                    style={{width: 200 }}
                    min={floatingLinesSettings.FloatingLinesFormSettings.lineCount.min}
                    max={floatingLinesSettings.FloatingLinesFormSettings.lineCount.max}
                    step={floatingLinesSettings.FloatingLinesFormSettings.lineCount.step} 
                    disabled={operationInProgress}
                    />
                </Form.Item> 

                <Form.Item 
                name="lineCount2"
                initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.lineCount[1]} 
                label={'Middle Wave Line Count'}>                   
                <Slider 
                style={{width: 200 }}
                min={floatingLinesSettings.FloatingLinesFormSettings.lineCount.min}
                max={floatingLinesSettings.FloatingLinesFormSettings.lineCount.max}
                step={floatingLinesSettings.FloatingLinesFormSettings.lineCount.step} 
                disabled={operationInProgress}
                />     
                </Form.Item> 


                <Form.Item 
                    name="lineCount3"
                    initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.lineCount[2]} 
                    label={'Bottom Wave Line Count'}>
                    <Slider 
                    style={{width: 200 }}
                    min={floatingLinesSettings.FloatingLinesFormSettings.lineCount.min}
                    max={floatingLinesSettings.FloatingLinesFormSettings.lineCount.max}
                    step={floatingLinesSettings.FloatingLinesFormSettings.lineCount.step} 
                    disabled={operationInProgress}
                    />
                </Form.Item> 


                <Form.Item 
                    name="lineDistance1"
                    initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.lineDistance[0]} 
                    label={'Top Wave Line Distance'}>
                    <Slider 
                    style={{width: 300 }}
                    min={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.min}
                    max={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.max}
                    step={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.step} 
                    disabled={operationInProgress}
                    />
                </Form.Item> 

                <Form.Item 
                    
                    name="lineDistance2"
                    initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.lineDistance[1]} 
                    label={'Middle Wave Line Distance'}>
                    <Slider 
                    style={{width: 300 }}
                    min={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.min}
                    max={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.max}
                    step={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.step} 
                    disabled={operationInProgress}
                    />
                </Form.Item> 

                <Form.Item 
                    name="lineDistance3"
                    initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.lineDistance[2]} 
                    label={'Bottom Wave Line Distance'}>
                    <Slider 
                    min={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.min}
                    max={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.max}
                    step={floatingLinesSettings.FloatingLinesFormSettings.lineDistance.step} 
                    disabled={operationInProgress}
                    />
                </Form.Item> 

                <Form.Item 
                    style={{width: 300 }}
                    name="animationSpeed"
                    initialValue={floatingLinesSettings.floatingLinesBackgroundSettings.animationSpeed} 
                    label={'Animation Speed'}>                    
                    <Slider 
                    min={floatingLinesSettings.FloatingLinesFormSettings.animationSpeed.min}
                    max={floatingLinesSettings.FloatingLinesFormSettings.animationSpeed.max}
                    step={floatingLinesSettings.FloatingLinesFormSettings.animationSpeed.step} 
                    disabled={operationInProgress}
                    />
                </Form.Item> 
            </div>             
        </>
    )
}

export default FloatingLinesBackground;
