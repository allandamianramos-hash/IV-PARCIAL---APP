import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';

const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';

test('postcard includes the complete catalog, previews personal text and downloads the selected photograph',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
  await page.goto(base);
  const canvas=page.locator('#postcard-canvas'),place=page.locator('#postcard-place'),download=page.locator('#postcard-download');
  await expect(download).toBeEnabled();
  const catalog=await page.evaluate(()=>window.RumboViajesDatos.destinations.map(({id,name})=>({id,name})));
  assert.ok(catalog.length>4);
  const options=await place.locator('option').evaluateAll(nodes=>nodes.map(n=>n.value));
  assert.deepEqual(options.sort(),catalog.map(d=>d.id).sort());
  for(const destination of catalog){
   await place.selectOption(destination.id);await expect(download).toBeEnabled();
   await expect(canvas).toHaveAttribute('aria-label','Postal de '+destination.name);
   await expect(canvas).toHaveAttribute('aria-busy','false');
   await expect(page.locator('#postcard-status')).toBeEmpty();
  }
  await place.selectOption('venecia');await expect(download).toBeEnabled();
  const blank=await canvas.evaluate(c=>c.toDataURL());
  await page.locator('#postcard-message').fill('Nos quedan calles por recorrer\ny atardeceres por compartir.\n¿Nos vamos?');
  await page.locator('#postcard-to').fill('Sofía');await page.locator('#postcard-from').fill('Daniel');
  await expect(canvas).toHaveAttribute('aria-label',/Para: Sofía\. De: Daniel/);
  assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),blank);
  const fields=await page.locator('#postcard-form :is(input,select,textarea)').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundColor));assert.ok(fields.every(color=>color==='rgba(0, 0, 0, 0)'));
  await mkdir('.runtime/postcard',{recursive:true});
  await page.locator('#antes-de-viajar').screenshot({path:'.runtime/postcard/desktop.png'});
  const styles=await canvas.evaluate(c=>({border:getComputedStyle(c).borderWidth,radius:getComputedStyle(c).borderRadius,padding:getComputedStyle(c.parentElement).padding,background:getComputedStyle(document.querySelector('#antes-de-viajar')).backgroundColor}));
  assert.deepEqual(styles,{border:'0px',radius:'0px',padding:'0px',background:'rgba(0, 0, 0, 0)'});
  const downloaded=page.waitForEvent('download');await download.click();const file=await downloaded;
  assert.equal(file.suggestedFilename(),'rumbo-postal-venecia.png');await file.saveAs('.runtime/postcard/postal.png');
  const png=await readFile('.runtime/postcard/postal.png');assert.equal(png.readUInt32BE(16),1600);assert.equal(png.readUInt32BE(20),1100);
  for(const width of [800,390,320]){
   await page.setViewportSize({width,height:1000});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(width===390)await page.locator('#antes-de-viajar').screenshot({path:'.runtime/postcard/mobile.png'});
  }
  await page.route('**/imagenes-viajes/destinos/*',route=>route.abort());
  await place.selectOption(catalog.find(d=>d.id!=='venecia').id);await expect(page.locator('#postcard-status')).toContainText('No se pudo cargar');await expect(download).toBeDisabled();
  await page.unroute('**/imagenes-viajes/destinos/*');await place.selectOption('venecia');await expect(download).toBeEnabled();
  assert.equal(await page.locator('#postcard-message').inputValue(),'Nos quedan calles por recorrer\ny atardeceres por compartir.\n¿Nos vamos?');
 }finally{await browser.close();}
});
