import { describe, test, expect } from 'vitest';
import { itleadTasks } from './itlead';

// Helper function to execute task code with testCode
function runTask(code: string, testCode: string, opts?: { allowImports?: boolean }) {
  const tests: { name: string; fn: () => void | Promise<void> }[] = [];
  const testReg = (name: string, fn: () => void | Promise<void>) => {
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

  let evalCode = `${code}\n${testCode}`;
  // Strip import/export statements (not supported in new Function)
  if (!opts?.allowImports) {
    evalCode = evalCode.replace(/^(import|export)\s.*;?$/gm, '// $& (stripped)');
  }

  // Evaluate code
  const fn = new Function('test', 'assertEqual', 'assert', evalCode);

  fn(testReg, assertEqual, assert);

  return tests;
}

describe('ITLead Task Bank Verification', () => {
  // 1. Check unique IDs
  test('IDs are unique', () => {
    const ids = itleadTasks.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  // 2. Perform validations on each task
  itleadTasks.forEach(task => {
    describe(`Task: ${task.title} (${task.id})`, () => {
      test('Has non-empty core fields', () => {
        expect(task.id).toBeTruthy();
        expect(task.title).toBeTruthy();
        expect(task.starter).toBeTruthy();
        expect(task.solution).toBeTruthy();
        expect(task.testCode).toBeTruthy();
        expect(task.clozeSteps).toBeDefined();
        expect(task.clozeSteps.length).toBe(3);
        expect(task.clozeSteps[0]).toBeTruthy();
        expect(task.clozeSteps[1]).toBeTruthy();
        expect(task.clozeSteps[2]).toBeTruthy();
      });

      test('Does not contain unresolved RSC links like $20, $1f', () => {
        const rscRefRegex = /\$[0-9a-f]{2}/i;
        expect(task.starter).not.toMatch(rscRefRegex);
        expect(task.solution).not.toMatch(rscRefRegex);
        expect(task.testCode).not.toMatch(rscRefRegex);
        expect(task.description).not.toMatch(rscRefRegex);
      });

      test('Does not contain stub assertEqual(true, true)', () => {
        const isStub = task.testCode.includes('assertEqual(true, true)') || task.testCode.includes('assert(true)');
        expect(isStub).toBe(false);
      });

      test('Solution passes all tests', async () => {
        const tests = runTask(task.solution, task.testCode);
        expect(tests.length).toBeGreaterThan(0);

        for (const t of tests) {
          await t.fn(); // Should not throw
        }
      });

      test('Starter code fails at least one test', async () => {
        let failed = false;
        try {
          const hasImports = /^(import|export)\s/.test(task.starter.trim());
          if (hasImports) {
            // Code with imports is inherently incomplete in the sandbox
            failed = true;
          } else {
            const tests = runTask(task.starter, task.testCode);
            if (tests.length === 0) {
              failed = true;
            } else {
              for (const t of tests) {
                try {
                  await t.fn();
                } catch (err) {
                  failed = true;
                  break;
                }
              }
            }
          }
        } catch (e) {
          failed = true; // Evaluation or compilation error count as failure, which is expected
        }
        expect(failed).toBe(true);
      });
    });
  });
});
