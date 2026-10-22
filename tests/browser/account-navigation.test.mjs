import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';

test('navbar: un único acceso visible en escritorio y móvil',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();await page.goto(base+'/index.html');
 if(await page.locator('.cookie-banner').isVisible())await page.locator('.cookie-banner [data-reject]').click();
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:950});
   const navbar=page.locator('#site-navbar');
   await expect(navbar.locator('.register-button')).toHaveCount(0);
   await expect(navbar.locator('a[href="iniciar-sesion.html"]')).toHaveCount(1);
    await expect(navbar.locator('.login-button')).toBeVisible();
    const colors=await navbar.locator('.login-button').evaluate(n=>({bg:getComputedStyle(n).backgroundColor,color:getComputedStyle(n).color}));
    assert.deepEqual(colors,{bg:'rgb(184, 216, 107)',color:'rgb(27, 38, 11)'});
   const box=await navbar.locator('.header-inner').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width);
   const login=await navbar.locator('.login-button').boundingBox();assert.ok(login.x+login.width<=box.x+box.width-4,`Login outside navbar at ${width}`);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await navbar.screenshot({path:`evidencias/navbar-acceso-${width}.png`});
  }
  await page.locator('#site-navbar .login-button').click();await page.waitForURL('**/iniciar-sesion.html');
  await expect(page.locator('#site-navbar')).toHaveCount(0);
  await expect(page.locator('.auth-switch')).toContainText('¿No tienes una cuenta?');
  await page.locator('.auth-switch a').click();await page.waitForURL('**/registro.html');
  await expect(page.locator('#site-navbar')).toHaveCount(0);
 }finally{await browser.close();}
});

for(const mode of ['login','register'])test(`${mode}: al completar el formulario se vuelve directamente al inicio`,async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));let submitted=false;
  // Only the HTTP success is simulated; real persistence is covered by SQL tests.
  await page.route('**/api/auth/'+mode,route=>{submitted=true;return route.fulfill({status:mode==='register'?201:200,json:{user:{id:'navigation-test'}}});});
  await page.goto(base+(mode==='register'?'/registro.html':'/iniciar-sesion.html'));
  if(mode==='register')await page.locator('#full-name').fill('Prueba navegación');
  await page.locator('#email').fill('navigation@example.test');await page.locator('#password').fill('Prueba de interfaz 123!');
  await page.locator('#auth-form [type=submit]').click();await page.waitForURL('**/index.html');
  assert.equal(submitted,true);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
