import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createApp } from '../../server.mjs';
import { getDb, closeDb } from '../../backend/node/db.mjs';
import { oauthClientId } from '../../backend/node/oauth-config.mjs';
process.loadEnvFile(new URL('../../.env', import.meta.url));

test('Node + SQL: Google y Microsoft disponibles sin IDs privados; tokens falsos siguen rechazados', async () => {
  const previous = Object.fromEntries(['GOOGLE_CLIENT_ID', 'MICROSOFT_CLIENT_ID', 'APP_ORIGIN'].map(k => [k, process.env[k]]));
  for (const key of Object.keys(previous)) delete process.env[key];
  const server = createApp(), challenges = [];
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const provider of ['google', 'microsoft']) {
      const key = provider.toUpperCase() + '_CLIENT_ID';
      for (const value of [undefined, '']) {
        if (value === undefined) delete process.env[key]; else process.env[key] = value;
        const response = await fetch(`${origin}/api/auth/${provider}/config`);
        assert.equal(response.status, 200);
        const data = await response.json();
        assert.equal(data.enabled, true);
        assert.equal(data.clientId, oauthClientId(key, {}));
        assert.match(data.nonce, /^[a-f0-9]{64}$/);
        challenges.push([provider, createHash('sha256').update(data.nonce).digest('hex')]);
        const cookie = response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
        assert.match(cookie, new RegExp('rumbo_' + provider + '_nonce='));
        const rejected = await fetch(`${origin}/api/auth/${provider}`, {
          method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ credential: 'invalid' })
        });
        assert.equal(rejected.status, 401);
        assert.equal(rejected.headers.get('set-cookie'), null);
      }
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
    try {
      if (challenges.length) {
        const { pool, sql } = await getDb();
        for (const [provider, hash] of challenges) {
          const table = provider === 'google' ? 'RumboGoogleChallenges' : 'RumboMicrosoftChallenges';
          await pool.request().input('hash', sql.Char(64), hash).query(`DELETE dbo.${table} WHERE NonceHash=@hash`);
        }
      }
    } finally {
      await closeDb();
      for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
    }
  }
});
