import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
async function language(page,code){await page.locator('.locale-toggle').click();await page.locator('#rumbo-language').selectOption(code);await page.locator('[data-apply]').click();await page.waitForFunction(code=>document.documentElement.lang===code,code);await page.locator('.locale-dialog').first().waitFor({state:'hidden'});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}

test('hero automatically cycles every destination without new controls and respects reduced motion',async()=>{
 const browser=await launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.locator('.travel-hero h1').waitFor();
  const destinations=['venecia','cancun','osaka','paris'];
  let current=await page.locator('.travel-hero').getAttribute('data-destination');
  for(let i=0;i<destinations.length;i++){
   current=destinations[(destinations.indexOf(current)+1)%destinations.length];
   await page.waitForFunction(id=>document.querySelector('.travel-hero').dataset.destination===id,current,{timeout:15000});
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-fare-wrap')).opacity==='1'&&getComputedStyle(document.querySelector('.hero-photo[data-active=true]')).opacity==='1');
  }
  assert.equal(await page.locator('.hero-step button').count(),2);
  await language(page,'fr');
  const before=await page.locator('.travel-hero').getAttribute('data-destination');
  await page.waitForFunction(id=>document.querySelector('.travel-hero').dataset.destination!==id,before,{timeout:10000});
  await page.emulateMedia({reducedMotion:'reduce'});
  const stopped=await page.locator('.travel-hero').getAttribute('data-destination');
  await page.waitForTimeout(5500);
  assert.equal(await page.locator('.travel-hero').getAttribute('data-destination'),stopped);
  await page.locator('[data-promo-next]').click();
  await page.waitForFunction(id=>document.querySelector('.travel-hero').dataset.destination!==id,stopped);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
test('hero switches all ten languages, preserves form values and restores Spanish',async()=>{
 const browser=await launch();try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.locator('.travel-hero h1').waitFor();
 await page.locator('#destination').fill('Cancún');
 for(const code of ['en','de','fr','it','pt','ja','ko','zh','ar','es']){await language(page,code);assert.equal(await page.locator('#destination').inputValue(),'Cancún');assert.equal(await page.locator('html').getAttribute('dir'),code==='ar'?'rtl':'ltr');const expected=await page.evaluate(()=>window.RumboLocale.translate('Buscar mi viaje'));assert.equal(await page.locator('.hero-secondary').innerText(),expected);}
 assert.match(await page.locator('.travel-hero h1').innerText(),/Venecia/);
 await language(page,'en');await page.locator('[data-promo-next]').click();await page.waitForFunction(()=>document.querySelector('.travel-hero').dataset.destination==='cancun');assert.match(await page.locator('.travel-hero h1').innerText(),/off\./);assert.equal(errors.length,0,errors.join('\n'));
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-fare-wrap')).opacity==='1'&&[...document.querySelectorAll('.hero-heading-line')].every(el=>getComputedStyle(el).opacity==='1')&&getComputedStyle(document.querySelector('.hero-photo[data-active=true]')).opacity==='1');
 await mkdir('evidencias/idiomas',{recursive:true});await page.screenshot({path:'evidencias/idiomas/hero-ingles.png'});
 }finally{await browser.close();}
});
test('every page translates dynamic content without script or local asset errors',async()=>{
 const browser=await launch();try{const context=await browser.newContext();await context.addInitScript(()=>localStorage.setItem('rumbo.preferences.v1',JSON.stringify({language:'en',region:'HN'})));
 const page=await context.newPage();const errors=[],untranslated=new Set();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400&&!r.url().includes('/missing/'))errors.push(r.status()+' '+r.url());});
 const paths=['/','/viajes.html?pantalla=destinos','/viajes.html?pantalla=detalle-destino&destino=venecia','/viajes.html?pantalla=vuelos','/viajes.html?pantalla=hoteles','/tienda.html','/servicios.html',...['traslados','seguros','guias','mi-viaje','perfil','ayuda','cambios','privacidad','terminos','legal'].map(x=>'/servicios.html?seccion='+x),'/iniciar-sesion.html','/registro.html','/missing/route'];
 for(const path of paths){await page.goto(base+path,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.lang==='en');
  const missing=await page.evaluate(()=>{const result=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.parentElement.closest('script,style,[translate=no],.account-identity'))continue;const text=n.textContent.trim();if(/\b(?:para|viajeros|habitaciones|Elige|Selecciona|Tu viaje|No se pudo|Contraseña|Vuelo|noches|reseña|destinos|Hospedaje)\b/.test(text)&&text.length>8)result.push(text);}return result;});missing.forEach(text=>untranslated.add(text));
  assert.equal(await page.locator('.locale-toggle').count(),1,path);
 }
 await mkdir('.runtime',{recursive:true});await writeFile('.runtime/untranslated-visible.json',JSON.stringify([...untranslated],null,2));assert.deepEqual(errors,[]);assert.deepEqual([...untranslated],[]);
 }finally{await browser.close();}
});
test('mobile Arabic layout keeps the hero and language controls inside the viewport',async()=>{
 const browser=await launch();try{const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto(base);await language(page,'ar');await page.waitForFunction(()=>getComputedStyle(document.querySelector('.hero-fare-wrap')).opacity==='1');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'evidencias/idiomas/hero-arabe-movil.png'});await language(page,'es');assert.equal(await page.locator('html').getAttribute('dir'),'ltr');}finally{await browser.close();}
});
test('review controls respect ownership, cancel, delete and preserve original review text',async()=>{
 const browser=await launch();try{const page=await browser.newPage();let deleted=0,failDelete=true;
 let reviews=[{id:'review:me:one',isOwn:true,name:'Usuario prueba',comment:'Esta reseña debe conservar su idioma original.',rating:5,date:'2026-10-06T12:00:00Z'},{id:'review:me:two',isOwn:true,name:'Usuario prueba',comment:'Segunda reseña que quiero eliminar.',rating:3,date:'2026-10-07T12:00:00Z'},{id:'review:other',isOwn:false,name:'Otra persona',comment:'Esta reseña pertenece a otra cuenta.',rating:4,date:'2026-10-05T12:00:00Z'}];
 await page.route('**/api/reviews*',route=>{if(route.request().method()==='DELETE'){const id=new URL(route.request().url()).searchParams.get('id');assert.equal(id,'review:me:two');if(failDelete){failDelete=false;return route.fulfill({status:503,json:{error:'No se pudo eliminar tu reseña. Inténtalo de nuevo.'}});}reviews=reviews.filter(review=>review.id!==id);deleted++;return route.fulfill({json:{deleted:true}});}return route.fulfill({json:{total:reviews.length,average:reviews.reduce((sum,review)=>sum+review.rating,0)/reviews.length,hasOwnReview:true,reviews}});});
 await page.goto(base);await page.locator('.review-delete').first().waitFor({state:'visible'});await language(page,'en');assert.match(await page.locator('.reviews-list .review-comment').first().innerText(),/Esta reseña/);
 assert.equal(await page.locator('.review-form-actions .review-delete').count(),0);
 assert.equal(await page.locator('.review-delete').count(),2);
 assert.equal(await page.locator('.review-delete').first().innerText(),'Delete my review');
 assert.equal(await page.locator('.review-card').nth(2).locator('.review-delete').count(),0);
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});
  const bounds=await page.locator('.review-delete').first().boundingBox(),card=await page.locator('.review-card').first().boundingBox();
  assert.ok(bounds.x>=card.x&&bounds.x+bounds.width<=card.x+card.width+1);
  assert.ok(bounds.y+bounds.height<=card.y+card.height);
 }
 await page.locator('.review-delete').nth(1).click();assert.equal(await page.locator('.review-delete-preview .review-comment').innerText(),reviews[1].comment);await page.locator('.review-delete-dialog button[value=cancel]').click();assert.equal(deleted,0);
 await page.locator('.review-delete').nth(1).click();await page.locator('[data-confirm-delete]').click();await page.waitForFunction(()=>document.querySelector('.review-delete-dialog [role=status]').textContent.length>0);assert.equal(deleted,0);assert.equal(reviews.length,3);
 await page.locator('[data-confirm-delete]').click();await page.locator('.review-delete-dialog').waitFor({state:'hidden'});await page.waitForFunction(()=>document.querySelectorAll('.review-card').length===2);assert.equal(deleted,1);assert.match(await page.locator('.reviews-list .review-comment').first().innerText(),/Esta reseña debe conservar/);assert.equal(await page.locator('.review-delete').count(),1);
 await page.reload();await page.locator('.review-delete').waitFor({state:'visible'});assert.equal(await page.locator('.review-card').count(),2);
 }finally{await browser.close();}
});

test('pages and dialogs show no translation separators in any language',async()=>{
 const browser=await launch();try{const page=await browser.newPage();
 for(const path of ['/','/viajes.html?pantalla=destinos','/viajes.html?pantalla=hoteles','/tienda.html','/servicios.html?seccion=guias','/registro.html']){
  await page.goto(base+path,{waitUntil:'networkidle'});
  for(const code of ['en','de','fr','it','pt','ja','ko','zh','ar','es']){
   await language(page,code);
   const artifacts=await page.evaluate(()=>{const found=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement.closest('script,style,[translate=no]'))continue;const text=node.textContent;if(/▁|@@|(?<!daryl)_(?!mitchell)/.test(text))found.push(text.trim());}return found;});
   assert.deepEqual(artifacts,[],path+' '+code);
  }
 }
 }finally{await browser.close();}
});
