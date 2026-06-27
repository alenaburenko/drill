async function run() {
  const res = await fetch('https://itlead.org/sitemap.xml');
  const text = await res.text();
  
  // Find all <loc> tags
  const regex = /<loc>(https:\/\/itlead\.org\/(?:ua\/)?problems\/[^<]+)<\/loc>/g;
  let match;
  const problems = new Set();
  while ((match = regex.exec(text)) !== null) {
    problems.add(match[1]);
  }
  
  console.log('Total problem URLs found:', problems.size);
  const list = Array.from(problems);
  console.log('First 20 problem URLs:');
  console.log(list.slice(0, 20));
}
run();
