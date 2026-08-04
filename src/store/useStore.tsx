import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
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
  const apiRef = useRef<{ getState: () => Promise<AppState>; addTodo: (t: Todo) => Promise<Todo>; updateTodo: (id: string, u: Partial<Todo>) => Promise<Todo | null>; deleteTodo: (id: string) => Promise<Todo | null>; undoDelete: () => Promise<Todo | null>; addCategory: (c: Category) => Promise<Category>; updateCategory: (id: string, u: Partial<Category>) => Promise<Category | null>; deleteCategory: (id: string) => Promise<boolean>; checkNotifications: () => Promise<boolean>; onStateChange: (cb: (s: AppState) => void) => void; offStateChange: (cb: (s: AppState) => void) => void }>(null!);

  const loadState = useCallback(async () => {
    const s = await apiRef.current.getState();
    setState(s);
  }, []);

  useEffect(() => {
    apiRef.current = (window as unknown as { electronAPI: { getState: () => Promise<AppState>; onStateChange: (cb: (s: AppState) => void) => void; offStateChange: (cb: (s: AppState) => void) => void } }).electronAPI;
    loadState();
    apiRef.current.onStateChange(loadState);
    return () => apiRef.current.offStateChange(loadState);
  }, [loadState]);

  const addTodo = useCallback(async (todo: Todo) => {
    await apiRef.current.addTodo(todo);
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    await apiRef.current.updateTodo(id, updates);
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    return apiRef.current.deleteTodo(id);
  }, []);

  const undoDelete = useCallback(async () => {
    return apiRef.current.undoDelete();
  }, []);

  const addCategory = useCallback(async (category: Category) => {
    await apiRef.current.addCategory(category);
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    await apiRef.current.updateCategory(id, updates);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    return apiRef.current.deleteCategory(id);
  }, []);

  const checkNotifications = useCallback(async () => {
    return apiRef.current.checkNotifications();
  }, []);

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
