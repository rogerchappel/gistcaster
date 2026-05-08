# Orchestration

Gistcaster is intentionally small enough for single-maintainer flow, but changes should still land as reviewable slices.

## Roles

- **Maintainer:** owns roadmap, releases, and safety posture.
- **Contributor:** opens focused PRs linked to an issue or task.
- **Agent assistant:** may draft code or briefs, but must keep sources visible and avoid fabricating evidence.

## Delivery rules

1. Link every PR to a task or issue before review.
2. Keep network behavior explicit and tested.
3. Add or update fixtures for parser changes.
4. Run `npm run check`, `npm run smoke`, and `bash scripts/validate.sh` before review.
5. Prefer small parser/exporter changes over sweeping rewrites.

## Release gates

- Tests and CLI smoke pass locally and in CI.
- README examples still match current CLI behavior.
- SECURITY.md still reflects the actual network and data posture.
- Changelog entry describes user-visible changes.
