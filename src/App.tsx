import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { itleadTasks } from './tasks/itlead';
import { extraTasks } from './tasks/extra';
import { TaskView } from './components/TaskView';
import { DrillTask, UserProgress } from './types';
import { getT, Lang } from './i18n';
import {
  getNewTasks, getDueRepetitions, getMasteredTasks,
  getInProgressTasks, getTaskProgress, pickNextTask,
} from './utils/taskProgress';
import { checkNewAchievements } from './utils/achievements';
import { playClick, playBoot, playAchievementFanfare } from './utils/sound';
import { useLocalStorage } from './utils/useLocalStorage';
import { useRoute } from './useRoute';
import { setRoute, Route } from './router';
import { useTaskCatalog } from './hooks/useTaskCatalog';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';

// ── Lazy-loaded views ──────────────────────────────────────────────────
const DashboardView = lazy(() => import('./components/DashboardView'));
const UploadPanel = lazy(() => import('./components/UploadPanel'));
const BackupPanel = lazy(() => import('./components/BackupPanel'));
const EpicLanding = lazy(() => import('./components/EpicLanding').then(m => ({ default: m.EpicLanding })));

// ─── Matrix rain ────────────────────────────────────────────────────────
function MatrixRain() {
  const drops = React.useMemo(() => {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    return Array.from({ length: 40 }, (_, i) => ({
      id: i, left: `${(i / 40) * 100}%`, delay: Math.random() * 8,
      duration: 3 + Math.random() * 5, length: 5 + Math.floor(Math.random() * 15),
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {drops.map(d => (
        <div key={d.id} className="matrix-drop" style={{ left: d.left, animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s`, height: `${d.length * 16}px`, opacity: 0.025 }}>
          <span className="text-[8px] font-mono" style={{ color: 'var(--neon-cyan)' }}>{d.char}</span>
        </div>
      ))}
    </div>
  );
}

type Theme = 'cyberpunk' | 'matrix' | 'amber' | 'dracula' | 'ice';
const THEMES: Theme[] = ['cyberpunk', 'matrix', 'amber', 'dracula', 'ice'];

export default function App() {
  // ── i18n ──────────────────────────────────────────────────────────────
  const [lang, setLang] = useLocalStorage<Lang>('drill_lang', 'uk');
  const [bootPhase, setBootPhase] = useState<'flash' | 'boot' | 'landing' | 'ready'>('flash');
  const t = getT(lang);

  // ── Theme + CRT ──────────────────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage<Theme>('drill_theme', 'cyberpunk');
  const [crtActive, setCrtActive] = useLocalStorage<boolean>('drill_crt_active', true);

  useEffect(() => {
    const classes = THEMES.map(th => `theme-${th}`);
    document.documentElement.classList.remove(...classes);
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('crt-effects-active', crtActive);
  }, [crtActive]);

  // ── Routing ──────────────────────────────────────────────────────────
  const [route, setRouteInternal] = useRoute();
  const activeTab = route.tab;
  const selectedTaskId = route.taskId;

  // ── Achievements ──────────────────────────────────────────────────────
  const [unlockedIds, setUnlockedIds] = useLocalStorage<string[]>('drill_unlocked_achievements', []);
  const [activeToast, setActiveToast] = useState<{ id: string; icon: string; titleUk: string; titleEn: string; descUk: string; descEn: string } | null>(null);

  const triggerAchievementToast = (achievement: typeof activeToast) => {
    playAchievementFanfare();
    setActiveToast(achievement);
    setTimeout(() => setActiveToast(null), 4500);
  };

  // ── Boot sequence ─────────────────────────────────────────────────────
  useEffect(() => {
    playBoot();
    const t1 = setTimeout(() => setBootPhase('boot'), 400);
    const t2 = setTimeout(() => {
      const skipIntro = localStorage.getItem('drill_skip_intro') === 'true';
      setBootPhase(skipIntro ? 'ready' : 'landing');
    }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── Scroll to top on route change ─────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route.tab, route.taskId]);

  // ── Data ──────────────────────────────────────────────────────────────
  const [customTasks, setCustomTasks] = useLocalStorage<DrillTask[]>('drill_custom_tasks', []);
  const allTasks = useMemo(() => [...itleadTasks, ...extraTasks, ...customTasks], [customTasks]);
  const [progressMap, setProgressMap] = useLocalStorage<Record<string, UserProgress>>('drill_progress_map', {});

  const selectedTask = useMemo(
    () => selectedTaskId ? allTasks.find(t => t.id === selectedTaskId) ?? null : null,
    [selectedTaskId, allTasks],
  );

  // ── Task catalog state ────────────────────────────────────────────────
  const catalog = useTaskCatalog(allTasks, progressMap);

  // ── Derived data ──────────────────────────────────────────────────────
  const newTasks = useMemo(() => getNewTasks(allTasks, progressMap), [allTasks, progressMap]);
  const dueRepetitions = useMemo(() => getDueRepetitions(allTasks, progressMap), [allTasks, progressMap]);
  const masteredTasks = useMemo(() => getMasteredTasks(allTasks, progressMap), [allTasks, progressMap]);
  const inProgressTasks = useMemo(() => getInProgressTasks(allTasks, progressMap), [allTasks, progressMap]);

  const handleContinuePractice = () => {
    const next = pickNextTask(dueRepetitions, inProgressTasks, progressMap, newTasks, allTasks);
    if (next) setRoute({ tab: 'catalog', taskId: next });
  };

  // ── Progress handlers ────────────────────────────────────────────────
  const handleSaveProgress = (taskId: string, updatedProgress: UserProgress) => {
    const newlyUnlocked = checkNewAchievements(progressMap, updatedProgress, unlockedIds);
    if (newlyUnlocked.length > 0) {
      setUnlockedIds(prev => [...prev, ...newlyUnlocked.map(a => a.id)]);
      triggerAchievementToast(newlyUnlocked[0]);
    }
    setProgressMap(prev => ({ ...prev, [taskId]: updatedProgress }));
  };

  // ── Upload form state ─────────────────────────────────────────────────
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

  const handleCreateCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const defaults = {
      timeLimitMin: 10,
      starter: 'function myFunc() {\n  // Your starter code here\n}',
      solution: 'function myFunc() {\n  // Your complete solution here\n}',
      clozeSteps: [
        'function myFunc() {\n  /* ??? */\n}',
        'function myFunc() {\n  /* ??? */\n  /* ??? */\n}',
        'function myFunc() {\n  /* ??? */\n  /* ??? */\n  /* ??? */\n}',
      ],
      breakdown: 'Explain the core logic here.',
      testCode: `test('Custom Case 1', () => {\n  assertEqual(true, true);\n});`,
    } as const;
    const newTask: DrillTask = {
      id: `custom-${Date.now()}`,
      block: newCategory.trim() || 'custom',
      title: newTitle.trim(),
      description: newDescription.trim(),
      difficulty: newDifficulty,
      ...defaults,
    } as DrillTask;
    setCustomTasks(prev => [newTask, ...prev]);
    setNewTitle(''); setNewDescription('');
    setNewStarter(defaults.starter); setNewSolution(defaults.solution);
    setNewCloze1(defaults.clozeSteps[0]); setNewCloze2(defaults.clozeSteps[1]); setNewCloze3(defaults.clozeSteps[2]);
    setNewBreakdown(defaults.breakdown); setNewTestCode(defaults.testCode);
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

  // ── Header helpers ────────────────────────────────────────────────────
  const handleTabClick = (tab: Route['tab']) => {
    playClick();
    setRoute({ tab, taskId: null });
  };

  const handleToggleLang = () => {
    playClick();
    setLang(l => l === 'uk' ? 'en' : 'uk');
  };

  const handleCycleTheme = () => {
    playClick();
    const nextIndex = (THEMES.indexOf(theme) + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  const handleToggleCrt = () => {
    playClick();
    setCrtActive(!crtActive);
  };

  // ── Boot phases ──────────────────────────────────────────────────────
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
      <Suspense fallback={null}>
        <EpicLanding
          lang={lang}
          onSetLang={setLang}
          onEnter={() => setBootPhase('ready')}
          totalTasks={allTasks.length}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col crt-curve crt-warp-container" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <MatrixRain />

      <AnimatePresence mode="wait">
        {selectedTask && selectedTaskId ? (
          <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'brightness(3)' }} transition={{ duration: 0.15 }}>
            <div className="workspace-glitch-in">
              <TaskView
                task={selectedTask}
                progress={getTaskProgress(progressMap, selectedTask.id)}
                onSaveProgress={handleSaveProgress}
                onBack={() => { playClick(); setRoute({ tab: activeTab === 'backup' ? 'backup' : 'catalog', taskId: null }); }}
                lang={lang}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <div className="scanline-sweep" />

            <Header
              lang={lang}
              theme={theme}
              crtActive={crtActive}
              activeTab={activeTab}
              taskCount={allTasks.length}
              onToggleLang={handleToggleLang}
              onCycleTheme={handleCycleTheme}
              onToggleCrt={handleToggleCrt}
              onTabClick={handleTabClick}
              t={t}
            />

            <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
              {activeTab === 'dashboard' && (
                <Suspense fallback={<div className="text-center py-20 font-mono text-[var(--text-muted)]">Loading dashboard...</div>}>
                  <DashboardView
                    allTasks={allTasks}
                    progressMap={progressMap}
                    customTasks={customTasks}
                    lang={lang}
                    unlockedIds={unlockedIds}
                    onSelectTask={(id) => setRoute({ tab: 'catalog', taskId: id })}
                    onSetActiveTab={(tab) => setRoute({ tab, taskId: null })}
                    activeTab={activeTab}
                  />
                </Suspense>
              )}
              {activeTab === 'catalog' && (
                <CatalogView
                  allTasks={allTasks}
                  progressMap={progressMap}
                  lang={lang}
                  catalog={catalog}
                />
              )}
              {activeTab === 'upload' && (
                <Suspense fallback={<div className="text-center py-20 font-mono text-[var(--text-muted)]">Loading...</div>}>
                  <UploadPanel
                    t={t}
                    importText={importText}
                    importStatus={importStatus}
                    newTitle={newTitle} newDifficulty={newDifficulty} newCategory={newCategory}
                    newDescription={newDescription} newStarter={newStarter} newSolution={newSolution}
                    newCloze1={newCloze1} newCloze2={newCloze2} newCloze3={newCloze3}
                    newBreakdown={newBreakdown} newTestCode={newTestCode}
                    onSetImportText={setImportText}
                    onSetNewTitle={setNewTitle} onSetNewDifficulty={setNewDifficulty} onSetNewCategory={setNewCategory}
                    onSetNewDescription={setNewDescription} onSetNewStarter={setNewStarter} onSetNewSolution={setNewSolution}
                    onSetNewCloze1={setNewCloze1} onSetNewCloze2={setNewCloze2} onSetNewCloze3={setNewCloze3}
                    onSetNewBreakdown={setNewBreakdown} onSetNewTestCode={setNewTestCode}
                    onImportJSON={handleImportTasksJSON} onCreateTask={handleCreateCustomTask}
                  />
                </Suspense>
              )}
              {activeTab === 'backup' && (
                <Suspense fallback={<div className="text-center py-20 font-mono text-[var(--text-muted)]">Loading...</div>}>
                  <BackupPanel
                    t={t}
                    progressBackupString={progressBackupString}
                    onGenerateBackup={() => setProgressBackupString(JSON.stringify(progressMap, null, 2))}
                    onRestore={handleImportProgressBackup}
                  />
                </Suspense>
              )}

              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1" style={{ animation: 'scroll-indicate 2.5s ease-in-out infinite' }}>
                <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>▼ SCROLL ▼</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15, stiffness: 180 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-4 px-5 py-4 border-2 border-[var(--neon-magenta)] bg-[var(--bg-surface)] shadow-[0_0_25px_rgba(255,0,255,0.25)] rounded-md max-w-sm pointer-events-auto"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] animate-pulse shrink-0">{activeToast.icon}</span>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--neon-magenta)] drop-shadow-[0_0_6px_rgba(255,0,255,0.4)]">
                {lang === 'uk' ? 'ДОСЯГНЕННЯ РОЗБЛОКОВАНО!' : 'ACHIEVEMENT UNLOCKED!'}
              </h3>
              <h4 className="text-xs font-bold text-[var(--text-primary)] mt-1">
                {lang === 'uk' ? activeToast.titleUk : activeToast.titleEn}
              </h4>
              <p className="text-[9px] text-[var(--text-secondary)] mt-0.5 leading-normal">
                {lang === 'uk' ? activeToast.descUk : activeToast.descEn}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
