import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';

test('móvil: navegación, equipo, filtros y carga progresiva sin desbordamiento',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 await mkdir('.runtime/mobile-review',{recursive:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:844});
   for(const route of ['/index.html','/viajes.html?pantalla=destinos','/tienda.html','/servicios.html','/iniciar-sesion.html','/registro.html']){
    await page.goto(base+route);await page.waitForLoadState('domcontentloaded');
    if(await page.locator('.cookie-banner').isVisible())await page.locator('.cookie-banner [data-reject]').click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: ${route}`);
    if(route==='/index.html'){
     if(width<768){
      await expect(page.locator('.mobile-quick-nav')).toBeVisible();
      assert.ok(await page.locator('.team-grid').evaluate(e=>e.scrollWidth>e.clientWidth));
      assert.ok((await page.locator('.team-grid').boundingBox()).height<230);
     }
     await page.locator('#nuestro-equipo').screenshot({path:`.runtime/mobile-review/team-${width}.png`});
    }
    if(route.includes('pantalla=destinos')){
     await expect(page.locator('.rv-destination-card')).toHaveCount(100);
     assert.equal(await page.locator('.rv-destination-card:visible').count(),width<768?8:100);
     if(width<768){
      await page.getByRole('button',{name:'Ver más destinos (8 de 100)',exact:true}).click();
      assert.equal(await page.locator('.rv-destination-card:visible').count(),16);
      await page.getByText('Buscar y filtrar destinos',{exact:true}).click();
      await page.locator('.rv-filter-bar input[type=search]').fill('Bali');
      await page.locator('.rv-filter-bar').evaluate(e=>e.requestSubmit());
      await expect(page.locator('.rv-destination-card')).toHaveCount(1);
      await expect(page.locator('.rv-destination-card')).toContainText('Bali');
      await expect(page.locator('.mobile-catalog-more')).toBeHidden();
     }
    }
    if(width===390)await page.screenshot({path:`.runtime/mobile-review/${route.split('?')[0].slice(1)}.png`});
   }
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
