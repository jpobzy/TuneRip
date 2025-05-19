import React from 'react'

export default function YoutuberCard({name, userPFP, onClick}) {

  return (
    <div>
      <div className="user-card" onClick={onClick}>
      <img className="avatar" src={`http://localhost:8080/getImage/${userPFP}`} alt="user" />
      <div className="info">
        <h3>{name}</h3>
      </div>
    </div>
    </div>
    
  )
}
