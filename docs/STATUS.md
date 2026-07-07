# Project Status

> If `harness/changes/active/summary.md` exists, active change files are the current task source of truth and override this file.

## 1 Current Active Work

- Active change: none
- Current phase: none
- Owner/context: Initial ECL harness setup (2026-07-06)

## 2 Last Completed Change

- Squirrel full-cycle pass (2026-07-07) — fixed STATUS.md, added 14 new tests (UI smoke + runner unit tests), split bundle from 2.1 MB to 1.3 MB main chunk + separate vendor chunks, fixed 2 `as any` suppressions, added test dir to dependency linter.
- Previous: Initial ECL harness setup (2026-07-06).
- See `harness/changes/INDEX.json` for full history.

## 3 Next Recommended Work

- Add more component tests covering learning stages (Study, Retype, Cloze, Exam).
- Add integration tests for the full stage advancement flow.

## 4 Known Risks / Blockers

- ~~4 pre-existing test failures — RESOLVED (see above).~~
- Bundle split into 6 chunks (monaco, icons, motion, task-data, main app, CSS). Main chunk still 1.3 MB due to React + app logic. Further dynamic `import()` for heavy panels (upload/backup) would help.

## 5 Quality Gate State

| Gate | Last Known State | Notes |
|------|------------------|-------|
| Harness | pass | `npm run lint:harness` passes |
| Lint/typecheck | pass | `tsc --noEmit` passes |
| Build | pass | `vite build` succeeds |
| Test | pass (716) | All bank tests pass — import/export stripped in eval sandbox |

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
