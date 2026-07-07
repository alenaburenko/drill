# Ubiquitous Language — Drill Practice Platform

## Core domain: Spaced Repetition Learning

| Term | Definition | Aliases to avoid |
|------|------------|------------------|
| **Task** | A coding exercise with a description, starter code, reference solution, test code, and breakdown — the fundamental unit of content. | Exercise, problem, challenge, question |
| **Learning Stage** | One of 7 numbered phases (1–7) a learner progresses through for each Task, from study to mastery. | Step, level, phase, round |
| **Practice** | The act of actively working on a Task at any Learning Stage. | Session, attempt, run |
| **Spaced Repetition** | The learning methodology: a Task is reviewed at increasing intervals (1d, 7d, 16d, 30d) to cement long-term memory. | Interval system, SRS |
| **Progress** | A `UserProgress` record tied to one Task: the user's current stage, peek count, draft history, and practice history. | Stats, record, state |
| **Peek** | Looking at the reference solution during stages 3+ — each peek is counted and visible in stats. | Spoiler, cheat, hint lookup |
| **Mastered** | A terminal state (Stage 7) reached by passing all tests at Stage 6 — the Task is scheduled for final review in 30 days. | Completed, done, finished |
| **Backup** | A JSON snapshot of all UserProgress records, exportable and importable via the Backup tab. | Save, export, restore point |
| **Custom Task** | A Task created by the user via the Upload form and stored in localStorage. | User task, manual task |

## Learning stages

| Term | Stage | Definition |
|------|-------|------------|
| **Study** | 1 | Read the task description, reference solution, and logic breakdown. No coding. |
| **Retype** | 2 | Type the reference solution by hand with the original visible alongside. |
| **Recall** | 3 | Write from memory; the peek button is available (counted). |
| **Cloze** | 4 | Fill in `/* ??? */` blanks in progressively stripped code (3 substeps: minimal → medium → maximum gaps). |
| **Scratch** | 5 | Write from scratch given only the task description and starter function skeleton. |
| **Exam** | 6 | Timed live-coding with no peeking, no hints, and a countdown clock. Passing all tests graduates the Task. |
| **Mastered** | 7 | Terminal badge — no further practice required; 30-day final interval is set. |

## Task data model

| Term | Definition | Aliases to avoid |
|------|------------|------------------|
| **Block** | A thematic category grouping Tasks (e.g. JS, React, CSS, TS, Algorithms). | Category, group, topic |
| **Difficulty** | The experience level of a Task: `junior`, `middle`, `senior`, or `unknown`. | Level, rank, complexity |
| **Starter** | The initial skeleton code shown in the editor for a Task. | Boilerplate, scaffold, template |
| **Reference Solution** | The canonical correct implementation, used as the answer key and the target for retyping. | Answer, expected code, golden solution |
| **Cloze Steps** | Three progressive blank-out variants of the solution (minimal → medium → maximum) used in Stage 4. | Blanks, cloze variants, gap versions |
| **Breakdown** | A line-by-line explanation of the reference solution's logic. | Analysis, explanation, walkthrough |
| **Test Code** | The test suite shipped with each Task, using `assertEqual` and a `test()` DSL. | Spec, unit tests, assertions |

## People & actors

| Term | Definition | Aliases to avoid |
|------|------------|------------------|
| **Learner** | A person using the platform to memorize coding tasks via spaced repetition. | User, student, trainee, developer |
| **Author** | Someone who creates or uploads Tasks (including custom tasks via the Upload form). | Contributor, creator, task creator |

## UI surfaces

| Term | Definition | Aliases to avoid |
|------|------------|------------------|
| **Trainer (Dashboard)** | The landing view showing the learner's personal repetition queue, new tasks, and progress stats. | Home, main view, overview |
| **Catalog** | A searchable, filterable grid of all Tasks (built-in + custom) with stage and difficulty badges. | Task list, library, directory |
| **Upload** | A form for importing a JSON task array or creating a single custom Task. | Add task, import view |
| **Backup** | A view for exporting and importing learning progress (JSON). | Settings, data management |
| **Test Console** | The output panel showing test results (pass/fail/error) run in a sandboxed Web Worker. | Test output, results panel, runner |

## Infrastructure

| Term | Definition | Aliases to avoid |
|------|------------|------------------|
| **Web Worker** | A sandboxed worker thread that executes the learner's code and test suite with a 4-second timeout. | Sandbox, worker, isolated runtime |
| **Monaco Editor** | The code editing component (VS Code's editor) used for all coding stages. | Editor, IDE, code input |
| **localStorage** | The client-side persistence layer for custom tasks, progress data, and language preference. | Storage, cache, local DB |

## Relationships

- A **Learner** has **Progress** for exactly **Task**
- A **Task** belongs to one **Block** and has one **Difficulty**
- **Progress** tracks which **Learning Stage** the learner is on for that **Task**
- A **Task** has exactly 7 **Learning Stages**; progression is linear (1→2→3→4→5→6→7)
- Passing **Test Code** at any stage (2–6) advances the **Learning Stage** by 1
- Failing **Test Code** keeps the learner at the same **Learning Stage**
- **Progress** records a **History** entry (date, success, stage transition, time spent) on each test run
- **Custom Tasks** are a subset of **Tasks** stored separately in **localStorage**
- **Mastered** (Stage 7) is terminal — repeat interval is set to 30 days

## Flagged ambiguities

- **"Stage"** was used in the code to mean both `learningStage` (1–7 number) and the physical UI component (`StageStudy`, `StageExam`, etc.). These are consistent — each UI component renders exactly one Learning Stage.
- **"Block"** is used as the category field name. There is no relation to CSS `display: block` or blockchain — it simply means a thematic group of tasks. This term predates the ubiquitous language and would be clearer as "category" in the UI, but the code type name `block` is too entrenched to change.
- **"Test" / "Test Code"** is the test DSL (`test()` / `assertEqual()`) that a Task author writes, not the Runner that executes it (`testRunner.ts` / `testRunner.worker.ts`). This separation is clear in the code but invisible to the learner — the learner just sees "test results."
- **"Difficulty"** values (`junior`, `middle`, `senior`) map loosely to years of experience but are set per-Task by the author and not validated against any rubric.

## Example dialogue

> **Dev:** "When a **Learner** opens a **Task** for the first time, what **Learning Stage** do they start at?"

> **Domain expert:** "Always **Stage 1 (Study)**. They see the **Reference Solution** and **Breakdown**. No code writing yet — they click 'Start Practice' when ready."

> **Dev:** "And after that, how does progression work?"

> **Domain expert:** "They enter **Stage 2 (Retype)**: the solution is visible and they must type it by hand. Passing the **Test Code** advances them to **Stage 3 (Recall)**. Failing keeps them at the same stage."

> **Dev:** "What about **Stage 6 (Exam)** — is it different?"

> **Domain expert:** "Yes. It's timed — there's a countdown clock set to the Task's `timeLimitMin`. No **Peek** button, no hints. If the clock hits zero, the Exam resets and they must retry. Pass the tests and the **Task** is **Mastered**."

> **Dev:** "So **Mastered** means the **Learner** never sees that **Task** again?"

> **Domain expert:** "Not exactly. **Mastered** schedules a final review in 30 days via **Spaced Repetition**. After that, it's retired into a 'completed' state — but the learner can always come back to review from the **Catalog**."
