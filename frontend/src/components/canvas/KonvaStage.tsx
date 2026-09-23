'use client';

import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect as KonvaRectPreview } from 'react-konva';
import Konva from 'konva';
import ShapeRenderer from './ShapeRenderer';
import TransformerControl from './TransformerControl';
import { CanvasElement } from '@/types/canvas';

interface KonvaStageProps {
  elements: CanvasElement[];
  layerOrder: string[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onElementChange: (updated: CanvasElement) => void; // live update, no history commit
  onElementCommit: (updated: CanvasElement) => void;  // commits to undo/redo history
  stageRef: React.RefObject<Konva.Stage>;
  width?: number;
  height?: number;
}

export default function KonvaStage({
  elements,
  layerOrder,
  selectedId,
  onSelect,
  onElementChange,
  onElementCommit,
  stageRef,
  width = 900,
  height = 600,
}: KonvaStageProps) {
  const [selectedNode, setSelectedNode] = useState<Konva.Node | null>(null);
  const shapeRefs = useRef<Record<string, Konva.Node>>({});

  // Whenever selectedId changes, look up the actual Konva node for the Transformer
  useEffect(() => {
    if (selectedId && shapeRefs.current[selectedId]) {
      setSelectedNode(shapeRefs.current[selectedId]);
    } else {
      setSelectedNode(null);
    }
  }, [selectedId, elements]);

  // Clicking empty stage area deselects
  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      onSelect(null);
    }
  };

  // Render elements in layerOrder sequence (bottom to top = array order)
  const orderedElements = layerOrder
    .map((id) => elements.find((el) => el.id === id))
    .filter((el): el is CanvasElement => Boolean(el));

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleStageMouseDown}
      onTouchStart={handleStageMouseDown}
      style={{ background: '#f8f9fb', border: '1px solid #e2e2e2' }}
    >
      <Layer>
        {orderedElements.map((element) => (
          <ShapeRenderer
            key={element.id}
            element={element}
            isSelected={element.id === selectedId}
            onSelect={() => onSelect(element.id)}
            onChange={onElementCommit}
            shapeRef={(node) => {
              if (node) shapeRefs.current[element.id] = node;
              else delete shapeRefs.current[element.id];
            }}
            onDragEnd={(updated) => onElementCommit(updated)}
            onTransformEnd={(updated) => onElementCommit(updated)}
          />
        ))}
        <TransformerControl selectedNode={selectedNode} />
      </Layer>
    </Stage>
  );
}