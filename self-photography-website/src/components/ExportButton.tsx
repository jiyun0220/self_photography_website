import React from 'react';
import styled from '@emotion/styled';
import { toPng, toJpeg } from 'html-to-image';
import { theme } from '../styles/theme';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ targetRef }) => {
  const handleExport = async (format: 'png' | 'jpeg') => {
    if (!targetRef.current) return;

    try {
      const dataUrl = await (format === 'png' 
        ? toPng(targetRef.current)
        : toJpeg(targetRef.current));
      
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
      <Button onClick={() => handleExport('png')}>PNG로 저장</Button>
      <Button onClick={() => handleExport('jpeg')}>JPEG로 저장</Button>
    </ExportContainer>
  );
};

const ExportContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
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

export default ExportButton;
