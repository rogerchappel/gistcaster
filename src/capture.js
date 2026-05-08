import { isUrl } from './safety.js';
import { captureFile } from './file-input.js';
import { captureUrl } from './url-input.js';

export async function captureInputs(inputs, options = {}) {
  const captures = [];
  for (let index = 0; index < inputs.length; index += 1) {
    const input = inputs[index];
    captures.push(isUrl(input) ? await captureUrl(input, options, index) : await captureFile(input, index));
  }
  return captures;
}
