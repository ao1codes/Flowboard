import { useEffect } from 'react';

interface KeyboardShortcuts {
  onAddWidget?: () => void;
  onExportDashboard?: () => void;
}

export function useKeyboardShortcuts({ onAddWidget, onExportDashboard }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Ctrl/Cmd + E to export dashboard
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        onExportDashboard?.();
      }

      // Escape to close modals (handled by individual components)
      if (event.key === 'Escape') {
        // Let components handle their own escape logic
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAddWidget, onExportDashboard]);
}