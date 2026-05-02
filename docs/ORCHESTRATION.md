# Orchestration

`gistcaster` is intentionally local-first and small enough for one maintainer or one agent session.

## Work lanes

1. Capture adapters: file and explicit URL sources become normalized records.
2. Library: source records and generated briefs are saved under a user-chosen folder.
3. Renderers: Markdown brief and oss-ideas qualification export.
4. Safety gates: tests prove fixture URL capture works without hidden network behavior.

## Release checklist

- Run `npm test`.
- Run `npm run check`.
- Run `npm run build`.
- Run `npm run smoke`.
- Run `bash scripts/validate.sh`.
- Try one CLI capture with fixture data before publishing.
