import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from './CodeEditor';
import { DrillTask, UserProgress } from '../types';
import { runTestsInWorker, RunResults } from '../runner/testRunner';
import { getT, Lang } from '../i18n';
import {
  Play, Eye, EyeOff, RotateCcw, ArrowLeft,
  CheckCircle, AlertTriangle, Clock, Zap, BookOpen, Terminal
} from 'lucide-react';

interface TaskViewProps {
  task: DrillTask;
  progress: UserProgress;
  onSaveProgress: (taskId: string, updatedProgress: UserProgress) => void;
  onBack: () => void;
  lang?: Lang;
}

function stripComments(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip comment-only lines completely
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/'))) {
      continue;
    }
    // Remove inline comments
    let clean = line.replace(/(^|[^:])\/\/.*$/, '$1').trimEnd();
    result.push(clean);
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 cursor-pointer select-none group"
    >
      <span className="text-[11px] font-bold tracking-wider uppercase transition-colors group-hover:text-[var(--text-primary)]" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <div 
        className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${
          checked ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-[#18181b] border border-[#2d2d30]'
        }`}
      >
        <div 
          className={`w-3.5 h-3.5 rounded-full bg-[#e4e4e7] transition-transform duration-200 ease-in-out transform ${
            checked ? 'translate-x-4 bg-white' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

export const TaskView: React.FC<TaskViewProps> = ({ task, progress, onSaveProgress, onBack, lang = 'uk' as Lang }) => {
  const t = getT(lang);

  const [currentStage, setCurrentStage] = useState<number>(progress.learningStage || 1);
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResults, setRunResults] = useState<RunResults | null>(null);

  const [peekOpen, setPeekOpen] = useState<boolean>(false);
  const [peeksCount, setPeeksCount] = useState<number>(progress.peeksCount || 0);
  const [showComments, setShowComments] = useState<boolean>(false);

  const [timerSec, setTimerSec] = useState<number>(0);
  const [examActive, setExamActive] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // ── Init code on stage/task change ───────────────────────────────────────
  useEffect(() => {
    const draft = progress.drafts?.[currentStage];
    if (draft !== undefined) {
      setCode(draft);
      if (currentStage === 6) { setTimerSec(task.timeLimitMin * 60); setExamActive(true); }
    } else {
      if (currentStage === 2) setCode('// Перепишіть рішення сюди руками\n\n');
      else if (currentStage === 3) setCode(task.clozeSteps?.[0] || task.starter || '');
      else if (currentStage === 4) setCode(task.clozeSteps?.[1] || task.starter || '');
      else if (currentStage === 5) setCode(task.clozeSteps?.[2] || task.starter || '');
      else if (currentStage === 6) { setCode(task.starter || ''); setTimerSec(task.timeLimitMin * 60); setExamActive(true); }
    }
    setRunResults(null);
    setPeekOpen(false);
  }, [currentStage, task.id]);

  // ── Exam timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentStage === 6 && examActive) {
      timerRef.current = setInterval(() => {
        setTimerSec(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); setExamActive(false); handleExamTimeout(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentStage, examActive]);

  const handleExamTimeout = () => {
    setRunResults({ success: false, error: 'Час вичерпано! Ви перевищили ліміт часу.', results: [] });
    onSaveProgress(task.id, {
      ...progress, learningStage: 6, lastPracticed: new Date().toISOString(),
      history: [...(progress.history || []), { date: new Date().toISOString(), success: false, stageBefore: 6, stageAfter: 6, timeSpentSec: task.timeLimitMin * 60 }],
    });
  };

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
    setIsRunning(true); setRunResults(null);
    const testResult = await runTestsInWorker(code, task.testCode);
    setRunResults(testResult);
    setIsRunning(false);

    if (testResult.success) {
      let nextStage = currentStage;
      const intervalMap: Record<number, number> = { 2: 1, 3: 24, 4: 72, 5: 168, 6: 720 };
      if (currentStage >= 2 && currentStage <= 6) {
        nextStage = currentStage === 6 ? 7 : currentStage + 1;
        if (currentStage === 6) setExamActive(false);
      }
      const nextPracticeDate = new Date();
      nextPracticeDate.setHours(nextPracticeDate.getHours() + (intervalMap[currentStage] || 24));
      onSaveProgress(task.id, {
        learningStage: nextStage, peeksCount, lastPracticed: new Date().toISOString(),
        nextDue: nextPracticeDate.toISOString(), drafts: progress.drafts || {},
        history: [...(progress.history || []), { date: new Date().toISOString(), success: true, stageBefore: currentStage, stageAfter: nextStage, timeSpentSec: currentStage === 6 ? (task.timeLimitMin * 60 - timerSec) : undefined }],
      });
      setTimeout(() => setCurrentStage(nextStage), 1500);
    } else {
      onSaveProgress(task.id, {
        ...progress, learningStage: currentStage, lastPracticed: new Date().toISOString(),
        history: [...(progress.history || []), { date: new Date().toISOString(), success: false, stageBefore: currentStage, stageAfter: currentStage }],
      });
    }
  };

  const handlePeek = () => {
    if (currentStage === 6) return;
    const newCount = peeksCount + 1;
    setPeeksCount(newCount);
    setPeekOpen(!peekOpen);
    onSaveProgress(task.id, { ...progress, peeksCount: newCount });
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const stageHeader = t.stageHeaders[Math.min(currentStage - 1, t.stageHeaders.length - 1)] || { title: '', desc: '' };

  const diffBadge = (d: string) => {
    if (d === 'junior') return 'bg-green-950/60 text-green-400 border border-green-800/60';
    if (d === 'senior') return 'bg-red-950/60 text-red-400 border border-red-800/60';
    return 'bg-amber-950/60 text-amber-400 border border-amber-800/60';
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* ── Top Navbar ── */}
      <header className="sticky top-0 z-40 px-5 py-3 flex items-center justify-between border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${diffBadge(task.difficulty)}`}>{task.difficulty}</span>
              {progress.learningStage >= 7 && (
                <span className="badge-accent">{t.mastered}</span>
              )}
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{task.title}</h1>
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
              <button key={num}
                onClick={() => { if (num <= progress.learningStage) setCurrentStage(num); }}
                disabled={num > progress.learningStage}
                title={t.stageLabel(num)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all font-mono"
                style={currentStage === num
                  ? { background: 'var(--accent)', color: '#000', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }
                  : num < progress.learningStage
                  ? { background: 'rgba(249,115,22,0.15)', color: 'var(--accent)', border: '1px solid rgba(249,115,22,0.3)' }
                  : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'not-allowed', opacity: 0.5 }
                }
              >
                {num}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Stage info bar ── */}
      <div className="px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b"
        style={{ background: 'rgba(249,115,22,0.04)', borderColor: 'rgba(249,115,22,0.15)' }}>
        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stageHeader.title}</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stageHeader.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold shrink-0 px-4 py-2 rounded-lg border font-mono"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          {currentStage === 6 && (
            <div className="flex items-center gap-1.5 animate-pulse" style={{ color: '#ef4444' }}>
              <Clock className="w-4 h-4" />
              <span>{t.examTimer} {formatTime(timerSec)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" style={{ color: 'var(--amber)' }} />
            <span>{t.peeksLabel} <span className="font-bold" style={{ color: 'var(--amber)' }}>{peeksCount}</span></span>
          </div>
          <div>
            <span>{t.maxTime} <span style={{ color: 'var(--text-primary)' }}>{task.timeLimitMin} {t.minSuffix}</span></span>
          </div>
        </div>
      </div>

      {/* ── Main workspace ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden" style={{ height: 'calc(100vh - 130px)' }}>

        {/* Left panel — description + reference */}
        <div className="lg:col-span-5 border-r overflow-y-auto flex flex-col" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>

          {/* ── Stage 1: study view ── */}
          {currentStage === 1 && (
            <>
              {/* START PRACTICE BUTTON — top, always visible */}
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-muted)', background: 'rgba(249,115,22,0.06)' }}>
                <button onClick={handleStartPractice}
                  className="btn-glow w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-sm transition-all"
                  style={{ background: 'var(--accent)', color: '#000' }}>
                  <Zap className="w-4 h-4" />
                  {t.startPracticeBtn}
                </button>
              </div>

              {/* Description */}
              <div className="p-5 flex flex-col gap-5 flex-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    {t.taskCondition}
                  </h3>
                  <div className="code-block text-sm">
                    {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--green)' }} />
                    {t.referenceSolution}
                  </h3>
                  <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)', height: '220px' }}>
                    <CodeEditor height="100%" language="javascript" value={task.solution} readOnly theme="vs-dark" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {t.logicBreakdown}
                  </h3>
                  <div className="code-block text-xs">
                    {task.breakdown}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Stage 2: retype reference ── */}
          {currentStage === 2 && (
            <div className="flex-1 flex flex-col p-5 gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: 'var(--green)' }} />
                  {t.copyForRetyping}
                </h3>
                <ToggleSwitch checked={showComments} onChange={setShowComments} label="Коментарі" />
              </div>

              {/* Description reminder */}
              <div className="code-block text-xs" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
              </div>

              <div className="flex-1 border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)', minHeight: '240px' }}>
                <CodeEditor height="100%" language="javascript" value={showComments ? task.solution : stripComments(task.solution)} readOnly theme="vs-dark" />
              </div>
            </div>
          )}

          {/* ── Stages 3-5: hint panel ── */}
          {currentStage > 2 && currentStage < 6 && (
            <div className="flex-1 flex flex-col p-5 gap-4">
              {/* Description always visible */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <BookOpen className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  {t.taskCondition}
                </h3>
                <div className="code-block text-xs" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {t.hint}
                </h3>
                <div className="flex items-center gap-3">
                  {peekOpen && (
                    <ToggleSwitch checked={showComments} onChange={setShowComments} label="Коментарі" />
                  )}
                  <button onClick={handlePeek}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                    style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)', color: 'var(--amber)' }}>
                    {peekOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {peekOpen ? t.hideHint : t.peekSolution}
                  </button>
                </div>
              </div>

              {peekOpen ? (
                <div className="flex-1 border rounded-xl overflow-hidden" style={{ borderColor: 'rgba(245,158,11,0.3)', minHeight: '200px' }}>
                  <CodeEditor height="100%" language="javascript" value={showComments ? task.solution : stripComments(task.solution)} readOnly theme="vs-dark" />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>{t.solutionHidden}</h4>
                  <p className="text-xs max-w-xs mb-4" style={{ color: 'var(--text-muted)' }}>{t.solutionHiddenDesc}</p>
                  <button onClick={handlePeek}
                    className="text-xs font-bold px-4 py-2 rounded-lg transition-all"
                    style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    {t.peekAnyway}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Stage 6: exam panel ── */}
          {currentStage === 6 && (
            <div className="flex-1 flex flex-col p-5 gap-4">
              {/* Description visible even in exam */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <BookOpen className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  {t.taskCondition}
                </h3>
                <div className="code-block text-xs" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center border rounded-xl p-6 text-center"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                {!examActive && timerSec === 0 ? (
                  <>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-red-500 mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
                      <Clock className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.timeExpired}</h4>
                    <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{t.timeExpiredDesc(task.timeLimitMin)}</p>
                    <button onClick={() => { setTimerSec(task.timeLimitMin * 60); setExamActive(true); setRunResults(null); }}
                      className="btn-glow text-xs font-bold py-2.5 px-4 rounded-xl transition-all" style={{ background: 'var(--accent)', color: '#000' }}>
                      {t.retryExam}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 animate-pulse" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                      <Clock className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.examActive}</h4>
                    <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{t.examActiveDesc}</p>
                    <div className="text-sm font-mono font-bold px-4 py-2 rounded-lg border" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
                      {t.currentTime} {formatTime(timerSec)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — Monaco Editor + test console */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden" style={{ background: '#0d0d0d' }}>

          {/* Editor header */}
          <div className="px-4 py-2.5 flex items-center justify-between border-b text-xs font-mono"
            style={{ background: '#111111', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green)' }} />
              solution.js
            </span>
            <button
              onClick={() => {
                if (window.confirm(t.resetConfirm)) {
                  let initialCode = '';
                  if (currentStage === 2) initialCode = '// Перепишіть рішення сюди руками\n\n';
                  else if (currentStage === 3) initialCode = task.clozeSteps?.[0] || task.starter || '';
                  else if (currentStage === 4) initialCode = task.clozeSteps?.[1] || task.starter || '';
                  else if (currentStage === 5) initialCode = task.clozeSteps?.[2] || task.starter || '';
                  else if (currentStage === 6) initialCode = task.starter || '';
                  setCode(initialCode);
                  const newDrafts = { ...(progress.drafts || {}) };
                  delete newDrafts[currentStage];
                  onSaveProgress(task.id, { ...progress, drafts: newDrafts });
                  if (currentStage === 6) { setTimerSec(task.timeLimitMin * 60); setExamActive(true); setRunResults(null); }
                }
              }}
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
              <CodeEditor height="100%" language="javascript" value={code} onChange={handleCodeChange} theme="vs-dark" />
            )}
            {currentStage === 7 && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ background: '#0d0d0d', color: 'var(--text-secondary)' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--green)' }}>
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.masteredFull}</h4>
                <p className="text-sm max-w-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{t.masterySummary}</p>
                <div className="px-6 py-4 rounded-xl text-xs text-left w-full max-w-xs font-mono space-y-2 border"
                  style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'var(--border)' }}>
                  <div className="font-bold mb-1 uppercase tracking-wider text-[10px]" style={{ color: 'var(--accent)' }}>{t.masteryResults}</div>
                  {[
                    [t.masteryStatus, t.masteryStatusVal, 'var(--green)'],
                    [t.masteryPeeks, String(peeksCount), 'var(--text-primary)'],
                    [t.masteryRepeat, t.masteryRepeatVal, 'var(--text-primary)'],
                  ].map(([k, v, c]) => (
                    <div key={k} className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                      <span className="font-bold" style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStage === 1 && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ background: '#0d0d0d', color: 'var(--text-secondary)' }}>
                <Terminal className="w-12 h-12 mb-3" style={{ color: 'var(--accent)' }} />
                <h4 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t.stage1Title}</h4>
                <p className="text-xs max-w-sm" style={{ color: 'var(--text-muted)' }}>{t.stage1Right}</p>
              </div>
            )}
          </div>

          {/* Test console */}
          <div className="border-t flex flex-col" style={{ background: '#090909', borderColor: 'var(--border)', height: '240px' }}>
            <div className="px-4 py-2 border-b flex items-center justify-between text-xs font-mono"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                {t.testConsole}
              </span>
              {currentStage > 1 && currentStage < 7 && (
                <button onClick={handleRunTests} disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={isRunning
                    ? { background: 'var(--bg-elevated)', color: 'var(--text-muted)', cursor: 'not-allowed' }
                    : { background: 'var(--accent)', color: '#000' }}>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isRunning ? t.running : t.runTests}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              {currentStage === 7 ? (
                <div className="flex items-center justify-center h-full text-center max-w-sm mx-auto leading-relaxed"
                  style={{ color: 'var(--accent)' }}>{t.intervalDone}</div>
              ) : currentStage === 1 ? (
                <div className="flex items-center justify-center h-full italic" style={{ color: 'var(--text-muted)' }}>{t.testsOnPractice}</div>
              ) : isRunning ? (
                <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: 'var(--accent)' }}>
                  <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                  <span>{t.runningWorker}</span>
                </div>
              ) : runResults ? (
                <div className="space-y-2">
                  {runResults.error && (
                    <div className="p-3 rounded-lg flex items-start gap-2.5 border"
                      style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)', color: '#f87171' }}>
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="whitespace-pre-wrap leading-relaxed">{runResults.error}</div>
                    </div>
                  )}
                  {runResults.results?.map((r, i) => (
                    <div key={i}
                      className="p-2.5 rounded-lg border flex items-start justify-between gap-4"
                      style={r.success
                        ? { background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)', color: '#4ade80' }
                        : { background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
                      <div className="flex items-start gap-2">
                        <span className="font-bold">{r.success ? '✔' : '✘'}</span>
                        <div>
                          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{r.name}</span>
                          {!r.success && r.error && (
                            <p className="mt-1 text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: '#fca5a5' }}>
                              {t.testError} {r.error}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md`}
                        style={r.success ? { background: 'rgba(34,197,94,0.12)' } : { background: 'rgba(239,68,68,0.12)' }}>
                        {r.success ? t.testPassed : t.testFailed}
                      </span>
                    </div>
                  ))}
                  {runResults.success && (
                    <div className="p-3 rounded-lg border text-center font-bold"
                      style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)', color: '#4ade80' }}>
                      {t.allTestsPassed(currentStage < 6)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full italic" style={{ color: 'var(--text-muted)' }}>{t.pressRunTests}</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
