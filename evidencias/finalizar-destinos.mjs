import fs from 'node:fs/promises';
import vm from 'node:vm';
let source=await fs.readFile('viajes.js','utf8');
source=source.replace('<p>${item.intro}</p>${item.promotion', '<p>${item.intro}</p><p class="rv-demo-caption">Aeropuerto: ${item.airport.name} (${item.airport.code})</p>${item.promotion');
await fs.writeFile('viajes.js',source);
const ctx={window:{}};vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),ctx);
const destinations=ctx.window.RumboViajesDatos.destinations;
const credits=JSON.parse(await fs.readFile('imagenes-viajes/CREDITOS-HOTELES.json','utf8'));
for(const d of destinations)for(const h of d.hotels){const c=credits.find(c=>c.id===h.id);c.hotel=h.name;c.destination=d.name;}
await fs.writeFile('imagenes-viajes/CREDITOS-HOTELES.json',JSON.stringify(credits,null,2)+'\n');
let services=await fs.readFile('servicios.js','utf8');
services=services.replaceAll("copan:'copan','la-ceiba':'ceiba'","'san-pedro-sula':'sps','san-jose':'sjo'")
 .replace("['copan','San Pedro Sula → Copán Ruinas'],['ceiba','Aeropuerto de La Ceiba → Centro']","['sps','Aeropuerto Ramón Villeda Morales → San Pedro Sula'],['sjo','Aeropuerto Juan Santamaría → San José']")
 .replace('roatan:750,copan:2800,ceiba:450','roatan:750,sps:800,sjo:950')
 .replaceAll("['roatan','copan','la-ceiba']","['roatan','san-pedro-sula','san-jose']")
 .replace('Roatán, La Ceiba y Copán','Roatán, San Pedro Sula y San José');
await fs.writeFile('servicios.js',services);
let journey=await fs.readFile('journey.js','utf8');
journey=journey.replaceAll("copan:'copan','la-ceiba':'ceiba'","'san-pedro-sula':'sps','san-jose':'sjo'");
await fs.writeFile('journey.js',journey);
const photos=JSON.parse(await fs.readFile('imagenes-viajes/CREDITOS-DESTINOS.json','utf8'));
const newIds=['san-jose','san-pedro-sula','comayagua','ciudad-guatemala','venecia','osaka'];
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=photos.filter(p=>newIds.includes(p.id)).map(p=>`<li><a href="${esc(p.source)}">${esc(destinations.find(d=>d.id===p.id).name)}</a> · ${esc(p.author.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim())} · <a href="${esc(p.licenseUrl)}">${esc(p.license)}</a></li>`).join('');
let html=await fs.readFile('viajes.html','utf8');
html=html.replace('<summary>Créditos de imágenes</summary>',`<summary>Créditos de imágenes</summary><div><h3>Ciudades con aeropuerto</h3><p>Fotografías de Wikimedia Commons; miniaturas con encuadre mediante CSS. Conservan su licencia.</p><ul class="rv-highlight-list">${lines}</ul></div>`);
await fs.writeFile('viajes.html',html);
console.log(destinations.map(d=>`${d.name} (${d.airport.code})`).join('\n'));
