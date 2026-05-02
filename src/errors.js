export class GistcasterError extends Error {
  constructor(message, code = 'GISTCASTER_ERROR', details = {}) {
    super(message);
    this.name = 'GistcasterError';
    this.code = code;
    this.details = details;
  }
}

export function fail(message, code, details) {
  throw new GistcasterError(message, code, details);
}
