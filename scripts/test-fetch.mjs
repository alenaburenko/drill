async function run() {
  try {
    const res = await fetch('https://itlead.org/ua/problems');
    console.log('STATUS:', res.status);
    const text = await res.text();
    console.log('LENGTH:', text.length);
    console.log('PREVIEW:', text.slice(0, 1000));
  } catch (err) {
    console.error('ERROR:', err);
  }
}
run();
