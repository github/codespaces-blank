import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoreProvider, useStore } from '../store/useStore';

const mockAPI = {
  getState: vi.fn(),
  onStateChange: vi.fn(),
  offStateChange: vi.fn(),
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
  mockAPI.getState.mockResolvedValue({
    todos: [],
    categories: [
      { id: 'c1', name: 'Work', color: '#3B82F6', createdAt: 1000 },
    ],
    settings: { theme: 'light', notificationPermissionGranted: false },
  });
  (window as unknown as { electronAPI: typeof mockAPI }).electronAPI = mockAPI;
});

describe('StoreProvider', () => {
  it('renders children after loading state', async () => {
    function TestChild() {
      const { state } = useStore();
      return <span data-testid="cat-count">{state.categories.length}</span>;
    }
    render(
      <StoreProvider>
        <TestChild />
      </StoreProvider>
    );
    expect(await screen.findByTestId('cat-count')).toBeInTheDocument();
    expect(mockAPI.getState).toHaveBeenCalledOnce();
  });

  it('registers state change listener', async () => {
    render(
      <StoreProvider>
        <span>test</span>
      </StoreProvider>
    );
    expect(mockAPI.onStateChange).toHaveBeenCalled();
  });
});
