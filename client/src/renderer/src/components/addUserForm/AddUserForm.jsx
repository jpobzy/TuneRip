import React, { useState } from 'react';
import { UserOutlined, AudioOutlined } from '@ant-design/icons';
import { Input, ConfigProvider, Button } from 'antd';


export default function AddUserForm({setSearchURL}) {
  const { Search } = Input;
  const [user, setUser] = useState('');

  async function onSearch(value) {
    if (value.includes("@") ){
      const res = await fetch('http://localhost:8080/newUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ytLink: value }),
      });
      if (res.status === 200) {
        window.location.reload();
      }
    } else {
       setSearchURL(value);
    }


  }

  return (
    <div className='searchbar'> 
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
                  defaultHoverColor: 'red', // example hover text color\
                },
              },
            }}
          >
            <Search
              placeholder="Paste Youtuber Channel/Video URL Here"
              allowClear
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
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onSearch={onSearch}
              prefix={<UserOutlined />}
              style={{ width: 500 }}
            />
          </ConfigProvider>
        </label>
      </form>
    </div>
  );
}
