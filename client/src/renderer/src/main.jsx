import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainApp from './MainApp'
// import { App } from 'antd';
import { App as AntdApp } from "antd";
import { ToggleProvider } from './components/context/UseContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App> */}
    <AntdApp>
      <ToggleProvider>
         <MainApp />  
      </ToggleProvider>
    </AntdApp>
    {/* </App> */}
   </StrictMode>
)
