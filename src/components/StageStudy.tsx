import React from 'react';
import { CodeEditor } from './CodeEditor';
import { DrillTask } from '../types';
import { T } from '../i18n';
import { BookOpen, CheckCircle, Zap } from 'lucide-react';

interface Props {
  task: DrillTask;
  t: T;
  onStartPractice: () => void;
}

const StageStudy: React.FC<Props> = ({ task, t, onStartPractice }) => (
  <>
    <div className="p-4 border-b" style={{ borderColor: 'var(--border-muted)', background: 'rgba(249,115,22,0.06)' }}>
      <button onClick={onStartPractice}
        className="btn-glow w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-sm transition-all"
        style={{ background: 'var(--accent)', color: '#000' }}>
        <Zap className="w-4 h-4" />
        {t.startPracticeBtn}
      </button>
    </div>
    <div className="p-5 flex flex-col gap-5 flex-1">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          <BookOpen className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          {t.taskCondition}
        </h3>
        <div className="code-block text-sm">{task.description.replace(/^(Источник|Source):.*$/m, '').trim()}</div>
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
        <div className="code-block text-xs">{task.breakdown}</div>
      </div>
    </div>
  </>
);

export default StageStudy;
