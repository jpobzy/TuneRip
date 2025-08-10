import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainApp from './MainApp'
// import { App } from 'antd';
import { App as AntdApp } from "antd";
import { ToggleProvider } from './components/context/UseContext';
import { ToggleBackgroundSettingsProvider } from './components/context/BackgroundSettingsContext';
import { ClickProvider } from './components/context/CursorContext';
import { ResultProvider } from './components/context/ResultContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToggleBackgroundSettingsProvider>
      <AntdApp>
        <ToggleProvider>
          <ClickProvider>
            <ResultProvider>
              <MainApp />                 
            </ResultProvider>
          </ClickProvider>
        </ToggleProvider>
      </AntdApp>
    </ToggleBackgroundSettingsProvider>
   </StrictMode>
)
