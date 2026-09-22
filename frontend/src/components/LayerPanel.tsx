'use client';

import { CanvasElement } from '@/types/canvas';

interface LayerPanelProps {
  elements: CanvasElement[];
  layerOrder: string[]; // bottom -> top
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (newLayerOrder: string[]) => void;
}

const typeIcon: Record<string, string> = {
  rect: '▭',
  circle: '◯',
  text: 'T',
};

export default function LayerPanel({
  elements,
  layerOrder,
  selectedId,
  onSelect,
  onReorder,
}: LayerPanelProps) {
  // Display top layer first (reverse of layerOrder, since layerOrder is bottom->top)
  const displayOrder = [...layerOrder].reverse();

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const idx = layerOrder.indexOf(id);
    if (idx === -1) return;

    const newOrder = [...layerOrder];
    const swapWith = direction === 'up' ? idx + 1 : idx - 1;

    if (swapWith < 0 || swapWith >= newOrder.length) return; // already at edge

    [newOrder[idx], newOrder[swapWith]] = [newOrder[swapWith], newOrder[idx]];
    onReorder(newOrder);
  };

  const bringToFront = (id: string) => {
    const newOrder = layerOrder.filter((lid) => lid !== id);
    newOrder.push(id); // last = top-most
    onReorder(newOrder);
  };

  const sendToBack = (id: string) => {
    const newOrder = layerOrder.filter((lid) => lid !== id);
    newOrder.unshift(id); // first = bottom-most
    onReorder(newOrder);
  };

  if (elements.length === 0) {
    return (
      <div className="w-56 shrink-0 p-3 bg-white border-l border-gray-200 text-xs text-gray-400">
        No layers yet. Add a shape to get started.
      </div>
    );
  }

  return (
    <div className="w-56 shrink-0 p-3 bg-white border-l border-gray-200 overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Layers</h3>
      <ul className="space-y-1">
        {displayOrder.map((id) => {
          const el = elements.find((e) => e.id === id);
          if (!el) return null;
          const isSelected = id === selectedId;

          return (
            <li
              key={id}
              onClick={() => onSelect(id)}
              className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-xs ${
                isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <span>{typeIcon[el.type]}</span>
                <span className="truncate">
                  {el.type === 'text' ? el.text || 'Text' : el.type}
                </span>
              </span>
              <span className="flex gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(id, 'up');
                  }}
                  title="Bring forward"
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(id, 'down');
                  }}
                  title="Send backward"
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    bringToFront(id);
                  }}
                  title="Bring to front"
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                >
                  ⤒
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sendToBack(id);
                  }}
                  title="Send to back"
                  className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                >
                  ⤓
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}