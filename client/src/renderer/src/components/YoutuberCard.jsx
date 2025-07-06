import React from 'react'
import '../assets/youtuberCard.css'
import minusIcon from '../assets/minusIcon.svg'
import { useState } from 'react';
import { Popconfirm } from 'antd';
import axios from 'axios';

export default function YoutuberCard({name, userPFP, onClick, edit}) {
  const [hoverEnabled, setHoverEnabled] = useState(false);

  async function deleteUser(){
    const deleteReq = await axios.delete('http://localhost:8080/deleteUser', {data: {'user': name}})
    console.log(`delete status ${deleteReq.status}`)
    if (deleteReq.status === 200 || deleteReq.status === 204) {
      window.location.reload()
    } 
  }

  return (
    <div>
      {edit && 
        <Popconfirm
          title={`Delete the user "${name}" ?`}
          okText="Yes"
          cancelText="No"
          onConfirm={deleteUser}
        >
          <div className='w-[30px] absolute delete'>
            <img src={minusIcon} onClick={()=>console.log(edit)} className='delete' />
          </div>  
        </Popconfirm>     
      }

      {/* <div className="user-card" onClick={onClick}> */}
      <div className={edit ? "user-card card-disabled": 'user-card user-card-hover'} onClick={onClick}>
        <img className="avatar" src={`http://localhost:8080/getImage/${userPFP}`} alt="user" />
        <div className="info">
          <h3 className="user-name">{name}</h3>
        </div>
      </div>
    </div>
    
  )
}


