import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import tasksReducer from './tasksSlice'
import filtersReducer from './filtersSlice'
import toastReducer from './toastSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
    toast: toastReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
