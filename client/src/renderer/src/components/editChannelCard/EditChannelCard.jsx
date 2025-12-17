import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Form, Tour, ColorPicker, ConfigProvider, Slider, Radio, Tooltip, App} from "antd";
import ElectricBorder from '../electricBorder/ElectricBorder';
import electron from 'assets/electron.svg'
import { Color } from '@rc-component/color-picker';
import { useToggle } from '../context/UseContext';

import {
  StarOutlined,
  StarFilled,
  QuestionOutlined
} from '@ant-design/icons';


export default function EditChannelCard({setTabsDisabled, favorites, operationInProgress, setOperationInProgress, handleSaveTab, currentTabKey}) {
    // makes changes using post req, not a fan of this method but i dont want to add another usecontext just for 1 thing 
    const [channelCardForm] = Form.useForm();
    const [electricBorderSettings, setElectricBorderSettings] = useState(null)
    const [electricBorderEnabled, setElectricBorderEnabled] = useState()
    const [cardSettings, setCardSettings] = useState(null)
    const [formData, setFormData] = useState({});
    const [mode, setMode] = useState('electricBorder')
    const [hover, setHover] = useState(false);
    const {setDisableDockFunctionality} = useToggle()
    const favoritesRef = useRef(null);
    const electricBorderButtonRef = useRef(null);
    const radioRef = useRef(null);
    const { message } = App.useApp();



    const [open, setOpen] = useState(false); 
    const steps = [
        {
            title: 'Edit all YouTube channel cards',
            description: 'Customize each channel card’s background and appearance',
            target: () => null,
        },
        {
            title: 'Add an electric border',
            description: 'Apply an electric border to each card and adjust its settings',
            target: () => radioRef.current,
        },
        {
            title: 'Customize card colors',
            description: 'Modify text, background, border, and other color options for all channel cards',
            target: () => radioRef.current,
        },
        {
            title: 'Add to favorites',
            description: 'Add this feature to your favorites for quick access.',
            target: () => favoritesRef.current,
        },        
    ];

    // { label: 'Electric Border', value: 'electricBorder', ref:  },
    const options = [
    { label: 'Electric Border', value: 'electricBorder'},
    { label: 'Card', value: 'card'},
    ];


    const handleFormChange = (e) => {
        setElectricBorderSettings(prev=>{
            const copy = prev
            if ('color' in e) copy['color'] = e.color
            if ('speed' in e) copy['speed'] = e.speed
            if ('chaos' in e) copy['chaos'] = e.chaos
            if ('thickness' in e) copy['thickness'] = e.thickness
            return copy
        })

        setCardSettings(prev => {
            const copy = prev
            if ('backgroundColor' in e) copy['backgroundColor'] = e.backgroundColor
            if ('textColor' in e) copy['textColor'] = e.textColor
            if ('hoverBackgroundColor' in e) copy['hoverBackgroundColor'] = e.hoverBackgroundColor
            if ('hoverBoxShadowColor' in e) copy['hoverBoxShadowColor'] = e.hoverBoxShadowColor
            if ('borderColor' in e) copy['borderColor'] = e.borderColor
            return copy
        })

        setFormData(prev => ({
            ...prev, 
            ...e
        }))
    }

    async function getCardData(){
        const req = await axios.get('http://localhost:8080/get-controller-card-data')
        setElectricBorderSettings(req.data[0]['electricBorder'])
        setElectricBorderEnabled(req.data[0]['electricBorder'].disabled)
        setCardSettings(req.data[0]['card'])
    }

    useEffect( ()=>{
        getCardData()
    },[])

    async function saveChanges(){
        setDisableDockFunctionality(true)
        setTabsDisabled(true)
        if (currentTabKey === 'fav'){
            setOperationInProgress(true)   
        }    

        const req = await axios.post('http://localhost:8080/save-channel-card-settings', formData)
        if (req.status === 200){

        }

        setDisableDockFunctionality(false)
        setTabsDisabled(false)
      	if (currentTabKey === 'fav'){
            setOperationInProgress(false)   
        }    

    }

    function toggleCheckbox(e){
        setFormData(prev => ({
            ...prev, 
            disabled : e.target.checked
        }))
        setElectricBorderEnabled(e.target.checked)
    }

    async function reset(){
        if (mode === 'card'){
            channelCardForm.setFieldsValue({
                backgroundColor :  new Color("#FFFFFF56"),
                textColor :  new Color("#000000"),
                hoverBackgroundColor :  new Color("#128CD3"),   
                hoverBoxShadowColor :  new Color("#128CD3"), 
                borderColor :  new Color("#808080")              
            })  
            setCardSettings({
                backgroundColor : '#FFFFFF56',
                textColor : '#000000',
                hoverBackgroundColor : '#128CD3',
                hoverBoxShadowColor : '#128CD3',
                borderColor : '#808080',
            })
            setFormData({
                backgroundColor : '#FFFFFF56',
                textColor : '#000000',
                hoverBackgroundColor : '#128CD3',
                hoverBoxShadowColor : '#128CD3',
                borderColor : '#808080',                
            })
        }
        if (mode === 'electricBorder'){
            channelCardForm.setFieldsValue({
                electricBorder : new Color("#7df9ff"),
                speed : 1 , 
                chaos : 0.5,  
                thickness : 2, 
                borderRadius : 40,  
                disabled : false     
            })  
            setElectricBorderSettings({
                color: "#7df9ff",
                speed: 1,
                chaos: 0.5,
                thickness: 2,
                borderRadius: 40,
                disabled: false,
            })
            setFormData({ 
                color: "#7df9ff",
                speed: 1,
                chaos: 0.5,
                thickness: 2,
                borderRadius: 40,
                disabled: false,})
        } 
    }
    
    const changeModes = (e) => {
        setFormData({})
        setMode(e)
    }


    return (
        <>
            <div className={currentTabKey === 'editChannelCard' ? "-mt-[40px]" : ''}>
                {electricBorderSettings && 
                <>
                    <div className='text-white text-[30px] mx-auto -mb-[35px]'>
                        Preview
                    </div>

                    <div className='flex ml-[410px] -mb-[32px]'>
                        <Tooltip title="help">
                            <Button shape="circle" disabled={operationInProgress} icon={<QuestionOutlined />}  onClick={() => {setOpen(true)}}/>
                        </Tooltip>    
                    </div>

                    <div className='flex ml-[230px] mb-[10px] inline-block' ref={favoritesRef}>
                        <Button shape="circle" icon={favorites.editChannelCard[0] ? <StarFilled /> : <StarOutlined />} disabled={operationInProgress} onClick={() => handleSaveTab('editChannelCard')}/>
                    </div>

                    <div className='mt-[5px] w-[240px] mx-auto  '
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                            background: hover ? cardSettings.hoverBackgroundColor : 'transparent',
                            borderRadius: '45px',
                            transform: hover ? 'scale(1.15)' : 'scale(1)', 
                            transition: 'all 0.25s ease',
                            boxShadow: hover ? `0 0 20px ${cardSettings.hoverBoxShadowColor}` : ''
                        }}
                    >
                        <ElectricBorder
                            color={electricBorderSettings.color}
                            speed={electricBorderSettings.speed}
                            chaos={electricBorderSettings.chaos}
                            thickness={electricBorderSettings.thickness}
                            style={{ borderRadius: electricBorderSettings.borderRadius }}
                            disabled={electricBorderEnabled}
                        >
                            <div
                            style={{
                                height : '140px',
                                border : `1px solid ${cardSettings.borderColor}`,
                                borderRadius : '45px',
                                background : cardSettings.backgroundColor,
                            }}
                            >
                                <div className='ml-[75px] mt-[20px]'>
                                    <img className="avatar" src={electron} alt="channel" style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                    }}/>   
                                </div>
                                <div className="info">
                                <div style={{color: cardSettings.textColor}} className='text-[15px]'>hello world</div>
                                </div>
                            </div>
                        </ElectricBorder>                             
                    </div>
           

                   
                    <div className='mt-[40px]  mb-[30px]'>
                        <div className='flex justify-center mb-[10px] inline-block' ref={radioRef}>
                           <Radio.Group disabled={operationInProgress} block options={options} defaultValue="electricBorder" optionType="button" buttonStyle="solid" style={{width: 300}} onChange={(e)=>changeModes(e.target.value)}/> 
                        </div>
                        
                        <ConfigProvider
                            theme={{
                                components: {
                                Form: {
                                    labelColor : 'white',
                                },
                                Checkbox :{
                                    colorText : 'white'

                                },
        
                                Slider: {
                                    railBg: "rgba(255,255,255, 0.9)",
                                    railHoverBg: "rgba(255,255,255, 0.9)",
                                },
                            }}}           
                        >
                            <div className="flex justify-center items-center  mt-[px]">
                                <Form
                                form={channelCardForm}
                                onValuesChange={(e)=>handleFormChange(e)}
                                >
                                    <>
                                        {mode === 'electricBorder' &&
                                        <>
                                            <Form.Item style={{marginBottom : "5px"}}
                                            >
                                                <Checkbox
                                                    disabled={operationInProgress}
                                                    checked={electricBorderEnabled}
                                                    onChange={(e)=>toggleCheckbox(e)}
                                                >
                                                Disable electric border
                                                </Checkbox>             
                                            </Form.Item>      

                                            <div className=''>
                                                <Form.Item
                                                style={{marginBottom : "5px"}}
                                                name="electricBorder"
                                                label="Electric Border" 
                                                initialValue={electricBorderSettings.color}
                                                >
                                                    <ColorPicker 
                                                        disabled={operationInProgress}
                                                        onChange={c => {
                                                            handleFormChange({color : c.toHexString()});   
                                                        }}
                                                        />
                                                </Form.Item>                                                      
                                            </div>

                                            <Form.Item 
                                            
                                                style={{width: 300, marginBottom : "5px"}}
                                                name="speed"
                                                initialValue={electricBorderSettings.speed} 
                                                label={'Speed'}>
                                                <Slider 
                                                min={0.1}
                                                max={3}
                                                step={0.1} 
                                                disabled={operationInProgress}
                                                />
                                            </Form.Item>         

                                            <Form.Item 
                                                style={{width: 300, marginBottom : "5px"}}
                                                name="chaos"
                                                initialValue={electricBorderSettings.chaos} 
                                                label={'Chaos'}>
                                                <Slider 
                                                min={0.1}
                                                max={1}
                                                step={0.1} 
                                                disabled={operationInProgress}
                                                />
                                            </Form.Item>    

                                            <Form.Item 
                                                style={{width: 300, marginBottom : "5px"}}
                                                name="thickness"
                                                initialValue={electricBorderSettings.thickness} 
                                                label={'Thickness'}>
                                                <Slider 
                                                min={1}
                                                max={5}
                                                step={1} 
                                                disabled={operationInProgress}
                                                />
                                            </Form.Item>    
                                        </>
                                        }
                                        {mode === 'card' && 
                                        <>
                                            <div className='-mr-[20px]'>
                                                <Form.Item
                                                style={{marginBottom : "5px"}}
                                                name="backgroundColor"
                                                label="Background Color" 
                                                initialValue={cardSettings.backgroundColor}
                                                >
                                                    <ColorPicker 
                                                        disabled={operationInProgress}
                                                        onChange={c => {
                                                            handleFormChange({backgroundColor : c.toHexString()});   
                                                        }}
                                                        />
                                                </Form.Item>                                                      
                                            </div>   


                                            <div className='-mr-[70px]'>
                                                <Form.Item
                                                style={{marginBottom : "5px"}}
                                                name="textColor"
                                                label="Text Color" 
                                                initialValue={cardSettings.textColor}
                                                >
                                                    <ColorPicker 
                                                        disabled={operationInProgress}
                                                        onChange={c => {
                                                            handleFormChange({textColor : c.toHexString()});   
                                                        }}
                                                        />
                                                </Form.Item>                                                      
                                            </div>          


                                            <div className='mr-[20px] '>
                                                <Form.Item
                                                style={{marginBottom : "5px"}}
                                                name="hoverBackgroundColor"
                                                label="Hover Background Color" 
                                                initialValue={cardSettings.hoverBackgroundColor}
                                                >
                                                    <ColorPicker 
                                                        disabled={operationInProgress}
                                                        onChange={c => {
                                                            handleFormChange({hoverBackgroundColor : c.toHexString()});   
                                                        }}
                                                        />
                                                </Form.Item>                                                      
                                            </div>          


                                            <div className='-mr-[10px]'>
                                                <Form.Item
                                                style={{marginBottom : "5px"}}
                                                name="hoverBoxShadowColor"
                                                label="Hover Shadow color" 
                                                initialValue={cardSettings.hoverBoxShadowColor}
                                                >
                                                    <ColorPicker 
                                                        disabled={operationInProgress}
                                                        onChange={c => {
                                                            handleFormChange({hoverBoxShadowColor : c.toHexString()});   
                                                        }}
                                                        />
                                                </Form.Item>                                                      
                                            </div>          
                                            <div className='-mr-[55px]'>
                                                <Form.Item
                                                style={{marginBottom : "5px"}}
                                                name="borderColor"
                                                label="Border Color" 
                                                initialValue={cardSettings.borderColor}
                                                >
                                                    <ColorPicker
                                                        disabled={operationInProgress}
                                                        onChange={c => {
                                                            handleFormChange({borderColor : c.toHexString()});   
                                                        }}
                                                        />
                                                </Form.Item>                                                      
                                            </div>          
                                        </>                     
                                        }
                                    </>
                                </Form>
                            </div>    
                        </ConfigProvider>
                        <Button disabled={operationInProgress} onClick={()=> saveChanges()} >Save</Button>                    
                        <Button disabled={operationInProgress} onClick={()=> reset()} >Reset</Button>
                    </div>      
                </>
                }
                <Tour disabled={true} disabledInteraction={true} open={open} onClose={() => setOpen(false)} steps={steps} />
            </div>    
        </>

    )
}