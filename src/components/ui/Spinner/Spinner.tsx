import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'secondary' | 'white' | 'success';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: '14px',
  sm: '20px',
  md: '32px',
  lg: '48px',
};

const colorMap: Record<SpinnerColor, string> = {
  primary: 'var(--accent-primary)',
  secondary: 'var(--accent-secondary)',
  white: '#ffffff',
  success: 'var(--accent-success)',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label = 'Chargement...',
  className = '',
  style,
}) => {
  const dim = sizeMap[size];
  const borderColor = colorMap[color];

  return (
    <span
      role="status"
      aria-label={label}
      className={className}
      style={{
        display: 'inline-block',
        width: dim,
        height: dim,
        border: `2.5px solid rgba(255,255,255,0.1)`,
        borderTopColor: borderColor,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

export default Spinner;
