import React, { useEffect, useState } from 'react'
import 'assets/youtuberCard.css'
import minusIcon from 'assets/minusIcon.svg'
import { Button, Popconfirm } from 'antd';
import axios from 'axios';
import ElectricBorder from './electricBorder/ElectricBorder';
import { useHomeContext } from './context/HomeContext';
import electronImg from 'assets/electron.svg'


export default function YoutuberCard({name, channelPFP, onClick, editChannels, handleChannelRemoved, newestChannel}) {
  const {channelCardSettings} = useHomeContext();
  const [hover, setHover] = useState(false);
  const [imgFailedToLoad, setImgFailedToLoad] = useState(false)
  
  async function deleteChannel(){
    const deleteReq = await axios.delete('http://localhost:8080/deleteChannel', {data: {'channel': name}})
    if (deleteReq.status === 200 || deleteReq.status === 204) {
      handleChannelRemoved()
    } 
  }

  async function getImg(){
    const img = await axios.get(`http://localhost:8080/getChannelImage/${channelPFP}`)
    if (img.status === 200){
      return img
    }else{
      return electronImg
    }
  }

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
           
          </>
   
        }
        {/* <div className={editChannels ? "channel-card card-disabled": 'channel-card channel-card-hover'} onClick={onClick}>
          <img className="avatar" src={`http://localhost:8080/getChannelImage/${channelPFP}`} alt="channel" />

            {newestChannel === name && 
              <div className='inline-block absolute text-red-500 -mt-[10px] font-bold'>
                NEW
              </div>        
            }

          <div className="info">
            <h3 className="channel-name">{name}</h3>
          </div>
        </div> */}
      {/* card-disabled z-0 ebtest*/}
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
                <img className="avatar" src={`http://localhost:8080/getChannelImage/${channelPFP}`}   
                  // onLoad={() => }
                  onError={(e) => handleFailedImg(e)
                  }
                alt="channel" />
                {/* <img className="avatar" src={getImg()} alt="channel" /> */}
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


                <div className="info">
                  <div style={{color: channelCardSettings.cardSettings.textColor}} className='text-[15px]'>{name}</div>
                </div>
            </div>
          </ElectricBorder> 
        </div>
        </div>
        {/* <Button onClick={()=>console.log(channelCardSettings.cardSettings
)} >clocl me</Button> */}
    </>
  )
}


