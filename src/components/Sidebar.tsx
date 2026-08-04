import { useStore } from '../store/useStore';
import { FolderPlus } from 'lucide-react';

interface SidebarProps {
  activeCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: () => void;
}

export default function Sidebar({ activeCategoryId, onCategorySelect, onAddCategory }: SidebarProps) {
  const { state } = useStore();
  const { categories } = state;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Categories</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <button
          onClick={() => onCategorySelect('all')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
            activeCategoryId === 'all'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">📁</span>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              activeCategoryId === cat.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onAddCategory}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border border-dashed border-gray-300"
        >
          <FolderPlus size={16} />
          New Category
        </button>
      </div>
    </aside>
  );
}
