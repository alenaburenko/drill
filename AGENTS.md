# Drill — Practice Platform Agent Guide

This file is the project entry map for AI agents.

## 1 Project Snapshot

- **What it is**: Single-page application for spaced-repetition code memorization — 540+ developer interview tasks with Monaco editor, sandboxed test execution, and 6-stage progressive learning.
- **Core workflow**: User selects a task → progresses through 6 stages (study → retype → recall → cloze → scratch → live exam) → passes tests to advance → spaced repetition schedules next review.
- **Runtime shape**: Client-side SPA (Vite + React 19 + Monaco + Web Worker test runner). No server. Data in `localStorage`.
- **Tech stack**: TypeScript, React 19, Vite 6, Vitest 4, Monaco Editor, Tailwind CSS 4, `motion` (Framer Motion).
- **Start here**: [Architecture](docs/ARCHITECTURE.md), [Development](docs/DEVELOPMENT.md), [ECL](docs/ECL.md)

## 2 Core Domain Model

| Concept / Step | Source | What Agents Need To Know |
|----------------|--------|--------------------------|
| Task (DrillTask) | `src/types.ts:1-14` | id, block (category), title, starter/solution/cloze code, testCode, difficulty |
| User progress | `src/types.ts:16-29` | learningStage (1-7), peeksCount, drafts per stage, history of attempts |
| Task bank | `src/tasks/itlead.ts` | 540+ ITLead interview tasks (read-only, generated) |
| Extra tasks | `src/tasks/extra.ts` | Manually curated additional tasks |
| Custom tasks | `src/App.tsx:41-45` | User-created tasks stored in localStorage |
| Test runner | `src/runner/testRunner.ts` | Web Worker sandbox, runs user code vs testCode, returns results |

## 3 Where To Work

| Section | Document | Description |
|---------|----------|-------------|
| 3.1 | [System Architecture](docs/ARCHITECTURE.md) | Component hierarchy, data flow, module layers |
| 3.2 | [Development Setup](docs/DEVELOPMENT.md) | Install, build, test, lint commands |
| 3.3 | [ECL Operating Manual](docs/ECL.md) | Change lifecycle and context loading |
| 3.4 | [Status Handoff](docs/STATUS.md) | Recent work summary and next steps |

### Source Entrypoints

| Directory / File | Purpose |
|------------------|---------|
| `src/App.tsx` | Root component: dashboard, catalog, upload, backup views |
| `src/components/TaskView.tsx` | Learning workspace: stages 1-7, Monaco editor, test console |
| `src/components/CodeEditor.tsx` | Monaco editor wrapper (read-only or editable) |
| `src/tasks/` | Task data files (itlead, extra, bank.test) |
| `src/runner/` | Web Worker test sandbox |
| `src/i18n.ts` | Ukrainian/English UI translations |
| `scripts/` | Build utility scripts (problem extraction, sitemap) |
| `.github/workflows/deploy.yml` | CI/CD: GitHub Pages deploy on main push |

## 4 Context Loading

1. Read this file.
2. Read [ECL](docs/ECL.md) for change lifecycle and context rules.
3. If `harness/changes/active/summary.md` exists, read active change summary/spec/plan/tasks/reviews before any task-specific docs.
4. If no active change exists and `harness/evolution/pending.md` exists, read it before ordinary resume work.
5. If no active change exists and no pending evolution exists, read [Status](docs/STATUS.md) for recent handoff context.
6. Read `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT.md` for technical context.
7. Read task-specific files (`src/App.tsx`, `src/components/`, etc.) based on the task.
8. Before implementation for APIs, data model, architecture, or cross-module changes: create or update an ECL change.

## 5 Development Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run test       # Run all tests
npm run lint       # TypeScript type check
npm run typecheck  # TypeScript type check (alias)
npm run lint:harness  # ECL harness integrity check
npm run lint:arch     # Architecture linter (dependency check)
npm run verify-harness # All harness checks
```

See [Development Setup](docs/DEVELOPMENT.md) for complete reference.

## 6 Verification

| Change Type | Minimum Verification |
|-------------|----------------------|
| Frontend/UI | `npm run build && npm run lint` |
| Task data | `npm run test` (Vitest, 700+ tests in bank.test.ts) |
| Test runner | `npm run test` (runner tests pass) |
| i18n | No separate verification; type-check catches missing keys |
| Harness/docs/scripts | `npm run lint:harness && npm run lint:arch` |

Note: 4 pre-existing test failures exist in `bank.test.ts` related to ESM `new Function()` limitation. These are pre-existing project debt, not caused by harness changes.

## 7 Safety Boundaries

- Agents may modify any business code when the user's task requires it.
- Do not edit `node_modules/`, `dist/`, generated build outputs, or skill symlinks in `.claude/skills/`, `.cursor/rules/`, `.windsurf/rules/`.
- Active ECL change constraints override this file and `docs/STATUS.md` for the current task.
- Do not hand-edit generated indexes such as `harness/changes/INDEX.json`.
- Do not overwrite active ECL change context; park or close it through `harness-change.mjs` first.
