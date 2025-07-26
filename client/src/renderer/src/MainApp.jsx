import electronLogo from './assets/electron.svg'
import Youtubers from './components/Youtubers'
import './assets/mainApp.css'
import React, { useEffect, useState } from 'react'
import { AnimatedBackground } from 'animated-backgrounds';
import Aurora from './components/background/Aurora'
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
import DarkVeil from './components/background/DarkVeil';
import Galaxy from './components/background/Galaxy';
import { toggleBackgroundSettings } from './components/context/BackgroundSettingsContext';


function MainApp() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const [page, setPage] = useState("Home");
  // const [background, setbackground] = useState("");
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const height = dimensions.height + 100;
  const {background, setBackground} = toggleBackgroundSettings();


  const homeClicked = () => {
    setPage('Home')
    if (ref.current){
      console.log('ref.current found')
      ref.current.resetAll();
    }
    console.log('home clicked')
  }

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => homeClicked() },
    { icon: <VscArchive size={18} />, label: 'History', onClick: () => setPage('History') },
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => setPage('Settings') },
    //  { icon: <FaCropSimple size={18} />, label: 'Crop', onClick: () => setPage('Crop') },
  ];

  const {showDock} = useToggle()

  // useEffect(()=>{
  //   if (background === 'veil'){
  //       document.body.style.backgroundColor = 'black';
  //   }else if (background === 'aurora'){
  //       document.body.style.backgroundColor = '#1a1a1afd';
  //   }else if (background === 'galaxy'){
  //       document.body.style.backgroundColor = 'black';
  //   }


  //   const handleResize = () => {
  //     // console.log(window.innerWidth, window.innerHeight)
  //     setDimensions({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // Clean up the event listener on unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [])

  return (
    <div className='wrapper'>
        <div className={background === 'galaxy' && `mt-[150px]`}>
        {/* <div> */}
          {page === 'Home' && 
            <HomeProvider>
              <div className='mainApp '>
                <Youtubers ref={ref}/>
              </div>           
            </HomeProvider>
          }

          {page === 'History' && <div className='mainApp'><History /></div>}
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
