import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { itleadTasks } from './tasks/itlead';
import { extraTasks } from './tasks/extra';
import { TaskView } from './components/TaskView';
import { DrillTask, UserProgress } from './types';
import { getT, Lang } from './i18n';
import {
  Play, Plus, Search, Check, Award, Database, Download, Upload,
  BookOpen, Filter, Code, Zap, Trash2, BrainCircuit, Calendar,
  Layers, ChevronRight, TrendingUp, AlertCircle, Clock, Sparkles,
  Terminal, Globe, ChevronDown, ChevronUp, ArrowLeft,
  RotateCcw, CheckCircle, AlertTriangle, BookOpen as BookOpenIcon
} from 'lucide-react';
// Note: some lucide icons are used only in DashboardView or TaskView;
// we keep them here for convenience — unused imports are tree-shaken by Vite.

import { diffBadge, stageBadge } from './utils/badges';
import {
  getTaskProgress,
  isTaskDue,
  getNewTasks,
  getDueRepetitions,
  getMasteredTasks,
  getInProgressTasks,
  pickNextTask,
} from './utils/taskProgress';
import { Button, Card, Badge, SectionHeader, EmptyState } from './components/ui';
import { RetroLogo } from './components/RetroLogo';
import DashboardView from './components/DashboardView';
import UploadPanel from './components/UploadPanel';
import BackupPanel from './components/BackupPanel';
import { EpicLanding } from './components/EpicLanding';

// ─── Retro sound system ────────────────────────────────────────────────
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

const SOUNDS = {
  click: () => playBeep(660, 40, 'square'),
  success: () => { playBeep(1047, 60, 'square'); setTimeout(() => playBeep(1319, 80, 'square'), 70); },
  error: () => playBeep(220, 200, 'sawtooth'),
  boot: () => { playBeep(440, 80, 'square'); setTimeout(() => playBeep(880, 60, 'square'), 100); setTimeout(() => playBeep(1320, 100, 'square'), 200); },
  glitch: () => playBeep(180, 80, 'sawtooth'),
};

