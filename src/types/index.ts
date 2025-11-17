// src/types/index.ts

export interface Task {
  id: number;
  text: string;
  time: string;
  startDate?: string;
  endDate?: string;
  tag: string;
  tagColor: string;
  isCompleted: boolean;
  description?: string;
}

export interface Category {
  name: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  tasks: number[];
  completed: boolean;
}