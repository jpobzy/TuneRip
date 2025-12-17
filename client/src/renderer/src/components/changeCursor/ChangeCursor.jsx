import { Button, Select, Form, ConfigProvider} from "antd";
import { useState, useRef } from "react";
import { useClickToggle } from "components/context/CursorContext";
import SplashCursorFormItems from "components/cursor/splashCursor/SplashCursorFormItems";
import ClickSparkFormItems from "components/cursor/clickSpark/ClickSparkFormItems";
import axios from "axios";
import { useToggle } from "../context/UseContext";
import {
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { App } from 'antd';

function ChangeCursor({setTabsDisabled, favorites, operationInProgress, setOperationInProgress, handleSaveTab, currentTabKey}){
    const [cursor, setCursor] = useState('');
    const [cursorForm] = Form.useForm();
    const {splashCursorSettings, clickSparkSettings, setClickState, clickState, disableClickState, resetCursorSettings} = useClickToggle();
    const [formData, setFormData] = useState({});
    const [selectedHasPrevData, setSelectedHasPrevData] = useState(false)
    const {setDisableDockFunctionality} = useToggle()

    const favoritesRef = useRef(null);
    const { message } = App.useApp();
    
    const cursorOptions = [
        { value: 'splashCursor', label: 'Splash Cursor' },
        { value: 'clickSpark', label: 'Click Spark' },
    ]

    const changeCursor = (e) => {
        setCursor(e)
    }
    
    const disableCurrentCursor = async () => {
        setClickState('')
        if (currentTabKey === 'fav'){
            setOperationInProgress(true)   
        }    
        const req = await axios.post('http://localhost:8080/disablecurrentcursor')
      	if (currentTabKey === 'fav'){
            setOperationInProgress(false)   
        }    
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
        setDisableDockFunctionality(true)
        setTabsDisabled(true)
        if (currentTabKey === 'fav'){
            setOperationInProgress(true)   
        }            

        await axios.post('http://localhost:8080/savecursorsettings', formData, {params : {'cursor' : cursor}})

        setDisableDockFunctionality(false)
        setTabsDisabled(false)
      	if (currentTabKey === 'fav'){
            setOperationInProgress(false)   
        }            
    }


    const handleFormChange = (e) => {
        setFormData(prev => ({
            ...prev, 
            ...e
        }))         
    }



    return (
        <>
            <div className={currentTabKey === 'changeCursor' ? "-mt-[20px]" : ''}>
                <div>
                    <Select
                    defaultValue=""
                    style={{ width: 220 }}
                    onChange={(e) => changeCursor(e)}
                    options={cursorOptions}
                    disabled={operationInProgress}
                    />  
                    <div className='flex ml-[5px] inline-block' ref={favoritesRef}>
                        <Button shape="circle" icon={favorites.changeCursor[0] ? <StarFilled /> : <StarOutlined />} disabled={operationInProgress} onClick={() => handleSaveTab('changeCursor')}/>
                    </div>  
                </div>

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
                                <SplashCursorFormItems operationInProgress={operationInProgress}/>
                            } 
                            {cursor === 'clickSpark' && 
                                <ClickSparkFormItems handleFormChange={handleFormChange} operationInProgress={operationInProgress}/>
                            }
                            {cursor &&
                                <Form.Item>
                                    {selectedHasPrevData  
                                        ? <Button type="primary" onClick={()=>loadPrevBackgroundSettings()}>Load prev settings</Button>
                                        : <>
                                            
                                            <Button type="primary" disabled={operationInProgress} onClick={()=>saveChanges()}>Save</Button>
                                            <Button type="primary" disabled={operationInProgress} onClick={()=>reset()}>Reset</Button>
                                            
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
                        <Button type="primary" disabled={operationInProgress} onClick={()=> disableCurrentCursor()}>Disable current cursor</Button>
                    </div>
                }
            </div>
        </>
    )
}

export default ChangeCursor;