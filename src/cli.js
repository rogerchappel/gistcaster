#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { briefMarkdown, captureSource, defaultLibraryDir, loadRecords, qualificationMarkdown, readLibrary, saveRecord } from './index.js';
import { GistcasterError } from './errors.js';

const args = process.argv.slice(2);

main(args).catch((error) => {
  if (error instanceof GistcasterError) {
    console.error(`gistcaster: ${error.message}`);
    process.exitCode = 2;
  } else {
    console.error(error?.stack || String(error));
    process.exitCode = 1;
  }
});

export async function main(argv) {
  const { command, positionals, flags } = parseArgs(argv);
  const libraryDir = path.resolve(flags.library || flags.lib || defaultLibraryDir());
  if (!command || flags.help) return printHelp();
  if (command === 'capture') {
    if (!positionals.length) throw new GistcasterError('capture requires a file path or URL', 'USAGE');
    const record = await captureSource(positionals[0], { fixture: flags.fixture, fetch: flags.fetch === true, timeoutMs: numberFlag(flags.timeout, 10000) });
    const saved = await saveRecord(libraryDir, record);
    console.log(JSON.stringify({ id: saved.record.id, title: saved.record.title, brief: saved.briefPath }, null, 2));
    return;
  }
  if (command === 'brief') {
    const id = positionals[0];
    if (!id) throw new GistcasterError('brief requires a source id', 'USAGE');
    const [record] = await loadRecords(libraryDir, [id]);
    if (!record) throw new GistcasterError(`No source found for id ${id}`, 'NOT_FOUND');
    const markdown = briefMarkdown(record);
    if (flags.output) await fs.writeFile(path.resolve(flags.output), markdown);
    else process.stdout.write(markdown);
    return;
  }
  if (command === 'export') {
    const records = await loadRecords(libraryDir, positionals);
    const markdown = qualificationMarkdown(records, { title: flags.title, decision: flags.decision });
    if (flags.output) await fs.writeFile(path.resolve(flags.output), markdown);
    else process.stdout.write(markdown);
    return;
  }
  if (command === 'list') {
    const library = await readLibrary(libraryDir);
    for (const record of library.records) console.log(`${record.id}\t${record.kind}\t${record.title}\t${record.uri}`);
    return;
  }
  throw new GistcasterError(`Unknown command: ${command}`, 'USAGE');
}

function parseArgs(argv) {
  const flags = {};
  const positionals = [];
  let command;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!command && !arg.startsWith('-')) { command = arg; continue; }
    if (arg.startsWith('--')) {
      const [key, inline] = arg.slice(2).split('=', 2);
      if (inline !== undefined) flags[key] = inline;
      else if (argv[i + 1] && !argv[i + 1].startsWith('-')) flags[key] = argv[++i];
      else flags[key] = true;
    } else positionals.push(arg);
  }
  return { command, positionals, flags };
}

function numberFlag(value, fallback) {
  if (value === undefined || value === true) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function printHelp() {
  console.log(`gistcaster — local-first research capture\n\nUsage:\n  gistcaster capture <file-or-url> [--library DIR] [--fixture HTML | --fetch]\n  gistcaster list [--library DIR]\n  gistcaster brief <id> [--library DIR] [--output FILE]\n  gistcaster export [id...] [--library DIR] [--output FILE] [--title TEXT]\n\nSafety:\n  URL capture never uses the network unless --fetch is supplied. Tests and smoke\n  examples use --fixture to keep behavior deterministic.`);
}
