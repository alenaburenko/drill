import React from 'react';
import { RunResults } from '../runner/testRunner';
import { T } from '../i18n';
import { Button, Badge, Card } from './ui';
import { Play, AlertTriangle } from 'lucide-react';

interface Props {
  currentStage: number;
  isRunning: boolean;
  runResults: RunResults | null;
  t: T;
  onRunTests: () => void;
}

const TestConsole: React.FC<Props> = ({ currentStage, isRunning, runResults, t, onRunTests }) => (
  <div
    className="border-t flex flex-col"
    style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', height: '240px' }}
  >
    <div
      className="px-4 py-2 border-b flex items-center justify-between text-xs font-mono"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      <span className="font-bold flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        {t.testConsole}
      </span>
      {currentStage > 1 && currentStage < 7 && (
        <Button
          onClick={onRunTests}
          disabled={isRunning}
          variant={isRunning ? 'secondary' : 'primary'}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isRunning ? t.running : t.runTests}
        </Button>
      )}
    </div>
    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
      {currentStage === 7 ? (
        <div
          className="flex items-center justify-center h-full text-center max-w-sm mx-auto leading-relaxed"
          style={{ color: 'var(--accent)' }}
        >
          {t.intervalDone}
        </div>
      ) : currentStage === 1 ? (
        <div className="flex items-center justify-center h-full italic" style={{ color: 'var(--text-muted)' }}>
          {t.testsOnPractice}
        </div>
      ) : isRunning ? (
        <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: 'var(--accent)' }}>
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
          <span>{t.runningWorker}</span>
        </div>
      ) : runResults ? (
        <div className="space-y-2">
          {runResults.error && (
            <Card
              padding="sm"
              className="flex items-start gap-2.5"
              style={{
                background: 'rgba(var(--neon-red-rgb), 0.08)',
                borderColor: 'rgba(var(--neon-red-rgb), 0.25)',
                color: 'var(--neon-red)',
              }}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="whitespace-pre-wrap leading-relaxed">{runResults.error}</div>
            </Card>
          )}
          {runResults.results?.map((r, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg border flex items-start justify-between gap-4"
              style={
                r.success
                  ? {
                      background: 'rgba(var(--neon-green-rgb), 0.06)',
                      borderColor: 'rgba(var(--neon-green-rgb), 0.2)',
                      color: 'var(--neon-green)',
                    }
                  : {
                      background: 'rgba(var(--neon-red-rgb), 0.06)',
                      borderColor: 'rgba(var(--neon-red-rgb), 0.2)',
                      color: 'var(--neon-red)',
                    }
              }
            >
              <div className="flex items-start gap-2">
                <span className="font-bold">{r.success ? '✔' : '✘'}</span>
                <div>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {r.name}
                  </span>
                  {!r.success && r.error && (
                    <p
                      className="mt-1 text-xs leading-relaxed whitespace-pre-wrap"
                      style={{ color: 'var(--neon-red)' }}
                    >
                      {t.testError} {r.error}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={r.success ? 'success' : 'danger'} size="sm">
                {r.success ? t.testPassed : t.testFailed}
              </Badge>
            </div>
          ))}
          {runResults.success && (
            <Card
              padding="sm"
              className="text-center font-bold"
              style={{
                background: 'rgba(var(--neon-green-rgb), 0.08)',
                borderColor: 'rgba(var(--neon-green-rgb), 0.3)',
                color: 'var(--neon-green)',
              }}
            >
              {t.allTestsPassed(currentStage < 6)}
            </Card>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full italic" style={{ color: 'var(--text-muted)' }}>
          {t.pressRunTests}
        </div>
      )}
    </div>
  </div>
);

export default TestConsole;
