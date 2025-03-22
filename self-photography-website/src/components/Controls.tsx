import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { FrameStyle, PhotoFilter } from '../types/types';

interface ControlsProps {
  frameStyle: FrameStyle;
  onFrameStyleChange: (style: Partial<FrameStyle>) => void;
}

const filters: PhotoFilter[] = ['normal', 'grayscale', 'vintage', 'warm', 'cool', 'white'];

const Controls: React.FC<ControlsProps> = ({ frameStyle, onFrameStyleChange }) => {
  return (
    <Container>
      <Section>
        <SectionTitle>필터</SectionTitle>
        <FilterList>
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              isSelected={frameStyle.filter === filter}
              onClick={() => onFrameStyleChange({ filter })}
            >
              {getFilterEmoji(filter)} {getFilterName(filter)}
            </FilterButton>
          ))}
        </FilterList>
      </Section>
      <Section>
        <SectionTitle>색상</SectionTitle>
        <ColorInput
          type="color"
          value={frameStyle.color}
          onChange={(e) => onFrameStyleChange({ color: e.target.value })}
        />
      </Section>
    </Container>
  );
};

const getFilterName = (filter: PhotoFilter): string => {
  switch (filter) {
    case 'normal':
      return '기본';
    case 'grayscale':
      return '흑백';
    case 'vintage':
      return '빈티지';
    case 'warm':
      return '따뜻한';
    case 'cool':
      return '시원한';
    case 'white':
      return '화이트';
    default:
      return filter;
  }
};

const getFilterEmoji = (filter: PhotoFilter): string => {
  switch (filter) {
    case 'normal':
      return '🌟';
    case 'grayscale':
      return '🖤';
    case 'vintage':
      return '🎞️';
    case 'warm':
      return '🌅';
    case 'cool':
      return '❄️';
    case 'white':
      return '✨';
    default:
      return '✨';
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
`;

const FilterButton = styled.button<{ isSelected: boolean }>`
  padding: 0.8rem;
  background-color: ${props => props.isSelected ? theme.colors.primary : theme.colors.white};
  color: ${props => props.isSelected ? theme.colors.white : theme.colors.text};
  border: 1px solid ${theme.colors.primary};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.isSelected ? theme.colors.primary : theme.colors.primaryLight};
    color: ${theme.colors.white};
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0.5rem;
  border: 1px solid ${theme.colors.primary};
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
  }
`;

export default Controls;
