import React from 'react'
import '../assets/youtuberCard.css'

export default function YoutuberCard({name, userPFP, onClick}) {

  return (
    <div>
      <div className="user-card" onClick={onClick}>
      <img className="avatar" src={`http://localhost:8080/getImage/${userPFP}`} alt="user" />
        <div className="info">
          <h3 className="user-name">{name}</h3>
        </div>
      </div>
    </div>
    
  )
}
