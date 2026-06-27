import fs from 'node:fs';
import path from 'node:path';

const TARGET_DIR = './src/tasks';
const TARGET_FILE = path.join(TARGET_DIR, 'itlead.ts');
const SKIPPED_FILE = './skipped-tasks.json';

// Simple function execution runner for validation in importer
function runTaskInImporter(code, testCode) {
  const tests = [];
  const testReg = (name, fn) => {
    tests.push({ name, fn });
  };
  
  const assertEqual = (actual, expected) => {
    const act = JSON.stringify(actual);
    const exp = JSON.stringify(expected);
    if (act !== exp) {
      throw new Error(`Expected: ${exp}\nGot: ${act}`);
    }
  };
  
  const assert = (condition, message) => {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  };

  const fn = new Function('test', 'assertEqual', 'assert', `
    ${code}
    ${testCode}
  `);
  
  fn(testReg, assertEqual, assert);
  
  return tests;
}

// Check if a line is suitable to be hidden in cloze step
function isHideableLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^[\}\]\)]+;?$/.test(trimmed)) return false;
  if (trimmed === '} else {' || trimmed === 'else {' || trimmed === 'try {' || trimmed === 'finally {') return false;
  return true;
}

// Generate semantic ukrainian comments for cloze steps
function getHintForLine(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('return ') || trimmed === 'return;') {
    return '/* TODO: повернути результат */';
  }
  if (trimmed.includes('new Map(') || trimmed.includes('new Map()')) {
    return '/* TODO: ініціалізувати Map для швидкого пошуку */';
  }
  if (trimmed.includes('new Set(') || trimmed.includes('new Set()')) {
    return '/* TODO: ініціалізувати Set для відстеження унікальних елементів */';
  }
  if (trimmed.startsWith('let ') || trimmed.startsWith('const ') || trimmed.startsWith('var ')) {
    return '/* TODO: ініціалізувати допоміжну змінну */';
  }
  if (trimmed.startsWith('if ') || trimmed.startsWith('else if ')) {
    return '/* TODO: обробити крайовий випадок або умову */';
  }
  if (trimmed.startsWith('for ') || trimmed.startsWith('while ') || trimmed.includes('.forEach') || trimmed.includes('.map(')) {
    return '/* TODO: виконати обхід елементів */';
  }
  if (trimmed.includes('.push(') || trimmed.includes('.add(') || trimmed.includes('.set(')) {
    return '/* TODO: додати або оновити елемент у структурі даних */';
  }
  return '/* TODO: обчислити проміжне значення */';
}

function getIndicesToHide(H, ratio) {
  const count = Math.max(1, Math.round(H * ratio));
  if (count >= H) {
    return Array.from({ length: H }, (_, i) => i);
  }
  const chosen = new Set();
  for (let i = 0; i < count; i++) {
    const index = Math.floor(i * (H / count));
    chosen.add(index);
  }
  return chosen;
}

function generateClozeSteps(solution) {
  const lines = solution.split('\n');
  const hideableIndices = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (i === 0 || i === lines.length - 1) continue;
    if (isHideableLine(lines[i])) {
      hideableIndices.push(i);
    }
  }
  
  const H = hideableIndices.length;
  if (H === 0) {
    return [solution, solution, solution];
  }

  const stepRatios = [0.25, 0.50, 0.75];
  const steps = stepRatios.map(ratio => {
    const chosenLocalIndices = getIndicesToHide(H, ratio);
    const hiddenLineIndices = new Set(Array.from(chosenLocalIndices).map(idx => hideableIndices[idx]));
    
    const stepLines = lines.map((line, idx) => {
      if (hiddenLineIndices.has(idx)) {
        const indent = line.slice(0, line.length - line.trimStart().length);
        const hint = getHintForLine(line);
        return indent + hint;
      }
      return line;
    });
    return stepLines.join('\n');
  });
  
  return steps;
}

