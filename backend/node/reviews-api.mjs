import {getDb,dbEnabled} from './db.mjs';
import {sessionUser} from './auth-api.mjs';
export const validReview=b=>!!b&&Number.isInteger(b.rating)&&b.rating>=1&&b.rating<=5&&typeof b.comment==='string'&&b.comment.trim().length>=10&&b.comment.trim().length<=1200&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(b.comment);
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
export function createReviewsApi({getDatabase=getDb,enabled=dbEnabled,userSession=sessionUser}={}){return async function(req,res){
 const url=new URL(req.url,'http://localhost');if(url.pathname!=='/api/reviews')return false;
 if(!['GET','POST'].includes(req.method)){send(res,405,{error:'Método no permitido.'});return true;}
 if(!enabled()){send(res,503,{error:'Las reseñas no están disponibles. Inténtalo más tarde.'});return true;}
 try{
  const {pool,sql}=await getDatabase();
  if(req.method==='GET'){
   const page=Math.max(0,Math.min(100000,Number.parseInt(url.searchParams.get('page'),10)||0));
   const result=await pool.request().input('offset',sql.Int,page*6).query(`SELECT COUNT(*) AS total,AVG(TRY_CAST(JSON_VALUE(DataJson,'$.rating') AS float)) AS average FROM dbo.RumboSettings WHERE Name LIKE 'review:%'; SELECT JSON_VALUE(DataJson,'$.name') AS name,TRY_CAST(JSON_VALUE(DataJson,'$.rating') AS int) AS rating,JSON_VALUE(DataJson,'$.comment') AS comment,JSON_VALUE(DataJson,'$.date') AS date FROM dbo.RumboSettings WHERE Name LIKE 'review:%' ORDER BY JSON_VALUE(DataJson,'$.date') DESC,Name OFFSET @offset ROWS FETCH NEXT 6 ROWS ONLY;`);
   send(res,200,{...result.recordsets[0][0],reviews:result.recordsets[1],page});return true;
  }
  const origin=process.env.APP_ORIGIN||`http://${req.headers.host}`;
  if(req.headers.origin!==origin||req.headers['sec-fetch-site']==='cross-site'){send(res,403,{error:'Origen no permitido.'});return true;}
  const user=await userSession(req);if(!user){send(res,401,{error:'Inicia sesión para publicar tu reseña.'});return true;}
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')){send(res,415,{error:'Se requiere JSON.'});return true;}
  let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>8000){send(res,413,{error:'La reseña es demasiado larga.'});return true;}chunks.push(chunk);}
  let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{send(res,400,{error:'Datos inválidos.'});return true;}
  if(!validReview(body)){send(res,400,{error:'Elige de 1 a 5 estrellas y escribe entre 10 y 1200 caracteres.'});return true;}
  // One public review per account; concurrent submissions cannot create duplicates.
  const review={name:user.FullName.trim().split(/\s+/)[0],rating:body.rating,comment:body.comment.trim(),date:new Date().toISOString()};
  await pool.request().input('key',sql.VarChar(80),'review:'+user.Id).input('data',sql.NVarChar(sql.MAX),JSON.stringify(review)).query(`SET XACT_ABORT ON; BEGIN TRANSACTION;
   IF EXISTS(SELECT 1 FROM dbo.RumboSettings WITH(UPDLOCK,HOLDLOCK) WHERE Name=@key)
    UPDATE dbo.RumboSettings SET DataJson=@data WHERE Name=@key;
   ELSE INSERT dbo.RumboSettings(Name,DataJson) VALUES(@key,@data);
   COMMIT;`);
  send(res,200,{saved:true});
 }catch{send(res,503,{error:'No se pudo conectar con las reseñas. Tu texto sigue aquí; puedes reintentar.'});}
 return true;
}; }
export const reviewsApi=createReviewsApi();
