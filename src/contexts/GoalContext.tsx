// src/contexts/GoalContext.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { type Goal } from '../types';
import { GoalContext } from './GoalContextDefinition';

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setGoals((prevGoals) => [...prevGoals, { ...goal, id: Date.now().toString() }]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  const getGoal = (id: string) => {
    return goals.find((goal) => goal.id === id);
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, getGoal }}>
      {children}
    </GoalContext.Provider>
  );
};
