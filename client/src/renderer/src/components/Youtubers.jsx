import React, { useEffect, useState } from 'react'
import axios from 'axios';
import YoutuberCard from './YoutuberCard';
import UploadImg from './UploadImg';
import AlbumCoversCard from './AlbumCoverCard';
import '../assets/youtubers.css'
import DownloadedShowcase from './DownloadedShowcase';
import { Palette } from 'color-thief-react';
import AddUserForm from './addUserForm/AddUserForm'
import FadeContent from './FadeContent';
import AlbumImage from './AlbumImage';

export default function  Youtubers({ onCardClick }) {

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

  }

  async function getUsers(){
    const response = await axios.get('http://localhost:8080/users');
    setUsers(response.data)

    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames')
    setAlbumCoverFileNames(albumCoverResponse.data.files)
    setAlbumCoverGradientsMap(albumCoverResponse.data.paletteMap)
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
    await axios.get(`http://localhost:8080/reload`)
    getUsers()
  }


  useEffect(()=> {
    getUsers();
  }, []);
    
  return (
    <div>
    

      <div >
        {cardClicked ? (
          albumCoverChosen ? (
            <div>
                {albumCoverGradientsMap?.[coverChosen]?.length > 0 &&  <DownloadedShowcase albumCoverSrc={`http://localhost:8080/getAlbumCovers/${coverChosen}`} palette={albumCoverGradientsMap[coverChosen]}/>}
            </div>
          ) : (
          <div >
            <div>
               {<h1 className='header1 text-5xl font-bold -mt-20 mb-15 text-gray-200'>Choose an album cover</h1>}
            </div>
            <div className='album-cover-containter'>
            {Object.entries(albumCoverFileNames).map((filename, index)=>(
              <AlbumImage 
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
                  <FadeContent  blur={true} duration={2000} easing="ease-out" initialOpacity={0}>
                    {/* Anything placed inside this container will be fade into view */
                    <div>
                      <div className='-mt-40' >
                        <AddUserForm />
                      </div>
                      <div>
                        {<h1 className='header1 text-5xl font-bold mt-10 mb-5 text-gray-200'>Youtubers</h1>}
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
                      </div>
                    </div>
                }
              </FadeContent>

          </div>
        )}
      </div>

      {<div>
        <button onClick={() => resetAll()}> reverse</button>
      </div> }


    </div>
  )
}
