import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';

export default function App() {
  const { state, deleteTodo, undoDelete, updateTodo } = useStore();
  const [activeCategoryId, _setActiveCategoryId] = useState('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  const showToast = useCallback((message: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToast({ message, visible: true });
    toastTimer = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      toastTimer = null;
    }, 3000);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const deleted = await deleteTodo(id);
    if (deleted) {
      showToast('Task deleted');
      // Store the deleted todo for undo
      (window as unknown as { _lastDeletedTodo: unknown })._lastDeletedTodo = deleted;
    }
  }, [deleteTodo, showToast]);

  const handleUndo = useCallback(async () => {
    const lastDeleted = (window as unknown as { _lastDeletedTodo: unknown }) as { _lastDeletedTodo: unknown };
    if (lastDeleted._lastDeletedTodo) {
      await undoDelete();
      setToast({ message: 'Task restored', visible: true });
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
      lastDeleted._lastDeletedTodo = null;
    }
  }, [undoDelete, showToast]);

  const handleToggle = useCallback(async (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  }, [state, updateTodo]);

  const handleEdit = useCallback((todo: any) => {
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
      <Layout onAddCategory={handleAddCategory}>
        <div className="flex flex-col h-full">
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {/* Search is handled inside TaskList */}
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
