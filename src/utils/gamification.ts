import { UserProgress, DrillTask } from '../types';

export interface LevelInfo {
  level: number;
  titleUk: string;
  titleEn: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    titleUk: 'Початківець (Script Kiddie)',
    titleEn: 'Script Kiddie',
    minXP: 0,
    maxXP: 100,
    color: 'var(--text-muted)',
  },
  {
    level: 2,
    titleUk: 'Юніор Кодер (Junior Coder)',
    titleEn: 'Junior Coder',
    minXP: 100,
    maxXP: 300,
    color: 'var(--neon-green)',
  },
  {
    level: 3,
    titleUk: 'Кібер Взломщик (Cyber Hacker)',
    titleEn: 'Cyber Hacker',
    minXP: 300,
    maxXP: 700,
    color: 'var(--neon-cyan)',
  },
  {
    level: 4,
    titleUk: 'Кодовий Ніндзя (Code Ninja)',
    titleEn: 'Code Ninja',
    minXP: 700,
    maxXP: 1500,
    color: 'var(--neon-amber)',
  },
  {
    level: 5,
    titleUk: 'Майстер Системи (System Architect)',
    titleEn: 'System Architect',
    minXP: 1500,
    maxXP: 3000,
    color: 'var(--neon-magenta)',
  },
  {
    level: 6,
    titleUk: 'Легенда Деків (Code Demigod)',
    titleEn: 'Code Demigod',
    minXP: 3000,
    maxXP: Infinity,
    color: '#ff003c',
  },
];

export function getLevelForXP(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function calculateUserXP(progressMap: Record<string, UserProgress>, tasks: DrillTask[]): number {
  let totalXP = 0;
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  Object.entries(progressMap).forEach(([taskId, progress]) => {
    const p = progress as UserProgress;
    const task = taskMap.get(taskId);
    if (!task) return;

    let stageXP = 0;
    const stage = p.learningStage || 1;
    if (stage === 2) stageXP = 5;
    else if (stage === 3) stageXP = 10;
    else if (stage === 4) stageXP = 15;
    else if (stage === 5) stageXP = 20;
    else if (stage === 6) stageXP = 30;
    else if (stage >= 7) stageXP = 60; // 60 XP for mastery!

    let multiplier = 1.0;
    if (task.difficulty === 'middle') multiplier = 1.5;
    else if (task.difficulty === 'senior') multiplier = 2.5;

    totalXP += Math.floor(stageXP * multiplier);
  });

  return totalXP;
}

export function calculatePracticeStreak(progressMap: Record<string, UserProgress>): number {
  const dates = new Set<string>();

  Object.values(progressMap).forEach(progress => {
    const p = progress as UserProgress;
    if (p?.history) {
      p.history.forEach(attempt => {
        if (attempt.date) {
          dates.add(attempt.date.split('T')[0]); // YYYY-MM-DD
        }
      });
    }
  });

  if (dates.size === 0) return 0;

  // Sort dates descending
  const sortedDates = Array.from(dates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If neither today nor yesterday has activity, streak is broken
  if (!dates.has(todayStr) && !dates.has(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = dates.has(todayStr) ? new Date() : yesterday;

  // Infinite loop until date not found
  while (true) {
    const checkStr = checkDate.toISOString().split('T')[0];
    if (dates.has(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
