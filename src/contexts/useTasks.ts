// src/contexts/useTasks.ts
import { useContext } from 'react';
import { TaskContext } from './TaskContextDefinition'; // Import from definition file

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
