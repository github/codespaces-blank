import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TaskList from '../components/TaskList';
import { StoreProvider } from '../store/useStore';
import type { AppState, Todo } from '../types';

const makeTodo = (overrides: Partial<Todo> & { id: string; title: string; categoryId: string }): Todo => ({
  completed: false,
  dueDate: undefined,
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
} as Todo);

const today = (() => new Date().toISOString().split('T')[0])();
const yesterday = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
})();

const mockStore = {
  state: {
    todos: [
      makeTodo({ id: '1', title: 'Buy milk', categoryId: 'c1', dueDate: today }),
      makeTodo({ id: '2', title: 'Finish report', categoryId: 'c1', completed: true }),
      makeTodo({ id: '3', title: 'Read book', categoryId: 'c2' }),
      makeTodo({ id: '4', title: 'Overdue task', categoryId: 'c1', dueDate: yesterday }),
    ],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
      { id: 'c2', name: 'Personal', color: '#10B981', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  (window as unknown as { electronAPI: unknown }).electronAPI = {
    getState: vi.fn().mockResolvedValue(mockStore.state),
    onStateChange: vi.fn(),
    offStateChange: vi.fn(),
  };
});

afterEach(() => {
  delete (window as unknown as { electronAPI: unknown }).electronAPI;
});

describe('TaskList', () => {
  function renderTaskList(props: { categoryId?: string } = {}) {
    return render(
      <StoreProvider>
        <TaskList
          categoryId={props.categoryId ?? 'all'}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onToggle={vi.fn()}
        />
      </StoreProvider>
    );
  }

  it('renders the category name', async () => {
    renderTaskList();
    await waitFor(() => expect(screen.getByText('All Tasks')).toBeInTheDocument());
  });

  it('shows task titles', async () => {
    renderTaskList();
    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.getByText('Finish report')).toBeInTheDocument();
    });
  });

  it('shows active task count', async () => {
    renderTaskList();
    await waitFor(() => expect(screen.getByText('3 active')).toBeInTheDocument());
  });

  it('filters by due date (overdue)', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    renderTaskList();
    await waitFor(() => expect(screen.getByText('Overdue task')).toBeInTheDocument());
    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[1], 'overdue');
    expect(screen.getByText('Overdue task')).toBeInTheDocument();
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  it('filters by status select', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    renderTaskList();
    await waitFor(() => expect(screen.getByText('Buy milk')).toBeInTheDocument());
    const select = screen.getAllByRole('combobox')[0];
    await userEvent.selectOptions(select, 'completed');
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
    expect(screen.getByText('Finish report')).toBeInTheDocument();
  });
});
