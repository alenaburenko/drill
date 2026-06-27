export interface DrillTask {
  id: string;
  block: string;
  title: string;
  timeLimitMin: number;
  description: string;
  starter: string;
  solution: string;
  clozeSteps?: [string, string, string];
  cloze?: string; // fallback if needed
  breakdown: string;
  testCode: string;
  difficulty: 'junior' | 'middle' | 'senior' | 'unknown';
}

export interface UserProgress {
  learningStage: number; // 1 to 7
  peeksCount: number;
  lastPracticed: string | null;
  nextDue?: string; // Saved next practice ISO date string
  drafts?: Record<number, string>; // Saved drafts of user solution per learningStage (2 to 6)
  history: {
    date: string;
    success: boolean;
    stageBefore: number;
    stageAfter: number;
    timeSpentSec?: number;
  }[];
}

