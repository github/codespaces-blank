import { useState, useCallback, useRef } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';
import type { Todo, Category } from './types';

export default function App() {
  const { state, deleteTodo, undoDelete, updateTodo } = useStore();
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDeletedTodoRef = useRef<Todo | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const deleted = await deleteTodo(id);
    if (deleted) {
      showToast('Task deleted');
      lastDeletedTodoRef.current = deleted;
    }
  }, [deleteTodo, showToast]);

  const handleUndo = useCallback(async () => {
    if (lastDeletedTodoRef.current) {
      await undoDelete();
      setToast({ message: 'Task restored', visible: true });
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
      lastDeletedTodoRef.current = null;
    }
  }, [undoDelete, showToast]);

  const handleToggle = useCallback(async (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  }, [state, updateTodo]);

  const handleEdit = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setTaskModalOpen(true);
  }, []);

  const handleSaved = useCallback(() => {
    setTaskModalOpen(false);
    setEditingTodo(null);
  }, []);

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  }, []);

  const handleCategorySaved = useCallback(() => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  }, []);

  return (
    <>
      <Layout
        activeCategoryId={activeCategoryId}
        onCategorySelect={setActiveCategoryId}
        onAddCategory={handleAddCategory}
      >
        <div className="flex flex-col h-full">
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>
            <button
              onClick={() => { setEditingTodo(null); setTaskModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              Add Task
            </button>
          </header>

          <TaskList
            categoryId={activeCategoryId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>
      </Layout>

      <TaskModal
        isOpen={taskModalOpen}
        editingTodo={editingTodo}
        defaultCategoryId={activeCategoryId !== 'all' ? activeCategoryId : undefined}
        onClose={() => { setTaskModalOpen(false); setEditingTodo(null); }}
        onSaved={handleSaved}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        editingCat={editingCategory}
        onClose={() => { setCategoryModalOpen(false); setEditingCategory(null); }}
        onSaved={handleCategorySaved}
      />

      <Toast
        message={toast.message}
        onUndo={toast.visible ? handleUndo : undefined}
        visible={toast.visible}
      />
    </>
  );
}
