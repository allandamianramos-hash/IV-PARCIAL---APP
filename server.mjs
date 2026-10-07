import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {readChatConfig} from './backend/node/chat-config.mjs';
import { createChatHandler } from './backend/node/chat-api.mjs';
import { loadEnvFile } from 'node:process';
import { spawn } from 'node:child_process';
import { bootstrap, databaseApi, safeJson } from './backend/node/database-api.mjs';
import {reviewsApi} from './backend/node/reviews-api.mjs';
import {exchangeApi} from './backend/node/exchange-api.mjs';
import { authApi } from './backend/node/auth-api.mjs';
import { sendError } from './backend/node/error-pages.mjs';
const root = fileURLToPath(new URL("./public/", import.meta.url));
const publicFiles = new Set(["error.html", "js/compartido/error.js", "js/compartido/connection.js", "index.html", "js/inicio/script.js", "js/rumbito/chat-engine.js", "js/rumbito/chat-client.js", "js/rumbito/chat-ui.js", "css/rumbito/chat.css", "css/inicio/style.css", "viajes.html", "js/destinos/viajes.js", "css/destinos/viajes.css", "tienda.html", "js/tienda/tienda.js", "css/tienda/tienda.css", "servicios.html", "js/servicios/servicios.js", "css/servicios/servicios.css", "js/compartido/common.js", "css/compartido/common.css", "js/servicios/journey.js", "css/inicio/promociones.css", "css/compartido/design.css"]);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
publicFiles.add('js/compartido/database-client.js');
for (const file of ['registro.html','iniciar-sesion.html','js/cuenta/auth-client.js','css/cuenta/auth.css']) publicFiles.add(file);
publicFiles.add('js/destinos/guias-catalogo.js');
publicFiles.add('css/compartido/palette.css');
for(const file of ['js/compartido/api-client.js','js/comunidad/reviews.js','js/idiomas/preferences.js','js/idiomas/translations.js','css/comunidad/community.css']) publicFiles.add(file);
for (const file of ['js/inicio/hero.js', 'css/inicio/hero.css', 'js/compartido/navigation.js', 'css/compartido/navigation.css']) publicFiles.add(file);
publicFiles.add('js/idiomas/locale-engine.js');
for(const lang of ['es','en','de','fr','it','pt','ja','ko','zh','ar'])publicFiles.add('locales/'+lang+'.json');
mime['.json']='application/json; charset=utf-8';
const assetAliases=JSON.parse(await readFile(new URL('./config/asset-aliases.json',import.meta.url),'utf8'));
export function createApp(chatOptions) {
  const chat = createChatHandler(chatOptions || {configuration:readChatConfig});
  return createServer(async (req, res) => {
    const trustedHost = process.env.APP_ORIGIN ? new URL(process.env.APP_ORIGIN).host : null;
    if (trustedHost ? req.headers.host !== trustedHost : !/^(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(req.headers.host || '')) {
      sendError(req,res,403); return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cache-Control", "no-store");
    try {
      if (await reviewsApi(req,res)) return;
      if (await exchangeApi(req,res)) return;
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
      path=assetAliases[path]||path;
      const image = /^(imagenes|imagenes-viajes)(?:\/[a-zA-Z0-9_-]+)+\.(jpg|png|webp)$/.test(path);
      // Only public assets; credentials and configuration never leave the server.
      if (!publicFiles.has(path) && !image) { sendError(req,res,404); return; }
      let data = await readFile(resolve(root, path));
      if (extname(path) === '.html' && path !== 'error.html' && req.method === 'GET') {
        const initial = await bootstrap(req, res);
        data = data.toString('utf8').replace('<head>', `<head><script id="rumbo-bootstrap" type="application/json">${safeJson(initial)}</script><script src="js/cuenta/auth-client.js" defer></script><link rel="stylesheet" href="css/cuenta/auth.css">`);
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
