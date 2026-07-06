import React from 'react';
import { T } from '../i18n';
import { CheckCircle } from 'lucide-react';

interface Props {
  t: T;
  peeksCount: number;
}

const StageMastered: React.FC<Props> = ({ t, peeksCount }) => (
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
        <div key={k as string} className="flex justify-between">
          <span style={{ color: 'var(--text-muted)' }}>{k}</span>
          <span className="font-bold" style={{ color: c as string }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

export default StageMastered;
