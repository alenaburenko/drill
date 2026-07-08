import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color }) => {
  return (
    <div
      className="card-retro rounded-[var(--radius-md)] p-4 text-center stat-value-pop"
      style={{ borderColor: 'var(--border)' }}
    >
      <div
        className="text-xl font-mono font-bold"
        style={{ color: color || 'var(--neon-cyan)' }}
      >
        {value}
      </div>
      <div
        className="text-[8px] uppercase tracking-widest mt-1.5 font-mono"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </div>
    </div>
  );
};
