import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const launch=()=>chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
async function settle(page){await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);}
async function near(page,y){await page.waitForFunction(expected=>Math.abs(scrollY-expected)<4,y,{timeout:7000});}
for(const width of [1440,390])test(`atrás y adelante recuperan el catálogo filtrado a ${width}px`,async()=>{
  const browser=await launch();
  try{
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.goto(base+'/viajes.html?pantalla=destinos');
    await page.locator('.rv-destination-card').first().waitFor();
    await page.locator('#orden-destinos').selectOption('name');
    const card=page.locator('.rv-destination-card').nth(15);
    const link=card.getByRole('link',{name:/Ver destino/});
    await link.scrollIntoViewIfNeeded();await settle(page);
    const before=await page.evaluate(()=>scrollY);
    assert.ok(before>500);
    await link.click();await page.waitForURL(/pantalla=detalle-destino/);await settle(page);
    assert.ok(await page.evaluate(()=>scrollY<5),'una navegación nueva empieza arriba');
    await page.evaluate(()=>scrollTo(0,600));await settle(page);
    const detailY=await page.evaluate(()=>scrollY);
    await page.goBack();await page.locator('.rv-destination-card').first().waitFor();
    await near(page,before);
    assert.equal(await page.locator('#orden-destinos').inputValue(),'name');
    await page.goForward();await page.locator('#detail-form').waitFor();await near(page,detailY);
    await page.reload();await page.locator('#detail-form').waitFor();await near(page,detailY);
    // El usuario puede interrumpir la recuperación sin que salte otra vez.
    await page.mouse.wheel(0,-300);await page.waitForTimeout(600);
    assert.ok(await page.evaluate(expected=>scrollY<expected-100,detailY));
  }finally{await browser.close();}
});

for(const width of [1440,390])test(`experiencias y tienda conservan filtros y posición a ${width}px`,async()=>{
  const browser=await launch();
  try{
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.goto(base+'/servicios.html?seccion=guias&destino=paris');
    await page.locator('.guide-card').first().waitFor();
    await page.locator('[data-guide-filter="cultura"]').click();
    await page.locator('#guide-sort').selectOption('price');
    const details=page.locator('.guide-card details').last();
    await details.locator('summary').click();await settle(page);
    const y=await page.evaluate(()=>scrollY),count=await page.locator('.guide-card').count();
    await page.evaluate(()=>location.href='servicios.html');
    await page.waitForURL(/servicios\.html$/);await page.goBack();
    await page.locator('.guide-card').first().waitFor();await near(page,y);
    assert.equal(await page.locator('.guide-card').count(),count);
    assert.equal(await page.locator('#guide-sort').inputValue(),'price');
    assert.equal(await page.locator('.guide-card details').last().getAttribute('open'),'');
    await page.goto(base+'/tienda.html');await page.locator('.product-card').first().waitFor();
    await page.locator('.filter-btn[data-category="Tecnología"]').click();
    await page.locator('#product-sort').selectOption('price-desc');
    await page.locator('.product-card').nth(5).scrollIntoViewIfNeeded();await settle(page);
    const shopY=await page.evaluate(()=>scrollY);
    await page.evaluate(()=>location.href='servicios.html');await page.waitForURL(/servicios\.html$/);
    await page.goBack();await page.locator('.product-card').first().waitFor();await near(page,shopY);
    assert.equal(await page.locator('#product-sort').inputValue(),'price-desc');
    assert.equal(await page.locator('.filter-btn[aria-pressed="true"]').getAttribute('data-category'),'Tecnología');
  }finally{await browser.close();}
});
