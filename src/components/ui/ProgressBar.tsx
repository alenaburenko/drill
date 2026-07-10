import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, showLabel = true, className = '', color }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const barColor = color || 'var(--neon-cyan)';
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-[10px] mb-1.5 font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>
            {value} / {max}
          </span>
          <span style={{ color: barColor }}>{pct}%</span>
        </div>
      )}
      <div className="progress-retro-track">
        <div
          className="progress-retro-fill"
          style={{
            width: `${pct}%`,
            backgroundImage: color
              ? `repeating-linear-gradient(90deg, ${color} 0px, ${color} 4px, ${color}88 4px, ${color}88 8px)`
              : undefined,
          }}
        />
      </div>
    </div>
  );
};
