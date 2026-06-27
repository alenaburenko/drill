async function run() {
  const res = await fetch('https://itlead.org/ua/problems');
  const text = await res.text();
  console.log('Includes __NEXT_DATA__:', text.includes('__NEXT_DATA__'));
  
  // Find all scripts that might contain NEXT state
  const matches = text.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Total scripts found:', matches.length);
  for (let i = 0; i < matches.length; i++) {
    const s = matches[i];
    if (s.includes('binary-search') || s.includes('check-palindrome') || s.includes('Title') || s.includes('props')) {
      console.log(`Script ${i} length:`, s.length);
      console.log(`Script ${i} snippet:`, s.slice(0, 300));
    }
  }
}
run();
