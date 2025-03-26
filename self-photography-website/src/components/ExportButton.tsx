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

  const applyFilterToImage = async (
    originalImg: HTMLImageElement,
    filterStyle: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = originalImg.naturalWidth || originalImg.width;
      canvas.height = originalImg.naturalHeight || originalImg.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        ctx.filter = filterStyle;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = originalImg.src;
    });
  };

  const handleExport = async (format: 'png' | 'jpeg') => {
    try {
      setIsExporting(true);
      console.log('현재 photos 데이터:', photos);

      const frame = document.querySelector('.photo-frame');
      if (!frame) {
        alert('프레임을 찾을 수 없습니다');
        return;
      }

      // 임시 컨테이너 생성
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);

      // 프레임 복제
      const clonedFrame = frame.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedFrame);

      // 각 이미지에 필터 적용
      const photoCells = Array.from(clonedFrame.querySelectorAll('.photo-cell'));
      
      // 모든 이미지 처리를 기다림
      await Promise.all(
        photoCells.map(async (cell, index) => {
          const photo = photos[index];
          if (!photo) return;

          const img = cell.querySelector('img') as HTMLImageElement;
          if (!img) return;

          console.log(`이미지 ${index + 1} 처리 시작:`, {
            filter: photo.filter,
            src: img.src
          });

          try {
            // 필터를 적용한 새 이미지 URL 생성
            const filteredImageUrl = await applyFilterToImage(
              img,
              getFilterStyle(photo.filter)
            );

            // 필터가 적용된 이미지로 교체
            img.src = filteredImageUrl;
            img.style.filter = 'none'; // 원래 필터 제거

            console.log(`이미지 ${index + 1} 처리 완료`);
          } catch (err) {
            console.error(`이미지 ${index + 1} 처리 실패:`, err);
          }
        })
      );

      // 렌더링 대기
      await new Promise(resolve => setTimeout(resolve, 500));

      // 캡처
      const canvas = await html2canvas(clonedFrame, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: true,
        imageTimeout: 30000,
      });

      // 임시 컨테이너 제거
      document.body.removeChild(tempContainer);

      // 이미지 저장
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.92;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.download = `기적네컷.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장 중 오류가 발생했습니다');
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