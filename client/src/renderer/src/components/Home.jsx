import React, { forwardRef, use, useEffect, useState } from 'react'
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
import { Switch, Button, Tooltip, Tour } from 'antd';
import DownloadScreen from './downloadingScreen/DownloadScreen';
import { useToggle } from './context/UseContext';
import { QuestionOutlined } from '@ant-design/icons';
import { useHomeContext } from './context/HomeContext';
import { resultToggle } from './context/ResultContext';


const Home = forwardRef(({collapseActiveKey, setCollapseActiveKey}, ref) => {
  const { message, notification  } = App.useApp();
  const [users, setUsers] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [albumCoverChosen, setAlbumCoverChosen] = useState(false);
  const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
  const [chosenUser, setChosenUser] = useState([]);
  // const [coverChosen, setCoverChosen] = useState('')
  const [searchUrl, setSearchURL] = useState([])
  const [isTrack, setIsTrack] = useState(false)
  const [editUsers, setEditUsers] = useState(false)
  const [prevImg, setPrevImg] = useState(null)
  const [editImgCard, setEditImgCard] = useState(false)
  const [downloadSettings, setDownloadSettings] = useState({});
  const [responseData, setResponseData] = useState({})
  const [skipDownload, setskipDownload] = useState(false);
  const {setShowDock} = useToggle()
  const {setHomeTourEnabled, deleteUserRef, searchBarRef, userRef, downloadScreenValues, downloadScreenRefs} = useHomeContext();
  const [isUser, setIsUser] = useState(false)

  

  const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultStatusCode, setResultStatusCode] = useState()




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
    setIsLoading(true)
    setShowDock(false)
    // setCoverChosen(file);
    setAlbumCoverChosen(true);
    try{
      const response = await axios.get(`http://localhost:8080/download/`, {params: {
          url: searchUrl,
          user: chosenUser,
          albumCover: file,
          ...downloadSettings
        }});
      setResultStatusCode(response.status)
      if (response.status === 207){
        setIsLoading(false)
        setShowResult(true)
        setShowDock(true)
        setResponseData(
          {'data': response.data, 'statusCode': response.status}
        )
      }else if (response.status === 200){
        setIsLoading(false)
        setShowResult(true)
        setShowDock(true)
        setResponseData(
          {'data': response.data, 'statusCode': response.status}
        )
      }
    }catch (err){
      setIsLoading(false)
      setShowResult(true)
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

  const debugMode = () => {
    setCardClicked(true)
    setAlbumCoverChosen(true)
    setResultStatusCode(200)
    
    const data = {data: {message: 'All tracks downloaded successfully and can be foun…rs\\j03yp\\Documents\\TuneRip\\downloads\\Archimage999'}, statusCode : 200}
    setResponseData(data)
  }


  useEffect(()=> {
    setCollapseActiveKey(['0'])
    getUsers();
    setEditImgCard(false)
  }, []);


  const goBack = () => {
    setIsLoading(false)
    setShowResult(false)

    setCardClicked(false)
    setResultStatusCode(null)
    setAlbumCoverChosen(false)
    setSearchURL('');
    setChosenUser(null);
    setDownloadSettings({})
    setskipDownload(false)
  }

  const handleUserAdded = () => {
    getUsers();
  }

  const handleUserRemoved = () => {
    setEditUsers(false)
    getUsers();
  }

  const handleTour = () => {
    setCollapseActiveKey(['1'])
    if (isUser) {
      downloadScreenValues.setUserDownloadTourEnabled(true)
    }else if (isTrack) {
      downloadScreenValues.setTrackDownloadTourEnabled(true)
    }else{
      downloadScreenValues.setPlaylistDownloadTourEnabled(true)
    }
  }


  return (
    <div>
      <div >
        {cardClicked ? (
          albumCoverChosen ? (
            <div>
            {isLoading && !showResult && 
                <>
                    <div className="rounded-lg  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[90%] ">
                       {Loading('Tracks are downloading')}
                    </div>
                    
                </>
            } 
            {!isLoading && showResult && 
                <> 
                   <div className='bg-white fixed mt-[100px] w-[800px] mx-auto justify-center inset-x-0  rounded-lg results'>
                      {resultStatusCode === 200  && ResultSuccess('Successfully downloaded all tracks!', responseData.data.message, goBack)}
                      {resultStatusCode === 207  && ResultWarning('Some tracks failed to download', responseData.data.message, goBack)}   
                      {resultStatusCode === 400  && ResultError('Something went wrong, please check the logs', responseData.data.message, goBack)}    
                   </div>
                           
                </>
            }    
            </div>
          ) : (
          <div className='inlin'>
            <div className='mb-10 justify-center flex '>
              <div className='mt-[30px] ml-[50px]'>
                <UploadButton refresh={getNewAlbumCover}/>
              </div>
              {isTrack ?
                <div className='ml-[10px] mt-[30px]'>
                    <Tooltip title="help">
                        <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => handleTour()} />
                    </Tooltip>                      
                </div>
               : isUser ?
                <div className='ml-[10px] mt-[30px]'>
                    <Tooltip title="help">
                        <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => handleTour()} />
                    </Tooltip>                      
                </div>
              :
                <div className='ml-[10px] mt-[30px]'>
                    <Tooltip title="help">
                        <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => handleTour()} />
                    </Tooltip>                      
                </div>
              }
            </div>

            <div className='mx-auto text-center text-gray-200 text-[50px] -mt-[30px] z-10 font-bold '>
              Choose an album cover
            </div>            
            <div className='downloadSettingsForm mt-5 mx-auto mb-10 w-150'> 
              <Collapse 
                items={downloadItems} 
                // defaultActiveKey={'1'} 
                activeKey={collapseActiveKey}
                // onChange={(e)=>console.log(`change: ${e}`)}
                onChange={(e)=>{setCollapseActiveKey(e); console.log(e)}}
                />
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
                        handleUserAdded={handleUserAdded}
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
                      {/* <div className='user-container inline-block' ref={userRef} > */}
                      <div className='user-container inline-block'
                      ref={Object.keys(users).length > 0 ? userRef : null}
                       >
                        { 
                        Object.entries(users).map((item, index) =>(
                          <YoutuberCard
                          name = {item[0]}
                          userPFP={item[0]}
                          onClick={()=>handleCardClicked(item[0])}
                          editUsers = {editUsers}
                          key = {index+1}
                          handleUserRemoved={handleUserRemoved}
                          // setReload={setUsers}
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
        <div className='mt-[20px] inline-block mb-[20px]' ref={deleteUserRef}>
          <Switch onChange={() => setEditUsers(!editUsers)} />        
        </div>      
      }

      {/* <Button type='primary' onClick={()=> debugMode()}>click me</Button> */}
      {/* <Button type='primary' onClick={()=> setIsLoading(!isLoading)}>load toggle</Button> */}
      {/* <Button type='primary' onClick={()=> console.log(collapseActiveKey)}>results toggle</Button> */}
    </div>
  )
})

export default Home;