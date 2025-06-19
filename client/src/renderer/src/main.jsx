import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainApp from './MainApp'
import { App } from 'antd';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App>
      <MainApp />
    </App>
  // </StrictMode>
)
