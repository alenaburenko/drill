import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CodeEditor } from './CodeEditor';
import { DrillTask, UserProgress } from '../types';
import { runTestsInWorker, RunResults } from '../runner/testRunner';
import { getT, Lang, T } from '../i18n';
import { diffBadge } from '../utils/badges';
import { playLevelUp } from '../utils/sound';
import { INTERVAL_MAP } from '../constants';
import {
  Play,
  Eye,
  EyeOff,
  RotateCcw,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  BookOpen,
  Terminal,
} from 'lucide-react';
import StageStudy from './StageStudy';
import StageRetype from './StageRetype';
import StageHint from './StageHint';
import StageExam from './StageExam';
import StageMastered from './StageMastered';
import TestConsole from './TestConsole';

interface TaskViewProps {
  task: DrillTask;
  progress: UserProgress;
  onSaveProgress: (taskId: string, updatedProgress: UserProgress) => void;
  onBack: () => void;
  lang?: Lang;
}

function formatTime(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getInitialCode(stage: number, task: DrillTask): string {
  if (stage === 2) return '// Перепишіть рішення сюди руками\n\n';
  if (stage === 3) return task.clozeSteps?.[0] || task.starter || '';
  if (stage === 4) return task.clozeSteps?.[1] || task.starter || '';
  if (stage === 5) return task.clozeSteps?.[2] || task.starter || '';
  if (stage === 6) return task.starter || '';
  return '';
}

export const TaskView: React.FC<TaskViewProps> = ({ task, progress, onSaveProgress, onBack, lang = 'uk' as Lang }) => {
  const t: T = getT(lang);

  const [currentStage, setCurrentStage] = useState<number>(progress.learningStage || 1);
  const [code, setCode] = useState<string>('');
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResults, setRunResults] = useState<RunResults | null>(null);

  const [peekOpen, setPeekOpen] = useState<boolean>(false);
  const [peeksCount, setPeeksCount] = useState<number>(progress.peeksCount || 0);
  const [showComments, setShowComments] = useState<boolean>(false);

  const [timerSec, setTimerSec] = useState<number>(0);
  const [examActive, setExamActive] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Init code on stage/task change ───────────────────────────────────────
  useEffect(() => {
    const draft = progress.drafts?.[currentStage];
    if (draft !== undefined) {
      setCode(draft);
    } else {
      setCode(getInitialCode(currentStage, task));
    }
    if (currentStage === 6 && !draft) {
      setTimerSec(task.timeLimitMin * 60);
      setExamActive(true);
    }
    setRunResults(null);
    setPeekOpen(false);
  }, [currentStage, task.id]);

  // ── Exam timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentStage === 6 && examActive) {
      timerRef.current = setInterval(() => {
        setTimerSec(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setExamActive(false);
            handleExamTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStage, examActive]);

  // ── Callbacks ────────────────────────────────────────────────────────────
  const handleExamTimeout = useCallback(() => {
    setRunResults({ success: false, error: 'Час вичерпано! Ви перевищили ліміт часу.', results: [] });
    onSaveProgress(task.id, {
      ...progress,
      learningStage: 6,
      lastPracticed: new Date().toISOString(),
      history: [
        ...(progress.history || []),
        {
          date: new Date().toISOString(),
          success: false,
          stageBefore: 6,
          stageAfter: 6,
          timeSpentSec: task.timeLimitMin * 60,
        },
      ],
    });
  }, [task.id, task.timeLimitMin, progress, onSaveProgress]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (currentStage >= 2 && currentStage <= 6) {
      onSaveProgress(task.id, { ...progress, drafts: { ...(progress.drafts || {}), [currentStage]: newCode } });
    }
  };

  const handleStartPractice = () => {
    setCurrentStage(2);
    onSaveProgress(task.id, { ...progress, learningStage: 2, lastPracticed: new Date().toISOString() });
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setRunResults(null);
    const testResult = await runTestsInWorker(code, task.testCode);
    setRunResults(testResult);
    setIsRunning(false);

    if (testResult.success) {
      const nextStage = currentStage === 6 ? 7 : currentStage + 1;
      if (currentStage === 6) setExamActive(false);

      playLevelUp();
      setShowLevelUp(true);

      const nextPracticeDate = new Date();
      nextPracticeDate.setHours(nextPracticeDate.getHours() + (INTERVAL_MAP[currentStage] || 24));
      onSaveProgress(task.id, {
        learningStage: nextStage,
        peeksCount,
        lastPracticed: new Date().toISOString(),
        nextDue: nextPracticeDate.toISOString(),
        drafts: progress.drafts || {},
        history: [
          ...(progress.history || []),
          {
            date: new Date().toISOString(),
            success: true,
            stageBefore: currentStage,
            stageAfter: nextStage,
            timeSpentSec: currentStage === 6 ? task.timeLimitMin * 60 - timerSec : undefined,
          },
        ],
      });
      setTimeout(() => {
        setCurrentStage(nextStage);
        setShowLevelUp(false);
      }, 1800);
    } else {
      onSaveProgress(task.id, {
        ...progress,
        learningStage: currentStage,
        lastPracticed: new Date().toISOString(),
        history: [
          ...(progress.history || []),
          {
            date: new Date().toISOString(),
            success: false,
            stageBefore: currentStage,
            stageAfter: currentStage,
          },
        ],
      });
    }
  };

  const handlePeek = useCallback(() => {
    if (currentStage === 6) return;
    const newCount = peeksCount + 1;
    setPeeksCount(newCount);
    setPeekOpen(prev => !prev);
    onSaveProgress(task.id, { ...progress, peeksCount: newCount });
  }, [currentStage, peeksCount, task.id, progress, onSaveProgress]);

  const handleReset = () => {
    if (!window.confirm(t.resetConfirm)) return;
    const initialCode = getInitialCode(currentStage, task);
    setCode(initialCode);
    const newDrafts = { ...(progress.drafts || {}) };
    delete newDrafts[currentStage];
    onSaveProgress(task.id, { ...progress, drafts: newDrafts });
    if (currentStage === 6) {
      setTimerSec(task.timeLimitMin * 60);
      setExamActive(true);
      setRunResults(null);
    }
  };

  const handleRetry = () => {
    setTimerSec(task.timeLimitMin * 60);
    setExamActive(true);
    setRunResults(null);
  };

  const handleStageDotClick = (num: number) => {
    if (num <= progress.learningStage) setCurrentStage(num);
  };

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const hasEditor = currentStage >= 2 && currentStage <= 6;
        if (hasEditor && !isRunning) {
          e.preventDefault();
          handleRunTests();
        }
      }
      if (e.key === 'Escape' && currentStage === 3) {
        e.preventDefault();
        handlePeek();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isRunning, currentStage, handleRunTests, handlePeek]);

  // ── Derived state ───────────────────────────────────────────────────────
  const stageHeader = t.stageHeaders[Math.min(currentStage - 1, t.stageHeaders.length - 1)] || { title: '', desc: '' };

  const personalBestSec = useMemo(() => {
    const history = progress.history || [];
    const examSuccesses = history.filter(h => h.success && h.stageBefore === 6 && h.timeSpentSec !== undefined);
    if (examSuccesses.length === 0) return null;
    return Math.min(...examSuccesses.map(h => h.timeSpentSec as number));
  }, [progress.history]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* ── Top Navbar ── */}
      <header
        className="sticky top-0 z-40 px-5 py-3 flex items-center justify-between border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${diffBadge(task.difficulty)}`}
              >
                {task.difficulty}
              </span>
              {progress.learningStage >= 7 && <span className="badge-accent">{t.mastered}</span>}
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {task.title}
              </h1>
            </div>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t.id} {task.id} · {t.category} {task.block}
            </p>
          </div>
        </div>

        {/* Stage dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={num}
                onClick={() => handleStageDotClick(num)}
                disabled={num > progress.learningStage}
                title={t.stageLabel(num)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all font-mono"
                style={
                  currentStage === num
                    ? { background: 'var(--accent)', color: '#000', boxShadow: '0 0 12px rgba(var(--accent-rgb), 0.4)' }
                    : num < progress.learningStage
                      ? {
                          background: 'rgba(var(--accent-rgb), 0.15)',
                          color: 'var(--accent)',
                          border: '1px solid rgba(var(--accent-rgb), 0.3)',
                        }
                      : {
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border)',
                          cursor: 'not-allowed',
                          opacity: 0.5,
                        }
                }
              >
                {num}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Stage info bar ── */}
      <div
        className="px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b"
        style={{ background: 'rgba(var(--accent-rgb), 0.04)', borderColor: 'rgba(var(--accent-rgb), 0.15)' }}
      >
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {stageHeader.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {stageHeader.desc}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 text-xs font-semibold shrink-0 px-4 py-2 rounded-lg border font-mono"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          {currentStage === 6 && (
            <div className="flex items-center gap-1.5 animate-pulse" style={{ color: 'var(--neon-red)' }}>
              <Clock className="w-4 h-4" />
              <span>
                {t.examTimer} {formatTime(timerSec)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" style={{ color: 'var(--neon-amber)' }} />
            <span>
              {t.peeksLabel}{' '}
              <span className="font-bold" style={{ color: 'var(--neon-amber)' }}>
                {peeksCount}
              </span>
            </span>
          </div>
          <div>
            <span>
              {t.maxTime}{' '}
              <span style={{ color: 'var(--text-primary)' }}>
                {task.timeLimitMin} {t.minSuffix}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Main workspace ── */}
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
        style={{ height: 'calc(100vh - 130px)' }}
      >
        {/* Left panel — stage-dependent content */}
        <div
          className="lg:col-span-5 border-r overflow-y-auto flex flex-col"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {currentStage === 1 && <StageStudy task={task} t={t} onStartPractice={handleStartPractice} />}
          {currentStage === 2 && (
            <StageRetype task={task} t={t} showComments={showComments} onToggleComments={setShowComments} />
          )}
          {currentStage > 2 && currentStage < 6 && (
            <StageHint
              task={task}
              t={t}
              peekOpen={peekOpen}
              showComments={showComments}
              onPeek={handlePeek}
              onToggleComments={setShowComments}
            />
          )}
          {currentStage === 6 && (
            <StageExam
              task={task}
              t={t}
              examActive={examActive}
              timerSec={timerSec}
              formatTime={formatTime}
              onRetry={handleRetry}
              personalBestSec={personalBestSec}
            />
          )}
        </div>

        {/* Right panel — Monaco Editor + test console */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden" style={{ background: 'var(--bg-base)' }}>
          {/* Editor header */}
          <div
            className="px-4 py-2.5 flex items-center justify-between border-b text-xs font-mono"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--neon-green)' }} />
              solution.js
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 transition-colors hover:text-orange-400"
              title={t.resetCode}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.resetCode}
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-[200px]">
            {currentStage > 1 && currentStage < 7 && (
              <CodeEditor
                height="100%"
                language="javascript"
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
              />
            )}
            {currentStage === 7 && <StageMastered t={t} peeksCount={peeksCount} />}
            {currentStage === 1 && (
              <div
                className="w-full h-full flex flex-col items-center justify-center text-center p-8"
                style={{ background: 'var(--bg-base)', color: 'var(--text-secondary)' }}
              >
                <Terminal className="w-12 h-12 mb-3" style={{ color: 'var(--accent)' }} />
                <h4 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {t.stage1Title}
                </h4>
                <p className="text-xs max-w-sm" style={{ color: 'var(--text-muted)' }}>
                  {t.stage1Right}
                </p>
              </div>
            )}
          </div>

          {/* Test console */}
          <TestConsole
            currentStage={currentStage}
            isRunning={isRunning}
            runResults={runResults}
            t={t}
            onRunTests={handleRunTests}
          />
        </div>
      </div>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(13,0,21,0.85)] pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="px-8 py-6 border-4 border-[var(--neon-green)] bg-[var(--bg-surface)] shadow-[0_0_40px_rgba(0,255,65,0.4)] text-center relative max-w-sm flex flex-col items-center"
            >
              {/* Particle glow ring behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon-green)] to-[var(--neon-cyan)] blur-[25px] opacity-15 rounded-lg -z-10" />

              {/* Blinking game badge */}
              <span className="text-4xl animate-bounce mb-2">⭐</span>

              {/* Pixelated title */}
              <h2 className="text-xl font-black tracking-widest text-[var(--neon-green)] drop-shadow-[0_0_10px_rgba(0,255,65,0.5)] uppercase font-mono">
                STAGE PASSED
              </h2>

              <div className="h-0.5 w-32 bg-[var(--neon-green)] my-3 opacity-60 animate-pulse" />

              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.2em] font-mono">
                {lang === 'uk' ? 'РІВЕНЬ ПІДВИЩЕНО' : 'LEVEL UP'}
              </p>

              <p className="text-[12px] text-[var(--neon-cyan)] mt-2 font-bold tracking-wider font-mono">
                {lang === 'uk'
                  ? `Етап ${currentStage} → ${currentStage === 6 ? 7 : currentStage + 1}`
                  : `Stage ${currentStage} → ${currentStage === 6 ? 7 : currentStage + 1}`}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
