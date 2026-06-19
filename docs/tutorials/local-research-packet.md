# Build A Local Research Packet

This recipe shows how to turn two checked-in Markdown examples into source-linked
briefs without network fetches or AI API calls.

## Run The Demo

```bash
bash demo/run-local-research-brief.sh
```

The script writes two files to a temporary directory:

- `local-brief.md`, rendered from `examples/local-brief.md`
- `qualification.md`, rendered from `examples/oss-ideas-qualification.md` with
  the `oss-ideas` formatter

## Why This Is Useful

Gistcaster keeps the source list close to the summary, so an agent or reviewer
can see which file shaped the brief. URL bodies are not fetched unless
`--fetch-url` is passed, which makes the default demo deterministic and
local-first.

## Promotion Angle

Use this flow when showing gistcaster as a safer handoff artifact for research:
the output is compact, source-aware, and suitable for attaching to issue,
planning, or idea qualification workflows.
