export class GistcasterError extends Error {
  constructor(message, code = 'GISTCASTER_ERROR') {
    super(message);
    this.name = 'GistcasterError';
    this.code = code;
  }
}

export function invariant(condition, message, code) {
  if (!condition) throw new GistcasterError(message, code);
}
