import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { hydrateTasks, setStorageError } from '../store/tasksSlice'
import { addToast } from '../store/toastSlice'
import { loadFromStorage, isStorageAvailable } from '../utils/storage'

export function useStorage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isStorageAvailable()) {
      dispatch(setStorageError('localStorage is unavailable. Data will not persist.'))
      dispatch(addToast({ message: 'Storage unavailable — data will not persist', type: 'warning' }))
      return
    }

    const { tasks, migrated, error } = loadFromStorage()

    if (error) {
      dispatch(setStorageError(error))
      dispatch(addToast({ message: error, type: 'error' }))
      return
    }

    dispatch(hydrateTasks(tasks))

    if (migrated) {
      dispatch(addToast({ message: 'Your data was migrated to the latest format ✓', type: 'info' }))
    }
  }, [dispatch])
}
