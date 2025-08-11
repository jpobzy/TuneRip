import { Button, ConfigProvider, Form, Input, Upload, Select, Tooltip } from "antd"
import { useEffect, useRef, useState } from "react"
import { resultToggle } from "../context/ResultContext";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';

function FolderMerge(){
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [mergeFolderForm] = Form.useForm();



    const {ResultSuccess, ResultFailed, Loading} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()




    const getExistingPlaylists = async ()=>{
        const req = await axios.get('http://localhost:8080/getallfoldernamesindownloads');
        setExistingPlaylistNames(req.data)
    }

    useEffect(()=>{
            getExistingPlaylists();
    }, [])

    return (
        <>
            <div>

                    <div className="mx-auto justify-center ">
                        {!isLoading && !showResult &&
                            <ConfigProvider
                                theme={{
                                    components :{
                                        Form:{
                                        labelColor : "rgba(255, 255, 255, 1)"  
                                        }
                                    }
                                }}
                            
                            >
                                <Form
                                    form={mergeFolderForm}
                                    name="refactor"
                                >
                                    <div className="flex gap-[90px] mx-auto justify-center">
                                        <Tooltip title="prompt 1">
                                            <Form.Item>
                                                <div className="inline-block" ref={null}>
                                                    <Select
                                                        allowClear={true}
                                                        defaultValue={[]}
                                                        style={{ width: 300 }}
                                                        onChange={(e) => setPlaylistChosen(e)}
                                                        options={existingPlaylistNames}
                                                    />                               
                                                </div>
                                            </Form.Item>   
                                        </Tooltip>
                                    

                                        <Tooltip title="prompt 2">
                                            <Form.Item>
                                                <div className="inline-block" ref={null}>
                                                    <Select
                                                        allowClear={true}
                                                        defaultValue={[]}
                                                        style={{ width: 300 }}
                                                        onChange={(e) => setPlaylistChosen(e)}
                                                        options={existingPlaylistNames}
                                                    />                               
                                                </div>
                                            </Form.Item>   
                                        </Tooltip>

                                        {/* <input type="file" id="ctrl" webkitdirectory directory multiple/> */}

                                        
                                    </div>
                                    <Button type="primary"  >click me</Button>
                                </Form>
                            </ConfigProvider>
                        }
                    </div>

            </div>
        </>
    )
}

export default FolderMerge