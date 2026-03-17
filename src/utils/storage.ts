import type { Task, StorageData } from '../types'

const STORAGE_KEY = 'workflow_board_data'
const CURRENT_SCHEMA_VERSION = 2

interface V1Task {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
}

interface V1Data {
  schemaVersion: 1
  tasks: V1Task[]
}


function migrateV1ToV2(old: V1Data): StorageData {
  const tasks: Task[] = old.tasks.map((t) => ({
     id: t.id,
    title: t.title,
    description: '',
    status: (t.status as Task['status']) || 'Backlog',
    priority: (t.priority as Task['priority']) || 'Medium',
    assignee: '',
    tags: [],
    createdAt: t.createdAt,
    updatedAt: t.createdAt,
  }))

  return { schemaVersion: 2, tasks }
}

export interface LoadResult {
  tasks: Task[]
  migrated: boolean
  error: string | null
}

export function loadFromStorage(): LoadResult {
  try {
  
    if (typeof window === 'undefined') {
      return { tasks: [], migrated: false, error: null }
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { tasks: [], migrated: false, error: null }

    const parsed = JSON.parse(raw)

   
    if (!parsed || typeof parsed !== 'object') {
      return { tasks: [], migrated: false, error: 'Invalid storage format' }
    }

    const version = (parsed as any).schemaVersion ?? 1

    
    if (version === 1) {
      if (!Array.isArray((parsed as any).tasks)) {
        return { tasks: [], migrated: false, error: 'Invalid V1 data' }
      }

      const migrated = migrateV1ToV2(parsed as V1Data)
      saveToStorage(migrated.tasks)

      return { tasks: migrated.tasks, migrated: true, error: null }
    }

    
    const data = parsed as StorageData

    return {
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      migrated: false,
      error: null,
    }
  } catch (err) {
    console.error('Storage load error:', err)
    return { tasks: [], migrated: false, error: 'Failed to load data from storage' }
  }
}

export function saveToStorage(tasks: Task[]): void {
  try {
    if (typeof window === 'undefined') return

    const data: StorageData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save to localStorage', err)
  }
}

export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false

    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}