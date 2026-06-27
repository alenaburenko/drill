async function run() {
  const res = await fetch('https://itlead.org/ua/problems');
  const text = await res.text();
  
  // Let's find all occurrences of /problems/ or related links
  const regex = /"problems\/([^"]+)"/g;
  let match;
  const slugs = new Set();
  while ((match = regex.exec(text)) !== null) {
    slugs.add(match[1]);
  }
  
  // also check other variations like /ua/problems/...
  const regex2 = /\/problems\/([a-zA-Z0-9-]+)/g;
  while ((match = regex2.exec(text)) !== null) {
    slugs.add(match[1]);
  }

  console.log('Found slugs:', Array.from(slugs));
  console.log('Total slugs:', slugs.size);
}
run();
