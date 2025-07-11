import React, {useState, useEffect} from 'react'
import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    message,
} from 'antd'
import axios from 'axios'



function DownloadSettingsForm({isTrack, setDownloadSettings, skipDownload, setskipDownload}){
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [skipComponentDisabled, setSkipComponentDisabled] = useState(false);
    
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



    const disableComponents = async (e) => {
        setComponentDisabled(e.target.checked)
        if (e.target.checked === true){
            setDownloadSettings({})
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


    return (
        <div className='downnload-form'>
        <Checkbox checked={componentDisabled} onChange={e => disableComponents(e)}>
            Use default settings
        </Checkbox>
        <Form
        name='basic'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{ maxWidth: 600 }}
        // initialValues={{remember: true}}
        onFinish={onFinish}
        autoComplete='off'
      >
        {isTrack && 
        <Form.Item 
            label="TrackTitle"
            name="title"
            onChange={(e) => setTitle(e)}
            >
          <Input placeholder='Default: <Video title>'/>
        </Form.Item>
        }

        {!isTrack &&
            <Checkbox
                checked={skipDownload}
                onChange={(e) => setSkip(e)}
            >
                Skip downloading track if its already downloaded
            </Checkbox>        
        }


        <Form.Item 
            label="Artist"
            name="artist"
            onChange={(e) => setArtist(e)}
            >
          <Input placeholder='Default: Youtube Music' />
        </Form.Item>
        
        <Form.Item 
            label="Genre"
            name="genre"
            onChange={(e) => setGenre(e)}
            >
          <Input placeholder='Default: None'/>
        </Form.Item>



        <Form.Item 
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