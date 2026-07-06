import React from 'react';

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  color?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  action,
  color,
}) => {
  return (
    <div
      className="flex items-center justify-between mb-4 pb-3 border-b"
      style={{ borderColor: 'var(--border-muted)' }}
    >
      <h3
        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        style={{ color: color || 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
      >
        {icon && (
          <span style={{ color: color || 'var(--accent)' }}>{icon}</span>
        )}
        {title}
      </h3>
      {subtitle && (
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {subtitle}
        </span>
      )}
      {action}
    </div>
  );
};
