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

  // In Electron main process, show notification directly —
  // Windows will prompt for permission on first show.
  const overdueTodos = store.get('todos').filter((t) => {
    if (t.completed || !t.dueDate) return false;
    return t.dueDate < getToday();
  });
  if (overdueTodos.length > 0) {
    new Notification({
      title: 'Overdue Tasks',
      body: `You have ${overdueTodos.length} task${overdueTodos.length > 1 ? 's' : ''} past due.`,
    }).show();
    store.set('settings.notificationPermissionGranted', true);
  }
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
