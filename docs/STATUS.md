# Project Status

> If `harness/changes/active/summary.md` exists, active change files are the current task source of truth and override this file.

## 1 Current Active Work

- Active change: none
- Current phase: none
- Owner/context: Initial ECL harness setup (2026-07-06)

## 2 Last Completed Change

- Code review findings fix (2026-07-07): removed dead `stats` in App.tsx, extracted shared task progress logic into `src/utils/taskProgress.ts` (eliminating ~180 lines of duplication between App.tsx and DashboardView.tsx), fixed `(e: any)` cast in UploadPanel, removed all `t as any` casts in stage tests (using `as const`), added filtered vitest config to exclude `.claude/` test files.
- Previous: Squirrel full-cycle pass (2026-07-07) — second pass.
- See `harness/changes/INDEX.json` for full history.

## 3 Next Recommended Work

- Investigate reimporting ITLead tasks (176 skipped with RSC format change).
- Add integration tests for full stage advancement flow.
- Consider dynamic `import()` for upload/backup panels.

## 4 Known Risks / Blockers

- ~~4 pre-existing test failures — RESOLVED.~~
- 176 tasks skipped from ITLead import — site's RSC payload format changed. Re-run `npm run import-itlead` when the extraction script is updated.
- Bundle: 6 chunks (monaco, icons, motion, task-data, app, CSS). Main app 1.3 MB due to React + all component code.

## 5 Quality Gate State

| Gate | Last Known State | Notes |
|------|------------------|-------|
| Harness | pass | `npm run lint:harness` passes |
| Lint/typecheck | pass | `tsc --noEmit` passes |
| Build | pass | `vite build` succeeds |
| Test | pass (752) | 3 files: 716 bank + 4 smoke + 10 runner + 22 stage tests |

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
