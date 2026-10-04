// Owner-only: generates personal access files, then provisions explicitly approved users.
import sql from 'mssql';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
const folder=new URL('../.runtime/equipo/',import.meta.url);
const plan=new URL('accesos.json',folder);
const names=['omar','dianny','dilan','yeison'];
const mode=process.argv[2]||'plan';
if(!['plan','create','check'].includes(mode))throw Error('Usa plan, create o check');
await mkdir(folder,{recursive:true});
let accounts;
try{accounts=JSON.parse(await readFile(plan,'utf8'));}
catch(e){if(e.code!=='ENOENT')throw e;accounts=names.map(name=>({name,server:'rumbo-2026.database.windows.net',database:'BD_VIAJES',user:'rumbo_equipo_'+name,password:'Zq8!'+randomBytes(24).toString('hex')}));await writeFile(plan,JSON.stringify(accounts),{flag:'wx'});}
for(const account of accounts){
  if(!names.includes(account.name)||account.user!=='rumbo_equipo_'+account.name||!/^[A-Za-z0-9!]{24,100}$/.test(account.password))throw Error('Plan no válido');
  await mkdir(new URL(account.name+'/',folder),{recursive:true});
  await writeFile(new URL(account.name+'/.rumbo-equipo.json',folder),JSON.stringify(account,null,2));
}
if(mode==='plan'){console.log('Preparados, sin crear accesos en Azure: '+accounts.map(a=>a.user).join(', '));}
else {
  process.loadEnvFile(new URL('../.env',import.meta.url));
  const config={server:'rumbo-2026.database.windows.net',database:'BD_VIAJES',connectionTimeout:30000,requestTimeout:30000,options:{encrypt:true,trustServerCertificate:false}};
  const admin=new sql.ConnectionPool({...config,user:'rumbo-sql',password:process.env.AZURE_SQL_PASSWORD});
  try{
    if(mode==='create'){
      await admin.connect();const template=await readFile(new URL('CREAR_USUARIO_EQUIPO.sql',import.meta.url),'utf8');
      const existing=(await admin.request().query('SELECT name FROM sys.database_principals')).recordset.map(r=>r.name);
      // Refuse changes to existing users or their passwords. A partial run is verified with check.
      if(accounts.some(a=>existing.includes(a.user)))throw Error('Ya existe un usuario del plan. Usa check antes de continuar.');
      const tx=new sql.Transaction(admin);await tx.begin();
      try{for(const a of accounts)await new sql.Request(tx).batch(template.replace("N'CAMBIAR_USUARIO';",`N'${a.user}';`).replace("N'CAMBIAR_CONTRASENA';",`N'${a.password}';`));await tx.commit();}
      catch(e){await tx.rollback();throw e;}
    }
    for(const a of accounts){
      const connection=new sql.ConnectionPool({...config,user:a.user,password:a.password});
      try{
        await connection.connect();
        const result=(await connection.request().query("SELECT DB_NAME() AS databaseName,USER_NAME() AS userName,HAS_PERMS_BY_NAME(DB_NAME(),'DATABASE','ALTER') AS canAlterDatabase,(SELECT COUNT(*) FROM dbo.RumboProducts) AS products")).recordset[0];
        if(result.canAlterDatabase!==0||result.products!==100)throw Error('Permisos o catálogo inesperados');
        const tx=new sql.Transaction(connection);await tx.begin();
        try{await new sql.Request(tx).query("DECLARE @id uniqueidentifier=NEWID(); INSERT dbo.RumboVisitors(Id,TokenHash) VALUES(@id,CONVERT(varchar(64),HASHBYTES('SHA2_256',CONVERT(varchar(36),@id)),2)); INSERT dbo.RumboVisitorState(VisitorId,StateKey,DataJson) VALUES(@id,'rumbo.profile.v1',N'{\"alias\":\"Prueba equipo\",\"preference\":\"cultura\"}');");}finally{await tx.rollback();}
        console.log(a.name+': conexión, lectura y escritura correctas; sin permiso ALTER');
      }finally{await connection.close();}
    }
  }catch(e){console.error(e.message);process.exitCode=1;}finally{await admin.close();}
}
