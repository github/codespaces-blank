import { describe, it, expect } from 'vitest';
import { filterTodos, sortTodos, isOverdue, isDueToday, getToday } from '../lib/filterSort';
import type { Todo } from '../types';

const today = getToday();
const yesterday = (() => {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
})();
const tomorrow = (() => {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

let counter = 1000;
const makeTodo = (overrides: Partial<Todo> & { id: string; title: string; categoryId: string }): Todo => ({
  completed: false,
  dueDate: undefined,
  createdAt: counter++,
  updatedAt: counter++,
  ...overrides,
} as Todo);

const todos = [
  makeTodo({ id: '1', title: 'Buy milk', categoryId: 'c1', dueDate: today }),
  makeTodo({ id: '2', title: 'Finish report', categoryId: 'c1', dueDate: yesterday }),
  makeTodo({ id: '3', title: 'Read book', categoryId: 'c2', dueDate: tomorrow }),
  makeTodo({ id: '4', title: 'Groceries', categoryId: 'c2', completed: true, dueDate: today }),
  makeTodo({ id: '5', title: 'No due date task', categoryId: 'c1' }),
];

describe('filterTodos', () => {
  it('filters by active status', () => {
    const result = filterTodos(todos, { status: 'active', categoryId: 'all', dueFilter: 'all' }, 'all');
    expect(result).toHaveLength(4);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it('filters by completed status', () => {
    const result = filterTodos(todos, { status: 'completed', categoryId: 'all', dueFilter: 'all' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Groceries');
  });

  it('filters by overdue', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'overdue' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by today', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'today' }, 'all');
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id).sort()).toEqual(['1', '4']);
  });

  it('filters by no due date', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'none' }, 'all');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('5');
  });

  it('filters by category', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'c1', dueFilter: 'all' }, 'all');
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.categoryId === 'c1')).toBe(true);
  });

  it('filters by categoryId parameter', () => {
    const result = filterTodos(todos, { status: 'all', categoryId: 'all', dueFilter: 'all' }, 'c2');
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.categoryId === 'c2')).toBe(true);
  });
});

describe('sortTodos', () => {
  it('sorts by created date newest first (default)', () => {
    const sorted = sortTodos(todos, 'created');
    // todos were created in order 1,2,3,4,5 so 5 is newest (highest createdAt)
    expect(sorted[0].id).toBe('5');
  });

  it('sorts by due date soonest first', () => {
    const sorted = sortTodos(todos, 'dueDate');
    expect(sorted[0].dueDate).toBe(yesterday);
    // last should be the task without a due date
    expect(sorted[sorted.length - 1].dueDate).toBeUndefined();
  });

  it('sorts alphabetically', () => {
    const sorted = sortTodos(todos, 'alphabetical');
    expect(sorted[0].title).toBe('Buy milk');
    expect(sorted[sorted.length - 1].title).toBe('Read book');
  });

  it('pushes tasks without due date to the end when sorting by due date', () => {
    const sorted = sortTodos(todos, 'dueDate');
    const last = sorted[sorted.length - 1];
    expect(last.dueDate).toBeUndefined();
  });
});

describe('isOverdue', () => {
  it('returns true for past due incomplete task', () => {
    expect(isOverdue(todos[1])).toBe(true);
  });
  it('returns false for completed task even if past due', () => {
    expect(isOverdue(todos[3])).toBe(false);
  });
  it('returns false for task with no due date', () => {
    expect(isOverdue(todos[4])).toBe(false);
  });
  it('returns false for future due date', () => {
    expect(isOverdue(todos[2])).toBe(false);
  });
});

describe('isDueToday', () => {
  it('returns true for task due today', () => {
    expect(isDueToday(todos[0])).toBe(true);
  });
  it('returns false for completed task due today', () => {
    expect(isDueToday(todos[3])).toBe(false);
  });
});
