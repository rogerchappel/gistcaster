# gistcaster

`gistcaster` is a local-first research capture CLI that turns files and explicit URLs into source-linked Markdown briefs for agents and oss-ideas qualification work.

It keeps source records visible, separates quotes from summaries, and refuses hidden network access. URL capture only reads a local fixture unless you deliberately pass `--fetch`.

## Install

```sh
npm install -g gistcaster
```

For local development:

```sh
git clone https://github.com/rogerchappel/gistcaster.git
cd gistcaster
npm test
node src/cli.js --help
```

## Quickstart

Capture a local Markdown file:

```sh
node src/cli.js capture fixtures/files/research-note.md --library .gistcaster
```

Capture a URL using a deterministic fixture, with no network:

```sh
node src/cli.js capture https://example.test/research \
  --fixture fixtures/url/example.html \
  --library .gistcaster
```

List captured sources:

```sh
node src/cli.js list --library .gistcaster
```

Render a source-linked brief:

```sh
node src/cli.js brief <source-id> --library .gistcaster
```

Export oss-ideas qualification Markdown:

```sh
node src/cli.js export --library .gistcaster --output qualification.md --title "Idea qualification"
```

## Commands

- `capture <file-or-url>`: normalize a local text file or explicit URL into a source record and brief.
- `list`: print saved source records.
- `brief <id>`: render a Markdown brief for one source.
- `export [id...]`: render an oss-ideas qualification document from all or selected records.

## Supported sources

MVP file capture supports text-like formats: `.txt`, `.md`, `.csv`, `.json`, `.html`, `.xml`, `.yaml`, and `.log`.

URL capture supports HTTP(S), but it is intentionally explicit:

- `--fixture path/to/page.html`: use a local fixture for deterministic, offline capture.
- `--fetch`: perform live network fetch. This is never implicit.

## Safety notes

- Local-first by default; libraries live wherever `--library` points, defaulting to `.gistcaster`.
- No credentials, telemetry, background sync, or publish behavior.
- Generated summaries are extractive heuristics. Treat them as notes, not verified claims.
- Quotes are copied from source text and should be checked before reuse.

## Development

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## License

MIT
