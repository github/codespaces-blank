// src/contexts/useGoals.ts
import { useContext } from 'react';
import { GoalContext } from './GoalContextDefinition';
import { type GoalContextType } from './GoalContextDefinition';

export const useGoals = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};