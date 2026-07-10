import React from 'react';
import { DrillTask } from '../types';
import { T } from '../i18n';
import { Button } from './ui';
import { BookOpen, Clock } from 'lucide-react';

interface Props {
  task: DrillTask;
  t: T;
  examActive: boolean;
  timerSec: number;
  formatTime: (s: number) => string;
  onRetry: () => void;
  personalBestSec?: number | null;
}

const StageExam: React.FC<Props> = ({ task, t, examActive, timerSec, formatTime, onRetry, personalBestSec }) => {
  const elapsedSec = task.timeLimitMin * 60 - timerSec;

  return (
    <div className="flex-1 flex flex-col p-5 gap-4">
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
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'rgba(var(--neon-red-rgb), 0.1)', color: 'var(--neon-red)' }}>
              <Clock className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.timeExpired}</h4>
            <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              {t.timeExpiredDesc(task.timeLimitMin)}
            </p>
            <Button onClick={onRetry} variant="primary" size="md" glow>
              {t.retryExam}
            </Button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 animate-pulse"
              style={{ background: 'rgba(var(--neon-red-rgb), 0.12)', color: 'var(--neon-red)' }}>
              <Clock className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.examActive}</h4>
            <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{t.examActiveDesc}</p>
            <div className="text-sm font-mono font-bold px-4 py-2 rounded-lg border"
              style={{ color: 'var(--neon-red)', background: 'rgba(var(--neon-red-rgb), 0.08)', borderColor: 'rgba(var(--neon-red-rgb), 0.25)' }}>
              {t.currentTime} {formatTime(timerSec)}
            </div>

            {/* Speedrun vs GhostPB panel */}
            {personalBestSec !== undefined && personalBestSec !== null && (
              <div className="w-full mt-5 p-4 border rounded-lg flex flex-col gap-2.5 font-mono text-[10px] text-left"
                style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  <span>👻 Speedrun Ghost</span>
                  <span className={elapsedSec <= personalBestSec ? 'text-[var(--neon-green)]' : 'text-[var(--neon-red)]'}>
                    {elapsedSec <= personalBestSec 
                      ? `-${formatTime(personalBestSec - elapsedSec)} (AHEAD)` 
                      : `+${formatTime(elapsedSec - personalBestSec)} (BEHIND)`}
                  </span>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2 pt-1">
                  {/* User current elapsed */}
                  <div>
                    <div className="flex justify-between text-[8px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                      <span>YOU (elapsed)</span>
                      <span>{formatTime(elapsedSec)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-sm overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                      <div className="h-full bg-[var(--neon-cyan)] transition-all duration-1000 shadow-[0_0_8px_var(--neon-cyan)]"
                        style={{ width: `${Math.min(100, (elapsedSec / personalBestSec) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Personal Best target */}
                  <div>
                    <div className="flex justify-between text-[8px] mb-0.5 text-[var(--text-muted)]">
                      <span>GHOST (PB)</span>
                      <span>{formatTime(personalBestSec)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-sm overflow-hidden opacity-60 border" style={{ borderColor: 'var(--border)' }}>
                      <div className="h-full bg-[var(--neon-magenta)] shadow-[0_0_8px_var(--neon-magenta)]"
                        style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StageExam;
