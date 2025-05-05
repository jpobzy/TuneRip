import React from 'react'

export default function YoutuberCard({name, thumbnailUrl}) {
    // const navigate = useNavigate();
    return (
    <div>
        {/* <div className="user-card" onClick={() => navigate(`/post/${user.id}`)}> */}
      <img className="avatar" src={thumbnailUrl} alt="user" />
      <div className="info">
        <h3>{name}</h3>
        <p>Email: </p>
        <p>Username: </p>
        <p>Phone: </p>
      </div>
    </div>
    // </div>
  )
}
