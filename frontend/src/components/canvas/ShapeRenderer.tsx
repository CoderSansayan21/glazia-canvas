'use client';

import { useState } from 'react';
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
  onChange,
  onDragEnd,
  onTransformEnd,
  shapeRef,
}: ShapeRendererProps) {
  const [editing, setEditing] = useState(false);

  const startTextEdit = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (element.type !== 'text') return;

    e.cancelBubble = true;

    const textNode = e.target as Konva.Text;
    const stage = textNode.getStage();

    if (!stage) return;

    setEditing(true);

    const textarea = document.createElement('textarea');

    textarea.value = element.text || '';
    textarea.style.position = 'absolute';
    textarea.style.left = `${stage.container().offsetLeft + textNode.x()}px`;
    textarea.style.top = `${stage.container().offsetTop + textNode.y()}px`;
    textarea.style.width = `${textNode.width()}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.fontFamily = 'Arial';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.border = '1px solid #6366f1';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.background = 'white';
    textarea.style.color = textNode.fill() as string;
    textarea.style.zIndex = '1000';

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const finishEditing = () => {
      const newText = textarea.value;

      document.body.removeChild(textarea);
      setEditing(false);

      onChange({
        ...element,
        text: newText,
      });
    };

    textarea.addEventListener('blur', finishEditing);

    textarea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        textarea.blur();
      }

      if (event.key === 'Escape') {
        document.body.removeChild(textarea);
        setEditing(false);
      }
    });
  };

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
      onDragEnd({
        ...element,
        x: e.target.x(),
        y: e.target.y(),
      });
    },

    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;

      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

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
          radius: Math.max(
            5,
            (node as Konva.Circle).radius() * scaleX
          ),
        } as CanvasElement);
      } else if (element.type === 'text') {
        onTransformEnd({
          ...base,
          type: 'text',
          width: Math.max(20, node.width() * scaleX),
          fontSize: Math.max(
            8,
            (element.fontSize || 20) * scaleY
          ),
        } as CanvasElement);
      }
    },
  };

  if (element.type === 'rect') {
    return (
      <Rect
        {...commonProps}
        width={element.width}
        height={element.height}
      />
    );
  }

  if (element.type === 'circle') {
    return (
      <Circle
        {...commonProps}
        radius={element.radius}
      />
    );
  }

  if (element.type === 'text') {
    return (
      <Text
        {...commonProps}
        text={element.text}
        fontSize={element.fontSize}
        width={element.width}
        visible={!editing}
        onDblClick={startTextEdit}
        onDblTap={startTextEdit}
      />
    );
  }

  return null;
}