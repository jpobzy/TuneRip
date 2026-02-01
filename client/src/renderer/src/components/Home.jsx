import React, { forwardRef, use, useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import YoutuberCard from 'components/YoutuberCard';
import 'assets/home.css'
import AddChannelForm from 'components/addChannelForm/AddChannelForm'
import FadeContent from 'components/fade/FadeContent';
import CoverArtCard from 'components/coverArtCard/CoverArtCard';
import UploadButton from 'components/uploadImagesButton/UploadButton';
import { Collapse, notification } from 'antd';
import { App } from 'antd';
import { useImperativeHandle, useRef } from 'react';
import DownloadSettingsForm from 'components/downloadSettings/DownloadSettingsForm';
import { Switch, Button, Tooltip, Tour, Pagination, Result, ConfigProvider } from 'antd';
import { useToggle } from 'components/context/UseContext';
import { QuestionOutlined } from '@ant-design/icons';
import { useHomeContext } from 'components/context/HomeContext';
import { resultToggle } from 'components/context/ResultContext';
import AnimatedList from 'components/animatedList/AnimatedList';
import ShinyText from './shinyText/ShinyText';
import { FeedbackContext } from './context/FeedbackContext';

const Home = forwardRef(({collapseActiveKey, setCollapseActiveKey}, ref) => {
  const { message, notification  } = App.useApp();
  const {setShowDock} = useToggle()
  const {setHomeTourEnabled, deleteChannelRef, searchBarRef, channelRef, downloadScreenValues, downloadScreenRefs} = useHomeContext();
  const {feedback} = FeedbackContext()

  const [cardClicked, setCardClicked] = useState(false);
  const [searchUrl, setSearchURL] = useState([])
  const [downloadSettings, setDownloadSettings] = useState({});
  const [responseData, setResponseData] = useState({})
  const [skipDownload, setskipDownload] = useState(false);
  const [textFile, setTextFile] = useState({})
  
//////////////////////////////////////////////////////////////////////////////////
  const [downloadType, setDownloadType] = useState('')
  const [channelData, setChannelData] = useState({channelsList : [], chosenChannel : '', editChannels : false, newestChannel : ''}) //
  const [coverArtData, setCoverArtData] = useState({coverArtFileNames : [], coverArtChosen : '', prevCoverArtUsed : '', deleteCoverArt : false, prevChannelCoverArtArr : [], prevUsedCoverArtFileNames : null})
  const [gallerySettings, setGallerySettings] = useState({currentImagesShown : [], imagesPerPage : 8, totalRecords : 10, showPagination : true, currentPaginationPage : 1 })

  const {ResultSuccess, ResultWarning, Loading, ResultError} = resultToggle()
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultStatusCode, setResultStatusCode] = useState()


  const sseDownload = useRef()
  const [currentlyDownloaded, setCurrentlyDownloaded] = useState([])

  
  useImperativeHandle(ref, () => ({
    resetAll
  }));

  const handleChannelClicked = async(channelName) => {
    setskipDownload(true)
    setCardClicked(true);
    setChannelData(prev => {return {...prev, chosenChannel : channelName}})
    setCoverArtData(prev => {return {...prev, prevCoverArtUsed: channelData.channelsList[channelName][1]}})
    setDownloadSettings({'skipDownloadingPrevDownload': true, "skipBeatsAndInstrumentals" : true, 'useTrackFilter' : true})
    setDownloadType('channel')
    getCoverArtData('channel', channelData.channelsList[channelName][1])
    if (channelName === channelData.newestChannel){
      setChannelData(prev => {
        const copy = prev
        copy['newestChannel'] = ''
        return copy
      })
    }
  }

  async function getChannelsData(){
    const response = await axios.get('http://localhost:8080/channels');
    setChannelData(prev => {
      return {
      ...prev, channelsList : response.data.channels, pfpVersions : response.data.PFPversions
    }})
  }

  const chooseWhichImagesToShow = (e) =>{
    // changing the page
    const startAmount = (Number(e) - 1) * gallerySettings.imagesPerPage
    const endAmount = Number(e) * gallerySettings.imagesPerPage

    if (downloadType === 'channel' && gallerySettings.prevUsedChannelArr){
      setGallerySettings(prev => {
        if (prev.prevUsedChannelArr.length > 0){
          return {...prev, currentImagesShown : prev.prevUsedChannelArr.slice(startAmount, endAmount), currentPaginationPage : e}
        }
        return {...prev, currentImagesShown : prev.allImages.slice(startAmount, endAmount), currentPaginationPage : e}
      })  
    }else{
      setGallerySettings(prev => {
        return {...prev, currentImagesShown : prev.allImages.slice(startAmount, endAmount), currentPaginationPage : e}
      })      
    }


  }

  const handleCoverArtClicked = async(file, mode) =>{
    setIsLoading(true)
    setShowDock(false)
    
    setCurrentlyDownloaded([])
    const params = new URLSearchParams({
      url: searchUrl,
      channel: channelData.chosenChannel,
      coverArt: file,
      ...downloadSettings,
    });
    

    setCoverArtData(prev => {return {...prev, coverArtChosen : true}})
    if (Object.keys(textFile).length){

      const data = new FormData()
      data.append('file', textFile)
      const req = await axios.post('http://localhost:8080/saveTextFile', data).catch(function (error){
        if (error.response) {
          feedback.displayErrorNotification('Failed downloaded file')
          return
        }
      });      
      params.append('mode', 'textFile')
    }
    
    if (sseDownload.current){
      sseDownload.current.close()
      sseDownload.current = null
    }

    sseDownload.current = new EventSource(`http://localhost:8080/downloadStream?${params}`);
    const skipAddingList = ['Connected']
    sseDownload.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      const message = data.message
      console.log(`message: ${message}`)
      console.log(data)
      
      if (data.statusCode){
        setResultStatusCode(parseInt(data.statusCode))
        setShowResult(true)
        setResponseData({message: message, statusCode: parseInt(data.statusCode), downloadPath : data.downloadPath})  
      } else if (!skipAddingList.includes(message) && message !== 'Completed download'){
        if (!message.includes('Finished downloading track')){
            setCurrentlyDownloaded(prev => {
            return [...prev, message]
          })      
        }else{

          setCurrentlyDownloaded(prev => {
            const t = prev.map(e => 
              e.replaceAll('Currently downloading', 'Downloaded')
            )
            return t
          })       

        }
      }

      
      if (message === 'channelError'){
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



      if (message === 'Completed download'){
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
        const req = await axios.delete('http://localhost:8080/deleteTextFile')

      }
    };

    sseDownload.current.onerror = (err) => {
      console.error("EventSource failed:", err);
      sseDownload.current.close()
      sseDownload.current = null
    };
  }




  async function getCoverArtData(mode, prevUsedChannelImage) {
    const coverArtResponse = await axios.get('http://localhost:8080/getChannelAndArtCoverData');
    if (coverArtResponse.data.files.length === 0){
        feedback.displayInfoNotification('No cover art detected', 'Please upload cover art png/jpeg files in order to proceed with the download',)
        setCoverArtData(prev => {return {...prev, deleteCoverArt : false}}) 
        setGallerySettings(prev => {return {...prev,
          showPagination : false
        }})     
    }

    let imagesToShow = coverArtResponse.data.files
    let allExistingImages = coverArtResponse.data.files
    let roundUp = null
    let shownImages = coverArtResponse.data.files

    if (!mode){ // when refreshing/adding new image
      mode = downloadType
      prevUsedChannelImage = coverArtData.prevCoverArtUsed

      setGallerySettings(prev => {
        return {...prev, 
          currentPaginationPage : 1
        }
      })
    }else if (mode === 'track'){
      imagesToShow = coverArtResponse.data.files
      allExistingImages = coverArtResponse.data.files  
    }else{
      if (coverArtResponse.data.coverArtSettings.hidePrevUsed){
        const prevUsedCoverArtArr = Object.values(coverArtResponse.data.coverArtSettings.prevUsedCoverArtData) 
        shownImages = shownImages.filter(item => !prevUsedCoverArtArr.includes(item))
      }  

      if (mode ===  'channel'){
        if (prevUsedChannelImage && coverArtResponse.data.files.includes(prevUsedChannelImage)){
          const arrWithoutChannelImage = shownImages.filter(item => item !== prevUsedChannelImage)
          shownImages = [prevUsedChannelImage].concat(arrWithoutChannelImage)
        }
      }else if (mode === 'playlist'){
        if (coverArtResponse.data.coverArtSettings.deleteImagePostDownload){
          feedback.displayInfoNotification('Post download setting detected', 'Cover art will be deleted post download, change this setting in cover art settings',)
        }else if (coverArtResponse.data.coverArtSettings.moveImagetoSubfolderPostDownload){
          feedback.displayInfoNotification('Post download setting detected', 'Cover art will be moved to the subfolder post download, change this setting in cover art settings',) 
        }
      }

      allExistingImages = shownImages
      imagesToShow = shownImages  
      checkIfShownImagesIsEmpty(shownImages)
    }

    setCoverArtData(prev=>{
       const base = {...prev}

       if (mode === 'channel'){
        base.prevChannelCoverArtArr = Object.values(
          coverArtResponse.data.prevUsedChannelCoverArt
        )
       }else{
          base.coverArtFileNames = coverArtResponse.data.files
          base.prevUsedCoverArtFileNames  = coverArtResponse.data.coverArtSettings.prevUsedCoverArtData
       }
       return base
    })

    roundUp = Math.ceil(shownImages.length / gallerySettings.imagesPerPage) * 10;

    setGallerySettings(prev => {
        return {
            ...prev,
            currentImagesShown : imagesToShow.slice(0, gallerySettings.imagesPerPage), 
            paginationTotal : roundUp, 
            allImages : allExistingImages
        }
    })
  }


  function checkIfShownImagesIsEmpty(arr){
    if (arr.length === 0){
      feedback.displayErrorNotification('No unused images available','All current cover art files have already been used. Since the hide setting is enabled they are hidden. You can change this in the Cover Art settings')
    }
    return
  }


  async function resetAll(){
    // runs when home button in dock is clicked
    if (!cardClicked){
      return
    }

    setResponseData({})
    setCoverArtData(prev => {return {...prev, deleteCoverArt : false}})
    setChannelData(prev=> {return {...prev, editChannels : false, chosenChannel : ''}})
    setCardClicked(false);
    setCoverArtData(prev => {return {...prev, coverArtChosen : false}})
    await axios.get(`http://localhost:8080/reload`);
    getChannelsData();
    setDownloadSettings({})
    setCoverArtData(prev => {return {...prev, prevCoverArtUsed: null}})
    setTextFile({})
    setGallerySettings(prev => {
      return {...prev, currentPaginationPage : 1, showPagination : true, currentImagesShown : [], prevUsedChannelArr : []}
    })
  }


  async function downloadVideo(videosearchURL){
      if (videosearchURL.includes('https://youtu.be/') || videosearchURL.includes('https://www.youtube.com/watch?v=') || videosearchURL.includes('www.youtube.com/watch?v=')){
        setCardClicked(true);
        setDownloadType('track')
        setSearchURL(videosearchURL);
        getCoverArtData('track')
        setDownloadSettings({'useTrackFilter' : true})
      }else if (videosearchURL.includes('playlist?list=')){
        setCardClicked(true);
        setSearchURL(videosearchURL);
        setDownloadType('playlist')
        getCoverArtData('playlist')
        setDownloadSettings({"skipBeatsAndInstrumentals" : true, 'useTrackFilter' : true})

      }else{
        await Promise.resolve();
        message.error(`${videosearchURL} is not a valid URL`)
      }
  }


  const downloadItems= [{
    key: '1',
    label: downloadType === 'channel' ? 'Channel Download Settings' : downloadType === 'track' ? 'Track Download Settings ' : 'Playlist Download Settings' ,
    children: <DownloadSettingsForm  downloadType={downloadType}
      setDownloadSettings={setDownloadSettings} 
      skipDownload={skipDownload} 
      setskipDownload={setskipDownload} 
      setPrevPlaylistArt={setCoverArtData}
      setGallerySettings={setGallerySettings} 
      coverArtFileNames={coverArtData.coverArtFileNames}
      imagesPerPage={gallerySettings.imagesPerPage}
      coverArtData={coverArtData}
    />
  }];


  useEffect(()=> {
    getChannelsData();
    setResultStatusCode(null)
    setCurrentlyDownloaded([])
    setShowResult(false)
    setIsLoading(false)
    setCoverArtData(prev => {return {...prev, prevCoverArtUsed: null, deleteCoverArt : false}})
    setCollapseActiveKey(['0'])
    // setCoverArtData(prev => {return {...prev}})
    setChannelData(prev => {return {...prev, editChannels : false, chosenChannel : ''}})
    setShowDock(true)
  }, []);


  const goBack = () => {
    setIsLoading(false)
    setShowResult(false)
    setCardClicked(false)
    setResultStatusCode(null)
    setCoverArtData(prev => {return {...prev, coverArtChosen : false}})
    setSearchURL('');
    setChannelData(prev => {return {...prev, editChannels : false, chosenChannel : ''}})
    setGallerySettings(prev => {return {...prev, currentPaginationPage : 1}})
    setDownloadSettings({})
    setskipDownload(false)
    setShowDock(true)
    getChannelsData()
  }

  const handleChannelAdded = (channel) => {
    setChannelData(prev => {
      const copy = prev
      copy['newestChannel'] = channel.replace('Successfully added channel: ', '')
      copy['editChannels'] = false
      return copy
    })
    getChannelsData();

  }

  function handleChannelRemoved(){
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



  
  const txtFileUploadProps = {
    name: 'file',
    beforeUpload : (file) => {
      setTextFile(file)
      setCardClicked(true)
      getCoverArtData('textFile')
      setDownloadType('textFile')
      return false; },
      onChange(info) {
        // console.log('hi')
      },
  };


  return (
    <>
      <div className='mb-[35px]'>
        <div >
          {cardClicked ? (
            coverArtData.coverArtChosen ? (
              <>
                <div className='text-white'>
                  <div className='relative'>
                    <div className='flex justify-center '>
                      {!isLoading && showResult && 
                        <> 
                          <FadeContent  blur={true} duration={750} easing="ease-out" initialOpacity={0}>
                            {/* <div className=' mt-[100px] w-[800px] mx-auto justify-center inset-x-0  rounded-lg results '> */}
                            {/* <div className='mt-[100px] bg-[rgba(255,255,255,0.336)] border-[1px] inline-block rounded-lg border-gray-400 test' > */}
                            <div className='mt-[100px] bg-[#eeeeee] border-[1px] inline-block rounded-lg border-gray-200 test' >
                              {resultStatusCode === 200  && ResultSuccess( responseData.message === 'No new tracks to download were found'  ? 'No New Downloads' : 'Successfully downloaded all tracks!', responseData.message, goBack, responseData.downloadPath)}
                              {resultStatusCode === 207  && ResultWarning('Some tracks failed to download', responseData.message, goBack)}   
                              {resultStatusCode === 400  && ResultError('Something went wrong, please check the logs', responseData.message, goBack)}
                            </div>
                          </FadeContent>       
                        </>
                      } 
                      {(isLoading || !showResult) && 
                        <>
                          <div className='mt-[150px]'>
                            {Loading(
                              downloadType === 'track' ? 'Track is downloading' : 'Tracks are downloading'
                            )}           
                            <div className="rounded-lg text-[15px]">
                              Currently downloaded:
                            </div>   
                          </div>
                        </>
                      }
                    </div>
                  </div>

                  <div className='w-[600px] mx-auto animatedlist'>
                    <AnimatedList
                    items={[...currentlyDownloaded].reverse()}
                    // onItemSelect={(item, index) => console.log(item, index)}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                    />                      
                  </div>
                </div>
              </>
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
                <div className=' downloadSettingsForm mt-5 mx-auto mb-10 w-150'> 
                  <Collapse 
                    items={downloadItems} 
                    activeKey={collapseActiveKey}
                    onChange={(e)=>{setCollapseActiveKey(e)}}
                    />
                </div>
              </div>
              
                
              </div>        

              <div className='cover-art-containter '>
                  {Object.entries(gallerySettings.currentImagesShown).map((filename, index)=>(
                    <div key={filename} className={'mt-[20px] mb-[20px]'}>
                      <CoverArtCard 
                      filename={filename[1]}
                      cardClicked={()=>handleCoverArtClicked(filename[1])}
                      previousImg={coverArtData.prevCoverArtUsed}
                      edit={coverArtData.deleteCoverArt}
                      refresh={getCoverArtData}
                      key = {filename[1]}
                      imgClicked={''}
                      enlargenImg={false}
                      prevChannelCoverArtArr={coverArtData.prevChannelCoverArtArr}
                      />
                    </div>                
                  ))}
              </div>

                
            {/* { Object.keys(coverArtData.coverArtFileNames).length > 0 && !Object.keys(downloadSettings).includes('addToExistingPlaylistSettings') && */}
            {gallerySettings.currentImagesShown &&  gallerySettings.currentImagesShown.length > 0 && !Object.keys(downloadSettings).includes('addToExistingPlaylistSettings') &&
              <>
                <div className={`mt-[15px] mb-[15px]`}> 
                  <div className='text-white text-[15px] mb-[5px]'>
                    {coverArtData.deleteCoverArt ? 'Currently editing images' :'Edit images'}
                  </div>
                  <Switch  onChange={() =>  setCoverArtData(prev => {return {...prev, deleteCoverArt : !coverArtData.deleteCoverArt}}) }/> 
                </div>   
              </>            
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
                      <div className='flex justify-center '>
                        <div className='inline-block mt-[30px]' >
                          <AddChannelForm 
                          setSearchURL={downloadVideo}
                          handleChannelAdded={handleChannelAdded}
                          txtFileUploadProps={txtFileUploadProps}
                          />                        
                        </div>
                      </div>
                      <div className='flex -mt-9 justify-center ml-[585px]  -mb-[20px]'>
                          <Tooltip title="help">
                              <Button shape="circle" icon={<QuestionOutlined />}  onClick={() => setHomeTourEnabled(true)} />
                          </Tooltip>                      
                      </div>
                    </div>
                    <div>
                        <ShinyText 
                          text="TuneRip" 
                          disabled={false} 
                          speed={3} 
                          className='custom-class text-[50px] font-bold mt-[20px]' 
                        />    
                        <div className='channel-container inline-block'
                        ref={Object.keys(channelData.channelsList).length > 0 ? channelRef : null}
                        >
                          { 
                          Object.entries(channelData.channelsList).map((item, index) =>(
                            <YoutuberCard
                              name = {item[0]}
                              channelPFP={item[0]}
                              onClick={()=>handleChannelClicked(item[0])}
                              editChannels = {channelData.editChannels}
                              key = {item[0]}
                              handleChannelRemoved={handleChannelRemoved}
                              newestChannel={channelData.newestChannel}
                              pfpVersions = {channelData.pfpVersions}
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
      </div>    
    </>
  )
})

export default Home;