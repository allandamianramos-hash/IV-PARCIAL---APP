import {createHash} from 'node:crypto';
import {gzip} from 'node:zlib';
import {promisify} from 'node:util';
const compress=promisify(gzip);

export async function sendContent(req,res,body,type,{cacheable=false}={}){
  const bytes=Buffer.isBuffer(body)?body:Buffer.from(body);
  const encodings=new Map(String(req.headers['accept-encoding']||'').split(',').map(part=>{
    const [name,...params]=part.trim().split(';');
    const quality=params.find(p=>p.trim().startsWith('q='));
    return [name.trim().toLowerCase(),quality?Number(quality.trim().slice(2)):1];
  }));
  const zipped=bytes.length>=1024&&/^(text\/|application\/json)/.test(type)&&(encodings.get('gzip')??encodings.get('*')??0)>0;
  res.setHeader('Content-Type',type);
  res.setHeader('Vary','Accept-Encoding');
  res.setHeader('Cache-Control',cacheable?'public, max-age=0, must-revalidate':'no-store');
  if(zipped)res.setHeader('Content-Encoding','gzip');
  if(cacheable){
    const etag='"'+createHash('sha256').update(bytes).digest('hex')+(zipped?'-gzip':'')+'"';
    res.setHeader('ETag',etag);
    if(String(req.headers['if-none-match']||'').split(',').some(tag=>tag.trim()==='*'||tag.trim().replace(/^W\//,'')===etag)){
      res.writeHead(304);res.end();return;
    }
  }
  const payload=zipped?await compress(bytes,{level:6}):bytes;
  res.setHeader('Content-Length',payload.length);
  res.writeHead(200);res.end(req.method==='HEAD'?undefined:payload);
}
