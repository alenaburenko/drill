/**
 * Shared retro sound system for the Drill practice platform.
 *
 * All components should import sound functions from here instead of
 * duplicating the AudioContext pipeline.
 */

function getAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

function playBeep(freq = 880, duration = 60, type: OscillatorType = 'square') {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    /* silent fail */
  }
}

export function playClick() {
  playBeep(660, 40, 'square');
}

export function playSuccess() {
  playBeep(1047, 60, 'square');
  setTimeout(() => playBeep(1319, 80, 'square'), 70);
}

export function playError() {
  playBeep(220, 200, 'sawtooth');
}

export function playBoot() {
  playBeep(440, 80, 'square');
  setTimeout(() => playBeep(880, 60, 'square'), 100);
  setTimeout(() => playBeep(1320, 100, 'square'), 200);
}

export function playGlitch() {
  playBeep(180, 80, 'sawtooth');
}

export function playNavClick() {
  playBeep(880, 40, 'square');
  setTimeout(() => playBeep(1100, 50, 'square'), 50);
}

export function playTaskClick() {
  playBeep(660, 30, 'square');
}

export function playLevelUp() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5 arpeggio
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.08, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  } catch {
    /* silent fail */
  }
}

export function playAchievementFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.06, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  } catch {
    /* silent fail */
  }
}
