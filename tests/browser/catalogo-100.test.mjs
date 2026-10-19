import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import vm from 'node:vm';
import {completeBookingForm} from './booking-helpers.mjs';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const cities=JSON.parse(await readFile(new URL('../../docs/catalogo-100/ciudades.json',import.meta.url),'utf8'));
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
async function dismissCookies(page){
  const necessary=page.getByRole('button',{name:'Solo necesarias',exact:true});
  if(await necessary.isVisible())await necessary.click();
}
async function showSummary(page){
  await dismissCookies(page);
  const dock=page.locator('.mobile-selection-dock');
  if(await dock.isVisible()){await dock.click();await page.locator('#mobile-selection-panel').waitFor({state:'visible'});}
}
const source=await readFile(new URL('../../public/js/destinos/viajes.js',import.meta.url),'utf8');
const data={window:{}};vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),data);
const {destinations,rooms,origins,promotions}=data.window.RumboViajesDatos;
const newIds=new Set(cities.map(d=>d.id));
// Deterministic connected-catalogue fixture: older SQL rows plus real HTTP assets.
// Exercises revisioned saves without changing shared users or requiring Azure access.
async function mockDatabase(page){
  const state={},catalog={destinations:destinations.filter(d=>!newIds.has(d.id)),rooms,origins,promotions,products:[],productOptions:{},optionAdjustments:{}};
  await page.route('**/*.html?*',async route=>{
    const response=await route.fetch();let html=await response.text();
    const boot={connected:true,visitor:'new-destinations-test',user:null,catalog,state};
    html=html.replace(/<script id="rumbo-bootstrap" type="application\/json">.*?<\/script>/s,`<script id="rumbo-bootstrap" type="application/json">${JSON.stringify(boot).replaceAll('<','\\u003c')}</script>`);
    html=html.replace('</head>','<style>@view-transition { navigation: none; }</style></head>');
    await route.fulfill({response,body:html});
  });
  await page.route('**/api/state',async route=>{
    if(route.request().method()==='GET')return route.fulfill({json:{visitor:'new-destinations-test',state}});
    const {changes}=route.request().postDataJSON();
    for(const [key,change]of Object.entries(changes)){
      assert.equal(change.revision,state[key]?.revision||0);
      state[key]={value:change.value,revision:change.revision+1};
    }
    return route.fulfill({json:{revisions:Object.fromEntries(Object.keys(changes).map(key=>[key,state[key].revision]))}});
  });
}

test('las 30 fichas nuevas cargan sus fotos, aeropuerto, actividades y enlaces de servicios',async()=>{
  const browser=await launch();
  try{
    const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
    await mockDatabase(page);
    page.on('pageerror',e=>{if(!e.message.startsWith('Transition was aborted'))errors.push(e.message);});
    for(const city of cities){
      await page.goto(`${base}/viajes.html?pantalla=detalle-destino&destino=${city.id}`);
      await page.locator('#detail-form').waitFor();
      assert.ok((await page.locator('main').innerText()).includes(city.name),city.id);
      const data=await page.evaluate(id=>{
        const d=window.RumboViajesDatos.destinations.find(d=>d.id===id);
        return {count:window.RumboViajesDatos.destinations.length,code:d.airport.code,image:d.image};
      },city.id);
      assert.equal(data.count,100);assert.equal(data.code,city.code);
      const image=page.locator(`main img[src="${data.image}"]`);
      await image.evaluate(img=>img.decode());
      assert.ok(await image.evaluate(img=>img.naturalWidth>0),city.id);
      const originalWidth=await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();return img.naturalWidth;},data.image);
      assert.ok(originalWidth>=1600,city.id);
      for(const section of ['traslados','seguros','guias']) assert.equal(await page.locator(`main a[href="servicios.html?seccion=${section}&destino=${city.id}"]`).count(),1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),city.id);
    }
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});

