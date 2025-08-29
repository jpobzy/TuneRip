import { Switch, Button, Tooltip, Tour, Pagination, Input, Upload, App } from 'antd';
import Mirt from 'react-mirt'
import "react-mirt/dist/css/react-mirt.css";
import React, { forwardRef, use,  useReducer, useState } from 'react'
import axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import fileDownload from 'js-file-download'
import { useToggle } from '../context/UseContext';

function AudioTrimmer({setTabsDisabled}){

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [file, setFile] = useState(null);
    const [current, setCurrent] = useState(null)
    const [trackLength, setTrackLength] = useState(null)
    const {message} = App.useApp()
    const {setDisableDockFunctionality} = useToggle()
    const [filename, setFilename] = useState(null)
       
    const handleAddFile = (e) => {
        setFilename(e.target.files[0].name)
        setFile(e.target.files[0])
    }

    const handleChange = (e) => {
        let startSeconds = 0
        let startMinutes = 0
        let endSeconds = 0
        let endMinutes = 0
        let currentSeconds = 0
        let currentMinutes = 0        
       
        startSeconds = String(Math.floor((e.start / 1000) % 60)).padStart(2, "0")
        startMinutes = String(Math.floor((e.start / (1000 * 60)) % 60)).padStart(2, "0")
        let startTime = `${startMinutes}:${startSeconds}`

        setStart(startTime)

        endSeconds = String(Math.floor((e.end / 1000) % 60)).padStart(2, "0");
        endMinutes = String(Math.floor((e.end / (1000 * 60)) % 60)).padStart(2, "0");
        let endTime = `${endMinutes}:${endSeconds}`
        setEnd(endTime)

        currentSeconds = String(Math.floor((e.current / 1000) % 60)).padStart(2, "0");
        currentMinutes = String(Math.floor((e.current / (1000 * 60)) % 60)).padStart(2, "0");
        let currentTime = `${currentMinutes}:${currentSeconds}`
        setCurrent(currentTime)

        if (!trackLength){
            setTrackLength(endTime)
        }
    }




    const handleDownload = async () => {
        if (start === '00:00' && end === trackLength){
            message.error('No audio trim was detected')
            return
        }

        const formData = new FormData();
        
        formData.append('startTime', start)
        formData.append('endTime', end)
        formData.append('audio', file);

        setDisableDockFunctionality(true)
        setTabsDisabled(true)

        const req = await axios.post('http://localhost:8080/trimAudio', 
            formData, 
            {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob'
        })
        
        if (req.status === 200){
            fileDownload(req.data, filename)
        }

        setDisableDockFunctionality(false)
        setTabsDisabled(false)
    }

    return (
        <>
            <div className='w-[220px]  justify-center mx-auto -mt-[20px] '>
                <Input
                type="file"
                accept="audio/*"
                onChange={(e) => handleAddFile(e)}
                />
            </div>
            {file && 
            <>  
                <div className='mt-[20px]'>
                    <Mirt 
                    file={file} 
                    onChange={(e)=> handleChange(e)}
                    />         


                    <div className='text-[15px] text-white mt-[20px]'>
                        <div>
                            Start time: {start}
                        </div>
                        <div>
                            End time: {end}
                        </div>
                        <div>
                            Playhead time: {current}
                        </div>
                    </div>


                    <div className='mt-[10px]'>

                        <Button onClick={()=>handleDownload()}>Trim</Button>
                    </div>                   
                </div>

            </>
            }

        </>
    )
}

export default AudioTrimmer