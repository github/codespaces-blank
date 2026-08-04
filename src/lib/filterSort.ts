import type { Todo, TodoFilter, TodoSort } from '../types';

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function filterTodos(
  todos: Todo[],
  filter: TodoFilter,
  categoryId: string
): Todo[] {
  return todos.filter((todo) => {
    // Category filter
    if (filter.categoryId && filter.categoryId !== 'all' && todo.categoryId !== filter.categoryId) {
      return false;
    }
    if (categoryId && categoryId !== 'all' && todo.categoryId !== categoryId) {
      return false;
    }

    // Status filter
    if (filter.status === 'active' && todo.completed) return false;
    if (filter.status === 'completed' && !todo.completed) return false;

    // Due date filter
    if (filter.dueFilter === 'overdue') {
      if (todo.completed || !todo.dueDate) return false;
      if (todo.dueDate >= getToday()) return false;
    }
    if (filter.dueFilter === 'today') {
      if (todo.dueDate !== getToday()) return false;
    }
    if (filter.dueFilter === 'none') {
      if (todo.dueDate) return false;
    }

    return true;
  });
}

export function sortTodos(todos: Todo[], sort: TodoSort, _today: string): Todo[] {
  return [...todos].sort((a, b) => {
    if (sort === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sort === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    // created (newest first)
    return b.createdAt - a.createdAt;
  });
}

export function isOverdue(todo: Todo): boolean {
  if (todo.completed || !todo.dueDate) return false;
  return todo.dueDate < getToday();
}

export function isDueToday(todo: Todo): boolean {
  return todo.dueDate === getToday() && !todo.completed;
}
