import React, {useState} from 'react'
import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    message
} from 'antd'
import axios from 'axios'



function DownloadSettingsForm({isTrack}){
    const [componentDisabled, setComponentDisabled] = useState(true);

    const [downloadSettings, setDownloadSettings] = useState({
        'artist': '',
        'genre': '',
        'album': ''
    });
    
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
        await axios.get('http://localhost:8080/resetDownloadSettings')
        if (!componentDisabled){
            message.success('Default Settings Enabled');
        }
        
    }


    const setTitle = (e) => {
        setDownloadSettings(prev => ({
            ...prev,
            title: e.target.value
        }))
    }
    
    const setArtist = (e) => {
        setDownloadSettings(prev => ({
            ...prev,
            artist: e.target.value
        }))
    }



    const setGenre = (e) => {
        setDownloadSettings(prev => ({
            ...prev,
            genre: e.target.value
        }))
    }




    const setAlbum = (e) => {
        setDownloadSettings(prev => ({
            ...prev,
            album: e.target.value
        }))
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
          <Input />
        </Form.Item>
        }

        <Form.Item 
            label="Artist"
            name="artist"
            onChange={(e) => setArtist(e)}
            >
          <Input />
        </Form.Item>
        
        <Form.Item 
            label="Genre"
            name="genre"
            onChange={(e) => setGenre(e)}
            >
          <Input />
        </Form.Item>



        <Form.Item 
            label="Album Title"
            name="album"
            onChange={(e) => setAlbum(e)}
            >
          <Input />
        </Form.Item>


        <Form.Item 
            label={null}>
            <Button type='primary' htmlType='submit'>
                Submit
            </Button>
        </Form.Item>

      </Form>
        </div>
    );
};

export default DownloadSettingsForm