import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './AuthContext'
import Login from './Login'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </React.StrictMode>,
)
