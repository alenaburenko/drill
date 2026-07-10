import React from 'react';
import { CodeEditor } from './CodeEditor';
import { DrillTask } from '../types';
import { T } from '../i18n';
import { ToggleSwitch } from './ToggleSwitch';
import { stripComments } from '../utils/stripComments';
import { CheckCircle, BookOpen } from 'lucide-react';

interface Props {
  task: DrillTask;
  t: T;
  showComments: boolean;
  onToggleComments: (v: boolean) => void;
}

const StageRetype: React.FC<Props> = ({ task, t, showComments, onToggleComments }) => (
  <div className="flex-1 flex flex-col p-5 gap-3">
    <div className="flex items-center justify-between">
      <h3
        className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
      >
        <CheckCircle className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />
        {t.copyForRetyping}
      </h3>
      <ToggleSwitch checked={showComments} onChange={onToggleComments} label="Коментарі" />
    </div>
    <div className="code-block text-xs" style={{ maxHeight: '100px', overflowY: 'auto' }}>
      {task.description.replace(/^(Источник|Source):.*$/m, '').trim()}
    </div>
    <div
      className="flex-1 border rounded-xl overflow-hidden"
      style={{ borderColor: 'var(--border)', minHeight: '240px' }}
    >
      <CodeEditor
        height="100%"
        language="javascript"
        value={showComments ? task.solution : stripComments(task.solution)}
        readOnly
        theme="vs-dark"
      />
    </div>
  </div>
);

export default StageRetype;
