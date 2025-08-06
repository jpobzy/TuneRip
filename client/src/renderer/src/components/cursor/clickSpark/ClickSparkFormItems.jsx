import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { useClickToggle } from '../../context/CursorContext';

function ClickSparkFormItems({handleFormChange, formData}){
    const {reset, clickSparkSettings} = useClickToggle();
    return (
        <>
            <div className="mt-[20px]">

                <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="sparkColor"
                    label="Spark Color"    
                    initialValue={clickSparkSettings.clickSparkCursorSettings.sparkColor}
                    >   
                            <ColorPicker 
                            allowClear
                            onChange={c => {
                                if (c.cleared){
                                    delete formData['sparkColor']
                                }else{
                                    handleFormChange({sparkColor : c.toHexString()}); 
                                }                                                
                            }}                                            
                            />
                    
                    </Form.Item>
                </div>

                <Form.Item 
                    style={{width: 300 }}
                    name="sparkRadius"
                    initialValue={clickSparkSettings.clickSparkCursorSettings.sparkRadius} 
                    label={'Spark Radius'}>
                    <Slider 
                    min={clickSparkSettings.clickSparkFormSettings.sparkRadius.min}
                    max={clickSparkSettings.clickSparkFormSettings.sparkRadius.max}
                    step={clickSparkSettings.clickSparkFormSettings.sparkRadius.step} 
                    />
                </Form.Item> 
        
                <Form.Item 
                    style={{width: 300 }}
                    name="sparkCount"
                    initialValue={clickSparkSettings.clickSparkCursorSettings.sparkCount} 
                    label={'Spark Count'}>
                    <Slider 
                    min={clickSparkSettings.clickSparkFormSettings.sparkCount.min}
                    max={clickSparkSettings.clickSparkFormSettings.sparkCount.max}
                    step={clickSparkSettings.clickSparkFormSettings.sparkCount.step} 
                    />
                </Form.Item> 

                <Form.Item 
                    style={{width: 300 }}
                    name="duration"
                    initialValue={clickSparkSettings.clickSparkCursorSettings.duration} 
                    label={'Spark Duration'}>
                    <Slider 
                    min={clickSparkSettings.clickSparkFormSettings.duration.min}
                    max={clickSparkSettings.clickSparkFormSettings.duration.max}
                    step={clickSparkSettings.clickSparkFormSettings.duration.step} 
                    />
                </Form.Item> 


                <Form.Item 
                    style={{width: 300 }}
                    name="extraScale"
                    initialValue={clickSparkSettings.clickSparkCursorSettings.extraScale} 
                    label={'Spark Scale'}>
                    <Slider 
                    min={clickSparkSettings.clickSparkFormSettings.extraScale.min}
                    max={clickSparkSettings.clickSparkFormSettings.extraScale.max}
                    step={clickSparkSettings.clickSparkFormSettings.extraScale.step} 
                    />
                </Form.Item> 

                 <Form.Item 
                    style={{width: 300 }}
                    name="sparkSize"
                    initialValue={clickSparkSettings.clickSparkCursorSettings.sparkSize} 
                    label={'Spark Size'}>
                    <Slider 
                    min={clickSparkSettings.clickSparkFormSettings.sparkSize.min}
                    max={clickSparkSettings.clickSparkFormSettings.sparkSize.max}
                    step={clickSparkSettings.clickSparkFormSettings.sparkSize.step} 
                    />
                </Form.Item>                
            </div> 
        </>
    )
}


export default ClickSparkFormItems;