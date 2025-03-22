import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { CelebrityImage } from '../types/types';
import { motion } from 'framer-motion';

interface CameraComponentProps {
  onCapture: (imageSrc: string) => void;
  celebrityImage: CelebrityImage | null;
  onCelebrityImageMove: (position: { x: number; y: number }) => void;
  onCelebrityImageScale: (scale: number) => void;
  currentFilter: string;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onCapture,
  celebrityImage,
  onCelebrityImageMove,
  onCelebrityImageScale,
  currentFilter,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragPosition, setDragPosition] = useState(
    celebrityImage?.position || { x: 0, y: 0 }
  );
  const [scale, setScale] = useState(celebrityImage?.scale || 1);

  useEffect(() => {
    if (celebrityImage) {
      setDragPosition(celebrityImage.position);
      setScale(celebrityImage.scale);
    }
  }, [celebrityImage]);

  const getRelativePosition = (position: { x: number; y: number }) => {
    if (!containerRef.current) return position;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Ensure position is within bounds
    const boundedX = Math.max(0, Math.min(position.x, containerWidth - (containerWidth * 0.25)));
    const boundedY = Math.max(0, Math.min(position.y, containerHeight - (containerHeight * 0.25)));
    
    return {
      x: (boundedX / containerWidth) * 100,
      y: (boundedY / containerHeight) * 100
    };
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const relativePosition = getRelativePosition(dragPosition);
      onCapture(imageSrc);
      onCelebrityImageMove(relativePosition);
      onCelebrityImageScale(scale);
    }
  }, [onCapture, dragPosition, scale, onCelebrityImageMove, onCelebrityImageScale]);

  const handleDrag = (_: any, info: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Calculate position relative to container
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;
    
    // Calculate bounds considering PNG image size (25% of container)
    const maxX = containerWidth - (containerWidth * 0.25);
    const maxY = containerHeight - (containerHeight * 0.25);
    
    // Ensure position stays within bounds
    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));
    
    const newPosition = { x: boundedX, y: boundedY };
    setDragPosition(newPosition);
    
    const relativePosition = {
      x: (boundedX / containerWidth) * 100,
      y: (boundedY / containerHeight) * 100
    };
    
    onCelebrityImageMove(relativePosition);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    onCelebrityImageScale(newScale);
  };

  return (
    <CameraContainer>
      <CameraWrapper ref={containerRef}>
        <WebcamContainer style={{ filter: getFilterStyle(currentFilter) }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={{
              width: 400,
              height: 300,
              facingMode: "user"
            }}
            mirrored
            imageSmoothing
          />
        </WebcamContainer>
        {celebrityImage && (
          <CelebrityImageWrapper
            drag
            dragMomentum={false}
            dragElastic={0}
            onDrag={handleDrag}
            style={{
              x: dragPosition.x,
              y: dragPosition.y,
              scale: scale,
            }}
          >
            <img
              src={celebrityImage.imageUrl}
              alt="Celebrity"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </CelebrityImageWrapper>
        )}
      </CameraWrapper>
      <ControlsContainer>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={scale}
          onChange={handleScaleChange}
        />
        <CaptureButton onClick={capture}>찰칵!</CaptureButton>
      </ControlsContainer>
    </CameraContainer>
  );
};

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

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const CameraWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #000;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const WebcamContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CelebrityImageWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  height: auto;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transform-origin: top left;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
`;

const CaptureButton = styled.button`
  padding: 0.5rem 2rem;
  font-size: 1.2rem;
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

export default CameraComponent;
