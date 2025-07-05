import { useState } from 'react'
import { Skeleton } from '@mui/material';
import './albumCoverImages.css'

export default function AlbumCoverCard({filename, cardClicked, previousImg}) {
    const [loaded, setLoaded] = useState(false);

  return (
    <div >
        {!loaded && (  
            <Skeleton  variant="rectangular" width={150} height={150} />
        )}
        { filename && (
            <div className='img-wrapper' onClick={cardClicked}>
                <img 
                src={`http://localhost:8080/getAlbumCovers/${filename}`}
                className='album-cover-image' 
                style={{display: loaded ? 'block' : 'none'}}
                onLoad={() => setLoaded(true)}
                />
            </div>
        )}
    </div>
  );
}
