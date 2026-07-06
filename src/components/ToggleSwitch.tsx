import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <div onClick={() => onChange(!checked)} className="flex items-center gap-2.5 cursor-pointer select-none group">
    <span className="text-[11px] font-bold tracking-wider uppercase transition-colors group-hover:text-[var(--text-primary)]" style={{ color: 'var(--text-secondary)' }}>
      {label}
    </span>
    <div className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${
      checked ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-[#18181b] border border-[#2d2d30]'
    }`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-[#e4e4e7] transition-transform duration-200 ease-in-out transform ${
        checked ? 'translate-x-4 bg-white' : 'translate-x-0'
      }`} />
    </div>
  </div>
);
