import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import CameraComponent from './components/CameraComponent';
import PhotoFrame from './components/PhotoFrame';
import Controls from './components/Controls';
import ExportButton from './components/ExportButton';
import ImageUploader from './components/ImageUploader';
import { globalStyles } from './styles/GlobalStyles';
import { Photo, FrameStyle, CelebrityImage } from './types/types';
import { theme } from './styles/theme';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<(Photo | null)[]>([null, null, null, null]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>({
    color: theme.colors.primary,
    filter: 'normal',
  });
  const [currentCelebrityImage, setCurrentCelebrityImage] = useState<CelebrityImage | null>(null);

  const frameRef = useRef<HTMLDivElement>(null);

  const handleCapture = (imageData: string) => {
    if (currentPhotoIndex >= 4) return;

    setPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[currentPhotoIndex] = {
        imageData,
        filter: frameStyle.filter,
        celebrityImage: currentCelebrityImage
      };
      return newPhotos;
    });

    setCurrentPhotoIndex(prev => prev + 1);
  };

  const handleFrameStyleChange = (style: Partial<FrameStyle>) => {
    setFrameStyle(prev => ({ ...prev, ...style }));
    
    if (style.filter) {
      setPhotos(prev => prev.map(photo => 
        photo ? { ...photo, filter: style.filter! } : null
      ));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setCurrentCelebrityImage({
      imageUrl,
      position: { x: 0, y: 0 },
      scale: 1,
    });
  };

  const handleCelebrityImageMove = (position: { x: number; y: number }) => {
    setCurrentCelebrityImage(prev => 
      prev ? { ...prev, position } : null
    );
  };

  const handleCelebrityImageScale = (scale: number) => {
    setCurrentCelebrityImage(prev => 
      prev ? { ...prev, scale } : null
    );
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Container>
        <Title>그날의 너와 날 기적이라 부르자</Title>
        
        <MainContent>
          <LeftSection>
            <ImageUploader onImageUpload={handleImageUpload} />
            <div ref={frameRef}>
              <PhotoFrame
                photos={photos}
                frameStyle={frameStyle}
              />
            </div>
          </LeftSection>

          <MiddleSection>
            {currentPhotoIndex < 4 && (
              <CameraComponent
                onCapture={handleCapture}
                celebrityImage={currentCelebrityImage}
                onCelebrityImageMove={handleCelebrityImageMove}
                onCelebrityImageScale={handleCelebrityImageScale}
                currentFilter={frameStyle.filter}
              />
            )}
          </MiddleSection>

          <RightSection>
            <Controls
              frameStyle={frameStyle}
              onFrameStyleChange={handleFrameStyleChange}
            />
            {currentPhotoIndex === 4 && (
              <ExportButton targetRef={frameRef} />
            )}
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: ${theme.colors.primary};
  margin-bottom: 2rem;
  font-size: 2rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  height: calc(100vh - 150px);

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const Section = styled.section`
  background: white;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const LeftSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MiddleSection = styled(Section)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
`;

const RightSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default App;
