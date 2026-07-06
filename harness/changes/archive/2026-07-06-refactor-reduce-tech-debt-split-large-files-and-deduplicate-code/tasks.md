# Tasks

## Format

- `- [ ] T001 [P?] [US?] Action with target path and validation note`
- `[P]` means parallel-safe. `[US1]` maps to a user story when stories exist.

## Setup / Intake

- [x] T001 Review `spec.md` and `plan.md` gates — approved.

## Implementation

- [ ] T002 Create `src/utils/badges.ts` — extract diffBadge and stageBadge helpers. Validation: `npm run lint && npm run build`
- [ ] T003 Create `src/utils/styles.ts` — extract common inline style objects. Validation: `npm run lint && npm run build`
- [ ] T004 Create `src/components/DashboardView.tsx` — extract dashboard from App.tsx. Validation: `npm run build`, check dashboard renders
- [ ] T005 Create `src/components/CatalogView.tsx` — extract catalog view from App.tsx. Validation: `npm run build`, check catalog filters work
- [ ] T006 Create `src/components/UploadView.tsx` and `src/components/BackupView.tsx` — extract remaining views. Validation: `npm run build`
- [ ] T007 Modify `src/App.tsx` — wire extracted components, remove inline view rendering. Validation: all 4 tabs work
- [ ] T008 Create stage sub-components in `src/components/`: StageStudy, StageRetype, StageHint, StageExam, StageMastered. Validation: `npm run build`
- [ ] T009 Modify `src/components/TaskView.tsx` — use extracted stage components. Validation: all 7 stages render correctly
- [ ] T010 Fix long lines in `src/i18n.ts` — wrap at 100 chars. Validation: `npm run lint`

## Validation

- [ ] T011 Final validation: `npm run test && npm run lint && npm run build` — must all pass
- [ ] T012 Manual visual check: open dev server, verify all tabs and task stages

## Deferred Tasks

- None.
