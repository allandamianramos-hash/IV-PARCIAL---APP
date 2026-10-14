import {test} from 'node:test';
import assert from 'node:assert/strict';
import {completeBookingForm} from './booking-helpers.mjs';
import {chromium} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});

for(const width of [1440,390])test(`catálogo completo, servicios y fotografías a ${width}px`,async()=>{
  const browser=await launch();
  try{
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',error=>{if(!error.message.startsWith('Transition was aborted'))errors.push(error.message);});
    await page.goto(base+'/servicios.html?seccion=guias&destino=roatan');
    await page.locator('.guide-card').first().waitFor();
    const destinations=await page.evaluate(()=>window.RumboViajesDatos.destinations.map(d=>({id:d.id,name:d.name})));
    assert.equal(destinations.length,70);
    for(const d of destinations){
      await page.locator('#destination').selectOption(d.id);
      assert.equal(await page.locator('.guide-card').count(),10,d.id);
      assert.equal(await page.locator('#guide-results-title').innerText(),'Recorridos en '+d.name);
      const images=await page.locator('.guide-card img').evaluateAll(async nodes=>Promise.all(nodes.map(async image=>{
        image.loading='eager';await image.decode();return {src:image.getAttribute('src'),width:image.naturalWidth,height:image.naturalHeight};
      })));
      assert.equal(new Set(images.map(i=>i.src)).size,10,d.id);
      assert.ok(images.every(i=>i.width>0&&i.height>0),d.id);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),d.id+' desborda la pantalla');
    }
    await page.goto(base+'/viajes.html?pantalla=hoteles&destino=roatan');
    await completeBookingForm(page);
    await page.locator('.rv-hotel-card').first().waitFor();
    for(const d of destinations){
      await page.goto(base+'/viajes.html?pantalla=hoteles&destino='+d.id);
      await page.locator('.rv-hotel-card').first().waitFor();
      assert.equal(await page.locator('.rv-hotel-card').count(),5,d.id);
      if(width===1440)await page.locator('.rv-hotel-photo').evaluateAll(async nodes=>Promise.all(nodes.map(image=>{image.loading='eager';return image.decode();})));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),d.id+' hoteles');
    }
    assert.deepEqual(errors,[]);
    await page.screenshot({path:`evidencias/catalogo-completo-${width}.png`,fullPage:false});
  }finally{await browser.close();}
});
