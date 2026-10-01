import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { validState } from '../backend/node/database-api.mjs';

const source = await readFile(new URL('servicios.js', new URL('../public/', import.meta.url)), 'utf8');
const travelSource = await readFile(new URL('viajes.js', new URL('../public/', import.meta.url)), 'utf8');
const data = { window: {} };
vm.runInNewContext(travelSource.slice(0, travelSource.indexOf('/* Abre una')), data);
const catalog = data.window.RumboViajesDatos;
vm.runInNewContext(await readFile(new URL('guias-catalogo.js', new URL('../public/', import.meta.url)), 'utf8'), data);
const experiences = data.window.RumboGuias;

// Small DOM boundary for exercising the actual page event handlers and storage.
function page(query = '', stored = {}) {
  const nodes = new Map(), storage = new Map(Object.entries(stored));
  const fields = ['destination','date','people','language','time'];
  let choices = [];
  const filters = ['all','cultura','naturaleza','playa','gastronomia'].map(value => ({
    dataset: { guideFilter: value }, events: {},
    setAttribute() {}, addEventListener(type, fn) { this.events[type] = fn; }
  }));
  function node(id) {
    if (nodes.has(id)) return nodes.get(id);
    const element = {
      value: '', events: {}, dataset: {}, disabled: false, textContent: '',
      setAttribute() {}, append() {}, addEventListener(type, fn) { this.events[type] = fn; },
      checkValidity() {
        if (id === 'people') return Number.isInteger(+this.value) && +this.value >= 1 && +this.value <= 12;
        if (id === 'date') return /^\d{4}-\d{2}-\d{2}$/.test(this.value) && this.value >= this.min;
        return !!this.value;
      },
      get innerHTML() { return this.html || ''; },
      set innerHTML(html) {
        this.html = html;
        if (id === 'guide-results') choices = [...html.matchAll(/data-guide-choose="([^"]+)"/g)].map(([,value]) => {
          const article = { dataset: {} };
          return { dataset:{guideChoose:value}, setAttribute(){}, closest:()=>article, after(){} };
        });
      }
    };
    nodes.set(id, element); return element;
  }
  const root = {
    classList:{add(){}},
    set innerHTML(html) {
      for (const [,id,,value] of html.matchAll(/<input id="([^"]+)"[^>]*type="([^"]+)" value="([^"]*)"/g)) node(id).value=value;
      node('date').min = node('date').value;
      node('language').value='es'; node('time').value='09:00'; node('guide-sort').value='recommended';
    },
    querySelector: selector => node(selector.slice(1)),
    querySelectorAll: selector => selector === '[data-guide-filter]' ? filters : selector === '.guide-review-link' ? [] : choices
  };
  const form = node('guide-form');
  form.elements = Object.fromEntries(fields.map(id=>[id,node(id)]));
  form.checkValidity = form.reportValidity = () => fields.every(id=>node(id).checkValidity());
  vm.runInNewContext(source, {
    window:{RumboViajesDatos:catalog,RumboGuias:experiences,addEventListener(){}}, document:{querySelector:()=>root,createElement:()=>({})},
    location:{search:'?seccion=guias'+query}, URLSearchParams, Intl, Date, setTimeout,
    localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},
    FormData: class { *[Symbol.iterator]() { for(const id of fields) yield [id,String(node(id).value)]; } }
  });
  return {
    node, storage,
    change(id,value) { node(id).value=value; form.events.input(); },
    choose() { const button=choices[0]; assert.ok(button);node('guide-results').events.click({target:{closest:()=>button}}); },
    filter(value) { filters.find(b=>b.dataset.guideFilter===value).events.click(); },
    save() { node('guide-save').events.click(); }
  };
}

test('todos los destinos muestran sus propias actividades e imagen', () => {
  for (const d of catalog.destinations) {
    const ui=page('&destino='+d.id);
    assert.equal(ui.node('guide-cover').src,d.id==='roatan'?'imagenes-viajes/guia-roatan-portada.jpg':d.image);
    assert.equal(ui.node('guide-results-title').textContent,'Recorridos en '+d.name);
    for(const {title} of experiences.filter(e=>e.destination===d.id)) assert.ok(ui.node('guide-results').innerHTML.includes(title));
    assert.ok(ui.node('guide-destination-link').href.includes('pantalla=detalle-destino'));
  }
});

