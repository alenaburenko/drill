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
    <div className="section-header">
      <h3 style={{ color: color || 'var(--text-secondary)' }}>
        {icon && (
          <span style={{ color: color || 'var(--neon-cyan)' }}>{icon}</span>
        )}
        {title}
      </h3>
      <div className="flex items-center gap-3">
        {subtitle && (
          <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
        {action}
      </div>
    </div>
  );
};
