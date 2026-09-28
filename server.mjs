import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
const publicFiles = new Set(["index.html", "script.js", "chat-engine.js", "style.css", "viajes.html", "viajes.js", "viajes.css", "tienda.html", "tienda.js", "tienda.css", "logo-rumbo.jpg", "servicios.html", "servicios.js", "servicios.css", "common.js", "common.css"]);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
export function createApp() {
  return createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cache-Control", "no-store");
    try {
      if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); res.end(); return; }
      let path;
      try { path = decodeURIComponent(new URL(req.url, "http://localhost").pathname).slice(1) || "index.html"; }
      catch { res.writeHead(400); res.end(); return; }
      const image = /^(imagenes|imagenes-viajes)\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(path);
      // Only public assets; credentials and configuration never leave the server.
      if (!publicFiles.has(path) && !image) { res.writeHead(404); res.end(); return; }
      const data = await readFile(resolve(root, path));
      res.writeHead(200, { "Content-Type": mime[extname(path)] || "application/octet-stream" });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch (error) { res.writeHead(error.code === "ENOENT" ? 404 : 500); res.end(); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const server = createApp();
  server.on("error", error => {
    console.error(error.code === "EADDRINUSE" ? "Puerto ocupado. Si Rumbo ya esta iniciado, abre http://localhost:3000. Tambien puedes configurar PORT." : "No se pudo iniciar Rumbo.");
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => console.log(`Rumbo: http://localhost:${port}`));
}
