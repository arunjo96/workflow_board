

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import  TaskCard  from './TaskCard'
import type { Task, Status } from '../../types'
import { getStatusColor } from '../../utils/taskUtils'
import styles from './BoardColumn.module.css'

interface BoardColumnProps {
    status: Status
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (id: string) => void
    onMove: (id: string, status: Status) => void
}

const BoardColumn: React.FC<BoardColumnProps> = (
    { status, tasks, onEdit, onDelete, onMove}) =>  {
    const { setNodeRef, isOver } = useDroppable({ id: status })
     const color = getStatusColor(status)
  return (
    <div className={[styles.column, isOver ? styles.isOver : ''].join(' ')} ref={setNodeRef}>
      <div className={styles.header}>
        <span className={styles.dot} style={{ background: color }} />
        <span className={styles.name}>{status}</span>
        <span className={styles.count}>{tasks.length}</span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.taskList}>
          {tasks.length === 0 ? (
            <div className={styles.empty}><span>Drop tasks here</span></div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default BoardColumn
