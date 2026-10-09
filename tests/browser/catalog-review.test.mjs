import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const catalog=JSON.parse(await readFile(new URL('../../config/store-catalog.json',import.meta.url),'utf8'));
const output='.runtime/catalog-audit';
await mkdir(output,{recursive:true});

test('fotos nítidas y las 81 vistas de variantes se renderizan sin errores',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/tienda.html');await page.locator('.product-card').first().waitFor();
  const dimensions=await page.evaluate(async()=>Promise.all(window.RumboProducts.map(async p=>{
   const image=new Image();image.src=p.image;await image.decode();
   const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
   const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,64,64);
   const data=ctx.getImageData(0,0,64,64).data;let transparent=0;
   for(let i=3;i<data.length;i+=4)if(data[i]<8)transparent++;
   return {id:p.id,w:image.naturalWidth,h:image.naturalHeight,clear:transparent/4096,corners:[0,63,4032,4095].map(n=>data[n*4+3])};
  })));
  for(const p of dimensions){assert.ok(Math.min(p.w,p.h)>=600,JSON.stringify(p));assert.ok(p.clear>.12,'sin recorte transparente: '+p.id);assert.ok(p.corners.every(a=>a<8),'fondo residual: '+p.id);}
  const backgrounds=await page.locator('.product-image-container').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).backgroundColor));
  assert.ok(backgrounds.every(c=>c==='rgb(255, 255, 255)'));
  await page.locator('.product-card').first().scrollIntoViewIfNeeded();
  await page.locator('.product-image').evaluateAll(async nodes=>{for(const n of nodes.slice(0,8))await n.decode();});
  await page.screenshot({path:output+'/catalog-desktop.png'});
  await page.evaluate(()=>{const el=document.createElement('div');el.id='preview-audit';el.style='position:relative;z-index:2000;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:24px;background:#171a1b;color:white';document.body.append(el);});
  const ids=catalog.products.filter(p=>p.preview).map(p=>p.id);
  for(let offset=0;offset<ids.length;offset+=16){
   const subset=ids.slice(offset,offset+16);
   await page.evaluate(ids=>{const root=document.querySelector('#preview-audit');root.innerHTML=ids.map(id=>{const p=window.RumboProducts.find(p=>p.id===id);return '<article>'+window.RumboVariantPreview.markup(p)+'<p>'+id+' · '+p.name+'</p></article>';}).join('');root.querySelectorAll('.variant-image').forEach(n=>n.style='height:220px;aspect-ratio:1');window.RumboVariantRenderer.mount(root);},subset);
   await page.waitForFunction(()=>[...document.querySelectorAll('#preview-audit [data-variant-product]')].every(n=>n.dataset.ready));
   const states=await page.locator('#preview-audit [data-variant-product]').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.variantProduct,ready:n.dataset.ready,canvas:!!n.querySelector('canvas')})));
   for(const state of states){assert.equal(state.ready,'true',JSON.stringify(state));assert.ok(state.canvas);}
   await page.locator('#preview-audit').screenshot({path:output+'/previews-'+offset+'.png'});
   const results=await page.evaluate(options=>{
    const signature=host=>{const c=host.querySelector('canvas'),data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let opaque=0,hash=0;for(let i=0;i<data.length;i+=4){if(data[i+3]>30)opaque++;hash=(hash+data[i]*3+data[i+1]*5+data[i+2]*7)%1000000007;}return {opaque,hash};};
    return [...document.querySelectorAll('#preview-audit [data-variant-product]')].map(host=>{
     const product=window.RumboProducts.find(p=>p.id===+host.dataset.variantProduct),values=options[product.id].Color;
     const before=signature(host),last=values?.at(-1);
     if(last)window.RumboVariantRenderer.update(host,product,{Color:last},true);
     return {id:product.id,before,after:signature(host),changed:values?.length>1};
    });
   },catalog.productOptions);
   for(const result of results){assert.ok(result.before.opaque>4000,'vista vacía '+result.id);if(result.changed)assert.notEqual(result.after.hash,result.before.hash,'color no cambia '+result.id);}
   await page.locator('#preview-audit').screenshot({path:output+'/colors-'+offset+'.png'});
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});

