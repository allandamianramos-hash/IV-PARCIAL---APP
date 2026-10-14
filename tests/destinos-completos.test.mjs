import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../public/',import.meta.url);
const source=await readFile(new URL('js/destinos/viajes.js',root),'utf8');
const context={window:{}};
vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),context);
vm.runInNewContext(await readFile(new URL('js/destinos/guias-catalogo.js',root),'utf8'),context);
const {destinations,flights,origins}=context.window.RumboViajesDatos;
const guides=context.window.RumboGuias;
const normalized=path=>path.replace(/^imagenes-viajes\//,'');

test('los 70 destinos ofrecen diez recorridos y cinco hospedajes completos',()=>{
  assert.equal(destinations.length,70);
  for(const d of destinations){
    assert.equal(guides.filter(g=>g.destination===d.id).length,10,d.id);
    assert.equal(d.hotels.length,5,d.id);
    assert.equal(new Set(d.hotels.map(h=>h.id)).size,5,d.id);
    for(const h of d.hotels){
      assert.ok(h.name&&h.area&&h.image&&h.imageAlt,d.id+'/'+h.id);
      assert.ok(h.rate>0&&h.stars>=1&&h.stars<=5&&h.amenities.length);
      assert.ok(h.photoAuthor&&h.photoSource&&h.photoLicense&&h.photoLicenseUrl);
    }
    assert.ok(d.airport.code&&d.highlights.length&&d.description&&d.tip);
    assert.ok(origins.some(origin=>flights(d,origin).length===6),d.id);
  }
});

test('ningún destino, hospedaje o recorrido reutiliza una foto de otro elemento',async()=>{
  const credits=[];
  for(const f of (await readdir(new URL('imagenes-viajes/',root))).filter(f=>f.startsWith('CREDITOS')&&f.endsWith('.json'))){
    credits.push(...JSON.parse(await readFile(new URL('imagenes-viajes/'+f,root),'utf8')));
  }
  const paths=new Map(),hashes=new Map(),sources=new Map();
  const items=destinations.flatMap(d=>[{id:d.id,image:d.image},...d.hotels]).concat(guides);
  for(const item of items){
    const path=normalized(item.image);
    assert.ok(!paths.has(path),`${item.id} repite la imagen de ${paths.get(path)}`);paths.set(path,item.id);
    const bytes=await readFile(new URL('imagenes-viajes/'+path,root));
    const hash=createHash('sha256').update(bytes).digest('hex');
    assert.ok(!hashes.has(hash),`${item.id} copia el archivo de ${hashes.get(hash)}`);hashes.set(hash,item.id);
    const credit=credits.find(c=>normalized(c.file||'')===path);
    const url=item.photoPage||item.photoSource||credit?.commons||credit?.source;
    assert.ok(url,item.id+' carece de fuente');
    const key=decodeURIComponent(new URL(url).pathname).replaceAll('_',' ').normalize('NFC');
    assert.ok(!sources.has(key),`${item.id} reutiliza la fotografía de ${sources.get(key)} con otro recorte`);sources.set(key,item.id);
  }
});

test('un catálogo SQL anterior recibe hospedajes adicionales sin alterar tarifas ni duplicarlos',async()=>{
  const old=JSON.parse(JSON.stringify(context.window.RumboViajesDatos));
  const initial=JSON.parse(await readFile(new URL('../docs/catalogo-auditoria-base.json',root),'utf8'));
  old.destinations.forEach(d=>{d.hotels=initial.destinations.find(item=>item.id===d.id).hotels;});
  const madrid=old.destinations.find(d=>d.id==='madrid');madrid.hotels[0].rate=7654;
  const connected={window:{RumboDatabase:{connected:true,catalog:old}}};
  vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),connected);
  for(const d of connected.window.RumboViajesDatos.destinations){assert.equal(d.hotels.length,5,d.id);assert.equal(new Set(d.hotels.map(h=>h.id)).size,5);}
  assert.equal(connected.window.RumboViajesDatos.destinations.find(d=>d.id==='madrid').hotels[0].rate,7654);
});
