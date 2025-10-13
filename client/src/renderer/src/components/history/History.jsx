import React, { useEffect } from 'react'
import AnimatedList from 'components/animatedList/AnimatedList';
import './history.css'
import { useState } from 'react';
import axios from 'axios';
import CountUp from './trackInfo/TrackCount';
import GradientText from 'components/gradientText/GradientText';
import { Button, Image, Modal, Space } from 'antd';


export default function History() {
  const items = ['Item 1111111111111111111111111111111111111111111111111', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12', 'Item 13', 
    'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18', 'Item 19', 'Item 20', 'Item 21']; 
  const [trackHistory, setTrackHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [downloadCount, setDownloadCount] = useState(0)
  const [trackDetails, setTrackDetails] = useState([])
  const [selectedTrack, setSelectedTrack] = useState(null)

  async function getHistory() {
    const {data} = await axios.get('http://localhost:8080/history')
    const temp = [];
    for (const item of data) {
      temp.push(`${item['trackName']} by ${item['channel']}`)
    }
    setLoadingHistory(false)
    setTrackHistory(temp)
    setTrackDetails(data)
  };

  
  async function getDownloadCount(){
    const res = await axios.get('http://localhost:8080/downloadCount')

    if (res.status == 200){
      const data = res.data
      setDownloadCount(res.data)
    }

  };

    useEffect(()=> {
        getHistory();
        getDownloadCount()    
    },[]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
      setIsModalOpen(false);
    };


    function test(item){
      setIsModalOpen(true)

      const track = trackDetails.find((e)=> {if (`${e.trackName} by ${e.channel}` === item){
          return e
        }
      })
      setSelectedTrack(track)
    }

    function titleText(text){
      return <>
      <div className='text-[17.5px]'>{text}</div>
      </>
    }

    function descriptionText(text){
      return <>
      <div className='text-[15px]'>{text}</div>
      </>
    }

  async function openFolder(){
    const req = await axios.post('http://localhost:8080/open-dir', {'downloadPath' : selectedTrack.downloadPath})

  }



  return (
    <>
      <div className='inline-block mt-[30px]'>
          <div className='history-wrapper'>
            {/* <h1 className='header1 text-5xl font-bold -mt-15 mb-5 text-gray-200 pointer-events-none position: fixed'>Download history</h1> */}
            <div className='mx-auto text-center text-gray-200 text-[50px] z-10  position: relative'>
              Download history
            </div>
            <div className='text-[20px] pointer-events-none'>
    
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
              >
                You have downloaded <></>
                {<CountUp
                      from={0}
                      to={downloadCount}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text "
                    />} tracks!
                  </GradientText>
              <div className='text-white text-[18px]'>
                Heres the most recent 20
              </div>
            </div>

              
              {!loadingHistory && (
                <div className='animatedlist'>
                  <AnimatedList
                  items={trackHistory}
                  onItemSelect={(item, index) => test(item, index)}
                  showGradients={true}
                  enableArrowNavigation={true}
                  displayScrollbar={true}
                  />
                </div>
                )
              }      


          <Modal
            title={<div className='text-[20px] '>Track Info</div>}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onCancel={handleOk}
            footer={[
              <>
              <div className='-mt- [55px]'>
                {selectedTrack && 
                  <Button key="back" onClick={openFolder}>
                    Open file location
                  </Button>                
                }
                <Button
                  type="primary"
                  onClick={handleOk}
                >
                  Close
                </Button>                  
              </div>
         
              </>

            ]}
          >

            {selectedTrack &&
            <>
              <div className='columns-2 '>
                <div className='w-[220px] '>
                  <Image src={`http://localhost:8080/getCoverArt/${selectedTrack.coverArt}`} />
                </div>
                

                <div className=''>
                  <div>
                    {titleText('Track title:')}
                    {descriptionText(`${selectedTrack.trackName}`)}                    
                  </div>

                  <div className='mt-[10px]'>                
                    {titleText('Album title:')}
                    {descriptionText(`${selectedTrack.albumTitle}`)}                   
                  </div>



                  {/* <div className='mt-[10px]'>                
                    {titleText('Channel:')}
                    {descriptionText(`${selectedTrack.channel}`)}                    
                  </div> */}

                  {/* <div className='mt-[10px]'>                
                    {titleText('Download date:')}
                    {descriptionText(`${selectedTrack.downloadDate}`)}                    
                  </div> */}

                </div>                       
              </div>
              <div>
                {/* <div className='mx-auto mt-[10px] '>
                  <div>
                    {titleText('Album title:')}
                    {descriptionText(`${selectedTrack.albumTitle}`)}                    
                  </div>

                  <div className='mt-[10px]'>                
                    {titleText('Youtube Link:')}
                    {descriptionText(`${selectedTrack.youtubeLink}`)}                    
                  </div>
                </div>                     */}
                
                  {/* <div>{`Album Title ${selectedTrack.albumTitle}`}</div> */}
                  {/* <div>{`Youtube Link ${selectedTrack.youtubeLink}`}</div> */}
              </div>
              
            </>
            }



          </Modal>

              
          </div>
      </div>    
    </>

  )
}
