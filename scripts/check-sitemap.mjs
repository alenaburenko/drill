async function run() {
  const urls = [
    'https://itlead.org/sitemap.xml',
    'https://itlead.org/sitemap-0.xml',
    'https://itlead.org/problems/sitemap.xml'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url}, Status: ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        console.log(`Length: ${text.length}`);
        console.log(`Snippet:`, text.slice(0, 500));
      }
    } catch (e) {
      console.log(`Error for ${url}:`, e.message);
    }
  }
}
run();
