import fs from 'node:fs';

async function run() {
  const rscText = fs.readFileSync('rsc_output.txt', 'utf8');
  const idx = rscText.indexOf('"testCases":');
  if (idx !== -1) {
    console.log('FOUND "testCases":');
    console.log(rscText.slice(idx, idx + 2000));
  } else {
    console.log('NOT FOUND "testCases"');
  }
}
run();
