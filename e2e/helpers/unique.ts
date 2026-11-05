/** Unique usernames / labels so parallel / repeated runs do not collide. */

export function uniqueUsername(prefix = 'e2e'): string {
  const stamp = Date.now().toString(36).slice(-6);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${stamp}${rand}`.slice(0, 32);
}

export function uniqueLabel(prefix: string): string {
  return `${prefix} ${Date.now().toString(36)}`;
}
