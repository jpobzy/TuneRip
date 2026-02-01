import { Button, Form, Select, Tooltip, Result, Tour  } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import GradientSubmitButton from "components/gradientSubmitButton/GradientSubmitButton";
import {App} from 'antd'
import { QuestionOutlined  } from '@ant-design/icons';
import { resultToggle } from "components/context/ResultContext";
import { useToggle } from "../context/UseContext";
import {
  StarOutlined,
  StarFilled
} from '@ant-design/icons';


function ReorderTracks({setTabsDisabled, favorites, setFavorites, operationInProgress, setOperationInProgress, handleSaveTab}){
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

    const {setDisableDockFunctionality} = useToggle()
    const favoritesRef = useRef(null);

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
            setTabsDisabled(true)
            setDisableDockFunctionality(true)
            if (currentTabKey === 'fav'){
                setOperationInProgress(true)   
            }    

            try{
                const response = await axios.post('http://localhost:8080/refactor', {'playlist': playlistData.value})
                if (response.status === 200){
                    setResultStatusCode(200)
                    setIsLoading(false)
                    setShowResult(true)
                }                
            }catch (error){
                setResultStatusCode(400)
                setIsLoading(false)
                setShowResult(true)
            }

            setTabsDisabled(false)
            setDisableDockFunctionality(false)
            if (currentTabKey === 'fav'){
                setOperationInProgress(false)   
            }    

        }
    
    }

    const steps = [
    {
      title: 'Choose a playlist to refactor',
      description: 'Pick one or multiple playlists to reorganize their track numbers in the correct order',
       target: () => selectPlaylistsRef.current
    },
    {
      title: 'Submit',
      description: 'Click submit to start the process',
       target: () => submitPlaylistsRef.current
    },
    {
        title: 'Add to favorites',
        description: 'Add this feature to your favorites for quick access.',
        target: () => favoritesRef.current,
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
                            <div className="inline-block -ml-[55px]" ref={selectPlaylistsRef}>
                                <Select
                                    disabled={operationInProgress}
                                    allowClear={true}
                                    mode="multiple"
                                    defaultValue={[]}
                                    style={{ width: 450 }}
                                    onChange={(value, label) => setPlaylistChosen(value, label)}
                                    options={existingPlaylistNames}
                                />      
                                <div className="flex  -mt-[32px] ml-[531px] -mb-[32px]" >
                                    <Tooltip title="help">
                                        <Button shape="circle" icon={<QuestionOutlined />} onClick={() => setOpen(true)} disabled={operationInProgress}/>
                                    </Tooltip>                                    
                                </div>

                                <div className='flex ml-[570px] inline-block ' ref={favoritesRef}>
                                    <Button shape="circle" icon={favorites.reorderTracks[0] ? <StarFilled /> : <StarOutlined />} disabled={operationInProgress} onClick={() => handleSaveTab('reorderTracks')}/>
                                </div>                                                         
                            </div>
                        
                        </Form.Item>
                        <Form.Item>
                            <div className="flex justify-center">
                                <div className="flex" ref={submitPlaylistsRef}>
                                    <GradientSubmitButton  callbackFunction={refactor} operationInProgress={operationInProgress}/>                                
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
                    <div className="-mt-[30px] results bg-white rounded-xl">
                        {resultStatusCode === 200  && ResultSuccess('Successfully reordered tracks',`Tracks were reordered, plase check playlists chosen`, goBack)}
                        {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the log folder in TuneRip/server/logs', goBack)}             
                    </div>
                </>
            }                

            </div>
            <div className="mb-[100px]"></div>
            <Tour disabledInteraction={true} open={open} onClose={() => setOpen(false)} steps={steps} />
        </div>
    )
}

export default ReorderTracks;