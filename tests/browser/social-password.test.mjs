import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';

const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
test('tarjetas amplias y proveedores solo con iconos, centrados y accesibles',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage();
  for(const file of ['iniciar-sesion.html','registro.html']){
   await page.goto(base+'/'+file);
   await expect(page.locator('#microsoft-signin')).toBeEnabled({timeout:30000});
   const google=page.locator('#google-signin [role=button]');await expect(google).toBeVisible();
   await expect(google).toHaveAccessibleName(/^Continuar con Google/);
   await expect(page.locator('#site-navbar')).toHaveCount(0);
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:1050});
    let measured;
    await expect.poll(async()=>{
     const boxes=await page.locator('#google-signin [role=button],#microsoft-signin').evaluateAll(ns=>ns.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,radius:parseFloat(getComputedStyle(n).borderTopLeftRadius),border:getComputedStyle(n).borderTopWidth,bg:getComputedStyle(n).backgroundColor})));
     measured=boxes;
     return boxes.length===2&&Math.abs(boxes[0].width-boxes[1].width)<1&&Math.abs(boxes[0].y-boxes[1].y)<1&&boxes.every(b=>Math.abs(b.height-52)<.1&&b.radius===7&&b.border==='1px')&&boxes[0].bg===boxes[1].bg&&boxes[1].bg==='rgb(255, 255, 255)';
    }).toBe(true).catch(async error=>{await page.screenshot({path:'evidencias/acceso-diagnostico.png',fullPage:true});throw Error(`${file} ${width}: ${JSON.stringify(measured)}; ${error.message}`);});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    for(const selector of ['#google-signin [role=button]','#microsoft-signin']){
     const button=page.locator(selector);assert.equal(await button.innerText(),'');
     const box=await button.boundingBox(),icon=await button.locator('svg').boundingBox();
     assert.ok(Math.abs(box.x+box.width/2-icon.x-icon.width/2)<1,'logo centered horizontally');
     assert.ok(Math.abs(box.y+box.height/2-icon.y-icon.height/2)<1,'logo centered vertically');
    }
    await expect(page.locator('#microsoft-signin')).toHaveAccessibleName('Continuar con Microsoft');
    await expect(page.locator('#password')).toHaveAttribute('placeholder','Ej.: Viaje2026!');
    if(width===1440){assert.equal((await page.locator('.auth-card').boundingBox()).width,536);assert.equal(await page.locator('.auth-brand').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)),42);}
    await page.locator('.auth-social').screenshot({path:`evidencias/botones-${file.replace('.html','')}-${width}.png`});
    await page.screenshot({path:`evidencias/acceso-ampliado-${file.replace('.html','')}-${width}.png`,fullPage:true});
   }
   const popupPromise=page.waitForEvent('popup');
   await google.click({position:{x:10,y:26}});
   const popup=await popupPromise;await popup.close();
  }
 }finally{await browser.close();}
});

