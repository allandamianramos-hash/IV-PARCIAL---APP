// Owner-reviewed network change, scoped to BD_VIAJES and the observed host IP.
import assert from 'node:assert/strict';
import sql from 'mssql';
process.loadEnvFile(new URL('../.env',import.meta.url));
const rule='Rumbo-Hostinger-212-85-28-223',ip='212.85.28.223';
assert.equal(process.env.DB_SERVER,'rumbo-2026.database.windows.net');
assert.equal(process.env.DB_NAME,'BD_VIAJES');
const pool=new sql.ConnectionPool({server:process.env.DB_SERVER,database:process.env.DB_NAME,user:'rumbo-sql',password:process.env.AZURE_SQL_PASSWORD,options:{encrypt:true,trustServerCertificate:false}});
try{
  await pool.connect();
  if(process.argv.includes('--apply'))await pool.request().input('name',sql.NVarChar(128),rule).input('start_ip_address',sql.VarChar(50),ip).input('end_ip_address',sql.VarChar(50),ip).execute('sp_set_database_firewall_rule');
  const result=await pool.request().input('name',sql.NVarChar(128),rule).query('SELECT name,start_ip_address,end_ip_address FROM sys.database_firewall_rules WHERE name=@name');
  console.log(JSON.stringify({database:process.env.DB_NAME,rule,ip,applied:result.recordset.length===1,rules:result.recordset}));
}finally{await pool.close();}
