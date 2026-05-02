export function nowIso(clock = Date) {
  return new clock().toISOString();
}

export function safeDateStamp(iso) {
  return String(iso).replace(/[:.]/g, '-');
}
