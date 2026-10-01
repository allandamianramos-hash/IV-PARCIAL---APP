import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile('viajes.js','utf8');
const ctx={window:{}};
vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),ctx);
const destinations=ctx.window.RumboViajesDatos.destinations;
const credits=JSON.parse(await fs.readFile('imagenes-viajes/CREDITOS-HOTELES.json','utf8'));
for(const d of destinations)for(const h of d.hotels){const c=credits.find(c=>c.id===h.id);c.hotel=h.name;c.destination=d.name;}
await fs.writeFile('imagenes-viajes/CREDITOS-HOTELES.json',JSON.stringify(credits,null,2)+'\n');
const photos=JSON.parse((await fs.readFile('imagenes-viajes/CREDITOS-DESTINOS.json','utf8')).replace(/^\uFEFF/,''));
const ids=['paris','roma','barcelona','nueva-york'];
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=photos.filter(p=>ids.includes(p.id)).map(p=>`<li><a href="${esc(p.source)}">${esc(destinations.find(d=>d.id===p.id).name)}</a> · ${esc(p.author.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim())} · <a href="${esc(p.licenseUrl)}">${esc(p.license)}</a></li>`).join('');
let html=await fs.readFile('viajes.html','utf8');
html=html.replace(/<!-- populares-creditos -->[\s\S]*?<!-- fin-populares-creditos -->/,'');
html=html.replace('<summary>Créditos de imágenes</summary>',`<summary>Créditos de imágenes</summary><!-- populares-creditos --><div><h3>Destinos populares</h3><p>Fotografías de Wikimedia Commons; encuadre mediante CSS.</p><ul class="rv-highlight-list">${lines}</ul></div><!-- fin-populares-creditos -->`);
await fs.writeFile('viajes.html',html);
console.log(destinations.map(d=>`${d.name}: ${d.airport.code}`).join('\n'));
