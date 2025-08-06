import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainApp from './MainApp'
// import { App } from 'antd';
import { App as AntdApp } from "antd";
import { ToggleProvider } from './components/context/UseContext';
import { ToggleBackgroundSettingsProvider } from './components/context/BackgroundSettingsContext';
import { ClickProvider } from './components/context/CursorContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToggleBackgroundSettingsProvider>
      <AntdApp>
        <ToggleProvider>
          <ClickProvider>
            <MainApp />             
          </ClickProvider>
        </ToggleProvider>
      </AntdApp>
    </ToggleBackgroundSettingsProvider>
   </StrictMode>
)
