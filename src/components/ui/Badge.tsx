import React from 'react';

interface BadgeProps {
  variant?: 'accent' | 'difficulty' | 'stage' | 'stage-mastered' | 'stage-active' | 'danger' | 'success' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

const variantMap: Record<string, string> = {
  accent:         'badge-retro-cyan',
  difficulty:     '',
  stage:          'badge-retro-amber',
  'stage-mastered': 'badge-retro-green',
  'stage-active': 'badge-retro-cyan',
  danger:         'badge-retro-red',
  success:        'badge-retro-green',
  info:           'badge-retro-magenta',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-3 py-1',
};

const sizeFont: Record<string, number> = {
  sm: 12,
  md: 13,
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'accent',
  size = 'sm',
  className = '',
  children,
}) => {
  return (
    <span className={`badge-retro ${variantMap[variant]} ${sizeStyles[size]} ${className}`} style={{ fontSize: sizeFont[size] }}>
      {children}
    </span>
  );
};
