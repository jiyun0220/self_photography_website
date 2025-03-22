import React from 'react';
import styled from '@emotion/styled';
import { Photo, FrameStyle } from '../types/types';

interface PhotoFrameProps {
  photos: (Photo | null)[];
  frameStyle: FrameStyle;
}

const getFilterStyle = (filter: string) => {
  switch (filter) {
    case 'grayscale':
      return 'grayscale(100%)';
    case 'sepia':
      return 'sepia(100%)';
    case 'vintage':
      return 'contrast(110%) brightness(110%) sepia(30%)';
    case 'warm':
      return 'saturate(150%) brightness(105%)';
    case 'cool':
      return 'saturate(80%) brightness(105%) hue-rotate(10deg)';
    default:
      return 'none';
  }
};

const PhotoFrame: React.FC<PhotoFrameProps> = ({ photos, frameStyle }) => {
  return (
    <Frame style={{ backgroundColor: frameStyle.color }}>
      <Grid>
        {photos.map((photo, index) => (
          <PhotoCell key={index}>
            {photo ? (
              <PhotoWrapper>
                <PhotoImage 
                  src={photo.imageData} 
                  alt={`Photo ${index + 1}`} 
                  style={{ filter: getFilterStyle(photo.filter) }} 
                />
                {photo.celebrityImage && (
                  <CelebrityOverlay 
                    src={photo.celebrityImage.imageUrl} 
                    alt="Celebrity" 
                    style={{ 
                      transform: `translate(${photo.celebrityImage.position.x}%, ${photo.celebrityImage.position.y}%) scale(${photo.celebrityImage.scale})`
                    }} 
                  />
                )}
              </PhotoWrapper>
            ) : (
              <EmptyCell>{index + 1}</EmptyCell>
            )}
          </PhotoCell>
        ))}
      </Grid>
    </Frame>
  );
};

const Frame = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1/3;
  margin: 0 auto;
  padding: 12px;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  height: 100%;
  background-color: inherit;
  padding-bottom: 36px;
`;

const PhotoCell = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: white;
  overflow: hidden;
  position: relative;
`;

const PhotoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CelebrityOverlay = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  height: auto;
  pointer-events: none;
  user-select: none;
  transform-origin: top left;
`;

const EmptyCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #dee2e6;
`;

export default PhotoFrame;
