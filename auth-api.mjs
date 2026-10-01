import { randomBytes, createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { getDb, dbEnabled } from './db.mjs';
const derive=promisify(scrypt), lifetime=30*24*60*60;
const hash=v=>createHash('sha256').update(v).digest('hex');
const token=req=>/(?:^|;\s*)rumbo_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie||'')?.[1];
const reply=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
export function appendCookie(res,value){const old=res.getHeader('Set-Cookie');res.setHeader('Set-Cookie',[...(Array.isArray(old)?old:old?[old]:[]),value]);}
function cookie(res,name,value,age){appendCookie(res,`${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${process.env.APP_ORIGIN?.startsWith('https://')?'; Secure':''}`);}
export async function passwordHash(password){const salt=randomBytes(16).toString('hex');return `scrypt:${salt}:${(await derive(password,salt,64)).toString('hex')}`;}
export async function passwordMatches(password,encoded){
  const [,salt,digest]=/^scrypt:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(encoded||'')||[];
  const actual=await derive(password,salt||'00000000000000000000000000000000',64);
  return !!digest&&timingSafeEqual(actual,Buffer.from(digest,'hex'));
}
export function validCredentials(body,register=false){
  if(!body||typeof body!=='object'||Array.isArray(body))return false;
  if(typeof body.email!=='string'||body.email.trim().length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))return false;
  if(typeof body.password!=='string'||body.password.length<1||body.password.length>128)return false;
  return !register||(body.password.length>=8&&typeof body.name==='string'&&body.name.trim().length>=2&&body.name.trim().length<=120&&!/[\u0000-\u001f\u007f]/.test(body.name));
}
export async function sessionUser(req){
  if(Object.hasOwn(req,'rumboUser'))return req.rumboUser;
  req.rumboUser=null;
  if(!dbEnabled()||!token(req))return null;
  const {pool,sql}=await getDb();
  const r=await pool.request().input('hash',sql.Char(64),hash(token(req))).query('SELECT u.Id,u.FullName,u.Email,u.VisitorId FROM dbo.RumboSessions s JOIN dbo.RumboUsers u ON u.Id=s.UserId WHERE s.TokenHash=@hash AND s.ExpiresAt>SYSUTCDATETIME()');
  return req.rumboUser=r.recordset[0]||null;
}
export const publicUser=u=>u?{id:u.Id,name:u.FullName,email:u.Email}:null;
const attempts=new Map();
function limited(req){
  const now=Date.now(),ip=req.socket.remoteAddress;
  for(const [key,value]of attempts)if(value.until<=now)attempts.delete(key);
  if(!attempts.has(ip)){if(attempts.size>=5000)return true;attempts.set(ip,{count:0,until:now+15*60*1000});}
  return ++attempts.get(ip).count>20;
}
async function startSession(res,userId){
  const {pool,sql}=await getDb(),secret=randomBytes(32).toString('hex');
  await pool.request().input('hash',sql.Char(64),hash(secret)).input('id',sql.UniqueIdentifier,userId).query('DELETE FROM dbo.RumboSessions WHERE ExpiresAt<=SYSUTCDATETIME(); INSERT dbo.RumboSessions(TokenHash,UserId,ExpiresAt) VALUES(@hash,@id,DATEADD(day,30,SYSUTCDATETIME()));');
  cookie(res,'rumbo_session',secret,lifetime);
  cookie(res,'rumbo_visitor','',0);
}
export async function authApi(req,res){
  const path=new URL(req.url,'http://localhost').pathname;
  if(!path.startsWith('/api/auth/'))return false;
  if(!['/api/auth/me','/api/auth/register','/api/auth/login','/api/auth/logout'].includes(path)){reply(res,404,{error:'Ruta no encontrada.'});return true;}
  if((path==='/api/auth/me'&&req.method!=='GET')||(path!=='/api/auth/me'&&req.method!=='POST')){reply(res,405,{error:'Método no permitido.'});return true;}
  if(!dbEnabled()){reply(res,503,{error:'El servicio de cuentas no está disponible. Inténtalo más tarde.'});return true;}
  try{
    if(path==='/api/auth/me'){reply(res,200,{user:publicUser(await sessionUser(req))});return true;}
    const origin=process.env.APP_ORIGIN||`http://${req.headers.host}`;
    if(req.headers.origin!==origin||req.headers['sec-fetch-site']==='cross-site'){reply(res,403,{error:'Origen no permitido.'});return true;}
    if(path==='/api/auth/logout'){
      if(token(req)){const {pool,sql}=await getDb();await pool.request().input('hash',sql.Char(64),hash(token(req))).query('DELETE dbo.RumboSessions WHERE TokenHash=@hash');}
      cookie(res,'rumbo_session','',0);cookie(res,'rumbo_visitor','',0);reply(res,200,{user:null});return true;
    }
    if(limited(req)){res.setHeader('Retry-After','900');reply(res,429,{error:'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.'});return true;}
    if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')){reply(res,415,{error:'Formato no permitido.'});return true;}
    let size=0;const chunks=[];
    for await(const part of req){size+=part.length;if(size>4096){reply(res,413,{error:'Los datos son demasiado largos.'});return true;}chunks.push(part);}
    let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{reply(res,400,{error:'Datos inválidos.'});return true;}
    const register=path.endsWith('/register');
    if(!validCredentials(body,register)){reply(res,400,{error:register?'Revisa tu nombre, correo y contraseña (entre 8 y 128 caracteres).':'Introduce un correo válido y tu contraseña.'});return true;}
    const email=body.email.trim().toLowerCase(),{pool,sql}=await getDb();
    let user;
    if(register){
      const encoded=await passwordHash(body.password),tx=new sql.Transaction(pool);await tx.begin();
      try{
        const v=await new sql.Request(tx).input('hash',sql.Char(64),hash(randomBytes(32))).query('INSERT dbo.RumboVisitors(TokenHash) OUTPUT INSERTED.Id VALUES(@hash)');
        const r=await new sql.Request(tx).input('name',sql.NVarChar(120),body.name.trim()).input('email',sql.NVarChar(254),email).input('password',sql.VarChar(200),encoded).input('visitor',sql.UniqueIdentifier,v.recordset[0].Id).query('INSERT dbo.RumboUsers(FullName,Email,PasswordHash,VisitorId) OUTPUT INSERTED.Id,INSERTED.FullName,INSERTED.Email VALUES(@name,@email,@password,@visitor)');
        user=r.recordset[0];await tx.commit();
      }catch(e){await tx.rollback();if([2601,2627].includes(e.number)){reply(res,409,{error:'No se pudo registrar este correo. Si ya tienes una cuenta, inicia sesión.'});return true;}throw e;}
    }else{
      const r=await pool.request().input('email',sql.NVarChar(254),email).query('SELECT Id,FullName,Email,PasswordHash FROM dbo.RumboUsers WHERE Email=@email');
      user=r.recordset[0];
      if(!await passwordMatches(body.password,user?.PasswordHash)){reply(res,401,{error:'Correo o contraseña incorrectos.'});return true;}
    }
    if(token(req))await pool.request().input('hash',sql.Char(64),hash(token(req))).query('DELETE dbo.RumboSessions WHERE TokenHash=@hash');
    await startSession(res,user.Id);reply(res,register?201:200,{user:publicUser(user)});
  }catch{reply(res,503,{error:'No se pudo conectar con el servicio de cuentas. Inténtalo de nuevo.'});}
  return true;
}
