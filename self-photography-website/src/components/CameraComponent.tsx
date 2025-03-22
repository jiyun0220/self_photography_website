import React, { useRef, useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { CelebrityImage, Position, PhotoFilter } from '../types/types';
import { theme } from '../styles/theme';
import { getFilterStyle } from '../utils/filters';

interface CameraComponentProps {
  onCapture: (imageData: string) => void;
  celebrityImage: CelebrityImage | null;
  onCelebrityImageMove: (position: Position) => void;
  onCelebrityImageScale: (scale: number) => void;
  currentFilter: PhotoFilter;
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
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (celebrityImage) {
      setDragPosition(celebrityImage.position);
      setScale(celebrityImage.scale);
    }
  }, [celebrityImage]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      const relativePosition = {
        x: (dragPosition.x / containerWidth) * 100,
        y: (dragPosition.y / containerHeight) * 100
      };
      
      onCapture(imageSrc);
      onCelebrityImageMove(relativePosition);
      onCelebrityImageScale(scale);
    }
  }, [onCapture, dragPosition, scale, onCelebrityImageMove, onCelebrityImageScale]);

  const handleDrag = (_: any, info: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const x = info.point.x - rect.left;
    const y = info.point.y - rect.top;
    
    // 왼쪽 절반으로 제한
    const maxX = containerWidth / 2;
    const boundedX = Math.max(0, Math.min(x, maxX));
    
    if (x > maxX && !showWarning) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
    
    setDragPosition({ x: boundedX, y });
  };

  const handleDragEnd = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    const relativePosition = {
      x: (dragPosition.x / containerWidth) * 100,
      y: (dragPosition.y / containerHeight) * 100
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
            onDragEnd={handleDragEnd}
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
        {showWarning && (
          <WarningMessage>
            <span role="img" aria-label="warning">⚠️</span>
            오른쪽 영역은 이미지가 왜곡될 수 있어요!<br />
            왼쪽에서 사용해주세요!
          </WarningMessage>
        )}
      </CameraWrapper>
      <ControlsContainer>
        <ScaleControl>
          <ScaleLabel>
            <span role="img" aria-label="resize">📏</span> 이미지 크기
          </ScaleLabel>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={scale}
            onChange={handleScaleChange}
          />
        </ScaleControl>
        <CaptureButton onClick={capture}>
          <span role="img" aria-label="camera">📸</span> 찰칵!
        </CaptureButton>
      </ControlsContainer>
    </CameraContainer>
  );
};

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  background: ${theme.colors.white};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.small};
`;

const CameraWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #000;
  overflow: hidden;
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
  width: 100px;
  height: auto;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transform-origin: top left;
`;

const WarningMessage = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  color: ${theme.colors.text};
  padding: 1rem;
  border-radius: ${theme.borderRadius.medium};
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.4;
  box-shadow: ${theme.shadows.small};
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes bounceIn {
    0% { 
      opacity: 0;
      transform: translateY(-50%) scale(0.3);
    }
    50% {
      opacity: 0.9;
      transform: translateY(-50%) scale(1.1);
    }
    70% {
      transform: translateY(-50%) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.border};
`;

const ScaleControl = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: ${theme.colors.primaryLight};
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      background: ${theme.colors.white};
      border: 2px solid ${theme.colors.primary};
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
`;

const ScaleLabel = styled.span`
  font-size: 0.95rem;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CaptureButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    background-color: ${theme.colors.primaryDark};
  }

  &:active {
    transform: translateY(0);
  }
`;

export default CameraComponent;
