import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const source=await read('public/js/destinos/viajes.js');
const scope={window:{}};vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),scope);vm.runInNewContext(await read('public/js/destinos/guias-catalogo.js'),scope);
const catalog=scope.window.RumboViajesDatos, guides=scope.window.RumboGuias;
const old=JSON.parse(await read('tests/fixtures/catalogo-70-hashes.json')),cities=JSON.parse(await read('docs/catalogo-100/ciudades.json'));
const hash=d=>createHash('sha256').update(JSON.stringify(d)).digest('hex');
test('los 70 destinos y 700 experiencias anteriores quedan intactos',()=>{
 for(const [id,value]of Object.entries(old.destinations))assert.equal(hash(catalog.destinations.find(d=>d.id===id)),value,id);
 for(const [id,value]of Object.entries(old.guides))assert.equal(hash(guides.find(g=>g.id===id)),value,id);
});
test('100 destinos, 500 hospedajes y 1000 experiencias sin identificadores repetidos',()=>{
 assert.equal(catalog.destinations.length,100);assert.equal(guides.length,1000);assert.equal(catalog.destinations.flatMap(d=>d.hotels).length,500);
 for(const list of [catalog.destinations,guides,catalog.destinations.flatMap(d=>d.hotels)])assert.equal(new Set(list.map(d=>d.id)).size,list.length);
 assert.equal(catalog.selectHomeDestinations(catalog.destinations).length,6);
});
test('cada destino nuevo cuenta con aeropuerto, fotos, diez experiencias y cinco hospedajes',async()=>{
 const airports=JSON.parse((await read('docs/catalogo-100/aeropuertos.json')).replace(/^\uFEFF/,''));
 for(const city of cities){
  assert.ok(!old.destinations[city.id]);const d=catalog.destinations.find(d=>d.id===city.id);assert.ok(d,city.id);
  assert.equal(d.airport.code,city.code);assert.equal(airports.find(a=>a.id===city.id).scheduled,'yes');assert.equal(d.region,'internacional');
  assert.equal(d.hotels.length,5);const experiences=guides.filter(g=>g.destination===d.id);assert.equal(experiences.length,10);assert.equal(new Set(experiences.map(g=>g.title)).size,10);
  for(const file of [d.image,d.thumbnail,d.mediumImage,...experiences.map(g=>g.image),...d.hotels.map(h=>'imagenes-viajes/'+h.image)])await access(new URL('../public/'+file,import.meta.url));
  for(const origin of catalog.origins){const f=catalog.flights(d,origin,3);assert.equal(f.length,6);assert.ok(f.every(f=>f.groupDiscount===5&&f.minutes>0&&f.economy>0&&f.stops==='Con conexiones'));}
 }
});
test('los destinos nuevos se incorporan con un catálogo SQL previo sin duplicar ni cambiar precios',()=>{
 const prior=JSON.parse(JSON.stringify(catalog));prior.destinations=prior.destinations.filter(d=>old.destinations[d.id]);prior.destinations[0].economy=12345;
 const connected={window:{RumboDatabase:{connected:true,catalog:prior}}};vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),connected);
 assert.equal(connected.window.RumboViajesDatos.destinations.length,100);assert.equal(connected.window.RumboViajesDatos.destinations[0].economy,12345);
});
