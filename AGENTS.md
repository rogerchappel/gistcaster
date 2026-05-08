# Agent Guidance for gistcaster

Gistcaster exists to make research evidence easier for agents to inspect, not to hide uncertainty.

## Non-negotiables

- Do not add hidden network calls.
- Do not upload local content or call model APIs from core commands.
- Keep direct quotes separate from generated or heuristic summaries.
- Preserve source locators and fetch status in rendered output.
- Add fixtures when changing parsing, capture, or export behavior.

## Useful commands

```sh
npm test
npm run check
npm run smoke
bash scripts/validate.sh
```

## PR flow

Link PRs to a task/issue and include verification output. Prefer small, reviewable slices.
