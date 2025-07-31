import React, { forwardRef, useEffect, useState } from 'react'
import axios from 'axios';
import YoutuberCard from './YoutuberCard';
import '../assets/youtubers.css'
import AddUserForm from './addUserForm/AddUserForm'
import FadeContent from './fade/FadeContent';
import AlbumCoverCard from './albumCoverCard/AlbumCoverCard';
import UploadButton from './uploadImagesButton/UploadButton';
import { Collapse } from 'antd';
import { App } from 'antd';
import { useImperativeHandle, useRef } from 'react';
import DownloadSettingsForm from './downloadSettings/DownloadSettingsForm';
import { Switch, Button, Tooltip } from 'antd';
import DownloadScreen from './downloadingScreen/DownloadScreen';
import { useToggle } from './context/UseContext';
import { QuestionOutlined } from '@ant-design/icons';
import { useHomeContext } from './context/HomeContext';

const Youtubers = forwardRef((props, ref) => {
  const { message } = App.useApp();
  const [users, setUsers] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [albumCoverChosen, setAlbumCoverChosen] = useState(false);
  const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
  const [chosenUser, setChosenUser] = useState([]);
  const [coverChosen, setCoverChosen] = useState('')
  const [searchUrl, setSearchURL] = useState([])
  const inputRef = useRef(null);
  const [isTrack, setIsTrack] = useState(false)
  const [edit, setEdit] = useState(false)
  const [reloadUserDataBool, setReload] = useState(false) 
  const [prevImg, setPrevImg] = useState(null)
  const [editImgCard, setEditImgCard] = useState(false)
  const [downloadSettings, setDownloadSettings] = useState({});
  const [loading, setLoading] = useState(true)
  const [responseData, setResponseData] = useState({})
  const [skipDownload, setskipDownload] = useState(false);
  const {showDock, setShowDock} = useToggle()
  const {setHomeTourEnabled, deleteUserRef, searchBarRef, userRef} = useHomeContext();
  const [prevPlaylistArt, setPrevPlaylistArt] = useState([])
  const [isUser, setIsUser] = useState(false)

  useImperativeHandle(ref, () => ({
    resetAll
  }));

  const handleCardClicked = async(username) => {
    setskipDownload(true)
    setCardClicked(true);
    setChosenUser(username)
    setIsTrack(false);
    setPrevImg(users[username][1])
    setDownloadSettings({'skipDownloadingPrevDownload': true, "skipBeatsAndInstrumentals" : true})
    setIsUser(true)
  }

  async function getUsers(){
    const response = await axios.get('http://localhost:8080/users');
    setUsers(response.data);
    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
  }

  const handleAlbumCoverClicked = async(file) =>{
    setLoading(true)
    setShowDock(false)
    setCoverChosen(file);
    setAlbumCoverChosen(true);
    try{
      const response = await axios.get(`http://localhost:8080/download/`, {params: {
          url: searchUrl,
          user: chosenUser,
          albumCover: file,
          ...downloadSettings
        }});

      if (response.status === 207){
        setLoading(false)
        setShowDock(true)
        setResponseData(
          {'data': response.data, 'statusCode': response.status}
        )
      }else if (response.status === 200){
        setLoading(false)
        setShowDock(true)
        setResponseData(
          {'data': response.data, 'statusCode': response.status}
        )
      }
    }catch (err){
      setLoading(false)
      setShowDock(true)
      setResponseData(
         {'data': {'message': err.response.data.message}, 'statusCode': err.status}
      )      
    }  

    
    // reset values 
    setSearchURL('');
    setChosenUser(null);
    setDownloadSettings({})
    setskipDownload(false)
  }

  async function getNewAlbumCover() {
    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
  }


  async function resetAll(){
    setCardClicked(false);
    setAlbumCoverChosen(false);
    await axios.get(`http://localhost:8080/reload`);
    getUsers();
  }


  async function downloadVideo(videosearchURL){
    //https://www.youtube.com/playlist?list=PLQLeP-y1PipMahmS_f1vCSKNvNee3ytnG
      if (videosearchURL.includes('https://youtu.be/') || videosearchURL.includes('https://www.youtube.com/watch?v=') ){
        console.log('link is track')
        setCardClicked(true);
        setIsTrack(true);
        setSearchURL(videosearchURL);
        setIsUser(false)
      }else if (videosearchURL.includes('playlist?list=')){
        setCardClicked(true);
        setSearchURL(videosearchURL);
        setIsUser(false)
        setIsTrack(false);
      }else{
        await Promise.resolve();
        message.error(`${videosearchURL} is not a valid URL`)
      }
  }




  const downloadItems= [{
    key: '1',
    label: 'Download Settings',
    children: <DownloadSettingsForm isTrack={isTrack} isUser={isUser} setDownloadSettings={setDownloadSettings} skipDownload={skipDownload} setskipDownload={setskipDownload} setPrevPlaylistArt={setPrevImg}/>
  }];




  useEffect(()=> {
    getUsers();
    setEditImgCard(false)
  }, []);


    


  return (
    <div>
      {/* <br /> */}

      <div >
        {cardClicked ? (
          albumCoverChosen ? (
            <div>
              <div className='mx-auto'>
                <DownloadScreen loading={loading} responseData={responseData}/>                
              </div>
              {/* <button onClick={()=> setLoading(!loading)} >loading</button> */}
            </div>
          ) : (
          <div className='inline-block'>
            <div className='mb-10  relative '>
              <div className='flex  justify-center mt-[30px]'>
                <UploadButton refresh={getNewAlbumCover} />
              </div>
            </div>

            <div className='mx-auto text-center text-gray-200 text-[50px] -mt-[30px] z-10 font-bold '>
              Choose an album cover
            </div>            
            <div className='downloadSettingsForm mt-5 mx-auto mb-10 w-150'> 
              <Collapse items={downloadItems} defaultActiveKey={['0']} />
            </div>

            <div className='album-cover-containter'>
            {Object.entries(albumCoverFileNames).map((filename, index)=>(
              <AlbumCoverCard 
              filename={filename[1]}
              cardClicked={()=>handleAlbumCoverClicked(filename[1])}
              previousImg={prevImg}
              edit={editImgCard}
              refresh={getNewAlbumCover}
              key = {index+1}
              />
            ))}
            </div>

          { Object.keys(albumCoverFileNames).length > 0 &&
            <div className='mt-[20px]'> 
              <Switch onChange={() => setEditImgCard(!editImgCard)} />        
            </div>      
          }

           </div>
          )
        ) : (
          <div >
              <FadeContent  blur={true} duration={2000} easing="ease-out" initialOpacity={0}>
                {/* Anything placed inside this container will be fade into view */
                <div>
                  <div className='relative'>
                    <div className='flex  justify-center '>
                      <div className='inline-block mt-[30px]' ref={searchBarRef}>
                        <AddUserForm 
                        setSearchURL={downloadVideo}
                        />                        
                      </div>
                    </div>
                    <div className='flex -mt-9 justify-center ml-[545px]'>
                        <Tooltip title="help">
                            <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setHomeTourEnabled(true)} />
                        </Tooltip>                      
                    </div>
                  </div>
                  <div>
                    {<h1 className='header1 text-5xl font-bold mt-10 mb-5 text-gray-200'>TuneRip</h1>}
                      <div className='user-container inline-block' ref={userRef} >
                        { 
                        Object.entries(users).map((item, index) =>(
                          <YoutuberCard
                          name = {item[0]}
                          userPFP={item[0]}
                          onClick={()=>handleCardClicked(item[0])}
                          edit = {edit}
                          key = {index+1}
                          setReload={setUsers}
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
      {Object.keys(users).length > 0  &&  !cardClicked && 
        <div className='mt-[20px] inline-block' ref={deleteUserRef}>
          <Switch onChange={() => setEdit(!edit)} />        
        </div>      
      }
      {/* <Button onClick={()=> console.log(`download settings: ${JSON.stringify(downloadSettings)}`)}>click me</Button> */}
      {/* <Button onClick={()=> console.log(isUser)}>click me</Button> */}
    </div>
  )
})

export default Youtubers