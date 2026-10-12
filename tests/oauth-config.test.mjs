import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { oauthClientId } from '../backend/node/oauth-config.mjs';
import { validGoogleClientId } from '../backend/node/google-identity.mjs';
import { validMicrosoftClientId } from '../backend/node/microsoft-identity.mjs';

const defaults = JSON.parse(readFileSync(new URL('../config/oauth-public.json', import.meta.url), 'utf8'));
const keys = ['GOOGLE_CLIENT_ID', 'MICROSOFT_CLIENT_ID'];
test('OAuth compartido: una copia sin IDs, o con campos vacíos, usa las aplicaciones de Rumbo', () => {
  assert.deepEqual(Object.keys(defaults).sort(), keys);
  assert.ok(validGoogleClientId(defaults.GOOGLE_CLIENT_ID));
  assert.ok(validMicrosoftClientId(defaults.MICROSOFT_CLIENT_ID));
  for (const key of keys) {
    for (const env of [{}, { [key]: '' }, { [key]: '  ' }]) assert.equal(oauthClientId(key, env), defaults[key]);
    assert.equal(oauthClientId(key, { [key]: ' custom-client ' }), 'custom-client');
    // An explicitly invalid override must not silently switch to a different application's audience.
    assert.equal(oauthClientId(key, { [key]: '0' }), '0');
  }
  assert.throws(() => oauthClientId('DB_PASSWORD', {}));
});

const php = process.env.RUMBO_PHP || (existsSync('C:/xampp/php/php.exe') ? 'C:/xampp/php/php.exe' : 'php');
const phpAvailable = spawnSync(php, ['-v'], { windowsHide: true }).status === 0;
test('PHP y Node: mismos IDs sin .env, campos vacíos y configuración personalizada', { skip: !phpAvailable }, () => {
  const root = mkdtempSync(join(tmpdir(), 'rumbo-oauth-'));
  try {
    mkdirSync(join(root, 'backend/php'), { recursive: true });
    mkdirSync(join(root, 'config'));
    for (const file of ['config/oauth-public.json', ...['conexion.php', 'oauth-config.php', 'google-auth.php', 'microsoft-auth.php'].map(f => 'backend/php/' + f)]) {
      copyFileSync(new URL('../' + file, import.meta.url), join(root, file));
    }
    const env = { ...process.env };
    for (const key of keys) delete env[key];
    const code = "require 'backend/php/conexion.php'; require 'backend/php/google-auth.php'; require 'backend/php/microsoft-auth.php'; echo json_encode(['GOOGLE_CLIENT_ID'=>google_client_id(),'MICROSOFT_CLIENT_ID'=>microsoft_client_id()]);";
    const run = overrides => {
      const result = spawnSync(php, ['-r', code], { cwd: root, env: { ...env, ...overrides }, encoding: 'utf8', windowsHide: true });
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(result.stdout);
    };
    assert.deepEqual(run({}), defaults);
    assert.deepEqual(run({ GOOGLE_CLIENT_ID: '', MICROSOFT_CLIENT_ID: '  ' }), defaults);
    const custom = { GOOGLE_CLIENT_ID: '123456789-test.apps.googleusercontent.com', MICROSOFT_CLIENT_ID: '11111111-2222-4333-8444-555555555555' };
    assert.deepEqual(run(custom), custom);
    assert.deepEqual(run({ GOOGLE_CLIENT_ID: '0', MICROSOFT_CLIENT_ID: 'invalid' }), { GOOGLE_CLIENT_ID: '', MICROSOFT_CLIENT_ID: '' });
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert.ok(basename(root).startsWith('rumbo-oauth-'));
    rmSync(root, { recursive: true, force: true });
  }
});
