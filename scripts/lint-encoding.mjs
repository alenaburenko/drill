#!/usr/bin/env node

/**
 * lint-encoding.mjs — UTF-8 / Mojibake Encoding Linter
 *
 * Checks source and doc files for common mojibake markers
 * that indicate encoding corruption.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname, relative } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'build', 'target', '.cache', '.claude'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mjs', '.py', '.yml', '.yaml', '.css', '.html']);

// Common mojibake markers (Unicode replacement characters and corruption patterns)
// Build via codepoints to avoid self-detection
const MOJIBAKE_MARKERS = [
  String.fromCharCode(0xFFFD),  // Replacement character
  '�',              // Double-encoded replacement variant
];

let violations = [];

function scanFile(filePath) {
  const ext = extname(filePath);
  if (!EXTENSIONS.has(ext)) return;

  const relPath = relative(ROOT, filePath);
  if (EXCLUDE_DIRS.some(dir => relPath.startsWith(dir + '/'))) return;
  // Exclude this script itself (it contains marker literals for detection)
  if (relPath === 'scripts/lint-encoding.mjs') return;

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    for (const marker of MOJIBAKE_MARKERS) {
      if (lines[i].includes(marker)) {
        violations.push(`${relPath}:${i + 1}: possible mojibake marker '${marker}'`);
      }
    }
  }
}

function scanDir(dirPath) {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const relPath = relative(ROOT, fullPath);
      if (!EXCLUDE_DIRS.some(d => relPath === d || relPath.startsWith(d + '/'))) {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      scanFile(fullPath);
    }
  }
}

scanDir(ROOT);

if (violations.length > 0) {
  for (const v of violations) {
    console.error(v);
  }
  process.exit(1);
}

console.log('Encoding lint passed.');
