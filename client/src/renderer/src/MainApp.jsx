import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import Youtubers from './components/Youtubers'
import './assets/mainApp.css'
import React, { useEffect, useState } from 'react'
import { AnimatedBackground } from 'animated-backgrounds';
import Aurora from './components/background/Aurora'
import { Button, Space, DatePicker, version, App } from 'antd';
import Dock from './components/dock/Dock'
import { VscHome, VscAccount, VscArchive, VscSettingsGear } from 'react-icons/vsc';
import History from './components/history/History'


function MainApp() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const [showCards, setShowCards] = useState(true);
  const [showHistory, setShowHistory] = useState(false)
  const [page, setPage] = useState("Home")

  const handleChildClick = (data) => {
    console.log('Child said:', data);
  };

    const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => homeClicked() },
    { icon: <VscArchive size={18} />, label: 'History', onClick: () => setPage('History') },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
  ];
  const homeClicked = () => {
    setPage('Home')
  }

  return (
    <div className='wrapper'>
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      {page === 'Home' && <div className='mainApp'><Youtubers onCardClick={handleChildClick} /></div>}
      {page === 'History' && <div className='mainApp'><History /></div>}

    {
      <div className='dock-wrapper flex justify-center items-center '>
        <Dock
          className='custom-dock'
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        /> 
        
      </div>

    }


    </div>
  )
}

export default MainApp
