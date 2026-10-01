// Regenerate portable schema + public catalogue. No users, sessions or secrets are exported.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const scope={window:{},URLSearchParams,document:{body:{classList:{contains:()=>false},dataset:{}},readyState:'loading',addEventListener(){},querySelector:()=>null}};
vm.createContext(scope);
for(const name of ['viajes.js','tienda.js'])vm.runInContext(await readFile(new URL('../public/'+name,import.meta.url),'utf8'),scope,{timeout:3000});
const data=scope.window.RumboViajesDatos, products=scope.window.RumboProducts;
const options=vm.runInContext('PRODUCT_OPTIONS',scope), adjustments=vm.runInContext('OPTION_PRICE_ADJUSTMENTS',scope);
const lit=value=>"N'"+String(value).replace(/'/g,"''")+"'";
const json=value=>lit(JSON.stringify(value));
let sql=`-- Rumbo: instalación de desarrollo. No contiene usuarios ni contraseñas.\n-- Puede ejecutarse varias veces: conserva filas existentes.\nIF DB_ID(N'BD_VIAJES') IS NULL EXEC(N'CREATE DATABASE [BD_VIAJES]');\nGO\nUSE [BD_VIAJES];\nGO\nSET NOCOUNT ON;\nSET XACT_ABORT ON;\nBEGIN TRANSACTION;\nDECLARE @lock int; EXEC @lock=sp_getapplock @Resource='RumboMigrations',@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=10000; IF @lock<0 THROW 51000,'Migration lock unavailable',1;\nIF OBJECT_ID('dbo.RumboMigrations') IS NULL CREATE TABLE dbo.RumboMigrations(Name varchar(150) PRIMARY KEY,Checksum char(64) NOT NULL,AppliedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME());\n`;
for(const name of (await readdir(new URL('migrations/',import.meta.url))).filter(n=>/^\d+.*\.sql$/.test(n)).sort()){
  const source=await readFile(new URL('migrations/'+name,import.meta.url),'utf8'),hash=createHash('sha256').update(source).digest('hex');
  sql+=`IF EXISTS(SELECT 1 FROM dbo.RumboMigrations WHERE Name=${lit(name)} AND Checksum<>${lit(hash)}) THROW 51000,'Migracion modificada; revisa los archivos antes de continuar',1;\nIF NOT EXISTS(SELECT 1 FROM dbo.RumboMigrations WHERE Name=${lit(name)})\nBEGIN\n${source}\nINSERT dbo.RumboMigrations(Name,Checksum) VALUES(${lit(name)},${lit(hash)});\nEND;\n`;
}
for(const p of products)sql+=`IF NOT EXISTS(SELECT 1 FROM dbo.RumboProducts WHERE Id=${p.id}) INSERT dbo.RumboProducts VALUES(${p.id},${lit(p.name)},${p.price},${json(p)},${json(options[p.id]||{})},${json(adjustments[p.id]||{})});\n`;
for(const [i,d]of data.destinations.entries()){
  const {hotels,...rest}=d;
  sql+=`IF NOT EXISTS(SELECT 1 FROM dbo.RumboDestinations WHERE Id=${lit(d.id)}) INSERT dbo.RumboDestinations VALUES(${lit(d.id)},${lit(d.name)},${d.economy},${i},${json(rest)});\n`;
  for(const [j,h]of hotels.entries())sql+=`IF NOT EXISTS(SELECT 1 FROM dbo.RumboHotels WHERE DestinationId=${lit(d.id)} AND Id=${lit(h.id)}) INSERT dbo.RumboHotels VALUES(${lit(d.id)},${lit(h.id)},${lit(h.name)},${h.rate},${j},${json(h)});\n`;
}
const settings={rooms:data.rooms,origins:data.origins,promotions:data.promotions,serviceRates:{transfers:{roatan:750,sps:800,sjo:950},insurance:{esencial:35,acompanado:60,amplio:95},guides:{paseo:380,paisaje:550,sabores:650}}};
for(const [name,value]of Object.entries(settings))sql+=`IF NOT EXISTS(SELECT 1 FROM dbo.RumboSettings WHERE Name=${lit(name)}) INSERT dbo.RumboSettings VALUES(${lit(name)},${json(value)});\n`;
sql+='COMMIT TRANSACTION;\nGO\nSELECT DB_NAME() AS BaseDeDatos, (SELECT COUNT(*) FROM dbo.RumboProducts) AS Productos, (SELECT COUNT(*) FROM dbo.RumboDestinations) AS Destinos, (SELECT COUNT(*) FROM dbo.RumboHotels) AS Hoteles;\n';
await writeFile(new URL('INSTALAR_BD_VIAJES.sql',import.meta.url),sql,'utf8');
const start=sql.indexOf('SET NOCOUNT ON;');
const shared="-- Ejecutar UNA VEZ por el administrador, conectado directamente a BD_VIAJES.\n-- Compatible con base ya creada en Azure SQL: no crea bases ni cambia de base.\nIF DB_NAME()<>N'BD_VIAJES' THROW 51000,'Selecciona BD_VIAJES antes de ejecutar',1;\nGO\n"+sql.slice(start);
await writeFile(new URL('INSTALAR_BASE_COMPARTIDA.sql',import.meta.url),shared,'utf8');
console.log('Instalador SQL generado: estructura versionada y catálogo público.');
