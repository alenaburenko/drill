import React from 'react';
import { Card, SectionHeader, Button } from './ui';
import { Database, Download, Upload } from 'lucide-react';
import type { T } from '../i18n';

interface Props {
  t: T;
  progressBackupString: string;
  onGenerateBackup: () => void;
  onRestore: (backupStr: string) => void;
}

export default function BackupPanel({ t, progressBackupString, onGenerateBackup, onRestore }: Props) {
  return (
    <Card padding="lg">
      <SectionHeader
        icon={<Database className="w-4 h-4" />}
        title={t.exportImport}
        subtitle={t.exportImportDesc}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{t.backupTitle}</h4>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.backupDesc}</p>
          <Button onClick={onGenerateBackup} variant="primary" size="md" glow className="flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            {t.generateBackup}
          </Button>
          {progressBackupString && (
            <textarea readOnly rows={8} value={progressBackupString} onClick={e => (e.currentTarget as HTMLTextAreaElement).select()}
              className="w-full rounded-xl p-4 text-xs font-mono resize-none outline-none border"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--accent)' }} />
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{t.restoreTitle}</h4>
          <p className="text-xs font-mono" style={{ color: 'var(--amber)' }}>{t.restoreWarning}</p>
          <textarea id="progress-import-textarea" rows={6} placeholder={t.restorePlaceholder}
            className="w-full rounded-xl p-4 text-xs font-mono resize-none outline-none border"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <Button
            onClick={() => {
              const val = (document.getElementById('progress-import-textarea') as HTMLTextAreaElement)?.value;
              if (val) { if (window.confirm(t.restoreConfirm)) onRestore(val); }
              else alert(t.pasteFirst);
            }}
            variant="success" size="md" glow className="flex items-center gap-1.5 w-full justify-center"
            style={{ background: 'var(--green)', color: '#000' }}
          >
            <Upload className="w-4 h-4" />
            {t.restoreBtn}
          </Button>
        </div>
      </div>
    </Card>
  );
}
