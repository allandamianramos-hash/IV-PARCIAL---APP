import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadEnvFile } from 'node:process';
import vm from 'node:vm';
import { getDb, closeDb } from '../db.mjs';
try { loadEnvFile(new URL('../.env', import.meta.url)); } catch (e) { if(e.code!=='ENOENT') throw e; }
const command = process.argv[2] || 'check';
try {
  const {pool,sql}=await getDb();
  if(command==='check') {
    const r=await pool.request().query('SELECT DB_NAME() AS DatabaseName, SUSER_SNAME() AS LoginName');
    console.log(r.recordset[0]);
  } else if(command==='migrate') {
    const tx=new sql.Transaction(pool); await tx.begin();
    try {
      await new sql.Request(tx).query("DECLARE @lock int; EXEC @lock=sp_getapplock @Resource='RumboMigrations', @LockMode='Exclusive', @LockOwner='Transaction', @LockTimeout=10000; IF @lock<0 THROW 51000, 'Migration lock unavailable', 1; IF OBJECT_ID('dbo.RumboMigrations') IS NULL CREATE TABLE dbo.RumboMigrations (Name varchar(150) PRIMARY KEY, Checksum char(64) NOT NULL, AppliedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME());");
      for(const name of (await readdir(new URL('migrations/',import.meta.url))).filter(n=>/^\d+.*\.sql$/.test(n)).sort()) {
        const source=await readFile(new URL('migrations/'+name,import.meta.url),'utf8');
        const hash=createHash('sha256').update(source).digest('hex');
        const found=await new sql.Request(tx).input('name',sql.VarChar(150),name).query('SELECT Checksum FROM dbo.RumboMigrations WHERE Name=@name');
        if(found.recordset.length){if(found.recordset[0].Checksum!==hash)throw Error('No editar migración aplicada: '+name);continue;}
        await new sql.Request(tx).batch(source);
        await new sql.Request(tx).input('name',sql.VarChar(150),name).input('hash',sql.Char(64),hash).query('INSERT dbo.RumboMigrations(Name,Checksum) VALUES(@name,@hash)');
        console.log('Aplicada: '+name);
      }
      await tx.commit();
    } catch(e){await tx.rollback();throw e;}
  } else if(command==='seed') {
    // Trusted repository source only; never evaluate uploaded SQL or user input.
    const scope={window:{},URLSearchParams,document:{body:{classList:{contains:()=>false},dataset:{}},readyState:'loading',addEventListener(){},querySelector:()=>null}};
    vm.createContext(scope);
    for(const file of ['viajes.js','tienda.js']) vm.runInContext(await readFile(new URL('../'+file,import.meta.url),'utf8'),scope,{timeout:3000});
    const {destinations,rooms,origins,promotions}=scope.window.RumboViajesDatos;
    const options=vm.runInContext('PRODUCT_OPTIONS',scope),adjustments=vm.runInContext('OPTION_PRICE_ADJUSTMENTS',scope);
    const tx=new sql.Transaction(pool);await tx.begin();
    try {
      await new sql.Request(tx).query("DECLARE @lock int; EXEC @lock=sp_getapplock @Resource='RumboSeed',@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000; IF @lock<0 THROW 51000,'Seed lock unavailable',1;");
      for(const p of scope.window.RumboProducts) await new sql.Request(tx).input('id',sql.Int,p.id).input('name',sql.NVarChar(200),p.name).input('price',sql.Decimal(12,2),p.price).input('data',sql.NVarChar(sql.MAX),JSON.stringify(p)).input('options',sql.NVarChar(sql.MAX),JSON.stringify(options[p.id]||{})).input('adjustments',sql.NVarChar(sql.MAX),JSON.stringify(adjustments[p.id]||{})).query('IF NOT EXISTS(SELECT 1 FROM dbo.RumboProducts WHERE Id=@id) INSERT dbo.RumboProducts VALUES(@id,@name,@price,@data,@options,@adjustments)');
      for(const [i,d] of destinations.entries()) {
        const {hotels,...data}=d;
        await new sql.Request(tx).input('id',sql.VarChar(80),d.id).input('name',sql.NVarChar(200),d.name).input('price',sql.Decimal(12,2),d.economy).input('position',sql.Int,i).input('data',sql.NVarChar(sql.MAX),JSON.stringify(data)).query('IF NOT EXISTS(SELECT 1 FROM dbo.RumboDestinations WHERE Id=@id) INSERT dbo.RumboDestinations VALUES(@id,@name,@price,@position,@data)');
        for(const [j,h] of hotels.entries()) await new sql.Request(tx).input('destination',sql.VarChar(80),d.id).input('id',sql.VarChar(80),h.id).input('name',sql.NVarChar(200),h.name).input('price',sql.Decimal(12,2),h.rate).input('position',sql.Int,j).input('data',sql.NVarChar(sql.MAX),JSON.stringify(h)).query('IF NOT EXISTS(SELECT 1 FROM dbo.RumboHotels WHERE DestinationId=@destination AND Id=@id) INSERT dbo.RumboHotels VALUES(@destination,@id,@name,@price,@position,@data)');
      }
      const settings={rooms,origins,promotions,serviceRates:{transfers:{roatan:750,sps:800,sjo:950},insurance:{esencial:35,acompanado:60,amplio:95},guides:{paseo:380,paisaje:550,sabores:650}}};
      for(const [name,data]of Object.entries(settings)) await new sql.Request(tx).input('name',sql.VarChar(80),name).input('data',sql.NVarChar(sql.MAX),JSON.stringify(data)).query('IF NOT EXISTS(SELECT 1 FROM dbo.RumboSettings WHERE Name=@name) INSERT dbo.RumboSettings VALUES(@name,@data)');
      await tx.commit();console.log(`Catálogo inicial: ${scope.window.RumboProducts.length} productos, ${destinations.length} destinos. Los registros existentes se conservaron.`);
    } catch(e){await tx.rollback();throw e;}
  } else throw Error('Usa check, migrate o seed');
} catch(e){console.error('Base de datos: '+e.message);process.exitCode=1;} finally {await closeDb();}
