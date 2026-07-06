// Shared badge helper functions for task difficulty and learning stage display.
// Extracted from src/App.tsx and src/components/TaskView.tsx to eliminate duplication.

export function diffBadge(d: string): string {
  if (d === 'junior') return 'bg-green-950/60 text-green-400 border border-green-800/60';
  if (d === 'senior') return 'bg-red-950/60 text-red-400 border border-red-800/60';
  return 'bg-amber-950/60 text-amber-400 border border-amber-800/60';
}

export function stageBadge(mastered: boolean, stage: number): string {
  return mastered
    ? 'bg-green-950/60 text-green-400 border border-green-800/60'
    : stage > 1
      ? 'bg-orange-950/60 text-orange-400 border border-orange-800/60'
      : 'bg-[#1e1e1e] text-[#555] border border-[#2a2a2a]';
}
