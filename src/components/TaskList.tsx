import { useState } from 'react';
import { useStore } from '../store/useStore';
import { filterTodos, sortTodos, getToday } from '../lib/filterSort';
import type { TodoFilter, TodoSort, Todo } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  categoryId: string;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskList({ categoryId, onEdit, onDelete, onToggle }: TaskListProps) {
  const { state } = useStore();
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all', categoryId: 'all', dueFilter: 'all' });
  const [sort, setSort] = useState<TodoSort>('created');
  const [search, setSearch] = useState('');

  const { todos, categories } = state;

  const today = getToday();
  const filtered = filterTodos(todos, filter, categoryId);
  const sorted = sortTodos(filtered, sort, today);

  const results = search
    ? sorted.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description?.toLowerCase().includes(search.toLowerCase()))
      )
    : sorted;

  const activeCategory = categories.find((c) => c.id === categoryId);
  const categoryName = categoryId === 'all' ? 'All Tasks' : activeCategory?.name ?? 'Tasks';

  const groupByDate = (tasks: typeof results) => {
    const groups: Record<string, typeof tasks> = {};
    for (const todo of tasks) {
      if (todo.completed) {
        const key = 'Completed';
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      } else if (todo.dueDate === today) {
        const key = 'Today';
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      } else if (todo.dueDate) {
        const key = todo.dueDate;
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      } else {
        const key = 'No Due Date';
        groups[key] = groups[key] ?? [];
        groups[key].push(todo);
      }
    }
    return groups;
  };

  const grouped = groupByDate(results);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{categoryName}</h2>
          <span className="text-sm text-gray-400">{results.filter((t) => !t.completed).length} active</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value as TodoFilter['status'] }))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.dueFilter}
            onChange={(e) => setFilter((f) => ({ ...f, dueFilter: e.target.value as TodoFilter['dueFilter'] }))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="none">No Due Date</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as TodoSort)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="created">Newest</option>
            <option value="dueDate">Due Date</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {Object.entries(grouped).map(([group, tasks]) => (
          <div key={group} className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2 sticky top-0 bg-gray-50 py-1">
              {group} ({tasks.length})
            </h3>
            <div className="space-y-2">
              {tasks.map((todo) => (
                <TaskItem
                  key={todo.id}
                  todo={todo}
                  category={categories.find((c) => c.id === todo.categoryId)}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-1">Add a new task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
