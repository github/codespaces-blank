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

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

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
