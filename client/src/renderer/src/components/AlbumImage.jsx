import { useState } from 'react'
import { Skeleton } from '@mui/material';
import '../assets/albumCoverImages.css'

export default function AlbumImage({filename, onClick}) {
    const [loaded, setLoaded] = useState(false);

  return (
    <div >
        {!loaded && (  
            <Skeleton  variant="rectangular" width={150} height={150} />
        )}
        { filename && (
            <div className='img-wrapper'>
                <img 
                src={`http://localhost:8080/getAlbumCovers/${filename}`}
                className='album-cover-image'
                onClick={onClick}
                style={{display: loaded ? 'block' : 'none'}}
                onLoad={() => setLoaded(true)}
                />
            </div>
        )}
    </div>
  );
}
