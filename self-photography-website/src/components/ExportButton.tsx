import React from 'react';
import styled from '@emotion/styled';
import { Photo } from '../types/types';
import { theme } from '../styles/theme';
import html2canvas from 'html2canvas';
import { getFilterStyle } from '../utils/filters';

interface ExportButtonProps {
  photos: (Photo | null)[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ photos }) => {
  const handleExport = async (format: 'png' | 'jpeg') => {
    const photoElements = document.querySelectorAll('.photo-cell');
    if (!photoElements.length || !photos.some(photo => photo)) return;

    try {
      const frame = photoElements[0].parentElement?.parentElement;
      if (!frame) return;

      // 필터를 적용하기 위한 스타일 요소 생성
      const style = document.createElement('style');
      style.textContent = `
        .photo-cell img {
          transform: translateZ(0);
          -webkit-font-smoothing: antialiased;
        }
      `;
      document.head.appendChild(style);

      const canvas = await html2canvas(frame as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
        removeContainer: false,
        onclone: (clonedDoc) => {
          photos.forEach((photo, index) => {
            if (photo) {
              const img = clonedDoc.querySelector(`.photo-cell:nth-child(${index + 1}) img`);
              if (img instanceof HTMLElement) {
                img.style.filter = getFilterStyle(photo.filter);
              }
            }
          });
        }
      });

      // 스타일 요소 제거
      style.remove();
      
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.92;
      
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      const link = document.createElement('a');
      link.download = `4-cut-photo.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <ExportContainer>
      <Button onClick={() => handleExport('png')}>PNG 저장</Button>
      <Button onClick={() => handleExport('jpeg')}>JPEG 저장</Button>
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
`;

export default ExportButton;
