import React, { useEffect } from 'react'
import AnimatedList from 'components/animatedList/AnimatedList';
import './history.css'
import { useState } from 'react';
import axios from 'axios';
import CountUp from './trackInfo/TrackCount';
import GradientText from 'components/gradientText/GradientText';

export default function History() {
  const items = ['Item 1111111111111111111111111111111111111111111111111', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12', 'Item 13', 
    'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18', 'Item 19', 'Item 20', 'Item 21']; 
  const [trackHistory, setTrackHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [downloadCount, setDownloadCount] = useState(0)


  async function getHistory() {
    const {data} = await axios.get('http://localhost:8080/history')
    const temp = [];
    for (const item of data) {
      temp.push(`${item['trackName']} by ${item['channel']}`)
    }
    setLoadingHistory(false)
    setTrackHistory(temp)
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

        

  return (
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
                onItemSelect={(item, index) => console.log(item, index)}
                showGradients={true}
                enableArrowNavigation={true}
                displayScrollbar={true}
                />
              </div>
              )
            }              
        </div>
    </div>
  )
}
