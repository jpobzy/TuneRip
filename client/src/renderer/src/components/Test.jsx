import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadAlbumCover from './UploadAlbumCover'; // your upload button component

export default function MainComponent() {
  const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]);
  const [albumCoverGradientsMap, setAlbumCoverGradientsMap] = useState({});

  async function getNewAlbumCover() {
    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
    setAlbumCoverGradientsMap(albumCoverResponse.data.paletteMap);
  }

  useEffect(() => {
    getNewAlbumCover();
  }, []);

  return (
    <div>
      <UploadAlbumCover onUploadSuccess={getNewAlbumCover} />
      
      {/* render your album covers here */}
      <div className="album-cover-container">
        {albumCoverFileNames.map((filename) => (
          <img
            key={filename}
            src={`http://localhost:8080/getAlbumCovers/${filename}`}
            alt={filename}
            className="album-cover-image"
          />
        ))}
      </div>
    </div>
  );
}



import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

export default function UploadAlbumCover({ onUploadSuccess }) {
  const props = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);

        // 🔥 Trigger callback to refresh the parent
        onUploadSuccess?.();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
}
