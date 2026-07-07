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

interface DashboardViewProps {
  allTasks: DrillTask[];
  progressMap: Record<string, UserProgress>;
  customTasks: DrillTask[];
  lang: Lang;
  onSelectTask: (id: string) => void;
  onSetActiveTab: (tab: 'dashboard' | 'catalog' | 'upload' | 'backup') => void;
  activeTab: 'dashboard' | 'catalog' | 'upload' | 'backup';
}

export default function DashboardView({
  allTasks, progressMap, customTasks, lang, onSelectTask, onSetActiveTab, activeTab,
}: DashboardViewProps) {
  const t = getT(lang);

  const newTasks = useMemo(() => getNewTasks(allTasks, progressMap), [allTasks, progressMap]);
  const dueRepetitions = useMemo(() => getDueRepetitions(allTasks, progressMap), [allTasks, progressMap]);
  const masteredTasks = useMemo(() => getMasteredTasks(allTasks, progressMap), [allTasks, progressMap]);
  const inProgressTasks = useMemo(() => getInProgressTasks(allTasks, progressMap), [allTasks, progressMap]);

  const handleContinuePractice = () => {
    const next = pickNextTask(dueRepetitions, inProgressTasks, progressMap, newTasks, allTasks);
    if (next) onSelectTask(next);
  };

  const stats = useMemo(() => getStats(progressMap, allTasks, masteredTasks), [progressMap, allTasks, masteredTasks]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Left column */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {/* Hero CTA */}
        <Card variant="accent" className="min-h-[260px] relative animate-fade-in-up">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{t.personalQueue}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight max-w-md leading-tight" style={{ color: 'var(--text-primary)' }}>
              {t.trainerReady}
            </h2>
            <p className="text-sm mt-3 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Заплановано{' '}
              <span className="font-bold font-mono" style={{ color: 'var(--accent)' }}>{dueRepetitions.length} повторень</span>{' '}
              та доступно{' '}
              <span className="font-bold font-mono" style={{ color: 'var(--green)' }}>{newTasks.length} нових задач</span>.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            glow
            onClick={handleContinuePractice}
            className="relative z-10 mt-6 self-start flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            {t.continuePractice}
          </Button>
        </Card>

        {/* Due repetitions */}
        <Card padding="md">
          <SectionHeader
            icon={<Clock className="w-4 h-4" />}
            title={`${t.repetitionQueue} (${dueRepetitions.length})`}
            subtitle={t.intervalSchedule}
          />
          {dueRepetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dueRepetitions.slice(0, 4).map(task => {
                const prog = getTaskProgress(progressMap, task.id);
                return (
                  <Card key={task.id} variant="elevated" padding="md" onClick={() => onSelectTask(task.id)}
                    className="transition-all group hover:border-orange-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                        {task.block} · {task.difficulty}
                      </span>
                      <Badge variant="danger" size="sm">
                        Stage {prog.learningStage}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold truncate transition-colors group-hover:text-orange-400">{task.title}</h4>
                    <div className="text-[10px] font-bold flex items-center gap-1 mt-2" style={{ color: 'var(--accent)' }}>
                      <span>{t.startPractice}</span>
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
            icon={<Layers className="w-4 h-4" style={{ color: 'var(--green)' }} />}
            title={`${t.newTasks} (${newTasks.length})`}
            action={
              <button onClick={() => onSetActiveTab('catalog')} className="text-xs font-bold transition-colors hover:underline" style={{ color: 'var(--accent)' }}>
                {t.viewAll}
              </button>
            }
          />
          <div className="space-y-2">
            {newTasks.slice(0, 5).map(task => (
              <Card key={task.id} variant="elevated" padding="sm" onClick={() => onSelectTask(task.id)}
                className="flex items-center justify-between gap-4 group transition-all hover:border-orange-800/40">
                <div className="flex items-center gap-3 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--green)' }} />
                  <div className="truncate">
                    <h4 className="text-sm font-bold truncate transition-colors group-hover:text-orange-400">{task.title}</h4>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{task.block}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="accent" size="sm" className={diffBadge(task.difficulty)}>{task.difficulty}</Badge>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
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
                { val: inProgressTasks.length, label: t.inLearning, color: 'var(--accent)' },
                { val: `${stats.accuracy}%`, label: t.testAccuracy, color: 'var(--green)' },
              ].map(({ val, label, color }) => (
                <StatCard key={label} value={val} label={label} color={color} />
              ))}
            </div>
            <div className="p-3 rounded-xl flex items-center justify-between text-xs font-mono border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t.totalPeeks}</span>
              <span className="font-bold" style={{ color: 'var(--amber)' }}>{t.peeksTimes(stats.totalPeeks)}</span>
            </div>
          </div>
        </Card>

        <Card variant="accent" padding="md">
          <SectionHeader icon={<AlertCircle className="w-4 h-4" />} title={t.howItWorks} color="var(--accent)" />
          <div className="space-y-3 text-xs leading-relaxed">
            <p style={{ color: 'var(--text-secondary)' }}>{t.howDesc}</p>
            <ul className="space-y-1.5 list-none" style={{ color: 'var(--text-secondary)' }}>
              {t.stages.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono font-bold shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 border-t text-[11px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-muted)' }}>{t.howNote}</p>
          </div>
        </Card>
      </div>

    </div>
  );
}
