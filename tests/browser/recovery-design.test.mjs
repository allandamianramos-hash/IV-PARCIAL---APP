import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
await mkdir('evidencias',{recursive:true});

test('recuperación: errores, verificación, confirmación y éxito sin guardar tokens',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:900}});let unavailable=true,verified=false,resets=0;
  await page.route('**/api/auth/password/*',async route=>{
   const body=route.request().postDataJSON(),action=route.request().url().split('/').pop();
   let status=200,data={};
   if(action==='request'){
    assert.equal(body.email,'prueba@example.invalid');
    if(unavailable){status=503;data={error:'La recuperación por correo todavía no está disponible.'};unavailable=false;}
    else data={requestId:'a'.repeat(64),message:'Si el correo corresponde a una cuenta con contraseña, recibirás un código.'};
   }
   if(action==='verify'){
    assert.equal(body.requestId,'a'.repeat(64));
    if(body.code==='123456'){verified=true;data={resetToken:'b'.repeat(64)};}
    else{status=400;data={error:'El código es incorrecto o venció. Puedes solicitar uno nuevo.'};}
   }
   if(action==='reset'){assert.ok(verified);assert.equal(body.resetToken,'b'.repeat(64));resets++;data={message:'Contraseña actualizada.'};}
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  });
  await page.goto(base+'/recuperar-contrasena.html');
  await page.getByLabel('Correo electrónico',{exact:true}).fill('prueba@example.invalid');
  await page.getByRole('button',{name:'Enviar código',exact:true}).click();
  await expect(page.locator('#recovery-status')).toContainText('no está disponible');
  await page.getByRole('button',{name:'Enviar código',exact:true}).click();
  await expect(page.locator('#recovery-code-form')).toBeVisible();await expect(page.locator('#recovery-email-form')).toBeHidden();
  await expect(page.locator('#recovery-resend')).toBeDisabled();
  await page.locator('#recovery-code').fill('999999');await page.getByRole('button',{name:'Verificar código',exact:true}).click();
  await expect(page.locator('#recovery-status')).toContainText('incorrecto');
  await page.screenshot({path:'evidencias/recuperacion-codigo-movil.png',fullPage:true});
  await page.locator('#recovery-code').fill('123456');await page.getByRole('button',{name:'Verificar código',exact:true}).click();
  await expect(page.locator('#recovery-password-form')).toBeVisible();
  await page.locator('#new-password').fill('Nueva contraseña segura 123!');await page.locator('#confirm-password').fill('No coincide 123!');
  await page.getByRole('button',{name:'Guardar nueva contraseña'}).click();await expect(page.locator('#recovery-status')).toContainText('no coinciden');assert.equal(resets,0);
  await page.locator('#confirm-password').fill('Nueva contraseña segura 123!');await page.getByLabel('Mostrar contraseñas').check();await expect(page.locator('#new-password')).toHaveAttribute('type','text');
  await page.getByRole('button',{name:'Guardar nueva contraseña'}).click();await expect(page.locator('#recovery-success')).toBeVisible();assert.equal(resets,1);
  assert.equal(await page.locator('#new-password').inputValue(),'');
  assert.ok(await page.evaluate(()=>!JSON.stringify({...sessionStorage,...localStorage}).includes('b'.repeat(64))));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await browser.close();}
});

test('destinos y acceso: fotos sin franjas, superficie uniforme y botones genéricos',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/viajes.html?pantalla=destinos');await page.locator('.rv-destination-card').first().waitFor();
  const states=await page.locator('.rv-destination-card').evaluateAll(async ns=>Promise.all(ns.map(async n=>{
   const img=n.querySelector('img');img.loading='eager';await img.decode();const photo=n.querySelector('.rv-card-photo'),box=photo.getBoundingClientRect(),image=img.getBoundingClientRect();
   return {bg:getComputedStyle(n).backgroundColor,border:getComputedStyle(n).borderTopWidth,fit:getComputedStyle(img).objectFit,gap:Math.abs(box.width-image.width)+Math.abs(box.height-image.height),loaded:img.naturalWidth>0};
  })));
  assert.equal(states.length,40);assert.equal(new Set(states.map(s=>s.bg)).size,1);
  for(const state of states){assert.equal(state.border,'0px');assert.equal(state.fit,'cover');assert.ok(state.loaded);assert.ok(state.gap<2,JSON.stringify(state));}
  await page.locator('.rv-destination-card').first().evaluate(n=>window.scrollTo(0,n.getBoundingClientRect().top+scrollY-110));
  await page.screenshot({path:'evidencias/nuevo-destinos-escritorio.png'});
  await page.setViewportSize({width:390,height:900});await page.locator('.rv-destination-card').filter({has:page.getByRole('heading',{name:'Barcelona',exact:true})}).scrollIntoViewIfNeeded();
  await page.screenshot({path:'evidencias/nuevo-destinos-movil.png'});
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'catalog width '+width);}
  for(const url of ['iniciar-sesion.html','registro.html']){
   await page.goto(base+'/'+url);await expect(page.locator('#microsoft-signin')).toBeEnabled({timeout:20000});
   const google=page.locator('#google-signin').getByRole('button',{name:/Continuar con Google/});await expect(google).toBeVisible({timeout:20000});
   await expect(page.getByRole('link',{name:'¿Olvidaste tu contraseña?'})).toBeVisible();
   await page.screenshot({path:'evidencias/nuevo-'+url.replace('.html','')+'-escritorio.png',fullPage:true});
   for(const width of [390,320]){
    await page.setViewportSize({width,height:900});await expect(google).toBeVisible();await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),{message:url+' '+width}).toBe(true);
    await page.screenshot({path:'evidencias/nuevo-'+url.replace('.html','')+'-'+width+'.png',fullPage:true});
   }
   await page.setViewportSize({width:1440,height:1050});
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
