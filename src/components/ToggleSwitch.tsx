import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <div onClick={() => onChange(!checked)} className="flex items-center gap-2.5 cursor-pointer select-none group">
    <span
      className="text-[11px] font-bold tracking-wider uppercase transition-colors group-hover:text-[var(--text-primary)]"
      style={{ color: 'var(--text-secondary)' }}
    >
      {label}
    </span>
    <div
      className="w-9 h-5 rounded-full p-0.5 transition-all duration-200"
      style={{
        background: checked ? 'var(--accent)' : 'var(--bg-elevated)',
        boxShadow: checked ? '0 0 8px var(--accent-glow)' : 'none',
        border: checked ? 'none' : '1px solid var(--border)',
      }}
    >
      <div
        className={`w-3.5 h-3.5 rounded-full transition-transform duration-200 ease-in-out transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
        style={{
          background: checked ? '#000' : 'var(--text-muted)',
        }}
      />
    </div>
  </div>
);
