import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CompareProvider } from './context/CompareContent.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CompareProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CompareProvider>
    </AuthProvider>
  </React.StrictMode>,
)