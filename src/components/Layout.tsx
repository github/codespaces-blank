import { useState } from 'react';
import Sidebar from './Sidebar';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  onAddCategory: () => void;
}

export default function Layout({ children, onAddCategory }: LayoutProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('all');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeCategoryId={activeCategoryId}
        onCategorySelect={setActiveCategoryId}
        onAddCategory={onAddCategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