test('transición continua, tamaño proporcional y variante persistente en el carrito',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(base+'/tienda.html?producto=3');await page.locator('.detail-visual [data-ready="true"]').waitFor();
  await page.evaluate(()=>window.testCanvas=document.querySelector('.detail-visual canvas'));
  const frame=()=>page.locator('.detail-visual canvas').evaluate(c=>c.toDataURL());
  const before=await frame();await page.locator('[data-option-name="Color"]').selectOption('Beige');
  const middle=await frame();assert.notEqual(middle,before);
  await page.waitForFunction(()=>document.querySelector('.detail-visual [data-variant-product]').dataset.animating==='false');
  const after=await frame();assert.notEqual(after,middle);
  assert.ok(await page.evaluate(()=>window.testCanvas===document.querySelector('.detail-visual canvas')));
  await page.locator('[data-option-name="Color"]').selectOption('Negro');await page.locator('[data-option-name="Color"]').selectOption('Azul');
  await page.waitForFunction(()=>document.querySelector('.detail-visual [data-variant-product]').dataset.color==='Azul');
  const small=Number(await page.locator('.detail-visual [data-variant-product]').getAttribute('data-scale'));
  await page.locator('[data-option-name="Tamaño"]').selectOption({index:1});
  await page.waitForFunction(old=>Number(document.querySelector('.detail-visual [data-variant-product]').dataset.scale)>old,small);
  const chosen=await page.locator('[data-option-name="Tamaño"]').inputValue();
  await page.screenshot({path:output+'/detail-desktop.png'});
  await page.locator('[data-detail-add]').click();await page.keyboard.press('Escape');
  await page.reload();await page.locator('.product-card').first().waitFor();
  if(await page.locator('#product-modal[open]').count())await page.keyboard.press('Escape');
  await page.locator('#open-cart-btn').click();await page.locator('#cart-items [data-ready="true"]').waitFor();
  assert.match(await page.locator('#cart-items').innerText(),new RegExp(chosen));
  const saved=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.store.cart.v2')));
  assert.equal(saved[0].options.Color,'Azul');assert.equal(saved[0].options.Tamaño,chosen);assert.equal(saved[0].catalogRevision,catalog.revision);
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-detail="3"]').first().click();await page.locator('.detail-visual [data-ready="true"]').waitFor();
  await page.locator('[data-option-name="Color"]').selectOption('Negro');
  assert.equal(await page.locator('.detail-visual [data-variant-product]').getAttribute('data-animating'),'false');
  for(const width of [768,390,320]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.locator('#product-modal').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'modal '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page '+width);
   await page.screenshot({path:output+'/detail-'+width+'.png'});
  }
 }finally{await browser.close();}
});

test('inicio con separadores discretos, valores en una ruta vertical y etiquetas compactas',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  await page.goto(base+'/');
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:1000});
   for(const selector of ['#servicios','#servicios .booking-grid','#servicios .booking-card:first-child','.about-rumbo-values>div']){
    for(const border of await page.locator(selector).evaluateAll(ns=>ns.map(n=>{const s=getComputedStyle(n);return [s.borderTopWidth,s.borderBottomWidth,s.borderLeftWidth,s.borderRightWidth];})))assert.deepEqual(border,['0px','0px','0px','0px'],selector);
   }
   const separators=await page.locator('#servicios .booking-card+.booking-card').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).borderTopWidth));
   assert.deepEqual(separators,['1px','1px','1px','1px']);
   const values=await page.locator('.about-rumbo-values>div').evaluateAll(rows=>rows.map(row=>{
    const title=row.querySelector('dt').getBoundingClientRect(),description=row.querySelector('dd').getBoundingClientRect();
    return {titleBottom:title.bottom,titleLeft:title.left,descriptionTop:description.top,descriptionLeft:description.left};
   }));
   for(const value of values){assert.ok(value.descriptionTop>value.titleBottom);assert.equal(value.descriptionLeft,value.titleLeft);}
   for(const id of ['servicios','quienes-somos'])await page.locator('#'+id).screenshot({path:output+'/'+id+'-'+width+'.png'});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await page.goto(base+'/tienda.html');await page.locator('.product-card').first().waitFor();
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:1000});
   const badges=await page.locator('.product-category').evaluateAll(ns=>ns.map(n=>({width:n.getBoundingClientRect().width,parent:n.parentElement.getBoundingClientRect().width,color:getComputedStyle(n).backgroundColor})));
   for(const badge of badges){assert.ok(badge.width<badge.parent*.8);assert.equal(badge.color,'rgb(48, 45, 54)');}
  }
 }finally{await browser.close();}
});

test('un carrito antiguo conserva productos equivalentes y distingue los identificadores reutilizados',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});await page.goto(base+'/tienda.html');await page.locator('.product-card').first().waitFor();
  await page.evaluate(async()=>{window.RumboStorage.setItem('rumbo.store.cart.v2',JSON.stringify([{id:35,quantity:1,options:{}},{id:28,quantity:2,options:{}}]));await window.RumboStorage.flush();});
  await page.reload();await page.locator('#open-cart-btn').click();
  const contents=await page.locator('#cart-items').innerText();assert.match(contents,/Correa para maleta/);assert.match(contents,/Kit de higiene personal/);assert.doesNotMatch(contents,/Báscula/);
  await page.keyboard.press('Escape');await page.goto(base+'/tienda.html?producto=35');await page.locator('[data-detail-add]').click();
  await page.evaluate(()=>window.RumboStorage.flush());await page.reload();await page.keyboard.press('Escape');await page.locator('#open-cart-btn').click();
  const current=await page.locator('#cart-items').innerText();assert.match(current,/Báscula para equipaje/);assert.match(current,/Correa para maleta/);
  const cart=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.store.cart.v2')));assert.equal(cart.find(p=>p.id===28).quantity,2);assert.equal(cart.find(p=>p.id===35).catalogRevision,catalog.revision);
 }finally{await browser.close();}
});
