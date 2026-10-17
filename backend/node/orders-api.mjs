import {randomUUID} from 'node:crypto';
import {getDb,dbEnabled} from './db.mjs';
import {sessionUser} from './auth-api.mjs';
import {loadCatalog} from './database-api.mjs';
import {checkoutQuote,CheckoutError} from './checkout-quote.mjs';
const reply=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
const decode=row=>({...JSON.parse(row.DataJson),id:String(row.Id)});
export async function ordersApi(req,res){
  const url=new URL(req.url,'http://localhost');if(!['/api/orders','/api/checkout'].includes(url.pathname))return false;
  try{
    if(!dbEnabled())throw new CheckoutError('El historial no está disponible.',503);
    if(url.pathname==='/api/orders'?req.method!=='GET':!['GET','POST'].includes(req.method))throw new CheckoutError('Método no permitido.',405);
    if(req.method==='POST'&&(req.headers.origin!==(process.env.APP_ORIGIN||`http://${req.headers.host}`)||req.headers['sec-fetch-site']==='cross-site'))throw new CheckoutError('Origen no permitido.',403);
    const user=await sessionUser(req);if(!user)throw new CheckoutError('Inicia sesión para guardar tus compras.',401);
    const {pool,sql}=await getDb();
    if(url.pathname==='/api/orders'){
      const kind=url.searchParams.get('kind')||'all',before=url.searchParams.get('before')||'9223372036854775807';
      if(!['all','trip','store'].includes(kind)||!/^\d{1,19}$/.test(before)||BigInt(before)>9223372036854775807n)throw new CheckoutError('Filtro inválido.');
      const rows=(await pool.request().input('user',sql.UniqueIdentifier,user.Id).input('kind',sql.VarChar(10),kind).input('before',sql.BigInt,before).query("SELECT TOP(21) Id,DataJson FROM dbo.RumboOrders WHERE UserId=@user AND Id<@before AND (@kind='all' OR Kind=@kind) ORDER BY Id DESC")).recordset;
      reply(res,200,{orders:rows.slice(0,20).map(decode),next:rows.length>20?String(rows[19].Id):null});return true;
    }
    let body,kind=url.searchParams.get('kind');
    if(req.method==='POST'){
      if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw new CheckoutError('Se requiere JSON.',415);
      const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1500)throw new CheckoutError('Solicitud demasiado grande.',413);chunks.push(chunk);}
      try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new CheckoutError('Solicitud inválida.');}
      if(!body||Object.keys(body).some(k=>!['kind','fingerprint'].includes(k))||!['trip','store'].includes(body.kind)||!/^([a-f0-9]{64})$/.test(body.fingerprint))throw new CheckoutError('Solicitud inválida.');
      kind=body.kind;
    }
    if(!['trip','store'].includes(kind))throw new CheckoutError('Tipo de compra inválido.');
    const catalog=await loadCatalog(),tx=new sql.Transaction(pool);await tx.begin();
    try{
      await new sql.Request(tx).input('owner',sql.UniqueIdentifier,user.VisitorId).query('SELECT Id FROM dbo.RumboVisitors WITH(UPDLOCK,HOLDLOCK) WHERE Id=@owner');
      if(body){
        const previous=(await new sql.Request(tx).input('user',sql.UniqueIdentifier,user.Id).input('kind',sql.VarChar(10),kind).input('fingerprint',sql.Char(64),body.fingerprint).query('SELECT Id,DataJson FROM dbo.RumboOrders WHERE UserId=@user AND Kind=@kind AND Fingerprint=@fingerprint')).recordset[0];
        if(previous){await tx.commit();reply(res,200,{order:decode(previous)});return true;}
      }
      const rows=(await new sql.Request(tx).input('owner',sql.UniqueIdentifier,user.VisitorId).query('SELECT StateKey,DataJson,Revision FROM dbo.RumboVisitorState WHERE VisitorId=@owner')).recordset;
      const state=Object.fromEntries(rows.map(r=>[r.StateKey,{value:JSON.parse(r.DataJson),revision:r.Revision}]));
      const quote=checkoutQuote(kind,state,catalog);
      if(!body){await tx.commit();reply(res,200,{quote});return true;}
      if(body.fingerprint!==quote.fingerprint)throw new CheckoutError('Tu selección ha cambiado. Cierra y vuelve a revisar el pago.',409);
      const order={...quote,code:'RMB-DEMO-'+randomUUID().toUpperCase(),date:new Date().toISOString(),status:'simulated',policyVersion:'2026-10-17'};
      const saved=(await new sql.Request(tx).input('user',sql.UniqueIdentifier,user.Id).input('kind',sql.VarChar(10),kind).input('fingerprint',sql.Char(64),quote.fingerprint).input('data',sql.NVarChar(sql.MAX),JSON.stringify(order)).query('INSERT dbo.RumboOrders(UserId,Kind,Fingerprint,DataJson) OUTPUT INSERTED.Id VALUES(@user,@kind,@fingerprint,@data)')).recordset[0];
      await tx.commit();reply(res,201,{order:{...order,id:String(saved.Id)}});
    }catch(error){await tx.rollback().catch(()=>{});throw error;}
  }catch(error){reply(res,error.status||503,{error:error instanceof CheckoutError?error.message:'No se pudo completar la operación. Inténtalo de nuevo.'});}
  return true;
}
