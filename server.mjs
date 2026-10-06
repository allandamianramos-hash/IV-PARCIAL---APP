import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createChatHandler } from './backend/node/chat-api.mjs';
import { loadEnvFile } from 'node:process';
import { spawn } from 'node:child_process';
import { bootstrap, databaseApi, safeJson } from './backend/node/database-api.mjs';
import { authApi } from './backend/node/auth-api.mjs';
import { sendError } from './backend/node/error-pages.mjs';
const root = fileURLToPath(new URL("./public/", import.meta.url));
const publicFiles = new Set(["error.html", "error.js", "connection.js", "index.html", "script.js", "chat-engine.js", "chat-client.js", "chat-ui.js", "chat.css", "style.css", "viajes.html", "viajes.js", "viajes.css", "tienda.html", "tienda.js", "tienda.css", "logo-rumbo.jpg", "servicios.html", "servicios.js", "servicios.css", "common.js", "common.css", "journey.js", "promociones.css", "design.css"]);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
publicFiles.add('database-client.js');
for (const file of ['registro.html','iniciar-sesion.html','auth-client.js','auth.css']) publicFiles.add(file);
publicFiles.add('guias-catalogo.js');
publicFiles.add('palette.css');
for (const file of ['hero.js', 'hero.css', 'navigation.js', 'navigation.css']) publicFiles.add(file);
export function createApp(chatOptions) {
  const chat = createChatHandler(chatOptions);
  return createServer(async (req, res) => {
    const trustedHost = process.env.APP_ORIGIN ? new URL(process.env.APP_ORIGIN).host : null;
    if (trustedHost ? req.headers.host !== trustedHost : !/^(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(req.headers.host || '')) {
      sendError(req,res,403); return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cache-Control", "no-store");
    try {
      if (await authApi(req, res)) return;
      if (await databaseApi(req, res)) return;
      if (req.url === '/api/health' && ['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ app: 'rumbo-viajes', status: 'ok' }));
        return;
      }
      if (new URL(req.url, 'http://localhost').pathname === '/api/chat') return await chat(req, res);
      if (!["GET", "HEAD"].includes(req.method)) { sendError(req,res,405); return; }
      let path;
      try { path = decodeURIComponent(new URL(req.url, "http://localhost").pathname).slice(1) || "index.html"; }
      catch { sendError(req,res,400); return; }
      const image = /^(imagenes|imagenes-viajes)\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(path);
      // Only public assets; credentials and configuration never leave the server.
      if (!publicFiles.has(path) && !image) { sendError(req,res,404); return; }
      let data = await readFile(resolve(root, path));
      if (extname(path) === '.html' && path !== 'error.html' && req.method === 'GET') {
        const initial = await bootstrap(req, res);
        data = data.toString('utf8').replace('<head>', `<head><script id="rumbo-bootstrap" type="application/json">${safeJson(initial)}</script><script src="auth-client.js" defer></script><link rel="stylesheet" href="auth.css">`);
      }
      res.writeHead(200, { "Content-Type": mime[extname(path)] || "application/octet-stream" });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch (error) { sendError(req,res,error.code === "ENOENT" ? 404 : 500); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { loadEnvFile(new URL('.env', import.meta.url)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  const port = Number(process.env.PORT || 3000);
  const server = createApp();
  server.on("error", error => {
    console.error(error.code === "EADDRINUSE" ? "Puerto ocupado. Si Rumbo ya esta iniciado, abre http://localhost:3000. Tambien puedes configurar PORT." : "No se pudo iniciar Rumbo.");
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => {
    const url = `http://localhost:${port}`;
    console.log(`Rumbo: ${url}`);
    if (process.argv.includes('--open') && process.platform === 'win32') {
      const browser = spawn('explorer.exe', [url], { detached: true, stdio: 'ignore', windowsHide: true });
      browser.on('error', () => console.log(`Abre ${url} en tu navegador.`));
      browser.unref();
    }
  });
}
