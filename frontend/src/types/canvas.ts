export type ElementType = 'rect' | 'circle' | 'text';

interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  fill: string;
  draggable: boolean;
}

export interface RectElement extends BaseElement {
  type: 'rect';
  width: number;
  height: number;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  width: number;
}

export type CanvasElement = RectElement | CircleElement | TextElement;

export interface CanvasData {
  _id?: string;
  name: string;
  elements: CanvasElement[];
  layerOrder: string[];    
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}