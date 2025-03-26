import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Photo } from '../types/types';
import { theme } from '../styles/theme';
import { getFilterStyle } from '../utils/filters';
import html2canvas from 'html2canvas';

interface ExportButtonProps {
  photos: (Photo | null)[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ photos }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'png' | 'jpeg') => {
    try {
      setIsExporting(true);

      const frame = document.querySelector('.photo-frame');
      if (!frame) {
        console.error('프레임을 찾을 수 없습니다');
        return;
      }

      // 프레임의 복사본 생성
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // 프레임과 내용물 복사
      const clonedFrame = frame.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedFrame);

      // 복사된 프레임에서 이미지들 찾기
      const originalImages = Array.from(frame.querySelectorAll('.photo-cell img')) as HTMLImageElement[];
      const clonedImages = Array.from(clonedFrame.querySelectorAll('.photo-cell img')) as HTMLImageElement[];

      console.log('이미지 개수:', originalImages.length);
      console.log('복제된 이미지 개수:', clonedImages.length);

      // 각 이미지에 대한 처리 Promise 배열 생성
      const imagePromises = originalImages.map(async (originalImg, i) => {
        const photo = photos[i];
        if (!photo) {
          console.log(`이미지 ${i}: 사진 데이터 없음`);
          return;
        }

        console.log(`이미지 ${i} 처리 시작:`, photo.filter);
        const clonedImg = clonedImages[i];

        return new Promise<void>((resolve, reject) => {
          try {
            const tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            
            tempImg.onload = () => {
              try {
                console.log(`이미지 ${i} 로드 완료, 필터 적용 시작`);
                const canvas = document.createElement('canvas');
                canvas.width = tempImg.naturalWidth || originalImg.width;
                canvas.height = tempImg.naturalHeight || originalImg.height;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                  console.error(`이미지 ${i}: Canvas 컨텍스트 생성 실패`);
                  reject(new Error('Canvas context is null'));
                  return;
                }

                // 필터 적용
                ctx.filter = getFilterStyle(photo.filter);
                ctx.drawImage(tempImg, 0, 0);
                
                // 필터가 적용된 이미지로 교체
                const filteredImageUrl = canvas.toDataURL();
                clonedImg.onload = () => {
                  console.log(`이미지 ${i} 필터 적용 완료`);
                  resolve();
                };
                clonedImg.onerror = (err) => {
                  console.error(`이미지 ${i} 로드 실패:`, err);
                  reject(err);
                };
                clonedImg.src = filteredImageUrl;
              } catch (err) {
                console.error(`이미지 ${i} 처리 중 에러:`, err);
                reject(err);
              }
            };

            tempImg.onerror = (err) => {
              console.error(`이미지 ${i} 원본 로드 실패:`, err);
              reject(err);
            };

            console.log(`이미지 ${i} 로드 시작:`, originalImg.src);
            tempImg.src = originalImg.src;
          } catch (err) {
            console.error(`이미지 ${i} 전체 처리 실패:`, err);
            reject(err);
          }
        });
      });

      // 모든 이미지 처리 대기
      console.log('모든 이미지 처리 대기 시작');
      await Promise.all(imagePromises);
      console.log('모든 이미지 처리 완료');

      // 약간의 지연을 주어 이미지가 완전히 렌더링되도록 함
      await new Promise(resolve => setTimeout(resolve, 500));

      // 캡처 시작
      console.log('캡처 시작');
      const canvas = await html2canvas(clonedFrame, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: true,
        allowTaint: true,
        imageTimeout: 0,
      });
      console.log('캡처 완료');

      // 임시 컨테이너 제거
      document.body.removeChild(tempContainer);

      // 이미지 저장
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.92;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.download = `기적네컷.${format}`;
      link.href = dataUrl;
      link.click();

      console.log('저장 완료');
    } catch (err) {
      console.error('저장 실패:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ExportContainer>
      <Button 
        onClick={() => handleExport('png')} 
        disabled={isExporting}
      >
        {isExporting ? '저장 중...' : 'PNG 저장'}
      </Button>
      <Button 
        onClick={() => handleExport('jpeg')} 
        disabled={isExporting}
      >
        {isExporting ? '저장 중...' : 'JPEG 저장'}
      </Button>
    </ExportContainer>
  );
};

const ExportContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${theme.shadows.small};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export default ExportButton;
