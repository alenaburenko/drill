import React from 'react';
import { RunResults } from '../runner/testRunner';
import { T } from '../i18n';
import { Play, AlertTriangle } from 'lucide-react';

interface Props {
  currentStage: number;
  isRunning: boolean;
  runResults: RunResults | null;
  t: T;
  onRunTests: () => void;
}

const TestConsole: React.FC<Props> = ({ currentStage, isRunning, runResults, t, onRunTests }) => (
  <div className="border-t flex flex-col" style={{ background: '#090909', borderColor: 'var(--border)', height: '240px' }}>
    <div className="px-4 py-2 border-b flex items-center justify-between text-xs font-mono"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
      <span className="font-bold flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        {t.testConsole}
      </span>
      {currentStage > 1 && currentStage < 7 && (
        <button onClick={onRunTests} disabled={isRunning}
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
);

export default TestConsole;
