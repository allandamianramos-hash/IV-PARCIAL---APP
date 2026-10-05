import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

const source = await readFile(new URL('viajes.js', new URL('../public/', import.meta.url)), 'utf8');
const context = { window: {} };
vm.runInNewContext(source.slice(0, source.indexOf('/* Abre una')), context);
const { destinations, origins, flights } = context.window.RumboViajesDatos;

test('el descuento de grupo empieza en tres pasajeros y se acumula sobre la tarifa rebajada', () => {
  const cancun=destinations.find(d=>d.id==='cancun');
  for(const origin of origins){
    const solo=flights(cancun,origin,2)[0], group=flights(cancun,origin,3)[0];
    assert.equal(group.discountPercent,28.75);
    for(const cabin of ['economy','executive']) assert.equal(group[cabin],Math.round(solo[cabin]*95)/100);
    assert.equal(flights(cancun,origin,12)[0].economy,group.economy);
    for(const invalid of [0,13,2.5,NaN])assert.equal(flights(cancun,origin,invalid)[0].groupDiscount,0);
    assert.equal(flights(cancun,origin,2)[0].economy,solo.economy);
  }
  assert.equal(flights(destinations[0],origins[0],3)[0].economy,3040);
  assert.equal(flights(undefined,origins[0]).length,0);
  assert.equal(flights({id:'retirado'},origins[0]).length,0);
});

test('todos los anuncios con precio apuntan a destinos con tarifas finitas', async()=>{
  const html=await readFile(new URL('index.html', new URL('../public/', import.meta.url)),'utf8');
  const script=html.match(/<script id="rumbo-hero-script">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,'El inicio debe conservar la configuración de las campañas');
  const configSource=script.match(/\bconst RUMBO_HERO_CONFIG\s*=\s*(\{[\s\S]*?\})\s*;/)?.[1];
  assert.ok(configSource,'La configuración debe ser un objeto JSON terminado en punto y coma');
  const config=JSON.parse(configSource);
  for(const slide of config.slides.filter(s=>s.price)){
    const d=destinations.find(d=>d.id===slide.id);assert.ok(d,slide.id);
    const f=flights(d,origins[0])[0];assert.ok(Number.isFinite(f.economy));
    assert.equal(slide.discount,d.promotion?.percent || 0);
  }
});

test('solo quedan los destinos aprobados y cada uno tiene un aeropuerto identificado', () => {
  for(const id of ['la-ceiba','copan','yojoa','antigua','dolomitas','kioto']) assert.ok(!destinations.some(d=>d.id===id));
  for(const d of destinations){assert.match(d.airport.code,/^[A-Z]{3}$/);assert.ok(d.airport.name);}
  const sanJose=destinations.find(d=>d.id==='san-jose');
  assert.equal(sanJose.country,'Costa Rica');assert.equal(sanJose.airport.code,'SJO');
  assert.equal(sanJose.region,'internacional');
  assert.ok(destinations.filter(d=>d.region==='internacional').length>destinations.filter(d=>d.region==='honduras').length);
});

test('cada hospedaje tiene una fotografía distinta con autor y licencia', async () => {
  const photos=JSON.parse(await readFile(new URL('imagenes-viajes/CREDITOS-HOTELES.json', new URL('../public/', import.meta.url)),'utf8'));
  const hashes=new Set(),sources=new Set();
  const hotels=destinations.flatMap(d=>d.hotels);
  assert.equal(photos.length,hotels.length);
  for(const hotel of hotels){
    const credit=photos.find(p=>p.id===hotel.id);
    assert.equal(hotel.image,credit.file);
    assert.ok(hotel.photoAuthor && hotel.photoLicense && hotel.imageAlt);
    assert.equal(new URL(hotel.photoSource).hostname,'commons.wikimedia.org');
    const data=await readFile(new URL(`imagenes-viajes/${hotel.image}`, new URL('../public/', import.meta.url)));
    assert.equal(data.readUInt16BE(0),0xffd8,'Debe ser un JPEG válido');
    const hash=createHash('sha256').update(data).digest('hex');
    assert.ok(!hashes.has(hash),`Imagen repetida: ${hotel.id}`);
    assert.ok(!sources.has(hotel.photoSource),`Fuente repetida: ${hotel.id}`);
    hashes.add(hash);sources.add(hotel.photoSource);
  }
});

test('los 40 destinos tienen presupuestos, hospedajes e imágenes locales', async () => {
  assert.equal(destinations.length, 40);
  assert.equal(new Set(destinations.map(d=>d.id)).size, 40);
  const hotelIds = new Set();
  for (const d of destinations) {
    assert.ok(d.inspirationBudget > 0);
    assert.ok(d.hotels.length >= 3);
    await access(new URL(d.image, new URL('../public/', import.meta.url)));
    for (const h of d.hotels) {
      assert.ok(!hotelIds.has(h.id)); hotelIds.add(h.id);
      assert.ok(h.rate > 0);
      await access(new URL(`imagenes-viajes/${h.image}`, new URL('../public/', import.meta.url)));
    }
  }
  assert.equal(hotelIds.size, 156);
});

test('cada ruta ofrece seis opciones estables y enlaces oficiales HTTPS', () => {
  const hosts = new Set(['www.cmairlines.com','www.avianca.com','www.copaair.com','www.aa.com','www.iberia.com']);
  for (const d of destinations) for (const origin of origins) {
    const options = flights(d, origin);
    assert.equal(options.length, d.arrival===origin?0:6);
    assert.equal(new Set(options.map(f=>f.id)).size, options.length);
    for (const f of options) {
      const url = new URL(f.airline.url);
      assert.equal(url.protocol,'https:'); assert.ok(hosts.has(url.hostname));
      assert.match(f.code,/^DEMO /);
      assert.ok(f.economy > 0 && f.executive > f.economy);
    }
  }
  const existing = flights(destinations[0], origins[0])[0];
  assert.equal(existing.id,'roatan-0-0');
  assert.equal(existing.economy,3200);
});

 test('el inicio muestra seis destacados y permite encontrar los demás al filtrar', () => {
 const select=context.window.RumboViajesDatos.selectHomeDestinations;
 const featured=select(destinations,true);
 assert.equal(featured.length,6);
 assert.equal(new Set(featured.map(d=>d.id)).size,6);
 assert.ok(featured.some(d=>d.id==='lisboa'));
 assert.equal(select(destinations).length,6);
 assert.equal(select(destinations.filter(d=>d.id==='toronto'))[0].id,'toronto');
 assert.equal(select([]).length,0);
 });
 test('el catálogo conectado incorpora las nuevas propuestas sin duplicar ni reemplazar datos SQL', () => {
 const existing=JSON.parse(JSON.stringify(destinations.slice(0,14)));
 const custom={...JSON.parse(JSON.stringify(destinations.find(d=>d.id==='londres'))),name:'Londres SQL',economy:12345};
 const scope={window:{RumboDatabase:{connected:true,catalog:{destinations:[...existing,custom],rooms:{},origins:['Tegucigalpa'],promotions:{}}}}};
 vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),scope);
 const actual=scope.window.RumboViajesDatos.destinations;
 assert.equal(actual.length,40);assert.equal(actual.find(d=>d.id==='londres').economy,12345);
 assert.equal(new Set(actual.map(d=>d.id)).size,40);
 });
