import React, { useState } from 'react';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button } from 'antd';
import './FilterForm.css'

import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Collapse, Result} from 'antd';


export default function FilterForm({}) {
  const { Search } = Input;
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false)
  const { Dragger } = Upload;
  const [filterSuccess, setFilterSuccess] = useState(false)

  async function onSearch(value) {
    if (value.includes('https://www.youtube.com/watch?v=') || value.includes('https://youtu.be/') || value.includes("https://youtube.com/watch?v=") ){
        setLoading(true)
        const res = await fetch('http://localhost:8080/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ytLink: value }),
      });
      if (res.status === 200 || res.status === 304) {
        setLoading(false)
        setUser('')
        setFilterSuccess(true)
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
            // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            setLoading(false)
            setUser('')
            setFilterSuccess(true)
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
            subTitle=""
            extra={[
            <Button type="primary" onClick={()=> setFilterSuccess(false)}>Go back</Button>,
            ]}
            /> : 
                <div>
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
                            style={{ width: 500 }}
                            
                            
                            />
                        </ConfigProvider>          
                        </label>
                    </form>
                    
                    <div className='mx-auto w-[500px] mt-[20px]'>
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
                </div>
            }
            
    </div>
  );
}
