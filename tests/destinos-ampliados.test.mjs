import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const source=await read('public/js/destinos/viajes.js');
const load=window=>{const context={window};vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),context);return context;};
const context=load({}),catalog=context.window.RumboViajesDatos;
const cities=JSON.parse(await read('docs/nuevos-destinos-contenido.json'));
const original=JSON.parse(await read('tests/fixtures/destinos-originales.json'));
vm.runInNewContext(await read('public/js/destinos/guias-catalogo.js'),context);

test('los 40 destinos originales conservan exactamente sus datos, fotos, hoteles y tarifas',()=>{
  for(const [id,hash] of Object.entries(original)){
    const d=catalog.destinations.find(d=>d.id===id);
    assert.ok(d,id);
    assert.equal(createHash('sha256').update(JSON.stringify(d)).digest('hex'),hash,id);
  }
});

test('30 ciudades nuevas completas, sin duplicados, con fotos locales adaptables y tres recorridos',async()=>{
  assert.equal(catalog.destinations.length,70);
  assert.equal(cities.length,30);
  assert.equal(new Set(catalog.destinations.map(d=>d.id)).size,70);
  for(const city of cities){
    assert.ok(!Object.hasOwn(original,city.id),city.id);
    const d=catalog.destinations.find(d=>d.id===city.id);
    for(const key of ['name','country','description','intro','tip','signature','alt']) assert.ok(d[key]?.length,`${d.id}.${key}`);
    assert.equal(d.highlights.length,3);
    assert.match(d.airport.code,/^[A-Z]{3}$/);
    assert.ok(d.airport.name);
    assert.ok(d.imageWidth>=1600&&d.imageHeight>=900,d.id);
    for(const path of [d.image,d.thumbnail,d.mediumImage]) await access(new URL('public/'+path,root));
    assert.equal(d.hotels.length,3);
    for(const origin of catalog.origins){
      const options=catalog.flights(d,origin,4);
      assert.equal(options.length,6);
      assert.ok(options.every(f=>f.stops==='Con conexiones'&&f.groupDiscount===5&&f.minutes>0));
    }
    const guides=context.window.RumboGuias.filter(g=>g.destination===d.id);
    assert.equal(guides.length,3);
    assert.equal(new Set(guides.map(g=>g.title)).size,3);
    assert.ok(new Set(guides.map(g=>g.style)).size>=(d.id==='el-cairo'?1:2));
    for(const g of guides){assert.equal(g.stops.length,3);assert.ok(g.price>0&&g.hours>0);assert.ok(g.photoContext.includes(d.name));}
    assert.ok(city.sources.length>=2);
  }
});

test('SQL incompleto incluye las 30 nuevas y respeta destinos y precios ya guardados',()=>{
  const bangkok=catalog.destinations.find(d=>d.id==='bangkok');
  const sqlDestination={...JSON.parse(JSON.stringify(bangkok)),economy:43210,hotels:[{...bangkok.hotels[0],rate:7777}]};
  const old=catalog.destinations.filter(d=>Object.hasOwn(original,d.id));
  const connected=load({RumboDatabase:{connected:true,catalog:{destinations:[...JSON.parse(JSON.stringify(old)),sqlDestination],origins:catalog.origins,rooms:catalog.rooms,promotions:catalog.promotions}}}).window.RumboViajesDatos;
  assert.equal(connected.destinations.length,70);
  assert.equal(connected.destinations.find(d=>d.id==='bangkok').economy,43210);
  assert.equal(connected.destinations.find(d=>d.id==='bangkok').hotels[0].rate,7777);
  assert.equal(connected.destinations.filter(d=>d.id==='bangkok').length,1);
});

test('inicio y Rumbito encuentran cada ciudad nueva en el catálogo compartido',async()=>{
  vm.runInNewContext(await read('public/js/rumbito/chat-engine.js'),context);
  for(const city of cities){
    const d=catalog.destinations.find(d=>d.id===city.id);
    assert.equal(catalog.selectHomeDestinations([d])[0].id,city.id);
    const state={};
    context.window.RumboChat.respond('Quiero viajar a '+city.name,{}, {trips:catalog.destinations,catalog:catalog.destinations,flights:catalog.flights,products:[],contacts:[]},state);
    assert.equal(state.destination,city.id);
  }
});
