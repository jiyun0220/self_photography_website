import React from 'react';
import styled from '@emotion/styled';
import { Photo, FrameStyle } from '../types/types';
import { getFilterStyle } from '../utils/filters';
import { theme } from '../styles/theme';

interface PhotoFrameProps {
  photos: (Photo | null)[];
  frameStyle: FrameStyle;
}

const PhotoFrame: React.FC<PhotoFrameProps> = ({ photos, frameStyle }) => {
  return (
    <Frame style={{ backgroundColor: frameStyle.color }}>
      <Grid>
        {photos.map((photo, index) => (
          <PhotoCell key={index} className="photo-cell">
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
  max-width: 320px;
  aspect-ratio: 1/3;
  margin: 0 auto;
  padding: 12px;
  background-color: black;
  box-shadow: ${theme.shadows.medium};
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
  background-color: ${theme.colors.white};
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
  width: 100px;
  height: auto;
  transform-origin: top left;
  pointer-events: none;
`;

const EmptyCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${theme.colors.text};
  opacity: 0.5;
`;

export default PhotoFrame;