for(const provider of ['google','microsoft'])for(const setup of [true,false])for(const file of ['iniciar-sesion.html','registro.html']){
 test(`${provider} en ${file}: ${setup?'crear y confirmar':'exigir'} contraseña en el formulario existente`,async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
   const page=await browser.newPage({viewport:{width:390,height:900}});let submissions=0,completed=false;
   await page.route('**/api/auth/*/config',r=>r.fulfill({json:{enabled:true,clientId:'ui-test-client',nonce:'a'.repeat(64)}}));
   // Only provider callbacks and HTTP responses are simulated here; SQL/security
   // enforcement is exercised separately in the integration suite.
   await page.addInitScript(()=>{window.google={accounts:{id:{initialize:c=>window.testGoogleCallback=c.callback,renderButton:(n)=>{n.innerHTML='<button type="button">Continuar con Google</button>';},disableAutoSelect(){}}}};});
   await page.route('**/js/cuenta/microsoft-sdk.js',r=>r.fulfill({contentType:'text/javascript',body:`window.RumboMicrosoft={create:async()=>({handleRedirectPromise:async()=>(${provider==='microsoft'?'{idToken:"ui-test-credential"}':'null'}),clearCache:async()=>{},loginRedirect:async()=>{}})};`}));
   await page.route('**/api/auth/'+provider,async route=>{
    const body=route.request().postDataJSON();assert.equal(body.credential,'ui-test-credential');assert.equal(body.email,undefined);
    const pw=setup?body.newPassword:body.password;
    if(!pw)return route.fulfill({status:409,json:{code:setup?'RUMBO_PASSWORD_SETUP_REQUIRED':'RUMBO_PASSWORD_REQUIRED',error:'Confirma tu contraseña de Rumbo.',email:'cuenta-verificada@example.test'}});
    submissions++;
    if(pw==='incorrecta')return route.fulfill({status:401,json:{code:'RUMBO_PASSWORD_REQUIRED',error:'La contraseña de Rumbo no es correcta.'}});
    assert.equal(pw,'Contraseña de prueba UI 123!');completed=true;
    await route.fulfill({status:200,json:{user:{id:'ui-test'}}});
   });
   await page.goto(base+'/'+file);
   if(provider==='google'){await page.waitForFunction(()=>window.testGoogleCallback);await page.evaluate(()=>window.testGoogleCallback({credential:'ui-test-credential'}));}
   const form=page.locator('#auth-form');await expect(form).toHaveAttribute('data-social-provider',provider);
   await expect(page.locator('dialog[open]')).toHaveCount(0);
   await expect(page.locator('#email')).toHaveValue('cuenta-verificada@example.test');
   await expect(page.locator('#email')).toHaveAttribute('readonly','');
   await expect(page.locator('.auth-recovery-link a')).toBeVisible();await expect(page.locator('.auth-switch')).toBeVisible();
   await expect(page.locator('.auth-social')).toBeHidden();
   if(file==='registro.html')await expect(page.locator('#full-name')).toBeDisabled();
   assert.equal(completed,false);assert.equal(submissions,0);
   if(setup){
    await page.locator('#password').fill('Contraseña de prueba UI 123!');await page.locator('#social-password-confirm').fill('Contraseña que no coincide');
    await form.getByRole('button',{name:'Crear contraseña y entrar'}).click();await expect(form).toContainText('Las contraseñas no coinciden.');assert.equal(submissions,0);
    await page.locator('#social-password-confirm').fill('Contraseña de prueba UI 123!');
   }else{
    await page.locator('#password').fill('incorrecta');await form.getByRole('button',{name:'Iniciar sesión',exact:true}).click();
    await expect(form).toContainText('no es correcta');await expect(page.locator('#password')).toHaveValue('');assert.equal(completed,false);
    await expect(page.locator('#email')).toHaveValue('cuenta-verificada@example.test');await page.locator('#password').fill('Contraseña de prueba UI 123!');
   }
   await page.locator('.auth-card').screenshot({path:`evidencias/${provider}-${setup?'crear':'confirmar'}-formulario-${file.replace('.html','')}.png`});
   const storage=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));assert.ok(!storage.includes('Contraseña de prueba UI')&&!storage.includes('ui-test-credential'));
   await form.getByRole('button',{name:setup?'Crear contraseña y entrar':'Iniciar sesión',exact:true}).click();
   await page.waitForURL('**/index.html');assert.equal(completed,true);
  }finally{await browser.close();}
 });
}

