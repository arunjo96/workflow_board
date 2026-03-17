import React, { useState } from 'react'
import { Button, TextInput, TextArea, Select, Tag } from '../../components/ui'
import { useTaskForm } from '../../hooks/useTaskForm'
import type { Task, Status, Priority } from '../../types'
import styles from './TaskForm.module.css'

const STATUS_OPTIONS = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

interface TaskFormProps {
  task?: Task
  onSubmit: (data: ReturnType<typeof useTaskForm>['data']) => void
  onCancel: () => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const { data, errors, isDirty, set, validate } = useTaskForm(task)
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(data)
  }

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Leave anyway?')) return
    onCancel()
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !data.tags.includes(t)) {
      set('tags', [...data.tags, t])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    set('tags', data.tags.filter((t) => t !== tag))
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <TextInput
        label="Title *"
        value={data.title}
        onChange={(e) => set('title', e.target.value)}
        error={errors.title}
        placeholder="Enter task title..."
        autoFocus
      />

      <TextArea
        label="Description"
        value={data.description}
        onChange={(e) => set('description', e.target.value)}
        error={errors.description}
        placeholder="Add details about this task..."
        rows={4}
      />

      <div className={styles.row}>
        <Select
          label="Status"
          value={data.status}
          onChange={(e) => set('status', e.target.value as Status)}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Priority"
          value={data.priority}
          onChange={(e) => set('priority', e.target.value as Priority)}
          options={PRIORITY_OPTIONS}
        />
      </div>

      <TextInput
        label="Assignee"
        value={data.assignee}
        onChange={(e) => set('assignee', e.target.value)}
        error={errors.assignee}
        placeholder="Assign to..."
      />

      <div className={styles.tagsSection}>
        <span className={styles.tagsLabel}>Tags</span>
        <div className={styles.tagInputRow}>
          <input
            className={styles.tagInput}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag() }
            }}
            placeholder="Add tag and press Enter..."
          />
          <Button type="button" variant="secondary" size="sm" onClick={addTag}>
            Add
          </Button>
        </div>
        {data.tags.length > 0 && (
          <div className={styles.tagsList}>
            {data.tags.map((tag) => (
              <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
