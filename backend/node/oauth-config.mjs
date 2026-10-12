import { readFileSync } from 'node:fs';

// Public application identifiers, shared by every installation. Never put secrets here.
const defaults = JSON.parse(readFileSync(new URL('../../config/oauth-public.json', import.meta.url), 'utf8'));

export function oauthClientId(key, environment = process.env) {
  if (!Object.hasOwn(defaults, key)) throw new Error('Proveedor OAuth desconocido.');
  return environment[key]?.trim() || defaults[key];
}
