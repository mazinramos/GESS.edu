import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// هذا الملف هو الجسر بين ملف الـ HTML وكود الـ App.jsx المطور
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