// ─── Matrix rain ────────────────────────────────────────────────────────
function MatrixRain() {
  const drops = React.useMemo(() => {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i / 40) * 100}%`,
      delay: Math.random() * 8,
      duration: 3 + Math.random() * 5,
      length: 5 + Math.floor(Math.random() * 15),
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {drops.map(d => (
        <div
          key={d.id}
          className="matrix-drop"
          style={{
            left: d.left,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            height: `${d.length * 16}px`,
            opacity: 0.025,
          }}
        >
          <span className="text-[8px] font-mono" style={{ color: 'var(--neon-cyan)' }}>{d.char}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  // ── i18n ────────────────────────────────────────────────────────────────
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem('drill_lang') as Lang) || 'uk'
  );
  const [bootPhase, setBootPhase] = useState<'flash' | 'boot' | 'landing' | 'ready'>('flash');
  const t = getT(lang);

  // ── Boot sequence ───────────────────────────────────────────────────────
  useEffect(() => {
    SOUNDS.boot();
    const t1 = setTimeout(() => setBootPhase('boot'), 400);
    const t2 = setTimeout(() => {
      const skipIntro = localStorage.getItem('drill_skip_intro') === 'true';
      if (skipIntro) {
        setBootPhase('ready');
      } else {
        setBootPhase('landing');
      }
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    localStorage.setItem('drill_lang', lang);
  }, [lang]);

  // ── custom tasks ─────────────────────────────────────────────────────────
  const [customTasks, setCustomTasks] = useState<DrillTask[]>(() => {
    const saved = localStorage.getItem('drill_custom_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const allTasks = useMemo(() => [...itleadTasks, ...extraTasks, ...customTasks], [customTasks]);

  // ── progress ──────────────────────────────────────────────────────────────
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>(() => {
    const saved = localStorage.getItem('drill_progress_map');
    if (saved) { try { return JSON.parse(saved); } catch { return {}; } }
    return {};
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'upload' | 'backup'>('dashboard');

  // ── catalog filters ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'junior' | 'middle' | 'senior'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // ── upload form ───────────────────────────────────────────────────────────
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'junior' | 'middle' | 'senior'>('middle');
  const [newCategory, setNewCategory] = useState('custom');
  const [newDescription, setNewDescription] = useState('');
  const [newStarter, setNewStarter] = useState('function myFunc() {\n  // Your starter code here\n}');
  const [newSolution, setNewSolution] = useState('function myFunc() {\n  // Your complete solution here\n}');
  const [newCloze1, setNewCloze1] = useState('function myFunc() {\n  /* ??? */\n}');
  const [newCloze2, setNewCloze2] = useState('function myFunc() {\n  /* ??? */\n  /* ??? */\n}');
  const [newCloze3, setNewCloze3] = useState('function myFunc() {\n  /* ??? */\n  /* ??? */\n  /* ??? */\n}');
  const [newBreakdown, setNewBreakdown] = useState('Explain the core logic here.');
  const [newTestCode, setNewTestCode] = useState(`test('Custom Case 1', () => {\n  assertEqual(true, true);\n});`);

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [progressBackupString, setProgressBackupString] = useState('');

  // ── persist ───────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('drill_custom_tasks', JSON.stringify(customTasks));
  }, [customTasks]);

  useEffect(() => {
    localStorage.setItem('drill_progress_map', JSON.stringify(progressMap));
  }, [progressMap]);

  // ── derived data ──────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set<string>();
    allTasks.forEach(t => { if (t.block) set.add(t.block); });
    return Array.from(set);
  }, [allTasks]);

  const getTaskProgressFromMap = (id: string): UserProgress =>
    getTaskProgress(progressMap, id);

  const isTaskDueFn = (task: DrillTask): boolean =>
    isTaskDue(task, progressMap);

  const newTasks = useMemo(() => getNewTasks(allTasks, progressMap), [allTasks, progressMap]);

  const dueRepetitions = useMemo(() => getDueRepetitions(allTasks, progressMap), [allTasks, progressMap]);

  const masteredTasks = useMemo(() => getMasteredTasks(allTasks, progressMap), [allTasks, progressMap]);

  const inProgressTasks = useMemo(() => getInProgressTasks(allTasks, progressMap), [allTasks, progressMap]);

  const handleContinuePractice = () => {
    const next = pickNextTask(dueRepetitions, inProgressTasks, progressMap, newTasks, allTasks);
    if (next) setSelectedTaskId(next);
  };

  // Grouped + filtered catalog
  const filteredCatalog = useMemo(() => {
    return allTasks.filter(task => {
      const prog = getTaskProgressFromMap(task.id);
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === 'all' || task.difficulty === difficultyFilter;
      const matchesCat = categoryFilter === 'all' || task.block === categoryFilter;
      let matchesStage = true;
      if (stageFilter !== 'all') {
        if (stageFilter === 'unstarted') matchesStage = !progressMap[task.id] || progressMap[task.id].learningStage === 1;
        else if (stageFilter === 'mastered') matchesStage = progressMap[task.id]?.learningStage >= 7;
        else matchesStage = progressMap[task.id]?.learningStage === parseInt(stageFilter);
      }
      return matchesSearch && matchesDiff && matchesCat && matchesStage;
    });
  }, [allTasks, searchQuery, difficultyFilter, categoryFilter, stageFilter, progressMap]);

  const groupedCatalog = useMemo(() => {
    const map: Record<string, DrillTask[]> = {};
    filteredCatalog.forEach(t => {
      if (!map[t.block]) map[t.block] = [];
      map[t.block].push(t);
    });
    return Object.entries(map).sort(([, a], [, b]) => b.length - a.length);
  }, [filteredCatalog]);

  const toggleGroup = (block: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(block)) next.delete(block); else next.add(block);
      return next;
    });
  };

  const handleSaveProgress = (taskId: string, updatedProgress: UserProgress) => {
    setProgressMap(prev => ({ ...prev, [taskId]: updatedProgress }));
  };

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: DrillTask = {
      id: `custom-${Date.now()}`,
      block: newCategory.trim() || 'custom',
      title: newTitle.trim(),
      timeLimitMin: 10,
      description: newDescription.trim(),
      starter: newStarter.trim(),
      solution: newSolution.trim(),
      clozeSteps: [newCloze1.trim(), newCloze2.trim(), newCloze3.trim()],
      breakdown: newBreakdown.trim(),
      testCode: newTestCode.trim(),
      difficulty: newDifficulty,
    };
    setCustomTasks(prev => [newTask, ...prev]);
    setNewTitle(''); setNewDescription('');
    setNewStarter('function myFunc() {\n  // Your starter code here\n}');
    setNewSolution('function myFunc() {\n  // Your complete solution here\n}');
    setNewCloze1('function myFunc() {\n  /* ??? */\n}');
    setNewCloze2('function myFunc() {\n  /* ??? */\n  /* ??? */\n}');
    setNewCloze3('function myFunc() {\n  /* ??? */\n  /* ??? */\n  /* ??? */\n}');
    setNewBreakdown('Explain the core logic here.');
    setNewTestCode(`test('Custom Case 1', () => {\n  assertEqual(true, true);\n});`);
    setImportStatus({ type: 'success', message: t.taskAdded });
  };

  const handleImportTasksJSON = (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus(null);
    try {
      const parsed = JSON.parse(importText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const validTasks: DrillTask[] = [];
      for (const item of arr) {
        if (item.title && item.starter && item.solution && item.testCode) {
          validTasks.push({
            id: item.id || `custom-${Math.random().toString(36).slice(2, 9)}`,
            block: item.block || 'imported',
            title: item.title,
            timeLimitMin: item.timeLimitMin || 10,
            description: item.description || '',
            starter: item.starter,
            solution: item.solution,
            clozeSteps: item.clozeSteps || [item.cloze || item.starter, item.cloze || item.starter, item.cloze || item.starter],
            breakdown: item.breakdown || '',
            testCode: item.testCode,
            difficulty: item.difficulty || 'middle',
          });
        }
      }
      if (validTasks.length === 0) throw new Error('No valid tasks found in the provided JSON.');
      setCustomTasks(prev => [...validTasks, ...prev]);
      setImportStatus({ type: 'success', message: `Successfully imported ${validTasks.length} task(s)!` });
      setImportText('');
    } catch (err: any) {
      setImportStatus({ type: 'error', message: err.message || 'JSON parse error.' });
    }
  };

  const generateProgressBackup = () => setProgressBackupString(JSON.stringify(progressMap, null, 2));

  const handleImportProgressBackup = (backupStr: string) => {
    try {
      const parsed = JSON.parse(backupStr);
      if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid backup format.');
      setProgressMap(parsed);
      alert(t.restoreSuccess);
    } catch (e: any) {
      alert(t.restoreError(e.message));
    }
  };

  const selectedTask = allTasks.find(t => t.id === selectedTaskId);

  // ── Sound hooks ──────────────────────────────────────────────────────
  const handleTabClick = (tab: typeof activeTab) => {
    SOUNDS.click();
    setActiveTab(tab);
  };

  // ── render ────────────────────────────────────────────────────────────────
  if (bootPhase === 'flash' || bootPhase === 'boot') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center crt-curve" style={{ background: 'var(--bg-base)', color: 'var(--neon-cyan)' }}>
        {bootPhase === 'flash' && <div className="crt-flash" />}
        <div className="font-mono text-center">
          <div className="text-sm mb-8" style={{ color: 'var(--neon-green)' }}>
            <div className="boot-line">SYS 43656 INIT v1.0</div>
            <div className="boot-line" style={{ animationDelay: '0.3s' }}>MEMORY CHECK: OK</div>
            <div className="boot-line" style={{ animationDelay: '0.6s' }}>CRT DISPLAY: 60Hz</div>
            <div className="boot-line" style={{ animationDelay: '0.9s' }}>LOADING DRILL MODULE...</div>
            <div className="mt-4 boot-prompt text-flicker" style={{ color: 'var(--neon-cyan)', fontSize: '9px' }}>
              {`> PRESS START TO CONTINUE`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bootPhase === 'landing') {
    return (
      <EpicLanding
        lang={lang}
        onSetLang={setLang}
        onEnter={() => setBootPhase('ready')}
        totalTasks={allTasks.length}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col crt-curve" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Matrix rain background */}
      <MatrixRain />

      <AnimatePresence mode="wait">
        {selectedTask ? (
          <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'brightness(3)' }} transition={{ duration: 0.15 }}>
            <div className="workspace-glitch-in">
              <TaskView
                task={selectedTask}
                progress={getTaskProgressFromMap(selectedTask.id)}
                onSaveProgress={handleSaveProgress}
                onBack={() => {
                  SOUNDS.click();
                  setSelectedTaskId(null);
                }}
                lang={lang}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            {/* Scanner line */}
            <div className="scanline-sweep" />

            {/* ── Header ── */}
            <header className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between border-b glitch-spasm-rare" style={{ background: 'rgba(13,0,21,0.85)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4">
                <RetroLogo size="md" />
                <div>
                  <h1 className="text-base font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--neon-cyan)', textShadow: '0 0 8px rgba(0,240,255,0.4)' }}>{'>'} </span>
                    <span className="text-flicker">{t.appTitle}</span>
                    <span className="badge-retro badge-retro-magenta text-[7px] px-2 py-0.5 bounce-8bit">{t.appBadge}</span>
                  </h1>
                  <p className="text-[9px] mt-0.5 tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.appSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language switcher */}
                <button
                  onClick={() => {
                    SOUNDS.click();
                    setLang(l => l === 'uk' ? 'en' : 'uk');
                  }}
                  className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-all hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                  style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  title="Switch language"
                >
                  {lang === 'uk' ? '🤘 UA' : '🇬🇧 EN'}
                </button>

                {/* Nav tabs */}
                <nav className="flex items-center gap-0 p-0.5 border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                  {(['dashboard', 'catalog', 'upload', 'backup'] as const).map(tab => {
                    const labels: Record<string, string> = {
                      dashboard: t.navTrainer,
                      catalog: `${t.navCatalog} (${allTasks.length})`,
                      upload: t.navUpload,
                      backup: t.navProgress,
                    };
                    return (
                      <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all font-mono"
                        style={activeTab === tab
                          ? { background: 'var(--neon-cyan)', color: '#000' }
                          : { color: 'var(--text-secondary)', background: 'transparent' }
                        }
                      >
                        {labels[tab]}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </header>

            {/* ── Main content ── */}
            <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">

              {/* ──────── DASHBOARD ──────── */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  allTasks={allTasks}
                  progressMap={progressMap}
                  customTasks={customTasks}
                  lang={lang}
                  onSelectTask={setSelectedTaskId}
                  onSetActiveTab={setActiveTab}
                  activeTab={activeTab}
                />
              )}

              {/* ──────── CATALOG ──────── */}
              {activeTab === 'catalog' && (
                <Card padding="md">
                  {/* Filters */}
                  <div className="flex flex-col lg:flex-row gap-3 items-center justify-between mb-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full lg:w-80 px-3 py-2 text-xs outline-none border font-mono"
                      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                      <span className="font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5 px-2 py-1.5 border" style={{ color: 'var(--neon-cyan)', borderColor: 'var(--border)' }}>
                        <Filter className="w-3 h-3" />{t.filters}
                      </span>
                      {[
                        { val: difficultyFilter, set: setDifficultyFilter, opts: [['all', t.allDifficulties], ['junior', 'Junior'], ['middle', 'Middle'], ['senior', 'Senior']] },
                        { val: categoryFilter, set: setCategoryFilter, opts: [['all', t.allCategories], ...categories.map(c => [c, c])] },
                        { val: stageFilter, set: setStageFilter, opts: [['all', t.allStages], ['unstarted', t.unstartedStage], ['2', 'Stage 2'], ['3', 'Stage 3'], ['4', 'Stage 4'], ['5', 'Stage 5'], ['6', 'Stage 6'], ['mastered', t.masteredLabel]] },
                      ].map(({ val, set, opts }, fi) => (
                        <select key={fi} value={val} onChange={e => set(e.target.value)}
                          className="text-[9px] uppercase tracking-wider px-2 py-1.5 outline-none border font-mono"
                          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                          {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      ))}
                    </div>
                  </div>

                  {/* Grouped task list */}
                  {groupedCatalog.length === 0 ? (
                    <EmptyState description={t.noTasksFound} />
                  ) : (
                    <div className="space-y-6">
                      {groupedCatalog.map(([block, tasks]) => {
                        const isCollapsed = collapsedGroups.has(block);
                        return (
                          <div key={block}>
                            <button
                              onClick={() => toggleGroup(block)}
                              className="w-full group-header hover:opacity-80 transition-opacity mb-3"
                            >
                              <span className="flex-1 text-left">{block.toUpperCase()}</span>
                              <Badge variant="accent" size="sm" className="ml-2">{t.tasksCount(tasks.length)}</Badge>
                              {isCollapsed ? <ChevronDown className="w-3 h-3 ml-2" /> : <ChevronUp className="w-3 h-3 ml-2" />}
                            </button>

                            {!isCollapsed && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tasks.map(task => {
                                  const prog = getTaskProgressFromMap(task.id);
                                  const isMastered = prog.learningStage >= 7;
                                  return (
                                    <Card key={task.id} variant="elevated" padding="md" className={isMastered ? "card-retro-rainbow group" : "group"}>
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <Badge variant="accent" size="sm" className={diffBadge(task.difficulty)}>{task.difficulty}</Badge>
                                          <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>#{task.id.slice(-8)}</span>
                                        </div>
                                        <h4 className="text-xs font-bold transition-colors group-hover:text-[var(--neon-cyan)] line-clamp-1">{task.title}</h4>
                                        <p className="text-[11px] mt-2 line-clamp-2 leading-relaxed font-mono" style={{ color: 'var(--text-muted)' }}>
                                          {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
                                        </p>
                                      </div>
                                      <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                                        <Badge variant={isMastered ? 'stage-mastered' : 'stage'} size="md">
                                          {isMastered ? t.masteredLabel : t.stageOf(prog.learningStage)}
                                        </Badge>
                                        <Button variant="primary" size="sm" onClick={() => { SOUNDS.click(); setSelectedTaskId(task.id); }}>
                                          {t.practiceBtn}
                                        </Button>
                                      </div>
                                    </Card>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              )}

              {/* ──────── UPLOAD ──────── */}
              {activeTab === 'upload' && (
                <UploadPanel
                  t={t}
                  importText={importText}
                  importStatus={importStatus}
                  newTitle={newTitle}
                  newDifficulty={newDifficulty}
                  newCategory={newCategory}
                  newDescription={newDescription}
                  newStarter={newStarter}
                  newSolution={newSolution}
                  newCloze1={newCloze1}
                  newCloze2={newCloze2}
                  newCloze3={newCloze3}
                  newBreakdown={newBreakdown}
                  newTestCode={newTestCode}
                  onSetImportText={setImportText}
                  onSetNewTitle={setNewTitle}
                  onSetNewDifficulty={setNewDifficulty}
                  onSetNewCategory={setNewCategory}
                  onSetNewDescription={setNewDescription}
                  onSetNewStarter={setNewStarter}
                  onSetNewSolution={setNewSolution}
                  onSetNewCloze1={setNewCloze1}
                  onSetNewCloze2={setNewCloze2}
                  onSetNewCloze3={setNewCloze3}
                  onSetNewBreakdown={setNewBreakdown}
                  onSetNewTestCode={setNewTestCode}
                  onImportJSON={handleImportTasksJSON}
                  onCreateTask={handleCreateCustomTask}
                />
              )}

              {/* ──────── BACKUP ──────── */}
              {activeTab === 'backup' && (
                <BackupPanel
                  t={t}
                  progressBackupString={progressBackupString}
                  onGenerateBackup={generateProgressBackup}
                  onRestore={handleImportProgressBackup}
                />
              )}

              {/* ── Scroll indicator ── */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1" style={{ animation: 'scroll-indicate 2.5s ease-in-out infinite' }}>
                <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>▼ SCROLL ▼</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
