import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <UploadButton onClick={handleButtonClick}>
        <span role="img" aria-label="upload">📁</span> PNG 이미지 업로드
      </UploadButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const UploadButton = styled.button`
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }
`;

export default ImageUploader;
