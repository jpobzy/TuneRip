import React, { useState } from 'react';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button } from 'antd';

import '../assets/addUserForm.css';

export default function AddUserForm() {
  const { Search } = Input;
  const [user, setUser] = useState('');

  async function onSearch(value) {
    console.log('Search input:', value);

    const res = await fetch('http://localhost:8080/newUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ytLink: value }),
    });

    if (res.status === 200) {
      window.location.reload();
    }
  }

  return (
    <div>
      <br />
      <form
        className="user-form"
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
                  colorBgContainer: 'rgba(255, 255, 255, 0.336)', // idle background
                  colorText: 'rgb(8, 1, 1)', // input text color
                  colorTextPlaceholder: 'rgb(5, 0, 0)', // placeholder color
                },
                Button: {
                  defaultBg: 'rgba(255, 255, 255, 0.336)',
                  defaultBorderColor: '#6c757d',
                  defaultColor: 'rgb(8, 1, 1)',
                  defaultHoverColor: 'red', // example hover text color
                },
              },
            }}
          >
            <Search
              placeholder="Paste Youtuber URL Here"
              allowClear
              enterButton={
                <Button
                  className="custom-search-btn"
                  style={{
                    borderColor: '#6c757d',
                    color: 'rgb(8, 1, 1)', // corrected property
                  }}
                  variant="solid"
                >
                  Search
                </Button>
              }
              size="medium"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onSearch={onSearch}
              prefix={<UserOutlined />}
              style={{ width: 270 }}
            />
          </ConfigProvider>
        </label>
      </form>
    </div>
  );
}



import React, { useState, useRef } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button } from 'antd';


import '../assets/addUserForm.css'

export default function AddUserForm() {
    const inputRef = useRef();
    const buttonRef = useRef();

    const { Search } = Input;
    const suffix = (
      <AudioOutlined
        style={{
          fontSize: 16,
          color: '#1677ff',
        }}
      />
    );
    async function onSearch(value, _e, info)  {
        console.log('hello world')
        console.log(info === null || info === void 0 ? void 0 : info.source, value);
        const res = await fetch('http://localhost:8080/newUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ytLink: user })
        });

        if (res.status === 200) {
            window.location.reload();
        }
       
    }



    async function test1(e, user) {
        e.preventDefault(); // prevents page from instantly reloading
        buttonRef.current.disabled = true; 


    
    }

  return (
    <div>
        <br/> 
        <form className='user-form' >
            <label>
                
                {/* <input class="transparent-input" type='text' name="user" ref={inputRef}/> */}
                <div className=''>
                    {/* <Input className='input -w-120' size="medium" placeholder="Youtuber URL" ref={inputRef} prefix={<UserOutlined />} /> */}
                    <ConfigProvider
                        theme={{
                            components: {
                            Input: {
                                colorBgContainer: 'rgba(255, 255, 255, 0.336)', // idle background
                                // activeBg: 'rgba(255, 255, 255, 0.3)',     // background when focused
                                // hoverBg: 'rgba(255, 255, 255, 0.2)',      // background on hover
                                // addonBg: 'rgba(255, 255, 255, 0.15)',     // background of search button
                                // activeShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)', // subtle glow
                                // borderColor: 'rgba(255, 255, 255, 0.3)',  // border color
                                colorText: 'rgb(8, 1, 1)',                        // input text color
                                colorTextPlaceholder: 'rgb(5, 0, 0)',             // placeholder color
                                // borderRadius: 8,
                                
                            },
                            },
                        }}
                        >
                        <Search
                            placeholder="Paste Youtuber URL Here"
                            allowClear
                            enterButton={
                            <Button 
                                className='custom-search-btn'
                              style={{
                                    borderColor: '#6c757d',
                                    colorText: 'rgb(8, 1, 1)',
                                }}

                                inputStyle={{
                                    color: 'black',
                                }}
                            color="" variant="solid">
                                Search
                            </Button>
                            }
                            size="medium"
                            onSearch={onSearch}
                            style={{ width: 270 }}
                            
                        />
                        </ConfigProvider>
                </div>



                
            </label>
        </form>
    </div>
    
  )
}
