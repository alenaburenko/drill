import React from 'react';

interface ProgressBarProps {
  value: number;   // current value
  max: number;     // maximum value
  showLabel?: boolean;
  className?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  showLabel = true,
  className = '',
  color,
}) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>{value} / {max}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: color ? undefined : undefined }}
        />
      </div>
    </div>
  );
};
