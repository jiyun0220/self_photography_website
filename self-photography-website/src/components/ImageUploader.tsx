import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png')) {
      alert('PNG 파일만 업로드 가능합니다.');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onImageUpload(imageUrl);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container>
      <Label>
        PNG 이미지 업로드
        <Input
          type="file"
          accept=".png"
          onChange={handleImageUpload}
          disabled={isLoading}
        />
      </Label>
      {isLoading && (
        <LoadingMessage>
          이미지를 불러오는 중입니다...
        </LoadingMessage>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px dashed ${theme.colors.primary};
  border-radius: 8px;
  background-color: ${theme.colors.background};
`;

const Label = styled.label`
  background-color: ${theme.colors.primary};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Input = styled.input`
  display: none;
`;

const LoadingMessage = styled.div`
  color: ${theme.colors.primary};
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem;
`;

export default ImageUploader;