// NextJS RSC Reference Resolution Algorithm
function extractRefId(str) {
  if (typeof str !== 'string' || !str.startsWith('$')) return null;
  const match = str.match(/^\$(?:[a-zA-Z]+)?([0-9a-f]+)$/i);
  if (match) {
    return match[1];
  }
  return null;
}

function resolveRefs(val, registry, visited = new Set()) {
  if (val === null || val === undefined) return val;

  if (typeof val === 'string') {
    const refId = extractRefId(val);
    if (refId && registry[refId] !== undefined) {
      if (visited.has(refId)) {
        return undefined; // Avoid circular reference infinite recursion
      }
      visited.add(refId);
      const resolved = resolveRefs(registry[refId], registry, visited);
      visited.delete(refId);
      return resolved;
    }
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(item => resolveRefs(item, registry, visited));
  }

  if (typeof val === 'object') {
    const resolvedObj = {};
    for (const key of Object.keys(val)) {
      resolvedObj[key] = resolveRefs(val[key], registry, visited);
    }
    return resolvedObj;
  }

  return val;
}

function findInitialProblem(obj, visited = new Set()) {
  if (!obj || typeof obj !== 'object' || visited.has(obj)) return null;
  visited.add(obj);

  if (obj.initialProblem) {
    return obj.initialProblem;
  }

  for (const key of Object.keys(obj)) {
    const found = findInitialProblem(obj[key], visited);
    if (found) return found;
  }

  return null;
}

async function run() {
  console.log('=== STARTING ITLEAD PROBLEMS IMPORT ===');
  
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 1. Fetch Sitemap to get all unique slugs
  console.log('Fetching sitemap.xml...');
  let sitemapText;
  try {
    const sitemapRes = await fetch('https://itlead.org/sitemap.xml');
    sitemapText = await sitemapRes.text();
  } catch (err) {
    console.error('Error fetching sitemap:', err.message);
    process.exit(1);
  }

  const slugRegex = /<loc>https:\/\/itlead\.org\/(?:ua\/)?problems\/([^<]+)<\/loc>/g;
  let match;
  const uniqueSlugs = new Set();
  while ((match = slugRegex.exec(sitemapText)) !== null) {
    const slug = match[1].trim();
    if (slug) {
      uniqueSlugs.add(slug);
    }
  }

  const slugs = Array.from(uniqueSlugs);
  console.log(`Found ${slugs.length} unique problem slugs from sitemap.`);

  const CONCURRENCY = 25;
  const validTasks = [];
  const skippedTasks = [];
  let completed = 0;

  async function worker(queue) {
    while (queue.length > 0) {
      const slug = queue.shift();
      if (!slug) continue;
      
      try {
        const url = `https://itlead.org/ua/problems/${slug}`;
        const res = await fetch(url);
        if (res.status !== 200) {
          skippedTasks.push({ slug, reason: `Failed to fetch problem page (Status: ${res.status})` });
          completed++;
          continue;
        }
        const html = await res.text();
        const taskResult = await processAndValidatePage(slug, html);
        
        if (taskResult.valid) {
          validTasks.push(taskResult.task);
        } else {
          skippedTasks.push({ slug, reason: taskResult.reason });
        }
      } catch (err) {
        skippedTasks.push({ slug, reason: `Unexpected error during worker processing: ${err.message}` });
      }
      completed++;
      if (completed % 10 === 0 || completed === slugs.length) {
        console.log(`Progress: ${completed}/${slugs.length} processed. Valid: ${validTasks.length}, Skipped: ${skippedTasks.length}`);
      }
    }
  }

  const queue = [...slugs];
  const workers = Array.from({ length: CONCURRENCY }, () => worker(queue));
  await Promise.all(workers);

  console.log(`Successfully completed crawl! Valid: ${validTasks.length}, Skipped: ${skippedTasks.length}`);

  // Write valid tasks
  const outputContent = `import type { DrillTask } from '../types';

// Generated by scripts/import-itlead.mjs. Do not edit manually.
export const itleadTasks: DrillTask[] = ${JSON.stringify(validTasks, null, 2)};
`;
  fs.writeFileSync(TARGET_FILE, outputContent, 'utf8');
  console.log(`Saved ${validTasks.length} valid tasks to ${TARGET_FILE}`);

  // Write skipped tasks
  fs.writeFileSync(SKIPPED_FILE, JSON.stringify(skippedTasks, null, 2), 'utf8');
  console.log(`Saved skipped tasks report to ${SKIPPED_FILE}`);
}

