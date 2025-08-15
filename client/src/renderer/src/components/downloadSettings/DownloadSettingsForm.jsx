import React, {useState, useEffect, use} from 'react'
import {
    Button,
    Checkbox,
    Popconfirm,
    Form,
    Input,
    Space,
    Select
} from 'antd'
import axios from 'axios'
import { App } from 'antd';
import { useHomeContext } from '../context/HomeContext';


function DownloadSettingsForm({isTrack, isUser, setDownloadSettings, skipDownload, setskipDownload, setPrevPlaylistArt}){
    const [componentDisabled, setComponentDisabled] = useState(true);
    // const [skipComponentDisabled, setSkipComponentDisabled] = useState(false);
    const [createSubfolder, setCreateSubfolder] = useState(false)
    const [subFolderInputValue, setSubFolderInputValue] = useState('')
    const [skipBeatsAndInstrumentals, setSkipBeatsAndInstrumentals] = useState(true)
    const [addToExistingPlaylist, setAddToExistingPlaylist] = useState(false)
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    
    const { message } = App.useApp();	
    const [form] = Form.useForm();
    const [chosenPlaylistSetting, setChosenPlaylistSetting] = useState([])
    const [requestedPrevPlaylistData, setRequestedPrevPLaylistData] = useState(false)
    const [debugMode, setDebugMode] = useState(false);
    const { downloadScreenRefs  } = useHomeContext();

    const toggleDefaultSettings = async (e) => {
        setComponentDisabled(e.target.checked)
        if (e.target.checked === true){
            setPrevPlaylistArt('')
            if (isTrack){
                    // form.setFieldValue({'': ''})
                    setDownloadSettings({})
            }else{
                setDownloadSettings({"skipDownloadingPrevDownload": true, "skipBeatsAndInstrumentals" : true})
                setskipDownload(true)
                setCreateSubfolder(false)
                setSkipBeatsAndInstrumentals(true)
            }

            if (requestedPrevPlaylistData){
                setPrevPlaylistArt('')
            }
            form.setFieldsValue({'album' : '', 'genre' : '', 'title' : '', 'artist' : '', 'dirname' : ''})
        }else{
           
            if (skipDownload && createSubfolder){
                setDownloadSettings({'skipDownloadingPrevDownload' : skipDownload, 'subFolderName': '', 'skipBeatsAndInstrumentals' : skipBeatsAndInstrumentals})
            }else if (skipDownload) {
                setDownloadSettings({'skipDownloadingPrevDownload' : skipDownload, 'skipBeatsAndInstrumentals' : skipBeatsAndInstrumentals})
            } else if (createSubfolder){
                setDownloadSettings({'subFolderName' : '', 'skipBeatsAndInstrumentals' : skipBeatsAndInstrumentals})
            }
        }
    }

    const setSkip = (e) => {
        setskipDownload(e.target.checked)
            
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            skipDownloadingPrevDownload: e.target.checked 
        };
        if (e.target.checked === false){
            delete newSettings['skipDownloadingPrevDownload'];
        }   
        return newSettings;
    })
    }


    const setTitle = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                trackTitle: e
            };
            if (e.length === 0){
                delete newSettings['trackTitle'];
            }   
            return newSettings;
        })
    }
    
    const setArtist = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                artist: e
            };
            if (e.length === 0){
                delete newSettings['artist'];
            }   
            return newSettings;
        })
    }



    const setGenre = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                genre: e
            };
            if (e.length === 0){
                delete newSettings['genre'];
            }   
            return newSettings;
        })
    }




    const setAlbum = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                album: e
            };
            if (e.length === 0){
                delete newSettings['album'];
            }   
            return newSettings;
        })
    }

    const setSubFolderSettings = (e) => {
        setAddToExistingPlaylist(false)
        setCreateSubfolder(e.target.checked)
        setSubFolderInputValue('')

        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                subFolderName: ''

            };
            if (e.target.checked === false){
                delete newSettings['subFolderName'];
                form.setFieldsValue({'dirname': ''})
                
            }
            return newSettings;
        })       
    }


    const setSubfolder = (e) => {
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            subFolderName: e
        };
        return newSettings;
        })
    }

    const setSkippingBeatsAndInstrumentals = (e) =>{
        setSkipBeatsAndInstrumentals(e.target.checked)
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            skipBeatsAndInstrumentals: e.target.checked
        };
        return newSettings;
        })
    }


    const getExistingPlaylists = async ()=>{
        const req = await axios.get('http://localhost:8080/getexistingplaylists');
        setExistingPlaylistNames(req.data)
    }

    const handleAddToExistingPlaylist = (e) => {
        setCreateSubfolder(false)
        setAddToExistingPlaylist(e.target.checked)
        if (requestedPrevPlaylistData){
            setPrevPlaylistArt('')
        }
    }

    const setAddToExistingPlaylistSettings = (label, value) =>{

        setChosenPlaylistSetting(value.value)
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            addToExistingPlaylistSettings: value.value
        };
        return newSettings;
        })
    }

    const getPlaylistData = async() => {
        const getPlaylistData = await axios.get('http://localhost:8080/getplaylistdata', {params: {playlist : chosenPlaylistSetting}})
        
        if (getPlaylistData.data.album){
            const albumData = getPlaylistData.data.album
            form.setFieldsValue({'album': albumData})
            setAlbum(albumData)            
        }

        if (getPlaylistData.data.genreData){
            const genreData = getPlaylistData.data.genre
            form.setFieldsValue({'genre': genreData})
            setGenre(genreData)            
        }

        if (getPlaylistData.data.artist){
            const artistData = getPlaylistData.data.artist
            form.setFieldsValue({'artist': artistData})
            setArtist(artistData)            
        }

        if (getPlaylistData.data.coverArtFile){
            setPrevPlaylistArt(getPlaylistData.data.coverArtFile)
        }
        setRequestedPrevPLaylistData(true)
    }

    const handleDebugMode = (e) => {
        setDebugMode(e.target.checked)
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            debugMode: e.target.checked
        };
        return newSettings;
        })
    }

    useEffect(()=>{
        if (isTrack){
            setskipDownload(false)
        }
        getExistingPlaylists();
    }, [])

    return (
        <div className='download-form '>
            <div ref={downloadScreenRefs.defaultDownloadToggleRef}>
                <Checkbox checked={componentDisabled} onChange={e => toggleDefaultSettings(e)}>
                    Use default settings
                </Checkbox>                
            </div>

        <Form 
        form={form}
        name='basic'
        labelCol={{ span: 5 }}
        // wrapperCol={{ span: 15 }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{ maxWidth: 600 }}
        // initialValues={{remember: true}}
        autoComplete='off'
        >

            

        {/* ############################## SKIP DOWNLOADING PREV DOWNLOADED TRACKS ################################ */}
        {!isTrack &&
            <div ref={downloadScreenRefs.skipDownloadingPrevDownloadToggleRef}>
                <Form.Item style={{marginBottom: "0px"}}>
                    <Checkbox
                        checked={skipDownload}
                        onChange={(e) => setSkip(e)}
                    >
                        Skip downloading track if its already downloaded
                    </Checkbox>                     
                </Form.Item>                 
            </div>

        }

        {/* ############################## SKIP DOWNLOADING BEATS AND INSTRUMENTALS ################################ */}
        {!isTrack &&
            <div ref={downloadScreenRefs.skipDownloadingBeatsAndInstrumentalsToggleRef}>
                <Form.Item style={{marginBottom : "0px"}}>
                    <Checkbox
                        checked={skipBeatsAndInstrumentals}
                        onChange={(e)=> setSkippingBeatsAndInstrumentals(e)}
                    >
                        Skip downloading beats and instrumental tracks
                    </Checkbox>             
                </Form.Item>                
            </div>

        }
    
    
        {/* ############################## ADD TRACK TO EXISTING PLAYLISTS ################################ */}   
        {!isUser &&
            <>  
                <div ref={downloadScreenRefs.addToExistingPlaylistToggleRef}>
                    <Form.Item style={{marginBottom : "0px"}}>
                        <Checkbox
                            checked={addToExistingPlaylist}
                            onChange={(e)=> handleAddToExistingPlaylist(e)}
                        >
                            {isTrack ? 
                            'Add track to exisiting playlist' : 
                            'Add tracks to exisiting playlist'
                            }
                        </Checkbox>             
                    </Form.Item>                    
                </div>


                {addToExistingPlaylist &&
                    <div >
                        <Form.Item style={{marginLeft: "70px"}}>
                            {/* <div className='ml-[70px] mt-[]'> */}
                                <Select
                                    defaultValue=""
                                    style={{ width: 250 }}
                                    onChange={(label, value) => setAddToExistingPlaylistSettings(label, value)}
                                    options={existingPlaylistNames}
                                />
                                <Button type='primary' onClick={() => getPlaylistData()}>Fill From Playlist</Button>                    
                            {/* </div> */}

                        </Form.Item>                          
                    </div>
  
                }            
            </>
        }



        {/* ############################## ADD TRACKS TO A NEW SUBFOLDER ################################ */}   
        <div ref={downloadScreenRefs.createSubfolderToggleRef}>
            <Form.Item style={{marginBottom : "5px"}}>
                <Checkbox
                    checked={createSubfolder}
                    onChange={(e)=> setSubFolderSettings(e)}
                >
                    Create a subfolder and add all the tracks there
                </Checkbox>             
            </Form.Item>            
        </div>

               


        { createSubfolder && 
            <div className='mx-auto'>
                <Form.Item 
                    wrapperCol={{ span: 15}}
                    label="Subfolder name"
                    name="dirname"
                    onChange={(e) => setSubfolder(e.target.value)}
                    >
                <Input 
                placeholder='Default: Album Title' />
                </Form.Item>                
            </div>
        }

        {/* ############################## CHANGE INDIVIDUAL TRACK TITLE ################################ */}   
        {isTrack && 
            <div ref={downloadScreenRefs.changeTrackTitleInputRef}>
                <Form.Item 
                    wrapperCol={{ span: 15}}
                    label="TrackTitle"
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    >
                <Input placeholder='Default: <Video title>'/>
                </Form.Item>            
            </div>
        }

        {/* <Form.Item>
            <Checkbox
                checked={debugMode}
                onChange={(e)=> handleDebugMode(e)}
            >   
                Debug mode
            </Checkbox>  
        </Form.Item> */}

        <div ref={downloadScreenRefs.artistInputRef}>
            <Form.Item 
                wrapperCol={{ span: 15}}
                label="Artist"
                name="artist"
                onChange={(e) => setArtist(e.target.value)}
                >
            <Input placeholder='Default: Youtube Music' />
            </Form.Item>            
        </div>

        <div ref={downloadScreenRefs.genreInputRef}>
            <Form.Item 
                wrapperCol={{ span: 15}}
                label="Genre"
                name="genre"
                onChange={(e) => setGenre(e.target.value)}
                >
            <Input placeholder='Default: None'/>
            </Form.Item>
        </div>
        <div ref={downloadScreenRefs.albumTitleRef}>
            <Form.Item 
                wrapperCol={{ span: 15}}
                label="Album Title"
                name="album"
                
                >
            <Input 
                placeholder='Default: YouTube Album Prod <YT channel>' 
                onChange={(e) => setAlbum(e.target.value)}
                />
            </Form.Item>
        </div>     
      </Form>
    </div>
    );
};

export default DownloadSettingsForm