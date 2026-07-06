# Project Status

> If `harness/changes/active/summary.md` exists, active change files are the current task source of truth and override this file.

## 1 Current Active Work

- Active change: none
- Current phase: none
- Owner/context: Initial ECL harness setup (2026-07-06)

## 2 Last Completed Change

- No completed changes yet (harness was just created).
- See `harness/changes/INDEX.json` for history.

## 3 Next Recommended Work

- Review pre-existing test failures in `bank.test.ts` (4 tests fail with `new Function()` ESM limitation).
- The project is fully functional and deployed to GitHub Pages.

## 4 Known Risks / Blockers

- 4 pre-existing test failures in `src/tasks/bank.test.ts` — `SyntaxError: Cannot use import statement` in `new Function()` for React tasks (useState, useEffect, Custom Hook, Context API). These fail because the eval sandbox via `new Function()` cannot handle ESM `import` statements in user/test code.
- Build produces a large chunk (2.1 MB). Consider code-splitting with dynamic imports.

## 5 Quality Gate State

| Gate | Last Known State | Notes |
|------|------------------|-------|
| Harness | pass | `npm run lint:harness` passes |
| Lint/typecheck | pass | `tsc --noEmit` passes |
| Build | pass | `vite build` succeeds |
| Test | fail (4 pre-existing) | ESM `new Function()` limitation in bank.test.ts |

## 6 Resume Context

1. Read `AGENTS.md`.
2. Read `docs/ECL.md`.
3. If an active change exists, read active change files and stop treating this file as authority.
4. If no active change exists and `harness/evolution/pending.md` exists, handle pending harness evolution before ordinary resume work unless the user task is urgent.
5. If continuing recent work, read the archive summary listed above.
6. Use `harness/changes/INDEX.json` to find older related changes by module, file, tag, or failure.

## 7 History Loading Rule

- Do not load all archive history by default.
- Start with the selected archived `summary.md`.
- Read archived spec/plan/tasks/reviews only for explicit resume, debugging, review, or failure analysis.
