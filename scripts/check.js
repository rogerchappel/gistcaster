import fs from 'node:fs/promises';
import path from 'node:path';

const files = await walk('src');
for (const file of files.filter((item) => item.endsWith('.js'))) {
  const text = await fs.readFile(file, 'utf8');
  if (text.includes('TODO')) throw new Error(`${file} contains TODO`);
  if (text.includes('http.get(') || text.includes('https.get(')) throw new Error(`${file} uses low-level hidden network API`);
}
console.log(`check ok (${files.length} source files)`);

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}
