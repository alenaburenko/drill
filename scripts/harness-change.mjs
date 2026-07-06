#!/usr/bin/env node

/**
 * harness-change.mjs — ECL Change Management CLI
 *
 * Commands:
 *   new <title>          Create a new active change
 *   status               Show current active change
 *   validate             Validate active change structure
 *   park [reason]        Park active change
 *   resume <id>          Resume a parked change
 *   close <status>       Close active change (completed|blocked|abandoned)
 *   search <query>       Search archived changes
 *   context              Show required context files
 *   reindex              Rebuild INDEX.json
 *   index-json           Print INDEX.json content
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, renameSync, copyFileSync, cpSync, rmSync, unlinkSync } from 'fs';
import { resolve, join, dirname, relative } from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = resolve(import.meta.dirname, '..');
const CHANGES = join(ROOT, 'harness/changes');
const ACTIVE = join(CHANGES, 'active');
const PARKING = join(CHANGES, 'parking');
const ARCHIVE = join(CHANGES, 'archive');
const INDEX_PATH = join(CHANGES, 'INDEX.json');
const TEMPLATE = join(ROOT, 'harness/templates/change');
const EVOLUTION = join(ROOT, 'harness/evolution');
const EVOLUTION_PENDING = join(EVOLUTION, 'pending.md');
const HARNESS_EVOLVE = join(ROOT, 'scripts/harness-evolve.mjs');

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function getDateText() {
  return new Date().toISOString().slice(0, 10);
}

function toSlug(text) {
  let slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'change';
}

function readText(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch { return ''; }
}

function writeText(path, content) {
  const parent = dirname(path);
  if (parent) ensureDir(parent);
  writeFileSync(path, content, 'utf-8');
}

function parseFrontMatter(path) {
  const text = readText(path);
  const result = {};
  if (!text.startsWith('---')) return result;
  const lines = text.split('\n');
  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i].trim() === '---') break;
    const m = lines[i].match(/^\s*([^:#]+):\s*(.*)\s*$/);
    if (m) {
      let key = m[1].trim();
      let value = m[2].trim().replace(/^"|"$/g, '');
      if (value.startsWith('[') && value.endsWith(']')) {
        result[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

function setFrontMatterValues(path, values) {
  let text = readText(path);
  if (!text.startsWith('---')) throw new Error(`${path} has no front matter.`);
  for (const [key, value] of Object.entries(values)) {
    const line = Array.isArray(value)
      ? `${key}: [${value.map(v => `"${v}"`).join(', ')}]`
      : `${key}: "${value}"`;
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escapedKey}:\\s*.*$`, 'm');
    if (regex.test(text)) {
      text = text.replace(regex, line);
    } else {
      const lines = text.split('\n');
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
          text = [...lines.slice(0, i), line, ...lines.slice(i)].join('\n');
          break;
        }
      }
    }
  }
  writeText(path, text);
}

function getSectionLines(path, heading) {
  const text = readText(path);
  if (!text) return [];
  const lines = text.split('\n');
  let found = false;
  const items = [];
  for (const line of lines) {
    if (line.match(new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`))) {
      found = true; continue;
    }
    if (found && line.match(/^##\s+/)) break;
    if (found && line.trim()) items.push(line.trim());
  }
  return items;
}

function getValidationStatus(summaryPath, meta) {
  if (meta.validation_status) return meta.validation_status;
  const validation = getSectionLines(summaryPath, 'Validation').join(' ');
  if (/pass(ed)?|success|ok/i.test(validation)) return 'pass';
  if (/fail(ed)?|error|blocked/i.test(validation)) return 'fail';
  return 'unknown';
}

function getIndexEntries() {
  const entries = [];
  for (const [location, base] of [['parking', PARKING], ['archive', ARCHIVE]]) {
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base, { withFileTypes: true }).filter(d => d.isDirectory())) {
      const summary = join(dirname(dir.parentPath || base), dir.name, 'summary.md');
      if (!existsSync(summary)) continue;
      const meta = parseFrontMatter(summary);
      const decisions = getSectionLines(summary, 'Decisions').filter(l => !l.match(/^Pending\.?$/));
      const relPath = relative(ROOT, join(base, dir.name));
      entries.push({
        id: dir.name,
        title: meta.title || '',
        status: meta.status || '',
        location,
        modules: meta.modules || [],
        files: meta.files || [],
        tags: meta.tags || [],
        decisions,
        validation_status: getValidationStatus(summary, meta),
        path: relPath.replace(/\\/g, '/'),
        updated_at: meta.updated_at || '',
      });
    }
  }
  return entries;
}

function getIndexJson() {
  const entries = getIndexEntries();
  return JSON.stringify(entries, null, 2) + '\n';
}

function reindex() {
  ensureDir(CHANGES);
  const entries = getIndexEntries();
  writeText(INDEX_PATH, getIndexJson());
  console.log(`Rebuilt harness/changes/INDEX.json (${entries.length} entries).`);
  return entries;
}

function invokeEvolutionCheck(reason) {
  if (!existsSync(HARNESS_EVOLVE)) return;
  try {
    const proc = spawnSync('node', [HARNESS_EVOLVE, 'check', '--reason', reason], { cwd: ROOT, stdio: 'pipe', encoding: 'utf-8' });
    if (proc.stdout) process.stdout.write(proc.stdout);
    if (proc.stderr) process.stderr.write(proc.stderr);
  } catch (e) {
    console.warn('Auto-evolve check failed:', e.message);
  }
}

function showEvolutionReminder() {
  if (existsSync(EVOLUTION_PENDING)) {
    console.warn('Harness evolution is pending: harness/evolution/pending.md');
  }
}

function assertNoActive() {
  const summary = join(ACTIVE, 'summary.md');
  if (existsSync(summary)) {
    throw new Error("Active change exists. Run 'status', then 'park', 'close', or finish it before starting a new change.");
  }
}

function validateChange(dir) {
  const required = ['summary.md', 'spec.md', 'tasks.md'];
  const isActive = resolve(dir) === resolve(ACTIVE);
  if (isActive) required.push('plan.md');

  for (const file of required) {
    if (!existsSync(join(dir, file))) throw new Error(`Missing ${file} in ${dir}`);
  }
  if (!existsSync(join(dir, 'reviews'))) throw new Error(`Missing reviews/ in ${dir}`);

  const summary = join(dir, 'summary.md');
  const meta = parseFrontMatter(summary);
  if (!meta.status) throw new Error('summary.md missing status front matter.');

  const phase = meta.phase || '';
  const planReview = meta.plan_review || '';
  const spec = readText(join(dir, 'spec.md'));
  let reviewText = '';
  const reviewPath = join(dir, 'reviews/review.md');
  if (existsSync(reviewPath)) reviewText = readText(reviewPath);
  const tasks = readText(join(dir, 'tasks.md'));

  if (isActive && /^(implement|validate|done)$/.test(phase) && /\[NEEDS CLARIFICATION:/.test(spec)) {
    throw new Error('spec.md has high-impact [NEEDS CLARIFICATION] markers. Resolve them or move back to intake/plan.');
  }
  if (isActive && /^(implement|validate|done)$/.test(phase) && planReview !== 'approved' && !/Plan Review[^]*Status:\s*approved/is.test(reviewText)) {
    throw new Error('summary.md plan_review must be approved before implementation.');
  }

  if (meta.status === 'completed') {
    const validation = getValidationStatus(summary, meta);
    if (validation !== 'pass') throw new Error('completed change must have validation_status: pass.');
    if (/^- \[ \] /m.test(tasks) && !/## Deferred Tasks[^]*-\s+(None|Deferred|Explained)/is.test(tasks)) {
      throw new Error('completed change has pending tasks without a Deferred Tasks explanation.');
    }
  }
}

function showStatus() {
  ensureDir(ACTIVE);
  const summary = join(ACTIVE, 'summary.md');
  if (!existsSync(summary)) {
    console.log('No active change.');
    return;
  }
  const meta = parseFrontMatter(summary);
  console.log(`Active: ${meta.title}`);
  console.log(`Status: ${meta.status}`);
  console.log(`Phase: ${meta.phase}`);
}

function newChange(title) {
  ensureDir(ACTIVE);
  ensureDir(join(ACTIVE, 'reviews'));
  ensureDir(PARKING);
  ensureDir(ARCHIVE);
  if (!title) throw new Error('Missing title.');
  assertNoActive();
  const date = getDateText();
  const slug = toSlug(title);

  // Copy templates
  for (const file of ['summary.md', 'spec.md', 'plan.md', 'tasks.md']) {
    const src = join(TEMPLATE, file);
    const dst = join(ACTIVE, file);
    if (existsSync(src)) copyFileSync(src, dst);
    else {
      writeText(dst, file === 'summary.md'
        ? `---\ntitle: "${title}"\nslug: "${slug}"\nstatus: "in_progress"\nlocation: "active"\nphase: "intake"\nintake_status: "pending"\nspec_review: "pending"\nplan_review: "pending"\nmodules: []\nfiles: []\ntags: []\nvalidation_status: "unknown"\ncreated_at: "${date}"\nupdated_at: "${date}"\n---\n\n# Summary\n\n## Outcome\n\nPending.\n\n## Decisions\n\n- Pending.\n\n## Validation\n\n- Pending.\n\n## Next Step\n\n- Run Intake Review, then update \`spec.md\` and \`plan.md\`.`
        : `# ${file === 'spec.md' ? 'Spec' : file === 'plan.md' ? 'Plan' : 'Tasks'}\n\nPending.`);
    }
  }
  // Copy reviews template
  const reviewsSrc = join(TEMPLATE, 'reviews/review.md');
  const reviewsDst = join(ACTIVE, 'reviews/review.md');
  if (existsSync(reviewsSrc)) copyFileSync(reviewsSrc, reviewsDst);
  else writeText(reviewsDst, '# Review\n\n## Intake Review\n\n- Status: pending\n\n## Spec Review\n\n- Status: pending\n\n## Plan Review\n\n- Status: pending\n\n## Code Review\n\n- Status: pending\n\n## Validation Review\n\n- Status: pending');

  // Update front matter in summary
  setFrontMatterValues(join(ACTIVE, 'summary.md'), { title, slug, created_at: date, updated_at: date });

  console.log(`Created active change: ${title}`);
  showEvolutionReminder();
}

function moveActive(targetBase, status, reason) {
  ensureDir(targetBase);
  const summary = join(ACTIVE, 'summary.md');
  if (!existsSync(summary)) throw new Error('No active change.');

  const meta = parseFrontMatter(summary);
  if (targetBase === ARCHIVE && !['completed', 'blocked', 'abandoned'].includes(status)) {
    throw new Error('close status must be completed, blocked, or abandoned.');
  }
  if (status === 'completed') validateChange(ACTIVE);

  const targetLocation = targetBase === PARKING ? 'parking' : 'archive';
  const newStatus = targetBase === PARKING ? 'parked' : status;

  setFrontMatterValues(summary, {
    status: newStatus,
    location: targetLocation,
    updated_at: getDateText(),
  });

  if (reason) {
    writeText(summary, readText(summary) + `\n## Transition Note\n\n- ${reason}\n`);
  }

  const meta2 = parseFrontMatter(summary);
  let id = `${getDateText()}-${meta2.slug || toSlug(meta2.title)}`;
  let target = join(targetBase, id);
  let n = 2;
  while (existsSync(target)) {
    target = join(targetBase, `${id}-${n}`);
    n++;
  }

  cpSync(ACTIVE, target, { recursive: true });
  rmSync(ACTIVE, { recursive: true, force: true });
  ensureDir(ACTIVE);
  reindex();
  if (targetBase === ARCHIVE) invokeEvolutionCheck('close');
  console.log(`Moved active change to ${target}`);
}

function resumeChange(id) {
  ensureDir(ACTIVE);
  assertNoActive();
  const source = join(PARKING, id);
  if (!existsSync(source)) throw new Error(`Parking change not found: ${id}`);

  const summary = join(source, 'summary.md');
  if (existsSync(summary)) {
    setFrontMatterValues(summary, { status: 'in_progress', location: 'active', updated_at: getDateText() });
  }

  const files = readdirSync(source).filter(f => f !== '.gitkeep');
  for (const file of files) {
    const src = join(source, file);
    const dst = join(ACTIVE, file);
    if (existsSync(src)) {
      if (src === join(source, 'summary.md')) continue; // already updated
      cpSync(src, dst, { recursive: true });
    }
  }
  rmSync(source, { recursive: true, force: true });
  reindex();
  console.log(`Resumed ${id} into active. Run validate before continuing.`);
}

function searchIndex(query) {
  if (!existsSync(INDEX_PATH)) reindex();
  try {
    const items = JSON.parse(readText(INDEX_PATH));
    const results = items.filter(item => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
    if (results.length === 0) {
      console.log('No results found.');
      return;
    }
    console.table(results.map(({ id, title, status, location, path, validation_status }) => ({ id, title, status, location, validation_status })));
  } catch {
    console.log('No results found.');
  }
}

function showContext() {
  console.log('Required:');
  for (const p of ['AGENTS.md', 'docs/ECL.md', 'harness/changes/active/summary.md', 'harness/changes/active/spec.md', 'harness/changes/active/plan.md', 'harness/changes/active/tasks.md']) {
    if (existsSync(join(ROOT, p))) console.log(`- ${p}`);
  }
  if (!existsSync(join(ROOT, 'harness/changes/active/summary.md')) && existsSync(EVOLUTION_PENDING)) {
    console.log('- harness/evolution/pending.md');
  }
  if (!existsSync(join(ROOT, 'harness/changes/active/summary.md')) && existsSync(join(ROOT, 'docs/STATUS.md'))) {
    console.log('- docs/STATUS.md');
  }
  console.log('\nHistory index:');
  if (existsSync(INDEX_PATH)) console.log('- harness/changes/INDEX.json');
  else console.log('- Run node scripts/harness-change.mjs reindex');
}

// ── Main ───────────────────────────────────────────────────────────────────
const command = process.argv[2];
const args = process.argv.slice(3);

ensureDir(ACTIVE);
ensureDir(PARKING);
ensureDir(ARCHIVE);

switch (command) {
  case 'new': newChange(args.join(' ')); break;
  case 'status': showStatus(); break;
  case 'validate': validateChange(ACTIVE); console.log('ECL active change is valid.'); break;
  case 'park': moveActive(PARKING, 'parked', args.join(' ')); break;
  case 'resume': resumeChange(args[0]); break;
  case 'close': moveActive(ARCHIVE, args[0], args.slice(1).join(' ')); break;
  case 'search': searchIndex(args.join(' ')); break;
  case 'context': showContext(); break;
  case 'reindex': reindex(); invokeEvolutionCheck('reindex'); break;
  case 'index-json': console.log(getIndexJson()); break;
  default: console.error('Command required: new/status/validate/park/resume/close/search/context/reindex'); process.exit(1);
}
