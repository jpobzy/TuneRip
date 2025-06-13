import React, { forwardRef, useEffect, useState } from 'react'
import axios from 'axios';
import YoutuberCard from './YoutuberCard';
import '../assets/youtubers.css'
import DownloadedShowcase from './DownloadedShowcase';
import AddUserForm from './addUserForm/AddUserForm'
import FadeContent from './FadeContent';
import AlbumImage from './AlbumCoverCard';
import UploadButton from './UploadButton';
import { message, Collapse } from 'antd';
import { useImperativeHandle, useRef } from 'react';
import DownloadSettingsForm from './downloadSettings/downloadSettingsForm';

const Youtubers = forwardRef((props, ref) => {

  const [users, setUsers] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [albumCoverChosen, setAlbumCoverChosen] = useState(false);
  const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
  const [chosenUser, setChosenUser] = useState([]);
  const [coverChosen, setCoverChosen] = useState('')
  const [albumCoverGradientsMap, setAlbumCoverGradientsMap] = useState({})
  const [searchUrl, setSearchURL] = useState([])
  const inputRef = useRef(null);
  const [isTrack, setIsTrack] = useState(false)

  useImperativeHandle(ref, () => ({
    resetAll
  }));

  const handleCardClicked = async(username) => {
    setCardClicked(true);
    setChosenUser(username)
    setIsTrack(false);
  }

  async function getUsers(){
    const response = await axios.get('http://localhost:8080/users');
    setUsers(response.data);

    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
    setAlbumCoverGradientsMap(albumCoverResponse.data.paletteMap);
  }

  const handleAlbumCoverClicked = async(file) =>{
      const response = await axios.get(`http://localhost:8080/download/`, {params: {
          url: searchUrl,
          user: chosenUser,
          albumCover: file
        }});
    setCoverChosen(file);
    setAlbumCoverChosen(true);
    setSearchURL('');
    setChosenUser(null);

  }

  async function getNewAlbumCover() {
    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
    setAlbumCoverGradientsMap(albumCoverResponse.data.paletteMap);
  }


  async function resetAll(){
    setCardClicked(false);
    setAlbumCoverChosen(false);
    await axios.get(`http://localhost:8080/reload`);
    getUsers();
    console.log('reset to home')
  }


  async function downloadVideo(videosearchURL){
      if (videosearchURL.includes('https://youtu.be/') || videosearchURL.includes('https://www.youtube.com/watch?v=') ){
        setCardClicked(true);
        setIsTrack(true);
        setSearchURL(videosearchURL);
      }else if (videosearchURL.includes('list=PL')){
        setCardClicked(true);
        setSearchURL(videosearchURL);
      }else{
        await Promise.resolve();
        message.error(`${videosearchURL} is not a valid URL`)
      }
  }

  const downloadItems= [{
    key: '1',
    label: 'Download Settings',
    children: <DownloadSettingsForm isTrack={isTrack} />
  }];




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
            <div className='-mt-30 mb-10'>
              <UploadButton refresh={getNewAlbumCover} />
            </div>
            <div>
               {<h1 className='header1 text-5xl font-bold mb-15 text-gray-200'>Choose an album cover</h1>} 
            </div>
            <div className='downloadSettingsForm mt-10 mx-auto mb-10 w-150'> 
              <Collapse items={downloadItems} defaultActiveKey={['0']} />
            </div>
            <div className='album-cover-containter'>
            {Object.entries(albumCoverFileNames).map((filename, index)=>(
              <AlbumImage 
              filename={filename[1]}
              cardClicked={()=>handleAlbumCoverClicked(filename[1])}
              key ={index+1}
              />
            ))}
            </div>
      
          </div>
     
          
          )
        ) : (
          <div >

                  <FadeContent  blur={true} duration={2000} easing="ease-out" initialOpacity={0}>
                    {/* Anything placed inside this container will be fade into view */
                    <div>
                      <div className='-mt-40' >
                        <AddUserForm 
                        setSearchURL={downloadVideo}
                        />
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
})

export default Youtubers