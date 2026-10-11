import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium,expect} from '@playwright/test';
import {getDb,closeDb,dbEnabled} from '../../backend/node/db.mjs';

try{process.loadEnvFile(new URL('../../.env',import.meta.url));}catch(error){if(error.code!=='ENOENT')throw error;}
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const key='rumbo.profile.v1';

test('perfil real: alias persistente, recomendaciones, filtros y aislamiento de cuenta',{skip:!dbEnabled()},async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const email=`test-profile-${randomUUID()}@example.invalid`,password=`Test-${randomUUID()}!`;
 const errors=[];const guestOwners=new Set();
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1050}});
  const registered=await context.request.post(base+'/api/auth/register',{headers:{Origin:base},data:{name:'Nombre original',email,password}});
  assert.equal(registered.status(),201,await registered.text());
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/servicios.html?seccion=perfil');
  await page.locator('#alias').fill('Ana del Mar');await page.locator('#preference').selectOption('naturaleza');
  await page.getByRole('button',{name:'Guardar perfil',exact:true}).click();
  await expect(page.locator('#service-status')).toContainText('Tu perfil está guardado en tu cuenta');
  await page.getByText('Mi cuenta',{exact:true}).click();
  await expect(page.locator('.account-identity strong')).toHaveText('Hola, Ana del Mar');
  const stored=await (await context.request.get(base+'/api/state')).json();
  assert.deepEqual(stored.state[key].value,{alias:'Ana del Mar',preference:'naturaleza'});
  await page.reload();await expect(page.locator('#alias')).toHaveValue('Ana del Mar');
  await expect(page.locator('#preference')).toHaveValue('naturaleza');

  await page.getByRole('link',{name:'Ver destinos para mí ↗'}).click();
  await expect(page.locator('#destination-personalization')).toBeVisible();
  await expect(page.locator('#destination-personalization-text')).toContainText('Naturaleza');
  const catalog=await page.evaluate(()=>window.RumboViajesDatos.destinations.map(d=>({id:d.id,type:d.type,budget:d.inspirationBudget,name:d.name})));
  const cards=()=>page.locator('#destination-list h3 a').evaluateAll(links=>links.map(a=>new URL(a.href).searchParams.get('destino')));
  const nature=catalog.filter(d=>d.type==='naturaleza').map(d=>d.id);
  assert.deepEqual((await cards()).slice(0,nature.length),nature);
  assert.equal((await cards()).length,catalog.length);
  await page.locator('#orden-destinos').selectOption('price-low');
  assert.deepEqual(await cards(),[...catalog].sort((a,b)=>a.budget-b.budget).map(d=>d.id));
  await page.locator('#destination-filters select[name=tipo]').selectOption('playa');
  assert.ok((await cards()).every(id=>catalog.find(d=>d.id===id).type==='playa'));
  await expect(page.locator('#destination-personalization-text')).toContainText('No hay coincidencias');
  await page.getByRole('button',{name:'Limpiar filtros'}).click();
  assert.deepEqual((await cards()).slice(0,nature.length),nature);
  await mkdir(new URL('../../evidencias/',import.meta.url),{recursive:true});
  await page.screenshot({path:fileURLToPath(new URL('../../evidencias/perfil-destinos-escritorio.png',import.meta.url)),fullPage:false});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:fileURLToPath(new URL('../../evidencias/perfil-destinos-movil.png',import.meta.url)),fullPage:false});
  await page.setViewportSize({width:1440,height:1050});

  // Another open page responds to changes in the same account.
  const profile=await context.newPage();await profile.goto(base+'/servicios.html?seccion=perfil');
  await profile.locator('#alias').fill('Ana viajera');await profile.locator('#preference').selectOption('cultura');
  await profile.getByRole('button',{name:'Guardar perfil',exact:true}).click();
  await expect(profile.locator('#service-status')).toContainText('Tu perfil está guardado en tu cuenta');
  await expect(page.locator('#destination-personalization-text')).toContainText('Cultura e historia');
  await expect(page.locator('.account-identity strong')).toHaveText('Hola, Ana viajera');

  await profile.goto(base+'/index.html');
  const featured=await profile.locator('#destinations-track .destination-link').evaluateAll(links=>links.map(a=>new URL(a.href).searchParams.get('destino')));
  assert.ok(featured.every(id=>catalog.find(d=>d.id===id).type==='cultura'));
  await context.request.post(base+'/api/auth/logout',{headers:{Origin:base},data:{}});
  await context.close();
  // A fresh browser context proves the result came from SQL, not a local cache.
  const fresh=await browser.newContext();
  assert.equal((await fresh.request.post(base+'/api/auth/login',{headers:{Origin:base},data:{email,password}})).status(),200);
  const restored=await fresh.newPage();await restored.goto(base+'/servicios.html?seccion=perfil');
  await expect(restored.locator('#alias')).toHaveValue('Ana viajera');
  await expect(restored.locator('#preference')).toHaveValue('cultura');
  await expect(restored.locator('.account-identity strong')).toHaveText('Hola, Ana viajera');
  await restored.getByRole('button',{name:'Eliminar perfil'}).click();
  await expect(restored.locator('#service-status')).toContainText('Perfil eliminado');
  await expect(restored.locator('.account-identity strong')).toHaveText('Hola, Nombre');
  await restored.goto(base+'/viajes.html?pantalla=destinos');
  await expect(restored.locator('#destination-personalization')).toBeHidden();
  assert.equal(await restored.locator('.rv-profile-match').count(),0);
  await fresh.close();

  const guest=await browser.newContext();
  const anonymous=await guest.newPage();await anonymous.goto(base+'/servicios.html?seccion=perfil');
  const guestOwner=await anonymous.locator('#rumbo-bootstrap').evaluate(el=>JSON.parse(el.textContent).visitor);
  guestOwners.add(guestOwner);
  await expect(anonymous.locator('#alias')).toHaveValue('');
  // Failed saves must never display a success confirmation.
  await anonymous.route('**/api/state',route=>route.fulfill({status:503,json:{error:'Prueba de conexión'}}));
  await anonymous.locator('#alias').fill('Borrador');await anonymous.locator('#preference').selectOption('playa');
  await anonymous.getByRole('button',{name:'Guardar perfil',exact:true}).click();
  await anonymous.waitForURL(/error.html/);
  await guest.close();
  assert.deepEqual(errors,[]);
 }finally{
  await browser.close();
  const {pool,sql}=await getDb();
  for(const id of guestOwners)await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboVisitors WHERE Id=@id AND NOT EXISTS(SELECT 1 FROM dbo.RumboUsers WHERE VisitorId=@id)');
  await pool.request().input('email',sql.NVarChar(254),email).query('DECLARE @visitor uniqueidentifier; SELECT @visitor=VisitorId FROM dbo.RumboUsers WHERE Email=@email; DELETE dbo.RumboSessions WHERE UserId IN(SELECT Id FROM dbo.RumboUsers WHERE Email=@email); DELETE dbo.RumboUsers WHERE Email=@email; DELETE dbo.RumboVisitors WHERE Id=@visitor;');
  await closeDb();
 }
});
