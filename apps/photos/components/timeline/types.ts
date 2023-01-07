import { StaticImageData } from 'next/image';

export interface Metadata {
  device?: string;
  lens?: string;
  iso?: number;
  f?: number;
  fStop?: number;
  shutter?: string;

  subject?: string;
  time?: string;

  comment?: string;
}

/** [x1, y1, x2, y2] */
export type FocusArea = [number, number, number, number];

export interface ImageItem {
  type: 'image';
  metadata?: Metadata;
  data: StaticImageData;
  background: string;
  size: [number, number];
  focusArea: FocusArea;
}

export interface DividerItem {
  landscape?: boolean;
  portrait?: boolean;
  type: 'divider';
  ratio: number;
  style: 'cross' | 'dots';
}

export type TimelineItem = ImageItem | DividerItem;
