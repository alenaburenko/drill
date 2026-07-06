import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'font-bold transition-all active:scale-95 btn-glow',
  success:
    'font-bold transition-all active:scale-95 btn-glow',
  secondary:
    'font-bold transition-all border active:scale-95',
  ghost:
    'font-bold transition-all rounded-lg hover:opacity-80',
  danger:
    'font-bold transition-all border active:scale-95',
};

const sizeStyles: Record<string, string> = {
  sm:  'text-[11px] px-3 py-1.5 rounded-lg',
  md:  'text-xs px-4 py-2.5 rounded-xl',
  lg:  'text-sm px-7 py-3.5 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  style,
  children,
  ...props
}) => {
  const baseStyle: React.CSSProperties =
    variant === 'primary' ? { background: 'var(--accent)', color: '#000' } :
    variant === 'success' ? { background: 'var(--green)', color: '#000' } :
    variant === 'secondary' ? { background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' } :
    variant === 'danger' ? { background: 'transparent', borderColor: 'var(--red)', color: 'var(--red)' } :
    { background: 'transparent', color: 'var(--text-secondary)' };

  return (
    <button
      className={[variantStyles[variant], sizeStyles[size], glow ? 'btn-glow' : '', className].filter(Boolean).join(' ')}
      style={{ ...baseStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};
