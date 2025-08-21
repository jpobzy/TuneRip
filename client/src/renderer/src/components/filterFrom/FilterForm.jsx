import React, { useState, useRef } from 'react';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button, Tour  } from 'antd';
import './FilterForm.css'
import axios from 'axios';
import { resultToggle } from "../context/ResultContext";

import { InboxOutlined } from '@ant-design/icons';
import { Upload, Tooltip, Result} from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { App } from 'antd';

export default function FilterForm({setRefresh}) {
  const { Search } = Input;
  const [channel, setChannel] = useState('');
  const [loading, setLoading] = useState(false)
  const { Dragger } = Upload;
  const [filterSuccess, setFilterSuccess] = useState(false)
  const [filterError, setFilterError] = useState(false)
  const { message } = App.useApp();	

  const [open, setOpen] = useState(false); 
  const filterSearchBarRef = useRef(null) ;
  const filterFilesRef = useRef(null);


    const {ResultSuccess, ResultFailed, Loading} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()



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
            setLoading(false);
            setChannel('');
            setFilterSuccess(true);
            setRefresh(true);
        }else{
            setFilterError(true)
            setLoading(false);
            setChannel('');
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
            setIsLoading(true)
        }

        if (status === 'done') {
            setResultStatusCode(200)
            setIsLoading(false)
            setShowResult(true)
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            setResultStatusCode(400)
            setShowResult(true)
            setIsLoading(false)
            message.error(`${info.file.name} file upload failed.`);
        }
    },
        onDrop(e) {},
        disabled: loading
    };
    
    const goBack = () => {
        setIsLoading(false)
        setShowResult(false)
    }

  return (
    <div>
        {!isLoading && !showResult &&
            <div >
                <div className='flex justify-center items-center space-x-0'>
                    <div className='justify-center '>
                        <form
                            className="filter-form"
                            onSubmit={(e) => {
                            e.preventDefault(); // prevent form submission reload
                            onSearch(channel);
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
                                    value={channel}
                                    onChange={(e) => setChannel(e.target.value)}
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
     
        {isLoading && !showResult && 
            <>
                <div className="mt-[100px]">
                    {Loading('Tracks are being reordered in folder')}
                </div>
                
            </>
        } 
        {!isLoading && showResult && 
            <>
                {resultStatusCode === 200  && ResultSuccess('Successfully added tracks to filter','', goBack)}
                {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the debug folder', goBack)}             
            </>
        }    


  {/* <Button type="primary" onClick={()=> setLoading(false)}>Primary Button</Button>
    <Button type="primary" onClick={()=> setLoading(true)}>Disable Button</Button> */}


    </div>
  );
}
