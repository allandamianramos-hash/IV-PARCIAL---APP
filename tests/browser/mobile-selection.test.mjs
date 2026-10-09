import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {completeBookingForm} from './booking-helpers.mjs';

const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
async function fits(page,selector){
 const issues=await page.locator(selector).evaluateAll(elements=>elements.flatMap(el=>{
  const r=el.getBoundingClientRect();
  if(!r.width||!r.height||el.closest('dialog:not([open]),.sr-only,.journey-progress'))return [];
  return r.left< -1||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+2?[el.id||el.className]:[];
 }));
 assert.deepEqual(issues,[]);
}
async function openSelection(page){
 await page.locator('.mobile-selection-dock').click();
 await page.locator('#mobile-selection-panel').waitFor({state:'visible'});
 await fits(page,'#mobile-selection-panel,#mobile-selection-panel button,#mobile-selection-panel p,#mobile-selection-panel h3');
}

test('mobile selection stays reachable through every booking step and restores desktop controls',async()=>{
 const browser=await launch();await mkdir('.runtime/mobile-qa',{recursive:true});
 try{
  for(const width of [320,390,768]){
   const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>{if(!e.message.startsWith('Transition was aborted'))errors.push(e.message);});
   await page.goto(base+'/viajes.html?pantalla=vuelos');
   await completeBookingForm(page);
   await page.locator('[data-select-flight]').first().click();
   await page.waitForFunction(()=>document.querySelector('.mobile-selection-amount')?.textContent===document.querySelector('#summary-total')?.textContent);
   const scrollBefore=await page.evaluate(()=>scrollY);
   await openSelection(page);
   assert.equal(await page.locator('#resumen-viaje').count(),1);
   await page.keyboard.press('Tab');
   assert.ok(await page.evaluate(()=>document.activeElement.closest('#mobile-selection-panel')!==null));
   await page.keyboard.press('Escape');
   await page.locator('#mobile-selection-panel').waitFor({state:'hidden'});
   assert.ok(await page.locator('.mobile-selection-dock').evaluate(el=>el===document.activeElement));
   assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scrollBefore)<3,'closing keeps list position');
   await openSelection(page);
   await page.setViewportSize({width:1440,height:1000});
   await page.locator('.mobile-selection-dock').waitFor({state:'detached'});
   assert.equal(await page.locator('.rv-flow-layout>#resumen-viaje').count(),1);
   assert.equal(await page.locator('body.selection-open').count(),0);
   await page.setViewportSize({width,height:844});
   await openSelection(page);
   await page.locator('#continue-hotel').click();await page.waitForURL(/pantalla=hoteles/);
   await completeBookingForm(page);
   await page.locator('[data-select-hotel]:not([disabled])').first().click();
   await openSelection(page);
   await page.screenshot({path:`.runtime/mobile-qa/hotel-sheet-${width}.png`});
   await page.locator('#save-selection').click();await page.waitForURL(/seccion=traslados/);
   for(const next of ['seguros','guias']){
    await completeBookingForm(page);
    await page.locator('[data-choose]').first().click();await openSelection(page);
    assert.notEqual(await page.locator('.mobile-selection-amount').innerText(),'—');
    await page.locator('#save-service').click();await page.waitForURL(new RegExp('seccion='+next));
   }
   await completeBookingForm(page);
   await page.locator('[data-guide-choose]').first().click();
   await page.locator('.guide-review-link').click();
   await page.locator('#mobile-selection-panel').waitFor({state:'visible'});
   await page.locator('#guide-save').click();
   await page.waitForFunction(()=>!window.RumboStorage.hasPending());
   await page.locator('.mobile-selection-close').click();
   await page.goto(base+'/servicios.html?seccion=mi-viaje');
   assert.equal(await page.locator('.journey-item').count(),5);
   await openSelection(page);
   await page.locator('#demo-consent').check();await page.locator('#complete-demo').click();
   await page.locator('#download-ticket').waitFor({state:'visible'});
   assert.equal(await page.locator('body.selection-open').count(),0);
   await openSelection(page);
   assert.equal(await page.locator('#mobile-selection-panel').count(),1);
   assert.deepEqual(errors,[]);
   await context.close();
  }
 }finally{await browser.close();}
});

