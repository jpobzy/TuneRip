import { useState } from 'react'
import './albumCoverImages.css'
import { Popconfirm } from 'antd';
import minusIcon from '../../assets/minusIcon.svg'
import axios from 'axios';

export default function AlbumCoverCard({filename, cardClicked, previousImg, edit, refresh}) {
    const [loaded, setLoaded] = useState(false);

    async function deleteImg() {
        const deleteReq = await axios.delete('http://localhost:8080/deleteimg', {data: {'filename': filename}})
        if (deleteReq.status === 200 || deleteReq.status === 204) {
            refresh?.()
        } 
    }

  return (
    <div >
        { filename && (
            <div className='relative'>
                {edit && 
                    <Popconfirm
                    title={`Delete the file "${filename}" ?`}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={deleteImg}
                    >
                        <img className='w-[30px] absolute z-1 ml-[20px] delete'  src={minusIcon} />
                        {/* <img className='w-[30px] absolute z-1 ml-[20px] delete'  src={minusIcon} onClick={()=>console.log(edit)} /> */}
                    </Popconfirm>     
                }
        
                <div className={edit ? 'editing ' : ''}>
                    <div className={previousImg == filename ? 'prev-img prev-img-wrapper': 'img-wrapper album-cover-image'} onClick={cardClicked}>
                        
                        <img
                        className='image'
                        src={`http://localhost:8080/getAlbumCovers/${filename}`}
                        // className='album-cover-image' 
                        // style={{display: loaded ? 'block' : 'none'}}
                        onLoad={() => setLoaded(true)}
                        />
    
                        {previousImg == filename && 
                            <div className='text-[16px] mx-auto text-white font-bold'>Last used</div>
                        }    
                    </div>
                </div>

            </div>
        )}

    </div>
  );
}
