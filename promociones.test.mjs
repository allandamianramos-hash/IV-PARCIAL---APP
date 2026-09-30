import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('viajes.js', import.meta.url), 'utf8');
const journey = await readFile(new URL('journey.js', import.meta.url), 'utf8');
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
  for (const [id, percent, economy, executive] of [['cancun',25,5400,8910], ['madrid',25,14625,24131.25], ['dolomitas',20,18000,29700]]) {
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
  for (const [cabin, expected] of [['economica',14625], ['ejecutiva',24131.25]]) {
    data.set('rumbo.integrante2.viaje.v1', JSON.stringify({ destinationId:'madrid',origin:'Tegucigalpa',date:'2099-10-12',checkIn:'2099-10-12',travelers:3,nights:6,cabin,rooms:2,roomType:'estandar',flightId:'madrid-0-0',hotelId:hotel.id }));
    const s = journey.snapshot();
    assert.equal(s.issues.length, 0);
    assert.equal(s.items.find(i => i.key === 'vuelos').total, expected * 3);
    assert.match(s.items.find(i => i.key === 'vuelos').detail, /25% de descuento aplicado/);
    assert.equal(s.items.find(i => i.key === 'hoteles').total, hotel.rate * 12);
    assert.equal(s.total, expected * 3 + hotel.rate * 12);
  }
});
