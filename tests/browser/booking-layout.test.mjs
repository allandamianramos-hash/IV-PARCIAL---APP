import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {completeBookingForm} from './booking-helpers.mjs';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
const pages=[['servicios','servicios.html'],['vuelos','viajes.html?pantalla=vuelos'],['hoteles','viajes.html?pantalla=hoteles'],['traslados','servicios.html?seccion=traslados'],['seguros','servicios.html?seccion=seguros'],['guias','servicios.html?seccion=guias'],['tienda','tienda.html'],['resumen','servicios.html?seccion=mi-viaje']];

test('service screens share navigation and fit desktop and mobile without clipped controls',async()=>{
 const browser=await launch();await mkdir('.runtime/booking-qa',{recursive:true});
 try{const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];
  page.on('pageerror',error=>{if(!error.message.startsWith('Transition was aborted'))errors.push(error.message);});
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});
   for(const [name,path]of pages){
    await page.goto(base+'/'+path,{waitUntil:'networkidle'});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    assert.equal(await page.locator('body.booking-page').count(),1,name);
    assert.equal(await page.locator('.journey-progress a').count(),['servicios','tienda'].includes(name)?0:6,name);
    assert.equal(await page.locator('.page-back').count(),0,name);
    assert.equal(await page.locator('.guide-catalog-facts').count(),0);
    if(!['servicios','resumen','tienda'].includes(name)){
     const toolbar=await page.locator('.booking-navigation').boundingBox(),cover=await page.locator('.section-hero').boundingBox();
     assert.ok(toolbar.y+toolbar.height<=cover.y-20,name+' navigation has its own space above the cover');
     assert.equal(await page.locator('.booking-navigation .page-back').count(),0,name);
    }
    if(name==='guias'){
     assert.equal(await page.locator('.section-hero figcaption').count(),0);
     assert.ok(await page.locator('#guide-cover').evaluate(img=>img.naturalWidth>=2560));
     const photo=await page.locator('#guide-cover').getAttribute('src');
     await page.locator('#destination').selectOption('paris');
     assert.equal(await page.locator('#guide-cover').getAttribute('src'),photo);
     assert.equal(await page.locator('#guide-results-title').textContent(),'Recorridos en París');
    }
    if(!['servicios','tienda'].includes(name)&&width<600){
     const current=await page.locator('.journey-progress [aria-current]').boundingBox();assert.ok(current.x>=0&&current.x+current.width<=width+1,name+' current step is visible');
    }
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' '+width+' overflows');
    const clipped=await page.evaluate(()=>[...document.querySelectorAll('main input,main select,main button')].filter(el=>{const b=el.getBoundingClientRect();return b.width>0&&b.height>0&&(b.left< -1||b.right>innerWidth+1);}).map(el=>el.id||el.className));
    assert.deepEqual(clipped,[],name+' '+width);
    await page.screenshot({path:'.runtime/booking-qa/'+name+'-'+width+'.png'});
   }
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('service navigation preserves selections and completes the trip independently of the store',async()=>{
 const browser=await launch();
 try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const failures=[];
  page.on('response',r=>{if(r.url().includes('/api/state')&&r.status()>=400)failures.push(r.status());});
  await page.goto(base+'/viajes.html?pantalla=detalle-destino&destino=roatan');await page.locator('#detail-form').waitFor();
  await completeBookingForm(page);
  await page.locator('#detail-form button[value=vuelos]').click();await page.waitForURL(/pantalla=vuelos/);
  await completeBookingForm(page);
  await page.locator('[data-select-flight]').first().click();await page.locator('#continue-hotel').click();await page.waitForURL(/pantalla=hoteles/);
  await completeBookingForm(page);
  await page.locator('[data-select-hotel]:not([disabled])').first().click();
  const selectedTrip=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.integrante2.viaje.v1')));
  await page.locator('.journey-progress a[href*=vuelos]').click();await page.waitForURL(/pantalla=vuelos/);
  assert.equal(await page.locator('[data-select-flight][aria-pressed=true]').count(),1,'back retains the selected flight');
  assert.equal(await page.locator('.page-back').count(),0);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.integrante2.viaje.v1'))),selectedTrip);
  await page.locator('#continue-hotel').click();await page.waitForURL(/pantalla=hoteles/);
  assert.equal(await page.locator('[data-select-hotel][aria-pressed=true]').count(),1,'back retains the selected hotel');
  await page.locator('#save-selection').click();await page.waitForURL(/seccion=traslados/);
  await completeBookingForm(page);
  await page.locator('[data-choose]').first().click();await page.locator('#save-service').click();await page.waitForURL(/seccion=seguros/);
  await completeBookingForm(page);
  await page.locator('[data-choose]').first().click();await page.locator('#save-service').click();await page.waitForURL(/seccion=guias/);
  await completeBookingForm(page);
  await page.locator('[data-guide-choose]').first().click();await page.locator('#guide-save').click();
  await page.waitForFunction(()=>!window.RumboStorage.hasPending());
  const selections=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.services.v1')));
  assert.deepEqual(selections.map(x=>x.section).sort(),['guias','seguros','traslados']);assert.ok(selections.every(x=>x.total>0));
  await page.locator('.main-nav a[href="tienda.html"]').click();await page.waitForURL(/tienda.html/);assert.ok(await page.locator('.product-card').count()>0);
  await page.locator('.header-trip').click();await page.waitForURL(/seccion=mi-viaje/);assert.equal(await page.locator('.journey-item').count(),5);assert.deepEqual(failures,[]);
  await page.locator('[data-remove-item]').first().click();
  await page.locator('.journey-undo').waitFor();assert.equal(await page.locator('.page-back').count(),0,'summary updates do not reintroduce back arrows');
  await page.locator('.journey-undo').click();assert.equal(await page.locator('.journey-item').count(),5);
 }finally{await browser.close();}
});
