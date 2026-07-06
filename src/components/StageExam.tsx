import React from 'react';
import { DrillTask } from '../types';
import { T } from '../i18n';
import { BookOpen, Clock } from 'lucide-react';

interface Props {
  task: DrillTask;
  t: T;
  examActive: boolean;
  timerSec: number;
  formatTime: (s: number) => string;
  onRetry: () => void;
}

const StageExam: React.FC<Props> = ({ task, t, examActive, timerSec, formatTime, onRetry }) => (
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
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-red-500 mb-4"
            style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Clock className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.timeExpired}</h4>
          <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
            {t.timeExpiredDesc(task.timeLimitMin)}
          </p>
          <button onClick={onRetry}
            className="btn-glow text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
            style={{ background: 'var(--accent)', color: '#000' }}>
            {t.retryExam}
          </button>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 animate-pulse"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            <Clock className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t.examActive}</h4>
          <p className="text-xs max-w-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{t.examActiveDesc}</p>
          <div className="text-sm font-mono font-bold px-4 py-2 rounded-lg border"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
            {t.currentTime} {formatTime(timerSec)}
          </div>
        </>
      )}
    </div>
  </div>
);

export default StageExam;
