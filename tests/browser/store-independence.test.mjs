import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
test('store has its own navigation, favorites, cart and checkout at every screen size',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 await mkdir('.runtime/store-qa',{recursive:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>{if(!error.message.startsWith('Transition was aborted'))errors.push(error.message);});
  await page.goto(base+'/tienda.html');
  assert.equal(await page.locator('.journey-progress,.journey-next,.page-back').count(),0);
  assert.equal(await page.locator('.main-nav [aria-current=page]').innerText(),'Tienda');
  await page.locator('[data-favorite]').first().click();
  await page.locator('#favorites-toggle').click();
  assert.equal(await page.locator('.product-card').count(),1);
  await page.locator('#favorites-toggle').click();
  await page.locator('[data-add]').first().click();
  await page.locator('[data-detail-add]').click();await page.keyboard.press('Escape');
  const cart=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.store.cart.v2')));
  assert.ok(cart.length);
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page fits '+width);
   const controls=await page.locator('.store-utilities').boundingBox(),hero=await page.locator('.section-hero').boundingBox();
   assert.ok(controls.y+controls.height<hero.y,'store controls above hero');
   const overlaps=await page.locator('.header-inner').evaluate(el=>{const nodes=[...el.children].filter(n=>getComputedStyle(n).display!=='none');return nodes.flatMap((n,i)=>nodes.slice(i+1).filter(m=>{const a=n.getBoundingClientRect(),b=m.getBoundingClientRect();return a.width&&b.width&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>1;}).map(m=>n.className+' / '+m.className));});
   assert.deepEqual(overlaps,[],'navbar at '+width);
   await page.screenshot({path:`.runtime/store-qa/store-${width}.png`});
   await page.locator('#open-cart-btn').click();await page.locator('#checkout-btn').click();
   await page.locator('#store-checkout[open]').waitFor();
   assert.ok(await page.locator('#pay-store').isDisabled(),'no charge is simulated without a provider');
   const checkout=await page.locator('#store-checkout').boundingBox();assert.ok(checkout.x>=0&&checkout.x+checkout.width<=width+1);
   const clipped=await page.locator('#store-checkout').evaluate(el=>[...el.querySelectorAll('button,h2,h3,p,strong')].filter(n=>{const r=n.getBoundingClientRect();return r.width&&(r.left<0||r.right>innerWidth+1);}).map(n=>n.id||n.className));assert.deepEqual(clipped,[]);
   await page.screenshot({path:`.runtime/store-qa/checkout-${width}.png`});
   await page.locator('#edit-checkout-cart').click();await page.locator('#cart-modal[open]').waitFor();await page.keyboard.press('Escape');
   assert.equal(await page.locator('dialog[open]').count(),0);
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('.main-nav a[href="servicios.html"]').click();await page.locator('.service-grid').waitFor();
  assert.equal(await page.locator('.service-grid a[href="tienda.html"]').count(),0);
  await page.locator('.header-trip').click();await page.locator('.journey-heading').waitFor();
  assert.equal(await page.locator('[data-remove-item="tienda"]').count(),0);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.store.cart.v2'))),cart);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
