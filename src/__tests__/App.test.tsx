import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { StoreProvider } from '../store/useStore';
import type { AppState, Todo } from '../types';

const mockStore = {
  state: {
    todos: [
      { id: 't1', title: 'Buy milk', completed: false, categoryId: 'c1', createdAt: 1000, updatedAt: 1000 } as Todo,
    ],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState,
  addTodo: vi.fn().mockResolvedValue(undefined),
  updateTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn().mockResolvedValue({ id: 't1', title: 'Buy milk', completed: false, categoryId: 'c1', createdAt: 1000, updatedAt: 1000 } as Todo),
  undoDelete: vi.fn().mockResolvedValue(null),
  addCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(true),
  checkNotifications: vi.fn().mockResolvedValue(false),
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

describe('App integration', () => {
  function renderApp() {
    return render(
      <StoreProvider>
        <App />
      </StoreProvider>
    );
  }

  it('renders the app title and add button', async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText('My ToDo')).toBeInTheDocument());
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('opens task modal when Add Task is clicked', async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText('My ToDo')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('shows task title from store', async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText('Buy milk')).toBeInTheDocument());
  });
});
