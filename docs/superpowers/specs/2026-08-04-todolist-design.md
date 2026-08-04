# ToDo Electron App — Design Spec

**Date:** 2026-08-04
**Status:** Approved
**Stack:** Electron + React + Vite + Electron Forge

---

## 1. Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Electron (bundled Chromium + Node.js) |
| Frontend | React 18 + Vite (HMR, fast builds) |
| Build/Packaging | Electron Forge → Windows `.exe` installer |
| Data Persistence | `electron-store` → `%APPDATA%/com.todolist/app.json` |
| State Management | React Context + `useReducer` |
| Styling | Tailwind CSS |
| Icons | `lucide-react` |

---

## 2. Data Model

```typescript
interface Category {
  id: string;
  name: string;
  color: string;   // hex, e.g. "#3B82F6"
  createdAt: number;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string;
  dueDate?: string;  // ISO date string YYYY-MM-DD
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  todos: Todo[];
  categories: Category[];
  settings: {
    windowBounds?: { x?: number; y?: number; width?: number; height?: number };
    theme: "light" | "dark";
  };
}
```

**Persistence strategy:** `electron-store` writes to the Windows AppData folder automatically. No manual file I/O needed.

---

## 3. Features

### 3.1 Categories
- Create, rename, recolor, delete categories
- Sidebar navigation: click a category to filter to it
- "All" view shows every category's tasks
- Default categories: Work (blue), Personal (green), Shopping (amber)

### 3.2 Tasks (Core CRUD)
- **Add:** Modal dialog with title (required), description (optional), due date picker, category selector
- **Toggle:** Checkbox click marks complete; completed tasks move to bottom of list
- **Edit:** Click task → inline edit or modal; title and description editable
- **Delete:** Trash icon; after delete, show a toast with an "Undo" button for 3 seconds
- **Overdue indicator:** Tasks past due date shown with red left border

### 3.3 Due Dates & Reminders
- Date picker (HTML `<input type="date">`) in add/edit dialog
- Visual states:
  - 🔴 Red left border = overdue (past due date, not completed)
  - 🟡 Amber badge = due today
  - 🟢 No accent = no due date or future due date
- On app launch, check for overdue incomplete tasks and request Windows notification permission
- Display system notification for overdue tasks (using `electron` main process)

### 3.4 Search / Filter / Sort
- **Search:** Global search bar in header; matches against title and description (case-insensitive)
- **Filter:**
  - Status: All / Active / Completed
  - Category: individual categories or "All"
  - Due: Overdue / Today / None
- **Sort:**
  - Created date (newest first — default)
  - Due date (soonest first)
  - Alphabetical (A→Z)

---

## 4. UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ☰  My ToDo          [🔍 Search tasks...]         [+ Add]   │
├──────────────┬───────────────────────────────────────────────┤
│ 📁 All       │  Today                                        │
│ 📁 Work 🔵   │  □ Buy groceries         📅 Today   🔴 delete │
│ 📁 Personal 🟢│  ☐ Read the book         📅 Tomorrow          │
│ 📁 Shopping 🟡│                                               │
│ + New Cat    │  This Week                                    │
│              │  ☐ Finish report         📅 Fri     🔵 delete  │
│ ───────────  │                                               │
│ Completed (3)│  Archived                                     │
│  ☑ Old task  │  (none)                                       │
└──────────────┴───────────────────────────────────────────────┘
```

**Key UI decisions:**
- Left sidebar (~220px): persistent, shows categories
- Main area (~calc(100% - 220px)): shows current filtered view
- Header: app title, centered search bar, floating action button (+)
- Tasks rendered as cards with left-color border = category color
- Completed tasks are visually faded (opacity 50%)

---

## 5. File Structure

```
todolist-electron/
├── package.json
├── vite.config.ts
├── electron/main.ts          # Main process: window management, store, notifications
├── electron/preload.ts       # Preload script: expose API to renderer
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component with context provider
│   ├── types.ts              # TypeScript interfaces
│   ├── store/
│   │   └── useStore.ts       # electron-store singleton + context
│   ├── components/
│   │   ├── Layout.tsx        # Sidebar + main area shell
│   │   ├── Sidebar.tsx       # Category list
│   │   ├── TaskList.tsx      # Renders filtered todo list
│   │   ├── TaskItem.tsx      # Individual task card
│   │   ├── TaskModal.tsx     # Add/edit task dialog
│   │   ├── CategoryModal.tsx # Add/edit category dialog
│   │   ├── SearchBar.tsx     # Header search input
│   │   ├── FilterBar.tsx     # Filter/sort controls
│   │   └── Toast.tsx         # Undo toast notification
│   └── index.css             # Tailwind imports + global styles
├── public/
└── docs/superpowers/specs/
    └── 2026-08-04-todolist-design.md
```

---

## 6. Electron Main Process Architecture

```
main.ts
├── Create BrowserWindow (800×600, resizable)
├── Load Vite dev server (development) or built dist (production)
├── electron-store instance (key: "todolist-data")
├── ipcMain handlers:
│   ├── "get-todos"       → return todos
│   ├── "add-todo"        → push to store, emit change
│   ├── "update-todo"     → find by id, update, emit change
│   ├── "delete-todo"     → splice by id, emit change + undo data
│   ├── "undo-delete"     → re-insert deleted todo
│   ├── "add-category"    → push to store
│   ├── "update-category" → find by id, update
│   ├── "delete-category" → remove category, reassign its todos
│   └── "check-notifications" → request permission, notify overdue
└── on "window-all-closed" → app.quit()
```

---

## 7. Development Workflow

1. `npm run dev` → starts Vite dev server + Electron in development mode with HMR
2. `npm run build` → builds renderer, then packages with Forge
3. `npm run package` → produces `out/todolist-windows-x64/` with `.exe`

---

## 8. Out of Scope (Future)

- Cloud sync / multi-device
- Drag-and-drop task reordering
- Recurring tasks
- Sub-tasks / nested tasks
- Tags (separate from categories)
- Dark mode toggle (stored in settings but not implemented in MVP)
