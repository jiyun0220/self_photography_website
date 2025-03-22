import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { FrameStyle, PhotoFilter, PRESET_COLORS } from '../types/types';

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
        <SectionTitle>프레임 색상</SectionTitle>
        <PresetColors>
          {Object.entries(PRESET_COLORS).map(([key, color]) => (
            <ColorPresetButton
              key={key}
              color={color}
              isSelected={frameStyle.color === color}
              onClick={() => onFrameStyleChange({ color })}
              aria-label={key}
            />
          ))}
        </PresetColors>
        <CustomColorWrapper>
          <CustomColorLabel>커스텀 색상</CustomColorLabel>
          <ColorInput
            type="color"
            value={frameStyle.color}
            onChange={(e) => onFrameStyleChange({ color: e.target.value })}
          />
        </CustomColorWrapper>
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
  border-radius: 8px;

  &:hover {
    background-color: ${props => props.isSelected ? theme.colors.primary : theme.colors.primaryLight};
    color: ${theme.colors.white};
  }
`;

const PresetColors = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ColorPresetButton = styled.button<{ color: string; isSelected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${props => props.color};
  border: ${props => props.isSelected ? '3px solid #000' : '1px solid #ddd'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.05)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CustomColorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
`;

const CustomColorLabel = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.text};
  flex: 1;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
  transition: transform 0.2s;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 1px solid ${theme.colors.border};
    border-radius: 4px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export default Controls;
