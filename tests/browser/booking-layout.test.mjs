import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
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
    assert.equal(await page.locator('.journey-progress a').count(),name==='servicios'?0:7,name);
    assert.equal(await page.locator('.page-back').count(),0,name);
    assert.equal(await page.locator('.guide-catalog-facts').count(),0);
    if(name!=='servicios'&&width<600){
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

test('back preserves destination filters and every service still saves and continues',async()=>{
 const browser=await launch();
 try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const failures=[];
  page.on('response',r=>{if(r.url().includes('/api/state')&&r.status()>=400)failures.push(r.status());});
  await page.goto(base+'/viajes.html?pantalla=destinos&q=Par%C3%ADs');
  await page.locator('.rv-card-footer a').first().click();await page.locator('#detail-form').waitFor();
  assert.match(await page.locator('.page-back').getAttribute('href'),/q=Par/);
  await page.locator('.page-back').click();await page.locator('#buscar-destino').waitFor();assert.equal(await page.locator('#buscar-destino').inputValue(),'París');
  await page.goto(base+'/viajes.html?pantalla=detalle-destino&destino=roatan');await page.locator('#detail-form').waitFor();
  await page.locator('#detail-form button[value=vuelos]').click();await page.waitForURL(/pantalla=vuelos/);
  await page.locator('[data-select-flight]').first().click();await page.locator('#continue-hotel').click();await page.waitForURL(/pantalla=hoteles/);
  await page.locator('[data-select-hotel]:not([disabled])').first().click();await page.locator('#save-selection').click();await page.waitForURL(/seccion=traslados/);
  await page.locator('[data-choose]').first().click();await page.locator('#save-service').click();await page.waitForURL(/seccion=seguros/);
  await page.locator('[data-choose]').first().click();await page.locator('#save-service').click();await page.waitForURL(/seccion=guias/);
  await page.locator('[data-guide-choose]').first().click();await page.locator('#guide-save').click();
  await page.waitForFunction(()=>!window.RumboStorage.hasPending());
  const selections=await page.evaluate(()=>JSON.parse(window.RumboStorage.getItem('rumbo.services.v1')));
  assert.deepEqual(selections.map(x=>x.section).sort(),['guias','seguros','traslados']);assert.ok(selections.every(x=>x.total>0));
  await page.locator('.journey-progress a[href="tienda.html"]').click();await page.waitForURL(/tienda.html/);assert.ok(await page.locator('.product-card').count()>0);
  await page.locator('.journey-progress a[href*="mi-viaje"]').click();await page.waitForURL(/seccion=mi-viaje/);assert.equal(await page.locator('.journey-item').count(),5);assert.deepEqual(failures,[]);
 }finally{await browser.close();}
});