for(const provider of ['google','microsoft'])test(`${provider}: cambiar de cuenta descarta la credencial y restaura el formulario`,async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000}});let providerCalls=0,localCalls=0;
  await page.route('**/api/auth/*/config',r=>r.fulfill({json:{enabled:true,clientId:'ui-test-client',nonce:'a'.repeat(64)}}));
  await page.addInitScript(()=>{window.google={accounts:{id:{initialize:c=>window.testGoogleCallback=c.callback,renderButton:n=>{n.innerHTML='<button>Continuar con Google</button>';}}}};});
  await page.route('**/js/cuenta/microsoft-sdk.js',r=>r.fulfill({contentType:'text/javascript',body:`window.RumboMicrosoft={create:async()=>({handleRedirectPromise:async()=>(${provider==='microsoft'?'{idToken:"cancel-test-token"}':'null'}),clearCache:async()=>{},loginRedirect:async()=>{}})};`}));
  await page.route('**/api/auth/'+provider,r=>{providerCalls++;return r.fulfill({status:409,json:{code:'RUMBO_PASSWORD_SETUP_REQUIRED',email:'seleccionada@example.test',error:'Crea tu contraseña.'}});});
  await page.route('**/api/auth/register',r=>{localCalls++;const body=r.request().postDataJSON();assert.equal(body.email,'otra@example.test');assert.equal(body.credential,undefined);return r.fulfill({status:201,json:{user:{id:'cancel-test'}}});});
  await page.goto(base+'/registro.html');
  if(provider==='google'){await page.waitForFunction(()=>window.testGoogleCallback);await page.evaluate(()=>window.testGoogleCallback({credential:'cancel-test-token'}));}
  await expect(page.locator('#auth-form')).toHaveAttribute('data-social-provider',provider);
  await page.locator('#password').fill('No conservar esta contraseña');await page.locator('#social-password-confirm').fill('No conservar esta contraseña');
  await page.getByRole('button',{name:'Usar otra cuenta'}).click();
  await expect(page.locator('#email')).toHaveValue('');await expect(page.locator('#email')).toBeEditable();
  await expect(page.locator('#password')).toHaveValue('');await expect(page.locator('#social-password-confirm')).toHaveCount(0);
  await expect(page.locator('#full-name')).toBeVisible();await expect(page.locator('#full-name')).toBeEnabled();
  await expect(page.locator('.auth-social')).toBeVisible();await expect(page.locator('#microsoft-signin')).toBeEnabled();
  await page.locator('#full-name').fill('Otra viajera');await page.locator('#email').fill('otra@example.test');await page.locator('#password').fill('Contraseña temporal UI 123!');
  await page.locator('#auth-form [type=submit]').click();await page.waitForURL('**/index.html');
  assert.equal(providerCalls,1);assert.equal(localCalls,1);
 }finally{await browser.close();}
});

test('acceso social vencido y contraseña creada en otra pestaña permiten recuperarse sin diálogo',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:1000}});let step=0;
  await page.route('**/api/auth/*/config',r=>r.fulfill({json:{enabled:false,clientId:'ui-test-client',nonce:'a'.repeat(64)}}));
  await page.route('**/api/auth/google/config',r=>r.fulfill({json:{enabled:true,clientId:'ui-test-client',nonce:'a'.repeat(64)}}));
  await page.addInitScript(()=>{window.google={accounts:{id:{initialize:c=>window.testGoogleCallback=c.callback,renderButton:n=>{n.innerHTML='<button>Continuar con Google</button>';}}}};});
  await page.route('**/api/auth/google',r=>{
   step++;const body=r.request().postDataJSON();assert.equal(body.credential,'expiry-test-token');
   if(step===1)return r.fulfill({status:409,json:{code:'RUMBO_PASSWORD_SETUP_REQUIRED',email:'cuenta@example.test',error:'Crea tu contraseña.'}});
   if(step===2)return r.fulfill({status:409,json:{code:'RUMBO_PASSWORD_REQUIRED',email:'cuenta@example.test',error:'Ya existe una contraseña.'}});
   return r.fulfill({status:401,json:{error:'El acceso venció. Vuelve a elegir tu cuenta.'}});
  });
  await page.goto(base+'/iniciar-sesion.html');await page.waitForFunction(()=>window.testGoogleCallback);await page.evaluate(()=>window.testGoogleCallback({credential:'expiry-test-token'}));
  await expect(page.locator('#social-password-confirm')).toBeVisible();await page.locator('#password').fill('Temporal UI 123!');await page.locator('#social-password-confirm').fill('Temporal UI 123!');
  await page.locator('#auth-form [type=submit]').click();await expect(page.locator('#social-password-confirm')).toHaveCount(0);
  await expect(page.locator('#email')).toHaveValue('cuenta@example.test');await expect(page.locator('#password')).toHaveValue('');
  await expect(page.locator('.auth-social-identity')).toHaveCount(1);await expect(page.locator('.auth-switch')).toContainText('¿No tienes una cuenta?');
  await page.locator('.auth-card').screenshot({path:'evidencias/acceso-social-integrado.png'});
  await page.locator('#password').fill('Temporal UI 123!');await page.locator('#auth-form [type=submit]').click();
  await expect(page.locator('#auth-feedback')).toContainText('El acceso venció');await expect(page.locator('#email')).toBeEditable();await expect(page.locator('#email')).toHaveValue('');
  await expect(page.locator('.auth-social')).toBeVisible();await expect(page.locator('dialog[open]')).toHaveCount(0);assert.equal(step,3);
 }finally{await browser.close();}
});
