import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, color }) => {
  return (
    <div
      className="rounded-xl p-4 text-center border"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
    >
      <div
        className="text-2xl font-mono font-bold"
        style={{ color: color || 'var(--accent)' }}
      >
        {value}
      </div>
      <div
        className="text-[9px] uppercase tracking-wider mt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </div>
    </div>
  );
};
