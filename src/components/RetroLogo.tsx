import React from 'react';

interface RetroLogoProps {
  size?: 'sm' | 'md' | 'xl';
  variant?: 'animated';
}

export const RetroLogo: React.FC<RetroLogoProps> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 0.6 : 0.9;
  const w = Math.round(64 * scale);
  const h = Math.round(64 * scale);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      className="shrink-0"
      style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.3))' }}
    >
      <style>{`
        .l-c { fill: #00f0ff; }
      `}</style>
      {/* Simplified D — just the letter, no cursor */}
      <rect className="l-c" x="8" y="12" width="6" height="32"/>
      <rect className="l-c" x="14" y="14" width="4" height="2"/>
      <rect className="l-c" x="14" y="36" width="4" height="2"/>
      <rect className="l-c" x="18" y="16" width="4" height="2"/>
      <rect className="l-c" x="18" y="34" width="4" height="2"/>
      <rect className="l-c" x="22" y="18" width="4" height="2"/>
      <rect className="l-c" x="22" y="32" width="4" height="2"/>
      <rect className="l-c" x="26" y="20" width="4" height="2"/>
      <rect className="l-c" x="26" y="28" width="4" height="4"/>
    </svg>
  );
};
