import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {randomUUID,randomBytes} from 'node:crypto';
import {chromium} from '@playwright/test';
import {getDb,closeDb} from '../../backend/node/db.mjs';
process.loadEnvFile(new URL('../../.env',import.meta.url));
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
await mkdir('evidencias/lanzamiento',{recursive:true});
test('checkout shared by shop and trip; account history persists on mobile and another browser context',async()=>{
 const browser=await launch();let user,owner;
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const email=`browser-checkout-${randomUUID()}@example.test`,password=randomBytes(24).toString('hex');
  const registered=await context.request.post(base+'/api/auth/register',{headers:{Origin:base},data:{name:'Prueba de lanzamiento',email,password}});
  assert.equal(registered.status(),201,await registered.text());user=(await registered.json()).user.id;
  const state=await (await context.request.get(base+'/api/state')).json();owner=state.visitor;
  const catalog=await (await context.request.get(base+'/api/catalog')).json(),product=catalog.products[0];
  const options=Object.fromEntries(Object.entries(catalog.productOptions[product.id]||{}).map(([k,v])=>[k,v[0]]));
  const trip={destinationId:'roatan',origin:'Tegucigalpa',date:'2099-10-12',checkIn:'2099-10-12',travelers:1,nights:3,cabin:'economica',rooms:1,roomType:'estandar',flightId:'roatan-0-0',hotelId:'paradise'};
  const save=await context.request.put(base+'/api/state',{headers:{Origin:base,'X-Rumbo-Visitor':owner},data:{changes:{'rumbo.store.cart.v2':{value:[{id:product.id,quantity:1,options}],revision:0},'rumbo.integrante2.viaje.v1':{value:trip,revision:0}}}});assert.equal(save.status(),200);
  await page.goto(base+'/tienda.html');await page.locator('.cookie-banner [data-reject]').click();await page.locator('#open-cart-btn').click();
  await page.locator('#checkout-btn').click();await page.locator('#pay-store').click();await page.locator('#confirm-payment').waitFor();
  assert.equal(await page.locator('#rumbo-checkout input:not([type=checkbox])').count(),0);
  await page.locator('#confirm-payment').click();assert.match(await page.locator('#payment-status').innerText(),/acepta/);
  assert.equal(await page.locator('#payment-scenario').count(),0);
  assert.match(await page.locator('#payment-disclosure').innerText(),/no se realiza ningún cobro/);
  await page.locator('#payment-consent').check();
  assert.equal((await (await context.request.get(base+'/api/orders')).json()).orders.length,0);
  await page.screenshot({path:'evidencias/lanzamiento/pago-movil.png'});
  await page.locator('#confirm-payment').click();await page.locator('.payment-success').waitFor({timeout:30000});assert.match(await page.locator('.payment-success h3').innerText(),/Pago realizado correctamente/);
  await page.locator('.payment-success a').click();await page.locator('.history-order').waitFor();assert.equal(await page.locator('.history-order').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.goto(base+'/servicios.html?seccion=mi-viaje');await page.locator('.mobile-selection-dock').click();await page.locator('#demo-consent').check();await page.locator('#complete-demo').click();
  await page.locator('#payment-consent').check();await page.locator('#confirm-payment').click();await page.locator('.payment-success').waitFor({timeout:30000});
  await page.locator('.payment-success a').click();await page.waitForFunction(()=>document.querySelectorAll('.history-order').length===2);
  await page.screenshot({path:'evidencias/lanzamiento/historial-movil.png'});
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'evidencias/lanzamiento/historial-escritorio.png'});
  const second=await browser.newContext(),signed=await second.request.post(base+'/api/auth/login',{headers:{Origin:base},data:{email,password}});assert.equal(signed.status(),200);
  const otherPage=await second.newPage();await otherPage.goto(base+'/servicios.html?seccion=historial');await otherPage.waitForFunction(()=>document.querySelectorAll('.history-order').length===2);
  await page.locator('[data-kind=store]').click();await page.waitForFunction(()=>document.querySelectorAll('.history-order').length===1);
  const dl=page.waitForEvent('download');await page.locator('.history-order [data-download]').click();assert.match((await dl).suggestedFilename(),/^RMB-/);
  assert.deepEqual(errors,[]);
 }finally{
  await browser.close();const {pool,sql}=await getDb();
  if(user)await pool.request().input('id',sql.UniqueIdentifier,user).query('DELETE dbo.RumboOrders WHERE UserId=@id; DELETE dbo.RumboSessions WHERE UserId=@id; DELETE dbo.RumboUsers WHERE Id=@id;');
  if(owner)await pool.request().input('id',sql.UniqueIdentifier,owner).query('DELETE dbo.RumboVisitorState WHERE VisitorId=@id; DELETE dbo.RumboVisitors WHERE Id=@id;');
  await closeDb();
 }
});
test('privacy consent blocks analytics until opt-in and supports withdrawal; policy pages fit all viewports',async()=>{
 const browser=await launch();try{
  const context=await browser.newContext(),page=await context.newPage();let analytics=0;
  await page.route('**/api/analytics',route=>{analytics++;return route.fulfill({status:204});});
  await page.goto(base+'/servicios.html?seccion=privacidad');await page.locator('.cookie-banner').waitFor();assert.equal(analytics,0);
  await page.locator('.cookie-banner [data-reject]').click();await page.reload();assert.equal(analytics,0);
  await page.locator('[data-cookie-settings]').click();await page.locator('#analytics-consent').check();await page.locator('.cookie-dialog [data-save]').click();await page.waitForRequest('**/api/analytics',{timeout:1000}).catch(()=>{});assert.equal(analytics,1);
  await page.locator('[data-cookie-settings]').click();await page.locator('.cookie-dialog [data-reject]').click();await page.reload();assert.equal(analytics,1);
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});
   for(const section of ['privacidad','terminos','cookies','cancelaciones']){
    await page.goto(base+'/servicios.html?seccion='+section);await page.locator('.legal-layout').waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),section+' '+width);
    assert.equal(await page.locator('.legal-layout img').count(),0);
   }
   await page.goto(base+'/servicios.html?seccion=privacidad');await page.screenshot({path:`evidencias/lanzamiento/privacidad-${width}.png`});
  }
  await page.locator('.locale-toggle').click();await page.locator('#rumbo-language').selectOption('en');await page.locator('[data-apply]').click();await page.waitForFunction(()=>document.documentElement.lang==='en');assert.equal(await page.locator('.legal-header h1').innerText(),'Privacy policy');
 }finally{await browser.close();}
});
