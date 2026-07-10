import { UserProgress } from '../types';

export interface Achievement {
  id: string;
  icon: string;
  titleUk: string;
  titleEn: string;
  descUk: string;
  descEn: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    icon: '🩸',
    titleUk: 'Перша кров',
    titleEn: 'First Blood',
    descUk: 'Ви виконали перше успішне кодове заучування!',
    descEn: 'Completed your first successful code repetition!',
  },
  {
    id: 'perfectionist',
    icon: '🎯',
    titleUk: 'Перфекціоніст',
    titleEn: 'Perfectionist',
    descUk: 'Пройдено етап заучування без жодного підглядання (Peek = 0).',
    descEn: 'Passed a repetition stage without a single peek.',
  },
  {
    id: 'speed_demon',
    icon: '⚡',
    titleUk: 'Король швидкості',
    titleEn: 'Speed Demon',
    descUk: 'Іспит (Stage 6) складено менш ніж за 60 секунд!',
    descEn: 'Passed the Exam (Stage 6) in less than 60 seconds!',
  },
  {
    id: 'task_master',
    icon: '👑',
    titleUk: 'Майстер коду',
    titleEn: 'Task Master',
    descUk: 'Доведено хоча б одну кодову задачу до фінального етапу (Stage 7).',
    descEn: 'Brought at least one task to the final mastered stage (Stage 7).',
  },
  {
    id: 'night_owl',
    icon: '🦉',
    titleUk: 'Нічна сова',
    titleEn: 'Night Owl',
    descUk: 'Код успішно заучено глибокої ночі (між 00:00 та 05:00).',
    descEn: 'Successfully practiced code in the middle of the night (00:00 - 05:00).',
  },
  {
    id: 'grind_machine',
    icon: '⚙️',
    titleUk: 'Невпинний Грайнд',
    titleEn: 'Grind Machine',
    descUk: 'Ви почали практикувати вже 5 або більше різних задач!',
    descEn: 'Practiced 5 or more different tasks in total.',
  },
];

export function checkNewAchievements(
  progressMap: Record<string, UserProgress>,
  updatedProgress: UserProgress,
  unlockedIds: string[],
): Achievement[] {
  const newUnlocks: Achievement[] = [];

  // Helper helper to check if already unlocked
  const isLocked = (id: string) => !unlockedIds.includes(id);

  // Get last history attempt
  const history = updatedProgress.history || [];
  const lastAttempt = history[history.length - 1];
  const lastSuccess = lastAttempt?.success === true;

  // 1. First Blood
  if (isLocked('first_blood') && lastSuccess) {
    newUnlocks.push(ACHIEVEMENTS.find(a => a.id === 'first_blood')!);
  }

  // 2. Perfectionist
  if (isLocked('perfectionist') && lastSuccess) {
    // Check if peeks count didn't increase in this attempt or is zero
    // In our domain model, progress.peeksCount is global per task.
    if (updatedProgress.peeksCount === 0) {
      newUnlocks.push(ACHIEVEMENTS.find(a => a.id === 'perfectionist')!);
    }
  }

  // 3. Speed Demon
  if (isLocked('speed_demon') && lastSuccess) {
    if (lastAttempt.stageBefore === 6 && lastAttempt.timeSpentSec !== undefined && lastAttempt.timeSpentSec <= 60) {
      newUnlocks.push(ACHIEVEMENTS.find(a => a.id === 'speed_demon')!);
    }
  }

  // 4. Task Master
  if (isLocked('task_master')) {
    if (updatedProgress.learningStage >= 7) {
      newUnlocks.push(ACHIEVEMENTS.find(a => a.id === 'task_master')!);
    }
  }

  // 5. Night Owl
  if (isLocked('night_owl') && lastSuccess) {
    const attemptTime = lastAttempt.date ? new Date(lastAttempt.date) : new Date();
    const hour = attemptTime.getHours();
    if (hour >= 0 && hour < 5) {
      newUnlocks.push(ACHIEVEMENTS.find(a => a.id === 'night_owl')!);
    }
  }

  // 6. Grind Machine
  if (isLocked('grind_machine')) {
    const activeTasksCount = Object.keys(progressMap).length;
    if (activeTasksCount >= 5) {
      newUnlocks.push(ACHIEVEMENTS.find(a => a.id === 'grind_machine')!);
    }
  }

  return newUnlocks;
}
