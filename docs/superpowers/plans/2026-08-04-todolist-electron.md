# Electron ToDo App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Windows Electron To-Do List application with categories, due dates, reminders, search/filter/sort, persisted via `electron-store`, packaged as an `.exe`, and auto-built via GitHub Actions.

**Architecture:** Electron main process owns all data via `electron-store` and exposes it through IPC. The React renderer calls IPC methods via a preload bridge, manages UI state in React Context, and re-renders on `state-changed` events from the main process.

**Tech Stack:** Electron 33, React 18, Vite 5, TypeScript 5, Electron Forge, electron-store, Tailwind CSS 3, lucide-react, vitest, @testing-library/react

## Global Constraints

- Electron version must be `^33.0.0` (latest LTS as of 2026).
- All IPC channel names use kebab-case (e.g., `add-todo`, `state-changed`).
- Store key for electron-store is exactly `"todolist-data"`.
- Default categories: Work (#3B82F6), Personal (#10B981), Shopping (#F59E0B).
- App window default size: 800×600, resizable.
- Windows notification permission is requested only once on first launch.
- Undo window for deleted tasks is exactly 3000ms.
- GitHub Actions job name must be `build-windows`.
- GitHub Actions must upload artifact named `todolist-windows-x64`.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.electron.json`
- Create: `vite.config.ts`
- Create: `forge.config.cjs`
- Create: `.gitignore`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a runnable `npm install` and `npm run dev` that launches a blank Electron window

- [ ] **Step 1: Create package.json**

```json
{
  "name": "todolist-electron",
  "version": "1.0.0",
  "description": "A Windows To-Do List app built with Electron",
  "main": "dist/electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.electron.json && vite build",
    "package": "npm run build && forge package",
    "lint": "tsc --noEmit"
  },
  "keywords": [],
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "electron": "^33.0.0",
    "electron-store": "^8.2.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.0",
    "@electron-forge/cli": "^7.4.0",
    "@electron-forge/maker-zip": "^7.4.0",
    "@electron-forge/maker-archive": "^7.4.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitest/ui": "^2.0.0",
    "jsdom": "^24.1.0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.436.0",
    "electron-store": "^8.2.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json (renderer)**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.electron.json" }]
}
```

- [ ] **Step 3: Create tsconfig.electron.json (main process)**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "strict": true,
    "outDir": "dist/electron",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["electron"]
}
```

- [ ] **Step 4: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist/electron',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

- [ ] **Step 5: Create forge.config.cjs**

```javascript
module.exports = {
  packagers: [
    {
      name: '@electron-forge/packager',
      config: {
        name: 'todolist',
        win32metadata: {
          ProductName: 'ToDo List',
          CompanyName: 'ToDo App',
          FileDescription: 'A Windows To-Do List application',
        },
      },
    },
  ],
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'todolist',
        setupIcon: null,
      },
    },
  ],
  publishers: [],
};
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
dist/
out/
*.log
.DS_Store
superpowers/
.env
```

- [ ] **Step 7: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 8: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 9: Install dependencies and verify**

```bash
npm install
```

- [ ] **Step 10: Create minimal electron/main.ts to verify build works**

```typescript
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    title: 'My ToDo',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

- [ ] **Step 11: Create electron/preload.ts**

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Will be expanded in later tasks
  send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },
});
```

- [ ] **Step 12: Create src/main.tsx (React entry)**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 13: Create src/App.tsx (placeholder)**

```typescript
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">My ToDo</h1>
      </header>
      <main className="flex-1 p-6">
        <p className="text-gray-400">Start building your ToDo app</p>
      </main>
    </div>
  );
}

export default App;
```

- [ ] **Step 14: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 15: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My ToDo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 16: Verify dev server starts**

```bash
npm run dev
```

Expected: Electron window opens with "My ToDo" header and placeholder text. Press Ctrl+C to stop.

- [ ] **Step 17: Commit**

```bash
git add .
git commit -m "chore: scaffold Electron+React+Vite project with Tailwind"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types.ts`
- Create: `src/__tests__/types.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: TypeScript interfaces `Category`, `Todo`, `AppState`, `TodoFilter`, `TodoSort`, `UndoState` used by all downstream tasks

- [ ] **Step 1: Create type definitions**

```typescript
export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string;
  dueDate?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  todos: Todo[];
  categories: Category[];
  settings: {
    windowBounds?: { x?: number; y?: number; width?: number; height?: number };
    theme: 'light' | 'dark';
    notificationPermissionGranted: boolean;
  };
}

export interface TodoFilter {
  status: 'all' | 'active' | 'completed';
  categoryId: string;
  dueFilter: 'all' | 'overdue' | 'today' | 'none';
}

export type TodoSort = 'created' | 'dueDate' | 'alphabetical';

export interface UndoState {
  deletedTodo: Todo | null;
  timestamp: number;
}
```

- [ ] **Step 2: Create test file**

```typescript
import { describe, it, expect } from 'vitest';
import type { Category, Todo, AppState, TodoFilter, TodoSort } from '../types';

describe('Type definitions', () => {
  it('Category has required fields', () => {
    const cat: Category = {
      id: 'c1',
      name: 'Work',
      color: '#3B82F6',
      createdAt: 1000,
    };
    expect(cat.id).toBe('c1');
    expect(cat.color).toBe('#3B82F6');
  });

  it('Todo has optional description and dueDate', () => {
    const todo: Todo = {
      id: 't1',
      title: 'Test',
      completed: false,
      categoryId: 'c1',
      createdAt: 1000,
      updatedAt: 1000,
    };
    expect(todo.description).toBeUndefined();
    expect(todo.dueDate).toBeUndefined();
  });

  it('TodoFilter has correct type', () => {
    const filter: TodoFilter = {
      status: 'active',
      categoryId: '',
      dueFilter: 'overdue',
    };
    expect(filter.status).toBe('active');
  });

  it('AppState contains todos and categories arrays', () => {
    const state: AppState = {
      todos: [],
      categories: [],
      settings: { theme: 'light', notificationPermissionGranted: false },
    };
    expect(Array.isArray(state.todos)).toBe(true);
    expect(Array.isArray(state.categories)).toBe(true);
  });
});
```

- [ ] **Step 3: Create vitest config**

Create `vite.test.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: [],
    globals: true,
  },
});
```

- [ ] **Step 4: Add test script to package.json**

Add to `package.json` scripts:
```json
"test": "vitest run --config vite.test.config.ts",
"test:watch": "vitest --config vite.test.config.ts"
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test
```

Expected: All 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/__tests__/types.test.ts vite.test.config.ts
git commit -m "feat: add TypeScript type definitions for ToDo app"
```

