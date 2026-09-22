'use client';

import { Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';
import { CanvasElement } from '@/types/canvas';

interface ShapeRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updated: CanvasElement) => void;
  onDragEnd: (updated: CanvasElement) => void;
  onTransformEnd: (updated: CanvasElement) => void;
  shapeRef: (node: Konva.Node | null) => void;
}

export default function ShapeRenderer({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  shapeRef,
}: ShapeRendererProps) {
  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    fill: element.fill,
    draggable: element.draggable,
    onClick: onSelect,
    onTap: onSelect,
    ref: shapeRef,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      onDragEnd({ ...element, x: e.target.x(), y: e.target.y() });
    },
    // Fired after resize/rotate via Transformer
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale to 1 and "bake" it into width/height/radius instead,
      // otherwise scale keeps compounding on every transform.
      node.scaleX(1);
      node.scaleY(1);

      const base = {
        ...element,
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
      };

      if (element.type === 'rect') {
        onTransformEnd({
          ...base,
          type: 'rect',
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        } as CanvasElement);
      } else if (element.type === 'circle') {
        onTransformEnd({
          ...base,
          type: 'circle',
          radius: Math.max(5, (node as Konva.Circle).radius() * scaleX),
        } as CanvasElement);
      } else if (element.type === 'text') {
        onTransformEnd({
          ...base,
          type: 'text',
          width: Math.max(20, node.width() * scaleX),
          fontSize: (element as any).fontSize * scaleY,
        } as CanvasElement);
      }
    },
  };

  if (element.type === 'rect') {
    return <Rect {...commonProps} width={element.width} height={element.height} />;
  }

  if (element.type === 'circle') {
    return <Circle {...commonProps} radius={element.radius} />;
  }

  if (element.type === 'text') {
    return (
      <Text
        {...commonProps}
        text={element.text}
        fontSize={element.fontSize}
        width={element.width}
      />
    );
  }

  return null;
}