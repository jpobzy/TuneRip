import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import '../assets/test.css'

export default function UploadButton({refresh}){
    const props = {
    name: 'file',
    action: 'http://localhost:8080/uploadImg',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        refresh?.()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
  <Upload {...props} showUploadList={false}>
    <Button 
    className='custom-upload-button'
    icon={<UploadOutlined />}>Click to Upload your own album cover</Button>
  </Upload>
  );
}
