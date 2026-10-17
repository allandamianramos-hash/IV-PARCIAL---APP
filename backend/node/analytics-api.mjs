import {getDb} from './db.mjs';
import {siteConfig,analyticsPages} from './site-config.mjs';
const attempts=new Map();
export async function analyticsApi(req,res){
  const path=new URL(req.url,'http://localhost').pathname;
  if(!['/api/site-config','/api/analytics'].includes(path))return false;
  const reply=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  if(path==='/api/site-config'){reply(req.method==='GET'?200:405,req.method==='GET'?siteConfig:{error:'Método no permitido.'});return true;}
  if(req.method!=='POST'){reply(405,{error:'Método no permitido.'});return true;}
  if(!siteConfig.analyticsEnabled){reply(204);return true;}
  if(req.headers.origin!==(process.env.APP_ORIGIN||`http://${req.headers.host}`)||req.headers['sec-fetch-site']==='cross-site'){reply(403,{error:'Origen no permitido.'});return true;}
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')){reply(415,{error:'Se requiere JSON.'});return true;}
  const now=Date.now();for(const [key,value] of attempts)if(now-value.at>60000)attempts.delete(key);
  const ip=req.socket.remoteAddress,limit=attempts.get(ip)||{at:now,count:0};
  if(attempts.size>5000||++limit.count>120){reply(429,{error:'Demasiadas solicitudes.'});return true;}attempts.set(ip,limit);
  try{
    let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>500){reply(413,{error:'Solicitud demasiado grande.'});return true;}}
    let body;try{body=JSON.parse(raw);}catch{reply(400,{error:'Datos inválidos.'});return true;}
    if(body?.consent!==true||!analyticsPages.includes(body?.page)||Object.keys(body).some(k=>!['page','consent'].includes(k))){reply(400,{error:'Datos inválidos.'});return true;}
    const {pool,sql}=await getDb();await pool.request().input('page',sql.VarChar(60),body.page).query("SET XACT_ABORT ON; BEGIN TRAN; UPDATE dbo.RumboPageViews WITH(UPDLOCK,SERIALIZABLE) SET Views=Views+1 WHERE ViewDate=CAST(SYSUTCDATETIME() AS date) AND Page=@page; IF @@ROWCOUNT=0 INSERT dbo.RumboPageViews(ViewDate,Page,Views) VALUES(CAST(SYSUTCDATETIME() AS date),@page,1); DELETE FROM dbo.RumboPageViews WHERE ViewDate<DATEADD(day,-90,CAST(SYSUTCDATETIME() AS date)); COMMIT;");
    reply(204);
  }catch{reply(503,{error:'Analítica no disponible.'});}
  return true;
}
