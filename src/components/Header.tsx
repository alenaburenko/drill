import React from 'react';
import { RetroLogo } from './RetroLogo';
import { Palette, Tv } from 'lucide-react';

type Theme = 'cyberpunk' | 'matrix' | 'amber' | 'dracula' | 'ice';
type Tab = 'dashboard' | 'catalog' | 'upload' | 'backup';

interface HeaderProps {
  lang: 'uk' | 'en';
  theme: Theme;
  crtActive: boolean;
  activeTab: Tab;
  taskCount: number;
  onToggleLang: () => void;
  onCycleTheme: () => void;
  onToggleCrt: () => void;
  onTabClick: (tab: Tab) => void;
  t: Record<string, any>;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  theme,
  crtActive,
  activeTab,
  taskCount,
  onToggleLang,
  onCycleTheme,
  onToggleCrt,
  onTabClick,
  t,
}) => {
  const themes: Theme[] = ['cyberpunk', 'matrix', 'amber', 'dracula', 'ice'];

  const tabLabels: Record<string, string> = {
    dashboard: t.navTrainer || 'Dashboard',
    catalog: `${t.navCatalog || 'Catalog'} (${taskCount})`,
    upload: t.navUpload || 'Upload',
    backup: t.navProgress || 'Progress',
  };

  return (
    <header
      className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between border-b glitch-spasm-rare"
      style={{ background: 'rgba(13,0,21,0.85)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-4">
        <RetroLogo size="md" />
        <div>
          <h1
            className="text-base font-bold tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span style={{ color: 'var(--neon-cyan)', textShadow: '0 0 8px rgba(0,240,255,0.4)' }}>{'>'} </span>
            <span className="text-flicker">{t.appTitle}</span>
            <span className="badge-retro badge-retro-magenta text-[7px] px-2 py-0.5 bounce-8bit">{t.appBadge}</span>
          </h1>
          <p
            className="text-[9px] mt-0.5 tracking-wider"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {t.appSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language switcher */}
        <button
          onClick={onToggleLang}
          className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
          style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          title="Switch language"
        >
          {lang === 'uk' ? '🤘 UA' : '🇬🇧 EN'}
        </button>

        {/* Theme switcher */}
        <button
          onClick={onCycleTheme}
          className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] flex items-center gap-1.5 cursor-pointer"
          style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          title="Switch theme"
        >
          <Palette className="w-3.5 h-3.5" />
          {theme}
        </button>

        {/* CRT toggle */}
        <button
          onClick={onToggleCrt}
          className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all flex items-center gap-1.5 cursor-pointer ${crtActive ? 'border-[var(--neon-green)] text-[var(--neon-green)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]'}`}
          style={{ background: 'transparent' }}
          title="Toggle CRT Screen Curve & Scanlines"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>CRT: {crtActive ? 'ON' : 'OFF'}</span>
        </button>

        {/* Nav tabs */}
        <nav
          className="flex items-center gap-0 p-0.5 border"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {(['dashboard', 'catalog', 'upload', 'backup'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => onTabClick(tab)}
              className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all font-mono"
              style={
                activeTab === tab
                  ? { background: 'var(--neon-cyan)', color: '#000' }
                  : { color: 'var(--text-secondary)', background: 'transparent' }
              }
            >
              {tabLabels[tab]}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
