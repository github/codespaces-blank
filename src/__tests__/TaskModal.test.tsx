import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskModal from '../components/TaskModal';
import { StoreProvider } from '../store/useStore';
import type { AppState, Todo } from '../types';

const mockAPI = {
  getState: vi.fn(),
  onStateChange: vi.fn(),
  offStateChange: vi.fn(),
  addTodo: vi.fn().mockResolvedValue(undefined),
  updateTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAPI.getState.mockResolvedValue({
    todos: [],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
      { id: 'c2', name: 'Personal', color: '#10B981', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState);
  (window as unknown as { electronAPI: typeof mockAPI }).electronAPI = mockAPI;
});

function renderWithStoreProvider(children: React.ReactNode) {
  return render(<StoreProvider>{children}</StoreProvider>);
}

describe('TaskModal', () => {
  it('renders as closed when isOpen is false', async () => {
    renderWithStoreProvider(
      <StoreProvider>
        <TaskModal isOpen={false} onClose={vi.fn()} onSaved={vi.fn()} />
      </StoreProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText('New Task')).not.toBeInTheDocument();
    });
  });

  it('renders the new task form when opened', async () => {
    renderWithStoreProvider(
      <StoreProvider>
        <TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />
      </StoreProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    });
  });

  it('shows category options', async () => {
    renderWithStoreProvider(
      <StoreProvider>
        <TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />
      </StoreProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText('Personal')).toBeInTheDocument();
    });
  });

  it('validates empty title', async () => {
    renderWithStoreProvider(
      <StoreProvider>
        <TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />
      </StoreProvider>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    });
    const saveBtn = screen.getByText('Add Task');
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('calls addTodo with correct data on submit', async () => {
    renderWithStoreProvider(
      <StoreProvider>
        <TaskModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />
      </StoreProvider>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    });
    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(titleInput, { target: { value: 'Buy groceries' } });
    const saveBtn = screen.getByText('Add Task');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockAPI.addTodo).toHaveBeenCalled();
      const calledWith = mockAPI.addTodo.mock.calls[0][0] as Todo;
      expect(calledWith.title).toBe('Buy groceries');
      expect(calledWith.completed).toBe(false);
    });
  });

  it('pre-fills data when editing a todo', async () => {
    const todo: Todo = {
      id: 't1',
      title: 'Edit me',
      description: 'Details here',
      completed: false,
      categoryId: 'c2',
      dueDate: '2026-08-10',
      createdAt: 1000,
      updatedAt: 1000,
    };
    renderWithStoreProvider(
      <StoreProvider>
        <TaskModal
          isOpen={true}
          editingTodo={todo}
          onClose={vi.fn()}
          onSaved={vi.fn()}
        />
      </StoreProvider>
    );
    await waitFor(() => {
      expect(screen.getByDisplayValue('Edit me')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Details here')).toBeInTheDocument();
    });
  });
});
