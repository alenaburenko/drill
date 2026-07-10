import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-5 py-2.5',
  lg: 'px-8 py-3.5',
};

const sizeFont: Record<string, number> = {
  sm: 13,
  md: 14,
  lg: 16,
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
  const retroClass =
    variant === 'primary'
      ? 'btn-retro'
      : variant === 'success'
        ? 'btn-retro btn-retro-green'
        : variant === 'danger'
          ? 'btn-retro btn-retro-magenta'
          : variant === 'secondary'
            ? 'btn-retro border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] hover:shadow-none hover:scale-100'
            : 'btn-retro border-none text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:bg-transparent hover:shadow-none hover:scale-100';

  return (
    <button
      className={[retroClass, sizeStyles[size], className].filter(Boolean).join(' ')}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: sizeFont[size],
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
