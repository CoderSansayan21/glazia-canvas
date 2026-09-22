'use client';

import { CanvasElement } from '@/types/canvas';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdate: (updated: CanvasElement) => void;
}

export default function PropertiesPanel({ selectedElement, onUpdate }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="w-72 shrink-0 p-4 bg-white border-l border-gray-200 text-sm text-gray-400">
        Select an element to edit its properties.
      </div>
    );
  }

  const el = selectedElement;

  const field = (label: string, input: React.ReactNode) => (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {input}
    </div>
  );

  const numberInput = (value: number, onChange: (v: number) => void) => (
    <input
      type="number"
      value={Math.round(value * 100) / 100}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
    />
  );

  return (
    <div className="w-72 shrink-0 p-4 bg-white border-l border-gray-200 overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Properties — {el.type.toUpperCase()}
      </h3>

      {/*Position */}
      <div className="grid grid-cols-2 gap-2">
        {field('X', numberInput(el.x, (v) => onUpdate({ ...el, x: v })))}
        {field('Y', numberInput(el.y, (v) => onUpdate({ ...el, y: v })))}
      </div>

      {/*Size — differs per shape type */}
      {el.type === 'rect' && (
        <div className="grid grid-cols-2 gap-2">
          {field('Width', numberInput(el.width, (v) => onUpdate({ ...el, width: v })))}
          {field('Height', numberInput(el.height, (v) => onUpdate({ ...el, height: v })))}
        </div>
      )}

      {el.type === 'circle' && (
        field('Radius', numberInput(el.radius, (v) => onUpdate({ ...el, radius: v })))
      )}

      {el.type === 'text' && (
        <>
          {field('Width', numberInput(el.width, (v) => onUpdate({ ...el, width: v })))}
          {field('Font Size', numberInput(el.fontSize, (v) => onUpdate({ ...el, fontSize: v })))}
        </>
      )}

      {/*Rotation */}
      {field('Rotation (°)', numberInput(el.rotation, (v) => onUpdate({ ...el, rotation: v })))}

      {/*Fill / Color */}
      {field(
        'Fill Color',
        <input
          type="color"
          value={el.fill}
          onChange={(e) => onUpdate({ ...el, fill: e.target.value })}
          className="w-full h-8 border border-gray-300 rounded cursor-pointer"
        />
      )}

      {/*Text content — only for text elements */}
      {el.type === 'text' && (
        field(
          'Text',
          <textarea
            value={el.text}
            onChange={(e) => onUpdate({ ...el, text: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
          />
        )
      )}
    </div>
  );
}