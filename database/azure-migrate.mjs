// Copies missing local Rumbo rows to Azure; never drops or overwrites remote rows.
// Conflicting rows stop the copy. Private snapshots stay in .runtime.
import sql from 'mssql';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {getDb,closeDb} from '../backend/node/db.mjs';

// mssql's native Windows adapter changes its shared default driver. Keep the
// Azure constructors before loading it so TCP requests never use ODBC methods.
const AzureRequest=sql.Request,AzureTransaction=sql.Transaction;

process.loadEnvFile(new URL('../.env',import.meta.url));
const mode=process.argv[2]||'check';
if(!['check','compare','copy'].includes(mode))throw Error('Usa check, compare o copy');
if(!process.env.AZURE_SQL_PASSWORD)throw Error('Falta AZURE_SQL_PASSWORD en .env');
const tables=['RumboMigrations','RumboVisitors','RumboProducts','RumboDestinations','RumboHotels','RumboSettings','RumboUsers','RumboSessions','RumboVisitorState','RumboAuthAttempts'];
const primary={RumboMigrations:['Name'],RumboVisitors:['Id'],RumboProducts:['Id'],RumboDestinations:['Id'],RumboHotels:['DestinationId','Id'],RumboSettings:['Name'],RumboUsers:['Id'],RumboSessions:['TokenHash'],RumboVisitorState:['VisitorId','StateKey'],RumboAuthAttempts:['Id']};
const normalized=v=>v instanceof Date?v.toISOString():typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9-]{27}$/i.test(v)?v.toLowerCase():v;
const key=(name,row)=>JSON.stringify(primary[name].map(k=>normalized(row[k])));
const differs=(name,column,a,b)=>!(name==='RumboMigrations'&&column==='AppliedAt')&&!(name==='RumboVisitorState'&&['Revision','UpdatedAt'].includes(column))&&JSON.stringify(normalized(a))!==JSON.stringify(normalized(b));
const remote=new sql.ConnectionPool({server:'rumbo-2026.database.windows.net',database:'BD_VIAJES',user:'rumbo-sql',password:process.env.AZURE_SQL_PASSWORD,connectionTimeout:30000,requestTimeout:60000,options:{encrypt:true,trustServerCertificate:false}});
let tx;
try{
  await remote.connect();
  const inventory=(await new AzureRequest(remote).query('SELECT t.name,SUM(p.rows) AS totalRows FROM sys.tables t JOIN sys.partitions p ON p.object_id=t.object_id AND p.index_id IN(0,1) GROUP BY t.name')).recordset;
  console.log(JSON.stringify({server:'rumbo-2026.database.windows.net',database:'BD_VIAJES',tables:inventory}));
  if(mode!=='check'){
    if(process.env.DB_SERVER!=='localhost'||process.env.DB_AUTH!=='windows')throw Error('La copia requiere .env apuntando todavía al origen local.');
    const {pool,sql:localSql}=await getDb();
    const localTx=new localSql.Transaction(pool);
    const snapshot={createdAt:new Date().toISOString(),tables:{}};
    await localTx.begin(localSql.ISOLATION_LEVEL.SERIALIZABLE);
    try{
      for(const name of tables){
        const rows=(await new localSql.Request(localTx).query(`SELECT * FROM dbo.[${name}] WITH(HOLDLOCK)`)).recordset;
        const columns=(await new localSql.Request(localTx).query(`SELECT c.name,t.name AS type,c.max_length AS length,c.precision,c.scale,c.is_nullable AS nullable FROM sys.columns c JOIN sys.types t ON c.user_type_id=t.user_type_id WHERE c.object_id=OBJECT_ID('dbo.${name}') ORDER BY c.column_id`)).recordset;
        snapshot.tables[name]={columns,rows:Array.from(rows)};
      }
      await localTx.commit();
    }catch(e){await localTx.rollback();throw e;}
    const folder=new URL('../.runtime/',import.meta.url);await mkdir(folder,{recursive:true});
    const backup=new URL(`azure-source-${Date.now()}.json`,folder);
    await writeFile(backup,JSON.stringify(snapshot),{flag:'wx'});
    console.log('Copia local privada guardada: '+backup.pathname.split('/').pop());
    const targetSnapshot={createdAt:new Date().toISOString(),tables:{}};
    let conflicts=0;
    for(const name of tables){
      const rows=inventory.some(t=>t.name===name)?(await new AzureRequest(remote).query(`SELECT * FROM dbo.[${name}]`)).recordset:[];
      targetSnapshot.tables[name]=rows;
      const existing=new Map(rows.map(row=>[key(name,row),row]));
      const differing=new Set();let missing=0,matched=0;
      for(const row of snapshot.tables[name].rows){
        const found=existing.get(key(name,row));
        if(!found){missing++;continue;}matched++;
        for(const c of snapshot.tables[name].columns)if(differs(name,c.name,row[c.name],found[c.name]))differing.add(c.name);
      }
      // Authentication throttle history belongs to each server, not to the account migration.
      if(name==='RumboAuthAttempts')continue;
      if(differing.size)conflicts++;
      console.log(JSON.stringify({table:name,local:snapshot.tables[name].rows.length,azure:rows.length,missing,matched,differentColumns:[...differing]}));
    }
    await writeFile(new URL(`azure-target-${Date.now()}.json`,folder),JSON.stringify(targetSnapshot),{flag:'wx'});
    if(mode==='compare')process.exitCode=conflicts?2:0;
    else {
    if(conflicts)throw Error('Hay filas distintas con la misma clave. No se sobrescribió nada.');
    tx=new AzureTransaction(remote);await tx.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
    const request=()=>new AzureRequest(tx);
    await request().query("IF OBJECT_ID('dbo.RumboMigrations','U') IS NULL CREATE TABLE dbo.RumboMigrations(Name varchar(150) NOT NULL PRIMARY KEY,Checksum char(64) NOT NULL,AppliedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME())");
    const migrations=['001_initial.sql','002_accounts.sql','003_php_auth_limits.sql'];
    const probes=['RumboVisitors','RumboUsers','RumboAuthAttempts'];
    for(const [i,name]of migrations.entries()){
      const source=await readFile(new URL('migrations/'+name,import.meta.url),'utf8');
      const recorded=snapshot.tables.RumboMigrations.rows.find(row=>row.Name===name);
      if(!recorded||recorded.Checksum!==createHash('sha256').update(source).digest('hex'))throw Error('Migración local no coincide: '+name);
      const exists=(await request().query(`SELECT OBJECT_ID('dbo.${probes[i]}','U') AS id`)).recordset[0].id;
      if(!exists)await request().batch(source);
    }
    for(const name of tables){
      if(name==='RumboAuthAttempts')continue;
      const {columns,rows:sourceRows}=snapshot.tables[name];
      const current=(await request().query(`SELECT * FROM dbo.[${name}] WITH(TABLOCKX,HOLDLOCK)`)).recordset;
      const existing=new Map(current.map(row=>[key(name,row),row]));
      for(const row of sourceRows){const found=existing.get(key(name,row));if(found&&columns.some(c=>differs(name,c.name,row[c.name],found[c.name])))throw Error('Cambió el destino durante la copia: '+name);}
      const rows=sourceRows.filter(row=>!existing.has(key(name,row)));
      // Equal state values can have different save counters. Preserve the largest
      // counter so migrating an active browser does not manufacture a conflict.
      if(name==='RumboVisitorState')for(const row of sourceRows){
        const found=existing.get(key(name,row));
        if(found&&row.Revision>found.Revision)await request().input('visitor',sql.UniqueIdentifier,row.VisitorId).input('key',sql.VarChar(60),row.StateKey).input('revision',sql.Int,row.Revision).input('updated',sql.DateTime2,row.UpdatedAt).query('UPDATE dbo.RumboVisitorState SET Revision=@revision,UpdatedAt=@updated WHERE VisitorId=@visitor AND StateKey=@key');
      }
      if(rows.length){
        const table=new sql.Table('dbo.'+name);table.create=false;
        for(const c of columns){
          const types={uniqueidentifier:sql.UniqueIdentifier,char:sql.Char,varchar:sql.VarChar,nvarchar:sql.NVarChar,nchar:sql.NChar,int:sql.Int,bigint:sql.BigInt,datetime2:sql.DateTime2,decimal:sql.Decimal,numeric:sql.Numeric};
          let type=types[c.type];if(!type)throw Error('Tipo no compatible: '+c.type);
          if(['nvarchar','varchar','nchar','char'].includes(c.type))type=type(c.length<0?sql.MAX:c.length/(['nvarchar','nchar'].includes(c.type)?2:1));
          else if(['decimal','numeric'].includes(c.type))type=type(c.precision,c.scale);
          else if(c.type==='datetime2')type=type(c.scale);
          table.columns.add(c.name,type,{nullable:c.nullable});
        }
        for(const row of rows)table.rows.add(...columns.map(c=>row[c.name]));
        await request().bulk(table,{keepIdentity:true,checkConstraints:true});
      }
      const actual=Number((await request().query(`SELECT COUNT_BIG(*) AS n FROM dbo.[${name}]`)).recordset[0].n);
      if(actual!==current.length+rows.length)throw Error('Conteo distinto: '+name);
      const copied=new Map((await request().query(`SELECT * FROM dbo.[${name}]`)).recordset.map(row=>[key(name,row),row]));
      for(const row of sourceRows){const found=copied.get(key(name,row));if(!found||columns.some(c=>differs(name,c.name,row[c.name],found[c.name])))throw Error('Verificación de contenido falló: '+name);}
      console.log(name+': '+rows.length+' copiados, '+actual+' registros verificados');
    }
    await tx.commit();tx=null;console.log('Migración confirmada. Origen local conservado.');
    }
  }
}catch(e){if(tx)await tx.rollback().catch(()=>{});console.error(e.message);process.exitCode=1;}
finally{await remote.close();await closeDb();}
