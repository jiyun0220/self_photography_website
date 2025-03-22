import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { FrameStyle, PhotoFilter } from '../types/types';

interface ControlsProps {
  frameStyle: FrameStyle;
  onFrameStyleChange: (style: Partial<FrameStyle>) => void;
}

const filters: PhotoFilter[] = ['normal', 'grayscale', 'sepia', 'vintage', 'warm', 'cool'];
const colors = ['#000000', '#FFFFFF', '#FF69B4', '#4169E1', '#FFD700', '#98FB98'];

const Controls: React.FC<ControlsProps> = ({ frameStyle, onFrameStyleChange }) => {
  return (
    <ControlsContainer>
      <Section>
        <SectionTitle>필터 선택</SectionTitle>
        <FilterGrid>
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              $isSelected={frameStyle.filter === filter}
              onClick={() => onFrameStyleChange({ filter })}
            >
              {getFilterName(filter)}
            </FilterButton>
          ))}
        </FilterGrid>
      </Section>

      <Section>
        <SectionTitle>프레임 색상</SectionTitle>
        <ColorGrid>
          {colors.map((color) => (
            <ColorButton
              key={color}
              $color={color}
              $isSelected={frameStyle.color === color}
              onClick={() => onFrameStyleChange({ color })}
            />
          ))}
        </ColorGrid>
      </Section>
    </ControlsContainer>
  );
};

const getFilterName = (filter: PhotoFilter): string => {
  switch (filter) {
    case 'normal':
      return '기본';
    case 'grayscale':
      return '흑백';
    case 'sepia':
      return '세피아';
    case 'vintage':
      return '빈티지';
    case 'warm':
      return '따뜻한';
    case 'cool':
      return '차가운';
    default:
      return filter;
  }
};

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: ${theme.colors.text};
  margin: 0;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ $isSelected: boolean }>`
  padding: 0.5rem;
  border: 2px solid ${props => props.$isSelected ? theme.colors.primary : 'transparent'};
  border-radius: 4px;
  background: ${props => props.$isSelected ? theme.colors.primaryLight : theme.colors.background};
  color: ${props => props.$isSelected ? theme.colors.primary : theme.colors.text};
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.primaryLight};
    border-color: ${theme.colors.primary};
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const ColorButton = styled.button<{ $color: string; $isSelected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  background-color: ${props => props.$color};
  border: 2px solid ${props => props.$isSelected ? theme.colors.primary : 'transparent'};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export default Controls;
