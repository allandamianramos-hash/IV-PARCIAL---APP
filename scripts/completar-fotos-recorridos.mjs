// Obtiene fotografías distintas de Commons y conserva fuente y licencia.
// Reanudable: no vuelve a descargar las fotografías ya verificadas.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root = new URL('../', import.meta.url);
const read = async file => JSON.parse(await fs.readFile(new URL(file, root), 'utf8'));
const base = await read('docs/catalogo-auditoria-base.json');
const canonical = url => {
  if (!url) return '';
  try { return decodeURIComponent(new URL(url).pathname).replaceAll('_',' ').normalize('NFC'); } catch { return url; }
};
const used = new Set(), hashes = new Set();
for (const file of (await fs.readdir(new URL('public/imagenes-viajes/',root))).filter(f=>f.startsWith('CREDITOS')&&f.endsWith('.json'))) {
  for (const row of await read('public/imagenes-viajes/'+file)) {
    used.add(canonical(row.commons || row.source || row.photoPage));
  }
}
const output = 'docs/recorridos-fotos-completas.json';
let photos; try { photos=await read(output); } catch { photos=[]; }
let checkpoint=Promise.resolve();
const save=()=>{const json=JSON.stringify(photos,null,2)+'\n';checkpoint=checkpoint.then(()=>fs.writeFile(new URL(output,root),json));return checkpoint;};
for (const p of photos) { used.add(canonical(p.commons)); hashes.add(p.sha256); }
const strip = text => String(text || '').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const queries = {
  'san-jose':'"San José" "Costa Rica"', 'ciudad-guatemala':'"Guatemala City"', panama:'"Panama City" Panama',
  'ciudad-mexico':'"Mexico City"', bogota:'Bogotá', cartagena:'Cartagena Colombia', lima:'Lima Peru', santiago:'Santiago Chile',
  'punta-cana':'"Punta Cana"', 'san-salvador':'"San Salvador"', 'san-juan':'"San Juan" "Puerto Rico"',
  'los-angeles':'"Los Angeles"', 'las-vegas':'"Las Vegas"', 'rio-janeiro':'"Rio de Janeiro"', 'buenos-aires':'"Buenos Aires"',
  londres:'London', lisboa:'Lisbon', praga:'Prague', estambul:'Istanbul', dubai:'Dubai', tokio:'Tokyo', seul:'Seoul', singapur:'Singapore', sidney:'Sydney',
  'hong-kong':'"Hong Kong"', macao:'Macau', 'kuala-lumpur':'"Kuala Lumpur"', taipei:'Taipei', milan:'Milan', viena:'Vienna', atenas:'Athens',
  florencia:'Florence', munich:'Munich', dublin:'Dublin', edimburgo:'Edinburgh', pekin:'Beijing', shanghai:'Shanghai', hanoi:'Hanoi',
  'ho-chi-minh':'"Ho Chi Minh City"', delhi:'Delhi', mumbai:'Mumbai', agra:'Agra', jaipur:'Jaipur', 'el-cairo':'Cairo', marrakech:'Marrakesh',
  'ciudad-del-cabo':'"Cape Town"', meca:'Mecca', medina:'"Medina" "Saudi"', roatan:'Roatan', venecia:'Venice', 'nueva-york':'"New York City"'
};
let apiQueue=Promise.resolve(),apiResumeAt=0;
async function apiTurn(){
  const turn=apiQueue.then(async()=>{await new Promise(r=>setTimeout(r,Math.max(0,apiResumeAt-Date.now())));apiResumeAt=Date.now()+1800;});
  apiQueue=turn;await turn;
}
async function fetchRetry(url) {
  const api=url.includes('/w/api.php'),attempts=api?5:2;
  for(let attempt=0;attempt<attempts;attempt++){
    try {
      if(api)await apiTurn();
      const r=await fetch(url,{headers:{'User-Agent':'RumboEducationalCatalog/1.0 (local educational travel catalogue)'},signal:AbortSignal.timeout(api?20000:10000)});
      if(r.ok)return r;
      if(r.status===429){
        const retry=Number(r.headers.get('retry-after'))||60;
        apiResumeAt=Math.max(apiResumeAt,Date.now()+(retry+2)*1000);
        console.log('Pausa de Commons:',retry,'segundos');
        await new Promise(resolve=>setTimeout(resolve,(retry+2)*1000));
        continue;
      }
      if(r.status!==429&&r.status<500)throw new Error('HTTP '+r.status);
    } catch(error){ if(attempt===attempts-1)throw error; }
    await new Promise(r=>setTimeout(r,2000*(attempt+1)));
  }
  throw new Error('No response: '+url);
}
const searches=new Map();
async function search(query,offset=0) {
  const key=query+offset;
  if(searches.has(key))return searches.get(key);
  const params=new URLSearchParams({action:'query',format:'json',generator:'search',gsrsearch:query+' filetype:bitmap -filetype:png -filetype:gif',gsrnamespace:'6',gsrlimit:'10',gsroffset:String(offset),prop:'imageinfo',iiprop:'url|extmetadata|size',iiurlwidth:'960'});
  const result=await (await fetchRetry('https://commons.wikimedia.org/w/api.php?'+params)).json();
  const pages=Object.values(result.query?.pages||{}).sort((a,b)=>a.index-b.index);
  searches.set(key,pages);return pages;
}
const relatedShots = new Set();
async function acquire(destination,count,kind='guide',slot=null,queryOverride=null) {
  const id=destination.id;
  if(slot){
    const file=`imagenes-viajes/${kind==='guide'?'guias/recorrido':'hoteles/estancia'}-${id}-${slot}.jpg`;
    if(photos.some(p=>p.file===file&&p.searchQuery===queryOverride))return;
  }
  const existing=slot?[]:photos.filter(p=>p.destination===id&&p.kind===kind);
  if(existing.length>=count)return;
  const query=queryOverride||(kind==='hotel'?'hotel room interior':(queries[id]||destination.name));
  let n=existing.length;
  for(let offset=0;offset<(slot&&kind==='guide'?50:500)&&n<count;offset+=10){
    const candidates=await search(query,offset);
    if(!candidates.length)break;
    for(const page of candidates){
      if(n>=count)break;
      const info=page.imageinfo?.[0], meta=info?.extmetadata||{};
      if(!info?.thumburl?.includes('/thumb/')||info.width<960||info.height<500||info.width/info.height<0.85||info.width/info.height>2.7)continue;
      if(!/\.jpe?g$/i.test(page.title)||/\b(map|logo|flag|portrait|stamp|coin|diagram|drawing|painting|engraving|chart|advert|poster|flood|war|fire|military|protest|murder|funeral|homeless|garbage|rubbish|accident|car|bus|truck|aircraft)\b|\b(18\d\d|19[0-7]\d)\b/i.test(page.title))continue;
      if(kind==='hotel'&&!/bedroom|guest.room|hotel.room|suite|room.in|room.at|bed.*hotel|hotel.*bed/i.test(page.title))continue;
      const key=canonical(info.descriptionurl);
      if(/\b(painting|oil on canvas|watercolou?r|floor plan|portrait|boy|girl|child|haircut)\b|Donggwoldo|Slavíček/i.test(page.title+' '+strip(meta.ImageDescription?.value)))continue;
      const shot=page.title.toLowerCase().replace(/\d+/g,'').replace(/[\W_]+/g,'');
      if(used.has(key)||relatedShots.has(shot))continue;
      const license=strip(meta.LicenseShortName?.value), author=strip(meta.Artist?.value);
      if(!author||!(/CC BY|CC0|Public domain/i.test(license)))continue;
      used.add(key);relatedShots.add(shot);
      try {
        const bytes=Buffer.from(await (await fetchRetry(info.thumburl)).arrayBuffer());
        if(bytes[0]!==255||bytes[1]!==216||bytes.length<5000)continue;
        const sha256=createHash('sha256').update(bytes).digest('hex');
        if(hashes.has(sha256))continue;
        hashes.add(sha256);
        const file=`imagenes-viajes/${kind==='guide'?'guias':'hoteles'}/${kind==='guide'?'recorrido':'estancia'}-${id}-${slot||n+1}.jpg`;
        await fs.writeFile(new URL('public/'+file,root),bytes);
        photos=photos.filter(p=>p.file!==file);
        photos.push({destination:id,kind,file,title:page.title,commons:info.descriptionurl,author,license,licenseUrl:meta.LicenseUrl?.value||'https://creativecommons.org/publicdomain/mark/1.0/',description:strip(meta.ImageDescription?.value),width:info.thumbwidth,height:info.thumbheight,sha256,searchQuery:query});
        n++;
        await save();
      }catch(error){console.log('Omitida',page.title,error.message);}
    }
  }
  console.log(id,kind,n+'/'+count);
  if(n<count)throw new Error('Faltan fotos para '+id);
}
// Sequence destinations to make the catalogue and attribution deterministic.
const mode=process.argv[2]||'guides';
if(mode==='hotels-reviewed'){
  for(const id of ['san-juan','los-angeles','berlin','macao'])await acquire(base.destinations.find(d=>d.id===id),1,'hotel',1,'hotel suite bedroom interior -bathroom -detail -people -sofa');
  await save();process.exit(0);
}
if(mode==='hotels-final'){
  const rows={'ciudad-mexico':[2],cartagena:[1],'san-juan':[1],'los-angeles':[1],'las-vegas':[1,2],vancouver:[1],berlin:[1,2],sidney:[2],'hong-kong':[1],macao:[1],pattaya:[1]};
  for(const [id,slots]of Object.entries(rows))for(const slot of slots)await acquire(base.destinations.find(d=>d.id===id),1,'hotel',slot,'"hotel room" bed -bathroom -dining -detail');
  await save();process.exit(0);
}
if(mode==='hotels-quality'){
  const rows={ 'ciudad-mexico':[2],cartagena:[1],santiago:[1,2],'san-juan':[1],'los-angeles':[1],'las-vegas':[1,2],vancouver:[1,2],berlin:[1,2],dubai:[1],tokio:[1,2],sidney:[2],'hong-kong':[1],macao:[1],pattaya:[1,2],taipei:[2],milan:[1],viena:[2],munich:[1],dublin:[1,2],edimburgo:[2],delhi:[1,2],mumbai:[1,2],amsterdam:[1],jaipur:[2],marrakech:[2],meca:[1]};
  const queue=Object.entries(rows).flatMap(([id,slots])=>slots.map(slot=>({id,slot})));
  for(const {id,slot}of queue)await acquire(base.destinations.find(d=>d.id===id),1,'hotel',slot,'hotel bedroom -dining -bathroom -living -conference -ceiling -door -safe -key -slippers -breakfast -historic -portrait');
  await save();process.exit(0);
}
if(mode==='quality'){
  const fixes=(await fs.readFile(new URL('docs/recorridos-fotos-ajustes.txt',root),'utf8')).split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).flatMap(line=>{
    const [id,...items]=line.split('|');return items.map(item=>{const at=item.indexOf(':');return {id,slot:Number(item.slice(0,at)),query:item.slice(at+1)};});
  });
  let next=0;
  const errors=[];
  await Promise.all(Array.from({length:2},async()=>{while(next<fixes.length){const f=fixes[next++];try{await acquire(base.destinations.find(d=>d.id===f.id),1,'guide',f.slot,f.query);}catch(error){errors.push(f);console.log('Pendiente',f.id,f.slot,error.message);}}}));
  await save();
  console.log('Revisión visual aplicada:',fixes.length);
  process.exit(errors.length?1:0);
}
const queue=base.destinations.filter(d=>mode==='hotels'?d.hotels.length<5:mode==='repairs'?['roatan','venecia','miami'].includes(d.id):base.guides.filter(g=>g.destination===d.id).length<10);
// Parallel I/O only; image identities are reserved before downloading.
let cursor=0;
await Promise.all(Array.from({length:2},async()=>{while(cursor<queue.length){const d=queue[cursor++];await acquire(d,mode==='hotels'?5-d.hotels.length:mode==='repairs'?1:10,mode==='hotels'?'hotel':'guide');}}));
await save();
console.log('Fotografías guardadas:',photos.length);
