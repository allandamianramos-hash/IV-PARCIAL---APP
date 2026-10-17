// Aggregate metadata only: never exports accounts, tokens, messages or credentials.
import {writeFile} from 'node:fs/promises';
import {getDb,closeDb} from '../backend/node/db.mjs';
process.loadEnvFile(new URL('../.env',import.meta.url));
const report={checkedAt:new Date().toISOString()};
try{
 const {pool}=await getDb();
 const queries={
  tier:'SELECT edition,service_objective,elastic_pool_name FROM sys.database_service_objectives',
  storage:"SELECT name,type_desc,CAST(size/128.0 AS decimal(12,2)) AS allocatedMB,CAST(FILEPROPERTY(name,'SpaceUsed')/128.0 AS decimal(12,2)) AS usedMB FROM sys.database_files",
  tables:'SELECT t.name,SUM(p.rows) AS [rowCount] FROM sys.tables t JOIN sys.partitions p ON p.object_id=t.object_id AND p.index_id IN(0,1) GROUP BY t.name ORDER BY t.name',
  maxSize:"SELECT CAST(DATABASEPROPERTYEX(DB_NAME(),'MaxSizeInBytes') AS bigint) AS maxBytes",
  resources:'SELECT TOP(12) end_time,avg_cpu_percent,avg_data_io_percent,avg_log_write_percent,max_worker_percent,max_session_percent FROM sys.dm_db_resource_stats ORDER BY end_time DESC',
  orderIndexes:"SELECT name,is_unique FROM sys.indexes WHERE object_id=OBJECT_ID('dbo.RumboOrders') AND name IS NOT NULL",
  migrations:'SELECT Name FROM dbo.RumboMigrations ORDER BY Name'
 };
 for(const [name,query] of Object.entries(queries)){try{report[name]=(await pool.request().query(query)).recordset;}catch{report[name]={unavailable:'La cuenta de aplicación no tiene acceso a esta métrica.'};}}
 await writeFile(new URL('../.runtime/launch-database-audit.json',import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await closeDb();}
