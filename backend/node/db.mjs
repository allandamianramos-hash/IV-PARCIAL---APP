// Server-only SQL Server pool. Credentials are never exported to the browser.
let poolPromise;
let driver;
export const dbEnabled = () => process.env.DB_ENABLED === 'true';
export async function getDb() {
  if (!dbEnabled()) throw new Error('DB_DISABLED');
  if (!poolPromise) poolPromise = (async () => {
    const windows = (process.env.DB_AUTH || 'windows') === 'windows';
    driver = (await import(windows ? 'mssql/msnodesqlv8.js' : 'mssql')).default;
    const odbc = value => '{' + String(value).replace(/}/g, '}}') + '}';
    const pool = new driver.ConnectionPool({
      server: process.env.DB_SERVER || 'localhost', database: process.env.DB_NAME || 'BD_VIAJES',
      ...(windows ? { driver: process.env.DB_ODBC_DRIVER || 'ODBC Driver 18 for SQL Server' } : { user: process.env.DB_USER, password: process.env.DB_PASSWORD }),
      ...(process.env.DB_PORT ? { port: Number(process.env.DB_PORT) } : {}),
      connectionTimeout: 5000, requestTimeout: 10000,
      pool: { min: 0, max: 5, idleTimeoutMillis: 30000 },
      options: { trustedConnection: windows, encrypt: true, trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true' },
      ...(windows ? { beforeConnect(config) {
        // Let ODBC use local shared memory when no TCP port was configured.
        // Also set certificate trust explicitly: mssql's native adapter omits it.
        const server = (process.env.DB_SERVER || 'localhost') + (process.env.DB_PORT ? ',' + process.env.DB_PORT : '');
        config.conn_str = `Driver=${odbc(process.env.DB_ODBC_DRIVER || 'ODBC Driver 18 for SQL Server')};Server=${odbc(server)};Database=${odbc(process.env.DB_NAME || 'BD_VIAJES')};Trusted_Connection=Yes;Encrypt=Yes;TrustServerCertificate=${process.env.DB_TRUST_CERTIFICATE === 'true' ? 'Yes' : 'No'};`;
      }} : {})
    });
    pool.on('error', () => { poolPromise = undefined; });
    await pool.connect();
    return pool;
  })().catch(error => { poolPromise = undefined; throw error; });
  return { pool: await poolPromise, sql: driver };
}
export async function closeDb() {
  const pending = poolPromise; poolPromise = undefined;
  if (pending) await (await pending).close();
}
