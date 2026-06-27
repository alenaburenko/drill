async function run() {
  const url = 'https://itlead.org/ua/problems/two-sum';
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Length: ${text.length}`);
    
    // Check if it contains "twoSum" or "starter" or "solution"
    console.log('Includes twoSum:', text.includes('twoSum'));
    console.log('Includes starter:', text.includes('starter'));
    console.log('Includes solution:', text.includes('solution'));
    console.log('Includes testCode:', text.includes('testCode'));
    
    // Find script tags
    const matches = text.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (let i = 0; i < matches.length; i++) {
      const s = matches[i];
      if (s.includes('solution') || s.includes('starter') || s.includes('twoSum')) {
        console.log(`Script ${i} length: ${s.length}`);
        console.log(`Script ${i} preview:`, s.slice(0, 1000));
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
