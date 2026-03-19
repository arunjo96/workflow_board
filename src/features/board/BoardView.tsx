import  { useState, useMemo, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import  BoardColumn  from './BoardColumn'
import { FilterBar } from '../filters/FilterBar'
import { TaskForm } from '../tasks/TaskForm'
import { Modal, Button, Card, Tag } from '../../components/ui'
import { useAppDispatch, useAppSelector } from '../../store'
import { addTask, updateTask, deleteTask, moveTask, hydrateTasks } from '../../store/tasksSlice'
import { addToast } from '../../store/toastSlice'
import { useStorage } from '../../hooks/useStorage'
import { useTheme } from '../../context/ThemeContext'
import { sortTasks, getPriorityColor } from '../../utils/taskUtils'
import type { Task, Status, TaskFormData } from '../../types'
import { FaSearch } from "react-icons/fa";
import { FaPlus, FaRegFileLines } from "react-icons/fa6";
import { BiError } from "react-icons/bi";
import { MdLightMode } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { FiFlag } from 'react-icons/fi'
import styles from './BoardView.module.css'

const STATUSES: Status[] = ['Backlog', 'In Progress', 'Done']

export const BoardView: React.FC = () => {
  useStorage()

  const dispatch = useAppDispatch()
  const tasks = useAppSelector((s) => s.tasks.items)
  const storageError = useAppSelector((s) => s.tasks.storageError)
  const filters = useAppSelector((s) => s.filters)

  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const { theme, toggleTheme} = useTheme()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  const filteredTasks = useMemo(() => {
    let result = [...tasks]
    if (filters.statuses.length > 0) result = result.filter((t) => filters.statuses.includes(t.status))
    if (filters.priority !== 'All') result = result.filter((t) => t.priority === filters.priority)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    }
    return sortTasks(result, filters.sortField, filters.sortDirection)
  }, [tasks, filters])

  const tasksByStatus = useMemo(() => {
    const map: Record<Status, Task[]> = { Backlog: [], 'In Progress': [], Done: [] }
    filteredTasks.forEach((t) => map[t.status].push(t))
    return map
  }, [filteredTasks])

  const openCreate = () => { setEditingTask(undefined); setModalOpen(true) }
  const openEdit = useCallback((task: Task) => { setEditingTask(task); setModalOpen(true) }, [])
  const closeModal = () => setModalOpen(false)

  const handleSubmit = (data: TaskFormData) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, data }))
      dispatch(addToast({ message: 'Task updated!', type: 'success' }))
    } else {
      dispatch(addTask(data))
      dispatch(addToast({ message: 'Task created!', type: 'success' }))
    }
    closeModal()
  }

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteTask(id))
    dispatch(addToast({ message: 'Task deleted', type: 'info' }))
  }, [dispatch])

  const handleMove = useCallback((id: string, status: Status) => {
    dispatch(moveTask({ id, status }))
    dispatch(addToast({ message: `Moved to ${status}`, type: 'success' }))
  }, [dispatch])

 
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

  
    if (STATUSES.includes(overId as Status)) {
      if (activeTask.status !== overId) {
        dispatch(moveTask({ id: activeId, status: overId as Status }))
      }
      return
    }

    const overTask = tasks.find((t) => t.id === overId)
    if (overTask && activeTask.status !== overTask.status) {
      dispatch(moveTask({ id: activeId, status: overTask.status }))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

   
    if (activeTask && overTask && activeTask.status === overTask.status) {
      const colTasks = tasks.filter((t) => t.status === activeTask.status)
      const oldIdx = colTasks.findIndex((t) => t.id === activeId)
      const newIdx = colTasks.findIndex((t) => t.id === overId)
      const reordered = arrayMove(colTasks, oldIdx, newIdx)
      const others = tasks.filter((t) => t.status !== activeTask.status)
      dispatch(hydrateTasks([...others, ...reordered]))
    }
  }

  const isFiltering = filters.statuses.length > 0 || filters.priority !== 'All' || filters.search !== ''
  const allEmpty = tasks.length === 0

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Workflow Board</h1>
          <p className={styles.subtitle}>{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>

      <div  className={styles.headerBtn}>
          <Button onClick={toggleTheme} variant="secondary" >
            {theme === 'dark' ?  <MdLightMode size={18} /> :  <BsFillMoonStarsFill size={18} />}
          </Button>
          
         <Button variant="primary" size="md" onClick={openCreate}><FaPlus/> New Task</Button>
        </div>
      </header>

      {storageError && <div className={styles.errorBanner} role="alert"><BiError/> {storageError}</div>}

      <FilterBar />

       {allEmpty ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}> <FaRegFileLines /> </div>
          <h2>No tasks yet</h2>
          <p>Create your first task to get started</p>
          <Button variant="primary" onClick={openCreate}>Create Task</Button>
        </div>
      ) : isFiltering && filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><FaSearch/></div>
          <h2>No matching tasks</h2>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={styles.board}>
            {STATUSES.map((status) => (
              <BoardColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onEdit={openEdit}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            ))}
          </div>

        
          <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
            {activeTask && (
              <Card className={styles.overlayCard}>
                <div className={styles.overlayInner}>
                  <span style={{ color: getPriorityColor(activeTask.priority), fontSize: 11, fontWeight: 600 }}>
                    <FiFlag /> {activeTask.priority}
                  </span>
                  <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 500 }}>{activeTask.title}</p>
                  {activeTask.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                      {activeTask.tags.map((t) => <Tag key={t} label={t} />)}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </DragOverlay>
        </DndContext>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingTask ? 'Edit Task' : 'New Task'} size="md">
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </div>
  )
}

