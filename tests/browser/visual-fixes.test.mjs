import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {completeBookingForm} from './booking-helpers.mjs';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
const services=[['viajes.html?pantalla=vuelos','#flight-search'],['viajes.html?pantalla=hoteles','#hotel-search'],['servicios.html?seccion=traslados','#service-search'],['servicios.html?seccion=seguros','#service-search'],['servicios.html?seccion=guias','#guide-form']];

test('fresh services have empty fields, require choices and ignore old automatic defaults',async()=>{
 const browser=await launch();
 try{
  for(const [path,form] of services){
   const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/'+path);
   await page.locator(form).waitFor();
   assert.deepEqual(await page.locator(form+' input,'+form+' select').evaluateAll(es=>es.filter(e=>e.value!=='').map(e=>[e.id,e.value])),[],path);
   assert.equal(await page.locator(form).evaluate(el=>el.checkValidity()),false);
   assert.equal(await page.locator('[data-select-flight],[data-select-hotel],[data-choose],[data-guide-choose]').count(),0);
   await completeBookingForm(page);
   assert.ok(await page.locator('[data-select-flight]:enabled,[data-select-hotel]:enabled,[data-choose]:enabled,[data-guide-choose]:enabled').count()>0,path);
   assert.deepEqual(errors,[]);await page.close();
  }
  const page=await browser.newPage();
  await page.addInitScript(()=>localStorage.setItem('rumbo.integrante2.viaje.v1',JSON.stringify({destinationId:'venecia',origin:'Tegucigalpa',date:'2099-10-12',travelers:1,nights:3,rooms:1,cabin:'economica',flightId:'',hotelId:''})));
  await page.goto(base+'/viajes.html?pantalla=vuelos');
  assert.equal(await page.locator('#flight-destination').inputValue(),'');
  await page.goto(base+'/servicios.html?seccion=guias');
  assert.equal(await page.locator('#destination').inputValue(),'');
  await completeBookingForm(page);await page.locator('#guide-form button[type=reset]').click();
  await page.waitForFunction(()=>document.querySelector('#destination').value==='');
  assert.deepEqual(await page.locator('#guide-form input,#guide-form select').evaluateAll(es=>es.filter(e=>e.value).map(e=>e.id)),[]);
 }finally{await browser.close();}
});

test('Rumbito hides only in the home hero and stays usable over every other hero',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto(base);await page.locator('#chat-launcher').waitFor({state:'attached'});
  assert.equal(await page.locator('#chat-launcher').isVisible(),false);
  await page.locator('#servicios').scrollIntoViewIfNeeded();await page.locator('#chat-launcher').waitFor({state:'visible'});
  await page.evaluate(()=>scrollTo(0,0));await page.locator('#chat-launcher').waitFor({state:'hidden'});
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   for(const path of ['servicios.html','tienda.html','viajes.html?pantalla=destinos',...services.map(([path])=>path)]){
    await page.goto(base+'/'+path);await page.locator('#chat-launcher').click();
    await page.locator('#help-chat').waitFor({state:'visible'});
    await page.evaluate(()=>scrollTo(0,450));await page.evaluate(()=>scrollTo(0,0));
    assert.equal(await page.locator('#help-chat').isVisible(),true,path);
    await page.locator('#close-chat').click();await page.locator('#help-chat').waitFor({state:'hidden'});
   }
  }
 }finally{await browser.close();}
});

test('all currencies keep comma grouping through language changes and preserve base amounts',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  const rates=Object.fromEntries(['HNL','USD','MXN','EUR','GBP','CAD','BRL','JPY','KRW','CNY','AED','GTQ','CRC','COP','ARS','CLP','PEN'].map(c=>[c,c==='HNL'?1:2]));
  await page.route('**/api/exchange-rates',route=>route.fulfill({json:{base:'HNL',date:'2026-10-09',rates}}));
  await page.goto(base);await page.locator('.locale-toggle').waitFor();
  await page.evaluate(()=>{const p=document.createElement('p');p.id='money-fixture';p.textContent='L 30000 · L 3.000 · L 1,234.50.';document.querySelector('main').append(p);});
  const langs=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
  const regions=await page.locator('#rumbo-region option').evaluateAll(es=>es.map(e=>e.value));
  for(let i=0;i<regions.length;i++){
   await page.locator('.locale-toggle').click();await page.locator('#rumbo-language').selectOption(langs[i%langs.length]);await page.locator('#rumbo-region').selectOption(regions[i]);await page.locator('[data-apply]').click();await page.locator('.locale-dialog:has(#rumbo-language)').waitFor({state:'hidden'});
   const amount=await page.evaluate(()=>window.RumboLocale.formatMoney(30000));
   assert.match(amount,regions[i]==='HN'?/30,000/:/60,000/,regions[i]);
   assert.doesNotMatch(await page.locator('.hero-fare-wrap').innerText(),/\d\.\d{3}(?:\D|$)/);
  }
  await page.locator('.locale-toggle').click();await page.locator('#rumbo-region').selectOption('HN');await page.locator('#rumbo-language').selectOption('es');await page.locator('[data-apply]').click();await page.locator('.locale-dialog:has(#rumbo-language)').waitFor({state:'hidden'});
  assert.equal(await page.locator('#money-fixture').innerText(),'L 30,000 · L 3,000 · L 1,234.50.');
 }finally{await browser.close();}
});

test('destination cards frame complete photographs and fit mobile and desktop',async()=>{
 const browser=await launch();await mkdir('.runtime/visual-fixes',{recursive:true});
 try{const page=await browser.newPage({reducedMotion:'reduce'});
  for(const width of [1440,768,390,320]){
   await page.setViewportSize({width,height:1000});await page.goto(base+'/viajes.html?pantalla=destinos');
   await page.locator('.rv-destination-card').first().scrollIntoViewIfNeeded();
   await page.locator('.rv-destination-card img').first().evaluate(img=>img.decode());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const cards=await page.locator('.rv-destination-card').evaluateAll(es=>es.map(el=>{const s=getComputedStyle(el);return {border:s.borderTopWidth,background:s.backgroundColor,overflow:el.scrollWidth>el.clientWidth+1};}));
   assert.ok(cards.every(c=>c.border==='1px'&&c.background!=='rgba(0, 0, 0, 0)'&&!c.overflow));
   await page.screenshot({path:'.runtime/visual-fixes/destinations-'+width+'.png'});
   await page.goto(base);await page.locator('#destinations-track .destination-card').first().scrollIntoViewIfNeeded();
   await page.locator('#destinations-track img').first().evaluate(img=>img.decode());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:'.runtime/visual-fixes/home-destinations-'+width+'.png'});
  }
 }finally{await browser.close();}
});
