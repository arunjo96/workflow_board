# Architecture & Design Notes

## 🚀 Component Tree with Data Flow

```
AppRoot
  │
  ├─ ThemeProvider (Context)
  │   └─ Provides: theme, toggleTheme()
  │
  ├─ Redux Store (Provider)
  │   ├─ tasks: { items[], storageError }
  │   ├─ filters: { statuses[], priority, search, sortField, sortDirection }
  │   └─ toast: { messages[] }
  │
  ├─ AppContent (Routes)
  │   └─ BoardView (Container Component)
  │       ├─ State:
  │       │   ├─ modalOpen (boolean)
  │       │   ├─ editingTask (Task | undefined)
  │       │   ├─ activeTask (Task | null) - dragging task
  │       │   └─ theme, toggleTheme (from ThemeContext)
  │       │
  │       ├─ Computed State (useMemo):
  │       │   ├─ filteredTasks - applies all filters
  │       │   └─ tasksByStatus - groups filtered tasks by status
  │       │
  │       ├─ Selectors:
  │       │   ├─ tasks, storageError (from Redux)
  │       │   └─ filters (from Redux)
  │       │
  │       ├─ Effects:
  │       │   ├─ useStorage() - hydrate tasks from localStorage
  │       │   └─ useFilters() - sync filters with URL params
  │       │
  │       ├─ Event Handlers:
  │       │   ├─ openCreate, openEdit, closeModal
  │       │   ├─ handleSubmit, handleDelete, handleMove
  │       │   └─ handleDragStart, handleDragOver, handleDragEnd
  │       │
  │       └─ Children:
  │           ├─ Header
  │           │   ├─ Title + task count
  │           │   └─ Buttons (theme toggle, new task)
  │           │
  │           ├─ Error Banner
  │           │   └─ Shows if storageError exists
  │           │
  │           ├─ FilterBar (Feature Component)
  │           │   ├─ Receives: filters, setSearch, setStatuses, setPriority, etc.
  │           │   ├─ Elements:
  │           │   │   ├─ Search input (controlled)
  │           │   │   ├─ Status filter buttons (toggle)
  │           │   │   ├─ Priority dropdown (select)
  │           │   │   ├─ Sort dropdowns (select)
  │           │   │   └─ Clear button
  │           │   └─ Calls: Redux action dispatches via useFilters hooks
  │           │
  │           ├─ EmptyState / FilteredEmptyState (Conditional)
  │           │   └─ Shows "No tasks" or "No matching tasks"
  │           │
  │           ├─ DndContext (Drag & Drop Provider)
  │           │   ├─ Sensors: PointerSensor, TouchSensor
  │           │   ├─ Collision: closestCorners
  │           │   └─ Children:
  │           │       │
  │           │       ├─ BoardColumn (Presentational) [×3: Backlog, InProg, Done]
  │           │       │   ├─ Receives:
  │           │       │   │   ├─ status (Status type)
  │           │       │   │   ├─ tasks (Task[]) - filtered & grouped
  │           │       │   │   ├─ onEdit, onDelete, onMove callbacks
  │           │       │   │
  │           │       │   ├─ State:
  │           │       │   │   └─ setNodeRef (for drop target)
  │           │       │   │   └─ isOver (drop zone active?)
  │           │       │   │
  │           │       │   ├─ Header
  │           │       │   │   ├─ Status dot (color-coded)
  │           │       │   │   ├─ Status name
  │           │       │   │   └─ Task count badge
  │           │       │   │
  │           │       │   └─ SortableContext (dnd-kit)
  │           │       │       └─ TaskCard (Presentational) [×N per column]
  │           │       │           ├─ Receives:
  │           │       │           │   ├─ task (Task)
  │           │       │           │   ├─ onEdit, onDelete, onMove callbacks
  │           │       │           │
  │           │       │           ├─ State:
  │           │       │           │   ├─ useSortable hooks (dnd-kit)
  │           │       │           │   │   ├─ setNodeRef
  │           │       │           │   │   ├─ attributes (drag handle attrs)
  │           │       │           │   │   ├─ listeners (drag events)
  │           │       │           │   │   ├─ transform (CSS transform)
  │           │       │           │   │   ├─ isDragging
  │           │       │           │   │
  │           │       │           │   └─ showDeleteModal (boolean)
  │           │       │           │
  │           │       │           ├─ Drag Handle
  │           │       │           ├─ Priority Badge
  │           │       │           ├─ Title & Description
  │           │       │           ├─ Tags
  │           │       │           ├─ Action Buttons (Edit, Delete)
  │           │       │           ├─ Move Status Buttons
  │           │       │           ├─ Footer (Assignee, Timestamp)
  │           │       │           │
  │           │       │           └─ Delete Confirmation Modal
  │           │       │               ├─ Warning text
  │           │       │               └─ Cancel/Delete buttons
  │           │       │
  │           │       └─ DragOverlay (Visual Feedback)
  │           │           └─ Preview card while dragging
  │           │               ├─ Priority badge
  │           │               ├─ Title
  │           │               └─ Tags
  │           │
  │           └─ Modal (Task Creation/Editing)
  │               ├─ Title: "New Task" or "Edit Task"
  │               └─ Content:
  │                   └─ TaskForm (Feature Component)
  │                       ├─ State (via useTaskForm hook):
  │                       │   ├─ data (TaskFormData)
  │                       │   ├─ errors (validation errors)
  │                       │   └─ isDirty (unsaved changes)
  │                       │
  │                       ├─ Fields:
  │                       │   ├─ Title (TextInput)
  │                       │   ├─ Description (TextArea)
  │                       │   ├─ Status (Select dropdown)
  │                       │   ├─ Priority (Select dropdown)
  │                       │   ├─ Assignee (TextInput)
  │                       │   └─ Tags (TextInput + list)
  │                       │
  │                       └─ Buttons:
  │                           ├─ Cancel (with unsaved changes prompt)
  │                           └─ Create/Update
  │
  └─ ToastContainer (UI Component)
      └─ Renders: { messages from toast slice }
          ├─ Success messages (green)
          ├─ Error messages (red)
          ├─ Info messages (blue)
          └─ Warning messages (orange)

```

