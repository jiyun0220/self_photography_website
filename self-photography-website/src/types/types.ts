export interface CelebrityImage {
  imageUrl: string;
  position: {
    x: number;
    y: number;
  };
  scale: number;
}

export interface Photo {
  imageData: string;
  filter: string;
  celebrityImage: CelebrityImage | null;
}

export interface FrameStyle {
  color: string;
  filter: string;
}

export type PhotoFilter = 'normal' | 'grayscale' | 'sepia' | 'vintage' | 'warm' | 'cool';

export interface FrameColor {
  id: string;
  color: string;
  name: string;
}