async function processAndValidatePage(slug, html) {
  // Extract RSC payload from self.__next_f.push scripts
  const regex = /self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g;
  let rscText = '';
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      rscText += JSON.parse(`"${match[1]}"`);
    } catch (e) {
      rscText += match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }

  // Parse lines to build RSC registry
  const lines = [];
  const rscLineRegex = /^([0-9a-f]+):([\s\S]*?)(?=(?:^[0-9a-f]+:)|$)/gm;
  let lineMatch;
  while ((lineMatch = rscLineRegex.exec(rscText)) !== null) {
    const id = lineMatch[1];
    const content = lineMatch[2].trim();
    lines.push({ id, content });
  }

  const registry = {};
  for (const { id, content } of lines) {
    let parsed = content;
    const firstChar = content[0];
    if (firstChar === '{' || firstChar === '[' || firstChar === '"' || content === 'true' || content === 'false' || content === 'null') {
      try {
        parsed = JSON.parse(content);
      } catch (e) {}
    } else if (content.startsWith('I')) {
      try {
        parsed = JSON.parse(content.slice(1));
      } catch (e) {}
    }
    registry[id] = parsed;
  }

  // Resolve all references in the registry
  const resolvedRegistry = {};
  for (const key of Object.keys(registry)) {
    resolvedRegistry[key] = resolveRefs(registry[key], registry);
  }

  // Deep search for initialProblem
  const problem = findInitialProblem(resolvedRegistry);
  if (!problem) {
    return { valid: false, reason: 'Could not extract initialProblem from RSC payload' };
  }

  // Retrieve details
  const title = (problem.titleUa || problem.title || slug).trim();
  const description = (problem.descriptionUa || problem.description || '').trim();
  
  const rawDifficulty = (problem.difficulty || 'MIDDLE').toLowerCase();
  const difficulty = rawDifficulty === 'junior' ? 'junior' : 
                     (rawDifficulty === 'senior' ? 'senior' : 
                      (rawDifficulty === 'middle' ? 'middle' : 'unknown'));

  const rawCategory = (problem.category || 'javascript').toLowerCase();
  const allowedCategories = ['javascript', 'promises', 'async', 'arrays', 'objects', 'react', 'algorithms'];
  const block = allowedCategories.includes(rawCategory) ? rawCategory : 'javascript';

  const timeLimitMin = difficulty === 'junior' ? 5 : (difficulty === 'senior' ? 12 : 8);

  const starter = problem.starterCode;
  const solution = problem.solution;

  if (!starter || !solution) {
    return { valid: false, reason: 'Missing starterCode or solution' };
  }

  // Extract function name and params
  const funcMatch = starter.match(/function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/) || 
                    solution.match(/function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/) ||
                    starter.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/) ||
                    solution.match(/const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);

  const functionName = funcMatch ? funcMatch[1] : null;
  const paramNames = funcMatch ? funcMatch[2].split(',').map(p => p.trim()).filter(Boolean) : [];

  if (!functionName) {
    return { valid: false, reason: 'Could not extract main function name from solution or starter' };
  }

  // Parse testCases
  let testCases = null;
  if (problem.testCases) {
    try {
      testCases = typeof problem.testCases === 'string' ? JSON.parse(problem.testCases) : problem.testCases;
    } catch (e) {
      return { valid: false, reason: `Failed to parse testCases JSON: ${e.message}` };
    }
  }

  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    return { valid: false, reason: 'No testCases found' };
  }

  const testCode = generateTestCode(functionName, paramNames, testCases);

  // Generate deterministic gradual cloze steps
  const clozeSteps = generateClozeSteps(solution);

  const finalDescription = `Источник: https://itlead.org/ua/problems/${slug}
Категория: ${block}. Сложность: ${difficulty.toUpperCase()}.

${description}`;

  const task = {
    id: `itlead-${slug}`,
    block,
    title,
    timeLimitMin,
    description: finalDescription,
    starter,
    solution,
    clozeSteps,
    breakdown: `Автоимпорт из ITLead.

Тренируй основную функцию: ${functionName}.
Тесты вызывают ${functionName} напрямую с входами из testCases.

После решения сравни с эталоном и отдельно проговори: базовый случай, основной инвариант, сложность и крайние случаи из условия.

${description}`,
    testCode,
    difficulty
  };

  // Perform self-validation
  const validationResult = await validateTask(task);
  if (!validationResult.valid) {
    return { valid: false, reason: validationResult.reason };
  }

  return { valid: true, task };
}

