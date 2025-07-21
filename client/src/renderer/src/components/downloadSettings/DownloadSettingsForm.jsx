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


function DownloadSettingsForm({isTrack, setDownloadSettings, skipDownload, setskipDownload}){
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


    const toggleDefaultSettings = async (e) => {
        setComponentDisabled(e.target.checked)
        if (e.target.checked === true){
            if (isTrack){
                    // form.setFieldValue({'': ''})
                    setDownloadSettings({})
            }else{
                setDownloadSettings({"skipDownloadingPrevDownload": true, "skipBeatsAndInstrumentals" : true})
                setskipDownload(true)
                setCreateSubfolder(false)
                setSkipBeatsAndInstrumentals(true)
            }
            
            form.setFieldsValue({'album' : '', 'genre' : '', 'title' : '', 'artist' : '', 'dirname' : ''})
            // if (isTrack){
            //     form.setFieldValue({'': ''})
            // }
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
                trackTitle: e.target.value 
            };
            if (e.target.value.length === 0){
                delete newSettings['trackTitle'];
            }   
            return newSettings;
        })
    }
    
    const setArtist = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                artist: e.target.value 
            };
            if (e.target.value.length === 0){
                delete newSettings['artist'];
            }   
            return newSettings;
        })
    }



    const setGenre = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                genre: e.target.value 
            };
            if (e.target.value.length === 0){
                delete newSettings['genre'];
            }   
            return newSettings;
        })
    }




    const setAlbum = (e) => {
        setDownloadSettings(prev => {
            const newSettings = {
                ...prev,
                album: e.target.value 
            };
            if (e.target.value.length === 0){
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
            subFolderName: e.target.value
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
        // console.log(`req is: ${JSON.stringify(req.data)}`)
        setExistingPlaylistNames(req.data)
    }

    const handleAddToExistingPlaylist = (e) => {
        setCreateSubfolder(false)
        setAddToExistingPlaylist(e.target.checked)
    }

    const setAddToExistingPlaylistSettings = (label, value) =>{
        console.log(label, value)
        // setChosenPlaylistSetting(e)
        // setDownloadSettings(prev => {
        // const newSettings = {
        //     ...prev,
        //     addToExistingPlaylistSettings: e
        // };
        // return newSettings;
        // })
    }

    const getPlaylistData = async() => {
        console.log(chosenPlaylistSetting)
        // const getPlaylistData = await axios.get('http://localhost:8080/getplaylistdata', {'playlist' : chosenPlaylistSetting})
    }

    useEffect(()=>{
        if (isTrack){
            setskipDownload(false)
        }
        getExistingPlaylists();
    }, [])

    return (
        <div className='download-form '>
        <Checkbox checked={componentDisabled} onChange={e => toggleDefaultSettings(e)}>
            Use default settings
        </Checkbox>
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
            <Form.Item style={{marginBottom: "0px"}}>
                <Checkbox
                    checked={skipDownload}
                    onChange={(e) => setSkip(e)}
                >
                    Skip downloading track if its already downloaded
                </Checkbox>                     
            </Form.Item>
                   
                
        }

        {/* ############################## SKIP DOWNLOADING BEATS AND INSTRUMENTALS ################################ */}
        {!isTrack &&
            <Form.Item style={{marginBottom : "0px"}}>
                <Checkbox
                    checked={skipBeatsAndInstrumentals}
                    onChange={(e)=> setSkippingBeatsAndInstrumentals(e)}
                >
                    Skip downloading beats and instrumental tracks
                </Checkbox>             
            </Form.Item>
        }
    
    
        {/* ############################## ADD TRACK TO EXISTING PLAYLISTS ################################ */}   
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

        {addToExistingPlaylist &&
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
        }



        {/* ############################## ADD TRACKS TO A NEW SUBFOLDER ################################ */}   
        <Form.Item style={{marginBottom : "5px"}}>
            <Checkbox
                checked={createSubfolder}
                onChange={(e)=> setSubFolderSettings(e)}
            >
                Create a subfolder and add all the tracks there
            </Checkbox>             
        </Form.Item>
               


        { createSubfolder && 
            <div className='mx-auto'>
                <Form.Item 
                    wrapperCol={{ span: 15}}
                    label="Subfolder name"
                    name="dirname"
                    onChange={(e) => setSubfolder(e)}
                    >
                <Input 
                placeholder='Default: Album Title' />
                </Form.Item>                
            </div>
        }

        {/* ############################## CHANGE INDIVIDUAL TRACK TITLE ################################ */}   
        {isTrack && 
        <Form.Item 
            wrapperCol={{ span: 15}}
            label="TrackTitle"
            name="title"
            onChange={(e) => setTitle(e)}
            >
          <Input placeholder='Default: <Video title>'/>
        </Form.Item>
        }


        <Form.Item 
            wrapperCol={{ span: 15}}
            label="Artist"
            name="artist"
            onChange={(e) => setArtist(e)}
            >
          <Input placeholder='Default: Youtube Music' />
        </Form.Item>
        
        <Form.Item 
            wrapperCol={{ span: 15}}
            label="Genre"
            name="genre"
            onChange={(e) => setGenre(e)}
            >
          <Input placeholder='Default: None'/>
        </Form.Item>

        <Form.Item 
            wrapperCol={{ span: 15}}
            label="Album Title"
            name="album"
            onChange={(e) => setAlbum(e)}
            >
          <Input placeholder='Default: YouTube Album Prod <YT channel>' />
        </Form.Item>

      </Form>
    </div>
    );
};

export default DownloadSettingsForm