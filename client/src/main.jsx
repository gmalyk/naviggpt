import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { CompanionProvider } from './context/CompanionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <CompanionProvider>
          <App />
        </CompanionProvider>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>,
)
