// src/contexts/GoalContextDefinition.ts
import { createContext } from 'react';
import { type Goal } from '../types';

export interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoal: (id: string) => Goal | undefined;
}

export const GoalContext = createContext<GoalContextType | undefined>(undefined);
