import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Toast from '../components/Toast';

describe('Toast', () => {
  it('is not in DOM when visible is false', () => {
    const { container } = render(<Toast message="Task deleted" visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the message when visible', () => {
    render(<Toast message="Task deleted" visible={true} />);
    expect(screen.getByText('Task deleted')).toBeInTheDocument();
  });

  it('shows undo button when onUndo is provided', () => {
    const undo = vi.fn();
    render(<Toast message="Task deleted" onUndo={undo} visible={true} />);
    expect(screen.getByText('Undo')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Undo'));
    expect(undo).toHaveBeenCalledOnce();
  });

  it('does not show undo button when onUndo is not provided', () => {
    render(<Toast message="Task deleted" visible={true} />);
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });
});
