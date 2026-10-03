// One-time connection setup. Never prints credentials or changes an existing user's password.
import sql from 'mssql';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
const envUrl=new URL('../.env',import.meta.url);
process.loadEnvFile(envUrl);
if(!process.env.AZURE_SQL_PASSWORD)throw Error('Falta AZURE_SQL_PASSWORD');
const server='rumbo-2026.database.windows.net',database='BD_VIAJES',user='rumbo_app_jimmy';
const password='Qz7!'+randomBytes(24).toString('hex');
const config={server,database,connectionTimeout:30000,requestTimeout:30000,options:{encrypt:true,trustServerCertificate:false}};
const admin=new sql.ConnectionPool({...config,user:'rumbo-sql',password:process.env.AZURE_SQL_PASSWORD});
let app;
try{
  await admin.connect();
  const script=(await readFile(new URL('CREAR_USUARIO_EQUIPO.sql',import.meta.url),'utf8'));
  // Replace only the declarations; the placeholder validation must stay unchanged.
  await admin.request().batch(script.replace("N'CAMBIAR_USUARIO';",`N'${user}';`).replace("N'CAMBIAR_CONTRASENA';",`N'${password}';`));
  // Preserve credentials for recovery if the subsequent verification is interrupted.
  const folder=new URL('../.runtime/',import.meta.url);await mkdir(folder,{recursive:true});
  await writeFile(new URL('azure-app-credentials.json',folder),JSON.stringify({server,database,user,password}),{flag:'wx'});
  app=new sql.ConnectionPool({...config,user,password});await app.connect();
  const tx=new sql.Transaction(app);await tx.begin();
  try{
    await new sql.Request(tx).query("DECLARE @id uniqueidentifier=NEWID(); INSERT dbo.RumboVisitors(Id,TokenHash) VALUES(@id,CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(36),@id)),2)); INSERT dbo.RumboVisitorState(VisitorId,StateKey,DataJson) VALUES(@id,'rumbo.profile.v1',N'{\"alias\":\"Prueba Azure\",\"preference\":\"cultura\"}'); SELECT TOP(1) Name FROM dbo.RumboMigrations;");
  }finally{await tx.rollback();}
  const old=await readFile(envUrl,'utf8');
  await writeFile(new URL(`env-before-azure-${Date.now()}.txt`,folder),old,{flag:'wx'});
  const values={DB_ENABLED:'true',DB_SERVER:server,DB_NAME:database,DB_AUTH:'sql',DB_USER:user,DB_PASSWORD:password,DB_PORT:'1433',DB_TRUST_CERTIFICATE:'false',DB_SETUP_MODE:'check'};
  let updated=old.replace(/^# SQL Server local.*$/m,'# Azure SQL - conexión cifrada para Rumbo').replace(/^DB_ODBC_DRIVER=.*\r?\n/m,'');
  for(const [key,value]of Object.entries(values)){
    const re=new RegExp('^'+key+'=.*$','m');
    updated=re.test(updated)?updated.replace(re,()=>key+'='+value):updated.trimEnd()+'\n'+key+'='+value+'\n';
  }
  await writeFile(envUrl,updated);
  console.log('Aplicación configurada para Azure con usuario limitado '+user+'. Lectura y escritura verificadas; prueba revertida.');
}catch(e){console.error(e.message);process.exitCode=1;}
finally{if(app)await app.close();await admin.close();}
