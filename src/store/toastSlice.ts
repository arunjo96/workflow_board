import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { ToastMessage } from '../types'

interface ToastState {
  messages: ToastMessage[]
}

const initialState: ToastState = { messages: [] }

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      state.messages.push({ id: uuidv4(), ...action.payload })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter((m) => m.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer
