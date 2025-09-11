import { Button, Form, Select, Tooltip, Result, Tour, ConfigProvider, Checkbox, Spin  } from "antd";
import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import GradientSubmitButton from "../gradientSubmitButton/GradientSubmitButton";
import {App, Input } from 'antd'
import { useTourContext } from "../context/SettingsTourContext";
import { QuestionOutlined  } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import './editMetaData.css'
import { resultToggle } from "../context/ResultContext";
import CoverArtChanger from "../CoverArtChanger/CoverArtChanger";

function EditMetaData(){
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [playlistData, setPlaylistData] = useState({})
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const {message} = App.useApp();
    const [metadataForm] = Form.useForm();
    const [open, setOpen] = useState(false);
    const selectPlaylistsRef = useRef(null)
    const submitPlaylistsRef = useRef(null)
    const coverArtRef = useRef(null)

    const [isPlaylistChosen, setIsPlaylistChosen] = useState(false)
    const [updateDatabase, setUpdateDatabase] = useState(true)
    const toggleDatabase = useRef(null)
    const artistInput = useRef(null)
    const albumInput = useRef(null)
    const genreInput = useRef(null)

    const [imgClicked, setImgClicked] = useState('')

    const [updateTrack, setUpdateTrack] = useState(false)
    const [existingTrackNames, setExistingTrackNames] = useState([])
    const [selectedTrack, setSelectedTrack] = useState(null)
    const updateTrackRef = useRef(null)

    const {ResultSuccess, ResultFailed, Loading} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()




    const getExistingPlaylists = async ()=>{
        const req = await axios.get('http://localhost:8080/getallfoldernamesindownloads');
        setExistingPlaylistNames(req.data)
    }


    const getExistingTracks = async (e)=>{
        const data = () => {
            if (e){
                return e
            }
            return  playlistData.playlist
        }

        const req = await axios.get('http://localhost:8080/get-all-tracks-in-dir', { params : {'playlist' : data()}});
        setExistingTrackNames(req.data)
    }


    const setPlaylistChosen = (e) =>{
        if (e){
            setIsPlaylistChosen(true)
            setPlaylistData(prev =>{
                const newSettings = {
                    ...prev,
                    playlist: e,
                    updateDatabase: updateDatabase,
                    updateTrack : updateTrack
                }
                return newSettings
            })
        }else{
            
            setIsPlaylistChosen(false)
            metadataForm.setFieldsValue({'album' : '', 'genre' : '', 'artist' : ''})
            setPlaylistData([])
        }
    }
    
    const toggleUpdateDatabase = (e) => {
        setUpdateDatabase(e.target.checked)
        setPlaylistData(prev =>{
            const newSettings = {
                ...prev,
                updateDatabase: e.target.checked
            }
            return newSettings
        })
    }

    const toggleUpdateTrack = (e) => {
        getExistingTracks()
        setUpdateTrack(e.target.checked)
        setPlaylistData(prev =>{
            const newSettings = {
                ...prev,
                updateTrack: e.target.checked
            }
            return newSettings
        })
    }

    const inputTitle = (input) =>{
        if (input.target.value.length === 0){
            delete playlistData['title']
        }else{
            setPlaylistData(prev =>{
                const newSettings = {
                    ...prev,
                    title : input.target.value
                }
                return newSettings
            })            
        }

    }

    const inputAlbum = (input) =>{
        if (input.target.value.length === 0){
            delete playlistData['album']
        }else{
            setPlaylistData(prev =>{
                const newSettings = {
                    ...prev,
                    album : input.target.value
                }
                return newSettings
            })            
        }

    }

    const inputAritst = (input) =>{
        if (input.target.value.length === 0){
            delete playlistData['artist']
        }else{
            setPlaylistData(prev =>{
                const newSettings = {
                    ...prev,
                    artist : input.target.value
                }
                return newSettings
            })
        }
    }

    const inputGenre = (input) =>{
        if (input.target.value.length === 0){
            delete playlistData['genre']
        }else{       
            setPlaylistData(prev =>{
                const newSettings = {
                    ...prev,
                    genre : input.target.value
                }
                return newSettings
            })
        }
    }



    const refactor = async () => {
        if (Object.keys(playlistData).length === 0){
            message.error('Error no folder is selected')
        }else{
            if (playlistData.updateTrack && !playlistData.selectedTrack){
                message.error('Update track was selected but no track was selected to be updated')
            } else if (!Object.keys(playlistData).includes('album') && !Object.keys(playlistData).includes('genre') && 
            !Object.keys(playlistData).includes('artist') && imgClicked == '' && !Object.keys(playlistData).includes('title')){
                message.error('No inputs were added')
            }else{
                for (const [key, value] of Object.entries(playlistData)) {
                    if (String(value).trim().length == 0){
                        message.error(`Empty inputs are not allowed`)
                        return  
                    }
                }
                setIsLoading(true)
                const response = await axios.put('http://localhost:8080/updatemetadata', {'playlistData': playlistData, newCoverArt : imgClicked})
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
    }

    const steps = [
        {
        title: 'Choose a playlist to refactor',
        description: 'Pick one or multiple playlists to reorganize their track numbers in the correct order',
        target: () => selectPlaylistsRef.current
        },
        {
          title: 'Update database',
          description: "Enable this to update the music database after editing track info.",
           target: () => toggleDatabase.current
        },
        {
          title: 'Update single track',
          description: "Enable this to update a single track's metadata",
           target: () => updateTrackRef.current
        },
        {
          title: 'Update artist name',
          description: "Update the artist name for all tracks in the folder.",
           target: () => artistInput.current
        },        
        {
          title: 'Update album name',
          description: "Update the album name for all tracks in the folder.",
           target: () => albumInput.current
        },
        {
          title: 'Update genre',
          description: "Update the genre for all tracks in the folder.",
           target: () => genreInput.current
        },
        {
        title: 'Change cover album',
        description: 'Change the current folders cover album to something new',
        // target: () => submitPlaylistsRef.current
        target: () => coverArtRef.current
        },
        {
        title: 'Submit',
        description: 'Click submit to start the process',
        target: () => submitPlaylistsRef.current
        },
    ]


    const startTour = () =>{
        setOpen(true)
        setIsPlaylistChosen(true)
    }


    const endTour = () => {
        setOpen(false)
    }

    const goBack = () => {
        setIsLoading(false)
        setShowResult(false)
        setIsPlaylistChosen(false)
    }


    const playlistChoseon = (e) => {
        setPlaylistChosen(e)
        setImgClicked('')
        getExistingTracks(e)
        setSelectedTrack(null)
        setPlaylistData(prev =>{
            const copy = prev
            delete copy['selectedTrack']
            delete copy['title']
            return copy
        })
    }

    const trackChosen = (e) => {
        setSelectedTrack(e)
        setPlaylistData(prev =>{
            if (e){
                const newSettings = {
                    ...prev,
                    selectedTrack : e
                }
                return newSettings                
            }
            const copy = prev
            delete copy['selectedTrack']
            return copy
        })
    }

    useEffect(()=>{
            getExistingPlaylists();
    }, [])

    return (
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
                            form={metadataForm}
                            name="refactor"
                            >

                            <Form.Item>
                                <div className="inline-block" ref={selectPlaylistsRef}>
                                    <Select
                                        allowClear={true}
                                        defaultValue={[]}
                                        style={{ width: 500 }}
                                        onChange={(e) => playlistChoseon(e)}
                                        options={existingPlaylistNames}
                                    />                               
                                </div>
                                <div className="ml-[20px] flex -mt-[32px] ml-[605px]">
                                    <Tooltip title="help">
                                            <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => startTour()}/>
                                    </Tooltip>                                           
                                </div>

                            </Form.Item>                
                            
                    

                            {isPlaylistChosen &&
                                <div className="flex justify-center -mt-[10px]" >
                                    <Form.Item
                                    // ref={toggleDatabase}
                                    // wrapperCol={{ span: 15}}
                                    label="Update database"
                                    name="database"
                                    >  
                                    <div className="inline-block " ref={toggleDatabase}> 
                                        <Checkbox checked={updateDatabase} onChange={e => toggleUpdateDatabase(e)}/>
                                    </div>

                                    </Form.Item>                                     
                                </div>
                            }     



                            {isPlaylistChosen &&
                                <>
                                    <div className="flex justify-center -mt-[10px] -mb-[10px]" >
                                        <Form.Item
                                        label="Edit single track"
                                        name="track"
                                        >  
                                        <div className="inline-block" ref={updateTrackRef}> 
                                            <Checkbox checked={updateTrack} onChange={e => toggleUpdateTrack(e)}/>
                                        </div>

                                        </Form.Item>                                     
                                    </div>                                
                                </>

                            }     


                            {isPlaylistChosen && updateTrack &&
                                <Form.Item>
                                    <div className="inline-block" ref={null}>
                                        <Select
                                            allowClear={true}
                                            defaultValue={[]}
                                            style={{ width: 500 }}
                                            onChange={(e) => trackChosen(e)}
                                            options={existingTrackNames}
                                            value={selectedTrack}
                                        />                               
                                    </div>
                                </Form.Item>
                            }



                            {isPlaylistChosen && updateTrack && selectedTrack &&
                                <div className="flex justify-center">
                                    <Form.Item
                                    wrapperCol={{ span: 15}}
                                    label="Track title"
                                    name="title"
                                    onChange={(e) => inputTitle(e)}
                                    >  
                                    <div className="inline-block"ref={null} >
                                        <Input 
                                        onClear={() => delete playlistData['title']} 
                                        allowClear={true}
                                        style={{ width: 350 }}
                                        placeholder="Change artist info"/>                                    
                                    </div>
        
                                    </Form.Item>                                     
                                </div>
                            }  






                            {isPlaylistChosen &&
                                <div className="flex justify-center">
                                    <Form.Item
                                    wrapperCol={{ span: 15}}
                                    label="Artist"
                                    name="artist"
                                    onChange={(e) => inputAritst(e)}
                                    >  
                                    <div className="inline-block"ref={artistInput} >
                                        <Input 
                                        onClear={() => delete playlistData['artist']} 
                                        allowClear={true}
                                        style={{ width: 350 }}
                                        placeholder="Change artist info"/>                                    
                                    </div>
        
                                    </Form.Item>                                     
                                </div>
                            }  

                            {isPlaylistChosen &&
                                <div className="flex justify-center" >
                                    <Form.Item
                                    wrapperCol={{ span: 15}}
                                    label="Album Title"
                                    name="album"
                                    onChange={(e) => inputAlbum(e)}
                                    >  
                                    <div className="inline-block" ref={albumInput} >
                                        <Input
                                        onClear={() => delete playlistData['album']} 
                                        allowClear={true}
                                        style={{ width: 400 }}
                                        placeholder="Change album info"/>                                    
                                    </div>

                                    </Form.Item>                                     
                                </div>
                            }
                        
                            {isPlaylistChosen &&
                                <div className="flex justify-center" >
                                    <Form.Item
                                    wrapperCol={{ span: 15}}
                                    label="Genre"
                                    name="genre"
                                    onChange={(e) => inputGenre(e)}
                                    >  
                                    <div className="inline-block" ref={genreInput} >
                                        <Input
                                        onClear={() => delete playlistData['genre']} 
                                        allowClear={true}
                                        style={{ width: 350 }}
                                        placeholder="Change genre"/>
                                    </div>
                                    </Form.Item>                                     
                                </div>
                            }

                            {isPlaylistChosen &&
                                <div className="" ref={coverArtRef}>
                                   <CoverArtChanger imgClicked={imgClicked} setImgClicked={setImgClicked} imagesPerPage={6}/> 
                                </div>
                            }


                            <Form.Item>
                                <div className="flex justify-center">
                                    <div className="flex" ref={submitPlaylistsRef}>
                                        <GradientSubmitButton buttonDisabled={buttonDisabled} callbackFunction={refactor}/>                                
                                    </div>
                                    {/* <div className="flex ml-[5px]" >
                                        <Tooltip title="help">
                                            <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => startTour()}/>
                                        </Tooltip>                                    
                                    </div> */}
                                </div>
                            </Form.Item>

                        </Form>                            
                    </ConfigProvider>
                }        


                {isLoading && !showResult && 
                    <>
                        <div className="mt-[100px]">
                        {Loading('Tracks meta data is being adjusted')}
                        </div>
                        
                    </>
                } 

                {!isLoading && showResult && 
                    <>
                        <div className="bg-white rounded-xl inline-block">
                            {resultStatusCode === 200  && ResultSuccess('Successfully edited tracks meta data','', goBack)}
                            {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the debug folder', goBack)}             
                        </div>
                    </>
                }  
            </div>

            <Tour disabledInteraction={true} open={open} onClose={() => endTour()} steps={steps} />
        </div>
    )
}

export default EditMetaData;