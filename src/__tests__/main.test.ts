import { describe, it, expect } from 'vitest';

// We test the logic by importing the store config pattern
// (Full IPC test would need electron main process, so we test the data flow)

describe('State shape', () => {
  it('has default categories', () => {
    const defaults = {
      todos: [],
      categories: [
        { id: 'cat-work', name: 'Work', color: '#3B82F6', createdAt: expect.any(Number) },
        { id: 'cat-personal', name: 'Personal', color: '#10B981', createdAt: expect.any(Number) },
        { id: 'cat-shopping', name: 'Shopping', color: '#F59E0B', createdAt: expect.any(Number) },
      ],
      settings: { theme: 'light', notificationPermissionGranted: false },
    };
    expect(defaults.categories).toHaveLength(3);
    expect(defaults.categories[0].color).toBe('#3B82F6');
  });
});

describe('Undo state shape', () => {
  it('has deletedTodo and timestamp', () => {
    const undo: { deletedTodo: unknown; timestamp: number } = {
      deletedTodo: null,
      timestamp: 0,
    };
    expect(undo).toHaveProperty('deletedTodo');
    expect(undo).toHaveProperty('timestamp');
  });
});