## 🧩 Component Architecture Overview

| Component       | Type           | Purpose                                                                 | Props / State Access                                                                 |
|----------------|----------------|-------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| BoardView      | Container      | Orchestrates board layout, manages drag-drop state, handles modal visibility | None (reads from Redux store)                                                        |
| BoardColumn    | Presentational | Renders a status column with its tasks                                  | status, tasks[], onDragOver, onDrop                                                  |
| TaskCard       | Presentational | Displays individual task with actions                                   | task, onEdit, onDelete, onDragStart                                                  |
| FilterBar      | Feature        | Provides all filtering controls (search, status, priority, sort)        | Uses `useFilters` hook for URL sync                                                  |
| TaskForm       | Feature        | Handles task creation and editing with validation                       | task?, onSubmit, onCancel                                                            |
| Header         | Presentational | Displays title, action buttons, theme toggle                            | Reads theme from context, dispatches Redux actions                                  |
| Modal          | UI             | Generic dialog wrapper for forms and confirmations                      | isOpen, onClose, title, children                                                     |
| Button         | UI             | Reusable button with variants                                           | variant, size, onClick, children                                                     |
| Select         | UI             | Dropdown control for filters and forms                                  | options, value, onChange, label                                                      |
| TextInput      | UI             | Input field with validation feedback                                    | value, onChange, error, label                                                        |
| ThemeProvider  | Context        | Wraps app with theme state and toggle function                          | children                                                                            |

---
## 🔄 Data Flow
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   User      │───▶│  Container   │───▶│   Redux     │
│  Action     │    │  Components  │    │   Store     │
└─────────────┘    └──────────────┘    └─────────────┘
       ▲                   │                   │
       │                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Render    │◀───│Presentational│◀───│  Persisted  │
│   Update    │    │  Components  │    │ localStorage│
└─────────────┘    └──────────────┘    └─────────────┘
```

## 🧠 Why Redux?

Redux was chosen for the following reasons:

- **Complex Interactions**  
  Filters affect UI display, and future features like undo/redo can be supported easily.

- **DevTools Support**  
  Integrates with Redux DevTools for powerful time-travel debugging.

- **Middleware Support**  
  Enables adding logging, crash reporting, and async handling with ease.

- **Team Familiarity**  
  Widely used and understood across React teams (industry standard).

- **Scalability**  
  Handles deeply nested state updates better than React Context.

---

## ⚖️ Trade-offs

- **More Boilerplate**  
  Requires slices, actions, reducers, and selectors.

- **Vs Simpler Alternatives**  
  Libraries like Context API or Zustand are easier to set up but less powerful for large-scale apps.

---


## Storage Versioning

```
localStorage key: "workflow_board_data"

v1 shape (legacy):
{
  schemaVersion: 1,
  tasks: [{ id, title, status, priority, createdAt }]
}

v2 shape (current):
{
  schemaVersion: 2,
  tasks: [{ id, title, description, status, priority, assignee, tags, createdAt, updatedAt }]
}

Migration path:
loadFromStorage() checks schemaVersion.
  - v1 → runs migrateV1ToV2() → fills defaults for new fields
  - v2 → returns as-is
  - On migration, dispatches a toast notification
```

## Performance Notes

- `filteredTasks` and `tasksByStatus` are wrapped in `useMemo` in `BoardView`
  so they don't recompute on every render — only when `tasks` or `filters` change.

- `openEdit` and `handleDelete` are wrapped in `useCallback` to avoid
  passing new function references to `TaskCard` on every re-render.

- `TaskCard` could be further optimized with `React.memo` if the list grows large.
