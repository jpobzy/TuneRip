import React, { useState } from 'react';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button } from 'antd';
import { App, Form } from 'antd';

export default function AddChannelForm({setSearchURL, handleChannelAdded}) {
  const { Search } = Input;
  const [channel, setChannel] = useState('');
  const { message } = App.useApp();	

  async function onSearch(value) {
    if (value.length === 0){
      return
    }
    if (value.includes("@") ){
      const res = await fetch('http://localhost:8080/newChannel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ytLink: value }),
      });
      if (res.status === 200) {
        handleChannelAdded()
        setChannel('')
      }else{
        message.error(`Channel ${channel} could not be found`)
      }
    } else {
       setSearchURL(value);
    }


  }

  return (
    <div className='searchbar'> 
        <label>
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  colorBgContainer: 'rgba(255, 255, 255, 0.336)', // idle background
                  colorText: 'rgb(8, 1, 1)', // input text color
                  colorTextPlaceholder: 'rgb(5, 0, 0)', // placeholder color
                },
                Button: {
                  defaultBg: 'rgba(255, 255, 255, 0.336)',
                  defaultBorderColor: '#6c757d',
                  defaultColor: 'rgb(8, 1, 1)',
                  defaultHoverColor: 'red', // example hover text color\
                },
              },
            }}
          >
            <Search
              placeholder="Paste Youtuber Channel/Video URL Here"
              allowClear={true}
              enterButton={
                <Button
                  className="custom-search-btn"
                  style={{
                    borderColor: '#6c757d',
                    color: 'rgb(8, 1, 1)', // corrected property
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d9e8f0')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.336)')}
                  variant="solid"
                >
                  Search
                </Button>
              }
              size="large"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              onSearch={onSearch}
              prefix={<UserOutlined />}
              style={{ width: 500 }}
            />
          </ConfigProvider>
        </label>
      {/* </form> */}
    </div>
  );
}