test('mobile sheets handle empty selections, changed filters, language, and small landscape screens',async()=>{
 const browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:320,height:640},reducedMotion:'reduce'});
  await page.goto(base+'/viajes.html?pantalla=vuelos');
  await openSelection(page);assert.ok(await page.locator('#continue-hotel').isDisabled());
  await page.locator('.mobile-selection-close').click();
  await completeBookingForm(page);
  await page.locator('[data-select-flight]').first().click();
  await page.locator('#flight-travelers').fill('13');
  await openSelection(page);assert.ok(await page.locator('#continue-hotel').isDisabled());
  await page.locator('.mobile-selection-close').click();
  await page.locator('#flight-travelers').fill('2');
  await openSelection(page);assert.ok(await page.locator('#continue-hotel').isEnabled());
  await page.waitForFunction(()=>document.querySelector('.mobile-selection-amount').textContent===document.querySelector('#summary-total').textContent);
  await page.locator('#clear-selection').click();
  await page.waitForFunction(()=>Number(document.querySelector('#summary-total').dataset.amount)===0&&document.querySelector('.mobile-selection-amount').textContent===document.querySelector('#summary-total').textContent);
  assert.ok(await page.locator('#continue-hotel').isDisabled());
  await page.locator('.mobile-selection-close').click();
  await page.locator('.locale-toggle').click();await page.locator('#rumbo-language').selectOption('de');await page.locator('[data-apply]').click();
  await page.locator('.locale-dialog').waitFor({state:'hidden'});
  await page.setViewportSize({width:740,height:360});
  await openSelection(page);
  const box=await page.locator('#mobile-selection-panel').boundingBox();assert.ok(box.y>=0&&box.y+box.height<=361);
  await page.locator('.mobile-selection-close').click();
  await page.locator('.locale-toggle').click();await page.locator('#rumbo-language').selectOption('ar');await page.locator('[data-apply]').click();
  await page.locator('.locale-dialog').waitFor({state:'hidden'});
  await page.setViewportSize({width:320,height:640});await openSelection(page);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await browser.close();}
});

test('phone cart and navigation remain usable with products and in landscape',async()=>{
 const browser=await launch();
 await mkdir('.runtime/mobile-qa',{recursive:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:640},reducedMotion:'reduce'});
  await page.goto(base+'/tienda.html');
  await page.locator('[data-add]').first().click();
  await fits(page,'#product-modal,#product-modal button,#product-modal select');
  await page.locator('[data-detail-add]').click();
  await page.keyboard.press('Escape');
  await page.locator('.product-card').nth(8).scrollIntoViewIfNeeded();
  const cart=await page.locator('#open-cart-btn').boundingBox();assert.ok(cart.y>=90&&cart.y<200,'cart follows the product list');
  await page.locator('#open-cart-btn').click();
  for(const viewport of [{width:320,height:640},{width:740,height:360}]){
   await page.setViewportSize(viewport);
   await fits(page,'#cart-modal,.cart-item,.cart-item-main,.cart-item-bottom,.cart-summary,.summary-row,.quantity-controls');
   await page.locator('#checkout-btn').scrollIntoViewIfNeeded();
   const close=await page.locator('#close-cart-btn').boundingBox();assert.ok(close.y>=0&&close.y+close.height<=viewport.height);
   await page.screenshot({path:`.runtime/mobile-qa/cart-${viewport.width}.png`});
  }
  await page.locator('#close-cart-btn').click();
  await page.locator('.site-mobile-menu summary').click();
  await page.locator('#mobile-navigation a').last().click();
  await page.waitForURL(/registro.html/);
 }finally{await browser.close();}
});
