import type { Task, Priority, SortField, SortDirection } from '../types'

const PRIORITY_ORDER: Record<Priority, number> = {
    High: 3,
    Medium: 2,
    Low: 1
}

export function sortTasks(
    tasks: Task[],
    field: SortField,
    direction: SortDirection
): Task[] {
    return [...tasks].sort((a, b) => {
    let cmp = 0
    if (field === 'priority') {
      cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    } else {
      cmp = new Date(a[field]).getTime() - new Date(b[field]).getTime()
    }
    return direction === 'asc' ? cmp : -cmp
  })
}

export function getPriorityColor(priority: Priority): string {
  const map: Record<Priority, string> = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
  }
  return map[priority]
}

export function getStatusColor(status: Task['status']): string {
  const map: Record<Task['status'], string> = {
    Backlog: '#8888a0',
    'In Progress': '#6366f1',
    Done: '#10b981',
  }
  return map[status]
}
