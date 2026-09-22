import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasElement } from '@/types/canvas';

interface HistoryState {
  elements: CanvasElement[];
  layerOrder: string[];
}

const MAX_HISTORY = 50;

export function useCanvasHistory(initial: HistoryState) {
  const [present, setPresent] = useState<HistoryState>(initial);
  const past = useRef<HistoryState[]>([]);
  const future = useRef<HistoryState[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = () => {
    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  };

  // Call this whenever a change should be recorded (drag end, transform end,
  // property edit committed, add/delete element). NOT on every keystroke/drag-move.
  const commit = useCallback((next: HistoryState) => {
    past.current.push(present);
    if (past.current.length > MAX_HISTORY) past.current.shift();
    future.current = []; // new action clears redo stack
    setPresent(next);
    syncFlags();
  }, [present]);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    const previous = past.current.pop()!;
    future.current.push(present);
    setPresent(previous);
    syncFlags();
  }, [present]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const next = future.current.pop()!;
    past.current.push(present);
    setPresent(next);
    syncFlags();
  }, [present]);

  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y or Ctrl+Shift+Z (redo)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // Direct setter for loading a canvas / resetting history (e.g. on load from backend)
  const reset = useCallback((state: HistoryState) => {
    past.current = [];
    future.current = [];
    setPresent(state);
    syncFlags();
  }, []);

  return { state: present, commit, undo, redo, reset, canUndo, canRedo };
}