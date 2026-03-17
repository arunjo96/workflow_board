import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BoardView } from '../features/board/BoardView'


const AppContent: React.FC = () => {
  return (
      <>
           <Routes>
                  <Route path="/board" element={<BoardView />} />
                  <Route path="/" element={< Navigate to="/board" replace />} />
            </Routes>
      
    </>
  )
}

export default AppContent
