'use client';

interface ToolbarProps {
  onAddRect: () => void;
  onAddCircle: () => void;
  onAddText: () => void;
  onDelete: () => void;
  hasSelection: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportPNG: () => void;
  onSave: () => void;
  saving?: boolean;
}

export default function Toolbar({
  onAddRect,
  onAddCircle,
  onAddText,
  onDelete,
  hasSelection,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportPNG,
  onSave,
  saving = false,
}: ToolbarProps) {
  const btnBase =
    'px-3 py-2 rounded-md text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-b border-gray-200">
      {/* Add shapes */}
      <div className="flex gap-2 pr-3 border-r border-gray-200">
        <button
          onClick={onAddRect}
          className={`${btnBase} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
        >
          ▭ Rectangle
        </button>
        <button
          onClick={onAddCircle}
          className={`${btnBase} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
        >
          ◯ Circle
        </button>
        <button
          onClick={onAddText}
          className={`${btnBase} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
        >
          T Text
        </button>
      </div>

      {/* Delete selected */}
      <div className="flex gap-2 pr-3 border-r border-gray-200">
        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={`${btnBase} bg-red-50 text-red-700 hover:bg-red-100`}
        >
          🗑 Delete
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex gap-2 pr-3 border-r border-gray-200">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`${btnBase} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          title="Ctrl+Z"
        >
          ↶ Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`${btnBase} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          title="Ctrl+Y"
        >
          ↷ Redo
        </button>
      </div>

      {/*  PNG Export */}
      <div className="flex gap-2 pr-3 border-r border-gray-200">
        <button
          onClick={onExportPNG}
          className={`${btnBase} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
        >
          ⬇ Export PNG
        </button>
      </div>

      {/* Manual Save (in addition to autosave) */}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={onSave}
          disabled={saving}
          className={`${btnBase} bg-indigo-600 text-white hover:bg-indigo-700`}
        >
          {saving ? 'Saving…' : '💾 Save'}
        </button>
      </div>
    </div>
  );
}