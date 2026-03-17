import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { Task, TaskFormData, Status } from '../types'
import { saveToStorage } from '../utils/storage'
import { now } from '../utils/dateUtils'

interface TasksState {
  items: Task[]
  storageError: string | null
}

const initialState: TasksState = {
  items: [],
  storageError: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    hydrateTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload
    },
    setStorageError(state, action: PayloadAction<string | null>) {
      state.storageError = action.payload
    },
    addTask(state, action: PayloadAction<TaskFormData>) {
      const task:Task = {
        id: uuidv4(),
        ...action.payload,
        createdAt: now(),
        updatedAt: now(),
      }
      state.items.push(task)
      saveToStorage(state.items)
    },
    updateTask(state, action: PayloadAction<{ id: string; data: TaskFormData }>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id)
      if (idx !== -1) {
        state.items[idx] = {
          ...state.items[idx],
          ...action.payload.data,
          updatedAt: now(),
        }
        saveToStorage(state.items)
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload)
      saveToStorage(state.items)
    },
    moveTask(state, action: PayloadAction<{ id: string; status: Status }>) {
      const task = state.items.find((t) => t.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
        task.updatedAt = now()
        saveToStorage(state.items)
      }
    },
  },
})

export const {
  hydrateTasks,
  setStorageError,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
} = tasksSlice.actions

export default tasksSlice.reducer
