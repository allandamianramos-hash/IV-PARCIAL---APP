import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();
// Bound Google's network request as well as the PHP verifier process.
client.transporter.defaults = { ...client.transporter.defaults, timeout: 8000, retry: false };
export const validGoogleClientId = value => typeof value === 'string' && /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(value);

export function googleClaims(payload, nonce, now = Date.now()) {
  if (!payload || !/^[a-f0-9]{64}$/.test(nonce || '') || payload.nonce !== nonce ||
      !['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss) ||
      typeof payload.exp !== 'number' || payload.exp * 1000 <= now ||
      typeof payload.sub !== 'string' || !/^[0-9]{1,255}$/.test(payload.sub) ||
      payload.email_verified !== true || typeof payload.email !== 'string' ||
      payload.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw Error('Invalid Google identity');
  }
  const name = (typeof payload.name === 'string' ? payload.name : '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return { sub: payload.sub, email: payload.email.toLowerCase(), name: Array.from(name || 'Viajero de Google').slice(0, 120).join('') };
}

export async function verifyGoogleIdentity(credential, clientId, nonce, verifier = client) {
  if (!validGoogleClientId(clientId) || typeof credential !== 'string' || credential.length > 12000 ||
      credential.split('.').length !== 3 || !/^[a-f0-9]{64}$/.test(nonce || '')) throw Error('Invalid Google request');
  const ticket = await verifier.verifyIdToken({ idToken: credential, audience: clientId });
  return googleClaims(ticket.getPayload(), nonce);
}
