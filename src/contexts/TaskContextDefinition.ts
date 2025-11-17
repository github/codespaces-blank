// src/contexts/TaskContextDefinition.ts
import { createContext } from 'react';
import type { Task, Category } from '../types';

// --- CONTEXT TYPE DEFINITION ---
export type TaskContextType = {
  tasks: Task[];
  categories: Category[];
  toggleTaskCompletion: (id: number) => void;
  addTask: (newTaskData: Partial<Task>) => number;
  editTask: (taskId: number, updatedTaskData: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  getTask: (taskId: number) => Task | undefined;
  addCategory: (newCategory: Category) => void;
  deleteCategory: (categoryName: string) => void;
};

// --- CREATE CONTEXT ---
export const TaskContext = createContext<TaskContextType | undefined>(undefined);
