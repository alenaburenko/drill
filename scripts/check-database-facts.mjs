import { itleadTasks } from '../src/tasks/itlead.js';

async function run() {
  console.log('--- FACTS VERIFICATION ---');
  console.log('File src/tasks/itlead.ts exists!');
  console.log('Total tasks parsed:', itleadTasks.length);
  
  const ids = itleadTasks.map(t => t.id);
  console.log('First 5 IDs:', ids.slice(0, 5));
  console.log('Last 5 IDs:', ids.slice(-5));
  
  let validCount = 0;
  for (const t of itleadTasks) {
    if (t.starter && t.solution && t.testCode) {
      validCount++;
    }
  }
  console.log('Tasks with non-empty starter, solution and testCode:', validCount);
}
run();
