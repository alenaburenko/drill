import fs from 'node:fs';

async function run() {
  const rscText = fs.readFileSync('rsc_output.txt', 'utf8');
  
  // Find fields
  const titleUaMatch = rscText.match(/"titleUa"\s*:\s*"([^"]+?)"/);
  const titleMatch = rscText.match(/"title"\s*:\s*"([^"]+?)"/);
  
  const descriptionUaMatch = rscText.match(/"descriptionUa"\s*:\s*"([\s\S]+?)"\s*,\s*"difficulty"/);
  const descriptionMatch = rscText.match(/"description"\s*:\s*"([\s\S]+?)"\s*,\s*"descriptionUa"/);
  
  const difficultyMatch = rscText.match(/"difficulty"\s*:\s*"([^"]+?)"/);
  const categoryMatch = rscText.match(/"category"\s*:\s*"([^"]+?)"/);
  
  // JS block
  const jsMatch = rscText.match(/"language"\s*:\s*"javascript"[\s\S]*?"starterCode"\s*:\s*"([\s\S]+?)"[\s\S]*?"referenceSolution"\s*:\s*"([\s\S]+?)"/);
  
  const testCasesMatch = rscText.match(/"testCases"\s*:\s*"([\s\S]+?)"\s*,\s*"likesCount"/);

  console.log('Title UA:', titleUaMatch ? titleUaMatch[1] : 'null');
  console.log('Title EN:', titleMatch ? titleMatch[1] : 'null');
  console.log('Desc UA length:', descriptionUaMatch ? descriptionUaMatch[1].length : 'null');
  console.log('Desc EN length:', descriptionMatch ? descriptionMatch[1].length : 'null');
  console.log('Difficulty:', difficultyMatch ? difficultyMatch[1] : 'null');
  console.log('Category:', categoryMatch ? categoryMatch[1] : 'null');
  console.log('JS StarterCode:', jsMatch ? 'found' : 'null');
  console.log('TestCases:', testCasesMatch ? 'found' : 'null');
  
  if (descriptionUaMatch) {
    // Unescape the string to read properly
    try {
      const desc = JSON.parse(`"${descriptionUaMatch[1]}"`);
      console.log('Unescaped Desc UA (first 150 chars):\n', desc.slice(0, 150));
    } catch(e) {
      console.log('Raw match snippet:', descriptionUaMatch[1].slice(0, 150));
    }
  }
}
run();
