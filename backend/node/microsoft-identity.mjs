import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';

const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const validMicrosoftClientId = value => typeof value === 'string' && guid.test(value);
const keys = createRemoteJWKSet(new URL('https://login.microsoftonline.com/common/discovery/v2.0/keys'), { timeoutDuration: 8000 });

export async function verifyMicrosoftIdentity(credential, clientId, nonce, keySet = keys) {
  if (!validMicrosoftClientId(clientId) || typeof credential !== 'string' || credential.length > 12000 ||
      !/^[a-f0-9]{64}$/.test(nonce || '')) throw Error('Invalid Microsoft request');
  const tenant = decodeJwt(credential).tid;
  if (typeof tenant !== 'string' || !guid.test(tenant)) throw Error('Invalid tenant');
  const expectedIssuer = `https://login.microsoftonline.com/${tenant}/v2.0`;
  const resolver = keySet === keys ? async (header, token) => {
    const key = await keys(header, token);
    const jwk = keys.jwks()?.keys.find(candidate => candidate.kid === header.kid);
    // Microsoft's common key set can contain tenant-scoped keys. Enforce their issuer too.
    if (!jwk || typeof jwk.issuer !== 'string' || jwk.issuer.replace('{tenantid}', tenant) !== expectedIssuer) throw Error('Invalid signing key issuer');
    return key;
  } : keySet;
  const { payload } = await jwtVerify(credential, resolver, {
    audience: clientId, algorithms: ['RS256'], requiredClaims: ['exp', 'iat', 'iss', 'sub', 'tid', 'oid', 'nonce'],
    clockTolerance: 0, maxTokenAge: '15m',
  });
  if (payload.ver !== '2.0' || !guid.test(payload.tid) || !guid.test(payload.oid) ||
      payload.iss !== `https://login.microsoftonline.com/${payload.tid}/v2.0` || payload.nonce !== nonce) {
    throw Error('Invalid Microsoft identity');
  }
  // Email is contact data, never an identifier or proof of ownership of a Rumbo account.
  const email = [payload.email, payload.preferred_username].find(value =>
    typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  const name = (typeof payload.name === 'string' ? payload.name : '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return { sub: `${payload.tid.toLowerCase()}:${payload.oid.toLowerCase()}`, email: email?.toLowerCase() || null,
    name: Array.from(name || 'Viajero de Microsoft').slice(0, 120).join('') };
}
