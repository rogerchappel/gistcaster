import { captureFile } from './file-capture.js';
import { captureUrl } from './url-capture.js';
import { RECORD_VERSION, validateRecord } from './schema.js';
import { sourceId } from './source-id.js';
import { nowIso } from './time.js';

export async function captureSource(input, options = {}) {
  const partial = /^https?:\/\//i.test(input)
    ? await captureUrl(input, options)
    : await captureFile(input, options);
  const capturedAt = options.capturedAt || nowIso(options.clock);
  const record = { version: RECORD_VERSION, ...partial, capturedAt };
  record.id = sourceId(record);
  return validateRecord(record);
}
