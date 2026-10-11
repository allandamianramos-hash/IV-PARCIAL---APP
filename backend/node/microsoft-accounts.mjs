import { randomBytes, createHash } from 'node:crypto';
import { getDb } from './db.mjs';
import {socialAccount} from './social-account.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
export const microsoftNonce = req => /(?:^|;\s*)rumbo_microsoft_nonce=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1];
export class MicrosoftAccountError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
export async function createMicrosoftChallenge(req) {
  const { pool, sql } = await getDb();
  const previous = microsoftNonce(req);
  if (previous) {
    const found = await pool.request().input('hash', sql.Char(64), hash(previous)).query('SELECT NonceHash FROM dbo.RumboMicrosoftChallenges WHERE NonceHash=@hash AND ExpiresAt>SYSUTCDATETIME()');
    if (found.recordset.length) return previous;
  }
  const nonce = randomBytes(32).toString('hex');
  await pool.request().input('hash', sql.Char(64), hash(nonce)).query('DELETE dbo.RumboMicrosoftChallenges WHERE ExpiresAt<=SYSUTCDATETIME(); INSERT dbo.RumboMicrosoftChallenges(NonceHash,ExpiresAt) VALUES(@hash,DATEADD(minute,10,SYSUTCDATETIME()))');
  return nonce;
}

// Only accepts a cryptographically verified identity, never raw browser profile data.
export async function microsoftAccount(identity, nonce, password, passwordMatches, googleProof = null, newPassword) {
  return socialAccount({provider:'microsoft',identity,nonce,password,newPassword,passwordMatches,AccountError:MicrosoftAccountError});
}
