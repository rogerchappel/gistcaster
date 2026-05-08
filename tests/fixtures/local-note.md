# Compiler Flag Research

> The fast path reduced cold start from 820ms to 260ms in the fixture benchmark.

The compiler flag is useful when projects use deterministic module graphs. It is risky when plugins depend on runtime discovery.

## Evidence

> Runtime discovery plugins failed when the flag was forced globally.

Teams should roll out the flag per package and keep a rollback note beside the change.
