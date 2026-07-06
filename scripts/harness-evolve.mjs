#!/usr/bin/env node

/**
 * harness-evolve.mjs — Auto-Evolve CLI
 *
 * Commands:
 *   check              Check if auto-evolve threshold is reached
 *   collect            Check and show pending context
 *   mark-complete      Mark pending evolution complete
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const CHANGES = join(ROOT, 'harness/changes');
const INDEX_PATH = join(CHANGES, 'INDEX.json');
const EVOLUTION = join(ROOT, 'harness/evolution');
const STATE_PATH = join(EVOLUTION, 'state.json');
const PENDING_PATH = join(EVOLUTION, 'pending.md');
const RESULTS_PATH = join(EVOLUTION, 'results.tsv');
const PROPOSALS = join(EVOLUTION, 'proposals');

const DEFAULT_THRESHOLD = 5;
const DEFAULT_WINDOW = 10;

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function writeText(path, content) {
  const parent = join(path, '..');
  if (parent !== path) ensureDir(parent);
  writeFileSync(path, content, 'utf-8');
}

function readState() {
  ensureDir(EVOLUTION);
  if (!existsSync(STATE_PATH)) {
    const initial = {
      enabled: true,
      threshold: DEFAULT_THRESHOLD,
      window: DEFAULT_WINDOW,
      last_evolved_archive_count: 0,
      last_evolved_change_id: null,
      last_score: null,
      last_run_at: null,
      pending: false,
    };
    writeText(STATE_PATH, JSON.stringify(initial, null, 2) + '\n');
    return initial;
  }
  return JSON.parse(readFileSync(STATE_PATH, 'utf-8'));
}

function writeState(state) {
  writeText(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

function isAutoEvolveArchive(item) {
  const id = String(item.id || '');
  if (id.startsWith('auto-evolve-harness-')) return true;
  const tags = item.tags || [];
  return tags.some(t => String(t) === 'auto-evolve');
}

function getArchiveItems() {
  if (!existsSync(INDEX_PATH)) {
    throw new Error("Missing harness/changes/INDEX.json. Run node scripts/harness-change.mjs reindex first.");
  }
  const raw = readFileSync(INDEX_PATH, 'utf-8').trim();
  if (!raw) return [];
  const items = JSON.parse(raw);
  return items
    .filter(item => item.location === 'archive' && !isAutoEvolveArchive(item))
    .sort((a, b) => (a.updated_at || '').localeCompare(b.updated_at || '') || (a.id || '').localeCompare(b.id || ''));
}

function getResultsPath() {
  return RESULTS_PATH;
}

function ensureResultsHeader() {
  if (!existsSync(RESULTS_PATH)) {
    writeText(RESULTS_PATH, 'timestamp\tchange_id\told_score\tnew_score\tstatus\tdimension\tnote\teval_mode\n');
  }
}

function newPending(archiveItems, state, triggerReason) {
  if (existsSync(PENDING_PATH)) {
    console.log('Harness evolution already pending: harness/evolution/pending.md');
    return;
  }

  const window = state.window || DEFAULT_WINDOW;
  const candidateItems = archiveItems.slice(-window);
  const candidateLines = candidateItems.map(item =>
    `- ${item.path || `harness/changes/archive/${item.id}`}/summary.md`
  );

  const now = new Date().toISOString();
  const delta = archiveItems.length - (state.last_evolved_archive_count || 0);

  const content = `# Harness Evolution Pending

Generated at: ${now}

## Trigger

- Reason: ${triggerReason}
- Eligible archived changes since last evolution: ${delta}
- Threshold: ${state.threshold || DEFAULT_THRESHOLD}
- Scan window: ${window}
- INDEX source: harness/changes/INDEX.json
- Excludes: archive ids beginning with auto-evolve-harness- and archives tagged auto-evolve

## Candidate Archives

${candidateLines.join('\n')}

These candidates are the trigger snapshot. Before processing, rebuild \`harness/changes/INDEX.json\`
and use the current eligible archive window so changes closed after this file was generated are not
missed.

## Instruction For Codex

Run harness auto-evolve:
1. Read docs/ECL.md and this pending file.
2. Rebuild \`harness/changes/INDEX.json\`, then inspect the current eligible archive window first.
3. Read spec/plan/tasks/reviews only when evidence requires it.
4. Extract repeated failures, verification gaps, user corrections, and reusable constraints.
5. Generate \`harness/evolution/proposals/YYYY-MM-DD-auto-evolve.md\` from the proposal template in docs/ECL.md before editing harness files.
6. Request one independent auditor/subagent score before applying.
7. Apply only accepted candidates with archive evidence, project relevance, score >= 80, and independent approval.
8. Prefer clarifying existing rules over adding new sections, documents, scripts, or workflows.
9. Run harness checks and relevant business gates.
10. Record one terminal result in \`harness/evolution/results.tsv\`: \`keep\` for accepted deltas,
    \`noop\` for reviewed evidence with no durable rule, \`rejected\` for pre-apply hard-gate
    failures, or \`revert\` if an applied delta fails validation.
11. Run \`harness-evolve mark-complete\` after writing the result.
`;

  writeText(PENDING_PATH, content);
  state.pending = true;
  writeState(state);
  console.log('Created harness/evolution/pending.md');
}

function checkEvolution() {
  ensureDir(EVOLUTION);
  ensureResultsHeader();
  const state = readState();

  if (!state.enabled) {
    console.log('Harness auto-evolve disabled in harness/evolution/state.json.');
    return;
  }

  state.threshold = state.threshold || DEFAULT_THRESHOLD;
  state.window = state.window || DEFAULT_WINDOW;

  const archives = getArchiveItems();
  if (state.last_evolved_archive_count > archives.length) {
    state.last_evolved_archive_count = archives.length;
    writeState(state);
  }

  const delta = Math.max(0, archives.length - (state.last_evolved_archive_count || 0));
  const reason = process.argv.find(a => a.startsWith('--reason='))?.split('=')[1] || 'manual';

  if (delta < state.threshold) {
    console.log(`Harness evolution not due (${delta}/${state.threshold} new archived changes).`);
    return;
  }

  newPending(archives, state, reason);
}

function collectEvolutionInput() {
  checkEvolution();
  if (existsSync(PENDING_PATH)) {
    console.log('Read: harness/evolution/pending.md');
  }
}

function markComplete() {
  const state = readState();
  const archives = getArchiveItems();
  state.last_evolved_archive_count = archives.length;
  state.last_evolved_change_id = archives.length > 0 ? archives[archives.length - 1].id : null;
  state.last_run_at = new Date().toISOString();
  state.pending = false;
  writeState(state);

  if (existsSync(PENDING_PATH)) {
    unlinkSync(PENDING_PATH);
  }

  ensureResultsHeader();
  console.log('Marked harness evolution complete.');
}

// ── Main ──────────────────────────────────────────────────────────────────────
const command = process.argv[2] || 'check';

switch (command) {
  case 'check': checkEvolution(); break;
  case 'collect': collectEvolutionInput(); break;
  case 'mark-complete': markComplete(); break;
  default: console.error('Command required: check/collect/mark-complete'); process.exit(1);
}
