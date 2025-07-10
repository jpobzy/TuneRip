import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Flex, Spin, ConfigProvider, Result, Button } from 'antd';
import { App } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

function DownloadScreen ({loading, responseData}) {
  const { message } = App.useApp();
  const [data, setdata] = useState({})
  async function print(){
    const request = await axios.get('http://localhost:8080/test')
    setdata(
      {'data' : request.data,
      'hello world':" dsasda",
      'goodbye':' dsad'}
    )
  }

  return (
    <div>

      {loading ? 
          <div>
            <div>
              <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }} />} size="large" />
            </div>
            <div>
              Tracks are downloading
            </div>
            
          </div> 
        :
        <div className='bg-white rounded-lg mx-auto w-[900px]'>

        {/* <Result
          status="success"
          title="Successfully downloaded all tracks!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button key="buy">Home</Button>,
          ]}
        />     */}

          <Result
            status="warning"
            title="Some tracks failed to download"
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={
              <Button type="primary" key="console">
                Go Console
              </Button>
            }
          />
          <Button type="primary" key="amongus" onClick={print}>
                Go Console
            </Button>
          <Button type="primary" key="asda" onClick={()=> console.log(responseData)}>
              data
          </Button>
          </div>
      }
    </div>
  )
}
  


export default DownloadScreen;