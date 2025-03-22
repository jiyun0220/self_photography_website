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
