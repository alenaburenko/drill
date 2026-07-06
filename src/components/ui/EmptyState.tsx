import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div
      className="py-10 text-center border-2 border-dashed rounded-xl flex flex-col items-center gap-2"
      style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
    >
      {icon && <span className="opacity-40">{icon}</span>}
      {title && <span className="text-sm font-bold">{title}</span>}
      <span className="text-sm italic">{description}</span>
    </div>
  );
};
