import React from 'react';

interface BadgeProps {
  variant?: 'accent' | 'difficulty' | 'stage' | 'stage-mastered' | 'stage-active' | 'danger' | 'success' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  accent: 'bg-[rgba(249,115,22,0.12)] text-[var(--accent)]',
  difficulty: '',  // uses diffBadge classname via className prop
  stage: 'bg-orange-950/60 text-orange-400 border border-orange-800/60',
  'stage-mastered': 'bg-green-950/60 text-green-400 border border-green-800/60',
  'stage-active': 'bg-red-950/60 text-red-400 border border-red-800/40',
  danger: 'bg-red-950/60 text-red-400 border border-red-800/40',
  success: 'bg-green-950/40 border-green-800/50 text-green-400',
  info: '',
};

const sizeStyles: Record<string, string> = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-[10px] px-2 py-1',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'accent',
  size = 'sm',
  className = '',
  children,
}) => {
  const base = 'font-bold uppercase tracking-wider rounded-md font-mono';
  return (
    <span className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
