
import Home from 'components/Home'
import 'assets/mainApp.css'
import React, { useState } from 'react'
import Dock from 'components/dock/Dock'
import { VscHome, VscArchive, VscSettingsGear } from 'react-icons/vsc';

import History from 'components/history/History'
import { useRef, } from 'react'
import Settings from 'components/Settings'
import { useToggle } from 'components/context/UseContext';
import { TourProvider } from 'components/context/SettingsTourContext';
import { HomeProvider } from 'components/context/HomeContext';
import PatchNotes from './components/patchNotes/PatchNotes';
import PatchNotesFile from 'assets/patchNotes.txt';
import { Button } from 'antd';


function MainApp() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  
  const [page, setPage] = useState("Home");
  const ref = useRef(null);
  const [collapseActiveKey, setCollapseActiveKey] = useState(['0']) //0 for closed, 1 for open, must be str
  const {showDock, disableDockFunctionality} = useToggle()
  
  
  const [text, setText] = useState();
  const test = async() => {
    
    fetch(PatchNotesFile)
      .then((response) => response.text())
      .then((textContent) => {
        setText(textContent);
        console.log(textContent)
      });
  }

  const handleHomeClicked = () => {
    if (disableDockFunctionality){
      return
    }
    setPage('Home')
    if (ref.current){
      ref.current.resetAll();
    }
    setCollapseActiveKey(['0'])
  }


  const handleHistoryClicked = () => {
    if (disableDockFunctionality){
      return
    }
    setPage('History')
  }

  const handleSettingsClicked = () => {
    if (disableDockFunctionality){
      return
    }
    setPage('Settings')
  }

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => handleHomeClicked() },
    { icon: <VscArchive size={18} />, label: 'History', onClick: () =>  handleHistoryClicked()},
    { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => handleSettingsClicked()}
  ];







  return (
    <>
    <div className='wrapper'>
          <div >
            <PatchNotes/>
            {page === 'Home' && 
              <>

                <HomeProvider>
                    <Home ref={ref} collapseActiveKey={collapseActiveKey} setCollapseActiveKey={setCollapseActiveKey}/>       
                </HomeProvider>              
              </>
            }

            {page === 'History' && <History />}
            {page === 'Settings' && 
              <TourProvider>
                <Settings/> 
              </TourProvider>
            }
          </div>
          
        { showDock &&
          <div className='dock-wrapper flex justify-center items-center'>
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
    </>
 
  )
}

export default MainApp
