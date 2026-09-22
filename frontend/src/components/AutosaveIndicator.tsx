'use client';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutosaveIndicatorProps {
  status: SaveStatus;
}

const statusConfig: Record<SaveStatus, { text: string; className: string }> = {
  idle: { text: '', className: '' },
  saving: { text: 'Saving…', className: 'bg-amber-50 text-amber-700' },
  saved: { text: 'Saved', className: 'bg-emerald-50 text-emerald-700' },
  error: { text: 'Save failed', className: 'bg-red-50 text-red-700' },
};

export default function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === 'idle') return null;

  const { text, className } = statusConfig[status];

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${className}`}>
      {text}
    </span>
  );
}