// Fuente editorial: recorridos-rutas.txt. Fotos verificadas: recorridos-fotos-completas.json.
// Regeneración determinista; conserva los recorridos y las tarifas existentes.
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=file=>readFile(new URL(file,root),'utf8');
const write=(file,data)=>writeFile(new URL(file,root),data);
const base=JSON.parse(await read('docs/catalogo-auditoria-base.json'));
const photos=JSON.parse(await read('docs/recorridos-fotos-completas.json'));
const routes=new Map((await read('docs/recorridos-rutas.txt')).split(/\r?\n/).filter(line=>line&&!line.startsWith('#')).map(line=>{
  const [id,...items]=line.split('|');
  return [id,items.map(item=>{const [style,title,stops]=item.split('~');return {style,title,stops:stops.split(';')};})];
}));
const photoFields=(photo,d)=>({image:photo.file,alt:`Fotografía de referencia de ${d.name}: ${photo.title.replace(/^File:/,'').replace(/\.jpe?g$/i,'')}`,
  photoPage:photo.commons,photoAuthor:photo.author,photoLicense:photo.license,photoLicenseUrl:photo.licenseUrl,
  photoContext:`Fotografía de referencia de ${d.name}; no representa necesariamente las paradas de este recorrido. Imagen original: ${photo.title.replace(/^File:/,'')}.`});
const replacements={'roatan-west-bay':'roatan','venecia-canal':'venecia','miami-vizcaya':'miami'};
const guides=[];
const hotelAdditions={};
for(const d of base.destinations){
  const existing=base.guides.filter(g=>g.destination===d.id).map(g=>({...g}));
  const additions=routes.get(d.id)||[];
  assert.equal(existing.length+additions.length,10,d.id+' debe tener diez recorridos');
  for(const [index,route] of additions.entries()){
    assert.equal(route.stops.length,3,route.title);
    assert.ok(['cultura','naturaleza','playa','gastronomia'].includes(route.style));
    const hours=route.style==='naturaleza'?3:2;
    let description=`Explora ${route.title.toLocaleLowerCase('es')} en una propuesta por ${d.name}. El paseo conecta ${route.stops[0]}, ${route.stops[1]} y ${route.stops[2]}, con tiempo para conocer el entorno y hacer fotografías.`;
    if(d.id==='meca')description+=' Solo para visitantes musulmanes con acceso autorizado; el recorrido depende de los permisos y del calendario de peregrinación.';
    if(d.id==='medina')description+=' Los recintos religiosos tienen normas de acceso propias; el guía confirma las áreas permitidas antes del paseo.';
    existing.push({id:`${d.id}-paseo-${index+1}`,destination:d.id,...route,page:route.title,description,hours,price:hours===3?550:380});
  }
  const pictures=photos.filter(p=>p.destination===d.id&&p.kind==='guide').sort((a,b)=>a.file.localeCompare(b.file,undefined,{numeric:true}));
  if(additions.length){
    assert.equal(pictures.length,10,d.id+' necesita diez fotos');
    existing.forEach((g,i)=>Object.assign(g,photoFields(pictures[i],d)));
  }else{
    for(const g of existing)if(replacements[g.id]){
      assert.equal(pictures.length,1);Object.assign(g,photoFields(pictures[0],d));
    }
  }
  assert.equal(new Set(existing.map(g=>g.title)).size,10,d.id+' tiene títulos repetidos');
  guides.push(...existing);
  const hotelPhotos=photos.filter(p=>p.destination===d.id&&p.kind==='hotel').sort((a,b)=>a.file.localeCompare(b.file,undefined,{numeric:true}));
  assert.equal(hotelPhotos.length,Math.max(0,5-d.hotels.length),d.id+' debe tener cinco hospedajes');
  if(hotelPhotos.length)hotelAdditions[d.id]=hotelPhotos.map((p,index)=>({
    id:`${d.id}-estancia-${d.hotels.length+index+1}`,name:`${d.name} · ${index?'Estancia Jardín':'Estancia Terraza'}`,
    stars:index?4:3,area:'Zona por confirmar con el alojamiento',rate:Math.round(Math.min(...d.hotels.map(h=>h.rate))*(index?1.55:1.2)),
    image:p.file.replace(/^imagenes-viajes\//,''),imageAlt:'Fotografía de referencia para un alojamiento de demostración',
    photoAuthor:p.author,photoSource:p.commons,photoLicense:p.license,photoLicenseUrl:p.licenseUrl,
    amenities:index?['Wi-Fi','Desayuno','Aire acondicionado']:['Wi-Fi','Aire acondicionado']
  }));
}
assert.equal(guides.length,base.destinations.length*10);
await write('public/js/destinos/guias-catalogo.js','/* Catálogo completo: diez recorridos por destino. Tarifas de demostración.\n   Regenerar con node scripts/completar-catalogo.mjs. */\nwindow.RumboGuias = '+JSON.stringify(guides,null,2)+';\n');
await write('public/imagenes-viajes/CREDITOS-GUIAS.json',JSON.stringify(guides.map(g=>({id:g.id,file:g.image,commons:g.photoPage,author:g.photoAuthor,license:g.photoLicense,licenseUrl:g.photoLicenseUrl,description:g.photoContext||g.alt})),null,2)+'\n');
let source=await read('public/js/destinos/viajes.js');
const start='  // BEGIN CATALOGO UNIFORME',end='  // END CATALOGO UNIFORME';
const block=`${start}\n  const completeHotelOptions = ${JSON.stringify(hotelAdditions,null,2)};\n  // Completar también los catálogos SQL antiguos sin alterar tarifas guardadas.\n  destinations.forEach(d => {\n    for (const hotel of completeHotelOptions[d.id] || []) {\n      if (!d.hotels.some(saved => saved.id === hotel.id)) d.hotels.push({...hotel});\n    }\n    d.hotels.forEach(h => { if (!h.photoLicenseUrl && h.photoLicense === 'Public domain') h.photoLicenseUrl = 'https://creativecommons.org/publicdomain/mark/1.0/'; });\n  });\n${end}\n`;
if(source.includes(start))source=source.slice(0,source.indexOf(start))+block+source.slice(source.indexOf(end)+end.length).replace(/^\r?\n/,'');
else source=source.replace('  const discounted =',block+'  const discounted =');
await write('public/js/destinos/viajes.js',source);
const hotelCredits=JSON.parse(await read('public/imagenes-viajes/CREDITOS-HOTELES.json'));
const added=Object.entries(hotelAdditions).flatMap(([destination,hotels])=>hotels.map(h=>({id:h.id,hotel:h.name,destination,kind:'room',file:h.image,source:h.photoSource,author:h.photoAuthor,license:h.photoLicense,licenseUrl:h.photoLicenseUrl})));
const addedIds=new Set(added.map(h=>h.id));
await write('public/imagenes-viajes/CREDITOS-HOTELES.json',JSON.stringify([...hotelCredits.filter(h=>!addedIds.has(h.id)),...added],null,2)+'\n');
console.log(`${base.destinations.length} destinos, ${guides.length} recorridos y ${base.destinations.length*5} hospedajes.`);
