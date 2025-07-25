import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Flex, Spin, ConfigProvider, Result, Button } from 'antd';
import { App } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

function DownloadScreen ({loading, responseData}) {
  return (
    <div>
      {loading ? 
          <div>
            <div className=''>
              <Spin indicator={<LoadingOutlined spin style={{ fontSize: 50 }} />} size="large" />
            </div>
            <div>
              Tracks are downloading
            </div>
            
          </div> 
        :
        <div className='bg-white rounded-lg mx-auto w-[800px]'>
          {responseData.statusCode === 200 ?
            <Result
              status="success"
              title="Successfully downloaded all tracks!"
              subTitle={`${responseData.data.message}`}        
            /> 
            : responseData.statusCode === 207 ?
            <Result
              status="warning"
              title="Some tracks failed to download"
              subTitle={`${responseData.data.message} `}
              extra={
                <Button type="primary" key="console">
                  Go Console
                </Button>
              }
            /> :
            <Result
                status="error"
                title="Download Failed"
                subTitle={`${responseData.data.message}`}
              />
          }
          </div>
      }
    </div>
  )
}
  


export default DownloadScreen;