# Plan

## Technical Approach

**Strategy**: Incremental extraction — create new components, test, then wire them in. No behavioral changes.

### T1: Extract shared badge helpers
- Move `diffBadge()` and `stageBadge()` from `App.tsx` and `TaskView.tsx` into `src/utils/badges.ts`
- Both files currently define their own versions → unify into one shared helper

### T2: Extract inline style constants
- Move repeated inline style objects (like `{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }`) into a shared `src/utils/styles.ts` or use Tailwind classes where possible
- Target: App.tsx and TaskView.tsx

### T3: Split App.tsx — extract Dashboard view
- Create `src/components/DashboardView.tsx`
- Move the dashboard rendering code (dashboard tab content, stats, new tasks, due repetitions) into this component
- App.tsx imports and renders DashboardView instead of inline code

### T4: Split App.tsx — extract Catalog view
- Create `src/components/CatalogView.tsx`
- Move catalog filters, grouped task list, search into this component

### T5: Split App.tsx — extract Upload and Backup views
- Create `src/components/UploadView.tsx` and `src/components/BackupView.tsx`
- Import in App.tsx

### T6: Split TaskView.tsx — extract stage panels
- Create `src/components/StageStudy.tsx` (Stage 1), `src/components/StageRetype.tsx` (Stage 2), `src/components/StageHint.tsx` (Stages 3-5), `src/components/StageExam.tsx` (Stage 6), `src/components/StageMastered.tsx` (Stage 7)
- Each sub-component handles its own left-panel rendering

### T7: Fix long lines in i18n.ts
- Wrap long string literals and translation function calls at 100 chars

## Impacted Modules And Files

| File | Change | Lines |
|------|--------|-------|
| `src/utils/badges.ts` | CREATE | ~15 |
| `src/utils/styles.ts` | CREATE | ~30 |
| `src/components/DashboardView.tsx` | CREATE | ~250 |
| `src/components/CatalogView.tsx` | CREATE | ~150 |
| `src/components/UploadView.tsx` | CREATE | ~120 |
| `src/components/BackupView.tsx` | CREATE | ~60 |
| `src/components/StageStudy.tsx` | CREATE | ~60 |
| `src/components/StageRetype.tsx` | CREATE | ~40 |
| `src/components/StageHint.tsx` | CREATE | ~70 |
| `src/components/StageExam.tsx` | CREATE | ~50 |
| `src/components/StageMastered.tsx` | CREATE | ~40 |
| `src/App.tsx` | MODIFY | ~780 → ~350 |
| `src/components/TaskView.tsx` | MODIFY | ~610 → ~400 |
| `src/i18n.ts` | MODIFY | ~330 (formatting only) |
| `src/components/CodeEditor.tsx` | (no change) | — |

## Interfaces, Data, Permissions

- No new interfaces or data models
- Components receive the same props they already use (DrillTask, UserProgress, callbacks)
- i18n `getT()` usage stays the same
- No permissions or auth changes

## Spec Gaps Found From Planning

- TaskView.tsx has complex stage logic intertwined with Monaco editor state and timer — extracting stage panels requires careful prop drilling for `peekOpen`, `peeksCount`, `examActive`, `timerSec`, `showComments`
- The exam timer effect and keydown handler in TaskView.tsx must remain in the parent, not be split into stage components

## Risks And Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken imports after extraction | Blocking | Run build + lint after each step |
| Timer/state inconsistency after split | Medium | Keep timer logic in TaskView.tsx parent |
| Style drift — extracted components use wrong styles | Low | Reuse existing inline style patterns; run visual check |
| git merge conflicts (large refactor) | Low | Do all tasks in one session, commit at the end |

## Verification Plan

1. After each creation/modification step: `npm run lint && npm run build`
2. After all steps: `npm run test && npm run lint && npm run build`
3. Manual: open dev server, verify dashboard/catalog/upload/backup tabs render correctly
4. Manual: open a task at each stage (1-7), verify controls and editor work
