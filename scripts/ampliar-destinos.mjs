// Rebuild only the October 2026 addition, preserving the original catalogue.
// Research and photo metadata live in docs/nuevos-*-*.json.
import {readFile, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const read = file => readFile(new URL('../'+file, import.meta.url), 'utf8');
const json = async file => JSON.parse(await read(file));
const write = (file, value) => writeFile(new URL('../'+file, import.meta.url), value);
const cities = await json('docs/nuevos-destinos-contenido.json');
const photos = await json('docs/nuevos-destinos-fotos.json');
const hotelPhotos = await json('docs/nuevos-hoteles-fotos.json');
assert.equal(cities.length, 30);
assert.equal(new Set(cities.map(d=>d.id)).size, 30);
assert.equal(photos.length, 30);
assert.equal(hotelPhotos.length, 90);
const additions = cities.map(city => {
  const {guides,hotelBase,hotelNames,hotelAreas,sources,...data} = city;
  const photo = photos.find(p=>p.id===city.id);
  assert.ok(photo, city.id);
  const hotels = hotelNames.map((name,index)=>{
    const id = `${city.id}-opcion-${index+1}`;
    const p = hotelPhotos.find(p=>p.id===id);
    assert.ok(p, id);
    return {id,name,stars:index+3,area:hotelAreas[index],rate:Math.round(hotelBase*[1,1.3,1.8][index]),
      image:p.file,imageAlt:p.imageAlt,photoAuthor:p.author,photoSource:p.commons||p.source,
      photoLicense:p.license,photoLicenseUrl:p.licenseUrl,
      amenities:index===0?['Wi-Fi','Aire acondicionado']:index===1?['Wi-Fi','Desayuno']:['Wi-Fi','Desayuno','Estacionamiento']};
  });
  return {...data,region:'internacional',...photo,hotels};
});
function block(source, name, body, anchor) {
  const start = `// BEGIN ${name}`, end = `// END ${name}`;
  const generated = `${start}\n${body}\n${end}\n`;
  if(source.includes(start)) {
    const a=source.indexOf(start), b=source.indexOf(end,a);
    assert.ok(b>a);
    return source.slice(0,a)+generated+source.slice(b+end.length).replace(/^\r?\n/,'');
  }
  if(anchor===null) return source+'\n'+generated;
  assert.ok(source.includes(anchor), anchor);
  return source.replace(anchor, generated+anchor);
}
let travel = await read('public/js/destinos/viajes.js');
travel = block(travel,'DESTINOS OCTUBRE 2026',`additionalDestinations.push(...${JSON.stringify(additions,null,2)});`,'  destinations.push(...additionalDestinations);');
travel = travel.replace('d.signature = destinationSignatures[d.id] || d.tag;', 'd.signature = destinationSignatures[d.id] || d.signature || d.tag;');
await write('public/js/destinos/viajes.js',travel);
const guides = cities.flatMap(city=>{
  const photo=photos.find(p=>p.id===city.id);
  assert.equal(city.guides.length,3,city.id);
  return city.guides.map((guide,index)=>({...guide,id:`${city.id}-ruta-${index+1}`,destination:city.id,
    image:photo.mediumImage,alt:photo.alt,photoPage:photo.photoSource,photoAuthor:photo.photoAuthor,
    photoLicense:photo.photoLicense,photoLicenseUrl:photo.photoLicenseUrl,
    photoContext:`Fotografía de ${city.name} como referencia del destino; no representa necesariamente todas las paradas del recorrido.`}));
});
let guideSource = await read('public/js/destinos/guias-catalogo.js');
guideSource = block(guideSource,'GUIAS OCTUBRE 2026',`window.RumboGuias.push(...${JSON.stringify(guides,null,2)});`,null);
await write('public/js/destinos/guias-catalogo.js',guideSource);
async function mergeCredits(file,added) {
  const rows=await json(file), ids=new Set(added.map(p=>p.id));
  await write(file,JSON.stringify([...rows.filter(p=>!ids.has(p.id)),...added],null,2)+'\n');
}
await mergeCredits('public/imagenes-viajes/CREDITOS-DESTINOS-NUEVOS.json',photos.map(p=>({
  id:p.id,name:cities.find(d=>d.id===p.id).name,file:p.image.replace(/^imagenes-viajes\//,''),
  source:p.photoSource,author:p.photoAuthor,license:p.photoLicense,licenseUrl:p.photoLicenseUrl,
  width:p.imageWidth,height:p.imageHeight
})));
await mergeCredits('public/imagenes-viajes/CREDITOS-HOTELES.json',additions.flatMap(d=>d.hotels.map(h=>({
  id:h.id,hotel:h.name,destination:d.name,kind:'room',file:h.image,source:h.photoSource,
  author:h.photoAuthor,license:h.photoLicense,licenseUrl:h.photoLicenseUrl
}))));
await mergeCredits('public/imagenes-viajes/CREDITOS-GUIAS.json',guides.map(g=>({
  id:g.id,file:g.image,commons:g.photoPage,author:g.photoAuthor,license:g.photoLicense,
  licenseUrl:g.photoLicenseUrl,description:g.photoContext
})));
const escape = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const credit = (label,source,author,license,url)=>`<li><a href="${escape(source)}">${escape(label)}</a> · <span translate="no">${escape(author)}</span> · <a href="${escape(url)}">${escape(license)}</a></li>`;
const creditsHtml='<h3>30 destinos nuevos y sus recorridos</h3><p>Las fotografías de los recorridos nuevos muestran el destino como referencia. Las paradas propuestas se detallan en cada experiencia.</p><ul>'+additions.map(d=>credit(d.name,d.photoSource,d.photoAuthor,d.photoLicense,d.photoLicenseUrl)).join('')+'</ul><h3>Alojamientos de los destinos nuevos</h3><p>Alojamientos ficticios y fotografías de referencia, sin relación comercial con los establecimientos fotografiados.</p><ul>'+additions.flatMap(d=>d.hotels.map(h=>credit(h.name+' · '+d.name,h.photoSource,h.photoAuthor,h.photoLicense,h.photoLicenseUrl))).join('')+'</ul>';
let html=await read('public/viajes.html');
const start='<!-- BEGIN CREDITOS OCTUBRE 2026 -->', end='<!-- END CREDITOS OCTUBRE 2026 -->';
const creditsBlock=start+creditsHtml+end;
if(html.includes(start)) html=html.slice(0,html.indexOf(start))+creditsBlock+html.slice(html.indexOf(end)+end.length);
else {const at=html.indexOf('</details>',html.indexOf('id="creditos-imagenes"')); assert.ok(at>0);html=html.slice(0,at)+creditsBlock+html.slice(at);}
await write('public/viajes.html',html);
console.log(`Integrados ${additions.length} destinos, ${hotelPhotos.length} hospedajes y ${guides.length} recorridos.`);
