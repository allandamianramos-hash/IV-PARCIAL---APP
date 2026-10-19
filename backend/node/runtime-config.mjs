// Validate deployment settings before opening a public listener.
export function runtimeConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT debe estar entre 1 y 65535.');
  if (production) {
    let origin;
    try { origin = new URL(env.APP_ORIGIN); } catch { throw new Error('Configura APP_ORIGIN con el dominio HTTPS del sitio.'); }
    if (origin.protocol !== 'https:' || origin.origin !== env.APP_ORIGIN || origin.username || origin.password) {
      throw new Error('APP_ORIGIN debe ser un origen HTTPS exacto, sin ruta ni barra final.');
    }
    if (env.DB_ENABLED !== 'true' || env.DB_AUTH !== 'sql' || !env.DB_SERVER || !env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD) {
      throw new Error('Configura la conexión SQL de producción antes de iniciar Rumbo.');
    }
    if (env.DB_TRUST_CERTIFICATE === 'true') throw new Error('Producción requiere verificar el certificado de Azure SQL.');
  }
  return { port, host: env.HOST || (production ? '0.0.0.0' : '127.0.0.1') };
}
