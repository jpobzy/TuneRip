import { Button, Form, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import RefactorSubmitButton from "./RefactorSubmitButton";
import {App} from 'antd'
import { useTourContext } from "../context/SettingsTourContext";
 
function RefactorTracks(){
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [playlistData, setPlaylistData] = useState([])
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const {message} = App.useApp();
    const { selectPlaylistsRef } = useTourContext()
    const getExistingPlaylists = async ()=>{
        const req = await axios.get('http://localhost:8080/getallfoldernamesindownloads');
        // console.log(`req is: ${JSON.stringify(req.data)}`)
        setExistingPlaylistNames(req.data)
    }

    const setPlaylistChosen = (e) =>{
        setPlaylistData(e)
    }

    const refactor = async () => {
        if (playlistData.length === 0){
            message.error('Error no folder is selected')
        }else{
            setButtonDisabled(true)
            const request = await axios.post('http://localhost:8080/refactor', {'playlist': playlistData})
            setButtonDisabled(false)
        }
       
       
    }


    useEffect(()=>{
            getExistingPlaylists();
        }, [])

    return (
        <div>
            <div className="mx-auto justify-center ">
                <div className="text-[40px] text-white">
                    Reorder Tracks
                </div>
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
                                mode="multiple"
                                defaultValue={[]}
                                style={{ width: 300 }}
                                onChange={(e) => setPlaylistChosen(e)}
                                options={existingPlaylistNames}
                            />                               
                        </div>
                    
                    </Form.Item>
                    <Form.Item>
                        <RefactorSubmitButton buttonDisabled={buttonDisabled} refactor={refactor}/>
                    </Form.Item>
                </Form>                     
            </div>
            <div className="mb-[100px]">

            </div>
        </div>
    )
}

export default RefactorTracks;