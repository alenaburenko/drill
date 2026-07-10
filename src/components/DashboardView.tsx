import React, { useMemo } from 'react';
import { DrillTask, UserProgress } from '../types';
import { getT, Lang } from '../i18n';
import { diffBadge } from '../utils/badges';
import {
  getTaskProgress,
  getNewTasks,
  getDueRepetitions,
  getMasteredTasks,
  getInProgressTasks,
  pickNextTask,
  getStats,
} from '../utils/taskProgress';
import { Button, Card, Badge, SectionHeader, EmptyState, StatCard, ProgressBar } from './ui';
import {
  Play, Clock, ChevronRight, Layers, TrendingUp,
  Sparkles, AlertCircle
} from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/achievements';
import { ActivityHeatmap } from './ActivityHeatmap';

interface DashboardViewProps {
  allTasks: DrillTask[];
  progressMap: Record<string, UserProgress>;
  customTasks: DrillTask[];
  lang: Lang;
  unlockedIds: string[];
  onSelectTask: (id: string) => void;
  onSetActiveTab: (tab: 'dashboard' | 'catalog' | 'upload' | 'backup') => void;
  activeTab: 'dashboard' | 'catalog' | 'upload' | 'backup';
}

// ─── Retro sound system (shared) ──────────────────────────────────────
function playBeep(freq = 880, duration = 60, type: OscillatorType = 'square') {
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

export default function DashboardView({
  allTasks, progressMap, customTasks, lang, unlockedIds, onSelectTask, onSetActiveTab, activeTab,
}: DashboardViewProps) {
  const t = getT(lang);

  const newTasks = useMemo(() => getNewTasks(allTasks, progressMap), [allTasks, progressMap]);
  const dueRepetitions = useMemo(() => getDueRepetitions(allTasks, progressMap), [allTasks, progressMap]);
  const masteredTasks = useMemo(() => getMasteredTasks(allTasks, progressMap), [allTasks, progressMap]);
  const inProgressTasks = useMemo(() => getInProgressTasks(allTasks, progressMap), [allTasks, progressMap]);

  const handleContinuePractice = () => {
    const next = pickNextTask(dueRepetitions, inProgressTasks, progressMap, newTasks, allTasks);
    if (next) {
      playBeep(880, 40, 'square');
      setTimeout(() => playBeep(1100, 50, 'square'), 50);
      onSelectTask(next);
    }
  };

  const stats = useMemo(() => getStats(progressMap, allTasks, masteredTasks), [progressMap, allTasks, masteredTasks]);

  // Retro-style floating unicode characters for hero
  const glitchChars = useMemo(() => ['⚡', '✦', '◆', '▶', '⬡', '◈', '▣', '◉', '◆', '✦', '▶', '△'], []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Left column */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {/* Hero CTA — Retro Game */}
        <Card variant="accent" className="min-h-[280px] relative overflow-hidden" padding="lg">
          {/* Glitch background */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 40px, var(--neon-cyan) 40px, var(--neon-cyan) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, var(--neon-magenta) 40px, var(--neon-magenta) 41px)
            `
          }} />

          {/* Floating glitch symbols */}
          {glitchChars.slice(0, 8).map((ch, i) => (
            <div
              key={i}
              className="absolute font-mono"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${20 + ((i * 7) % 60)}%`,
                fontSize: `${8 + (i % 3) * 4}px`,
                color: i % 2 === 0 ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
                opacity: 0.12,
                animation: `particle-float ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite alternate`,
                transform: `rotate(${i * 15}deg)`,
              }}
            >
              {ch}
            </div>
          ))}

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] mb-3 hero-glitch-in" style={{ color: 'var(--neon-magenta)', fontFamily: 'var(--font-mono)' }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-flicker-magenta">{t.personalQueue}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight max-w-md leading-snug hero-glitch-in" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--neon-cyan)' }}>&gt; </span>
              {t.trainerReady}
              <span className="cursor-blink" />
            </h2>
            <p className="text-xs mt-3 max-w-lg leading-relaxed font-mono hero-glitch-in" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-bold" style={{ color: 'var(--neon-cyan)' }}>{t.scheduledRepetitions(dueRepetitions.length)}</span>{' '}
              <span className="font-bold" style={{ color: 'var(--neon-green)' }}>{t.availableNewTasks(newTasks.length)}</span>.
            </p>
          </div>

          <div className="hero-glitch-in" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinuePractice}
              className="relative z-10 mt-6 self-start flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {t.continuePractice}
            </Button>
          </div>
        </Card>

        {/* Activity Heatmap */}
        <ActivityHeatmap progressMap={progressMap} lang={lang} />

        {/* Due repetitions */}
        <Card padding="md">
          <SectionHeader
            icon={<Clock className="w-4 h-4" />}
            title={`${t.repetitionQueue} (${dueRepetitions.length})`}
            subtitle={t.intervalSchedule}
          />
          {dueRepetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-enter">
              {dueRepetitions.slice(0, 4).map(task => {
                const prog = getTaskProgress(progressMap, task.id);
                return (
                  <Card key={task.id} variant="elevated" padding="md" onClick={() => { playBeep(660, 30, 'square'); onSelectTask(task.id); }}
                    className="group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                        {task.block} · {task.difficulty}
                      </span>
                      <Badge variant="danger" size="sm">
                        STAGE {prog.learningStage}
                      </Badge>
                    </div>
                    <h4 className="text-xs font-bold truncate transition-colors group-hover:text-[var(--neon-cyan)]">{task.title}</h4>
                    <div className="text-[9px] font-bold flex items-center gap-1 mt-2" style={{ color: 'var(--neon-cyan)' }}>
                      <span>&gt; {t.startPractice}</span>
                      <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState description={t.noRepetitions} />
          )}
        </Card>

        {/* New tasks */}
        <Card padding="md">
          <SectionHeader
            icon={<Layers className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />}
            title={`${t.newTasks} (${newTasks.length})`}
            action={
              <button onClick={() => onSetActiveTab('catalog')} className="text-[9px] font-bold font-mono uppercase tracking-wider transition-colors hover:underline" style={{ color: 'var(--neon-cyan)' }}>
                {t.viewAll}
              </button>
            }
          />
          <div className="space-y-2 stagger-enter">
            {newTasks.slice(0, 5).map(task => (
              <Card key={task.id} variant="elevated" padding="sm" onClick={() => { playBeep(660, 30, 'square'); onSelectTask(task.id); }}
                className="flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3 truncate">
                  <span className="w-2 h-2 shrink-0" style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px rgba(0,255,65,0.5)' }} />
                  <div className="truncate">
                    <h4 className="text-xs font-bold truncate transition-colors group-hover:text-[var(--neon-cyan)]">{task.title}</h4>
                    <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{task.block}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="accent" size="sm" className={diffBadge(task.difficulty)}>{task.difficulty}</Badge>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Right sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card padding="md">
          <SectionHeader icon={<TrendingUp className="w-4 h-4" />} title={t.yourProgress} />
          <div className="space-y-5">
            <div>
              <ProgressBar value={masteredTasks.length} max={allTasks.length} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: inProgressTasks.length, label: t.inLearning, color: 'var(--neon-cyan)' },
                { val: `${stats.accuracy}%`, label: t.testAccuracy, color: 'var(--neon-green)' },
              ].map(({ val, label, color }) => (
                <StatCard key={label} value={val} label={label} color={color} />
              ))}
            </div>
            <div className="p-3 rounded-sm flex items-center justify-between text-[10px] font-mono border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t.totalPeeks}</span>
              <span className="font-bold" style={{ color: 'var(--neon-amber)' }}>{t.peeksTimes(stats.totalPeeks)}</span>
            </div>
          </div>
        </Card>

        {/* Achievements board */}
        <Card padding="md">
          <SectionHeader
            icon={<span className="text-sm">🏆</span>}
            title={lang === 'uk' ? `Досягнення (${unlockedIds.length}/${ACHIEVEMENTS.length})` : `Achievements (${unlockedIds.length}/${ACHIEVEMENTS.length})`}
          />
          <div className="grid grid-cols-6 gap-2 pt-2">
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = unlockedIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  title={lang === 'uk' ? `${ach.titleUk}: ${ach.descUk}` : `${ach.titleEn}: ${ach.descEn}`}
                  className={`h-11 rounded-sm border flex items-center justify-center text-xl transition-all duration-300 relative group cursor-pointer ${
                    isUnlocked
                      ? 'border-[var(--neon-magenta)] bg-[rgba(255,0,255,0.04)] shadow-[0_0_8px_rgba(255,0,255,0.15)] opacity-100 hover:scale-105'
                      : 'border-dashed border-[var(--border)] bg-transparent opacity-30 hover:opacity-50'
                  }`}
                >
                  <span>{ach.icon}</span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 bg-[var(--bg-elevated)] border border-[var(--border)] p-2 rounded-sm text-[9px] font-mono leading-normal w-48 shadow-xl -translate-x-1/2 left-1/2 pointer-events-none">
                    <div className={`font-bold uppercase tracking-wider mb-1 ${isUnlocked ? 'text-[var(--neon-magenta)]' : 'text-[var(--text-muted)]'}`}>
                      {lang === 'uk' ? (isUnlocked ? 'Розблоковано' : 'Заблоковано') : (isUnlocked ? 'Unlocked' : 'Locked')}
                    </div>
                    <div className="text-[var(--text-primary)] font-bold mb-0.5">
                      {lang === 'uk' ? ach.titleUk : ach.titleEn}
                    </div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'uk' ? ach.descUk : ach.descEn}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card variant="accent" padding="md">
          <SectionHeader icon={<AlertCircle className="w-4 h-4" />} title={t.howItWorks} color="var(--neon-magenta)" />
          <div className="space-y-3 text-[11px] leading-relaxed font-mono">
            <p style={{ color: 'var(--text-secondary)' }}>{t.howDesc}</p>
            <ul className="space-y-1.5 list-none" style={{ color: 'var(--text-secondary)' }}>
              {t.stages.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono font-bold shrink-0" style={{ color: 'var(--neon-cyan)' }}>{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 border-t text-[10px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{t.howNote}</p>
          </div>
        </Card>
      </div>

    </div>
  );
};
