import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider>
    <StrictMode>
      <Router>
         <App />
      </Router>
  </StrictMode>
    </ThemeProvider>
  </Provider>
)
