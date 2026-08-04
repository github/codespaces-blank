import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  activeCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: () => void;
}

export default function Layout({ children, activeCategoryId, onCategorySelect, onAddCategory }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeCategoryId={activeCategoryId}
        onCategorySelect={onCategorySelect}
        onAddCategory={onAddCategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800">My ToDo</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
