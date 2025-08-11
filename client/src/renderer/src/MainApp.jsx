import electronLogo from './assets/electron.svg'
import Home from './components/Home'
import './assets/mainApp.css'
import React, { useEffect, useState } from 'react'
import { AnimatedBackground } from 'animated-backgrounds';
import { Button, Space, DatePicker, version, App } from 'antd';
import Dock from './components/dock/Dock'
import { VscHome, VscAccount, VscArchive, VscSettingsGear } from 'react-icons/vsc';
import { FaCropSimple } from "react-icons/fa6";
import History from './components/history/History'
import { useRef, } from 'react'
import Settings from './components/Settings'
import Crop from './components/crop/Crop';
import { ToggleProvider } from './components/context/UseContext';
import { useToggle } from './components/context/UseContext';
import { TourProvider } from './components/context/SettingsTourContext';
import { HomeProvider } from './components/context/HomeContext';


function MainApp() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const [page, setPage] = useState("Settings");
  const ref = useRef(null);
  const [collapseActiveKey, setCollapseActiveKey] = useState(['0']) //0 for closed, 1 for open, must be str

  const homeClicked = () => {
    setPage('Home')
    if (ref.current){
      ref.current.resetAll();
    }
    setCollapseActiveKey(['0'])
  }

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => homeClicked() },
    { icon: <VscArchive size={18} />, label: 'History', onClick: () => setPage('History') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => setPage('Settings') }
  ];

  const {showDock} = useToggle()

  return (
    <div className='wrapper'>
        <div >
          {page === 'Home' && 
            <HomeProvider>
                <Home ref={ref} collapseActiveKey={collapseActiveKey} setCollapseActiveKey={setCollapseActiveKey}/>       
            </HomeProvider>
          }

          {page === 'History' && <History />}
          {page === 'Settings' && 
            <TourProvider>
              <Settings/> 
            </TourProvider>
          }
        </div>
        
      { showDock &&
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
