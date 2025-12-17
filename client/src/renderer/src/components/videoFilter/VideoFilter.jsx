import React, { useState, useRef } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button, Tour  } from 'antd';
import './VideoFilter.css'
import axios from 'axios';
import { resultToggle } from "components/context/ResultContext";

import { InboxOutlined } from '@ant-design/icons';
import { Upload, Tooltip } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { App } from 'antd';

import { useToggle } from '../context/UseContext';

import {
  StarOutlined,
  StarFilled
} from '@ant-design/icons';


export default function VideoFilter({setRefresh, setTabsDisabled, favorites, setFavorites, operationInProgress, setOperationInProgress, handleSaveTab}) {
    const { Search } = Input;
    const [channel, setChannel] = useState('');
    const [loading, setLoading] = useState(false)
    const { Dragger } = Upload;
    const { message } = App.useApp();	

    const [open, setOpen] = useState(false); 
    const filterSearchBarRef = useRef(null) ;
    const filterFilesRef = useRef(null);
    const favoritesRef = useRef(null);


    const {ResultSuccess, ResultFailed, Loading} = resultToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatusCode, setResultStatusCode] = useState()

    const {setDisableDockFunctionality} = useToggle()



    const steps = [   
    {
        title: 'Filter a video from downloading',
        description: 'Paste a youtube URL and hit "Search" to add a video you want to prevent being downloaded in the future',
        target: () => filterSearchBarRef.current,
    },
    {
        title: 'Filter multiple videos from downloading',
        description: 'Create a text file with multiple youtube links to be filtered, format should be one link per line in the text file',
        target: () => filterFilesRef.current,
    },
    {
        title: 'Add to favorites',
        description: 'Add this feature to your favorites for quick access.',
        target: () => favoritesRef.current,
    },    
    ]

    async function onSearch(value) {
        if (value.includes('https://www.youtube.com/watch?v=') || value.includes('https://youtu.be/') || value.includes("https://youtube.com/watch?v=") ){
            setLoading(true)
            setTabsDisabled(true)
            setDisableDockFunctionality(true)
            if (currentTabKey === 'fav'){
                setOperationInProgress(true)   
            }    
            const response = await axios.post('http://localhost:8080/filter', { ytLink: value })
            if (response.status === 200){
                if (response.data === 'Track has been added to the DB'){
                    setRefresh(true);
                    message.success(`${value} successfully added`);                    
                }else if (response.data === 'Track already exists'){
                    message.info('Track already exists')
                }
            }else{
                message.error(`Something went wrong, please check the logs for more details`);
            }
            setLoading(false);
            setChannel('');
            setTabsDisabled(false)
            setDisableDockFunctionality(false)
            if (currentTabKey === 'fav'){
                setOperationInProgress(false)   
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

        if (status === 'uploading') {
            setLoading(true)
            setTabsDisabled(true)
            setDisableDockFunctionality(true)     
            setOperationInProgress(true)     
        }

        if (status === 'done') {
            setResultStatusCode(200)
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (status === 'error') {
            setResultStatusCode(400)
            message.error(`${info.file.name} file upload failed`);
        }

        setShowResult(true)
        setLoading(false)
        setTabsDisabled(false)
        setDisableDockFunctionality(false)   
      	if (currentTabKey === 'fav'){
            setOperationInProgress(false)   
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
                                        disabled={operationInProgress}                                        
                                        >
                                        Search
                                        </Button>
                                    }
                                    size="large"
                                    value={channel}
                                    onChange={(e) => setChannel(e.target.value)}
                                    onSearch={onSearch}
                                    disabled={loading || operationInProgress}
                                    prefix={<UserOutlined />}
                                    style={{ width: 420 }}
                                    />
                                </div>

                            </ConfigProvider>          
                            </label>
                        </form>                    
                    </div>
                    <div className='flex -ml-[40px]'>
                        <Tooltip title="help">
                            <Button shape="circle" icon={<QuestionOutlined />} disabled={operationInProgress}  onClick={() => {setOpen(true)}}/>
                        </Tooltip>    
                    </div>
                    <div className='flex ml-[5px]  inline-block' ref={favoritesRef}>
                        <Button shape="circle" icon={favorites.videoFilter[0] ? <StarFilled /> : <StarOutlined />} disabled={operationInProgress} onClick={() => handleSaveTab('videoFilter')}/>
                    </div>
                </div>
                <div className='mx-auto w-[500px] mt-[20px] inline-block' ref={filterFilesRef}>
                    <Dragger
                     accept='.txt'
                     {...props}
                     disabled={operationInProgress}
                     >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload
                        </p>
                    </Dragger>
                </div>
                <Tour disabled={true} disabledInteraction={true} open={open} onClose={() => setOpen(false)} steps={steps} />
            </div>
        }
     
        {isLoading && !showResult && 
            <>
                <div className="mt-[100px]">
                    {Loading('')}
                </div>
            </>
        } 

        {!isLoading && showResult && 
            <>
                <div className='bg-white rounded-xl inline-block'>
                    {resultStatusCode === 200  && ResultSuccess('Successfully added tracks to filter','', goBack)}
                    {resultStatusCode === 400  && ResultFailed('Something went wrong', 'Please check the debug folder', goBack)}                        
                </div>
            </>
        }    
    </div>
  );
}
