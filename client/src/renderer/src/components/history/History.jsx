import React, { useEffect } from 'react'
import AnimatedList from './animatedList/AnimatedList'
import '../../assets/history/history.css'
import { useState } from 'react';
import axios from 'axios';

export default function History() {
  const items = ['Item 1111111111111111111111111111111111111111111111111', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12', 'Item 13', 
    'Item 14', 'Item 15', 'Item 16', 'Item 17', 'Item 18', 'Item 19', 'Item 20', 'Item 21']; 
  const [trackHistory, setTrackHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  async function getHistory() {
    const {data} = await axios.get('http://localhost:8080/history')
    const temp = [];
    for (const item of data) {
      temp.push(`${item['trackName']} by ${item['user']}`)
    }
    setLoadingHistory(false)
    setTrackHistory(temp)
    console.log(temp)
  }


    useEffect(()=> {
      getHistory();
    },[]);

        

  return (
    <div>
        <div className='history-wrapper'>
          <h1 className='header1 text-5xl font-bold -mt-15 mb-5 text-gray-200'>Download history</h1>
            {!loadingHistory && (
            <AnimatedList
            items={trackHistory}
            onItemSelect={(item, index) => console.log(item, index)}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
            />
            )
            }
        </div>
    </div>
  )
}
