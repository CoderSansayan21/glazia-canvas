'use client';

import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import Konva from 'konva';

interface TransformerControlProps {
  selectedNode: Konva.Node | null;
}

export default function TransformerControl({ selectedNode }: TransformerControlProps) {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current) return;

    if (selectedNode) {
      // Attach transformer to the currently selected shape
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer()?.batchDraw();
    } else {
      // Nothing selected — clear handles
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedNode]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={true}
      boundBoxFunc={(oldBox, newBox) => {
        // Prevent resizing to a negative/zero size
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      anchorSize={8}
      borderStroke="#4f46e5"
      anchorStroke="#4f46e5"
      anchorFill="#ffffff"
    />
  );
}