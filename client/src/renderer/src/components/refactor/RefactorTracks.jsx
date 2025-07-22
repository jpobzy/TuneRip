import { Button, Form, Select, Tooltip, Result, Tour  } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import RefactorSubmitButton from "./RefactorSubmitButton";
import {App} from 'antd'
import { useTourContext } from "../context/SettingsTourContext";
import { QuestionOutlined  } from '@ant-design/icons';

function RefactorTracks(){
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [playlistData, setPlaylistData] = useState([])
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const {message} = App.useApp();
    
    const [open, setOpen] = useState(false);
    const selectPlaylistsRef = useRef(null)
    const submitPlaylistsRef = useRef(null)

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

    const refactor = async () => {
        if (playlistData.length === 0){
            message.error('Error no folder is selected')
        }else{
            setButtonDisabled(true)
            const request = await axios.post('http://localhost:8080/refactor', {'playlist': playlistData.value})
            setButtonDisabled(false)
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
            <div className="mx-auto justify-center ">
                {/* <div className="text-[40px] text-white">
                    Reorder Tracks
                </div> */}
                <Form
                        name="refactor"
                        // labelCol={{ span: 8 }}
                        // wrapperCol={{ span: 16 }}
                        // style={{ maxWidth: 600 }}
                        // initialValues={{ remember: true }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        // autoComplete="off"
                        // style={{ maxWidth: 600 }}
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
                        </div>
                    
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-center">
                            <div className="flex" ref={submitPlaylistsRef}>
                                <RefactorSubmitButton buttonDisabled={buttonDisabled} refactor={refactor}/>                                
                            </div>
                            <div className="flex ml-[5px]" >
                                <Tooltip title="help">
                                    <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setOpen(true)}/>
                                </Tooltip>                                    
                            </div>
                          
                        </div>

                    </Form.Item>

                </Form>                     
            </div>
            <div className="mb-[100px]"></div>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        </div>
    )
}

export default RefactorTracks;