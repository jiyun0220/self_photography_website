export type PhotoFilter = 'normal' | 'grayscale' | 'vintage' | 'warm' | 'cool' | 'white';

export interface Position {
  x: number;
  y: number;
}

export interface CelebrityImage {
  imageUrl: string;
  position: Position;
  scale: number;
}

export interface Photo {
  imageData: string;
  filter: PhotoFilter;
  celebrityImage: CelebrityImage | null;
}

export interface FrameStyle {
  filter: PhotoFilter;
  color: string;
}

export interface FrameColor {
  id: string;
  color: string;
  name: string;
}

export const PRESET_COLORS = {
  pink: '#FFB5E8',   
  purple: '#DCD3FF', 
  mint: '#B5EAD7',   
  yellow: '#FFDAC1',   
  blue: '#9ADCFF',   
  white: '#FFFFFF',  
} as const;

export type PresetColorKey = keyof typeof PRESET_COLORS;
