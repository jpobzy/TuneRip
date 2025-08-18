import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import './uploadButton.css'
import { App } from 'antd';

export default function UploadButton({refresh}){
    const { message } = App.useApp();	
    const props = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:8080/uploadImg',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        refresh?.()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <div>
      <Upload 
        {...props} 
        showUploadList={false}
        accept='.png,.jpg,.jpeg'
      >
        <Button 
        className='custom-upload-button'
        icon={<UploadOutlined />}>Click to Upload your own album cover</Button>
      </Upload>      
    </div>

  );
}
