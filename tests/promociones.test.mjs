import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('viajes.js', new URL('../public/', import.meta.url)), 'utf8');
const journey = await readFile(new URL('journey.js', new URL('../public/', import.meta.url)), 'utf8');
function setup() {
  const data = new Map();
  const scope = { window: {}, document: { querySelector: () => null }, localStorage: { getItem: k => data.get(k) || null, setItem: (k,v) => data.set(k,v) } };
  vm.createContext(scope);
  vm.runInContext(source.slice(0, source.indexOf('/* Abre una')), scope);
  vm.runInContext(journey, scope);
  return { catalog: scope.window.RumboViajesDatos, journey: scope.window.RumboJourney, data };
}
test('ofertas anunciadas coinciden con los importes de vuelo y no se acumulan', () => {
  const { catalog } = setup();
  for (const [id, percent, economy, executive] of [['cancun',25,5400,8910], ['madrid',25,14625,24131.25], ['venecia',20,18000,29700]]) {
    const d = catalog.destinations.find(d => d.id === id);
    const f = catalog.flights(d, 'Tegucigalpa')[0];
    assert.equal(f.discountPercent, percent);
    assert.equal(f.economy, economy);
    assert.equal(f.executive, executive);
    assert.equal(catalog.flights(d, 'Tegucigalpa')[0].economy, economy);
    for (const origin of catalog.origins) for (const option of catalog.flights(d, origin)) {
      assert.equal(option.economy, Math.round(option.baseEconomy * (100-percent)) / 100);
      assert.equal(option.executive, Math.round(option.baseExecutive * (100-percent)) / 100);
    }
    assert.equal(d.originalInspirationBudget - d.inspirationBudget, f.baseEconomy - f.economy);
  }
  const normal = catalog.flights(catalog.destinations.find(d => d.id === 'roatan'), 'Tegucigalpa')[0];
  assert.equal(normal.economy, 3200);
  assert.equal(normal.discountPercent, 0);
});
test('Mi viaje aplica una sola vez el descuento a cada pasajero y conserva el hotel', () => {
  const { catalog, journey, data } = setup();
  const d = catalog.destinations.find(d => d.id === 'madrid');
  const hotel = d.hotels[0];
  for (const [cabin, expected] of [['economica',13893.75], ['ejecutiva',22924.69]]) {
    data.set('rumbo.integrante2.viaje.v1', JSON.stringify({ destinationId:'madrid',origin:'Tegucigalpa',date:'2099-10-12',checkIn:'2099-10-12',travelers:3,nights:6,cabin,rooms:2,roomType:'estandar',flightId:'madrid-0-0',hotelId:hotel.id }));
    const s = journey.snapshot();
    assert.equal(s.issues.length, 0);
    assert.equal(s.items.find(i => i.key === 'vuelos').total, expected * 3);
    assert.match(s.items.find(i => i.key === 'vuelos').detail, /28.75% de descuento aplicado/);
    assert.equal(s.items.find(i => i.key === 'hoteles').total, hotel.rate * 12);
    assert.equal(s.total, expected * 3 + hotel.rate * 12);
  }
});

test('las cuatro campañas configuradas conservan precios y recursos reales', async () => {
  const html = await readFile(new URL('index.html', new URL('../public/', import.meta.url)), 'utf8');
  const script = html.match(/<script id="rumbo-hero-script">([\s\S]*?)<\/script>/)[1];
  const config = vm.runInNewContext(script.slice(0, script.indexOf("document.addEventListener('DOMContentLoaded'")) + '\nRUMBO_HERO_CONFIG');
  const { catalog } = setup();
  assert.equal(config.slides.length, 4);
  for (const slide of config.slides) {
    assert.ok(slide.photos.length >= 2);
    for (const photo of slide.photos) assert.ok((await readFile(new URL(photo.src, new URL('../public/', import.meta.url)))).length > 1000);
    if (!slide.price) {
      if(slide.id!=='viaje-en-grupo'){assert.equal(slide.tag,null);continue;}
      assert.equal(slide.tag.text, '−5%');
      const d=catalog.destinations.find(d=>d.id==='madrid');
      assert.equal(catalog.flights(d,'Tegucigalpa',3)[0].groupDiscount,5);
      assert.equal(catalog.flights(d,'Tegucigalpa',2)[0].groupDiscount,0);
      continue;
    }
    const flight = catalog.flights(catalog.destinations.find(d => d.id === slide.id), 'Tegucigalpa')[0];
    assert.equal(slide.price.original, flight.baseEconomy);
    assert.equal(slide.price.current, flight.economy);
    assert.equal(slide.expires, null);
  }
});
