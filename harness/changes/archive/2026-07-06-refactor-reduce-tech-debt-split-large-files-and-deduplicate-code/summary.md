---
title: "refactor: reduce tech debt — split large files and deduplicate code"
slug: "refactor-reduce-tech-debt-split-large-files-and-deduplicate-code"
status: "completed"
location: "archive"
phase: "done"
intake_status: "pending"
spec_review: "approved"
plan_review: "approved"
modules: []
files: []
tags: []
validation_status: "pass"
created_at: "2026-07-06"
updated_at: "2026-07-06"
---

# Summary

## Outcome

Tech debt reduction completed: badge helpers extracted, DashboardView separated from App.tsx (780 → 610 lines), diffBadge/stageBadge deduplicated. Remaining items (Upload/Backup views, TaskView stage panels, i18n long lines) deferred.

## Decisions

- Extracted badge helpers (diffBadge, stageBadge) to src/utils/badges.ts
- Extracted DashboardView from App.tsx into src/components/DashboardView.tsx
- Skipped styles.ts extraction (low value, would increase total code)
- Skipped TaskView stage panels split (complex state coupling — timer, peek, exam state)

## Validation

- npm run lint: pass (tsc --noEmit)
- npm run build: pass
- npm run test: same 4 pre-existing failures (unchanged)
- App.tsx reduced from ~780 to 610 lines

## Next Step

- Run Intake Review, then update `spec.md` and `plan.md`.
