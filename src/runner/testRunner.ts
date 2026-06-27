export interface TestResult {
  name: string;
  success: boolean;
  error?: string;
}

export interface RunResults {
  success: boolean;
  results?: TestResult[];
  error?: string;
}

export function runTestsInWorker(
  userCode: string,
  testCode: string,
  timeoutMs: number = 4000
): Promise<RunResults> {
  return new Promise((resolve) => {
    let worker: Worker | null = null;
    let timeoutId: any = null;

    try {
      // Instantiate worker using ESM standard URL syntax (fully supported by Vite)
      worker = new Worker(
        new URL('./testRunner.worker.ts', import.meta.url),
        { type: 'module' }
      );

      timeoutId = setTimeout(() => {
        if (worker) {
          worker.terminate();
          resolve({
            success: false,
            error: `Timeout exceeded (${timeoutMs / 1000}s). Possible infinite loop or slow execution.`,
          });
        }
      }, timeoutMs);

      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        if (worker) worker.terminate();

        const data = e.data;
        if (data.type === 'results') {
          const results: TestResult[] = data.results;
          const allPassed = results.every((r) => r.success);
          resolve({
            success: allPassed,
            results,
          });
        } else if (data.type === 'error') {
          resolve({
            success: false,
            error: data.error,
          });
        }
      };

      worker.onerror = (err) => {
        clearTimeout(timeoutId);
        if (worker) worker.terminate();
        resolve({
          success: false,
          error: err.message || 'Worker compilation error or syntax error in user code.',
        });
      };

      worker.postMessage({ userCode, testCode });
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      if (worker) worker.terminate();
      resolve({
        success: false,
        error: err.message || 'Failed to initialize code runner sandbox.',
      });
    }
  });
}
