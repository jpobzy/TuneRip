import React, { useState, useRef } from 'react';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button, Tour  } from 'antd';
import './FilterForm.css'
import axios from 'axios';
// import { useTourContext } from '../context/SettingsTourContext';

import { InboxOutlined } from '@ant-design/icons';
import { Upload, Tooltip, Result} from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { App } from 'antd';

export default function FilterForm({setRefresh}) {
  const { Search } = Input;
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false)
  const { Dragger } = Upload;
  const [filterSuccess, setFilterSuccess] = useState(false)
  const [filterError, setFilterError] = useState(false)
  const [responseData, setResponseData] = useState({})

  const { message } = App.useApp();	

  const [open, setOpen] = useState(false); 
  const filterSearchBarRef = useRef(null) ;
  const filterFilesRef = useRef(null);

  const steps = [   
    {
      title: 'Filter a video from downloading',
      description: 'Paste a youtube URL and hit "Search" to add a video you want to prevent being downloaded in the future',
      target: () => filterSearchBarRef.current,
    },
    {
      title: 'Filter multiple videos from downloading',
      description: 'Create a text file with multiple youtube links to be filtered, format should be one line per line in the text file',
      target: () => filterFilesRef.current,
    }
    ]
  
  async function onSearch(value) {
    if (value.includes('https://www.youtube.com/watch?v=') || value.includes('https://youtu.be/') || value.includes("https://youtube.com/watch?v=") ){
        setLoading(true)
        const response = await axios.post('http://localhost:8080/filter', { ytLink: value })
        

      if (response.status === 200 || response.status === 304) {
        setResponseData(response)
        setLoading(false);
        setUser('');
        setFilterSuccess(true);
        setRefresh(true);
      }else{
        setResponseData(response)
        setFilterError(true)
        setLoading(false);
        setUser('');
        
        // setResponse(response)
      }

    } else if (value.length > 0){
        message.error(`Input ${value} is not a valid link`)
    } 
  }

  const props = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:8080/filter',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            setLoading(true)
        }

        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            setLoading(false);
            setUser('');
            setFilterSuccess(true);
            setRefresh(true);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
    disabled: loading
    };
    

  return (
    <div>
      <br />
        {filterSuccess ?
            <Result
            status="success"
            title="Tracks were added to filter!"
            // subTitle={`${responseData.data.message}`}
            extra={[
            <Button type="primary" onClick={()=> setFilterSuccess(false)}>Go back</Button>,
            ]}
            /> : filterError ? 
            <div className='bg-white rounded-lg mx-auto w-[800px]'>
                <Result
                    status="error"
                    title="Submission Failed"
                    subTitle={`${responseData.data.message}`}
                    extra={[
                        <Button type="primary" onClick={()=> setFilterError(false)}>Go back</Button>,
                    ]}
                />
            </div>
            :
            <div >
                <div className='flex justify-center items-center space-x-0'>
                    <div className='justify-center '>
                        <form
                            className="filter-form"
                            onSubmit={(e) => {
                            e.preventDefault(); // prevent form submission reload
                            onSearch(user);
                            }}
                        >
                            <label>
                            <ConfigProvider
                                theme={{
                                components: {
                                    Input: {
                                    colorBgContainer: 'rgb(255, 255, 255)', // idle background
                                    colorText: 'rgb(8, 1, 1)', // input text color
                                    colorTextPlaceholder: 'rgb(5, 0, 0)', // placeholder color
                                    },
                                    Button: {
                                    defaultBg: 'rgba(255, 255, 255, 0.94)',
                                    defaultBorderColor: '#6c757d',
                                    defaultColor: 'rgb(247, 244, 244)',
                                    defaultHoverColor: 'red', // example hover text color\
                                    },
                                },
                                }}
                            >
                                <div ref={filterSearchBarRef} className='inline-block mr-[50px]'>
                                    <Search
                                    placeholder="Paste Youtube Video URL to filter Here"
                                    allowClear={true}
                                    enterButton={
                                        <Button
                                        className="custom-search-btn"
                                        variant="solid"
                                        loading={loading}
                                        >
                                        Search
                                        </Button>
                                    }
                                    size="large"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    onSearch={onSearch}
                                    disabled={loading}
                                    prefix={<UserOutlined />}
                                    style={{ width: 450 }}
                                    />
                                </div>

                            </ConfigProvider>          
                            </label>
                        </form>                    
                    </div>
                    <div className='flex -ml-[40px]'>
                        <Tooltip title="help">
                            <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => {setOpen(true)}}/>
                        </Tooltip>    
                    </div>
                </div>
                <div className='mx-auto w-[500px] mt-[20px] inline-block' ref={filterFilesRef}>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                        Support for a single or bulk upload. 
                        </p>
                    </Dragger>
                </div>
                <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
            </div>
        }
            

     


  {/* <Button type="primary" onClick={()=> setLoading(false)}>Primary Button</Button>
    <Button type="primary" onClick={()=> setLoading(true)}>Disable Button</Button> */}


    </div>
  );
}
