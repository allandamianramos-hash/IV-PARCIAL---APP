import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile('viajes.js','utf8');
const ctx={window:{}};vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),ctx);
const pools=[7398574,116432293,13916476,130972621,83893092,6958668,105182727,116001234,132458287,84776104,42009692,138292229,89230226,84776119,77570641];
const bedrooms=[138344663,99550960,26370561,101039782,59466255,99550429,37716294,178858131,179244359,117570716,136151336,106644272,50210328,99550426,46447517,49875962,99193148,49726260,27114324,22873567,98518034,105221570,49657541,116850104,30603711,26046869,121288801,50534502,50203388,50664661,50201001,21231069,107041853,113288642,97981277];
const rooms=[9805002,63211267,79823719,162689725,81492562,123849561,104842287,175993715,22878748,137247913,83492022,75011896,113397696,27178586,50616798,112384092,31883265,145806958,68999407,77767968];
const pages={};for(const file of ['hotel-candidates','hotel-bedrooms','hotel-pools'])Object.assign(pages,JSON.parse(await fs.readFile(`evidencias/${file}.json`,'utf8')).query.pages);
const hotels=ctx.window.RumboViajesDatos.destinations.flatMap(d=>d.hotels.map(h=>({...h,destination:d.name})));
const used=new Set();const plan=[];
// Sustituciones tras la revisión visual: evitar fotos oscuras, antiguas o con personas.
const replacements={5:52180111,6:123998002,13:30387855,16:108531634,22:54690577,24:123959784,36:100251720,49:46553782,51:49657669,53:49601520,58:107426465,59:30594287,60:21192910,65:75231163,66:170058637,68:66089212,69:153547306};
for(const h of hotels){
 let pool=h.amenities.includes('Piscina')&&pools.length;
 let id=pool?pools.shift():(bedrooms.length?bedrooms.shift():rooms.shift());
 const replacement=replacements[plan.length];
 if(replacement){id=replacement;pool=false;}
 if(!id||used.has(id))throw Error('Missing or duplicate image');used.add(id);
 const p=pages[id],info=p.imageinfo[0],m=info.extmetadata;
 const strip=s=>(s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
 if(!/^(CC BY|CC0|Public domain)/.test(m.LicenseShortName?.value||''))throw Error(`License ${id}: ${m.LicenseShortName?.value}`);
 plan.push({id:h.id,hotel:h.name,destination:h.destination,kind:pool?'pool':'room',file:`hotel-${h.id}${replacement?'-ref':''}.jpg`,url:info.thumburl,source:info.descriptionurl,author:strip(m.Artist?.value),license:m.LicenseShortName.value,licenseUrl:m.LicenseUrl?.value||'',title:p.title});
}
await fs.writeFile('imagenes-viajes/CREDITOS-HOTELES.json',JSON.stringify(plan,null,2)+'\n');
console.log(`Plan: ${plan.length} fotografías distintas`);
