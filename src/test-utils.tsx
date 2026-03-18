import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './store/tasksSlice'
import filtersReducer from './store/filtersSlice'
import toastReducer from './store/toastSlice'
import { ThemeProvider } from './context/ThemeContext'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'

export function renderWithProviders(ui: ReactNode) {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
      filters: filtersReducer,
      toast: toastReducer,
    },
  })

   return {
    ...render(
      <Provider store={store}>
        <ThemeProvider> 
          <MemoryRouter>{ui}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    ),
    store,
  }
}