import crypto from 'node:crypto';

export function sourceId(record) {
  const hash = crypto.createHash('sha256');
  hash.update(record.kind || 'unknown');
  hash.update('\0');
  hash.update(record.uri || record.path || '');
  hash.update('\0');
  hash.update(record.text || '');
  return hash.digest('hex').slice(0, 16);
}
