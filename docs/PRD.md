# gistcaster

Status: ready

## Scorecard

Total: 81/100
Band: build now
Last scored: 2026-04-29
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 17/20 | Directly addresses a repeated workflow pain. |
| Demand signal | 19/20 | Strong source signal or internal demand. |
| V1 buildability | 16/20 | Feasible, but platform/integration risk remains. |
| Differentiation | 11/15 | Useful angle, but category has adjacent competition. |
| Agentic workflow leverage | 13/15 | Indirectly useful for agent workflows. |
| Distribution potential | 5/10 | Distribution will require examples and content. |

## Pitch

A local-first research capture app that turns URLs, YouTube videos, podcasts, PDFs, and files into source-linked Markdown briefs for agents.

## Why It Matters

Research-to-PRD is a core workflow in oss-ideas. A useful summarizer can be browser extension, desktop drop target, and CLI.

## Qualification

summarize has very strong star/fork signal. Internal demand is immediate because idea qualification requires browsing, evidence, and concise notes.

Source / adjacent research: Inspired by steipete/summarize, URL/YouTube/podcast/file summarizer with 5,779 stars / 371 forks checked 2026-04-29.

Decision: build now

## V1 Scope

- Capture URL/file input
- Generate Markdown brief with source metadata
- Save to local library/folder
- Export directly into oss-ideas Qualification format

## Out of Scope

- Generic chatbot
- Cloud-only summarization
- Copyright-hostile content mirroring

## Verification

- Unit or fixture tests for core parsing/generation behavior.
- README with install, quickstart, and safety notes.
- Local-first behavior documented clearly.
- No hidden network, credential, or publish behavior.

## Agent Prompt

Build `gistcaster` as a research-to-Markdown capture tool. Keep sources visible, distinguish quotes from summaries, and avoid fabricating evidence.
