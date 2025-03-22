import { FrameColor, PhotoFilter } from '../types/types';

export const FRAME_COLORS: FrameColor[] = [
  { id: 'pink', color: '#ff69b4', name: '핑크' },
  { id: 'purple', color: '#9370db', name: '퍼플' },
  { id: 'blue', color: '#4169e1', name: '블루' },
  { id: 'green', color: '#3cb371', name: '그린' },
  { id: 'yellow', color: '#ffd700', name: '옐로우' },
  { id: 'red', color: '#ff6347', name: '레드' },
];

export const PHOTO_FILTERS: { id: PhotoFilter; name: string }[] = [
  { id: 'normal', name: '기본' },
  { id: 'grayscale', name: '흑백' },
  { id: 'sepia', name: '세피아' },
  { id: 'vintage', name: '빈티지' },
  { id: 'warm', name: '따뜻한' },
  { id: 'cool', name: '차가운' },
];

export const theme = {
  colors: {
    primary: '#FF69B4',
    primaryLight: '#FFB6C1',
    primaryDark: '#FF1493',
    background: '#F8F9FA',
    text: '#212529',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1200px',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
};
