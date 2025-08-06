import { Button, Select, Form, Input, ColorPicker, ConfigProvider, Slider, Spin} from "antd";
import { useState } from "react";
import { useClickToggle } from "../context/CursorContext";
import SplashCursorFormItems from "../cursor/splashCursor/SplashCursorFormItems";
import ClickSparkFormItems from "../cursor/clickSpark/ClickSparkFormItems";
import axios from "axios";
import { LoadingOutlined } from '@ant-design/icons';

//             splashCursorSettings : {splashCursorBackgroundSettings, setSplashCursorBackgroundSettings, splashCursorFormSettings},
            // clickSparkSettings : {clickSparkBackgroundSettings, setClickSparkBackgroundSettings, clickSparkFormSettings},
            // setClickState

function SelectCursor(){
    const [cursor, setCursor] = useState('');
    const [cursorForm] = Form.useForm();
    const {splashCursorSettings, clickSparkSettings, setClickState, clickState, disableClickState, resetCursorSettings} = useClickToggle();
    const [formData, setFormData] = useState({});
    const [selectedHasPrevData, setSelectedHasPrevData] = useState(false)

    const cursorOptions = [
        { value: 'splashCursor', label: 'Splash Cursor' },
        { value: 'clickSpark', label: 'Click Spark' },
    ]

    const changeCursor = (e) => {
        setCursor(e)
    }
    
    const disableCurrentCursor = () => {
        setClickState('')
        axios.post('http://localhost:8080/disablecurrentcursor')
    }


    const reset = () => {
        resetCursorSettings(cursorForm)
    }

    const saveChanges = async () => {
        // disableClickState()
        if (cursor === 'splashCursor'){
            await new Promise(r => setTimeout(r, 1000));            
            splashCursorSettings.setSplashCursorCursorSettings(prev => {
                const updates = {}
                if (formData.splatForce) updates.SPLAT_FORCE = formData.splatForce
                if (formData.splatRadius) updates.SPLAT_RADIUS = formData.splatRadius
                return {...prev, ...updates}
            })            
        } else if (cursor === 'clickSpark'){
            clickSparkSettings.setClickSparkCursorSettings(prev => {
                const updates = {}
                if (formData.sparkColor) updates.sparkColor = formData.sparkColor
                if (formData.sparkSize) updates.sparkSize = formData.sparkSize
                if (formData.sparkRadius) updates.sparkRadius = formData.sparkRadius
                if (formData.sparkCount) updates.sparkCount = formData.sparkCount
                if (formData.duration) updates.duration = formData.duration
                if (formData.extraScale) updates.extraScale = formData.extraScale
                return {...prev, ...updates}         
            })
        }
   
        setClickState(cursor)
        await axios.post('http://localhost:8080/savecursorsettings', formData, {params : {'cursor' : cursor}})
    }


    const handleFormChange = (e) => {
        setFormData(prev => ({
            ...prev, 
            ...e
        }))         
    }




    


    return (
        <>
            <div className="-mt-[30px]">
                <Select
                    defaultValue=""
                    style={{ width: 220 }}
                    onChange={(e) => changeCursor(e)}
                    options={cursorOptions}
                    />
                    <ConfigProvider
                    theme={{
                        components: {
                        Form: {
                            labelColor : 'white',
                        },

                        Slider: {
                            railBg: "rgba(255,255,255, 0.9)",
                            railHoverBg: "rgba(255,255,255, 0.9)",
                        },
                    }}}           
                >
                    <div className="flex justify-center items-center  mt-[px]">
                        <Form
                        form={cursorForm}
                        onValuesChange={(e)=>handleFormChange(e)}
                        >
                            {cursor === 'splashCursor' &&
                                <SplashCursorFormItems />
                            } 
                            {cursor === 'clickSpark' && 
                                <ClickSparkFormItems handleFormChange={handleFormChange}/>
                            }
                            {cursor &&
                                <Form.Item>
                                    {selectedHasPrevData  
                                        ? <Button type="primary" onClick={()=>loadPrevBackgroundSettings()}>Load prev settings</Button>
                                        : <>
                                            
                                            <Button type="primary" onClick={()=>saveChanges()}>Save</Button>
                                            <Button type="primary" onClick={()=>reset()}>Reset</Button>
                                            
                                            {/* { selectChosen == background &&
                                            <Button type="primary" onClick={()=>handleDefaultSettings()}>Revert to default</Button>
                                            } */}
                                           
                                        </>
                                    }                                    
                                </Form.Item>                                         
                            }
                        </Form>
                    </div>    
                </ConfigProvider>

                {clickState !== '' && 
                    <div className="mt-[20px]">
                        <Button type="primary" onClick={()=> disableCurrentCursor()}>Disable current cursor</Button>
                    </div>
                }
            </div>
        </>
    )
}

export default SelectCursor;