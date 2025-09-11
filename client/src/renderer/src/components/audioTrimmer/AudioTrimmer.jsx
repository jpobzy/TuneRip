import { Switch, Button, Tooltip, Tour, Pagination, Input, App, } from 'antd';
import Mirt from 'react-mirt'
import "react-mirt/dist/css/react-mirt.css";
import React, { forwardRef, useReducer, useRef, useState } from 'react'
import axios from 'axios';
import fileDownload from 'js-file-download'
import { useToggle } from 'components/context/UseContext';
import audioExample from 'assets/audioTrimExample.mp3'
import { QuestionOutlined } from '@ant-design/icons';

function AudioTrimmer({setTabsDisabled}){

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [file, setFile] = useState(null);
    const [current, setCurrent] = useState(null)
    const [trackLength, setTrackLength] = useState(null)
    const {message} = App.useApp()
    const {setDisableDockFunctionality} = useToggle()
    const [filename, setFilename] = useState(null)
    const [openTour, setTourOpen] = useState(false);  
    const [inputPrefix, setInputPrefix] = useState('')

    const uploadRef = useRef(null)
    const trimRef = useRef(null)


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

        if (start !== startTime) setStart(startTime)

        endSeconds = String(Math.floor((e.end / 1000) % 60)).padStart(2, "0");
        endMinutes = String(Math.floor((e.end / (1000 * 60)) % 60)).padStart(2, "0");
        let endTime = `${endMinutes}:${endSeconds}`
        if (end !== endTime) setEnd(endTime)

        currentSeconds = String(Math.floor((e.current / 1000) % 60)).padStart(2, "0");
        currentMinutes = String(Math.floor((e.current / (1000 * 60)) % 60)).padStart(2, "0");
        let currentTime = `${currentMinutes}:${currentSeconds}`
        if (current !== currentTime) setCurrent(currentTime)

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

    

    async function loadDemo() {
        setInputPrefix('Demo file loaded. ')
        const req = await axios.get(audioExample, {responseType : 'arraybuffer'})
        const blob = new Blob([req.data], {type : 'audio/mpeg'})
        const file = new File([blob], 'example.mp3', {type: "audio/mpeg"})
        setFile(file)
        setTourOpen(true)
    }
    
    const steps = [
    {
        title: 'Choose a file to trim',
        description: 'Choose an mp3 audio file from your local hard drive to trim',
       target: () => uploadRef.current
    },
    {
        title: 'Play/Pause',
        description: 'Play or pause the audio, audio will start from where the white line is',
        target: () => document.querySelector('.mirt__play-button')
    },
    {
        title: 'Handles',
        description: 'Drag the handles to select the part you would like to keep',
        target: () => document.querySelector('.mirt__range-handle--start')
    },
    {
        title: 'Trim',
        description: 'Press trim to save the file, the file will retain all the metadata from the origin such as track number, cover art file, and more',
        target: () => trimRef.current
    },
    ]



    return (
        <>
            <div ref={uploadRef}  className='w-[220px]  justify-center mx-auto -mt-[20px] '>
                <Input
                prefix={inputPrefix}
                type="file"
                accept="audio/*"
                onChange={(e) => handleAddFile(e)}
                />
            </div>
            <div className="flex -mt-[32px] ml-[465px]" >
                <Tooltip title="help">
                    <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => loadDemo()}/>
                </Tooltip>                                    
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
                        <Button ref={trimRef} onClick={()=>handleDownload()}>Trim</Button>
                    </div>                   
                </div>
            </>
            }

            <Tour disabledInteraction={true} open={openTour} onClose={() => (setTourOpen(false), setInputPrefix(''))} steps={steps} />
        </>
    )
}

export default AudioTrimmer