export function stripComments(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || (trimmed.startsWith('/*') && trimmed.endsWith('*/'))) continue;
    result.push(line.replace(/(^|[^:])\/\/.*$/, '$1').trimEnd());
  }
  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
