// import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import BasicExample from './components/Navbar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <BasicExample></BasicExample> */}
  </StrictMode>
)
