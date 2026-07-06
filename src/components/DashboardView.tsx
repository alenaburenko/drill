import React, { useMemo } from 'react';
import { DrillTask, UserProgress } from '../types';
import { getT, Lang } from '../i18n';
import { diffBadge } from '../utils/badges';
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

  const getTaskProgress = (id: string): UserProgress =>
    progressMap[id] || { learningStage: 1, peeksCount: 0, lastPracticed: null, history: [] };

  const isTaskDue = (task: DrillTask): boolean => {
    const prog = progressMap[task.id];
    if (!prog || !prog.lastPracticed) return false;
    if (prog.learningStage >= 7) return false;
    const intervals = [0, 0, 1 * 3600000, 24 * 3600000, 72 * 3600000, 168 * 3600000, 336 * 3600000];
    const dueTime = new Date(prog.lastPracticed).getTime() + (intervals[prog.learningStage] || 86400000);
    return Date.now() >= dueTime;
  };

  const newTasks = useMemo(() =>
    allTasks.filter(t => !progressMap[t.id] || progressMap[t.id].learningStage === 1),
    [allTasks, progressMap]);

  const dueRepetitions = useMemo(() => allTasks.filter(isTaskDue), [allTasks, progressMap]);

  const masteredTasks = useMemo(() =>
    allTasks.filter(t => progressMap[t.id]?.learningStage >= 7), [allTasks, progressMap]);

  const inProgressTasks = useMemo(() =>
    allTasks.filter(t => progressMap[t.id] && progressMap[t.id].learningStage > 1 && progressMap[t.id].learningStage < 7),
    [allTasks, progressMap]);

  const handleContinuePractice = () => {
    if (dueRepetitions.length > 0) { onSelectTask(dueRepetitions[0].id); return; }
    const activePracticed = inProgressTasks
      .filter(t => progressMap[t.id]?.lastPracticed)
      .sort((a, b) => new Date(progressMap[b.id].lastPracticed!).getTime() - new Date(progressMap[a.id].lastPracticed!).getTime());
    if (activePracticed.length > 0) onSelectTask(activePracticed[0].id);
    else if (newTasks.length > 0) onSelectTask(newTasks[0].id);
    else if (allTasks.length > 0) onSelectTask(allTasks[0].id);
  };

  const stats = useMemo(() => {
    let totalPeeks = 0, totalAttempts = 0, successfulAttempts = 0;
    (Object.values(progressMap) as UserProgress[]).forEach(prog => {
      totalPeeks += prog.peeksCount || 0;
      if (prog.history) {
        totalAttempts += prog.history.length;
        successfulAttempts += prog.history.filter(h => h.success).length;
      }
    });
    return {
      totalPeeks,
      totalAttempts,
      accuracy: totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 100,
      completionRate: allTasks.length > 0 ? Math.round((masteredTasks.length / allTasks.length) * 100) : 0,
    };
  }, [progressMap, allTasks, masteredTasks]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Left column */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {/* Hero CTA */}
        <div className="relative rounded-2xl p-8 overflow-hidden flex flex-col justify-between min-h-[260px] border animate-fade-in-up"
          style={{ background: 'linear-gradient(135deg, #111111 0%, #1a1208 100%)', borderColor: 'rgba(249,115,22,0.2)' }}>
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
          <button
            onClick={handleContinuePractice}
            className="btn-glow relative z-10 mt-6 self-start flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-95"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            <Play className="w-4 h-4 fill-current" />
            {t.continuePractice}
          </button>
        </div>

        {/* Due repetitions */}
        <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-muted)' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              {t.repetitionQueue} ({dueRepetitions.length})
            </h3>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{t.intervalSchedule}</span>
          </div>
          {dueRepetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dueRepetitions.slice(0, 4).map(task => {
                const prog = getTaskProgress(task.id);
                return (
                  <div key={task.id} onClick={() => onSelectTask(task.id)}
                    className="p-4 rounded-xl border cursor-pointer transition-all group hover:border-orange-800/50"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                        {task.block} · {task.difficulty}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-red-950/60 text-red-400 border border-red-800/40">
                        Stage {prog.learningStage}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold truncate transition-colors group-hover:text-orange-400">{task.title}</h4>
                    <div className="text-[10px] font-bold flex items-center gap-1 mt-2" style={{ color: 'var(--accent)' }}>
                      <span>{t.startPractice}</span>
                      <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-sm italic border-2 border-dashed rounded-xl" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              {t.noRepetitions}
            </div>
          )}
        </div>

        {/* New tasks */}
        <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-muted)' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <Layers className="w-4 h-4" style={{ color: 'var(--green)' }} />
              {t.newTasks} ({newTasks.length})
            </h3>
            <button onClick={() => onSetActiveTab('catalog')} className="text-xs font-bold transition-colors hover:underline" style={{ color: 'var(--accent)' }}>
              {t.viewAll}
            </button>
          </div>
          <div className="space-y-2">
            {newTasks.slice(0, 5).map(task => (
              <div key={task.id} onClick={() => onSelectTask(task.id)}
                className="p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-4 group transition-all hover:border-orange-800/40"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--green)' }} />
                  <div className="truncate">
                    <h4 className="text-sm font-bold truncate transition-colors group-hover:text-orange-400">{task.title}</h4>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{task.block}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${diffBadge(task.difficulty)}`}>{task.difficulty}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-5" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            {t.yourProgress}
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                <span>{t.masteredTasks}</span>
                <span>{masteredTasks.length} / {allTasks.length}</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${stats.completionRate}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: inProgressTasks.length, label: t.inLearning, color: 'var(--accent)' },
                { val: `${stats.accuracy}%`, label: t.testAccuracy, color: 'var(--green)' },
              ].map(({ val, label, color }) => (
                <div key={label} className="rounded-xl p-4 text-center border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                  <div className="text-2xl font-mono font-bold" style={{ color }}>{val}</div>
                  <div className="text-[9px] uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl flex items-center justify-between text-xs font-mono border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t.totalPeeks}</span>
              <span className="font-bold" style={{ color: 'var(--amber)' }}>{t.peeksTimes(stats.totalPeeks)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-5 text-xs leading-relaxed space-y-3" style={{ background: 'rgba(249,115,22,0.04)', borderColor: 'rgba(249,115,22,0.15)' }}>
          <h4 className="font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            <AlertCircle className="w-4 h-4" />
            {t.howItWorks}
          </h4>
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
      </div>

    </div>
  );
}
