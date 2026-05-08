#!/usr/bin/env node
import { parseArgs, usage } from './args.js';
import { buildBrief } from './brief.js';
import { captureInputs } from './capture.js';
import { renderBrief } from './exporters.js';
import { writeBrief } from './library.js';

export async function main(argv = process.argv.slice(2), io = { stdout: process.stdout, stderr: process.stderr }) {
  const { command, inputs, options } = parseArgs(argv);
  if (command === 'help') {
    io.stdout.write(usage());
    return 0;
  }
  if (command !== 'brief') {
    io.stderr.write(`Unknown command: ${command}\n\n${usage()}`);
    return 1;
  }
  if (!inputs.length) {
    io.stderr.write('No inputs provided. Pass at least one file or URL.\n');
    return 1;
  }

  const captures = await captureInputs(inputs, options);
  const brief = buildBrief(captures, options);
  const rendered = renderBrief(brief, options.format || 'markdown');
  if (options.stdout) io.stdout.write(rendered);
  const path = await writeBrief({ brief, rendered, output: options.output, library: options.library });
  if (!options.stdout) io.stdout.write(`${path}\n`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => { process.exitCode = code; }).catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
