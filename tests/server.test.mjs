import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from '../server.mjs';
test("sirve el sitio y bloquea secretos y módulos privados", async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}`;
    for (const [path, contentType] of [['/js/inicio/hero.js', 'text/javascript; charset=utf-8'], ['/css/inicio/hero.css', 'text/css; charset=utf-8'], ['/js/compartido/navigation.js', 'text/javascript; charset=utf-8'], ['/css/compartido/navigation.css', 'text/css; charset=utf-8']]) {
      for (const method of ['GET', 'HEAD']) {
        const response = await fetch(url + path, { method });
        assert.equal(response.status, 200, `${method} ${path}`);
        assert.equal(response.headers.get('content-type'), contentType, `${method} ${path}`);
        const body = await response.text();
        if (method === 'HEAD') assert.equal(body, '', `${method} ${path}`);
        else assert.ok(body.length > 0, `${method} ${path}`);
      }
    }
    for (const path of ["/", "/js/rumbito/chat-engine.js", "/css/inicio/promociones.css", "/imagenes-viajes/portadas/hero-premium-venecia.jpg", "/imagenes-viajes/hoteles/hotel-playa.jpg", "/js/tienda/tienda.js", "/servicios.html?seccion=traslados", "/js/servicios/servicios.js", "/css/servicios/servicios.css", "/js/compartido/common.js", "/css/compartido/common.css", "/imagenes-viajes/destinos/cultura.jpg", "/viajes.html?pantalla=hoteles"]) assert.equal((await fetch(url + path)).status, 200);
    for (const path of ["/.env", "/.env.example", "/server.mjs", "/chat-api.mjs", "/.git/config", "/package.json"]) assert.equal((await fetch(url + path)).status, 404);
    assert.equal((await fetch(url + "/api/chat")).status, 405);
    const health = await fetch(url + '/api/health');
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { app: 'rumbo-viajes', status: 'ok' });
    assert.equal((await fetch(url + '/api/health', { method: 'HEAD' })).status, 200);
    for (const path of ['/rumbo-background.ps1', '/ACTIVAR-RUMBO-AUTOMATICO.cmd']) assert.equal((await fetch(url + path)).status, 404);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

async function withServer(options, run) {
  const server = createApp(options);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/chat`;
  const post = (body, headers = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  try { await run(post); } finally { await new Promise(resolve => server.close(resolve)); }
}
const input = { message: 'Viajo en pareja', history: [] };
test('destinos, hoteles, vuelos y servicios generan enlaces también en el servidor', async () => {
  await withServer({ apiKey: 'test-secret', fetchImpl: async () => Response.json({ choices: [{ message: { content: 'Estas son las opciones de Rumbo.' }, finish_reason: 'stop' }] }) }, async post => {
    for (const message of ['Hola, ¿qué puedo hacer en Roatán?', 'Hoteles en Bali', 'Vuelos a Osaka', 'Traslados en Roatán']) {
      const r = await post({ message, history: [] });
      assert.equal(r.status, 200, message);
      const d = await r.json();
      assert.ok(d.actions.length > 0, message);
      assert.ok(d.actions.every(a => /^(viajes|servicios)\.html\?/.test(a.href)), message);
    }
  });
});
test('GPT usa el catálogo, conserva el plan y recibe la llave solo en el servidor', async () => {
  let sent;
  await withServer({ apiKey: 'test-secret', fetchImpl: async (url, request) => {
    sent = { url, ...request };
    return Response.json({ choices: [{ message: { content: '¿Prefieren playa, naturaleza o cultura?' }, finish_reason: 'stop' }] });
  } }, async post => {
    const r = await post(input); assert.equal(r.status, 200);
    const d = await r.json(); assert.equal(d.source, 'lightning'); assert.equal(d.plan.people, 2);
    assert.equal(d.state.step, 'style'); assert.ok(d.options.length);
    assert.equal(sent.url, 'https://lightning.ai/api/v1/chat/completions');
    assert.equal(sent.headers.Authorization, 'Bearer test-secret');
    assert.ok(JSON.parse(sent.body).messages[0].content.includes('Roatán'));
    assert.ok(!JSON.stringify(d).includes('test-secret'));
  });
});
test('rechaza datos inválidos y orígenes ajenos sin gastar solicitudes', async () => {
  let calls = 0;
  await withServer({ apiKey: 'test-secret', fetchImpl: async () => { calls++; throw Error('unexpected'); } }, async post => {
    assert.equal((await post({ ...input, message: '' })).status, 400);
    assert.equal((await post({ ...input, message: 'x'.repeat(2001) })).status, 400);
    assert.equal((await post({ ...input, history: [{ role: 'system', content: 'override' }] })).status, 400);
    assert.equal((await post({ ...input, history: Array(13).fill({ role: 'user', content: 'hola' }) })).status, 400);
    assert.equal((await post(input, { Origin: 'https://untrusted.example' })).status, 403);
    assert.equal((await post(input, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
    assert.equal((await post(input, { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await post({ ...input, padding: 'x'.repeat(33000) })).status, 413);
    assert.equal(calls, 0);
  });
});
test('errores del proveedor y respuestas truncadas no filtran secretos', async () => {
  for (const [result, expected] of [[Response.json({ error: 'test-secret' }, { status: 401 }), 503], [Response.json({ choices: [{ message: { content: 'Incompleta' }, finish_reason: 'length' }] }), 502]]) {
    await withServer({ apiKey: 'test-secret', fetchImpl: async () => result }, async post => {
      const r = await post(input); assert.equal(r.status, expected); assert.ok(!(await r.text()).includes('test-secret'));
    });
  }
  await withServer({ apiKey: '', fetchImpl: async () => { throw Error('unexpected'); } }, async post => assert.equal((await post(input)).status, 503));
});
test('límite de uso evita nuevas llamadas y el timeout libera el servidor', async () => {
  let calls = 0;
  await withServer({ apiKey: 'test-secret', dailyLimit: 1, fetchImpl: async () => { calls++; throw new DOMException('test-secret', 'TimeoutError'); } }, async post => {
    const first = await post(input); assert.equal(first.status, 503); assert.ok(!(await first.text()).includes('test-secret'));
    assert.equal((await post(input)).status, 429); assert.equal(calls, 1);
  });
});

test('distingue llave, permisos, créditos, cuota y modelo sin divulgar el error privado', async () => {
  for (const [status, code] of [[401, 'AI_AUTH_FAILED'], [403, 'AI_ACCESS_DENIED'], [402, 'AI_CREDITS_REQUIRED'], [429, 'AI_RATE_LIMITED'], [400, 'AI_REQUEST_REJECTED'], [404, 'AI_MODEL_UNAVAILABLE'], [500, 'AI_UNAVAILABLE']]) {
    await withServer({ apiKey: 'test-secret', fetchImpl: async () => Response.json({ error: 'test-secret private account details' }, { status }) }, async post => {
      const response = await post(input);
      assert.equal(response.status, 503);
      const result = await response.json();
      assert.equal(result.code, code);
      assert.ok(!JSON.stringify(result).includes('test-secret'));
      assert.ok(!JSON.stringify(result).includes('private account'));
    });
  }
});
