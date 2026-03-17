import { useState, useCallback } from 'react'
import type { Task, TaskFormData } from '../types'

const DEFAULTS: TaskFormData = {
  title: '',
  description: '',
  status: 'Backlog',
  priority: 'Medium',
  assignee: '',
  tags: [],
}

interface FormErrors {
  title?: string
  description?: string
  assignee?: string
}

export function useTaskForm(initial?: Task) {
  const [data, setData] = useState<TaskFormData>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          status: initial.status,
          priority: initial.priority,
          assignee: initial.assignee,
          tags: initial.tags,
        }
      : DEFAULTS
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDirty, setIsDirty] = useState(false)

  const set = useCallback(<K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    if (!data.title.trim()) newErrors.title = 'Title is required'
    if (data.title.trim().length > 100) newErrors.title = 'Title must be under 100 characters'
    if (data.description.length > 2000) newErrors.description = 'Description must be under 2000 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [data])

  const reset = useCallback(() => {
    setData(DEFAULTS)
    setErrors({})
    setIsDirty(false)
  }, [])

  return { data, errors, isDirty, set, validate, reset }
}
