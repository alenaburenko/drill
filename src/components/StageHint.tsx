import React from 'react';
import { CodeEditor } from './CodeEditor';
import { DrillTask } from '../types';
import { T } from '../i18n';
import { ToggleSwitch } from './ToggleSwitch';
import { stripComments } from '../utils/stripComments';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

interface Props {
  task: DrillTask;
  t: T;
  peekOpen: boolean;
  showComments: boolean;
  onPeek: () => void;
  onToggleComments: (v: boolean) => void;
}

const StageHint: React.FC<Props> = ({ task, t, peekOpen, showComments, onPeek, onToggleComments }) => (
  <div className="flex-1 flex flex-col p-5 gap-4">
    <div>
      <h3
        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
      >
        <BookOpen className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        {t.taskCondition}
      </h3>
      <div className="code-block text-xs" style={{ maxHeight: '120px', overflowY: 'auto' }}>
        {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
      </div>
    </div>

    <div className="flex items-center justify-between">
      <h3
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
      >
        {t.hint}
      </h3>
      <div className="flex items-center gap-3">
        {peekOpen && <ToggleSwitch checked={showComments} onChange={onToggleComments} label="Коментарі" />}
        <button
          onClick={onPeek}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
          style={{
            background: 'rgba(var(--neon-amber-rgb), 0.1)',
            borderColor: 'rgba(var(--neon-amber-rgb), 0.3)',
            color: 'var(--neon-amber)',
          }}
        >
          {peekOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {peekOpen ? t.hideHint : t.peekSolution}
        </button>
      </div>
    </div>

    {peekOpen ? (
      <div
        className="flex-1 border rounded-xl overflow-hidden"
        style={{ borderColor: 'rgba(var(--neon-amber-rgb), 0.3)', minHeight: '200px' }}
      >
        <CodeEditor
          height="100%"
          language="javascript"
          value={showComments ? task.solution : stripComments(task.solution)}
          readOnly
          theme="vs-dark"
        />
      </div>
    ) : (
      <div
        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
        >
          <EyeOff className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t.solutionHidden}
        </h4>
        <p className="text-xs max-w-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          {t.solutionHiddenDesc}
        </p>
        <button
          onClick={onPeek}
          className="text-xs font-bold px-4 py-2 rounded-lg transition-all"
          style={{
            background: 'rgba(var(--neon-amber-rgb), 0.12)',
            color: 'var(--neon-amber)',
            border: '1px solid rgba(var(--neon-amber-rgb), 0.3)',
          }}
        >
          {t.peekAnyway}
        </button>
      </div>
    )}
  </div>
);

export default StageHint;
