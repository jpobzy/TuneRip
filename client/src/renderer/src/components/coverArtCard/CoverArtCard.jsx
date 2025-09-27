import { useEffect, useState } from 'react'
import './CoverArtImages.css'
import { Button, Popconfirm, Image} from 'antd';
import minusIcon from '../../assets/minusIcon.svg'
import axios from 'axios';
import { useToggle } from '../context/UseContext';


export default function CoverArtCard({filename, cardClicked, previousImg, edit, refresh, imgClicked, enlargenImg, prevChannelCoverArtArr}) {
    const [loaded, setLoaded] = useState(false);
    const {setDisableDockFunctionality} = useToggle()

    async function deleteImg() {
        setDisableDockFunctionality(true)
        const deleteReq = await axios.delete('http://localhost:8080/deleteimg', {data: {'filename': filename}})
        if (deleteReq.status === 200 || deleteReq.status === 204) {
            refresh?.()
        } 
        setDisableDockFunctionality(false)
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
                        <img className='w-[30px] absolute z-1 ml-[20px] delete -mt-[10px]'  src={minusIcon} />
                        {/* <img className='w-[30px] absolute z-1 ml-[20px] delete'  src={minusIcon} onClick={()=>console.log(edit)} /> */}
                    </Popconfirm>     
                }
        
                <div className={edit ? 'editing ' : ''}>
                    <div 
                    className={previousImg === filename ? 'prev-img prev-img-wrapper' 
                    : imgClicked === filename && enlargenImg === true ? "mt-[200px]"
                    : imgClicked === filename ? 'img-to-merge' 
                    : 'img-wrapper cover-art-image'} 
                    onClick={enlargenImg === true ? null : cardClicked}
                    >
                        <Image 
                        className='image relative'
                        src={`http://localhost:8080/getCoverArt/${filename}`} 
                        preview={enlargenImg}
                        // style={{display: loaded ? 'block' : 'none'}}
                        onLoad={() => setLoaded(true)}
                        />
    
                        {previousImg === filename && loaded &&
                            <div className='text-[16px] absolute left-1/2 w-full -translate-x-1/2 justify-center  text-center text-white font-bold '>Last used</div>
                        }    

                        {imgClicked === filename && enlargenImg !== true && loaded &&
                            <div className='text-[16px] absolute mx-auto justify-center left-1/2 w-full -translate-x-1/2  text-white font-bold mt-[5px]'>New cover art</div>
                        }    

                        {prevChannelCoverArtArr && prevChannelCoverArtArr.includes(filename) === true && previousImg !== filename && loaded &&
                            <>
                                <div className='text-[16px] absolute justify-center left-1/2 w-full -translate-x-1/2 text-center text-white font-bold '>
                                    Used elsewhere
                                </div>
                            </>    
                        }
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}
