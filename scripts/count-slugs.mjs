import fs from 'node:fs';

async function run() {
  const res = await fetch('https://itlead.org/sitemap.xml');
  const text = await res.text();
  
  const regex = /<loc>https:\/\/itlead\.org\/(?:ua\/)?problems\/([^<]+)<\/loc>/g;
  let match;
  const slugs = new Set();
  while ((match = regex.exec(text)) !== null) {
    slugs.add(match[1]);
  }
  
  console.log('Total unique slugs:', slugs.size);
  console.log('Slugs list snippet:', Array.from(slugs).slice(0, 50));
}
run();
