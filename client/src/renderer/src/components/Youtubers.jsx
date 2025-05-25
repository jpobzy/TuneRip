import React, { useEffect, useState } from 'react'
import axios from 'axios';
import YoutuberCard from './YoutuberCard';
import UploadImg from './UploadImg';
import AlbumCoversCard from './AlbumCoverCard';
import '../assets/youtubers.css'
import DownloadedShowcase from './DownloadedShowcase';
import { Palette } from 'color-thief-react';
import AddUserForm from '../components/AddUserForm'

export default function Youtubers({ onCardClick }) {

  const [users, setUsers] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [albumCoverChosen, setAlbumCoverChosen] = useState(false);
  const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
  const [chosenUser, setChosenUser] = useState([]);
  const [coverChosen, setCoverChosen] = useState([])
  const [albumCoverGradientsMap, setAlbumCoverGradientsMap] = useState({})


  const handleCardClicked = async(username) => {
    setCardClicked(true);
    setChosenUser(username)
    const response = await axios.get('http://localhost:8080/getAlbumCoverFileNames')
    setAlbumCoverFileNames(response.data.files)
    setAlbumCoverGradientsMap(response.data.paletteMap)
  }

  async function getUsers(){
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data)
  }

  const handleCoverClicked = async(file) =>{
    setAlbumCoverFileNames([])
  
    const response = await axios.get(`http://localhost:8080/download/${chosenUser}/${file}`);
    setCoverChosen(file)
    setAlbumCoverChosen(true)
  }


  async function resetAll(){
    setCardClicked(false)
    setAlbumCoverChosen(false)
  }


  useEffect(()=> {
    getUsers();
  }, []);
    
  return (
    <div>
    

      <div >
        {cardClicked ? (
          albumCoverChosen ? (
            // <DownloadedShodwcase albumCoverSrc={albumCoverGradientsMap[coverChosen]}/>
            <div>
                {albumCoverGradientsMap?.[coverChosen]?.length > 0 &&  <DownloadedShowcase albumCoverSrc={`http://localhost:8080/getAlbumCovers/${coverChosen}`} palette={albumCoverGradientsMap[coverChosen]}/>}
            
            </div>
           
          ) : (
          <div >
            <div className='album-cover-containter'>
            {Object.entries(albumCoverFileNames).map((filename, index)=>(
              <AlbumCoversCard
              filename={filename[1]}
              onclick={()=>handleCoverClicked(filename[1])}
              key ={index+1}
              />
            ))}

            </div>

            <div>
              <UploadImg />
            </div>
          </div>
     
          
          )
        ) : (
          <div >
              <h1 className='header'>Youtubers</h1>
            <div className='user-container'>
            { 
              Object.entries(users).map((item, index) =>(
              <YoutuberCard
                name = {item[0]}
                userPFP={item[0]}
                onClick={()=>handleCardClicked(item[0])}
                key = {index+1}
              />
            ))}
            </div>

            <AddUserForm />
          </div>
        )}
      </div>

      {<div>
        <button onClick={() => resetAll()}> reverse</button>
      </div> }


    </div>
  )
}
