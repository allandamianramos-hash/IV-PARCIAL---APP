import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';

const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const key='rumbo.integrante2.viaje.v1';

test('Destinos reconciles an unchanged version and waits for saving before opening flights',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 let release;
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  let state={},puts=0,conflicts=0,reads=0,hold=false,started;
  const saving=new Promise(resolve=>started=resolve);
  await page.route('**/viajes.html?**',async route=>{
   const response=await route.fetch();let html=await response.text();
   html=html.replace(/(<script id="rumbo-bootstrap" type="application\/json">)(.*?)(<\/script>)/s,(_,start,json,end)=>start+JSON.stringify({...JSON.parse(json),connected:true,visitor:'sync-test',state})+end);
   // This test exercises persistence, without cross-document animation timing.
   html=html.replace('</head>','<style>@view-transition { navigation: none; }</style></head>');
   await route.fulfill({response,body:html});
  });
  await page.route('**/api/state',async route=>{
   if(route.request().method()==='GET'){reads++;return route.fulfill({json:{visitor:'sync-test',state}});}
   puts++;const {changes}=route.request().postDataJSON();
   if(changes[key]?.value.destinationId==='paris'&&conflicts===0){
    state[key].revision++;conflicts++;return route.fulfill({status:409,json:{error:'Conflicto de versión'}});
   }
   for(const [name,change]of Object.entries(changes)){
    assert.equal(change.revision,state[name]?.revision||0);
    state[name]={value:change.value,revision:change.revision+1};
   }
   if(hold){hold=false;started();await new Promise(resolve=>release=resolve);}
   await route.fulfill({json:{revisions:Object.fromEntries(Object.keys(changes).map(name=>[name,state[name].revision]))}});
  });
  await page.goto(base+'/viajes.html?pantalla=destinos');
  await page.waitForFunction(()=>window.RumboStorage&&!window.RumboStorage.hasPending());
  assert.equal(puts,1);
  await page.locator('.rv-card-footer a[href*="destino=paris"]').click();
  await page.locator('#detail-form').waitFor();
  await page.waitForFunction(()=>!window.RumboStorage.hasPending());
  assert.equal(conflicts,1);assert.equal(reads,1);assert.equal(state[key].value.destinationId,'paris');assert.ok(!page.url().includes('error.html'));
  const savedPuts=puts;
  await page.reload();await page.locator('#detail-form').waitFor();
  assert.equal(await page.evaluate(()=>window.RumboStorage.hasPending()),false);assert.equal(puts,savedPuts);
  hold=true;
  await page.locator('#detail-travelers').fill('2');await page.locator('#detail-form button[value=vuelos]').click();
  await saving;
  assert.equal(new URL(page.url()).searchParams.get('pantalla'),'detalle-destino');
  assert.equal(await page.evaluate(()=>window.RumboStorage.hasPending()),true);
  release();
  await page.waitForURL(/pantalla=vuelos/);await page.locator('#continue-hotel').waitFor();
  assert.equal(state[key].value.travelers,2);assert.equal(await page.evaluate(()=>window.RumboStorage.hasPending()),false);assert.deepEqual(errors,[]);
 }finally{release?.();await browser.close();}
});
