import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import Youtubers from './components/Youtubers'
import './assets/app.css'
import React, { useEffect, useState } from 'react'
import { AnimatedBackground } from 'animated-backgrounds';
import Aurora from './components/background/Aurora'
import { Button, Space, DatePicker, version } from 'antd';

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const [showCards, setShowCards] = useState(true);

  const handleChildClick = (data) => {
    console.log('Child said:', data);
  };


  return (
    <div>
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

    

       {showCards ? (    
        <div className='App'>
        <Youtubers onCardClick={handleChildClick}/>
      </div>) : (
        <div>
        <button onClick={() =>  setCardClicked(false)}> reverse</button>
      </div> 
      )
      }

    {
            
    }


    </div>
  )
}

export default App
