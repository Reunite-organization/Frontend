import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './app/App.jsx'
import { initClientMonitoring } from './monitoring/clientMonitoring'

const storedLanguage = localStorage.getItem('falagiye-language') || 'en'
initClientMonitoring({ language: storedLanguage })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App />
  </StrictMode>,
)
