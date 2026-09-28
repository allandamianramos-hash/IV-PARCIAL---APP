import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "./server.mjs";
test("sirve el sitio y bloquea secretos y antigua API", async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}`;
    for (const path of ["/", "/chat-engine.js", "/tienda.js"]) assert.equal((await fetch(url + path)).status, 200);
    for (const path of ["/.env", "/server.mjs", "/.git/config", "/package.json"]) assert.equal((await fetch(url + path)).status, 404);
    assert.equal((await fetch(url + "/api/chat", { method: "POST" })).status, 405);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