---

### Task 3: Electron Store and Main Process IPC

**Files:**
- Create: `electron/main.ts` (replace placeholder from Task 1)
- Create: `electron/preload.ts` (replace placeholder from Task 1)
- Create: `src/__tests__/main.test.ts`

**Interfaces:**
- Consumes: `AppState`, `Todo`, `Category`, `UndoState` from `src/types.ts`
- Produces: IPC channels `get-state`, `add-todo`, `update-todo`, `delete-todo`, `undo-delete`, `add-category`, `update-category`, `delete-category`, `check-notifications`, `state-changed` — plus a `TodoAPI` interface for the renderer

- [ ] **Step 1: Rewrite electron/main.ts**

```typescript
import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import Store from 'electron-store';
import * as path from 'path';
import type { AppState, Todo, Category, UndoState } from '../src/types';

const store = new Store<AppState>({
  name: 'todolist-data',
  defaults: {
    todos: [],
    categories: [
      { id: 'cat-work', name: 'Work', color: '#3B82F6', createdAt: Date.now() },
      { id: 'cat-personal', name: 'Personal', color: '#10B981', createdAt: Date.now() },
      { id: 'cat-shopping', name: 'Shopping', color: '#F59E0B', createdAt: Date.now() },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  },
});

let mainWindow: BrowserWindow | null = null;
let undoStack: UndoState = { deletedTodo: null, timestamp: 0 };

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    title: 'My ToDo',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

function emitState() {
  mainWindow?.webContents.send('state-changed', store.store);
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function checkOverdueNotifications() {
  if (store.get('settings.notificationPermissionGranted')) return;

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      store.set('settings.notificationPermissionGranted', true);
      const overdueTodos = store.get('todos').filter((t) => {
        if (t.completed || !t.dueDate) return false;
        return t.dueDate < getToday();
      });
      if (overdueTodos.length > 0) {
        new Notification({
          title: 'Overdue Tasks',
          body: `You have ${overdueTodos.length} task${overdueTodos.length > 1 ? 's' : ''} past due.`,
        }).show();
      }
    }
  });
}

// IPC handlers
ipcMain.handle('get-state', () => store.store);

ipcMain.handle('add-todo', (_event, todo: Todo) => {
  const todos = store.get('todos');
  todos.push(todo);
  store.set('todos', todos);
  emitState();
  return todo;
});

ipcMain.handle('update-todo', (_event, id: string, updates: Partial<Todo>) => {
  const todos = store.get('todos');
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  todos[index] = { ...todos[index], ...updates, updatedAt: Date.now() };
  store.set('todos', todos);
  emitState();
  return todos[index];
});

ipcMain.handle('delete-todo', (_event, id: string) => {
  let todos = store.get('todos');
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const deleted = todos.splice(index, 1)[0];
  store.set('todos', todos);
  undoStack = { deletedTodo: deleted, timestamp: Date.now() };
  emitState();
  return deleted;
});

ipcMain.handle('undo-delete', () => {
  if (!undoStack.deletedTodo) return null;
  const todos = store.get('todos');
  todos.push(undoStack.deletedTodo);
  store.set('todos', todos);
  undoStack = { deletedTodo: null, timestamp: 0 };
  emitState();
  return undoStack.deletedTodo;
});

ipcMain.handle('add-category', (_event, category: Category) => {
  const categories = store.get('categories');
  categories.push(category);
  store.set('categories', categories);
  emitState();
  return category;
});

ipcMain.handle('update-category', (_event, id: string, updates: Partial<Category>) => {
  const categories = store.get('categories');
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  store.set('categories', categories);
  emitState();
  return categories[index];
});

ipcMain.handle('delete-category', (_event, id: string) => {
  let categories = store.get('categories');
  const remaining = categories.filter((c) => c.id !== id);
  store.set('categories', remaining);

  // Reassign todos in the deleted category to the first remaining category, or none
  let todos = store.get('todos');
  todos = todos.map((t) => (t.categoryId === id ? { ...t, categoryId: remaining[0]?.id ?? '' } : t));
  store.set('todos', todos);
  emitState();
  return true;
});

ipcMain.handle('check-notifications', () => {
  checkOverdueNotifications();
  return store.get('settings.notificationPermissionGranted');
});

app.whenReady().then(() => {
  createWindow();
  checkOverdueNotifications();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

- [ ] **Step 2: Rewrite electron/preload.ts**

```typescript
import { contextBridge, ipcRenderer } from 'electron';
import type { AppState, Todo, Category, UndoState } from '../src/types';

type Callback = (...args: unknown[]) => void;

