import React, { forwardRef, use, useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import YoutuberCard from './YoutuberCard';
import '../assets/youtubers.css'
import AddChannelForm from './addChannelForm/AddChannelForm'
import FadeContent from './fade/FadeContent';
import AlbumCoverCard from './albumCoverCard/AlbumCoverCard';
import UploadButton from './uploadImagesButton/UploadButton';
import { Collapse, notification } from 'antd';
import { App } from 'antd';
import { useImperativeHandle, useRef } from 'react';
import DownloadSettingsForm from './downloadSettings/DownloadSettingsForm';
import { Switch, Button, Tooltip, Tour, Pagination } from 'antd';
import { useToggle } from './context/UseContext';
import { QuestionOutlined } from '@ant-design/icons';
import { useHomeContext } from './context/HomeContext';
import { resultToggle } from './context/ResultContext';



const Home = forwardRef(({collapseActiveKey, setCollapseActiveKey}, ref) => {
  const { message  } = App.useApp();
  const {setShowDock} = useToggle()
  const {setHomeTourEnabled, deleteChannelRef, searchBarRef, channelRef, downloadScreenValues, downloadScreenRefs} = useHomeContext();


  const [cardClicked, setCardClicked] = useState(false);
  const [searchUrl, setSearchURL] = useState([])
  const [downloadSettings, setDownloadSettings] = useState({});
  const [responseData, setResponseData] = useState({})
  const [skipDownload, setskipDownload] = useState(false);


//////////////////////////////////////////////////////////////////////////////////
  const [downloadType, setDownloadType] = useState('')
  const [channelData, setChannelData] = useState({channelsList : [], chosenChannel : '', editChannels : false}) //
  const [coverArtData, setCoverArtData] = useState({coverArtFileNames : [], coverArtChosen : '', prevCoverArtUsed : '', deleteCoverArt : false})
  const [gallerySettings, setGallerySettings] = useState({shownImages : [], imagesPerPage : 8, totalRecords : 10, showPagination : true, currentPaginationPage : 1 })

  const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultStatusCode, setResultStatusCode] = useState()


  const sseDownload = useRef()
  const [currentlyDownloaded, setCurrentlyDownloaded] = useState([])


  // const initialState = { paginationTotal : 10, showPagination : true, imagesPerPagination : 8, shownArt : [], }
  // function coverArtHandler(state, action){
  //   switch (action.type){
  //     case "togglePagination":
  //       return {
  //         showPagination : !state.showPagination
  //       }
  //     default:
  //       return state
  //   }
  // }
  // const [state, dispatcher] = useReducer(coverArtHandler, initialState)




  useImperativeHandle(ref, () => ({
    resetAll
  }));

  const handleCardClicked = async(channelName) => {
    setskipDownload(true)
    setCardClicked(true);
    setChannelData(prev => {return {...prev, chosenChannel : channelName}})
    setCoverArtData(prev => {return {...prev, prevCoverArtUsed: channelData.channelsList[channelName][1]}})
    setDownloadSettings({'skipDownloadingPrevDownload': true, "skipBeatsAndInstrumentals" : true, 'useTrackFilter' : true})
    setDownloadType('channel')
    getCoverArtData('channel')
  }

  async function getChannelsData(){
    const response = await axios.get('http://localhost:8080/channels');
    setChannelData(prev => {return {
      ...prev, channelsList : response.data
    }})
  }

  const chooseWhichImagesToShow = (e) =>{
    // changing the page
    const startAmount = (Number(e) - 1) * gallerySettings.imagesPerPage
    const endAmount = Number(e) * gallerySettings.imagesPerPage
    setGallerySettings(prev => {
      return {...prev, shownImages : prev.allImages.slice(startAmount, endAmount), currentPaginationPage : e}
    })
  }

  const handleAlbumCoverClicked = async(file) =>{
    setIsLoading(true)
    setShowDock(false)
    setCoverArtData(prev => {return {...prev, coverArtChosen : true}})
    setCurrentlyDownloaded([])
    const params = new URLSearchParams({
        url: searchUrl,
        channel: channelData.chosenChannel,
        albumCover: file,
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
        setChannelData(prev => {return {...prev, chosenChannel : null}})
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


  async function getCoverArtData(mode) {
    const albumCoverResponse = await axios.get('http://localhost:8080/getChannelAndArtCoverData');
    setCoverArtData(prev => {return {...prev, coverArtFileNames : albumCoverResponse.data.files, 
      showPrevUsedCoverArt : Boolean(albumCoverResponse.data.prevUsedCoverArtInfo.showPrevUsed), 
      prevUsedCoverArtFileNames : albumCoverResponse.data.prevUsedCoverArtInfo.prevUsedCoverArtData}}
    )

  
    if (coverArtData.showPrevUsedCoverArt){
      if (mode === 'playlist'){
        console.log('show all')
        const roundUp = Math.ceil(albumCoverResponse.data.files.length / gallerySettings.imagesPerPage) * 10;
        setGallerySettings(prev => {return {...prev, shownImages: albumCoverResponse.data.files.slice(0, gallerySettings.imagesPerPage), paginationTotal : roundUp, allImages:  albumCoverResponse.data.files}})
      }

    }else{
      if (mode === 'playlist'){
        console.log('hide prev used')
        const prevUsedCoverArtArr = Object.values(albumCoverResponse.data.prevUsedCoverArtInfo.prevUsedCoverArtData)
        console.log(prevUsedCoverArtArr)
        const filteredItems = albumCoverResponse.data.files.filter(item => !prevUsedCoverArtArr.includes(item))
        const roundUp = Math.ceil(filteredItems.length / gallerySettings.imagesPerPage) * 10;
        setGallerySettings(prev => {return {...prev, shownImages: filteredItems.slice(0, gallerySettings.imagesPerPage), paginationTotal : roundUp, allImages:  filteredItems}})
      }
    }

    if (mode === 'channel'){
      const roundUp = Math.ceil(albumCoverResponse.data.files.length / gallerySettings.imagesPerPage) * 10;
      setGallerySettings(prev => {return {...prev, shownImages: albumCoverResponse.data.files.slice(0, gallerySettings.imagesPerPage), paginationTotal : roundUp, allImages: albumCoverResponse.data.files}})
    } else if (mode === 'track'){
      const roundUp = Math.ceil(albumCoverResponse.data.files.length / gallerySettings.imagesPerPage) * 10;
      setGallerySettings(prev => {return {...prev, shownImages: albumCoverResponse.data.files.slice(0, gallerySettings.imagesPerPage), paginationTotal : roundUp, allImages: albumCoverResponse.data.files}})
    }
  }


  async function resetAll(){
    setCoverArtData(prev => {return {...prev, deleteCoverArt : false}})
    setChannelData(prev=> {return {...prev, editChannels : false}})
    setCardClicked(false);
    setCoverArtData(prev => {return {...prev, coverArtChosen : false}})
    await axios.get(`http://localhost:8080/reload`);
    getChannelsData();
    setCoverArtData(prev => {return {...prev, prevCoverArtUsed: null}})
    setGallerySettings(prev => {
      return {...prev, currentPaginationPage : 1, showPagination : true}
    })
  }


  async function downloadVideo(videosearchURL){
      if (videosearchURL.includes('https://youtu.be/') || videosearchURL.includes('https://www.youtube.com/watch?v=') ){
        setCardClicked(true);
        setDownloadType('track')
        setSearchURL(videosearchURL);
        getCoverArtData('track')
      }else if (videosearchURL.includes('playlist?list=')){
        setCardClicked(true);
        setSearchURL(videosearchURL);
        setDownloadType('playlist')
        getCoverArtData('playlist')
      }else{
        await Promise.resolve();
        message.error(`${videosearchURL} is not a valid URL`)
      }


  }


  const downloadItems= [{
    key: '1',
    label: 'Download Settings',
    children: <DownloadSettingsForm  downloadType={downloadType}
      setDownloadSettings={setDownloadSettings} skipDownload={skipDownload} 
      setskipDownload={setskipDownload} setPrevPlaylistArt={setCoverArtData}
      setGallerySettings={setGallerySettings} albumCoverFileNames={coverArtData.coverArtFileNames}
      imagesPerPage={gallerySettings.imagesPerPage}
    />
  }];

  const debugMode = () => {
    setCardClicked(true)
    // setAlbumCoverChosen(true)
    setCoverArtData(prev => {return {...prev, coverArtChosen : false}})
    setResultStatusCode(200)
    
    const data = {data: {message: 'All tracks downloaded successfully and can be foun…rs\\j03yp\\Documents\\TuneRip\\downloads\\Archimage999'}, statusCode : 200}
    setResponseData(data)
  }


  useEffect(()=> {
    getChannelsData();
    setResultStatusCode(null)
    setCurrentlyDownloaded([])
    setShowResult(false)
    setIsLoading(false)
    setCoverArtData(prev => {return {...prev, prevCoverArtUsed: null}})
    setCollapseActiveKey(['0'])
    setCoverArtData(prev => {return {...prev, deleteCoverArt : false}})
  }, []);


  const goBack = () => {
    setIsLoading(false)
    setShowResult(false)
    setCardClicked(false)
    setResultStatusCode(null)
    setCoverArtData(prev => {return {...prev, coverArtChosen : false}})
    setSearchURL('');
    setChannelData(prev => {return {...prev, editChannels : false}})
    setGallerySettings(prev => {return {...prev, currentPaginationPage : 1}})
    setDownloadSettings({})
    setskipDownload(false)
  }

  const handleChannelAdded = () => {
    getChannelsData();
  }

  const handleChannelRemoved = () => {
    getChannelsData();
  }

  const handleTour = () => {
    setCollapseActiveKey(['1'])
    if (downloadType === 'channel'){
      downloadScreenValues.setChannelDownloadTourEnabled(true)
    }else if (downloadType === 'track'){
      downloadScreenValues.setTrackDownloadTourEnabled(true)
    } else if (downloadType === 'playlist'){
      downloadScreenValues.setPlaylistDownloadTourEnabled(true)
    }else{
      notification.error('SOMETHING WENT WRONG WHEN TRYING TO ENABLE THE TOUR')
    } 
  }


  return (
    <div className='mb-[50px]'>
      <div >
        {cardClicked ? (
          coverArtData.coverArtChosen ? (
            <div>
                <>
                  <div className='text-white'>
                    {isLoading && !showResult && 
                    <>

                      <div className="rounded-lg mt-[150px] ">
                        {Loading(
                          downloadType === 'track' ? 'Track is downloading' : 'Tracks are downloading'
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
                <UploadButton refresh={getCoverArtData}/>
              </div>
              {downloadType === 'track' ?
                <div className='ml-[10px] mt-[30px]'>
                    <Tooltip title="help">
                        <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => handleTour()} />
                    </Tooltip>                      
                </div>
               : downloadType === 'channel' ?
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
              {/* <div className='flex justify-center  -mb-[56px] mr-[135px] text-red-500'>
                NEW
              </div>                 */}
              <div className=' downloadSettingsForm mt-5 mx-auto mb-10 w-150'> 
                <Collapse 
                  items={downloadItems} 
                  activeKey={collapseActiveKey}
                  onChange={(e)=>{setCollapseActiveKey(e)}}
                  />
              </div>
            </div>
            
              
            </div>        

            <div className='album-cover-containter '>
                {Object.entries(gallerySettings.shownImages).map((filename, index)=>(
                    <div key={filename} className={'mt-[20px] mb-[20px]'}>
                        <AlbumCoverCard 
                        filename={filename[1]}
                        cardClicked={()=>handleAlbumCoverClicked(filename[1])}
                        previousImg={coverArtData.prevCoverArtUsed}
                        edit={coverArtData.deleteCoverArt}
                        refresh={getCoverArtData}
                        key = {filename[1]}
                        imgClicked={''}
                        enlargenImg={false}
                        />
                    </div>                
                ))}
            </div>

               
          { Object.keys(coverArtData.coverArtFileNames).length > 0 && !Object.keys(downloadSettings).includes('addToExistingPlaylistSettings') &&
            <div className='mt-[0px] mb-[10px]'> 
              <Switch  onChange={() =>  setCoverArtData(prev => {return {...prev, deleteCoverArt : !coverArtData.deleteCoverArt}}) }/> 
            </div>      
            
          }
          {gallerySettings.showPagination &&
            <div className="flex mx-auto justify-center">
                <Pagination 
                current={gallerySettings.currentPaginationPage}
                showSizeChanger={false}
                defaultCurrent={1} 
                total={gallerySettings.paginationTotal} 
                onChange={(e)=> chooseWhichImagesToShow(e)}
                />
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
                        <AddChannelForm 
                        setSearchURL={downloadVideo}
                        handleChannelAdded={handleChannelAdded}
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
                      <div className='channel-container inline-block'
                      ref={Object.keys(channelData.channelsList).length > 0 ? channelRef : null}
                       >
                        { 
                        Object.entries(channelData.channelsList).map((item, index) =>(
                          <YoutuberCard
                            name = {item[0]}
                            channelPFP={item[0]}
                            onClick={()=>handleCardClicked(item[0])}
                            editChannels = {channelData.editChannels}
                            key = {item[0]}
                            handleChannelRemoved={handleChannelRemoved}
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
      {Object.keys(channelData.channelsList).length > 0  &&  !cardClicked && 
        <div className='mt-[20px] inline-block mb-[20px]' ref={deleteChannelRef}>
          <Switch onChange={() =>  setChannelData(prev => {return {...prev, editChannels : !channelData.editChannels}})} />        
            
        </div>      
      }

      {/* <Button onClick={()=> console.log(Object.keys(downloadSettings).includes('addToExistingPlaylistSettings'))}>click me</Button> */}
       {/* <Button onClick={()=> dispatcher({type: "togglePagination",})}>click me</Button> */}
    </div>
  )
})

export default Home;