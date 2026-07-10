import { fromPartial } from '@total-typescript/shoehorn';
import { describe, test, expect, vi, beforeAll } from 'vitest';
import { runTestsInWorker, type RunResults, type TestResult } from '../runner/testRunner';

// Web Workers are not available in jsdom — provide a mock Worker
beforeAll(() => {
  if (typeof Worker === 'undefined') {
    // jsdom doesn't have Worker — mock one for our tests
    (globalThis as any).Worker = class MockWorker {
      private onmessageHandler: ((e: MessageEvent) => void) | null = null;
      onerror: ((err: ErrorEvent) => void) | null = null;

      constructor(url: string | URL, options?: WorkerOptions) {
        // We don't actually need to do anything — the constructor
        // is called with a module URL that Vite resolves
      }

      set onmessage(handler: ((e: MessageEvent) => void) | null) {
        this.onmessageHandler = handler;
      }

      get onmessage(): ((e: MessageEvent) => void) | null {
        return this.onmessageHandler;
      }

      postMessage(data: any): void {
        // Simulate the worker's logic inline
        this.runInline(data);
      }

      private async runInline(data: { userCode: string; testCode: string }) {
        const { userCode, testCode } = data;
        const tests: { name: string; fn: () => Promise<void> | void }[] = [];

        const testReg = (name: string, fn: () => Promise<void> | void) => {
          tests.push({ name, fn });
        };
        const assertEqual = (actual: any, expected: any) => {
          const act = JSON.stringify(actual);
          const exp = JSON.stringify(expected);
          if (act !== exp) {
            throw new Error(`Expected: ${exp}\nGot: ${act}`);
          }
        };
        const assert = (condition: any, message?: string) => {
          if (!condition) {
            throw new Error(message || 'Assertion failed');
          }
        };

        try {
          // Strip imports/exports (same as in bank.test.ts)
          const cleanUserCode = userCode.replace(/^(import|export)\s.*;?$/gm, '// $& (stripped)');
          const cleanTestCode = testCode.replace(/^(import|export)\s.*;?$/gm, '// $& (stripped)');

          const fn = new Function('test', 'assertEqual', 'assert', `${cleanUserCode}\n${cleanTestCode}`);
          fn(testReg, assertEqual, assert);

          const results = [];
          for (const t of tests) {
            try {
              await t.fn();
              results.push({ name: t.name, success: true });
            } catch (err: any) {
              results.push({ name: t.name, success: false, error: err.message || String(err) });
            }
          }

          if (this.onmessageHandler) {
            this.onmessageHandler(fromPartial({ data: { type: 'results', results } }));
          }
        } catch (err: any) {
          if (this.onmessageHandler) {
            this.onmessageHandler(fromPartial({ data: { type: 'error', error: err.message || String(err) } }));
          }
        }
      }

      terminate(): void {}
    } as any;
  }
});

describe('runTestsInWorker', () => {
  const SIMPLE_PASS = `test('pass case', async () => {
  assertEqual(1 + 1, 2);
});`;
  const USER_CODE = `function add(a, b) { return a + b; }`;
  const TEST_USING_CODE = `test('adds numbers', async () => {
  assertEqual(add(2, 3), 5);
});`;

  test('returns success for passing tests', async () => {
    const result = await runTestsInWorker('', SIMPLE_PASS);
    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(1);
    expect(result.results![0].success).toBe(true);
  });

  test('returns failure for failing test', async () => {
    const result = await runTestsInWorker(
      '',
      `test('fail', async () => {
  assertEqual(1, 2);
});`,
    );
    expect(result.success).toBe(false);
    expect(result.results).toHaveLength(1);
    expect(result.results![0].success).toBe(false);
    expect(result.results![0].error).toBeTruthy();
  });

  test('can use user code in tests', async () => {
    const result = await runTestsInWorker(USER_CODE, TEST_USING_CODE);
    expect(result.success).toBe(true);
    expect(result.results![0].success).toBe(true);
  });

  test('reports multiple test results', async () => {
    const result = await runTestsInWorker(
      '',
      `
      test('first', async () => { assertEqual(1, 1); });
      test('second', async () => { assertEqual(2, 2); });
    `,
    );
    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
  });

  test('reports partial success when some tests fail', async () => {
    const result = await runTestsInWorker(
      '',
      `
      test('pass', async () => { assertEqual(1, 1); });
      test('fail', async () => { assertEqual(1, 2); });
    `,
    );
    expect(result.success).toBe(false);
    expect(result.results![0].success).toBe(true);
    expect(result.results![1].success).toBe(false);
  });

  test('handles runtime error in test gracefully', async () => {
    const result = await runTestsInWorker(
      '',
      `test('throws', async () => {
  throw new Error('oops');
});`,
    );
    expect(result.success).toBe(false);
    expect(result.results![0].success).toBe(false);
    expect(result.results![0].error).toContain('oops');
  });

  test('handles assert with falsy condition', async () => {
    const result = await runTestsInWorker(
      '',
      `test('assert false', async () => {
  assert(false, 'condition was false');
});`,
    );
    expect(result.results![0].success).toBe(false);
  });

  test('handles async assertEqual correctly', async () => {
    const result = await runTestsInWorker(
      '',
      `test('async equal', async () => {
  const val = await Promise.resolve(42);
  assertEqual(val, 42);
});`,
    );
    expect(result.success).toBe(true);
  });

  test('times out on infinite loop', async () => {
    const result = await runTestsInWorker(
      '',
      `test('infinite', async () => {
  while(true) { await new Promise(r => setTimeout(r, 10)); }
});`,
      100,
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('Timeout');
  }, 10000);

  test('survives empty test code', async () => {
    const result = await runTestsInWorker('', '');
    expect(result).toBeDefined();
  });
});
