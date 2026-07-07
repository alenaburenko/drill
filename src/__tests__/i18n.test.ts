import { describe, test, expect } from 'vitest';
import { getT } from '../i18n';
import type { Lang } from '../i18n';

describe('i18n', () => {
  test('getT returns an object for uk locale', () => {
    const t = getT('uk');
    expect(t).toBeTruthy();
    expect(typeof t).toBe('object');
  });

  test('getT returns an object for en locale', () => {
    const t = getT('en');
    expect(t).toBeTruthy();
    expect(typeof t).toBe('object');
  });

  test('both locales have the same set of top-level keys', () => {
    const uk = getT('uk');
    const en = getT('en');
    const ukKeys = Object.keys(uk).sort();
    const enKeys = Object.keys(en).sort();
    expect(ukKeys).toEqual(enKeys);
  });

  test('getT returns appTitle for both locales', () => {
    expect(getT('uk').appTitle).toBe('DRILL');
    expect(getT('en').appTitle).toBe('DRILL');
  });

  test('getT returns different strings per locale', () => {
    const uk = getT('uk');
    const en = getT('en');
    // Some keys should differ
    const differingKeys = Object.keys(uk).filter(
      key => typeof uk[key] === 'string' && uk[key] !== en[key],
    );
    expect(differingKeys.length).toBeGreaterThan(0);
  });

  test('template functions work correctly', () => {
    const uk = getT('uk');
    const en = getT('en');

    // allTestsPassed is a function taking a boolean
    const nextStageMsg = (uk as any).allTestsPassed?.(true);
    expect(nextStageMsg).toBeTruthy();
    expect(typeof nextStageMsg).toBe('string');

    const doneMsg = (en as any).allTestsPassed?.(false);
    expect(doneMsg).toBeTruthy();
    expect(typeof doneMsg).toBe('string');
  });

  test('stage headers exist (array with title and desc)', () => {
    const uk = getT('uk');
    const en = getT('en');
    expect(Array.isArray((uk as any).stageHeaders)).toBe(true);
    expect(Array.isArray((en as any).stageHeaders)).toBe(true);
    expect((uk as any).stageHeaders.length).toBe((en as any).stageHeaders.length);
  });

  test('stages array exists in both locales', () => {
    const uk = getT('uk');
    const en = getT('en');
    expect(Array.isArray((uk as any).stages)).toBe(true);
    expect(Array.isArray((en as any).stages)).toBe(true);
    expect((uk as any).stages.length).toBe((en as any).stages.length);
  });

  test('no empty string values', () => {
    const uk = getT('uk');
    for (const key of Object.keys(uk)) {
      const val = uk[key as keyof typeof uk];
      if (typeof val === 'string') {
        expect(val.trim()).not.toBe('');
      }
    }
  });
});