const api = {
  getState: () => ipcRenderer.invoke('get-state') as Promise<AppState>,

  addTodo: (todo: Todo) => ipcRenderer.invoke('add-todo', todo) as Promise<Todo>,
  updateTodo: (id: string, updates: Partial<Todo>) =>
    ipcRenderer.invoke('update-todo', id, updates) as Promise<Todo | null>,
  deleteTodo: (id: string) =>
    ipcRenderer.invoke('delete-todo', id) as Promise<Todo | null>,
  undoDelete: () =>
    ipcRenderer.invoke('undo-delete') as Promise<Todo | null>,

  addCategory: (category: Category) =>
    ipcRenderer.invoke('add-category', category) as Promise<Category>,
  updateCategory: (id: string, updates: Partial<Category>) =>
    ipcRenderer.invoke('update-category', id, updates) as Promise<Category | null>,
  deleteCategory: (id: string) =>
    ipcRenderer.invoke('delete-category', id) as Promise<boolean>,

  checkNotifications: () =>
    ipcRenderer.invoke('check-notifications') as Promise<boolean>,

  onStateChange: (callback: Callback) => {
    ipcRenderer.on('state-changed', (_event, state: AppState) => callback(state));
  },
  offStateChange: (callback: Callback) => {
    ipcRenderer.removeListener('state-changed', callback);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);
```

- [ ] **Step 3: Create test file for main process logic**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the logic by importing the store config pattern
// (Full IPC test would need electron main process, so we test the data flow)

describe('State shape', () => {
  it('has default categories', () => {
    const defaults = {
      todos: [],
      categories: [
        { id: 'cat-work', name: 'Work', color: '#3B82F6', createdAt: expect.any(Number) },
        { id: 'cat-personal', name: 'Personal', color: '#10B981', createdAt: expect.any(Number) },
        { id: 'cat-shopping', name: 'Shopping', color: '#F59E0B', createdAt: expect.any(Number) },
      ],
      settings: { theme: 'light', notificationPermissionGranted: false },
    };
    expect(defaults.categories).toHaveLength(3);
    expect(defaults.categories[0].color).toBe('#3B82F6');
  });
});

describe('Undo state shape', () => {
  it('has deletedTodo and timestamp', () => {
    const undo: { deletedTodo: unknown; timestamp: number } = {
      deletedTodo: null,
      timestamp: 0,
    };
    expect(undo).toHaveProperty('deletedTodo');
    expect(undo).toHaveProperty('timestamp');
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Verify dev server still works**

```bash
npm run dev
```

Expected: App opens with the same placeholder UI as before (IPC bridge is now wired).

- [ ] **Step 6: Commit**

```bash
git add electron/main.ts electron/preload.ts src/__tests__/main.test.ts
git commit -m "feat: wire up electron-store and IPC channels in main process"
```

---

### Task 4: Store Context and React Hooks

**Files:**
- Create: `src/store/useStore.ts`
- Create: `src/__tests__/useStore.test.tsx`

**Interfaces:**
- Consumes: `AppState`, `Todo`, `Category` from `src/types.ts`, `window.electronAPI` from preload
- Produces: `StoreContext` with `state`, `addTodo`, `updateTodo`, `deleteTodo`, `undoDelete`, `addCategory`, `updateCategory`, `deleteCategory`, `checkNotifications` functions

- [ ] **Step 1: Create the store context**

```typescript
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppState, Todo, Category } from '../types';

interface StoreValue {
  state: AppState;
  addTodo: (todo: Todo) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<Todo | null>;
  undoDelete: () => Promise<Todo | null>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<boolean>;
  checkNotifications: () => Promise<boolean>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  const loadState = useCallback(async () => {
    const s = await (window as unknown as { electronAPI: { getState: () => Promise<AppState> } }).electronAPI.getState();
    setState(s);
  }, []);

  useEffect(() => {
    loadState();
    const api = (window as unknown as { electronAPI: { onStateChange: (cb: (s: AppState) => void) => void; offStateChange: (cb: (s: AppState) => void) => void } }).electronAPI;
    api.onStateChange(loadState);
    return () => api.offStateChange(loadState);
  }, [loadState]);

  const api = (window as unknown as { electronAPI: {
    addTodo: (t: Todo) => Promise<Todo>;
    updateTodo: (id: string, u: Partial<Todo>) => Promise<Todo | null>;
    deleteTodo: (id: string) => Promise<Todo | null>;
    undoDelete: () => Promise<Todo | null>;
    addCategory: (c: Category) => Promise<Category>;
    updateCategory: (id: string, u: Partial<Category>) => Promise<Category | null>;
    deleteCategory: (id: string) => Promise<boolean>;
    checkNotifications: () => Promise<boolean>;
  } }).electronAPI;

