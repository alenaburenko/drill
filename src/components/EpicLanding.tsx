import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { RetroLogo } from './RetroLogo';
import { Lang } from '../i18n';
import { Play, Globe, Check } from 'lucide-react';

interface EpicLandingProps {
  lang: Lang;
  onSetLang: (lang: Lang) => void;
  onEnter: () => void;
  totalTasks: number;
}

// ─── Retro sound helper (local fallback) ─────────────────────────────────
function playRetroBeep(freq = 880, duration = 60, type: OscillatorType = 'square') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch { /* silent fail */ }
}

const LANDING_SOUNDS = {
  hover: () => playRetroBeep(600, 20, 'square'),
  click: () => playRetroBeep(660, 40, 'square'),
  launch: () => {
    playRetroBeep(880, 80, 'square');
    setTimeout(() => playRetroBeep(1200, 100, 'square'), 100);
    setTimeout(() => playRetroBeep(1760, 150, 'square'), 200);
  }
};

export function EpicLanding({ lang, onSetLang, onEnter, totalTasks }: EpicLandingProps) {
  const [skipIntro, setSkipIntro] = useState(() => {
    return localStorage.getItem('drill_skip_intro') === 'true';
  });

  // ─── Dynamic Font Injection ──────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // ─── Localized Texts ────────────────────────────────────────────────
  const t = useMemo(() => {
    return {
      uk: {
        eyebrow: 'ІНТЕРВАЛЬНІ ПОВТОРЕННЯ · МАЙСТЕРНІСТЬ КОДУ',
        titlePart1: 'опануй ',
        titlePart2: 'код',
        titlePart3: ' одна ',
        titlePart4: 'ітерація',
        titlePart5: ' за раз',
        subtitle: `${totalTasks}+ задач для розробників · 6-ступеневе прогресивне навчання · інтервальні повторення, що реально працюють`,
        launchBtn: 'ЗАПУСТИТИ ТРЕНАЖЕР',
        skipCheckbox: 'Пропускати інтро при наступному запуску',
        tasks: 'Задач',
        stages: 'Етапів навчання',
        retention: 'Утримання знань',
      },
      en: {
        eyebrow: 'SPACED REPETITION · CODE MASTERY',
        titlePart1: 'master ',
        titlePart2: 'code',
        titlePart3: ' one ',
        titlePart4: 'repetition',
        titlePart5: ' at a time',
        subtitle: `${totalTasks}+ developer tasks · 6-stage progressive learning · spaced repetition that actually sticks`,
        launchBtn: 'LAUNCH DRILL TRAINER',
        skipCheckbox: 'Skip intro next time',
        tasks: 'Tasks',
        stages: 'Learning Stages',
        retention: 'Avg. Retention',
      }
    }[lang];
  }, [lang, totalTasks]);

  const handleSkipToggle = () => {
    LANDING_SOUNDS.click();
    const nextVal = !skipIntro;
    setSkipIntro(nextVal);
    localStorage.setItem('drill_skip_intro', String(nextVal));
  };

  const handleLaunch = () => {
    LANDING_SOUNDS.launch();
    onEnter();
  };

  // ─── Mouse Movement Parallax Driver ──────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply springs for ultra smooth elastic movement
  const springConfig = { damping: 30, stiffness: 90 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  // Transform values for each depth level (top-level hooks)
  const x0 = useTransform(parallaxX, (v) => v * -0.1);
  const y0 = useTransform(parallaxY, (v) => v * -0.1);

  const x1 = useTransform(parallaxX, (v) => v * -0.25);
  const y1 = useTransform(parallaxY, (v) => v * -0.25);

  const x2 = useTransform(parallaxX, (v) => v * -0.5);
  const y2 = useTransform(parallaxY, (v) => v * -0.5);

  const x3 = useTransform(parallaxX, (v) => v * -0.8);
  const y3 = useTransform(parallaxY, (v) => v * -0.8);

  const x4 = useTransform(parallaxX, (v) => v * -1.0);
  const y4 = useTransform(parallaxY, (v) => v * -1.0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if touch device is used
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // range [-1, 1]
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // range [-1, 1]
      mouseX.set(x * 30); // max 30px offset
      mouseY.set(y * 30);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating particle characters
  const floatParticles = useMemo(() => {
    const chars = ['{ }', '[]', 'const', 'await', 'async', '⚡', '◆', '⬡', ';', '=>'];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      char: chars[i % chars.length],
      left: `${10 + (i * 7.5) + (i % 2 === 0 ? 3 : -3)}%`,
      top: `${15 + ((i * 7) % 65)}%`,
      scale: 0.8 + (i % 3) * 0.2,
      duration: 6 + (i % 4) * 2,
      delay: i * -0.5,
      depthFactor: 0.3 + (i % 3) * 0.2,
    }));
  }, []);

  return (
    <div
      className="min-h-screen relative w-full overflow-hidden flex flex-col justify-between p-6 select-none bg-[var(--bg-base)] crt-curve"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {/* Vignette & scanline sweeps (Depth 5 foreground overlays) */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-50" style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          )
        `
      }} />

      {/* Header bar (UI layer) */}
      <header className="relative z-40 flex justify-between items-center w-full max-w-7xl mx-auto py-2">
        <div className="flex items-center gap-3">
          <RetroLogo size="sm" variant="animated" />
          <span className="text-[10px] font-black tracking-widest text-[var(--neon-magenta)] uppercase drop-shadow-[0_0_8px_rgba(255,0,255,0.4)]">
            Drill Engine v2.0
          </span>
        </div>

        <button
          onClick={() => {
            LANDING_SOUNDS.click();
            onSetLang(lang === 'uk' ? 'en' : 'uk');
          }}
          className="flex items-center gap-2 text-[9px] uppercase tracking-widest px-3 py-1.5 border border-[#2a0040] hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] transition-all bg-[var(--bg-surface)] cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === 'uk' ? '🤘 UA' : '🇬🇧 EN'}
        </button>
      </header>

      {/* ─── DEPTH 0: Far Background Cyber Grid ─── */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          x: x0,
          y: y0,
        }}
      />

      {/* ─── DEPTH 1: Glow / Atmosphere Blobs ─── */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
        style={{
          x: x1,
          y: y1,
        }}
      >
        <div className="glow-blob absolute w-[550px] h-[550px] rounded-full blur-[90px] mix-blend-screen opacity-[0.16] bg-[radial-gradient(circle,var(--neon-cyan)_0%,transparent_70%)] animate-[float-breathe_10s_ease-in-out_infinite]" />
        <div className="glow-blob absolute w-[400px] h-[400px] rounded-full blur-[80px] mix-blend-screen opacity-[0.12] bg-[radial-gradient(circle,var(--neon-magenta)_0%,transparent_70%)] animate-[float-breathe_12s_ease-in-out_infinite_1.5s]" />
      </motion.div>

      {/* ─── DEPTH 2: Mid Decorations (Floating code blocks) ─── */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          x: x2,
          y: y2,
        }}
      >
        {floatParticles.map(p => (
          <div
            key={p.id}
            className="absolute font-mono text-flicker pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              scale: p.scale,
              color: p.id % 2 === 0 ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
              opacity: 0.1 + (p.id % 3) * 0.05,
              filter: `drop-shadow(0 0 6px ${p.id % 2 === 0 ? 'rgba(0,240,255,0.4)' : 'rgba(255,0,255,0.4)'})`,
              animation: `float-orbit ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          >
            {p.char}
          </div>
        ))}
      </motion.div>

      {/* ─── DEPTH 3: Main Object (Central Floating Core) ─── */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
        style={{
          x: x3,
          y: y3,
        }}
      >
        <div className="relative flex flex-col items-center justify-center mt-[-100px] pointer-events-auto">
          {/* Neon Logo wrapper with hover pulse and float */}
          <div className="relative animate-[float-orbit_8s_ease-in-out_infinite] cursor-pointer group">
            {/* Ambient aura glow behind the logo */}
            <div className="absolute inset-[-40px] rounded-full blur-[30px] opacity-20 bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-magenta)] group-hover:opacity-40 transition-all duration-300" />
            
            <RetroLogo size="xl" variant="animated" />
          </div>
        </div>
      </motion.div>

      {/* ─── DEPTH 4: UI / Text Content ─── */}
      <motion.div
        className="relative z-40 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-auto mb-10 pointer-events-auto"
        style={{
          x: x4,
          y: y4,
        }}
      >
        {/* Eyebrow tag */}
        <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] mb-4 text-[var(--neon-magenta)] drop-shadow-[0_0_8px_rgba(255,0,255,0.3)]">
          <span className="w-1.5 h-1.5 bg-[var(--neon-magenta)] rounded-full animate-ping" />
          {t.eyebrow}
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-[#e8e8e8] max-w-2xl mb-4">
          &gt; {t.titlePart1}
          <span className="text-[var(--neon-cyan)] drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            {t.titlePart2}
          </span>
          {t.titlePart3}
          <span 
            className="italic font-normal text-[var(--neon-magenta)] drop-shadow-[0_0_12px_rgba(255,0,255,0.3)]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {t.titlePart4}
          </span>
          {t.titlePart5}
        </h1>

        {/* Subtext description */}
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xl mb-8 font-mono">
          {t.subtitle}
        </p>

        {/* CTA Launch Button */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleLaunch}
            onMouseEnter={LANDING_SOUNDS.hover}
            className="relative group flex items-center justify-center gap-3 px-10 py-5 text-xs font-black uppercase tracking-[0.2em] border-2 border-[var(--neon-cyan)] bg-[rgba(0,240,255,0.05)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.18)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transform hover:scale-[1.03] active:scale-[0.97]"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>{t.launchBtn}</span>
          </button>

          {/* Skip setting */}
          <label 
            className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer select-none py-1"
          >
            <input 
              type="checkbox" 
              checked={skipIntro} 
              onChange={handleSkipToggle} 
              className="sr-only"
            />
            <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${skipIntro ? 'border-[var(--neon-green)] bg-[rgba(0,255,65,0.05)]' : 'border-[var(--border)] bg-[var(--bg-surface)]'}`}>
              {skipIntro && <Check className="w-2.5 h-2.5 text-[var(--neon-green)]" />}
            </div>
            <span>{t.skipCheckbox}</span>
          </label>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 pt-6 border-t border-[#2a0040]/60 w-full max-w-xl">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-lg sm:text-2xl font-black text-[var(--neon-cyan)] drop-shadow-[0_0_10px_rgba(0,240,255,0.25)]">
              {totalTasks}+
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[var(--text-muted)]">
              {t.tasks}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-lg sm:text-2xl font-black text-[var(--neon-magenta)] drop-shadow-[0_0_10px_rgba(255,0,255,0.2)]">
              {totalTasks > 500 ? '6' : '6'}
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[var(--text-muted)]">
              {t.stages}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-lg sm:text-2xl font-black text-[var(--neon-green)] drop-shadow-[0_0_10px_rgba(0,255,65,0.25)]">
              85%
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[var(--text-muted)]">
              {t.retention}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Corner Terminal Cursor decoration (Depth 5) */}
      <div className="fixed bottom-4 right-4 z-40 text-xs text-[var(--neon-cyan)] opacity-20 pointer-events-none animate-[cursor-blink_0.8s_steps(1)_infinite]">
        ▌
      </div>
    </div>
  );
}
