import { fail } from './errors.js';

export const RECORD_VERSION = 1;

export function validateRecord(record) {
  if (!record || typeof record !== 'object') fail('Record must be an object', 'INVALID_RECORD');
  if (record.version !== RECORD_VERSION) fail('Unsupported record version', 'INVALID_VERSION', { version: record.version });
  if (!record.id) fail('Record is missing id', 'INVALID_RECORD');
  if (!['file', 'url'].includes(record.kind)) fail('Record kind must be file or url', 'INVALID_RECORD');
  if (!record.title) fail('Record is missing title', 'INVALID_RECORD');
  if (typeof record.text !== 'string') fail('Record text must be a string', 'INVALID_RECORD');
  return record;
}

export function validateLibrary(library) {
  if (!library || typeof library !== 'object') fail('Library must be an object', 'INVALID_LIBRARY');
  if (!Array.isArray(library.records)) fail('Library records must be an array', 'INVALID_LIBRARY');
  library.records.forEach(validateRecord);
  return library;
}
