// Add this release's destinations only. Never overwrite shared catalogue data.
import {readFile} from 'node:fs/promises';
import {loadEnvFile} from 'node:process';
import vm from 'node:vm';
import {getDb,closeDb} from '../backend/node/db.mjs';
try{loadEnvFile(new URL('../.env',import.meta.url));}catch(error){if(error.code!=='ENOENT')throw error;}
try{
  const source=await readFile(new URL('../public/js/destinos/viajes.js',import.meta.url),'utf8');
  const context={window:{}};
  vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),context);
  const cities=JSON.parse(await readFile(new URL(process.argv.includes('--catalogo-100')?'../docs/catalogo-100/ciudades.json':'../docs/nuevos-destinos-contenido.json',import.meta.url),'utf8'));
  const ids=new Set(cities.map(d=>d.id));
  if(ids.size!==30)throw Error('La ampliación debe contener exactamente 30 destinos.');
  const destinations=context.window.RumboViajesDatos.destinations;
  const selected=destinations.filter(d=>ids.has(d.id));
  if(selected.length!==30||selected.some(d=>d.hotels.length!==5))throw Error('Catálogo incompleto.');
  const {pool,sql}=await getDb();
  const tx=new sql.Transaction(pool);await tx.begin();
  try{
    await new sql.Request(tx).query("DECLARE @lock int; EXEC @lock=sp_getapplock @Resource='RumboSeed',@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000; IF @lock<0 THROW 51000,'Seed lock unavailable',1;");
    let insertedDestinations=0,insertedHotels=0;
    for(const d of selected){
      const {hotels,...data}=d;
      const result=await new sql.Request(tx)
        .input('id',sql.VarChar(80),d.id).input('name',sql.NVarChar(200),d.name)
        .input('price',sql.Decimal(12,2),d.economy).input('position',sql.Int,destinations.indexOf(d))
        .input('data',sql.NVarChar(sql.MAX),JSON.stringify(data))
        .query('IF NOT EXISTS(SELECT 1 FROM dbo.RumboDestinations WHERE Id=@id) INSERT dbo.RumboDestinations VALUES(@id,@name,@price,@position,@data)');
      insertedDestinations+=result.rowsAffected.reduce((sum,n)=>sum+n,0);
      for(const [index,h]of hotels.entries()){
        const result=await new sql.Request(tx)
          .input('destination',sql.VarChar(80),d.id).input('id',sql.VarChar(80),h.id)
          .input('name',sql.NVarChar(200),h.name).input('price',sql.Decimal(12,2),h.rate)
          .input('position',sql.Int,index).input('data',sql.NVarChar(sql.MAX),JSON.stringify(h))
          .query('IF NOT EXISTS(SELECT 1 FROM dbo.RumboHotels WHERE DestinationId=@destination AND Id=@id) INSERT dbo.RumboHotels VALUES(@destination,@id,@name,@price,@position,@data)');
        insertedHotels+=result.rowsAffected.reduce((sum,n)=>sum+n,0);
      }
    }
    await tx.commit();
    console.log(`Añadidos ${insertedDestinations} destinos y ${insertedHotels} hospedajes. Los registros existentes se conservaron.`);
  }catch(error){await tx.rollback().catch(()=>{});throw error;}
}catch(error){console.error('Ampliación de destinos: '+error.message);process.exitCode=1;}
finally{await closeDb();}
