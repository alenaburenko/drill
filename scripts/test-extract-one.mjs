import fs from 'node:fs';

async function run() {
  const url = 'https://itlead.org/ua/problems/two-sum';
  const res = await fetch(url);
  const text = await res.text();
  
  // Combine next_f pushes
  const regex = /self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g;
  let rscText = '';
  let match;
  while ((match = regex.exec(text)) !== null) {
    try {
      rscText += JSON.parse(`"${match[1]}"`);
    } catch (e) {
      rscText += match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }
  
  // Let's find fields using regexes
  const titleUaMatch = rscText.match(/"titleUa"\s*:\s*"([^"]+)"/) || rscText.match(/"titleUa"\s*:\s*null/);
  const titleMatch = rscText.match(/"title"\s*:\s*"([^"]+)"/);
  
  const difficultyMatch = rscText.match(/"difficulty"\s*:\s*"([^"]+)"/);
  const categoryMatch = rscText.match(/"category"\s*:\s*"([^"]+)"/);
  
  // Find starter code and solution
  // They are inside solutions array. 
  // Let's do a broader regex or search for "starterCode" and "referenceSolution"
  const javascriptBlockRegex = /"language"\s*:\s*"javascript"[\s\S]*?"starterCode"\s*:\s*"([\s\S]*?)"[\s\S]*?"referenceSolution"\s*:\s*"([\s\S]*?)"/;
  const jsMatch = rscText.match(javascriptBlockRegex);
  
  // Find test cases
  const testCasesMatch = rscText.match(/"testCases"\s*:\s*"([\s\S]*?)"\s*,\s*"likesCount"/);

  console.log('Title (UA):', titleUaMatch ? titleUaMatch[1] : null);
  console.log('Title (EN):', titleMatch ? titleMatch[1] : null);
  console.log('Difficulty:', difficultyMatch ? difficultyMatch[1] : null);
  console.log('Category:', categoryMatch ? categoryMatch[1] : null);
  console.log('JS StarterCode Found:', !!jsMatch);
  if (jsMatch) {
    console.log('JS StarterCode Raw (first 100 char):', jsMatch[1].slice(0, 100));
    console.log('JS Solution Raw (first 100 char):', jsMatch[2].slice(0, 100));
  }
  console.log('TestCases Raw Found:', !!testCasesMatch);
  if (testCasesMatch) {
    console.log('TestCases Raw Snippet:', testCasesMatch[1].slice(0, 200));
  }
}
run();
