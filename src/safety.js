export function isUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function assertExplicitUrlFetch(input, options = {}) {
  if (isUrl(input) && !options.fetchUrl) {
    return {
      allowed: false,
      reason: 'URL content is not fetched unless --fetch-url is set.'
    };
  }
  return { allowed: true };
}

export function redactControlCharacters(value) {
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}
