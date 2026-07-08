import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div
      className="py-10 text-center flex flex-col items-center gap-2"
      style={{ color: 'var(--text-muted)' }}
    >
      {icon && <span className="opacity-40 font-mono">{icon}</span>}
      {title && <span className="text-xs font-bold font-mono uppercase">{title}</span>}
      <span className="text-xs font-mono italic opacity-70">{description}</span>
    </div>
  );
};
