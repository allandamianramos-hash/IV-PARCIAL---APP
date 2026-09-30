import fs from 'node:fs/promises';
const photos=JSON.parse(await fs.readFile('imagenes-viajes/CREDITOS-HOTELES.json','utf8'));
const map=Object.fromEntries(photos.map(p=>[p.id,{image:p.file,imageAlt:p.kind==='pool'?'Fotografía de referencia de un hotel con piscina':'Fotografía de referencia de una habitación de hotel',photoAuthor:p.author,photoSource:p.source,photoLicense:p.license,photoLicenseUrl:p.licenseUrl}]));
for(const p of photos)await fs.access(`imagenes-viajes/${p.file}`);
let source=await fs.readFile('viajes.js','utf8');
const block=`  const hotelPhotos = ${JSON.stringify(map,null,2)};\n  destinations.forEach(d => d.hotels.forEach(h => Object.assign(h, hotelPhotos[h.id])));\n\n`;
source=source.replace('  const airlines = {',block+'  const airlines = {');
await fs.writeFile('viajes.js',source);
