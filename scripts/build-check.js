import fs from 'node:fs/promises';

const required = ['src/cli.js', 'src/index.js', 'README.md', 'docs/PRD.md', 'docs/TASKS.md', 'docs/ORCHESTRATION.md', 'docs/orchestration.json'];
for (const file of required) await fs.access(file);
await import('../src/index.js');
console.log('build-check ok');
