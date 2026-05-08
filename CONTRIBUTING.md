# Contributing

Thanks for helping make agent research packets more reliable.

## Ground rules

- Keep changes small and linked to an issue or documented task.
- Preserve the local-first contract: no hidden network calls, uploads, or credential use.
- Keep quotes and summaries distinct in output.
- Add fixtures for parser, generator, and exporter changes.

## Setup

```sh
npm install
npm test
npm run check
npm run smoke
bash scripts/validate.sh
```

## Pull requests

Include:

1. What changed and why.
2. The task/issue link.
3. Verification output.
4. Any safety or compatibility notes.
