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
            <div className=''>
                <div className={previousImg == filename? 'prev-img prev-img-wrapper': 'img-wrapper album-cover-image'} onClick={cardClicked}>
                    
                    <img 
                    src={`http://localhost:8080/getAlbumCovers/${filename}`}
                    // className='album-cover-image' 
                    style={{display: loaded ? 'block' : 'none'}}
                    onLoad={() => setLoaded(true)}
                    />
  
                    {previousImg == filename && 
                            <div className='text-[16px] mx-auto text-white font-bold'>Previously used</div>
                    }    
                </div>

            </div>
        )}

    </div>
  );
}
