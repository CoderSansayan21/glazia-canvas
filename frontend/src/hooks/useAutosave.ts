import { useEffect, useRef, useState, useCallback } from 'react';
import { canvasApi } from '@/lib/api';
import { CanvasElement } from '@/types/canvas';

interface AutosavePayload {
  name: string;
  elements: CanvasElement[];
  layerOrder: string[];
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const DEBOUNCE_MS = 1500;

export function useAutosave(canvasId: string | null, enabled: boolean = true) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPayload = useRef<AutosavePayload | null>(null);

  const doSave = useCallback(async () => {
    if (!canvasId || !latestPayload.current) return;
    setStatus('saving');
    try {
      await canvasApi.update(canvasId, latestPayload.current);
      setStatus('saved');
    } catch (err) {
      console.error('Autosave failed:', err);
      setStatus('error');
    }
  }, [canvasId]);

  // Call this on every state change; it debounces internally
  const triggerAutosave = useCallback(
    (payload: AutosavePayload) => {
      if (!enabled || !canvasId) return; // don't autosave a brand-new unsaved canvas
      latestPayload.current = payload;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        doSave();
      }, DEBOUNCE_MS);
    },
    [enabled, canvasId, doSave]
  );

  // Flush immediately (e.g. before navigating away or on manual Save click)
  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return doSave();
  }, [doSave]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { status, triggerAutosave, flush };
}