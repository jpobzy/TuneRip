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
import { Switch, Button, Tooltip, Tour, Pagination } from 'antd';
import { useToggle } from './context/UseContext';
import { QuestionOutlined } from '@ant-design/icons';
import { useHomeContext } from './context/HomeContext';
import { resultToggle } from './context/ResultContext';
import CoverArtChanger from './CoverArtChanger/CoverArtChanger';


const Home = forwardRef(({collapseActiveKey, setCollapseActiveKey}, ref) => {
  const { message, notification  } = App.useApp();
  const [users, setUsers] = useState([]);
  const [cardClicked, setCardClicked] = useState(false);
  const [albumCoverChosen, setAlbumCoverChosen] = useState(false);
  const [albumCoverFileNames, setAlbumCoverFileNames] = useState([]); // for all the cover file names: 1.jpg, 2.jpg, 3...
  const [chosenUser, setChosenUser] = useState([]);
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
  const [switchToggled, setSwitchToggled] = useState(false)
  const [shownImages, setShownImages] = useState([])
  const [imgClicked, setImgClicked] = useState('')
  const [pagnationPages, setPagnationPages] = useState(10)
  const imagesPerPage = 8

  const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultStatusCode, setResultStatusCode] = useState()


  const sseDownload = useRef()
  const [currentlyDownloaded, setCurrentlyDownloaded] = useState(
    []
  )

  useImperativeHandle(ref, () => ({
    resetAll
  }));

  const handleCardClicked = async(username) => {
    setskipDownload(true)
    setCardClicked(true);
    setChosenUser(username)
    setIsTrack(false);
    setPrevImg(users[username][1])
    setDownloadSettings({'skipDownloadingPrevDownload': true, "skipBeatsAndInstrumentals" : true, 'useTrackFilter' : true})
    setIsUser(true)
  }

  async function getUsers(){
    const response = await axios.get('http://localhost:8080/users');
    setUsers(response.data);
    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
  }

    const chooseWhichImagesToShow = (e) =>{
        const startAmount = (Number(e) - 1) * imagesPerPage
        const endAmount = Number(e) * imagesPerPage
        setShownImages(albumCoverFileNames.slice(startAmount, endAmount))
    }

  const handleAlbumCoverClicked = async(file) =>{
    setIsLoading(true)
    setShowDock(false)
    setAlbumCoverChosen(true)
    setCurrentlyDownloaded([])
    const params = new URLSearchParams({
        url: searchUrl,
        user: chosenUser,
        albumCover: file,
        // downloadsettings : JSON.stringify(downloadSettings)
        ...downloadSettings
    });

    if (sseDownload.current){
      sseDownload.current.close()
      sseDownload.current = null
    }

    sseDownload.current = new EventSource(`http://localhost:8080/downloadStream?${params}`);
    const skipAddingList = ['Connected']
    sseDownload.current.onmessage = (event) => {
      const data = JSON.parse(event.data.replaceAll("'", '"'))
      const message = data.message


      if (data.statusCode){
        setResultStatusCode(parseInt(data.statusCode))
        setShowResult(true)
        setResponseData({message: message, statusCode: parseInt(data.statusCode)})
      
      } else if (!skipAddingList.includes(message)){
        setCurrentlyDownloaded(prev => {
          return [...prev, message]
        })        
      }

      if (message === 'Completed download'){
        setShowResult(true)
        console.log('closing session')
        sseDownload.current.close()
        sseDownload.current = null

        setIsLoading(false)
        setShowResult(true)
        setShowDock(true)
        setSearchURL('');
        setChosenUser(null);
        setDownloadSettings({})
        setskipDownload(false)
      }
    };

    sseDownload.current.onerror = (err) => {
      console.error("EventSource failed:", err);
      sseDownload.current.close()
      sseDownload.current = null
    };
  }


  async function getNewAlbumCover() {
    const albumCoverResponse = await axios.get('http://localhost:8080/getAlbumCoverFileNames');
    setAlbumCoverFileNames(albumCoverResponse.data.files);
    const roundUp = Math.ceil(albumCoverResponse.data.files.length / imagesPerPage) * 10;
    setPagnationPages(roundUp)

    setShownImages(albumCoverResponse.data.files.slice(0, imagesPerPage))
  }


  async function resetAll(){
    setCardClicked(false);
    setAlbumCoverChosen(false);
    await axios.get(`http://localhost:8080/reload`);
    getUsers();
  }


  async function downloadVideo(videosearchURL){
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
    getNewAlbumCover();
    setResultStatusCode(null)
    setCurrentlyDownloaded([])
    setShowResult(false)
    setIsLoading(false)
    setCollapseActiveKey(['0'])
    getUsers();
    setEditImgCard(false)
  }, []);


  const goBack = () => {
    getNewAlbumCover();
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
    <div className='mb-[50px]'>
      <div >
        {cardClicked ? (
          albumCoverChosen ? (
            <div>
                <>
                  <div className='text-white'>
                    {isLoading && !showResult && 
                    <>

                      <div className="rounded-lg mt-[150px] ">
                        {Loading(
                          isTrack ? 'Track is downloading' : 'Tracks are downloading'
                        )}
                      </div>                    
                      <div className="rounded-lg text-[15px]">
                        Currently downloaded:
                      </div>          
                      <div className="mx-auto">
                        {[...currentlyDownloaded].reverse().map((item, i) => (
                          <div className="mt-[20px]" key={i}>{item}</div>
                        ))}
                      </div>
                    </>

                      
                    }
                    {!isLoading && showResult && 
                      <> 
                        <FadeContent  blur={true} duration={750} easing="ease-out" initialOpacity={0}>
                          <div className='bg-white mt-[100px] w-[800px] mx-auto justify-center inset-x-0  rounded-lg results'>
                            
                            {resultStatusCode === 200  && String(responseData.message) === 'No new tracks to download were found' 
                              ? ResultSuccess('No New Downloads', responseData.message, goBack)
                              : ResultSuccess('Successfully downloaded all tracks!', responseData.message, goBack)
                            }
                              {resultStatusCode === 207  && ResultWarning('Some tracks failed to download', responseData.message, goBack)}   
                              {resultStatusCode === 400  && ResultError('Something went wrong, please check the logs', responseData.message, goBack)} 
                              
                          </div>
                        </FadeContent>       
                      </>
                  }  
            
                  </div>
                </>
            </div>
          ) : (
          <div className=''>
            <div className='mb-10 justify-center flex '>
              <div className='mt-[30px] ml-[50px] inline-block' ref={downloadScreenRefs.addCoverArtRef}>
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
            <div>
            <div className='mt-[50px]'>
              <div className='flex justify-center  -mb-[56px] mr-[135px] text-red-500'>
                NEW
              </div>                
              <div className=' downloadSettingsForm mt-5 mx-auto mb-10 w-150'> 
                <Collapse 
                  items={downloadItems} 
                  activeKey={collapseActiveKey}
                  onChange={(e)=>{setCollapseActiveKey(e); console.log(e)}}
                  />
              </div>
            </div>
            
              
            </div>        



              {/* <div className=' downloadSettingsForm mt-5 mx-auto mb-10 w-150'> 
                <Collapse 
                  items={downloadItems} 
                  activeKey={collapseActiveKey}
                  onChange={(e)=>{setCollapseActiveKey(e); console.log(e)}}
                  />
              </div> */}

            <div className='album-cover-containter '>
                {Object.entries(shownImages).map((filename, index)=>(
                    <div key={filename} className={'mt-[20px] mb-[20px]'}>
                        <AlbumCoverCard 
                        filename={filename[1]}
                        cardClicked={()=>handleAlbumCoverClicked(filename[1])}
                        previousImg={prevImg}
                        edit={editImgCard}
                        refresh={getNewAlbumCover}
                        key = {filename[1]}
                        imgClicked={imgClicked}
                        enlargenImg={false}
                        />
                    </div>                
                ))}
            </div>


          { Object.keys(albumCoverFileNames).length > 0 &&
            <div className='mt-[0px] mb-[10px]'> 
              <Switch  onChange={() => setEditImgCard(!editImgCard)} />        
            </div>      
          }

            <div className="flex mx-auto justify-center">
                <Pagination 
                showSizeChanger={false}
                defaultCurrent={1} 
                total={pagnationPages} 
                onChange={(e)=> chooseWhichImagesToShow(e)}
                />
            </div>

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
    </div>
  )
})

export default Home;