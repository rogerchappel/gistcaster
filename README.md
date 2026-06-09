# gistcaster

Turn scattered research into source-linked Markdown briefs that agents can actually use.

Gistcaster is a local-first CLI/library for capturing files and explicitly supplied URLs into compact research briefs. It keeps source metadata visible, separates direct quotes from summaries, and exports an `oss-ideas` Qualification shape for idea evaluation workflows.

Inspired by the PRD's adjacent research: `steipete/summarize`, a URL/YouTube/podcast/file summarizer with strong community signal. Gistcaster's angle is narrower and safer: local-first agent research packets, no hidden network calls, and sources up front.

## Install

```sh
npm install -g gistcaster
# or from a checkout
npm install
npm link
```

## Quickstart

```sh
gistcaster brief examples/local-brief.md --out brief.md
```

Print instead of only writing a path:

```sh
gistcaster brief examples/local-brief.md --stdout
```

Export for `oss-ideas` qualification notes:

```sh
gistcaster brief examples/local-brief.md --format oss-ideas --out qualification.md
```

Capture a URL only when you explicitly ask for network access:

```sh
gistcaster brief https://example.com/research --fetch-url --out web-brief.md
```

Without `--fetch-url`, URL inputs are recorded as source metadata only.

## What the brief contains

- Source list with locator, fetch status, metadata, and content hash when available.
- Summaries generated from captured text.
- Direct quotes in a separate section.
- Structure notes from Markdown headings.
- Safety note describing local-first behavior.

## Library use

```js
import { captureInputs, buildBrief, renderBrief } from 'gistcaster';

const captures = await captureInputs(['examples/local-brief.md']);
const brief = buildBrief(captures, { title: 'Cache research' });
console.log(renderBrief(brief, 'markdown'));
```

## Safety and local-first posture

- Reads local files you pass on the command line.
- Does not fetch URL bodies unless `--fetch-url` is present.
- Does not call AI APIs, upload content, publish files, or use credentials.
- Summaries are lightweight extracts, not claims of truth. Check linked sources before making decisions.

## Developer workflow

```sh
npm test
npm run check
npm run smoke
bash scripts/validate.sh
```

PRs should be small, task-linked, and include fixtures for parser/exporter behavior.
## Release readiness

Run the same checks expected before opening or cutting a release:

```sh
npm run check
npm run test
npm run smoke
npm run package:smoke
npm run release:check
```

Use `npm pack --dry-run` to confirm the published package contains the CLI/runtime files plus README, license, security, support, and release notes.

## License
MIT
