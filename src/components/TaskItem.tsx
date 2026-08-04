import { Trash2, Edit2, Check } from 'lucide-react';
import type { React.CSSProperties } from 'react';
import type { Todo, Category } from '../types';
import { isOverdue, isDueToday } from '../lib/filterSort';

interface TaskItemProps {
  todo: Todo;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export default function TaskItem({ todo, category, onToggle, onDelete, onEdit }: TaskItemProps) {
  const overdue = isOverdue(todo);
  const dueToday = isDueToday(todo);
  const borderColor = overdue ? 'border-red-400' : category?.color ? '' : 'border-gray-300';
  const borderStyle = overdue ? { borderLeftColor: '#EF4444' } as React.CSSProperties : category?.color ? { borderLeftColor: category.color } : undefined;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm border-l-4 ${borderColor} hover:shadow-md transition-shadow ${
        todo.completed ? 'opacity-50' : ''
      }`}
      style={borderStyle}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {todo.completed && <Check size={14} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-800 truncate ${todo.completed ? 'line-through' : ''}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-sm text-gray-400 truncate">{todo.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {category && (
            <span
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
          {todo.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-500' : dueToday ? 'text-amber-500' : 'text-gray-400'}`}>
              <span>📅</span>
              {overdue ? 'Overdue' : dueToday ? 'Today' : todo.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
