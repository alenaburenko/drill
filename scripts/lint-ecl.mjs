#!/usr/bin/env node

/**
 * lint-ecl.mjs — ECL Harness Integrity Linter
 *
 * Checks:
 *   - harness/changes directory structure
 *   - Active change completeness (if exists)
 *   - harness/changes/INDEX.json freshness
 *   - docs/STATUS.md presence
 *   - harness/evolution/state.json presence
 *   - scripts presence
 */

import { existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const ROOT = resolve(import.meta.dirname, '..');
const CHANGES = join(ROOT, 'harness/changes');
const ACTIVE = join(CHANGES, 'active');
const INDEX_PATH = join(CHANGES, 'INDEX.json');
const HARNESS_CHANGE = join(ROOT, 'scripts/harness-change.mjs');
const HARNESS_EVOLVE = join(ROOT, 'scripts/harness-evolve.mjs');
const STATUS_PATH = join(ROOT, 'docs/STATUS.md');
const EVOLUTION_STATE = join(ROOT, 'harness/evolution/state.json');

let failures = 0;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failures++;
}

if (!existsSync(CHANGES)) {
  fail('Missing harness/changes. Run ecl-harness-engineer or create ECL harness structure.');
}

for (const dir of ['active', 'parking', 'archive']) {
  if (!existsSync(join(CHANGES, dir))) {
    fail(`Missing harness/changes/${dir}.`);
  }
}

if (!existsSync(HARNESS_CHANGE)) {
  fail('Missing scripts/harness-change.mjs.');
}

if (!existsSync(HARNESS_EVOLVE)) {
  fail('Missing scripts/harness-evolve.mjs.');
}

if (!existsSync(EVOLUTION_STATE)) {
  fail('Missing harness/evolution/state.json.');
}

if (!existsSync(STATUS_PATH)) {
  fail('Missing docs/STATUS.md. Create a lightweight handoff summary; active change files override it when present.');
}

if (existsSync(join(ACTIVE, 'summary.md'))) {
  for (const file of ['summary.md', 'spec.md', 'plan.md', 'tasks.md']) {
    if (!existsSync(join(ACTIVE, file))) {
      fail(`Active change missing ${file}.`);
    }
  }
  if (!existsSync(join(ACTIVE, 'reviews'))) {
    fail('Active change missing reviews/.');
  }

  const summary = readFileSync(join(ACTIVE, 'summary.md'), 'utf-8');
  const spec = readFileSync(join(ACTIVE, 'spec.md'), 'utf-8');
  const tasks = readFileSync(join(ACTIVE, 'tasks.md'), 'utf-8');
  const reviewPath = join(ACTIVE, 'reviews/review.md');
  const review = existsSync(reviewPath) ? readFileSync(reviewPath, 'utf-8') : '';

  const phaseMatch = summary.match(/phase:\s*"?([^"\r\n]+)"?/);
  const phase = phaseMatch ? phaseMatch[1] : '';
  const planReviewMatch = summary.match(/plan_review:\s*"?([^"\r\n]+)"?/);
  const planReview = planReviewMatch ? planReviewMatch[1] : '';

  if (/^(implement|validate|done)$/.test(phase) && /\[NEEDS CLARIFICATION:/.test(spec)) {
    fail("Active spec.md still has high-impact [NEEDS CLARIFICATION] markers. Resolve them or move phase back to intake/plan.");
  }
  if (/^(implement|validate|done)$/.test(phase) && planReview !== 'approved' && !/Plan Review[^]*Status:\s*approved/is.test(review)) {
    fail("Active change cannot enter implementation until plan_review is approved.");
  }
  if (/^- \[[ xX]\] (?!T\d{3})/m.test(tasks)) {
    fail("tasks.md contains executable task lines without T### ids. Use '- [ ] T001 [P?] [US?] Action with target path and validation note'.");
  }
}

if (!existsSync(INDEX_PATH)) {
  fail("Missing harness/changes/INDEX.json. Run: node scripts/harness-change.mjs reindex");
} else {
  // Check INDEX freshness
  try {
    const actual = readFileSync(INDEX_PATH, 'utf-8');
    const result = execSync(`node scripts/harness-change.mjs index-json`, { cwd: ROOT, encoding: 'utf-8' });
    if (actual.trim() !== result.trim()) {
      fail("harness/changes/INDEX.json is stale. Run: node scripts/harness-change.mjs reindex");
    }
  } catch (e) {
    fail(`Could not verify INDEX.json freshness: ${e.message}`);
  }
}

if (failures > 0) {
  console.log(`\nECL lint FAILED: ${failures} issue(s) found.`);
  process.exit(1);
}

console.log('ECL lint passed.');
