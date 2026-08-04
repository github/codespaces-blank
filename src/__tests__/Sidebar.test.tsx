import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { StoreProvider } from '../store/useStore';
import type { AppState } from '../types';

const mockStore = {
  state: {
    todos: [],
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

describe('Sidebar', () => {
  function renderSidebar(props: { activeCategoryId?: string; onCategorySelect?: (...args: string[]) => void; onAddCategory?: (...args: never[]) => void } = {}) {
    return render(
      <StoreProvider>
        <Sidebar
          activeCategoryId={props.activeCategoryId ?? 'all'}
          onCategorySelect={props.onCategorySelect ?? vi.fn()}
          onAddCategory={props.onAddCategory ?? vi.fn()}
        />
      </StoreProvider>
    );
  }

  it('shows all categories', async () => {
    renderSidebar();
    await waitFor(() => expect(screen.getByText('Work')).toBeInTheDocument());
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('highlights active category', async () => {
    renderSidebar({ activeCategoryId: 'c1' });
    await waitFor(() => {
      const { getByText } = screen;
      const workItem = getByText('Work').closest('button');
      expect(workItem).toHaveClass('bg-gray-100');
    });
  });

  it('calls onCategorySelect when clicking a category', async () => {
    const handler = vi.fn();
    renderSidebar({ onCategorySelect: handler });
    await waitFor(() => expect(screen.getByText('Work')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Work'));
    expect(handler).toHaveBeenCalledWith('c1');
  });

  it('calls onAddCategory when clicking New Category', async () => {
    const handler = vi.fn();
    renderSidebar({ onAddCategory: handler });
    await waitFor(() => expect(screen.getByText('New Category')).toBeInTheDocument());
    fireEvent.click(screen.getByText('New Category'));
    expect(handler).toHaveBeenCalledOnce();
  });
});
