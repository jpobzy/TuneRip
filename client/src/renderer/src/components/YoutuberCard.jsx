import React, { useEffect, useState } from 'react'
import 'assets/youtuberCard.css'
import minusIcon from 'assets/minusIcon.svg'
import { Button, Popconfirm, Upload, Image, Skeleton } from 'antd';
import axios from 'axios';
import ElectricBorder from './electricBorder/ElectricBorder';
import { useHomeContext } from './context/HomeContext';
import electronImg from 'assets/electron.svg'
import swapChannelPFPIcon from 'assets/swapChannelPFP.svg'


export default function YoutuberCard({name, channelPFP, onClick, editChannels, handleChannelRemoved, newestChannel, pfpVersions}) {
  const {channelCardSettings} = useHomeContext();
  const [hover, setHover] = useState(false);
  const [imgFailedToLoad, setImgFailedToLoad] = useState(false)
  const [rerender, setRerender] = useState('')
  const [imgLoaded, setImgLoaded] = useState(false)

  const getExtraData = (file) => ({
    channel: channelPFP
  });

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:8080/swap-channel-pfp',
    headers: {
      authorization: 'authorization-text',
    },
    data: getExtraData,
    multiple : false,
    showUploadList : false,
    progress: {
      showInfo: false 
    },    
    onChange(info) {
      if (info.file.status === 'done') {
        if (JSON.stringify(pfpVersions).includes(name)){
          setRerender(pfpVersions[name] + 1)
        }else{
          setRerender(1)
        }
        handleChannelRemoved()
      }
    },    
  };
  
  async function deleteChannel(){
    const deleteReq = await axios.delete('http://localhost:8080/deleteChannel', {data: {'channel': name}})
    if (deleteReq.status === 200 || deleteReq.status === 204) {
      handleChannelRemoved()
    
    } 
  }

  useEffect(()=>{
    if (Object.keys(pfpVersions).includes(name)){
      setRerender(pfpVersions[name])
    }
  },[])

  function handleFailedImg(e){
    e.target.src = electronImg
    setImgFailedToLoad(true)
  }

  return (
    <>
      <div>

        {editChannels && 
          <>
            <div className='relative z-999'>
              <Popconfirm
                title={`Delete the channel "${name}" ?`}
                okText="Yes"
                cancelText="No"
                onConfirm={deleteChannel}
              >
                <div className='w-[30px] absolute delete'>
                  <img src={minusIcon} className='delete' />
                </div>  
              </Popconfirm>             
            </div>
            <div> 
              <div className='w-[30px]  swapPFP'>
                <Upload {...uploadProps} 
                accept='.png,.jpg,.jpeg'              
                >
                    <img src={swapChannelPFPIcon} />        
                </Upload>
              </div>   
            </div>
          </>
        }
        <div className={`z-0 ebtest ${editChannels && 'card-disabled'}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
              background: hover ? channelCardSettings.cardSettings.hoverBackgroundColor : 'transparent',
              borderRadius: '45px',
              transform: hover ? 'scale(1.15)' : 'scale(1)', 
              transition: 'all 0.25s ease',
              boxShadow: hover ? `0 0 20px ${channelCardSettings.cardSettings.hoverBoxShadowColor}` : ''
          }}
        >
          <ElectricBorder
            color={channelCardSettings.electricBorderSettings.color}
            speed={channelCardSettings.electricBorderSettings.speed}
            chaos={channelCardSettings.electricBorderSettings.chaos}
            thickness={channelCardSettings.electricBorderSettings.thickness}
            style={{ borderRadius: channelCardSettings.electricBorderSettings.borderRadius }}
            disabled={channelCardSettings.electricBorderSettings.disabled}
          >
            <div className={editChannels ? "channel-card card-disabled": 'channel-card channel-card-hover'} 
            onClick={onClick}
            style={{
                height : '140px',
                border : `1px solid ${channelCardSettings.cardSettings.borderColor}`,
                borderRadius : '45px',
                background : channelCardSettings.cardSettings.backgroundColor,
              }}
            >
              
                <Image
                  key={rerender}
                  preview={false}
                  width={100}
                  className="avatar"
                  onError={(e) => handleFailedImg(e)}
                  src={`http://localhost:8080/getChannelImage/${channelPFP}?${rerender}`}  
                  onLoad={()=> setImgLoaded(true)}
                  placeholder={
                  <div className='absolute -mt-[50px] w-[100px]'>
                    <Skeleton.Image active={true} />
                  </div>
                }
                />
                  {newestChannel === name && 
                    <div className='inline-block absolute text-red-500 -mt-[10px] font-bold'>
                      NEW
                    </div>        
                  }
                  {imgFailedToLoad &&
                    <div className='inline-block absolute text-red-500 -mt-[15px] font-bold w-[100px]'>
                      ERROR CHANNEL PFP WAS NOT FOUND
                    </div>
                  }

                  {imgLoaded &&
                    <div className="info">
                      <div style={{color: channelCardSettings.cardSettings.textColor}} className='text-[15px]'>{name}</div>
                    </div>                          
                  }
            </div>
          </ElectricBorder> 
        </div>
      </div>
    </>
  )
}