function generateTestCode(functionName, paramNames, testCases) {
  let code = `const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));\n\n`;
  
  testCases.forEach((tc, idx) => {
    const inputVal = JSON.stringify(tc.input);
    const expectedVal = JSON.stringify(tc.expected);
    
    code += `test('ITLead case ${idx + 1}', async () => {\n`;
    code += `  const input = clone(${inputVal});\n`;
    code += `  const expected = clone(${expectedVal});\n`;
    
    if (typeof tc.input === 'object' && tc.input !== null && !Array.isArray(tc.input)) {
      const keys = Object.keys(tc.input);
      if (paramNames.length > 0 && paramNames.every(p => keys.includes(p))) {
        const args = paramNames.map(p => `input.${p}`);
        code += `  const actual = await ${functionName}(${args.join(', ')});\n`;
      } else {
        if (keys.length === 1) {
          code += `  const actual = await ${functionName}(input.${keys[0]});\n`;
        } else {
          const args = keys.map(k => `input.${k}`);
          code += `  const actual = await ${functionName}(${args.join(', ')});\n`;
        }
      }
    } else if (Array.isArray(tc.input)) {
      code += `  const actual = await ${functionName}(...input);\n`;
    } else {
      code += `  const actual = await ${functionName}(input);\n`;
    }
    
    code += `  assertEqual(actual, expected);\n`;
    code += `});\n\n`;
  });
  
  return code.trim();
}

async function validateTask(task) {
  if (task.testCode.includes('assertEqual(true, true)') || task.testCode.includes('assert(true)')) {
    return { valid: false, reason: 'Contains placeholder assertEqual(true, true)' };
  }

  // Check unresolved RSC links in any of the fields
  const rscRefRegex = /\$[0-9a-f]{2}/i;
  if (rscRefRegex.test(task.starter) || rscRefRegex.test(task.solution) || rscRefRegex.test(task.testCode) || rscRefRegex.test(task.description)) {
    return { valid: false, reason: 'Contains unresolved RSC links like $20, $1f' };
  }

  // Test Solution Code
  try {
    const tests = runTaskInImporter(task.solution, task.testCode);
    if (tests.length === 0) {
      return { valid: false, reason: 'No tests registered' };
    }
    for (const t of tests) {
      await t.fn();
    }
  } catch (err) {
    return { valid: false, reason: `Solution fails test suite: ${err.message}` };
  }

  // Test Starter Code (must fail at least one test)
  let starterFailed = false;
  try {
    const tests = runTaskInImporter(task.starter, task.testCode);
    if (tests.length === 0) {
      starterFailed = true;
    } else {
      for (const t of tests) {
        try {
          await t.fn();
        } catch (err) {
          starterFailed = true;
          break;
        }
      }
    }
  } catch (err) {
    starterFailed = true; // Error on starter is expected/valid
  }

  if (!starterFailed) {
    return { valid: false, reason: 'Starter code compiles and passes all tests (it should fail at least one)' };
  }

  return { valid: true };
}

run();
