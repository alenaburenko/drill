import React from 'react';

interface CardProps {
  variant?: 'default' | 'accent' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<string, { bg: string; border: string }> = {
  default:  { bg: 'var(--bg-surface)', border: 'var(--border)' },
  accent:   { bg: 'rgba(249,115,22,0.04)', border: 'rgba(249,115,22,0.15)' },
  elevated: { bg: 'var(--bg-elevated)', border: 'var(--border)' },
};

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
  const s = variantStyles[variant];
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border ${paddingStyles[padding]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ background: s.bg, borderColor: s.border, ...style }}
    >
      {children}
    </div>
  );
};
