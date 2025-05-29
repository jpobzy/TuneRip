import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import '../assets/albumCoverImages.css'

export default function AlbumCoversCard({filename, onclick}) {
  const [loadingAlbumCover, setLoadingAlbumCover] = useState(false);


  return (
    <div>
      
      <div className='image-card' onClick={onclick}>
        <img className='album-cover-image' src={`http://localhost:8080/getAlbumCovers/${filename}`}></img>
      </div>
    </div>
  )
}
