async function run() {
  const url = 'https://itlead.org/ua/problems/two-sum';
  try {
    const res = await fetch(url);
    const text = await res.text();
    
    // Find all self.__next_f.push calls
    const matches = text.match(/self\.__next_f\.push\(\[1,"([^"]+)"\]\)/g) || [];
    console.log('Total next_f matches:', matches.length);
    
    // Let's find all script tags and search for any stringified JSON
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let idx = 0;
    while ((match = scriptRegex.exec(text)) !== null) {
      const scriptContent = match[1];
      if (scriptContent.includes('solution') || scriptContent.includes('starter') || scriptContent.includes('twoSum')) {
        console.log(`Script tag ${idx} includes search terms! Length:`, scriptContent.length);
        // Find strings resembling json
        console.log('Snippet of script:', scriptContent.slice(0, 1000));
        console.log('Last 500 chars of script:', scriptContent.slice(-500));
      }
      idx++;
    }
  } catch (e) {
    console.error(e);
  }
}
run();
