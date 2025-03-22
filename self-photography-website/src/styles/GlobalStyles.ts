import { css } from '@emotion/react';

export const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    background: #fef6ff;
    color: #2c2c2c;
  }

  button {
    font-family: inherit;
    border: none;
    cursor: pointer;
    background: none;
    font-size: inherit;
  }

  input {
    font-family: inherit;
  }
`;

export const theme = {
  colors: {
    primary: '#FF69B4',
    primaryLight: '#FFB6C1',
    primaryDark: '#FF1493',
    secondary: '#FFD700',
    background: '#fef6ff',
    text: '#2c2c2c',
    lightText: '#757575',
    border: '#e0e0e0',
    white: '#ffffff',
  },
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
    large: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  }
};
