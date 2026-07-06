# Spec

## Intake Review

- Intake type: Structured Change
- Input shape: requirement-first
- Questions asked this round: 0

## Goal And Evidence

- Real problem or user request: Reduce tech debt detected by debt_scanner: large files (App.tsx 780 lines, TaskView.tsx 610 lines), duplicated code patterns in components, long lines in i18n.ts.
- Current behavior: App.tsx and TaskView.tsx are monolithic files containing multiple concerns (dashboard, catalog, upload, backup views all in one component). Inline styles and badge helpers are duplicated across components.
- Source of evidence: `debt_scanner.py` scan results, manual code review of src/App.tsx and src/components/TaskView.tsx.

## User Scenarios And Success

- Primary user/system scenario: Developer maintains the codebase — files should be navigable, logic should be in focused modules.
- Success criteria: All lint/typecheck/build/test gates pass after refactoring.
- Acceptance criteria:
  1. App.tsx reduced from ~780 to under 500 lines by extracting view components
  2. TaskView.tsx reduced from ~610 to under 450 lines by extracting sub-components
  3. Long line warnings in i18n.ts fixed (line wrapping)
  4. No behavioral changes — UI looks and behaves identically

## Non-Goals

- No functional changes to the app
- No new features
- No CSS/Tailwind restructuring
- No changes to task data files (itlead.ts, extra.ts)

## Constraints

- All existing tests must pass
- lint/typecheck must pass
- build must succeed
- No visual changes to the UI

## Assumptions

- Badge helpers (diffBadge, stageBadge) can be extracted to a shared utility
- Dashboard view can be extracted from App.tsx into its own component
- Repetitive inline styles can be consolidated via shared CSS classes (already using Tailwind)
- en/uk translation pairs in i18n.ts are correctly parallel and only need formatting

## Open Questions

- None.

## Resolved Clarifications

- None.
