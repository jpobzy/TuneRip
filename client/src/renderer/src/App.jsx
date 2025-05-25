import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import Youtubers from './components/Youtubers'
import './assets/app.css'
import React, { useEffect, useState } from 'react'
import DownloadedShowcase from './components/DownloadedShowcase'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const [showCards, setShowCards] = useState(true);

  const handleChildClick = (data) => {
    console.log('Child said:', data);
  };


  return (
    <>
      {showCards ? (    
        <div className='App'>
        <Youtubers onCardClick={handleChildClick}/>
        
      </div>) : (
        <div>
        <button onClick={() =>  setCardClicked(false)}> reverse</button>
      </div> 
      )

      }
    </>
  )
}

export default App
