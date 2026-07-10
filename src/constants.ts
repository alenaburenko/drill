/**
 * Shared constants for the Drill practice platform.
 *
 * Single source of truth for spaced-repetition intervals per learning stage.
 */

/** Interval in hours per learning stage (index = stage number, 0 unused) */
export const STAGE_INTERVALS_HOURS: number[] = [0, 0, 1, 24, 72, 168, 720];

/**
 * Map of stage → interval hours for stages 2-6.
 * Derived from STAGE_INTERVALS_HOURS so they never drift apart.
 */
export const INTERVAL_MAP: Record<number, number> = (() => {
  const map: Record<number, number> = {};
  STAGE_INTERVALS_HOURS.forEach((hours, stage) => {
    if (stage >= 2) {
      map[stage] = hours;
    }
  });
  return map;
})();
