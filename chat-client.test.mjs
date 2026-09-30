import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const scope = { window: {}, location: { href: 'http://localhost:3000/index.html', protocol: 'http:' }, URL, AbortSignal };
vm.runInNewContext(await readFile(new URL('chat-client.js', import.meta.url), 'utf8'), scope);
const request = scope.window.RumboChatClient.request;
const payload = { message: 'Hola', history: [] };
const fallback = () => ({ reply: 'Orientación del catálogo', state: { destination: 'roatan' } });
test('file y vistas estáticas responden en modo local sin exigir API', async () => {
  let calls = 0;
  const file = await request(payload, { protocol: 'file:', fallback, fetchImpl: () => { calls++; } });
  assert.equal(file.source, 'local'); assert.equal(calls, 0);
  for (const status of [404, 405, 200]) {
    const result = await request(payload, { fallback, fetchImpl: async () => new Response('<html>Vista estática</html>', { status, headers: { 'Content-Type': 'text/html' } }) });
    assert.equal(result.source, 'local'); assert.equal(result.state.destination, 'roatan');
  }
});
test('caídas, timeouts y JSON inválido permiten continuar y recuperar IA después', async () => {
  for (const fetchImpl of [async () => { throw new TypeError('Failed to fetch'); }, async () => { throw new DOMException('timeout', 'TimeoutError'); }, async () => new Response('', { status: 503 }), async () => new Response('{', { headers: { 'Content-Type': 'application/json' } })]) {
    const result = await request(payload, { fallback, fetchImpl });
    assert.equal(result.source, 'local'); assert.match(result.connectionNotice, /Modo local/);
  }
  const online = await request(payload, { fallback: () => { throw Error('No fallback expected'); }, fetchImpl: async (url, init) => {
    assert.equal(url.href, 'http://localhost:3000/api/chat');
    assert.deepEqual(JSON.parse(init.body), payload);
    return Response.json({ reply: 'Hola desde GPT', source: 'lightning' });
  } });
  assert.equal(online.source, 'lightning'); assert.equal(online.connectionNotice, undefined);
});
test('los límites y rechazos de acceso no se ocultan con el respaldo', async () => {
  for (const status of [400, 403, 429]) {
    await assert.rejects(request(payload, { fallback: () => { throw Error('Unexpected fallback'); }, fetchImpl: async () => Response.json({ error: 'Solicitud rechazada' }, { status }) }), /Solicitud rechazada/);
  }
});
