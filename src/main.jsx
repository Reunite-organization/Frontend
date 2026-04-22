import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './app/App.jsx'
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('🗑️ Service worker unregistered');
    }
  });
  
  // Also clear all caches
  caches.keys().then((keys) => {
    keys.forEach(key => caches.delete(key));
    console.log('🗑️ All caches cleared');
  });
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App />
  </StrictMode>,
)
