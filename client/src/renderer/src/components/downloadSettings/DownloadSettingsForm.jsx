import React, {useState, useEffect, use} from 'react'
import {
    Button,
    Checkbox,
    Form,
    Input,
    Tooltip,
    Select,
} from 'antd'
import axios from 'axios'
import { App } from 'antd';
import { useHomeContext } from '../context/HomeContext';

function DownloadSettingsForm({downloadType, setDownloadSettings, skipDownload, setskipDownload, setPrevPlaylistArt, setGallerySettings, coverArtFileNames, setShowPagnation, imagesPerPage}){
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [createSubfolder, setCreateSubfolder] = useState(false)
    const [skipBeatsAndInstrumentals, setSkipBeatsAndInstrumentals] = useState(true)
    const [addToExistingPlaylist, setAddToExistingPlaylist] = useState(false)
    const [existingPlaylistNames, setExistingPlaylistNames] = useState([])
    const [useTrackFilter, setUseTrackFilter] = useState(true)
    const newFeatureText = <span>All track titles will remove any text thats in the filter titles table in settings</span>;
    const [usePrevData, setUsePrevData] = useState(false) // disabled/enables artist/genre/album title inputs
    
    const { message, notification } = App.useApp();	
    const [form] = Form.useForm();
    const [chosenPlaylistSetting, setChosenPlaylistSetting] = useState([])
    const [requestedPrevPlaylistData, setRequestedPrevPLaylistData] = useState(false)
    const [debugMode, setDebugMode] = useState(false);
    const { downloadScreenRefs  } = useHomeContext();


    const toggleDefaultSettings = async (e) => {
        setComponentDisabled(e.target.checked)
        if (e.target.checked === true){
            if (downloadType === 'track'){
                    setDownloadSettings({'useTrackFilter' : true})
            }else if (downloadType === 'playlist'){
                setDownloadSettings({"skipBeatsAndInstrumentals" : true, 'useTrackFilter' : true})
                setskipDownload(false)

            } else{

                setDownloadSettings({"skipDownloadingPrevDownload": true, "skipBeatsAndInstrumentals" : true, 'useTrackFilter' : true})
                setskipDownload(true)
                setCreateSubfolder(false)
                setSkipBeatsAndInstrumentals(true)
            }


            setUseTrackFilter(true)
            setAddToExistingPlaylist(false)
            setGallerySettings(prev => {
            return {
                ...prev, 
                currentImagesShown: prev.imagesToNotShow ? prev.imagesToNotShow.slice(0, imagesPerPage) : coverArtFileNames.slice(0, imagesPerPage), 
                showPagination : true, currentPaginationPage : 1
            }})

            if (requestedPrevPlaylistData){
                setPrevPlaylistArt(prev => {return {...prev, prevCoverArtUsed: null}})
            }
            form.setFieldsValue({'album' : '', 'genre' : '', 'title' : '', 'artist' : '', 'dirname' : ''})
            setUsePrevData(true)
            setCreateSubfolder(false)
        }else{
            if (downloadType === 'track'){
                setDownloadSettings({ useTrackFilter: true})
            }else{
                setDownloadSettings({'skipDownloadingPrevDownload' : skipDownload, 'skipBeatsAndInstrumentals' : skipBeatsAndInstrumentals, useTrackFilter: true})               
            }
            setUsePrevData(false)
        }
    }

    const setSkip = (e) => {
        setskipDownload(e.target.checked)
            
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            skipDownloadingPrevDownload: e.target.checked 
        };
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
        setCreateSubfolder(e.target.checked)
        setPrevPlaylistArt(prev => {return {...prev, prevCoverArtUsed: null}})

        if (addToExistingPlaylist){
            setDownloadSettings(prev => {
                const oldData = {...prev, addToExistingPlaylistSettings : ''}
                delete oldData['addToExistingPlaylistSettings']
                return {
                    ...oldData
                }
            })
            setChosenPlaylistSetting('')

            setDownloadSettings(prev => {return {...prev}})
            setGallerySettings(prev => {
                if (prev.showPagination){
                    return prev
                }   
                if (prev.allImages.length === 0){
                    return {
                        ...prev, showPagination : false
                    }
                }
                console.log(2)
                return {
                    ...prev, 
                    currentImagesShown: prev.imagesToNotShow && downloadType !== 'track' ? prev.imagesToNotShow.slice(0, imagesPerPage) : coverArtFileNames.slice(0, imagesPerPage), 
                    showPagination : true, currentPaginationPage : 1
                }
            })
        }

        setAddToExistingPlaylist(false)
        setUsePrevData(false)
        

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
        

        if (downloadType === 'channel'){
                setGallerySettings(prev => {
                if (prev.allImages.length === 0){
                   
                    return {
                        ...prev, showPagination : false
                    }
                }
                return prev
            })  
        }else{
            setGallerySettings(prev => {
                if (prev.allImages.length === 0){
                   
                    return {
                        ...prev, showPagination : false
                    }
                }
                return {...prev, showPagination : true}})
        }
    }


    const setSubfolderInput = (e) => {
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
            setPrevPlaylistArt(prev => {return {...prev, prevCoverArtUsed: null}})
        }

        if (createSubfolder){
            setDownloadSettings(prev => {
                const oldData = {...prev, subFolderName : ''}
                delete oldData['subFolderName']
                return oldData
            })
            form.setFieldsValue({'dirname': ''})
        }

        if (!e.target.checked){
            setDownloadSettings(prev => {
                const copy = {...prev}
                delete copy['addToExistingPlaylistSettings']
                return copy
            })
            setChosenPlaylistSetting('')

            setUsePrevData(false)
            setGallerySettings(prev => {
                if (prev.showPagination){
                    return prev
                }else{
                    return {
                            ...prev, 
                            currentImagesShown: prev.imagesToNotShow && downloadType !== 'track' ? prev.imagesToNotShow.slice(0, imagesPerPage) : coverArtFileNames.slice(0, imagesPerPage), 
                            showPagination : true, currentPaginationPage : 1,
                        }                    
                }
            })
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

    const fillPlaylistData = async() => {

        if (chosenPlaylistSetting.length === 0){
            message.error('No playlist was chosen')
            return
        }
        const getPlaylistData = await axios.get('http://localhost:8080/getplaylistdata', {params: {playlist : chosenPlaylistSetting}})

        if (Object.keys(getPlaylistData.data).length === 0){
            message.error('Playlist folder did not include any tracks')
            form.setFieldsValue({'album': null})
            form.setFieldsValue({'genre': null})
            form.setFieldsValue({'artist': null})

            setAlbum('')  
            setArtist('')    
            setGenre('')       
            setPrevPlaylistArt(prev => {return {...prev, prevCoverArtUsed: null}})
            setGallerySettings(prev => {
            return {
                ...prev, 
                currentImagesShown: prev.imagesToNotShow ? prev.imagesToNotShow.slice(0, imagesPerPage) : coverArtFileNames.slice(0, imagesPerPage), 
                showPagination : true, currentPaginationPage : 1
            }})
            setUsePrevData(false)
            return
        }

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
            if (getPlaylistData.data.coverArtFile.includes('ERROR COULD NOT FIND FILE')){
                notification.error({ message: 'File may have been deleted or renamed, please recover the file' });
                notification.error({ message: getPlaylistData.data.coverArtFile})
                setGallerySettings(prev => {return {...prev, currentImagesShown: [], showPagination : false}})
                setPrevPlaylistArt(prev => {return {...prev, prevCoverArtUsed: null}})
            }else{
                setPrevPlaylistArt(prev => {return {...prev, prevCoverArtUsed: getPlaylistData.data.coverArtFile}})
                setGallerySettings(prev => {return {...prev, currentImagesShown: coverArtFileNames.filter(art => art === getPlaylistData.data.coverArtFile), showPagination : false}})
            }
        }

        setUsePrevData(true)
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

    const handleTrackFilter = (e) => {
        setUseTrackFilter(e.target.checked)
        setDownloadSettings(prev => {
        const newSettings = {
            ...prev,
            useTrackFilter: e.target.checked
        };
        return newSettings;
        })
    }




    useEffect(()=>{
        if (downloadType === 'track'){
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
        {downloadType !== 'track' &&
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
        {downloadType !== 'track' &&
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
        {downloadType !== 'channel'  &&
            <>  
                <div ref={downloadScreenRefs.addToExistingPlaylistToggleRef}>
                    <Form.Item 
                    name={"addToExisting"}
                    style={{marginBottom : "0px"}}
                    >
                        <Checkbox
                            checked={addToExistingPlaylist}
                            onChange={(e)=> handleAddToExistingPlaylist(e)}
                        >
                            {downloadType === 'track' ? 
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
                                <Button type='primary' onClick={() => fillPlaylistData()}>Fill From Playlist</Button>                    
                            {/* </div> */}

                        </Form.Item>                          
                    </div>
  
                }            
            </>
        }



        {/* ############################## ADD TRACKS TO A NEW SUBFOLDER ################################ */}   
        {downloadType !== 'channel' && 
            <div ref={downloadScreenRefs.createSubfolderToggleRef}>
                <Form.Item style={{marginBottom : "5px"}} >
                    <Checkbox
                        checked={createSubfolder}
                        onChange={(e)=> setSubFolderSettings(e)}
                    >
                        Create a subfolder and add all the tracks there
                    </Checkbox>             
                </Form.Item>            
            </div>        
        }


               


        { createSubfolder && 
            <div className='mx-auto'>
                <Form.Item 
                    wrapperCol={{ span: 15}}
                    label="Subfolder name"
                    name="dirname"
                    onChange={(e) => setSubfolderInput(e.target.value)}
                    >
                <Input 
                placeholder={downloadType === 'track'? 'Default: customTracks' : 'Default: Album Title'} />
                </Form.Item>                
            </div>
        }

        {/* ############################## CHANGE INDIVIDUAL TRACK TITLE ################################ */}   
        {downloadType === 'track' && 
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
            </Form.Item>          */}
        

        <div className='inline-block'>
            <Tooltip placement="right" title={newFeatureText}>
                <div>
                    <Form.Item style={{marginBottom : "5px"}}>
                        <Checkbox
                            checked={useTrackFilter}
                            onChange={(e)=> handleTrackFilter(e)}
                        >   
                            {downloadType === 'track' ? 'Filter track title via trackFilter in settings' : 'Filter track titles via trackFilter in settings'}
                        </Checkbox>                  
                    </Form.Item>                    
                </div>
            </Tooltip>
        </div>




        <div ref={downloadScreenRefs.artistInputRef}>
            <Form.Item 
                wrapperCol={{ span: 15}}
                label="Artist"
                name="artist"
                onChange={(e) => setArtist(e.target.value)}
                >
            <Input disabled={usePrevData} placeholder='Default: Youtube Music' />
            </Form.Item>            
        </div>

        <div ref={downloadScreenRefs.genreInputRef}>
            <Form.Item 
                wrapperCol={{ span: 15}}
                label="Genre"
                name="genre"
                onChange={(e) => setGenre(e.target.value)}
                >
            <Input disabled={usePrevData} placeholder='Default: None'/>
            </Form.Item>
        </div>
        <div ref={downloadScreenRefs.albumTitleRef}>
            <Form.Item 
                wrapperCol={{ span: 15}}
                label="Album Title"
                name="album"
                
                >
            <Input 
                disabled={usePrevData}
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