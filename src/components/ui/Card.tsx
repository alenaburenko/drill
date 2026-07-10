import React from 'react';

interface CardProps {
  variant?: 'default' | 'accent' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}

const paddingStyles: Record<string, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  onClick,
  children,
}) => {
  const retroClass = variant === 'accent' ? 'card-retro-accent' : 'card-retro';

  return (
    <div
      onClick={onClick}
      className={`rounded-[var(--radius-lg)] ${paddingStyles[padding]} ${onClick ? 'cursor-pointer' : ''} ${retroClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
