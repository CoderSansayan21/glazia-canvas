'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';

import KonvaStage from '@/components/canvas/KonvaStage';
import Toolbar from '@/components/Toolbar';
import PropertiesPanel from '@/components/PropertiesPanel';
import LayerPanel from '@/components/LayerPanel';
import AutosaveIndicator from '@/components/AutosaveIndicator';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useAutosave } from '@/hooks/useAutosave';
import { canvasApi } from '@/lib/api';
import { exportStageAsPNG } from '@/lib/exportImage';
import { CanvasElement } from '@/types/canvas';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string; 

  const [canvasId, setCanvasId] = useState<string | null>(
    routeId === 'new' ? null : routeId
  );
  const [canvasName, setCanvasName] = useState('Untitled Canvas');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(routeId !== 'new');
  const [manualSaving, setManualSaving] = useState(false);

  const stageRef = useRef<Konva.Stage>(null);

  //Undo/Redo history holds { elements, layerOrder }
  const { state, commit, undo, redo, reset, canUndo, canRedo } = useCanvasHistory({
    elements: [],
    layerOrder: [],
  });

  // Autosave
  const { status: saveStatus, triggerAutosave, flush } = useAutosave(canvasId, true);

  //Load existing canvas on mount (if not "new")
  useEffect(() => {
    if (routeId === 'new') return;
    canvasApi
      .getById(routeId)
      .then((res) => {
        const data = res.data.canvas;
        setCanvasName(data.name);
        reset({ elements: data.elements, layerOrder: data.layerOrder });
        setCanvasId(data._id);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load canvas');
        router.push('/');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  //trigger on every committed change (not on every drag pixel)
  useEffect(() => {
    if (loading) return;
    triggerAutosave({ name: canvasName, elements: state.elements, layerOrder: state.layerOrder });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, canvasName]);

  // ----Add shape helpers ----
  const addElement = (el: CanvasElement) => {
    const next = {
      elements: [...state.elements, el],
      layerOrder: [...state.layerOrder, el.id],
    };
    commit(next);
    setSelectedId(el.id);
  };

  const onAddRect = () =>
    addElement({
      id: uuidv4(),
      type: 'rect',
      x: 100,
      y: 100,
      width: 120,
      height: 80,
      rotation: 0,
      fill: '#6366f1',
      draggable: true,
    });

  const onAddCircle = () =>
    addElement({
      id: uuidv4(),
      type: 'circle',
      x: 250,
      y: 150,
      radius: 50,
      rotation: 0,
      fill: '#ec4899',
      draggable: true,
    });

  const onAddText = () =>
    addElement({
      id: uuidv4(),
      type: 'text',
      x: 150,
      y: 250,
      text: 'Double-click to edit',
      fontSize: 20,
      width: 200,
      rotation: 0,
      fill: '#111827',
      draggable: true,
    });

  // ----Delete selected ----
  const onDelete = () => {
    if (!selectedId) return;
    commit({
      elements: state.elements.filter((el) => el.id !== selectedId),
      layerOrder: state.layerOrder.filter((id) => id !== selectedId),
    });
    setSelectedId(null);
  };

  // ----Commit from drag/transform end (KonvaStage) ----
  const onElementCommit = (updated: CanvasElement) => {
    commit({
      elements: state.elements.map((el) => (el.id === updated.id ? updated : el)),
      layerOrder: state.layerOrder,
    });
  };

  // ---- Live update from PropertiesPanel (debounced commit on blur) ----
    const propertyCommitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onPropertyUpdate = (updated: CanvasElement) => {
        const liveElements = state.elements.map((el) => (el.id === updated.id ? updated : el));
        if (propertyCommitTimer.current) clearTimeout(propertyCommitTimer.current);
        propertyCommitTimer.current = setTimeout(() => {
        commit({ elements: liveElements, layerOrder: state.layerOrder });
        }, 400);
        commit({ elements: liveElements, layerOrder: state.layerOrder });
    };

  // ----  Layers reorder ----
  const onReorder = (newLayerOrder: string[]) => {
    commit({ elements: state.elements, layerOrder: newLayerOrder });
  };

  // ---- PNG Export ----
  const onExportPNG = () => {
    if (stageRef.current) {
      exportStageAsPNG(stageRef.current, `${canvasName || 'canvas'}.png`);
    }
  };

  // ----Manual Save (also handles first-time create) ----
  const onSave = async () => {
    setManualSaving(true);
    try {
      if (!canvasId) {
        const res = await canvasApi.create({
          name: canvasName,
          elements: state.elements,
          layerOrder: state.layerOrder,
        });
        setCanvasId(res.data.canvas._id);
        router.replace(`/editor/${res.data.canvas._id}`);
      } else {
        await flush();
      }
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setManualSaving(false);
    }
  };

  const selectedElement = state.elements.find((el) => el.id === selectedId) || null;

  if (loading) {
    return <div className="p-6 text-gray-500">Loading canvas…</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
        <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-gray-800">
          ← Back
        </button>
        <input
          value={canvasName}
          onChange={(e) => setCanvasName(e.target.value)}
          className="text-sm font-medium border-none focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-2 py-1"
        />
        <AutosaveIndicator status={saveStatus} />
      </div>

      <Toolbar
        onAddRect={onAddRect}
        onAddCircle={onAddCircle}
        onAddText={onAddText}
        onDelete={onDelete}
        hasSelection={!!selectedId}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExportPNG={onExportPNG}
        onSave={onSave}
        saving={manualSaving}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-100">
          <KonvaStage
            elements={state.elements}
            layerOrder={state.layerOrder}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onElementChange={() => {}}
            onElementCommit={onElementCommit}
            stageRef={stageRef}
          />
        </div>

        <LayerPanel
          elements={state.elements}
          layerOrder={state.layerOrder}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={onReorder}
        />

        <PropertiesPanel selectedElement={selectedElement} onUpdate={onPropertyUpdate} />
      </div>
    </div>
  );
}