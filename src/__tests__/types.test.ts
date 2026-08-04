import { describe, it, expect } from 'vitest';
import type { Category, Todo, AppState, TodoFilter, TodoSort } from '../types';

describe('Type definitions', () => {
  it('Category has required fields', () => {
    const cat: Category = {
      id: 'c1',
      name: 'Work',
      color: '#3B82F6',
      createdAt: 1000,
    };
    expect(cat.id).toBe('c1');
    expect(cat.color).toBe('#3B82F6');
  });

  it('Todo has optional description and dueDate', () => {
    const todo: Todo = {
      id: 't1',
      title: 'Test',
      completed: false,
      categoryId: 'c1',
      createdAt: 1000,
      updatedAt: 1000,
    };
    expect(todo.description).toBeUndefined();
    expect(todo.dueDate).toBeUndefined();
  });

  it('TodoFilter has correct type', () => {
    const filter: TodoFilter = {
      status: 'active',
      categoryId: '',
      dueFilter: 'overdue',
    };
    expect(filter.status).toBe('active');
  });

  it('AppState contains todos and categories arrays', () => {
    const state: AppState = {
      todos: [],
      categories: [],
      settings: { theme: 'light', notificationPermissionGranted: false },
    };
    expect(Array.isArray(state.todos)).toBe(true);
    expect(Array.isArray(state.categories)).toBe(true);
  });
});
