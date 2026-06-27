// Web Worker for running user code and tests in a separate thread

// Define globals inside the worker context
const tests: { name: string; fn: () => Promise<void> | void }[] = [];

function test(name: string, fn: () => Promise<void> | void) {
  tests.push({ name, fn });
}

function assertEqual(actual: any, expected: any) {
  const act = JSON.stringify(actual);
  const exp = JSON.stringify(expected);
  if (act !== exp) {
    throw new Error(`Expected: ${exp}\nGot: ${act}`);
  }
}

function assert(condition: any, message?: string) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

// Bind globals to worker self
(self as any).test = test;
(self as any).assertEqual = assertEqual;
(self as any).assert = assert;

self.onmessage = async (e: MessageEvent) => {
  const { userCode, testCode } = e.data;
  
  // Clear tests array for this run
  tests.length = 0;
  
  try {
    // We execute user code and test code using new Function
    // Wrapped in a block to resolve variables safely
    const runCode = new Function(`
      ${userCode}
      
      ${testCode}
    `);
    
    runCode();
    
    const results: { name: string; success: boolean; error?: string }[] = [];
    
    for (const t of tests) {
      try {
        await t.fn();
        results.push({ name: t.name, success: true });
      } catch (err: any) {
        results.push({ name: t.name, success: false, error: err.message || String(err) });
      }
    }
    
    self.postMessage({ type: 'results', results });
  } catch (err: any) {
    self.postMessage({ type: 'error', error: err.message || String(err) });
  }
};
