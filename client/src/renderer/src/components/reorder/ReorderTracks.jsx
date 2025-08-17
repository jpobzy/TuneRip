import { Button, Form, Select, Tooltip, Result, Tour  } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import GradientSubmitButton from "../gradientSubmitButton/GradientSubmitButton";
import {App} from 'antd'
import { useTourContext } from "../context/SettingsTourContext";
import { QuestionOutlined  } from '@ant-design/icons';
import { resultToggle } from "../context/ResultContext";

function ReorderTracks(){
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [playlistData, setPlaylistData] = useState([])
    const {message} = App.useApp();
    
    const [open, setOpen] = useState(false);
    const selectPlaylistsRef = useRef(null)
    const submitPlaylistsRef = useRef(null)


    const {ResultSuccess, ResultFailed, Loading} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()


    const getExistingPlaylists = async ()=>{
        const req = await axios.get('http://localhost:8080/getallfoldernamesindownloads');
        setExistingPlaylistNames(req.data)
    }

    const setPlaylistChosen = (value, label) =>{
        setPlaylistData(prev =>{
            const newSettings = {
                ...prev,
                value
            }
            return newSettings
        })
        
    }

    const goBack = () => {
        setIsLoading(false)
        setShowResult(false)
    }

    const refactor = async () => {
        if (playlistData.length === 0){
            message.error('Error no folder is selected')
        }else{
            setIsLoading(true)
            const response = await axios.post('http://localhost:8080/refactor', {'playlist': playlistData.value})
            if (response.status === 200){
                setResultStatusCode(200)
                setIsLoading(false)
                setShowResult(true)
            }else{
                setResultStatusCode(400)
                setIsLoading(false)
                setShowResult(true)
            }  
        }
       
       
    }

    const steps = [
    {
      title: 'Choose a playlist to refactor',
      description: 'Pick one or multiple playlists to reorganize their track numbers in the correct order',
       target: () => selectPlaylistsRef.current
    },
    // {
    //   title: 'Clear',
    //   description: "Click 'x' to deselect all selected records.",
    //    target: () => document.querySelector('.ant-select-selector .ant-select-arrow')
    // },
    {
      title: 'Submit',
      description: 'Click submit to start the process',
       target: () => submitPlaylistsRef.current
    },
    ]

    useEffect(()=>{
            getExistingPlaylists();
        }, [])

    return (
        <div>
            <div className="mx-auto justify-center -mt-[20px]">
                {!isLoading && !showResult &&
                    <Form
                    name="refactor"
                    >
                        <Form.Item>
                            <div className="inline-block" ref={selectPlaylistsRef}>
                                <Select
                                    allowClear={true}
                                    mode="multiple"
                                    defaultValue={[]}
                                    style={{ width: 600 }}
                                    onChange={(value, label) => setPlaylistChosen(value, label)}
                                    options={existingPlaylistNames}
                                />      
                                <div className="flex ml-[5px] -mt-[32px] ml-[650px]" >
                                    <Tooltip title="help">
                                        <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setOpen(true)}/>
                                    </Tooltip>                                    
                                </div>                         
                            </div>
                        
                        </Form.Item>
                        <Form.Item>
                            <div className="flex justify-center">
                                <div className="flex" ref={submitPlaylistsRef}>
                                    <GradientSubmitButton  callbackFunction={refactor}/>                                
                                </div>

                            </div>
                        </Form.Item>
                    </Form>    
                }          



            {isLoading && !showResult && 
                <>
                    <div className="mt-[100px]">
                       {Loading('Tracks are being reordered')}
                    </div>
                    
                </>
            } 
            {!isLoading && showResult && 
                <>
                    <div className="-mt-[30px]">
                        {resultStatusCode === 200  && ResultSuccess('Successfully reordered tracks','', goBack)}
                        {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the debug folder', goBack)}             
                    </div>
                </>
            }                

            </div>
            <div className="mb-[100px]"></div>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        </div>
    )
}

export default ReorderTracks;