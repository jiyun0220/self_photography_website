import React from 'react';
import styled from '@emotion/styled';
import { Photo } from '../types/types';
import { theme } from '../styles/theme';
import html2canvas from 'html2canvas';

interface ExportButtonProps {
  photos: (Photo | null)[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ photos }) => {
  const handleExport = async (format: 'png' | 'jpeg') => {
    const photoElements = document.querySelectorAll('.photo-cell');
    if (!photoElements.length || !photos.some(photo => photo)) return;

    try {
      const canvas = await html2canvas(photoElements[0].parentElement as HTMLElement);
      const dataUrl = format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg');
      
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
