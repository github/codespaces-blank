import { contextBridge, ipcRenderer } from 'electron';
import type { AppState, Todo, Category } from '../src/types';

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
