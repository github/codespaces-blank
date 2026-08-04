import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryModal from '../components/CategoryModal';
import { StoreProvider } from '../store/useStore';
import type { AppState } from '../types';

const mockAPI = {
  getState: vi.fn(),
  onStateChange: vi.fn(),
  offStateChange: vi.fn(),
  addCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn(),
  addTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
  undoDelete: vi.fn(),
  checkNotifications: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAPI.getState.mockResolvedValue({
    todos: [],
    categories: [],
    settings: { theme: 'light', notificationPermissionGranted: false },
  } as AppState);
  (window as unknown as { electronAPI: typeof mockAPI }).electronAPI = mockAPI;
});

function renderWithStoreProvider(children: React.ReactNode) {
  return render(<StoreProvider>{children}</StoreProvider>);
}

describe('CategoryModal', () => {
  it('renders closed when isOpen is false', () => {
    renderWithStoreProvider(<CategoryModal isOpen={false} onClose={vi.fn()} onSaved={vi.fn()} />);
    expect(screen.queryByText('New Category')).not.toBeInTheDocument();
  });

  it('renders the form when opened', async () => {
    renderWithStoreProvider(<CategoryModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('New Category')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument();
    });
  });

  it('validates empty name', async () => {
    renderWithStoreProvider(<CategoryModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(screen.getByText('Category name is required')).toBeInTheDocument();
    });
  });

  it('calls addCategory on submit with valid data', async () => {
    renderWithStoreProvider(<CategoryModal isOpen={true} onClose={vi.fn()} onSaved={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Category name')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByPlaceholderText('Category name'), { target: { value: 'Fitness' } });
    fireEvent.click(screen.getByText('Create'));
    await waitFor(() => {
      expect(mockAPI.addCategory).toHaveBeenCalled();
    });
  });
});
