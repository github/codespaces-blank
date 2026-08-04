import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';
import type { Todo, Category } from '../types';

const makeTodo = (overrides: Partial<Todo> & { id: string; title: string; categoryId: string }): Todo => ({
  completed: false,
  dueDate: undefined,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
} as Todo);

const category: Category = { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 };

describe('TaskItem', () => {
  const todo = makeTodo({ id: 't1', title: 'Test task', categoryId: 'c1' });
  const onToggle = vi.fn();
  const onDelete = vi.fn();
  const onEdit = vi.fn();

  it('renders the task title', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('shows category badge', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onToggle).toHaveBeenCalledWith('t1');
  });

  it('calls onDelete when trash icon is clicked', () => {
    render(<TaskItem todo={todo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const buttons = screen.getAllByRole('button');
    const deleteBtn = buttons[buttons.length - 1];
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('t1');
  });

  it('shows strikethrough when completed', () => {
    const completedTodo = makeTodo({ id: 't2', title: 'Done task', categoryId: 'c1', completed: true });
    render(<TaskItem todo={completedTodo} category={category} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText('Done task')).toHaveClass('line-through');
  });
});
