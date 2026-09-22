'use client';

import { CanvasData } from '@/types/canvas';

interface CanvasListItemProps {
  canvas: CanvasData;
  onOpen: () => void;
  onDelete: () => void;
}

export default function CanvasListItem({ canvas, onOpen, onDelete }: CanvasListItemProps) {
  const updatedAt = canvas.updatedAt
    ? new Date(canvas.updatedAt).toLocaleString()
    : '—';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex flex-col justify-between">
      <div onClick={onOpen} className="cursor-pointer">
        <h3 className="font-medium text-gray-800 truncate">{canvas.name || 'Untitled Canvas'}</h3>
        <p className="text-xs text-gray-400 mt-1">
          {canvas.elements?.length ?? 0} element{canvas.elements?.length === 1 ? '' : 's'}
        </p>
        <p className="text-xs text-gray-400">Last updated: {updatedAt}</p>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={onOpen}
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          Open
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-medium text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}