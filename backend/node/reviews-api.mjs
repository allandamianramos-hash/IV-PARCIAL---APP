import {getDb,dbEnabled} from './db.mjs';
import {sessionUser} from './auth-api.mjs';
import {randomUUID} from 'node:crypto';
export const validReview=b=>!!b&&Number.isInteger(b.rating)&&b.rating>=1&&b.rating<=5&&typeof b.comment==='string'&&b.comment.trim().length>=10&&b.comment.trim().length<=1200&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(b.comment);
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
export function createReviewsApi({getDatabase=getDb,enabled=dbEnabled,userSession=sessionUser}={}){return async function(req,res){
 const url=new URL(req.url,'http://localhost');if(url.pathname!=='/api/reviews')return false;
 if(!['GET','POST','DELETE'].includes(req.method)){send(res,405,{error:'Método no permitido.'});return true;}
 if(!enabled()){send(res,503,{error:'Las reseñas no están disponibles. Inténtalo más tarde.'});return true;}
 try{
  const {pool,sql}=await getDatabase();
  if(req.method==='GET'){
   const page=Math.max(0,Math.min(100000,Number.parseInt(url.searchParams.get('page'),10)||0));
   const user=await userSession(req);
   const result=await pool.request().input('offset',sql.Int,page*6).input('ownKey',sql.VarChar(80),user?'review:'+user.Id:'').query(`SELECT COUNT(*) AS total,AVG(TRY_CAST(JSON_VALUE(DataJson,'$.rating') AS float)) AS average,MAX(CASE WHEN Name=@ownKey OR Name LIKE @ownKey+':%' THEN 1 ELSE 0 END) AS hasOwnReview FROM dbo.RumboSettings WHERE Name LIKE 'review:%'; SELECT Name AS id,CASE WHEN Name=@ownKey OR Name LIKE @ownKey+':%' THEN 1 ELSE 0 END AS isOwn,JSON_VALUE(DataJson,'$.name') AS name,TRY_CAST(JSON_VALUE(DataJson,'$.rating') AS int) AS rating,JSON_VALUE(DataJson,'$.comment') AS comment,JSON_VALUE(DataJson,'$.date') AS date FROM dbo.RumboSettings WHERE Name LIKE 'review:%' ORDER BY JSON_VALUE(DataJson,'$.date') DESC,Name OFFSET @offset ROWS FETCH NEXT 6 ROWS ONLY;`);
   const aggregate=result.recordsets[0][0];
   send(res,200,{...aggregate,hasOwnReview:aggregate.hasOwnReview===1,reviews:result.recordsets[1].map(review=>({...review,isOwn:review.isOwn===1})),page});return true;
  }
  const origin=process.env.APP_ORIGIN||`http://${req.headers.host}`;
  if(req.headers.origin!==origin||req.headers['sec-fetch-site']==='cross-site'){send(res,403,{error:'Origen no permitido.'});return true;}
  const user=await userSession(req);if(!user){send(res,401,{error:req.method==='DELETE'?'Inicia sesión para eliminar tu reseña.':'Inicia sesión para publicar tu reseña.'});return true;}
  if(req.method==='DELETE'){
   const id=url.searchParams.get('id');
   if(!id||id.length>80||!/^review:[a-zA-Z0-9:-]+$/.test(id)){send(res,400,{error:'Selecciona la reseña que quieres eliminar.'});return true;}
   // Select one review, but always authorize its owner from the session (including legacy keys).
   const result=await pool.request().input('key',sql.VarChar(80),id).input('ownKey',sql.VarChar(80),'review:'+user.Id).query("DELETE FROM dbo.RumboSettings OUTPUT DELETED.Name WHERE Name=@key AND (Name=@ownKey OR Name LIKE @ownKey+':%')");
   if(!result.recordset.length){send(res,404,{error:'No se encontró esa reseña en tu cuenta.'});return true;}
   send(res,200,{deleted:true});return true;
  }
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')){send(res,415,{error:'Se requiere JSON.'});return true;}
  let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>8000){send(res,413,{error:'La reseña es demasiado larga.'});return true;}chunks.push(chunk);}
  let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{send(res,400,{error:'Datos inválidos.'});return true;}
  if(!validReview(body)){send(res,400,{error:'Elige de 1 a 5 estrellas y escribe entre 10 y 1200 caracteres.'});return true;}
  // Each publication has its own key so deleting one never affects another.
  const review={name:user.FullName.trim().split(/\s+/)[0],rating:body.rating,comment:body.comment.trim(),date:new Date().toISOString()};
  const id='review:'+user.Id+':'+randomUUID();
  await pool.request().input('key',sql.VarChar(80),id).input('data',sql.NVarChar(sql.MAX),JSON.stringify(review)).query('INSERT dbo.RumboSettings(Name,DataJson) VALUES(@key,@data)');
  send(res,200,{saved:true,id});
 }catch{send(res,503,{error:req.method==='DELETE'?'No se pudo eliminar tu reseña. Inténtalo de nuevo.':'No se pudo conectar con las reseñas. Tu texto sigue aquí; puedes reintentar.'});}
 return true;
}; }
export const reviewsApi=createReviewsApi();
