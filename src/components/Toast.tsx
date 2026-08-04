import { Check, Undo } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  visible: boolean;
}

export default function Toast({ message, onUndo, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg">
      <Check size={18} className="text-green-400 flex-shrink-0" />
      <span className="text-sm">{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors"
        >
          <Undo size={14} />
          Undo
        </button>
      )}
    </div>
  );
}