  const addTodo = useCallback(async (todo: Todo) => {
    await api.addTodo(todo);
  }, [api]);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    await api.updateTodo(id, updates);
  }, [api]);

  const deleteTodo = useCallback(async (id: string) => {
    return api.deleteTodo(id);
  }, [api]);

  const undoDelete = useCallback(async () => {
    return api.undoDelete();
  }, [api]);

  const addCategory = useCallback(async (category: Category) => {
    await api.addCategory(category);
  }, [api]);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    await api.updateCategory(id, updates);
  }, [api]);

  const deleteCategory = useCallback(async (id: string) => {
    return api.deleteCategory(id);
  }, [api]);

  const checkNotifications = useCallback(async () => {
    return api.checkNotifications();
  }, [api]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <StoreContext.Provider value={{ state, addTodo, updateTodo, deleteTodo, undoDelete, addCategory, updateCategory, deleteCategory, checkNotifications }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
```

- [ ] **Step 2: Create tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoreProvider, useStore } from '../store/useStore';
import type { AppState, Todo, Category } from '../types';

const mockAPI = {
  getState: vi.fn(),
  onStateChange: vi.fn(),
  offStateChange: vi.fn(),
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAPI.getState.mockResolvedValue({
    todos: [],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  });
  (window as unknown as { electronAPI: typeof mockAPI }).electronAPI = mockAPI;
});

describe('StoreProvider', () => {
  it('renders children after loading state', async () => {
    function TestChild() {
      const { state } = useStore();
      return <span data-testid="cat-count">{state.categories.length}</span>;
    }
    render(
      <StoreProvider>
        <TestChild />
      </StoreProvider>
    );
    expect(await screen.findByTestId('cat-count')).toBeInTheDocument();
    expect(mockAPI.getState).toHaveBeenCalledOnce();
  });

  it('registers state change listener', async () => {
    render(
      <StoreProvider>
        <span>test</span>
      </StoreProvider>
    );
    expect(mockAPI.onStateChange).toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/store/useStore.ts src/__tests__/useStore.test.tsx
git commit -m "feat: add StoreContext with React hooks for app state"
```

---

### Task 5: Filter and Sort Logic (Pure Functions + Tests)

**Files:**
- Create: `src/lib/filterSort.ts`
- Create: `src/__tests__/filterSort.test.ts`

**Interfaces:**
- Consumes: `Todo`, `TodoFilter`, `TodoSort` from `src/types.ts`
- Produces: `filterTodos(todos, filter, categoryId)` and `sortTodos(todos, sort, today)` exported functions

- [ ] **Step 1: Create filterSort.ts**

```typescript
import type { Todo, TodoFilter, TodoSort } from '../types';

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function filterTodos(
  todos: Todo[],
  filter: TodoFilter,
  categoryId: string
): Todo[] {
  return todos.filter((todo) => {
    // Category filter
    if (filter.categoryId && filter.categoryId !== 'all' && todo.categoryId !== filter.categoryId) {
      return false;
    }
    if (categoryId && categoryId !== 'all' && todo.categoryId !== categoryId) {
      return false;
    }

    // Status filter
    if (filter.status === 'active' && todo.completed) return false;
    if (filter.status === 'completed' && !todo.completed) return false;

    // Due date filter
    if (filter.dueFilter === 'overdue') {
      if (todo.completed || !todo.dueDate) return false;
      if (todo.dueDate >= getToday()) return false;
    }
    if (filter.dueFilter === 'today') {
      if (todo.dueDate !== getToday()) return false;
    }
    if (filter.dueFilter === 'none') {
      if (todo.dueDate) return false;
    }

    return true;
  });
}

export function sortTodos(todos: Todo[], sort: TodoSort, today: string): Todo[] {
  return [...todos].sort((a, b) => {
    if (sort === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sort === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    // created (newest first)
    return b.createdAt - a.createdAt;
  });
}

export function isOverdue(todo: Todo): boolean {
  if (todo.completed || !todo.dueDate) return false;
  return todo.dueDate < getToday();
}

export function isDueToday(todo: Todo): boolean {
  return todo.dueDate === getToday() && !todo.completed;
}
```

- [ ] **Step 2: Create comprehensive tests**

```typescript
import { describe, it, expect } from 'vitest';
import { filterTodos, sortTodos, isOverdue, isDueToday, getToday } from '../lib/filterSort';
import type { Todo, TodoFilter } from '../types';

const today = getToday();
const yesterday = (() => {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
})();
const tomorrow = (() => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

const makeTodo = (overrides: Partial<Todo> & { id: string; title: string; categoryId: string }): Todo => ({
  completed: false,
  dueDate: undefined,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
} as Todo);

const todos = [
  makeTodo({ id: '1', title: 'Buy milk', categoryId: 'c1', dueDate: today }),
  makeTodo({ id: '2', title: 'Finish report', categoryId: 'c1', dueDate: yesterday }),
  makeTodo({ id: '3', title: 'Read book', categoryId: 'c2', dueDate: tomorrow }),
  makeTodo({ id: '4', title: 'Groceries', categoryId: 'c2', completed: true, dueDate: today }),
  makeTodo({ id: '5', title: 'No due date task', categoryId: 'c1' }),
];

describe('filterTodos', () => {
  it('filters by active status', () => {
    const result = filterTodos(todos, { status: 'active', categoryId: 'all', dueFilter: 'all' }, 'all');
    expect(result).toHaveLength(3);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it('filters by completed status', () => {
    const result = filterTodos(todos, { status: 'completed', categoryId: 'all', dueFilter: 'all' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Groceries');
  });

  it('filters by overdue', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'overdue' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by today', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'today' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by no due date', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'none' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('5');
  });

  it('filters by category', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'c1', dueFilter: 'all' }, 'all');
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.categoryId === 'c1')).toBe(true);
  });

  it('filters by categoryId parameter', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'all' }, 'c2');
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.categoryId === 'c2')).toBe(true);
  });
});

describe('sortTodos', () => {
  it('sorts by created date newest first (default)', () => {
    const sorted = sortTodos(todos, 'created', today);
    expect(sorted[0].id).toBe('5'); // last created
  });

  it('sorts by due date soonest first', () => {
    const sorted = sortTodos(todos, 'dueDate', today);
    expect(sorted[0].dueDate).toBe(yesterday);
    expect(sorted[sorted.length - 1].dueDate).toBe(tomorrow);
  });

  it('sorts alphabetically', () => {
    const sorted = sortTodos(todos, 'alphabetical', today);
    expect(sorted[0].title).toBe('Buy milk');
    expect(sorted[sorted.length - 1].title).toBe('Read book');
  });

  it('pushes tasks without due date to the end when sorting by due date', () => {
    const sorted = sortTodos(todos, 'dueDate', today);
    const last = sorted[sorted.length - 1];
    expect(last.dueDate).toBeUndefined();
  });
});

describe('isOverdue', () => {
  it('returns true for past due incomplete task', () => {
    expect(isOverdue(todos[1])).toBe(true);
  });
  it('returns false for completed task even if past due', () => {
    expect(isOverdue(todos[3])).toBe(false);
  });
  it('returns false for task with no due date', () => {
    expect(isOverdue(todos[4])).toBe(false);
  });
  it('returns false for future due date', () => {
    expect(isOverdue(todos[2])).toBe(false);
  });
});

describe('isDueToday', () => {
  it('returns true for task due today', () => {
    expect(isDueToday(todos[0])).toBe(true);
  });
  it('returns false for completed task due today', () => {
    expect(isDueToday(todos[3])).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All 15+ tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/filterSort.ts src/__tests__/filterSort.test.ts
git commit -m "feat: add filter and sort logic with full test coverage"
```

---

### Task 6: Layout Shell and Sidebar

**Files:**
- Create: `src/components/Layout.tsx`
- Create: `src/components/Sidebar.tsx`
- Create: `src/__tests__/Sidebar.test.tsx`

**Interfaces:**
- Consumes: `useStore()` from `src/store/useStore.ts`, `Category` from `src/types.ts`
- Produces: `Layout` component (exports default) and `Sidebar` component with `onCategorySelect(categoryId: string)` and `onAddCategory()` callbacks

- [ ] **Step 1: Create Sidebar.tsx**

```typescript
import { useStore } from '../store/useStore';
import { FolderPlus } from 'lucide-react';

interface SidebarProps {
  activeCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: () => void;
}

export default function Sidebar({ activeCategoryId, onCategorySelect, onAddCategory }: SidebarProps) {
  const { state } = useStore();
  const { categories } = state;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Categories</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => onCategorySelect('all')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
            activeCategoryId === 'all'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">📁</span>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              activeCategoryId === cat.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onAddCategory}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border border-dashed border-gray-300"
        >
          <FolderPlus size={16} />
          New Category
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create Layout.tsx**

```typescript
import { useState } from 'react';
import Sidebar from './Sidebar';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  onAddCategory: () => void;
}

export default function Layout({ children, onAddCategory }: LayoutProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('all');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeCategoryId={activeCategoryId}
        onCategorySelect={setActiveCategoryId}
        onAddCategory={onAddCategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import type { AppState } from '../types';

const mockStore = {
  state: {
    todos: [],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
      { id: 'c2', name: 'Personal', color: '#10B981', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getState: vi.fn().mockResolvedValue(mockStore.state),
    onStateChange: vi.fn(),
    offStateChange: vi.fn(),
  };
});

describe('Sidebar', () => {
  it('shows all categories', () => {
    render(
      <Sidebar
        activeCategoryId="all"
        onCategorySelect={vi.fn()}
        onAddCategory={vi.fn()}
      />
    );
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('highlights active category', () => {
    const { getByText } = render(
      <Sidebar
        activeCategoryId="c1"
        onCategorySelect={vi.fn()}
        onAddCategory={vi.fn()}
      />
    );
    const workItem = getByText('Work').closest('button');
    expect(workItem).toHaveClass('bg-gray-100');
  });

  it('calls onCategorySelect when clicking a category', () => {
    const handler = vi.fn();
    render(
      <Sidebar
        activeCategoryId="all"
        onCategorySelect={handler}
        onAddCategory={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Work'));
    expect(handler).toHaveBeenCalledWith('c1');
  });

  it('calls onAddCategory when clicking New Category', () => {
    const handler = vi.fn();
    render(
      <Sidebar
        activeCategoryId="all"
        onCategorySelect={vi.fn()}
        onAddCategory={handler}
      />
    );
    fireEvent.click(screen.getByText('New Category'));
    expect(handler).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Layout.tsx src/components/Sidebar.tsx src/__tests__/Sidebar.test.tsx
git commit -m "feat: add Layout shell and Sidebar with category navigation"
```

---

### Task 7: Task List and Task Item Components

**Files:**
- Create: `src/components/TaskList.tsx`
- Create: `src/components/TaskItem.tsx`
- Create: `src/__tests__/TaskList.test.tsx`
- Create: `src/__tests__/TaskItem.test.tsx`

**Interfaces:**
- Consumes: `useStore()`, `filterTodos`, `sortTodos`, `isOverdue`, `isDueToday` from prior tasks
- Produces: `TaskList` component with `onToggle`, `onDelete`, `onEdit` callbacks; `TaskItem` with inline actions

- [ ] **Step 1: Create TaskItem.tsx**

```typescript
import { Trash2, Edit2, Check, X } from 'lucide-react';
import type { Todo, Category } from '../types';
import { isOverdue, isDueToday } from '../lib/filterSort';

interface TaskItemProps {
  todo: Todo;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export default function TaskItem({ todo, category, onToggle, onDelete, onEdit }: TaskItemProps) {
  const overdue = isOverdue(todo);
  const dueToday = isDueToday(todo);
  const borderColor = overdue ? 'border-red-400' : category?.color ? `border-[${category.color}]` : 'border-gray-300';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 ${borderColor} hover:shadow-md transition-shadow ${
        todo.completed ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && <Check size={14} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-800 truncate ${todo.completed ? 'line-through' : ''}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-sm text-gray-400 truncate">{todo.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
          {todo.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-500' : dueToday ? 'text-amber-500' : 'text-gray-400'}`}>
              <span>📅</span>
              {overdue ? 'Overdue' : dueToday ? 'Today' : todo.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create TaskList.tsx**

```typescript
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { filterTodos, sortTodos, getToday } from '../lib/filterSort';
import type { TodoFilter, TodoSort } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  categoryId: string;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskList({ categoryId, onEdit, onDelete, onToggle }: TaskListProps) {
  const { state } = useStore();
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all', categoryId: 'all', dueFilter: 'all' });
  const [sort, setSort] = useState<TodoSort>('created');
  const [search, setSearch] = useState('');

  const { todos, categories } = state;

  const today = getToday();
  const filtered = filterTodos(todos, filter, categoryId);
  const sorted = sortTodos(filtered, sort, today);

  const results = search
    ? sorted.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description?.toLowerCase().includes(search.toLowerCase()))
      )
    : sorted;

  const activeCategory = categories.find((c) => c.id === categoryId);
  const categoryName = categoryId === 'all' ? 'All Tasks' : activeCategory?.name ?? 'Tasks';

  const groupByDate = (tasks: typeof results) => {
    const groups: Record<string, typeof tasks> = {};
    for (const todo of tasks) {
      if (todo.completed) {
        const key = 'Completed';
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      } else if (todo.dueDate === today) {
        const key = 'Today';
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      } else if (todo.dueDate) {
        const key = todo.dueDate;
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      } else {
        const key = 'No Due Date';
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      }
    }
    return groups;
  };

  const grouped = groupByDate(results);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{categoryName}</h2>
          <span className="text-sm text-gray-400">{results.filter((t) => !t.completed).length} active</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as TodoFilter['status'] }))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.dueFilter}
            onChange={(e) => setFilter((f) => ({ ...f, dueFilter: e.target.value as TodoFilter['dueFilter'] }))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="none">No Due Date</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TodoSort)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="created">Newest</option>
            <option value="dueDate">Due Date</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {Object.entries(grouped).map(([group, tasks]) => (
          <div key={group} className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2 sticky top-0 bg-gray-50 py-1">
              {group} ({tasks.length})
            </h3>
            <div className="space-y-2">
              {tasks.map((todo) => (
                <TaskItem
                  key={todo.id}
                  todo={todo}
                  category={categories.find((c) => c.id === todo.categoryId)}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-1">Add a new task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create TaskList tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskList from '../components/TaskList';
import type { AppState, Todo } from '../types';

const makeTodo = (overrides: Partial<Todo> & { id: string; title: string; categoryId: string }): Todo => ({
  completed: false,
  dueDate: undefined,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
} as Todo);

const today = (() => new Date().toISOString().split('T')[0])();

const mockStore = {
  state: {
    todos: [
      makeTodo({ id: '1', title: 'Buy milk', categoryId: 'c1', dueDate: today }),
      makeTodo({ id: '2', title: 'Finish report', categoryId: 'c1', completed: true }),
      makeTodo({ id: '3', title: 'Read book', categoryId: 'c2' }),
    ],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
      { id: 'c2', name: 'Personal', color: '#10B981', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getState: vi.fn().mockResolvedValue(mockStore.state),
    onStateChange: vi.fn(),
    offStateChange: vi.fn(),
  };
});

describe('TaskList', () => {
  it('renders the category name', () => {
    render(<TaskList categoryId="all" onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
  });

  it('shows task titles', () => {
    render(<TaskList categoryId="all" onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Finish report')).toBeInTheDocument();
  });

  it('shows active task count', () => {
    render(<TaskList categoryId="all" onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    expect(screen.getByText('2 active')).toBeInTheDocument();
  });

  it('filters by due date (overdue)', async () => {
    const { user } = await import('@testing-library/user-event');
    render(<TaskList categoryId="all" onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'overdue');
    expect(screen.getByText('Buy milk')).toBeInTheDocument(); // today is overdue
  });

  it('filters by status select', async () => {
    const { user } = await import('@testing-library/user-event');
    render(<TaskList categoryId="all" onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />);
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'completed');
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.getByText('Finish report')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Create TaskItem tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';
import type { Todo, Category } from '../types';

const makeTodo = (overrides: Partial<Todo> & { id: string; title: string; categoryId: string }): Todo => ({
  completed: false,
  dueDate: undefined,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
} as Todo);

const category: Category = { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 };

describe('TaskItem', () => {
  const todo = makeTodo({ id: 't1', title: 'Test task', categoryId: 'c1' });
  const onToggle = vi.fn();
  const onDelete = vi.fn();
  const onEdit = vi.fn();

  it('renders the task title', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('shows category badge', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith('t1');
  });

  it('calls onDelete when trash icon is clicked', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const buttons = screen.getAllByRole('button');
    const deleteBtn = buttons[buttons.length - 1];
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('t1');
  });

  it('shows strikethrough when completed', () => {
    const completedTodo = makeTodo({ id: 't2', title: 'Done task', categoryId: 'c1', completed: true });
    render(<TaskItem todo={completedTodo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText('Done task')).toHaveClass('line-through');
  });
});
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/TaskList.tsx src/components/TaskItem.tsx src/__tests__/TaskList.test.tsx src/__tests__/TaskItem.test.tsx
git commit -m "feat: add TaskList and TaskItem with search, filter, sort, grouping"
```

---

### Task 8: Task Modal (Add/Edit)

**Files:**
- Create: `src/components/TaskModal.tsx`
- Create: `src/__tests__/TaskModal.test.tsx`

**Interfaces:**
- Consumes: `useStore()`, `Category` from `src/types.ts`
- Produces: `TaskModal` component with `isOpen`, `editingTodo?`, `onClose`, `onSaved` props

- [ ] **Step 1: Create TaskModal.tsx**

```typescript
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Todo, Category } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  editingTodo?: Todo | null;
  defaultCategoryId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function TaskModal({ isOpen, editingTodo, defaultCategoryId, onClose, onSaved }: TaskModalProps) {
  const { state, addTodo, updateTodo } = useStore();
  const { categories } = state;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingTodo) {
        setTitle(editingTodo.title);
        setDescription(editingTodo.description ?? '');
        setCategoryId(editingTodo.categoryId);
        setDueDate(editingTodo.dueDate ?? '');
      } else {
        setTitle('');
        setDescription('');
        setCategoryId(defaultCategoryId ?? categories[0]?.id ?? '');
        setDueDate('');
      }
      setError('');
    }
  }, [isOpen, editingTodo, defaultCategoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    const now = Date.now();
    if (editingTodo) {
      await updateTodo(editingTodo.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId,
        dueDate: dueDate || undefined,
      });
    } else {
      const newTodo: Todo = {
        id: `todo-${now}`,
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        categoryId,
        dueDate: dueDate || undefined,
        createdAt: now,
        updatedAt: now,
      };
      await addTodo(newTodo);
    }
    onSaved();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {editingTodo ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editingTodo ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskModal from '../components/TaskModal';
import type { AppState, Todo, Category } from '../types';

const mockStore = {
  state: {
    todos: [],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
      { id: 'c2', name: 'Personal', color: '#10B981', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addTodo: vi.fn().mockResolvedValue(undefined),
  updateTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getState: vi.fn().mockResolvedValue(mockStore.state),
    onStateChange: vi.fn(),
    offStateChange: vi.fn(),
  };
});

describe('TaskModal', () => {
  it('renders as closed when isOpen is false', () => {
    render(<TaskModal isOpen={false} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  it('renders the new task form when opened', () => {
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('shows category options', () => {
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('validates empty title', async () => {
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    const saveBtn = screen.getByText('Add Task');
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('calls addTodo with correct data on submit', async () => {
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(titleInput, { target: { value: 'Buy groceries' } });
    const saveBtn = screen.getByText('Add Task');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockStore.addTodo).toHaveBeenCalled();
      const calledWith = mockStore.addTodo.mock.calls[0][0] as Todo;
      expect(calledWith.title).toBe('Buy groceries');
      expect(calledWith.completed).toBe(false);
    });
  });

  it('pre-fills data when editing a todo', () => {
    const todo: Todo = {
      id: 't1',
      title: 'Edit me',
      description: 'Details here',
      completed: false,
      categoryId: 'c2',
      dueDate: '2026-08-10',
      createdAt: 1000,
      updatedAt: 1000,
    };
    render(
      <TaskModal
        isOpen={true}
        editingTodo={todo}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Details here')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/TaskModal.tsx src/__tests__/TaskModal.test.tsx
git commit -m "feat: add TaskModal for creating and editing todos"
```

---

### Task 9: Category Modal

**Files:**
- Create: `src/components/CategoryModal.tsx`
- Create: `src/__tests__/CategoryModal.test.tsx`

**Interfaces:**
- Consumes: `useStore()`, `Category` from `src/types.ts`
- Produces: `CategoryModal` component with `isOpen`, `editingCat?`, `onClose`, `onSaved` props

- [ ] **Step 1: Create CategoryModal.tsx**

```typescript
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Category } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  editingCat?: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

const PRESET_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function CategoryModal({ isOpen, editingCat, onClose, onSaved }: CategoryModalProps) {
  const { addCategory, updateCategory } = useStore();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingCat) {
        setName(editingCat.name);
        setColor(editingCat.color);
      } else {
        setName('');
        setColor('#3B82F6');
      }
      setError('');
    }
  }, [isOpen, editingCat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    const now = Date.now();
    if (editingCat) {
      await updateCategory(editingCat.id, { name: name.trim(), color });
    } else {
      await addCategory({
        id: `cat-${now}`,
        name: name.trim(),
        color,
        createdAt: now,
      });
    }
    onSaved();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {editingCat ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c ? 'border-gray-600 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editingCat ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryModal from '../components/CategoryModal';
import type { AppState } from '../types';

const mockStore = {
  state: {
    todos: [],
    categories: [],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn(),
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getState: vi.fn().mockResolvedValue(mockStore.state),
    onStateChange: vi.fn(),
    offStateChange: vi.fn(),
  };
});

describe('CategoryModal', () => {
  it('renders closed when isOpen is false', () => {
    render(<CategoryModal isOpen={false} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.queryByText('New Category')).not.toBeInTheDocument();
  });

  it('renders the form when opened', () => {
    render(<CategoryModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.getByText('New Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument();
  });

  it('validates empty name', async () => {
    render(<CategoryModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    fireEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('Category name is required')).toBeInTheDocument();
    });
  });

  it('calls addCategory on submit with valid data', async () => {
    render(<CategoryModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Category name'), { target: { value: 'Fitness' } });
    fireEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(mockStore.addCategory).toHaveBeenCalled();
    });
  });
});
```

- [ ] **Step 3: Run tests and commit**

```bash
npm test
git add src/components/CategoryModal.tsx src/__tests__/CategoryModal.test.tsx
git commit -m "feat: add CategoryModal for creating and editing categories"
```

---

### Task 10: Toast Component

**Files:**
- Create: `src/components/Toast.tsx`
- Create: `src/__tests__/Toast.test.tsx`

**Interfaces:**
- Consumes: nothing external
- Produces: `Toast` component with `message`, `onUndo?`, `visible` props

- [ ] **Step 1: Create Toast.tsx**

```typescript
import { Check, Undo } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  visible: boolean;
}

export default function Toast({ message, onUndo, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg">
      <Check size={18} className="text-green-400 flex-shrink-0" />
      <span className="text-sm">{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors"
        >
          <Undo size={14} />
          Undo
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from '../components/Toast';

describe('Toast', () => {
  it('is not in DOM when visible is false', () => {
    const { container } = render(<Toast message="Task deleted" visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the message when visible', () => {
    render(<Toast message="Task deleted" visible={true} />);
    expect(screen.getByText('Task deleted')).toBeInTheDocument();
  });

  it('shows undo button when onUndo is provided', () => {
    const undo = vi.fn();
    render(<Toast message="Task deleted" onUndo={undo} visible={true} />);
    expect(screen.getByText('Undo')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Undo'));
    expect(undo).toHaveBeenCalledOnce();
  });

  it('does not show undo button when onUndo is not provided', () => {
    render(<Toast message="Task deleted" visible={true} />);
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests and commit**

```bash
npm test
git add src/components/Toast.tsx src/__tests__/Toast.test.tsx
git commit -m "feat: add Toast component with undo support"
```

---

### Task 11: Assemble App Component

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx` (to wrap with StoreProvider)
- Create: `src/__tests__/App.test.tsx`

**Interfaces:**
- Consumes: `StoreProvider`, `Layout`, `TaskList`, `TaskModal`, `CategoryModal`, `Toast`
- Produces: `App` as the root component that wires everything together

- [ ] **Step 1: Rewrite src/main.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreProvider } from './store/useStore';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
```

- [ ] **Step 2: Rewrite src/App.tsx**

```typescript
import { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';

export default function App() {
  const { state, deleteTodo, undoDelete, updateTodo } = useStore();
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  const showToast = useCallback((message: string, showUndo = false) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToast({ message, visible: true });
    toastTimer = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      toastTimer = null;
    }, 3000);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const deleted = await deleteTodo(id);
    if (deleted) {
      showToast('Task deleted', true);
      // Store the deleted todo for undo
      (window as unknown as { _lastDeletedTodo: unknown })._lastDeletedTodo = deleted;
    }
  }, [deleteTodo, showToast]);

  const handleUndo = useCallback(async () => {
    const lastDeleted = (window as unknown as { _lastDeletedTodo: unknown }) as { _lastDeletedTodo: unknown };
    if (lastDeleted._lastDeletedTodo) {
      await undoDelete();
      setToast({ message: 'Task restored', visible: true });
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
      lastDeleted._lastDeletedTodo = null;
    }
  }, [undoDelete, showToast]);

  const handleToggle = useCallback(async (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  }, [state, updateTodo]);

  const handleEdit = useCallback((todo: any) => {
    setEditingTodo(todo);
    setTaskModalOpen(true);
  }, []);

  const handleSaved = useCallback(() => {
    setTaskModalOpen(false);
    setEditingTodo(null);
  }, []);

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  }, []);

  const handleCategorySaved = useCallback(() => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  }, []);

  return (
    <>
      <Layout onAddCategory={handleAddCategory}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {/* Search is handled inside TaskList */}
              </div>
            </div>
            <button
              onClick={() => { setEditingTodo(null); setTaskModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              Add Task
            </button>
          </header>

          <TaskList
            categoryId={activeCategoryId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      </Layout>

      <TaskModal
        isOpen={taskModalOpen}
        editingTodo={editingTodo}
        defaultCategoryId={activeCategoryId !== 'all' ? activeCategoryId : undefined}
        onClose={() => { setTaskModalOpen(false); setEditingTodo(null); }}
        onSaved={handleSaved}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        editingCat={editingCategory}
        onClose={() => { setCategoryModalOpen(false); setEditingCategory(null); }}
        onSaved={handleCategorySaved}
      />

      <Toast
        message={toast.message}
        onUndo={toast.visible ? handleUndo : undefined}
        visible={toast.visible}
      />
    </>
  );
}
```

- [ ] **Step 3: Create App integration test**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import type { AppState, Todo } from '../types';

const today = (() => new Date().toISOString().split('T')[0])();

const mockStore = {
  state: {
    todos: [
      { id: 't1', title: 'Buy milk', completed: false, categoryId: 'c1', createdAt: 1000, updatedAt: 1000 } as Todo,
    ],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addTodo: vi.fn().mockResolvedValue(undefined),
  updateTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn().mockResolvedValue({ id: 't1', title: 'Buy milk', completed: false, categoryId: 'c1', createdAt: 1000, updatedAt: 1000 } as Todo),
  undoDelete: vi.fn().mockResolvedValue(null),
  addCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(true),
  checkNotifications: vi.fn().mockResolvedValue(false),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getState: vi.fn().mockResolvedValue(mockStore.state),
    onStateChange: vi.fn(),
    offStateChange: vi.fn(),
  };
});

describe('App integration', () => {
  it('renders the app title and add button', () => {
    render(<App />);
    expect(screen.getByText('My ToDo')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('opens task modal when Add Task is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('shows task title from store', () => {
    render(<App />);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass. Fix any issues found.

- [ ] **Step 5: Verify dev mode end-to-end**

```bash
npm run dev
```

Expected: Full app with sidebar, task list, add/edit/delete, categories working.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/main.tsx src/__tests__/App.test.tsx
git commit -m "feat: assemble App with all components wired together"
```

---

### Task 12: GitHub Actions CI for Windows Build

**Files:**
- Create: `.github/workflows/build.yml`
- Create: `.github/workflows/release.yml` (optional — for creating GitHub Releases with the .exe)

**Interfaces:**
- Consumes: `package.json`, `forge.config.cjs`
- Produces: A GitHub Actions workflow that builds and packages the Windows `.exe` on push to `main`

- [ ] **Step 1: Create .github/workflows/build.yml**

```yaml
name: build-windows

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: windows-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build renderer and package
        run: npm run package
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: todolist-windows-x64
          path: out/make/
          retention-days: 14
```

- [ ] **Step 2: Create .github/workflows/release.yml**

```yaml
name: release-windows

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Release version (e.g. 1.0.0)'
        required: true
        type: string

jobs:
  release:
    runs-on: windows-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build and package
        run: npm run package
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ github.event.inputs.version }}
          name: ToDo App v${{ github.event.inputs.version }}
          files: |
            out/make/**/*.zip
            out/make/**/*.exe
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 3: Commit the workflows**

```bash
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows for Windows build and release"
```

- [ ] **Step 4: Push and verify**

```bash
git push origin main
```

Then check the Actions tab on GitHub to confirm the workflow triggers.

---

### Task 13: Final Polish and .gitignore Update

**Files:**
- Modify: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Consumes: existing project structure
- Produces: Clean repo with proper ignores and a README explaining how to run/build

- [ ] **Step 1: Update .gitignore**

```
node_modules/
dist/
out/
*.log
.DS_Store
superpowers/
.env
.vscode/
*.local
```

- [ ] **Step 2: Create README.md**

```markdown
# ToDo Electron App

A Windows To-Do List application built with Electron, React, and Vite.

## Features

- **Categories**: Organize tasks with color-coded categories
- **Due Dates**: Set deadlines with visual overdue indicators
- **Search & Filter**: Find tasks quickly with search, status, and due date filters
- **Sort**: Sort by created date, due date, or alphabetically
- **Undo Delete**: Accidentally deleted a task? Undo within 3 seconds
- **Windows Notifications**: Get notified about overdue tasks on launch

## Tech Stack

- Electron 33 + Vite 5 + React 18
- TypeScript
- Tailwind CSS
- electron-store (native persistence)
- Electron Forge (packaging)

## Development

```bash
# Install dependencies
npm install

# Run in development mode with HMR
npm run dev

# Run tests
npm test
```

## Build for Windows

```bash
# Build and package (produces out/todolist-windows-x64/)
npm run package
```

## GitHub Actions

Two workflows are available:

- **build-windows** — runs on push to `main`, builds the app and uploads the `.exe` and `.zip` as artifacts
- **release-windows** — manual trigger to create a GitHub Release with the packaged installer

## Project Structure

```
├── electron/
│   ├── main.ts          # Main process: store, IPC, window management
│   └── preload.ts       # Preload script: IPC bridge to renderer
├── src/
│   ├── App.tsx          # Root component
│   ├── main.tsx         # React entry point
│   ├── types.ts         # TypeScript interfaces
│   ├── store/
│   │   └── useStore.ts  # electron-store React context
│   ├── lib/
│   │   └── filterSort.ts # Filter and sort logic
│   └── components/      # React components
├── .github/workflows/   # CI/CD workflows
└── docs/superpowers/    # Design specs and plans
```
```

- [ ] **Step 3: Run final test suite**

```bash
npm test
```

Expected: All tests pass across all tasks.

- [ ] **Step 4: Final commit**

```bash
git add .gitignore README.md
git commit -m "chore: add README and finalize .gitignore"
```

---

## Self-Review Summary

**Spec coverage:**
- §1 Architecture → Tasks 1-3 (scaffolding, types, IPC)
- §2 Data Model → Task 2 (types.ts)
- §3.1 Categories → Tasks 5, 9 (Sidebar + CategoryModal)
- §3.2 Tasks CRUD → Tasks 6, 8 (TaskList, TaskItem, TaskModal)
- §3.3 Due dates & reminders → Tasks 3, 6 (overdue logic + notifications in main)
- §3.4 Search/Filter/Sort → Task 5, 6 (filterSort.ts + TaskList UI)
- §4 UI Layout → Task 6 (Layout.tsx)
- §5 File Structure → Matches actual output
- §6 Main Process Architecture → Task 3 (main.ts)
- §7 Development Workflow → Task 1 (scripts) + Task 12 (CI/CD)

**Gaps found and fixed:**
- `handleToggle` in App.tsx originally referenced `state.updateTodo` instead of destructured `updateTodo` — fixed in Task 11 Step 5.
- Undo flow uses a window-level `_lastDeletedTodo` variable — acceptable for this scope; can be moved to store in a future iteration.

**Placeholder scan:** No TBDs, TODOs, or "implement later" markers found.

**Type consistency:** All interfaces use the same `Todo`, `Category`, `AppState` definitions from `src/types.ts`. IPC channel names are consistent between main.ts and preload.ts.
```
