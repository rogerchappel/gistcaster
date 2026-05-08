# Security Policy

## Supported Versions

Gistcaster is pre-1.0. Security fixes target the current `main` branch until release branches exist.

## Reporting a Vulnerability

Please open a private GitHub security advisory or contact the maintainer with:

- affected version or commit,
- reproduction steps,
- expected and actual behavior,
- whether local files, network fetches, or generated briefs are involved.

## Data and Network Posture

- Local files are read only when passed as inputs.
- URL content is fetched only when the user supplies a URL and `--fetch-url`.
- The tool does not upload captured content, call model APIs, or publish briefs.
- Output is written to the requested path or local `.gistcaster` library.

Please treat generated summaries as untrusted derived text and verify direct quotes against their source.
