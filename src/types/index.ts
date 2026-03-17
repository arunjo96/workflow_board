
  export type Status = 'Backlog' | 'In Progress' | 'Done'
  export type Priority = 'Low' | 'Medium' | 'High'


  export interface Task {
    id: string
  title: string
  description: string
  status: Status
  priority: Priority
  assignee: string
  tags: string[]
  createdAt: string
  updatedAt: string
  }

  export interface TaskFormData {
    title: string
  description: string
  status: Status
  priority: Priority
  assignee: string
  tags: string[]
  }

  export type FilterStatus = Status | 'All'
  export type FilterPriority = Priority | 'All'
  export type SortField = 'createdAt' | 'updatedAt' | 'priority'
  export type SortDirection = 'asc' | 'desc'

  export interface FiltersState {
    statuses: Status[]
    priority: FilterPriority
    search: string
    sortField: SortField
    sortDirection: SortDirection
  }

  export interface StorageData {
    schemaVersion: number
    tasks: Task[]
  }

  export interface ToastMessage {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }
