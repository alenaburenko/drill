# Development Setup

## 1 Prerequisites

- Node.js 20+ (the project uses v22 in CI)
- npm (package-lock.json present)

## 2 Quick Start

```bash
npm install
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Production build to ./dist/
npm run test       # Run all tests (Vitest)
npm run lint       # TypeScript type check
```

## 3 Build Commands

| Command | Description | Duration |
|---------|-------------|----------|
| `npm run dev` | Start Vite dev server (port 3000) | instant |
| `npm run build` | Production build to `./dist/` | ~4s |
| `npm run lint` | TypeScript type check | ~5s |
| `npm run typecheck` | TypeScript type check (alias) | ~5s |
| `npm run test` | Run all Vitest tests | ~1s |
| `npm run clean` | Remove dist/ | instant |
| `npm run lint:harness` | ECL harness integrity check | ~1s |
| `npm run lint:arch` | Architecture dependency lint | ~1s |
| `npm run verify-harness` | Full harness verification | ~2s |
| `npm run check-facts` | Verify database integrity facts | varies |
| `npm run import-itlead` | Import ITLead task bank | varies |

## 4 Test Commands

| Command | Description | Scope |
|---------|-------------|-------|
| `npm run test` | All tests | Full (716 tests, 4 pre-existing failures) |
| `npx vitest run src/tasks/bank.test.ts` | Task bank verification | Bank tests only |
| `npx vitest run --reporter=verbose` | Verbose output | Full |

## 5 Project Structure

```
.
├── AGENTS.md                          — AI agent entry map
├── docs/
│   ├── ARCHITECTURE.md                — System architecture
│   ├── DEVELOPMENT.md                 — This file
│   ├── ECL.md                         — Change lifecycle
│   ├── STATUS.md                      — Project status handoff
│   ├── design-docs/                   — Component design docs
│   └── references/                    — Reference docs
├── harness/
│   ├── changes/                       — ECL change management
│   │   ├── active/                    — Current change
│   │   ├── parking/                   — Paused changes
│   │   └── archive/                   — Closed changes
│   ├── config/
│   │   └── environment.json           — Environment contract
│   ├── evolution/                     — Auto-evolve state
│   └── templates/change/              — Change templates
├── scripts/
│   ├── *.mjs                          — Build and utility scripts
│   ├── harness-change.mjs            — ECL change CLI
│   ├── harness-evolve.mjs            — Auto-evolve CLI
│   ├── lint-deps.mjs                 — Dependency linter
│   ├── lint-ecl.mjs                  — ECL linter
│   └── lint-encoding.mjs             — Encoding linter
├── src/
│   ├── App.tsx                        — Root component (~780 lines)
│   ├── main.tsx                       — Entry point
│   ├── i18n.ts                        — Translations (uk/en)
│   ├── types.ts                       — Type definitions
│   ├── components/
│   │   ├── TaskView.tsx               — Learning workspace (~610 lines)
│   │   └── CodeEditor.tsx             — Monaco editor wrapper
│   ├── runner/
│   │   ├── testRunner.ts             — Web Worker test sandbox
│   │   └── testRunner.worker.ts      — Worker entry
│   ├── tasks/
│   │   ├── itlead.ts                  — 540+ ITLead interview tasks
│   │   ├── extra.ts                   — Extra curated tasks
│   │   └── bank.test.ts              — Test verification
│   └── index.css                      — Global styles
├── .github/workflows/
│   └── deploy.yml                     — GitHub Pages deployment
├── .claude/
│   ├── commands/                      — Claude slash commands
│   ├── agents/                        — Agent definitions
│   └── references/                    — Checklist references
├── index.html                         — HTML entry point
└── vite.config.ts                     — Vite configuration
```

## 6 Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| (none) | — | No | The app has no server-side environment variables; all config is in Vite/TS build |

## 7 Testing Details

- **Test framework**: Vitest 4
- **Test file**: `src/tasks/bank.test.ts` — verifies all ITLead tasks can be parsed and solutions pass their tests
- **716 total tests**: 712 pass, 4 fail (pre-existing ESM limitation in Function constructor)
- **Test runner**: Web Worker-based sandbox in `src/runner/` (4s timeout, isolates user code)
