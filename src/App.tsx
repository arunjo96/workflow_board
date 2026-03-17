
import React from 'react'
import { ToastContainer } from './components/ui'
import AppContent from './routes/AppContent'
import './styles/global.css'

const App: React.FC = () => {
  return (
    <>
     <AppContent />
      <ToastContainer />
    </>
  )
}

export default App
