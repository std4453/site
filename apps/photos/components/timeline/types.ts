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

export interface ImageItem {
  type: 'image';
  metadata?: Metadata;
  data: StaticImageData;
}

export interface DividerItem {
  landscape?: boolean;
  portrait?: boolean;
  type: 'divider';
  ratio: number;
  style: 'cross' | 'dots';
}

export type TimelineItem = ImageItem | DividerItem;
