import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Tag, Button, Modal } from '../../components/ui'
import type { Task, Status } from '../../types'
import { relativeTime } from '../../utils/dateUtils'
import { getPriorityColor, getStatusColor } from '../../utils/taskUtils'
import { FiEdit, FiTrash2, FiFlag } from 'react-icons/fi'
import { MdOutlineDragIndicator } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import styles from './TaskCard.module.css'

const STATUSES: Status[] = ['Backlog', 'In Progress', 'Done']

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Status) => void
}



const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onMove }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })



    const style = React.useMemo(() => ({
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.35 : 1,
        zIndex: isDragging ? 999 : undefined,
   touchAction: 'none',
}), [transform, transition, isDragging])

  const priorityColor = getPriorityColor(task.priority)

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={[styles.card, isDragging ? styles.dragging : ''].join(' ')}>
        <div
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Drag to move"
          title="Drag"
        >
          <MdOutlineDragIndicator />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.priority} style={{ color: priorityColor }}>
                          <FiFlag style={{ marginRight: 4 }} />
                          {task.priority}
            </span>
            <div className={styles.actions}>
              <Button variant="ghost" size="sm" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>  <FiEdit /></Button>
              
               <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteModal(true)
                }}
                aria-label={`Delete ${task.title}`}
              >
                <FiTrash2 />
              </Button>
            </div>
          </div>

          <h3 className={styles.title}>{task.title}</h3>

          {task.description && <p className={styles.description}>{task.description}</p>}

          {task.tags?.length > 0 && (
            <div className={styles.tags}>
              {task.tags.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
          )}

          <div className={styles.statusRow}>
            <span className={styles.moveLabel}>Move to:</span>
            <div className={styles.statusBtns}>
              {STATUSES.filter((s) => s !== task.status).map((s) => (
                <button
                  key={s}
                  className={styles.statusPill}
                  style={{ borderColor: getStatusColor(s), color: getStatusColor(s) }}
                  onClick={() => onMove(task.id, s)}
                  aria-label={`Move to ${s}`}
                >
                  <FaArrowRightLong /> {s}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            {task.assignee && (
              <span className={styles.assignee}>
                <span className={styles.avatar}>{task?.assignee[0]?.toUpperCase()}</span>
                {task.assignee}
              </span>
            )}
            <span className={styles.time}>{relativeTime(task.updatedAt)}</span>
          </div>
        </div>
      </Card>
        <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <p style={{ fontSize: 14 }}>
            Are you sure you want to delete <strong>{task.title}</strong>?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id)
                setShowDeleteModal(false)
              }}
            >
              Delete
            </Button>

          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskCard

