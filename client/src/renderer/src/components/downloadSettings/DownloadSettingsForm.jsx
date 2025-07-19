import React, {useState, useEffect, use} from 'react'
import {
    Button,
    Checkbox,
    Popconfirm,
    Form,
    Input,
    message,
    Space,
    Col
} from 'antd'
import axios from 'axios'



function DownloadSettingsForm({isTrack, setDownloadSettings, skipDownload, setskipDownload}){
    const [componentDisabled, setComponentDisabled] = useState(true);
    // const [skipComponentDisabled, setSkipComponentDisabled] = useState(false);
    const [createSubfolder, setCreateSubfolder] = useState(false)
    const [subFolderInputValue, setSubFolderInputValue] = useState('')
    const [skipBeatsAndInstrumentals, setSkipBeatsAndInstrumentals] = useState(true)

    const [form] = Form.useForm();

    const onFinish = async() => {
        const res = await fetch('http://localhost:8080/changeDownloadSettings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: downloadSettings})
        });
        if (res.status == 200){
            message.success('Default Settings Updated!');
        }
    };



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



    useEffect(()=>{
        if (isTrack){
            setskipDownload(false)
        }
    })

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
        onFinish={onFinish}
        autoComplete='off'
        >

            


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
        
        {!isTrack &&
            <Form.Item style={{marginBottom : "10px"}}>
                <Checkbox
                    checked={skipBeatsAndInstrumentals}
                    onChange={(e)=> setSkippingBeatsAndInstrumentals(e)}
                >
                    Skip downloading beats and instrumental tracks
                </Checkbox>             
            </Form.Item>
        }


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