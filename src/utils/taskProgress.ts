import type { DrillTask, UserProgress } from '../types';
import { STAGE_INTERVALS_HOURS } from '../constants';

// Note: STAGE_INTERVALS_HOURS is now defined in src/constants.ts,
// imported here as the single source of truth.

/** Get a default progress object for a task that hasn't been started */
export function getDefaultProgress(): UserProgress {
  return { learningStage: 1, peeksCount: 0, lastPracticed: null, history: [] };
}

/** Get task progress, returning default if not started */
export function getTaskProgress(progressMap: Record<string, UserProgress>, id: string): UserProgress {
  return progressMap[id] || getDefaultProgress();
}

/** Check if a task is due for repetition */
export function isTaskDue(task: DrillTask, progressMap: Record<string, UserProgress>): boolean {
  const prog = progressMap[task.id];
  if (!prog || !prog.lastPracticed) return false;
  if (prog.learningStage >= 7) return false;
  const msInHour = 3600000;
  const dueTime = new Date(prog.lastPracticed).getTime() + (STAGE_INTERVALS_HOURS[prog.learningStage] || 24) * msInHour;
  return Date.now() >= dueTime;
}

/** Get tasks that haven't been started */
export function getNewTasks(allTasks: DrillTask[], progressMap: Record<string, UserProgress>): DrillTask[] {
  return allTasks.filter(t => !progressMap[t.id] || progressMap[t.id].learningStage === 1);
}

/** Get tasks that are due for repetition */
export function getDueRepetitions(allTasks: DrillTask[], progressMap: Record<string, UserProgress>): DrillTask[] {
  return allTasks.filter(t => isTaskDue(t, progressMap));
}

/** Get tasks that have been mastered (stage >= 7) */
export function getMasteredTasks(allTasks: DrillTask[], progressMap: Record<string, UserProgress>): DrillTask[] {
  return allTasks.filter(t => progressMap[t.id]?.learningStage >= 7);
}

/** Get in-progress tasks (stage 2-6) */
export function getInProgressTasks(allTasks: DrillTask[], progressMap: Record<string, UserProgress>): DrillTask[] {
  return allTasks.filter(
    t => progressMap[t.id] && progressMap[t.id].learningStage > 1 && progressMap[t.id].learningStage < 7,
  );
}

/** Computed stats derived from progress */
export function getStats(progressMap: Record<string, UserProgress>, allTasks: DrillTask[], masteredTasks: DrillTask[]) {
  let totalPeeks = 0;
  let totalAttempts = 0;
  let successfulAttempts = 0;
  (Object.values(progressMap) as UserProgress[]).forEach(prog => {
    totalPeeks += prog.peeksCount || 0;
    if (prog.history) {
      totalAttempts += prog.history.length;
      successfulAttempts += prog.history.filter(h => h.success).length;
    }
  });
  return {
    totalPeeks,
    totalAttempts,
    accuracy: totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 100,
    completionRate: allTasks.length > 0 ? Math.round((masteredTasks.length / allTasks.length) * 100) : 0,
  };
}

/** Pick the next task to practice (due > practicing > new > any) */
export function pickNextTask(
  dueRepetitions: DrillTask[],
  inProgressTasks: DrillTask[],
  progressMap: Record<string, UserProgress>,
  newTasks: DrillTask[],
  allTasks: DrillTask[],
): string | null {
  if (dueRepetitions.length > 0) return dueRepetitions[0].id;
  const activePracticed = inProgressTasks
    .filter(t => progressMap[t.id]?.lastPracticed)
    .sort(
      (a, b) =>
        new Date(progressMap[b.id].lastPracticed!).getTime() - new Date(progressMap[a.id].lastPracticed!).getTime(),
    );
  if (activePracticed.length > 0) return activePracticed[0].id;
  if (newTasks.length > 0) return newTasks[0].id;
  if (allTasks.length > 0) return allTasks[0].id;
  return null;
}
