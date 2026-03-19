# Team Workflow Board 📋

A clean and intuitive task management application that enables users to organize, prioritize, and track their work efficiently through a visual Kanban board.


## 🚀 Features

- **Intuitive Task Management:** Create, edit, and delete tasks with ease

- **Drag-and-Drop Interface:** Rearrange tasks within and across columns

- **Advanced Filtering:** Filter by status, priority, search text, and more

- **URL-Synced State:** Share filtered boards via URL parameters

- **Data Persistence:** Automatic localStorage backup with schema versioning

- **Dark/Light Theme:** Toggle between themes with persistent preference

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev        

# Run tests
npm test

```

## 🏗 Architecture Overview

### Tech Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| UI Framework | React-vite + TypeScript | Type safety, component model |
| State Management | Redux Toolkit | Scalable, DevTools support, predictable updates |
| Routing | React Router v6 | URL-based filter state |
| Drag & Drop | @dnd-kit | Accessible, modern DnD |
| Date Utilities | date-fns | Lightweight, tree-shakeable |
| Styling | CSS Modules | Scoped styles, no runtime overhead |

### File Structure
   
```
src/
├── __tests__/
│   ├── BoardView.filter.test.tsx           
│   ├── BoardView.test.tsx
├── components/ui/    
│   ├── Button/        
│   ├── TextInput/     
│   ├── TextArea/        
│   ├── Select/          
│   ├── Tag/           
│   ├── Card/            
│   ├── Modal/           
│   └── Toast/           
├── context/
│   └── ThemeContext.tsx 
├── features/
│   ├── board/           
│   ├── tasks/           
│   └── filters/         
├── hooks/
│   ├── useStorage.ts   
│   ├── useFilters.ts   
│   └── useTaskForm.ts   
├── routes/
│   └── AppContent.tsx   
├── store/
│   ├── tasksSlice.ts   
│   ├── filtersSlice.ts 
│   └── toastSlice.ts  
├── styles/
│   └── global.css  
├── types/index.ts      
└── utils/
    ├── storage.ts       
    ├── taskUtils.ts     
    └── dateUtils.ts    
```

### 📌 Key Architecture Decisions

🧠 1. State Management: Redux Toolkit

- Centralized state for tasks, filters, and notifications

- Handles complex interactions (filters affect UI, updates persist)

- **Structure:** Slice-based architecture with separate reducers for tasks, filters, and toasts

- **Benefits:**

✅ Predictable state updates

✅ Easy debugging (Redux DevTools)

✅ Clear separation of concerns

💾 2. Data Persistence: localStorage with Schema Versioning

- Offline-first experience without backend; schema versioning enables future migrations

- **Implementation**: 

  - V1 → V2 migration adds description, assignee, tags, updatedAt fields

  - loadFromStorage() automatically migrates old data on app load

  - Shows toast notification when migration happens

- **Benefits:**

✅ Non-breaking updates

✅ Smooth data evolution

✅ Automatic user awareness

🧩 3. Component Design: Separation of Container & Presentational

- **BoardView:** Container component managing state, filters, drag-drop, and modal logic

- **BoardColumn, TaskCard:** Presentational components receiving props, focused on rendering

- **FilterBar, TaskForm:** Feature-specific components with clear responsibilities

- **Benefits**

✅ Reusable components

✅ Easy to test

✅ Clean data flow

🔗 4. URL-Synced Filters (useFilters Hook)

- Shareable board states (copy URL with filters applied), browser back/forward works intuitively

- **Implementation**: URLSearchParams synced bidirectionally with Redux state

- **Benefits**

✅ Bookmarkable states

✅ Clear filter visibility in URL

✅ Better UX

🎯 5. Drag & Drop: @dnd-kit/core

- Lightweight, framework-agnostic, excellent accessibility (Supports keyboard + touch)

- **Implementation**

  -  handleDragStart → track active task

  -  handleDragOver → update column

  -  handleDragEnd → reorder using arrayMove()

- **Benefits**

✅ Smooth animations

✅ Works on mobile devices

✅ No backend dependency

🎨 6. Theme System: React Context

- Simple theme toggle without prop drilling; persisted to localStorage

- **Implementation**:

  -  ThemeContext provides theme + toggleTheme()

  -  CSS variables switched via data-theme attribute on document root

  -  Two color palettes: dark (default) and light

- **Benefits**

✅ Instant UI updates

✅ Persistent theme (localStorage)

✅ Clean global access

📝 7. Form Validation: useTaskForm Hook

- Centralized validation logic, reusable for create & edit modals

- **Validation Rules**

  - **Title**: required, max 100 characters

  - **Description**: max 2000 characters

  - **Assignee**: validated inline (no hard restrictions)

- **Benefits**

✅ DRY principle

✅ Consistent validation

✅ Clear error messages

🧪 8. Testing Strategy: React Testing Library

- **Approach**: Test user interactions, not implementation details

- **Test files**: 

    -  Filter behavior (search, status/priority filters)

    -  Core workflow (create task, see on board)

- **Providers:** renderWithProviders() wraps tests with Redux, Theme, Router

- **Benefits**

✅ Real-world test scenarios

✅ High confidence in UI behavior

✅ Maintainable tests

---

## 🧪 Testing Coverage

### ✅ Core Workflow
- Create task → appears on board

### ✅ UI Behavior
- Search filter works correctly

---

## ⚠️ Known Limitations / Trade-offs

- **No backend** — All state is in localStorage. Multi-tab sync not handled.

- **Drag-and-drop reorder** saves the entire task array; not optimized for large datasets.

- **No pagination** — All tasks are rendered at once.

- **User Authentication** -  No multi-user support or task assignment enforcement

---

## 🤖 AI Assistance

### Where AI was used:
- Initial testing structure (React Testing Library)

- README and documentation drafting

- Minor refactoring suggestions

---

## 📝 License

This project is open source and available under the MIT License.


## ⚙️ Installation & Setup

 Clone the repo
   ```bash
   git clone https://github.com/arunjo96/workflow_board.git