test('el enlace de destino prevalece sobre una elección guardada', () => {
  const ui=page('&destino=bali',{'rumbo.services.v1':JSON.stringify([{section:'guias',title:'Anterior',detail:'Anterior',total:760,values:{destination:'roatan'}}])});
  assert.equal(ui.node('destination').value,'bali');
});

test('los filtros vacíos permiten recuperar todas las experiencias', () => {
  const ui=page('&destino=paris');ui.filter('playa');
  assert.match(ui.node('guide-results').innerHTML,/No hay propuestas/);
  ui.node('guide-clear').events.click();
  assert.match(ui.node('guide-count').textContent,/4 experiencias/);
});

test('guardar calcula el grupo, conserva otros servicios y restaura la selección', () => {
  const other={section:'seguros',title:'Seguro',detail:'Detalle',total:35,values:{people:'1'}};
  const ui=page('&destino=bali',{'rumbo.services.v1':JSON.stringify([other])});
  ui.change('people','4');ui.choose();ui.save();
  const result=JSON.parse(ui.storage.get('rumbo.services.v1'));
  assert.equal(result.length,2);assert.equal(result[0].section,'seguros');
  assert.equal(result[1].total,2200);assert.equal(result[1].destinationId,'bali');
  assert.equal(result[1].values.people,'4');assert.ok(validState('rumbo.services.v1',result));
  const restored=page('',Object.fromEntries(ui.storage));
  assert.equal(restored.node('guide-save').disabled,false);
  assert.match(restored.node('guide-selection').innerHTML,/Senderos y arrozales de Ubud/);
});

test('cada recorrido tiene una foto local distinta, licencia y paradas específicas', async () => {
  const credits=JSON.parse(await readFile(new URL('imagenes-viajes/CREDITOS-GUIAS.json', new URL('../public/', import.meta.url)),'utf8'));
  const hashes=new Set();
  assert.equal(experiences.length,56);
  for(const item of experiences){
    const photo=await readFile(new URL(item.image, new URL('../public/', import.meta.url)));
    assert.equal(photo.readUInt16BE(0),0xffd8,item.id+' debe ser JPEG');
    const hash=createHash('sha256').update(photo).digest('hex');
    assert.ok(!hashes.has(hash),item.id+' repite foto');hashes.add(hash);
    assert.ok(item.stops.length>=3);assert.ok(item.description.length>50);
    assert.ok(credits.some(c=>c.id===item.id&&c.author&&c.license&&c.commons===item.photoPage));
  }
  for(const d of catalog.destinations){
    const items=experiences.filter(e=>e.destination===d.id);
    assert.equal(items.length,4);assert.ok(items.some(e=>e.style==='naturaleza'));
    assert.ok(new Set(items.map(e=>e.style)).size>=2);
  }
});

test('cambiar personas recalcula la selección y cambiar ciudad restablece las categorías',()=>{
  const ui=page('&destino=roatan');ui.filter('playa');ui.choose();ui.change('people','3');
  assert.equal(ui.node('guide-save').disabled,false);ui.save();
  assert.equal(JSON.parse(ui.storage.get('rumbo.services.v1'))[0].total,1140);
  ui.change('destination','paris');
  assert.match(ui.node('guide-count').textContent,/4 experiencias/);
  assert.equal(ui.node('guide-save').disabled,true);
});

test('cambiar preferencias invalida la selección y no permite guardar valores inválidos', () => {
  const ui=page();ui.choose();ui.change('people','13');ui.save();
  assert.equal(ui.node('guide-save').disabled,true);
  assert.equal(ui.storage.has('rumbo.services.v1'),false);
  ui.change('people','2');ui.choose();ui.change('date','2000-01-01');ui.save();
  assert.equal(ui.storage.has('rumbo.services.v1'),false);
  ui.change('date','2099-01-01');ui.choose();ui.change('destination','roma');
  assert.equal(ui.node('guide-save').disabled,true);
});
