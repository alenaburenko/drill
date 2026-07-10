import React from 'react';
import { Card, SectionHeader, Badge, Button } from './ui';
import { Plus, Upload } from 'lucide-react';
import type { DrillTask } from '../types';
import type { T } from '../i18n';

interface Props {
  t: T;
  importText: string;
  importStatus: { type: 'success' | 'error'; message: string } | null;
  newTitle: string;
  newDifficulty: 'junior' | 'middle' | 'senior';
  newCategory: string;
  newDescription: string;
  newStarter: string;
  newSolution: string;
  newCloze1: string;
  newCloze2: string;
  newCloze3: string;
  newBreakdown: string;
  newTestCode: string;
  onSetImportText: (v: string) => void;
  onSetNewTitle: (v: string) => void;
  onSetNewDifficulty: (v: 'junior' | 'middle' | 'senior') => void;
  onSetNewCategory: (v: string) => void;
  onSetNewDescription: (v: string) => void;
  onSetNewStarter: (v: string) => void;
  onSetNewSolution: (v: string) => void;
  onSetNewCloze1: (v: string) => void;
  onSetNewCloze2: (v: string) => void;
  onSetNewCloze3: (v: string) => void;
  onSetNewBreakdown: (v: string) => void;
  onSetNewTestCode: (v: string) => void;
  onImportJSON: (e: React.FormEvent) => void;
  onCreateTask: (e: React.FormEvent) => void;
}

export default function UploadPanel({
  t,
  importText,
  importStatus,
  newTitle,
  newDifficulty,
  newCategory,
  newDescription,
  newStarter,
  newSolution,
  newCloze1,
  newCloze2,
  newCloze3,
  newBreakdown,
  newTestCode,
  onSetImportText,
  onSetNewTitle,
  onSetNewDifficulty,
  onSetNewCategory,
  onSetNewDescription,
  onSetNewStarter,
  onSetNewSolution,
  onSetNewCloze1,
  onSetNewCloze2,
  onSetNewCloze3,
  onSetNewBreakdown,
  onSetNewTestCode,
  onImportJSON,
  onCreateTask,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* JSON import */}
      <div className="lg:col-span-7" style={{ height: '100%' }}>
        <Card padding="lg" className="flex flex-col gap-4 h-full">
          <SectionHeader icon={<Upload className="w-4 h-4" />} title={t.importJson} subtitle={t.importJsonDesc} />

          <form onSubmit={onImportJSON} className="flex-1 flex flex-col gap-4">
            <textarea
              rows={12}
              value={importText}
              onChange={e => onSetImportText(e.target.value)}
              placeholder={`[\n  {\n    "id": "my-task",\n    "block": "javascript",\n    "title": "My Task",\n    "starter": "function f() {}",\n    "solution": "function f() { return true; }",\n    "clozeSteps": ["...step1...", "...step2...", "...step3..."],\n    "testCode": "test('case', () => { assertEqual(f(), true); });",\n    "difficulty": "middle"\n  }\n]`}
              className="rounded-xl p-4 text-xs font-mono outline-none border resize-none"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />

            {importStatus && (
              <Badge variant={importStatus.type === 'success' ? 'success' : 'danger'} size="md">
                {importStatus.message}
              </Badge>
            )}

            <Button type="submit" variant="primary" size="lg" glow>
              {t.importBtn}
            </Button>
          </form>
        </Card>
      </div>

      {/* Manual create */}
      <div className="lg:col-span-5" style={{ height: '100%' }}>
        <Card padding="lg">
          <SectionHeader
            icon={<Plus className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />}
            title={t.createTask}
            subtitle={t.createTaskDesc}
          />

          <form onSubmit={onCreateTask} className="space-y-3 text-xs">
            {[
              {
                label: t.taskTitle,
                required: true,
                val: newTitle,
                set: onSetNewTitle,
                ph: t.taskTitlePlaceholder,
                rows: 0,
              },
              {
                label: t.descriptionLabel,
                required: false,
                val: newDescription,
                set: onSetNewDescription,
                ph: t.descriptionPlaceholder,
                rows: 3,
              },
            ].map(({ label, required, val, set, ph, rows }) => (
              <div key={label}>
                <label
                  className="block font-bold mb-1 uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                </label>
                {rows > 0 ? (
                  <textarea
                    rows={rows}
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder={ph}
                    className="w-full rounded-xl px-3 py-2 outline-none border"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    required={required}
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder={ph}
                    className="w-full rounded-xl px-3 py-2 outline-none border"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block font-bold mb-1 uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t.categoryBlock}
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => onSetNewCategory(e.target.value)}
                  placeholder="javascript"
                  className="w-full rounded-xl px-3 py-2 outline-none border"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label
                  className="block font-bold mb-1 uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t.difficulty}
                </label>
                <select
                  value={newDifficulty}
                  onChange={e => onSetNewDifficulty(e.target.value as 'junior' | 'middle' | 'senior')}
                  className="w-full rounded-xl px-3 py-2 outline-none border"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h4
                className="font-bold uppercase tracking-wider border-b pb-1 text-[10px]"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
              >
                {t.codeTemplates}
              </h4>
              {[
                { label: t.starterLabel, val: newStarter, set: onSetNewStarter },
                { label: t.solutionLabel, val: newSolution, set: onSetNewSolution },
                { label: t.clozeLabel1, val: newCloze1, set: onSetNewCloze1 },
                { label: t.clozeLabel2, val: newCloze2, set: onSetNewCloze2 },
                { label: t.clozeLabel3, val: newCloze3, set: onSetNewCloze3 },
                { label: t.testCodeLabel, val: newTestCode, set: onSetNewTestCode },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="block mb-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </label>
                  <textarea
                    rows={2}
                    value={val}
                    onChange={e => set(e.target.value)}
                    className="w-full rounded-xl p-2 font-mono text-[10px] outline-none border resize-none"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              ))}
            </div>

            {importStatus && (
              <Badge variant={importStatus.type === 'success' ? 'success' : 'danger'} size="md">
                {importStatus.message}
              </Badge>
            )}

            <Button type="submit" variant="success" size="md" glow className="w-full">
              {t.createSaveBtn}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
