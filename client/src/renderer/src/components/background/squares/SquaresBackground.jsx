import { Button, ColorPicker, Flex, Form, Radio, Slider } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';


function SquaresBackground({setFormData, handleFormChange, formData, backgroundForm}){
    const {reset, squaresSettings} = toggleBackgroundSettings();


    const options = [
    { label: 'Diagonal', value: 'diagonal' },
    { label: 'Up', value: 'up' },
    { label: 'Right', value: 'right' },
    { label: 'Down', value: 'down' },
    { label: 'Left', value: 'left' },
    ];

    const saveChanges = () => {
        if (Object.keys(formData).length > 0){
            console.log(formData)
            squaresSettings.setSquareBackgroundSettings(prev => {
                const updates = {}
                if (formData.direction) updates.direction = formData.direction
                if (formData.squareSize) updates.squareSize = formData.squareSize
                if (formData.speed) updates.speed = formData.speed
                if (formData.borderColor) updates.borderColor = formData.borderColor
                return {...prev, ...updates}
            })  
        }
    }

    const handleDefaultSettings = () => {
        reset(backgroundForm)
        setFormData({})
        backgroundForm.setFieldsValue({direction : 'diagonal'})
    }


    return (
        <>
            <div className='mt-[20px]'>
                <Form.Item
                    name="direction"
                    initialValue={squaresSettings.squareBackgroundSettings.direction} 
                    label={'Square direction'}                
                >
                        <Radio.Group
                        block
                        // defaultValue="diagonal"
                        options={options}
                        optionType="button"
                        buttonStyle="solid"
                        >                        
                        </Radio.Group>  
                </Form.Item>

               <Form.Item
                    // style={{width: 400 }}
                    name="squareSize"
                    initialValue={squaresSettings.squareBackgroundSettings.squareSize} 
                    label={'Square Size'}>
                    <Slider 
                    min={squaresSettings.squaresFormSettings.squareSize.min}
                    max={squaresSettings.squaresFormSettings.squareSize.max}
                    step={squaresSettings.squaresFormSettings.squareSize.step} 
                    />
               </Form.Item>

               <Form.Item
                    // style={{width: 400 }}
                    name="speed"
                    initialValue={squaresSettings.squareBackgroundSettings.speed} 
                    label={'Animation Speed'}>
                    <Slider 
                    min={squaresSettings.squaresFormSettings.speed.min}
                    max={squaresSettings.squaresFormSettings.speed.max}
                    step={squaresSettings.squaresFormSettings.speed.step} 
                    />
               </Form.Item> 

                <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="borderColor"
                    label="Border Color" 
                    initialValue={squaresSettings.squareBackgroundSettings.borderColor}
                    >
                        <ColorPicker
                        allowClear
                        onChange={c => {
                            if (c.cleared){
                                delete formData['borderColor']
                            }else{
                                handleFormChange({borderColor : c.toHexString()});   
                            }
                            
                        }}                                           
                        />
                    </Form.Item>
                </div>
                {/* <div className="flex justify-center mr-[60px]">
                    <Form.Item
                    name="hoverFillColor"
                    label="Hover Fill Color" 
                    initialValue={squaresSettings.squareBackgroundSettings.hoverFillColor}
                    >
                        <ColorPicker
                        allowClear
                        onChange={c => {
                            if (c.cleared){
                                delete formData['hoverFillColor']
                            }else{
                                handleFormChange({hoverFillColor : c.toHexString()});   
                            }
                            
                        }}                                           
                        />
                    </Form.Item>
                </div> */}

            </div>
        </>
    )
}

export default SquaresBackground;
