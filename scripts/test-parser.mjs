import fs from 'node:fs';

async function run() {
  const url = 'https://itlead.org/ua/problems/two-sum';
  const res = await fetch(url);
  const text = await res.text();
  
  // Extract all self.__next_f.push([1, "..." or '...']) matches
  // Be careful with escape characters! Next RSC escapes quotes and slashes.
  const regex = /self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g;
  let rscText = '';
  let match;
  while ((match = regex.exec(text)) !== null) {
    let chunk = match[1];
    // Unescape next_f payload string
    // Standard unescaping of JSON strings
    try {
      // we can wrap it in double quotes and parse it as JSON to get the unescaped string
      const unescaped = JSON.parse(`"${chunk}"`);
      rscText += unescaped;
    } catch (e) {
      // fallback
      rscText += chunk.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  }
  
  fs.writeFileSync('rsc_output.txt', rscText);
  console.log('Saved RSC output, length:', rscText.length);
  
  // Check what keywords are found in the unescaped RSC text
  console.log('Contains "testCode":', rscText.includes('testCode'));
  console.log('Contains "testCases":', rscText.includes('testCases'));
  console.log('Contains "difficulty":', rscText.includes('difficulty'));
  console.log('Contains "cloze":', rscText.includes('cloze'));
  console.log('Contains "referenceSolution":', rscText.includes('referenceSolution'));
  
  // Let's find any JSON-like substrings inside rscText
  // Usually the problem data is passed in a large object containing "title", "description", "solutions"
  const startIdx = rscText.indexOf('"title":');
  if (startIdx !== -1) {
    console.log('FOUND "title": at index', startIdx);
    console.log(rscText.slice(startIdx, startIdx + 1000));
  }
}
run();
