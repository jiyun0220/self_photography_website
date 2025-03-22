import { PhotoFilter } from '../types/types';

export const getFilterStyle = (filter: PhotoFilter): string => {
  switch (filter) {
    case 'grayscale':
      return 'grayscale(100%)';
    case 'vintage':
      return 'contrast(110%) brightness(110%) sepia(30%)';
    case 'warm':
      return 'saturate(150%) brightness(105%)';
    case 'cool':
      return 'saturate(75%) brightness(115%) hue-rotate(10deg) contrast(85%)';
    case 'white':
      return 'brightness(140%) contrast(85%) saturate(70%)';
    case 'normal':
    default:
      return 'none';
  }
};
