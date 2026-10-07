import { randomBytes, createHash } from 'node:crypto';
import { getDb, dbEnabled } from './db.mjs';
import { sessionUser, publicUser, appendCookie } from './auth-api.mjs';

export const stateKeys = ['rumbo.store.cart.v2','rumbo.store.favorites.v2','rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.profile.v1','rumbo.checkout.v1','rumbo.no-flight.v1','rumbo.departureChecklist.v1'];
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const text=(v,max)=>typeof v==='string'&&v.length<=max;
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
export function validState(key,v) {
  if(!stateKeys.includes(key))return false;
  if(v===null)return true;
  if(JSON.stringify(v).length>24000)return false;
  switch(key){
    case 'rumbo.store.cart.v2': return Array.isArray(v)&&v.length<=100&&v.every(r=>object(r)&&integer(r.id,1,1000000)&&integer(r.quantity,1,99)&&object(r.options)&&Object.entries(r.options).length<=10&&Object.entries(r.options).every(([k,x])=>text(k,80)&&text(x,100)));
    case 'rumbo.store.favorites.v2': return Array.isArray(v)&&v.length<=500&&v.every(x=>integer(x,1,1000000));
    case 'rumbo.profile.v1': return object(v)&&Object.keys(v).every(k=>['alias','preference'].includes(k))&&text(v.alias,40)&&v.alias.trim().length>0&&['playa','naturaleza','cultura'].includes(v.preference);
    case 'rumbo.departureChecklist.v1': return Array.isArray(v)&&v.length<=30&&v.every(x=>text(x,100));
    case 'rumbo.no-flight.v1': return text(v,250);
    case 'rumbo.checkout.v1': return object(v)&&v.demo===true&&text(v.signature,18000)&&text(v.code,80)&&text(v.date,40)&&Object.keys(v).every(k=>['demo','signature','code','date'].includes(k));
    case 'rumbo.services.v1': return Array.isArray(v)&&v.length<=3&&new Set(v.map(x=>x?.section)).size===v.length&&v.every(s=>object(s)&&['traslados','seguros','guias'].includes(s.section)&&text(s.title,200)&&text(s.detail,1000)&&Number.isFinite(s.total)&&s.total>=0&&s.total<=1e9&&object(s.values)&&Object.values(s.values).every(x=>text(x,200)));
    case 'rumbo.integrante2.viaje.v1': {
      const ranges={travelers:[1,12],nights:[1,30],rooms:[1,6]};
      return object(v)&&Object.entries(v).every(([k,x])=>{
        if(['destinationId','origin','date','checkIn','cabin','flightId','hotelId','roomType'].includes(k))return text(x,100);
        return Object.hasOwn(ranges,k)&&integer(x,...ranges[k]);
      });
    }
    default:return false;
  }
}
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
const tokenHash=token=>createHash('sha256').update(token).digest('hex');
export function readToken(req){return /(?:^|;\s*)rumbo_visitor=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie||'')?.[1];}
async function visitor(req,res,create=false) {
  const user=await sessionUser(req);
  if(user)return user.VisitorId;
  const {pool,sql}=await getDb();
  let token=readToken(req);
  if(token){const r=await pool.request().input('hash',sql.Char(64),tokenHash(token)).query('SELECT Id FROM dbo.RumboVisitors v WHERE TokenHash=@hash AND NOT EXISTS(SELECT 1 FROM dbo.RumboUsers u WHERE u.VisitorId=v.Id)');if(r.recordset.length)return r.recordset[0].Id;}
  if(!create)return null;
  token=randomBytes(32).toString('hex');
  const r=await pool.request().input('hash',sql.Char(64),tokenHash(token)).query('INSERT dbo.RumboVisitors(TokenHash) OUTPUT INSERTED.Id VALUES(@hash)');
  appendCookie(res,`rumbo_visitor=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${process.env.APP_ORIGIN?.startsWith('https://')?'; Secure':''}`);
  return r.recordset[0].Id;
}
export async function loadCatalog(){
  const {pool}=await getDb();
  const r=await pool.request().query('SELECT * FROM dbo.RumboProducts ORDER BY Id; SELECT * FROM dbo.RumboDestinations ORDER BY SortOrder; SELECT * FROM dbo.RumboHotels ORDER BY SortOrder; SELECT * FROM dbo.RumboSettings WHERE Name NOT LIKE \'review:%\';');
  const [products,destinations,hotels,settings]=r.recordsets;
  if(!products.length||!destinations.length)throw Error('DB_NOT_SEEDED');
  const config=Object.fromEntries(settings.map(s=>[s.Name,JSON.parse(s.DataJson)]));
  return {...config,products:products.map(p=>({...JSON.parse(p.DataJson),id:p.Id,name:p.Name,price:p.Price})),productOptions:Object.fromEntries(products.map(p=>[p.Id,JSON.parse(p.OptionsJson)])),priceAdjustments:Object.fromEntries(products.map(p=>[p.Id,JSON.parse(p.AdjustmentsJson)])),destinations:destinations.map(d=>({...JSON.parse(d.DataJson),id:d.Id,name:d.Name,economy:d.Economy,hotels:hotels.filter(h=>h.DestinationId===d.Id).map(h=>({...JSON.parse(h.DataJson),id:h.Id,name:h.Name,rate:h.Rate}))}))};
}
async function readState(id){
  const {pool,sql}=await getDb();
  const r=await pool.request().input('id',sql.UniqueIdentifier,id).query('SELECT StateKey,DataJson,Revision FROM dbo.RumboVisitorState WHERE VisitorId=@id');
  return Object.fromEntries(r.recordset.map(x=>[x.StateKey,{value:JSON.parse(x.DataJson),revision:x.Revision}]));
}
export async function bootstrap(req,res){
  if(!dbEnabled())return {connected:false,reason:'disabled'};
  try{
    const catalog=await loadCatalog(),id=await visitor(req,res,true);
    return {connected:true,visitor:id,user:publicUser(await sessionUser(req)),catalog,state:await readState(id)};
  }catch{return {connected:false,reason:'unavailable'};}
}
export const safeJson=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
export async function databaseApi(req,res){
  const path=new URL(req.url,'http://localhost').pathname;
  if(!['/api/database','/api/catalog','/api/state'].includes(path))return false;
  if(!dbEnabled()){json(res,503,{error:'El guardado en el servidor no está configurado.'});return true;}
  try{
    if(path==='/api/database'&&req.method==='GET'){
      const {pool}=await getDb();await pool.request().query('SELECT TOP (1) Name FROM dbo.RumboMigrations');json(res,200,{connected:true});return true;
    }
    if(path==='/api/catalog'&&req.method==='GET'){json(res,200,await loadCatalog());return true;}
    if(path==='/api/state'&&req.method==='GET'){
      const id=await visitor(req,res);if(!id){json(res,401,{error:'Abre una página de Rumbo para iniciar tu sesión de visitante.'});return true;}
      json(res,200,{visitor:id,state:await readState(id)});return true;
    }
    if(path!=='/api/state'||req.method!=='PUT'){json(res,405,{error:'Método no permitido.'});return true;}
    const origin=process.env.APP_ORIGIN||`http://${req.headers.host}`;
    if(req.headers.origin!==origin||req.headers['sec-fetch-site']==='cross-site'){json(res,403,{error:'Origen no permitido.'});return true;}
    if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')){json(res,415,{error:'Se requiere JSON.'});return true;}
    const chunks=[];let size=0;
    for await(const chunk of req){size+=chunk.length;if(size>60000){json(res,413,{error:'La selección es demasiado grande.'});return true;}chunks.push(chunk);}
    let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{json(res,400,{error:'JSON inválido.'});return true;}
    if(!object(body)||!object(body.changes)||!Object.keys(body.changes).length||Object.keys(body.changes).length>stateKeys.length||!Object.entries(body.changes).every(([k,v])=>object(v)&&integer(v.revision,0,2147483646)&&validState(k,v.value))){json(res,400,{error:'Selección inválida.'});return true;}
    const id=await visitor(req,res);if(!id){json(res,401,{error:'La sesión de visitante ha cambiado. Recarga la página.'});return true;}
    if(req.headers['x-rumbo-visitor']!==id){json(res,409,{error:'La cuenta ha cambiado. Recarga la página antes de guardar.'});return true;}
    const {pool,sql}=await getDb(),tx=new sql.Transaction(pool);await tx.begin();
    try{
      // Serialize per visitor; revision checks prevent silent lost updates in other tabs.
      await new sql.Request(tx).input('id',sql.UniqueIdentifier,id).query('SELECT Id FROM dbo.RumboVisitors WITH(UPDLOCK,HOLDLOCK) WHERE Id=@id');
      const rows=await new sql.Request(tx).input('id',sql.UniqueIdentifier,id).query('SELECT StateKey,Revision FROM dbo.RumboVisitorState WHERE VisitorId=@id');
      const revisions=Object.fromEntries(rows.recordset.map(r=>[r.StateKey,r.Revision]));
      if(Object.entries(body.changes).some(([k,v])=>v.revision!==(revisions[k]||0))){await tx.rollback();json(res,409,{error:'Hay cambios más recientes en otra pestaña. Recarga para revisarlos.'});return true;}
      const saved={};
      for(const [key,{value,revision}]of Object.entries(body.changes)){
        await new sql.Request(tx).input('id',sql.UniqueIdentifier,id).input('key',sql.VarChar(60),key).input('data',sql.NVarChar(sql.MAX),JSON.stringify(value)).query('UPDATE dbo.RumboVisitorState SET DataJson=@data,Revision=Revision+1,UpdatedAt=SYSUTCDATETIME() WHERE VisitorId=@id AND StateKey=@key; IF @@ROWCOUNT=0 INSERT dbo.RumboVisitorState(VisitorId,StateKey,DataJson) VALUES(@id,@key,@data);');
        saved[key]=revision+1;
      }
      await tx.commit();json(res,200,{revisions:saved});
    }catch(e){await tx.rollback();throw e;}
  }catch{json(res,503,{error:'No se pudo guardar en el servidor. Tus cambios locales siguen disponibles.'});}
  return true;
}
