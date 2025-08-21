import React from 'react'
import '../assets/youtuberCard.css'
import minusIcon from '../assets/minusIcon.svg'
import { useState } from 'react';
import { Popconfirm } from 'antd';
import axios from 'axios';

export default function YoutuberCard({name, channelPFP, onClick, editChannels, handleChannelRemoved}) {
  const [hoverEnabled, setHoverEnabled] = useState(false);

  async function deleteChannel(){
    const deleteReq = await axios.delete('http://localhost:8080/deleteUser', {data: {'user': name}})
    if (deleteReq.status === 200 || deleteReq.status === 204) {
      // window.location.reload()
      handleChannelRemoved()
    } 
  }

  return (
    <div>
      {editChannels && 
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
      }
      <div className={editChannels ? "channel-card card-disabled": 'channel-card channel-card-hover'} onClick={onClick}>
        <img className="avatar" src={`http://localhost:8080/getImage/${channelPFP}`} alt="channel" />
        <div className="info">
          <h3 className="channel-name">{name}</h3>
        </div>
      </div>
    </div>
    
  )
}