test('los nuevos viajes completan vuelo, hotel, traslado, seguro, guía y resumen en escritorio y móvil',async()=>{
  const browser=await launch();
  await mkdir('.runtime/catalogo-100-qa',{recursive:true});
  try{
    for(const [id,width] of [['porto',1440],['cusco',390],['auckland',320]]){
      const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];
      await mockDatabase(page);
      page.on('pageerror',e=>{if(!e.message.startsWith('Transition was aborted'))errors.push(e.message);});
      await page.goto(`${base}/viajes.html?pantalla=detalle-destino&destino=${id}`);
      await completeBookingForm(page);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`.runtime/catalogo-100-qa/${id}-detalle-${width}.png`});
      await page.locator('#detail-form button[value=vuelos]').click();
      await page.waitForURL(/pantalla=vuelos/);await completeBookingForm(page);
      assert.equal(await page.locator('[data-select-flight]').count(),6);
      await page.locator('[data-select-flight]').first().click();await showSummary(page);await page.locator('#continue-hotel').click();
      await page.waitForURL(/pantalla=hoteles/);await completeBookingForm(page);
      assert.equal(await page.locator('[data-select-hotel]').count(),5);
      await page.locator('[data-select-hotel]:not([disabled])').first().click();await showSummary(page);await page.locator('#save-selection').click();
      await page.waitForURL(/seccion=traslados/);await completeBookingForm(page);
      assert.equal(await page.locator('#route').inputValue(),id); assert.equal(await page.locator('[data-choose]').count(),3);
      await page.locator('[data-choose]').first().click();await showSummary(page);await page.locator('#save-service').click();
      await page.waitForURL(/seccion=seguros/);await completeBookingForm(page);
      assert.equal(await page.locator('#destination').inputValue(),id); assert.equal(await page.locator('[data-choose]').count(),4);
      await page.locator('[data-choose]').first().click();await showSummary(page);await page.locator('#save-service').click();
      await page.waitForURL(/seccion=guias/);await completeBookingForm(page);
      assert.equal(await page.locator('[data-guide-choose]').count(),10);
      await page.locator('[data-guide-choose]').first().click();await showSummary(page);await page.locator('#guide-save').click();
      await page.waitForFunction(()=>!window.RumboStorage.hasPending());
      const records=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.services.v1')));
      assert.deepEqual(records.map(r=>r.section).sort(),['guias','seguros','traslados']);
      assert.ok(records.every(r=>r.destinationId===id&&r.total>0));
      await page.goto(`${base}/servicios.html?seccion=mi-viaje`);
      await page.locator('.journey-item').first().waitFor();
      assert.equal(await page.locator('.journey-item').count(),5);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      await page.screenshot({path:`.runtime/catalogo-100-qa/${id}-resumen-${width}.png`});
      await page.reload();await page.locator('.journey-item').first().waitFor();
      assert.equal(await page.locator('.journey-item').count(),5);
      await showSummary(page);
      assert.ok(await page.locator('#complete-demo').isVisible());
      const summary=await page.locator('main').innerText();
      assert.ok(summary.includes(cities.find(d=>d.id===id).name));
      assert.doesNotMatch(summary,/NaN|undefined/);
      assert.deepEqual(errors,[]);
      await page.close();
    }
  }finally{await browser.close();}
});

test('inicio encuentra las ciudades nuevas y conserva seis destacados y los filtros al abrir el catálogo',async()=>{
  const browser=await launch();
  try{
    const page=await browser.newPage({reducedMotion:'reduce'});await mockDatabase(page);
    await page.goto(base+'/index.html?ampliacion=2026');
    await page.locator('.destination-card').first().waitFor();
    assert.equal(await page.locator('.destination-card').count(),6);
    for(const id of ['porto','cusco','auckland']){
      const d=cities.find(d=>d.id===id);
      await page.locator('#destination').fill(d.name);
      await page.locator('#travel-search').evaluate(form=>form.requestSubmit());
      assert.equal(await page.locator('.destination-card').count(),1);
      assert.ok((await page.locator('.destination-card').innerText()).includes(d.name));
    }
    await page.locator('#all-destinations').click();
    await page.waitForURL(/pantalla=destinos/);
    assert.equal(await page.locator('.rv-destination-card').count(),1);
    assert.ok((await page.locator('.rv-destination-card').innerText()).includes('Auckland'));
  }finally{await browser.close();}
});

