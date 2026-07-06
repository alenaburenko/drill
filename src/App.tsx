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
  Terminal, Globe, ChevronDown, ChevronUp, ArrowLeft, Eye, EyeOff,
  RotateCcw, CheckCircle, AlertTriangle, BookOpen as BookOpenIcon
} from 'lucide-react';
// Note: some lucide icons are used only in DashboardView or TaskView;
// we keep them here for convenience — unused imports are tree-shaken by Vite.

import { diffBadge, stageBadge } from './utils/badges';
import { Button, Card, Badge, SectionHeader, EmptyState } from './components/ui';
import DashboardView from './components/DashboardView';

export default function App() {
  // ── i18n ────────────────────────────────────────────────────────────────
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem('drill_lang') as Lang) || 'uk'
  );
  const t = getT(lang);

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
    if (dueRepetitions.length > 0) { setSelectedTaskId(dueRepetitions[0].id); return; }
    const activePracticed = inProgressTasks
      .filter(t => progressMap[t.id]?.lastPracticed)
      .sort((a, b) => new Date(progressMap[b.id].lastPracticed!).getTime() - new Date(progressMap[a.id].lastPracticed!).getTime());
    if (activePracticed.length > 0) setSelectedTaskId(activePracticed[0].id);
    else if (newTasks.length > 0) setSelectedTaskId(newTasks[0].id);
    else if (allTasks.length > 0) setSelectedTaskId(allTasks[0].id);
  };

  // Grouped + filtered catalog
  const filteredCatalog = useMemo(() => {
    return allTasks.filter(task => {
      const prog = getTaskProgress(task.id);
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

  const selectedTask = allTasks.find(t => t.id === selectedTaskId);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <AnimatePresence mode="wait">
        {selectedTask ? (
          <motion.div key="workspace" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <TaskView
              task={selectedTask}
              progress={getTaskProgress(selectedTask.id)}
              onSaveProgress={handleSaveProgress}
              onBack={() => setSelectedTaskId(null)}
              lang={lang}
            />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">

            {/* ── Header ── */}
            <header className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between border-b" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <Terminal className="w-7 h-7" style={{ color: 'var(--accent)' }} />
                <div>
                  <h1 className="text-lg font-black tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--accent)' }}>{'>'}</span> {t.appTitle}
                    <span className="badge-accent">{t.appBadge}</span>
                  </h1>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.appSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language switcher */}
                <button
                  onClick={() => setLang(l => l === 'uk' ? 'en' : 'uk')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
                  title="Switch language"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {lang === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                </button>

                {/* Nav tabs */}
                <nav className="flex items-center gap-1 p-1 rounded-xl border text-xs" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
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
                        onClick={() => setActiveTab(tab)}
                        className="px-4 py-2 rounded-lg font-bold transition-all"
                        style={activeTab === tab
                          ? { background: 'var(--accent)', color: '#000' }
                          : { color: 'var(--text-secondary)' }
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
                  <div className="flex flex-col lg:flex-row gap-3 items-center justify-between mb-5 pb-4 border-b" style={{ borderColor: 'var(--border-muted)' }}>
                    <div className="relative w-full lg:w-80">
                      <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none border"
                        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                      <div className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                        <Filter className="w-3.5 h-3.5" /><span>{t.filters}</span>
                      </div>
                      {[
                        { val: difficultyFilter, set: setDifficultyFilter as any, opts: [['all', t.allDifficulties], ['junior', 'Junior'], ['middle', 'Middle'], ['senior', 'Senior']] },
                        { val: categoryFilter, set: setCategoryFilter, opts: [['all', t.allCategories], ...categories.map(c => [c, c])] },
                        { val: stageFilter, set: setStageFilter, opts: [['all', t.allStages], ['unstarted', t.unstartedStage], ['2', 'Stage 2'], ['3', 'Stage 3'], ['4', 'Stage 4'], ['5', 'Stage 5'], ['6', 'Stage 6'], ['mastered', t.masteredLabel]] },
                      ].map(({ val, set, opts }, fi) => (
                        <select key={fi} value={val} onChange={e => set(e.target.value)}
                          className="text-xs rounded-xl px-3 py-2 outline-none border"
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
                            {/* Group header */}
                            <button
                              onClick={() => toggleGroup(block)}
                              className="w-full group-header hover:opacity-80 transition-opacity mb-3"
                            >
                              <span className="flex-1 text-left">{block.toUpperCase()}</span>
                              <Badge variant="accent" size="sm" className="ml-2">{t.tasksCount(tasks.length)}</Badge>
                              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 ml-2" /> : <ChevronUp className="w-3.5 h-3.5 ml-2" />}
                            </button>

                            {/* Tasks grid */}
                            {!isCollapsed && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tasks.map(task => {
                                  const prog = getTaskProgress(task.id);
                                  const isMastered = prog.learningStage >= 7;
                                  return (
                                    <Card key={task.id} variant="elevated" padding="md">
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <Badge variant="accent" size="sm" className={diffBadge(task.difficulty)}>{task.difficulty}</Badge>
                                          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>#{task.id.slice(-8)}</span>
                                        </div>
                                        <h4 className="text-sm font-bold transition-colors group-hover:text-orange-400 line-clamp-1">{task.title}</h4>
                                        <p className="text-xs mt-2 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                          {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
                                        </p>
                                      </div>
                                      <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-muted)' }}>
                                        <Badge variant={isMastered ? 'stage-mastered' : 'stage'} size="md">
                                          {isMastered ? t.masteredLabel : t.stageOf(prog.learningStage)}
                                        </Badge>
                                        <Button variant="primary" size="sm" glow onClick={() => setSelectedTaskId(task.id)}>
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* JSON import */}
                  <div className="lg:col-span-7" style={{ height: '100%' }}>
                    <Card padding="lg" className="flex flex-col gap-4 h-full">
                      <SectionHeader
                        icon={<Upload className="w-4 h-4" />}
                        title={t.importJson}
                        subtitle={t.importJsonDesc}
                      />

                    <form onSubmit={handleImportTasksJSON} className="flex-1 flex flex-col gap-4">
                      <textarea
                        rows={12}
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                        placeholder={`[\n  {\n    "id": "my-task",\n    "block": "javascript",\n    "title": "My Task",\n    "starter": "function f() {}",\n    "solution": "function f() { return true; }",\n    "clozeSteps": ["...step1...", "...step2...", "...step3..."],\n    "testCode": "test('case', () => { assertEqual(f(), true); });",\n    "difficulty": "middle"\n  }\n]`}
                        className="rounded-xl p-4 text-xs font-mono outline-none border resize-none"
                        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />

                      {importStatus && (
                        <Badge variant={importStatus.type === 'success' ? 'success' : 'danger'} size="md">
                          {importStatus.message}
                        </Badge>
                      )}

                      <Button type="submit" variant="primary" size="lg" glow>
                        {t.importBtn}
                      </Button>
                    </form>
                  </Card></div>

                  {/* Manual create */}
                  <div className="lg:col-span-5" style={{ height: '100%' }}>
                    <Card padding="lg">
                      <SectionHeader
                        icon={<Plus className="w-4 h-4" style={{ color: 'var(--green)' }} />}
                        title={t.createTask}
                        subtitle={t.createTaskDesc}
                      />

                    <form onSubmit={handleCreateCustomTask} className="space-y-3 text-xs">
                      {[
                        { label: t.taskTitle, required: true, val: newTitle, set: setNewTitle, ph: t.taskTitlePlaceholder, rows: 0 },
                        { label: t.descriptionLabel, required: false, val: newDescription, set: setNewDescription, ph: t.descriptionPlaceholder, rows: 3 },
                      ].map(({ label, required, val, set, ph, rows }) => (
                        <div key={label}>
                          <label className="block font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                          {rows > 0
                            ? <textarea rows={rows} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                className="w-full rounded-xl px-3 py-2 outline-none border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                            : <input type="text" required={required} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                className="w-full rounded-xl px-3 py-2 outline-none border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                          }
                        </div>
                      ))}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t.categoryBlock}</label>
                          <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="javascript"
                            className="w-full rounded-xl px-3 py-2 outline-none border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t.difficulty}</label>
                          <select value={newDifficulty} onChange={(e: any) => setNewDifficulty(e.target.value)}
                            className="w-full rounded-xl px-3 py-2 outline-none border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                            <option value="junior">Junior</option>
                            <option value="middle">Middle</option>
                            <option value="senior">Senior</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold uppercase tracking-wider border-b pb-1 text-[10px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{t.codeTemplates}</h4>
                        {[
                          { label: t.starterLabel, val: newStarter, set: setNewStarter },
                          { label: t.solutionLabel, val: newSolution, set: setNewSolution },
                          { label: t.clozeLabel1, val: newCloze1, set: setNewCloze1 },
                          { label: t.clozeLabel2, val: newCloze2, set: setNewCloze2 },
                          { label: t.clozeLabel3, val: newCloze3, set: setNewCloze3 },
                          { label: t.testCodeLabel, val: newTestCode, set: setNewTestCode },
                        ].map(({ label, val, set }) => (
                          <div key={label}>
                            <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{label}</label>
                            <textarea rows={2} value={val} onChange={e => set(e.target.value)}
                              className="w-full rounded-xl p-2 font-mono text-[10px] outline-none border resize-none"
                              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                          </div>
                        ))}
                      </div>

                      {importStatus && activeTab === 'upload' && (
                        <Badge variant={importStatus.type === 'success' ? 'success' : 'danger'} size="md">
                          {importStatus.message}
                        </Badge>
                      )}

                      <Button type="submit" variant="success" size="md" glow className="w-full">
                        {t.createSaveBtn}
                      </Button>
                    </form>
                  </Card></div>
                </div>
              )}

              {/* ──────── BACKUP ──────── */}
              {activeTab === 'backup' && (
                <Card padding="lg">
                  <SectionHeader
                    icon={<Database className="w-4 h-4" />}
                    title={t.exportImport}
                    subtitle={t.exportImportDesc}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{t.backupTitle}</h4>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.backupDesc}</p>
                      <Button onClick={generateProgressBackup} variant="primary" size="md" glow className="flex items-center gap-1.5">
                        <Download className="w-4 h-4" />
                        {t.generateBackup}
                      </Button>
                      {progressBackupString && (
                        <textarea readOnly rows={8} value={progressBackupString} onClick={e => (e.target as any).select()}
                          className="w-full rounded-xl p-4 text-xs font-mono resize-none outline-none border"
                          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)' }} />
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{t.restoreTitle}</h4>
                      <p className="text-xs font-mono" style={{ color: 'var(--amber)' }}>{t.restoreWarning}</p>
                      <textarea id="progress-import-textarea" rows={6} placeholder={t.restorePlaceholder}
                        className="w-full rounded-xl p-4 text-xs font-mono resize-none outline-none border"
                        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <Button
                        onClick={() => {
                          const val = (document.getElementById('progress-import-textarea') as HTMLTextAreaElement)?.value;
                          if (val) { if (window.confirm(t.restoreConfirm)) handleImportProgressBackup(val); }
                          else alert(t.pasteFirst);
                        }}
                        variant="success" size="md" glow className="flex items-center gap-1.5 w-full justify-center"
                        style={{ background: 'var(--green)', color: '#000' }}
                      >
                        <Upload className="w-4 h-4" />
                        {t.restoreBtn}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
