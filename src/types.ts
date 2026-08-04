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
