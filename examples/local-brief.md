# Edge Cache Notes

> Requests with cache tags were purged in under five seconds during the fixture run.

Edge cache invalidation is valuable for docs sites when deploy previews and production share the same content model.

## Caveat

> Purge APIs were rate-limited after repeated full-site invalidations.

Prefer tag-level purges and keep a fallback manual purge command in runbooks.
