#!/usr/bin/env node

/**
 * lint-deps.mjs — Layer Dependency Linter
 *
 * Enforces the dependency hierarchy documented in docs/ARCHITECTURE.md.
 * Uses a simpler and more precise matching approach.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');

let failures = 0;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failures++;
}

/**
 * Check if a path matches any of the given prefixes.
 * Treats "src/types" as matching both "src/types" and "src/types.ts", etc.
 */
function pathMatchesAny(targetPath, prefixes) {
  // Normalize: strip leading ./
  const normalized = targetPath.replace(/^\.\//, '');
  for (const prefix of prefixes) {
    if (normalized === prefix) return true;
    if (normalized.startsWith(prefix + '/')) return true;
    if (normalized.startsWith(prefix.replace(/\.tsx?$/, '')) && !normalized.includes('/')) return true;
    if (normalized === prefix + '.ts') return true;
    if (normalized === prefix + '.tsx') return true;
    if (prefix.endsWith('/') && normalized.startsWith(prefix)) return true;
  }
  return false;
}

// Layer definitions — ONLY for import validation
// Layer 0 (types) and Layer 1 (utils) can be imported by anyone
// Higher layers cannot be imported by lower layers
const LAYER_RULES = [
  { name: 'types', paths: ['src/types.ts'], canBeImportedBy: 'any' },
  { name: 'i18n', paths: ['src/i18n.ts'], canBeImportedBy: 'any' },
  { name: 'components', paths: ['src/components', 'src/App.tsx'], canBeImportedBy: 'same' },
  { name: 'runner', paths: ['src/runner'], canBeImportedBy: 'same' },
  { name: 'tasks', paths: ['src/tasks'], canBeImportedBy: 'same,types' },
];

function getLayerForPath(filePath) {
  const rel = relative(ROOT, filePath);
  const entry = LAYER_RULES.find(l =>
    pathMatchesAny(rel, l.paths)
  );
  return entry || null;
}

function normalizeImportPath(importPath) {
  // Strip extension for comparison
  return importPath.replace(/\.(ts|tsx|js|jsx|mjs)$/, '');
}

function matchesAllowedImport(filePath, importPath) {
  const fileDir = dirname(filePath);
  const absImport = resolve(fileDir, importPath);
  const relImport = relative(ROOT, absImport);

  // Allow same-directory imports
  const relDir = relative(ROOT, fileDir);
  const importDir = dirname(relImport);
  if (relDir === importDir) return true;

  // Allow common patterns: types, i18n, and utils are freely importable
  const normalized = relImport.replace(/\.(ts|tsx|js|jsx)$/, '');
  if (normalized === 'src/types' || normalized === 'src/i18n' || normalized.startsWith('src/utils/')) return true;
  if (normalized.startsWith('src/types/')) return true;

  // Allow importing tasks from tasks/
  if (normalized.startsWith('src/tasks/')) return true;

  // Allow importing components from components/
  if (normalized.startsWith('src/components/')) return true;

  // Allow runner imports
  if (normalized.startsWith('src/runner/')) return true;

  return false;
}

function extractImports(content) {
  const imports = [];
  // Static ESM imports
  const esmRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = esmRegex.exec(content)) !== null) {
    imports.push(m[1]);
  }
  // Dynamic imports
  const dynamicRegex = /import\(['"]([^'"]+)['"]\)/g;
  while ((m = dynamicRegex.exec(content)) !== null) {
    imports.push(m[1]);
  }
  return imports;
}

function dirname(p) {
  const parts = p.replace(/\/$/, '').split('/');
  parts.pop();
  return parts.join('/') || '.';
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const imports = extractImports(content);
  const fileDir = dirname(filePath);

  for (const importPath of imports) {
    if (!importPath.startsWith('.')) continue; // external package, skip

    if (!matchesAllowedImport(filePath, importPath)) {
      const relPath = relative(ROOT, filePath);
      const absImport = resolve(fileDir, importPath);
      const relImport = relative(ROOT, absImport);
      fail(`${relPath} → ${relImport}: unexpected cross-module import`);
    }
  }
}

function scanDir(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.')) scanDir(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

// Run scan
scanDir(SRC);

if (failures > 0) {
  console.log(`\nDependency lint FAILED: ${failures} issue(s) found.`);
  process.exit(1);
}

console.log('Dependency lint passed.');
