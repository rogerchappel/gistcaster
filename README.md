# gistcaster

Turn scattered research into source-linked Markdown briefs that agents can actually use.

Gistcaster is a local-first CLI/library for capturing files and explicitly supplied URLs into compact research briefs. It keeps source metadata visible, separates direct quotes from summaries, and exports an `oss-ideas` Qualification shape for idea evaluation workflows.

Inspired by the PRD's adjacent research: `steipete/summarize`, a URL/YouTube/podcast/file summarizer with strong community signal. Gistcaster's angle is narrower and safer: local-first agent research packets, no hidden network calls, and sources up front.

## Install

The package is not published to the npm registry. Install the current source
archive directly from GitHub:

```sh
npm install --global https://github.com/rogerchappel/gistcaster/archive/refs/heads/main.tar.gz
```

For development from a checkout:

```sh
npm install
npm link
```

## Quickstart

```sh
gistcaster brief examples/local-brief.md --out brief.md
```

Run the checked-in local demo:

```sh
bash demo/run-local-research-brief.sh
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

URL fetches have a 10-second deadline. If a server does not respond in time,
Gistcaster cancels the request and exits nonzero with the URL in the timeout
message. Check that the URL is reachable and retry the command; omit
`--fetch-url` if recording source metadata without downloading content is
sufficient.

Gistcaster converts `text/html` and `application/xhtml+xml` responses to
readable text. Other `text/*`, `application/json`, and `application/*+json`
responses preserve their body text exactly, including comparison operators.
Declared charsets are decoded with the encodings recognized by the web
platform `TextDecoder` (case-insensitively), including UTF-8, ISO-8859-1, and
Windows-1252. ISO-8859-1 follows the web-compatible Windows-1252 mapping.
Responses without a charset default to UTF-8; an empty or unsupported charset
stops with an explicit error. Binary, unknown, or missing content types stop
with an explicit unsupported Content-Type error instead of treating bytes as
HTML.

Each option may be passed once. `--json` is shorthand for `--format json` and
cannot be combined with `--format`. The `--out`, `--library`, `--title`, and
`--format` options require a following value.

When `--out` is omitted, briefs are saved in `.gistcaster` (or the directory
selected by `--library`). Markdown and `oss-ideas` captures use `.md`; JSON
captures use `.json`. Repeated captures with the same date and title are kept
as separate files with deterministic suffixes such as `-2` and `-3`.
`--out` always uses the exact path supplied and replaces an existing file.

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

`npm run package:smoke` creates the same npm tarball attached to releases,
installs it into a clean temporary global prefix, and runs the installed
`gistcaster` binary from outside the checkout. It also confirms the package
contains the CLI/runtime files plus README, license, security, support, and
release notes.

## Development

Use the same local checks that back release readiness:

```bash
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```

Run the narrower commands while iterating, then finish with the broadest available check before opening a PR.

Promotion and demo material:

- `docs/tutorials/local-research-packet.md`
- `docs/promo/local-research-hooks.md`

## License
MIT
