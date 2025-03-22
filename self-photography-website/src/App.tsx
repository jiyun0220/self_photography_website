import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import CameraComponent from './components/CameraComponent';
import PhotoFrame from './components/PhotoFrame';
import Controls from './components/Controls';
import ExportButton from './components/ExportButton';
import ImageUploader from './components/ImageUploader';
import { globalStyles } from './styles/GlobalStyles';
import { Photo, FrameStyle, CelebrityImage, Position, PhotoFilter } from './types/types';
import { theme } from './styles/theme';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<(Photo | null)[]>([null, null, null, null]);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>({
    filter: 'white' as PhotoFilter,
    color: '#000000'
  });
  const [currentCelebrityImage, setCurrentCelebrityImage] = useState<CelebrityImage | null>(null);

  const handleCapture = (imageData: string) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      const emptyIndex = newPhotos.findIndex(photo => !photo);
      if (emptyIndex !== -1) {
        newPhotos[emptyIndex] = {
          imageData,
          filter: frameStyle.filter,
          celebrityImage: currentCelebrityImage ? {
            ...currentCelebrityImage,
            position: {
              x: currentCelebrityImage.position.x,
              y: currentCelebrityImage.position.y - 10 // Y 위치 조정
            }
          } : null
        };
      }
      return newPhotos;
    });
  };

  const handleFrameStyleChange = (style: Partial<FrameStyle>) => {
    setFrameStyle(prev => ({ ...prev, ...style }));
    
    if (style.filter) {
      setPhotos(prev => prev.map(photo => 
        photo ? { ...photo, filter: style.filter! } : null
      ));
    }
  };

  const handleCelebrityImageSelect = (imageUrl: string) => {
    setCurrentCelebrityImage({
      imageUrl,
      position: { x: 0, y: 0 },
      scale: 1
    });
  };

  const handleCelebrityImageMove = (position: Position) => {
    if (!currentCelebrityImage) return;
    setCurrentCelebrityImage({
      ...currentCelebrityImage,
      position,
    });
  };

  const handleCelebrityImageScale = (scale: number) => {
    if (!currentCelebrityImage) return;
    setCurrentCelebrityImage({
      ...currentCelebrityImage,
      scale,
    });
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Container>
        <Title>꙳⸌꒰১♥ 그날의 너와 날 기적이라 부르자 ♥໒꒱⸍꙳</Title>
        
        <MainContent>
          <LeftSection>
            <PhotoFrame
              photos={photos}
              frameStyle={frameStyle}
            />
            <ExportButton photos={photos} />
          </LeftSection>
          
          <MiddleSection>
            <CameraComponent
              onCapture={handleCapture}
              celebrityImage={currentCelebrityImage}
              onCelebrityImageMove={handleCelebrityImageMove}
              onCelebrityImageScale={handleCelebrityImageScale}
              currentFilter={frameStyle.filter}
            />
            <ImageUploader onImageSelect={handleCelebrityImageSelect} />
          </MiddleSection>
          
          <RightSection>
            <Controls
              frameStyle={frameStyle}
              onFrameStyleChange={handleFrameStyleChange}
            />
          </RightSection>
        </MainContent>
      </Container>
    </>
  );
};

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 2rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 320px 400px 320px;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${theme.colors.white};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.small};
  height: fit-content;
`;

const LeftSection = styled(Section)`
  background: transparent;
  padding: 0;
  box-shadow: none;
`;

const MiddleSection = styled(Section)`
  padding: 0;
  background: transparent;
  box-shadow: none;
`;

const RightSection = styled(Section)`
  width: 100%;
`;

export default App;
