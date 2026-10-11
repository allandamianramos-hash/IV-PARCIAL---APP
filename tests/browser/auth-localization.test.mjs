import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const base=process.env.BROWSER_TEST_ORIGIN||'http://127.0.0.1:8000';
const languages=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
async function language(page,code){
 await page.locator('.locale-toggle').click();
 await page.locator('#rumbo-language').selectOption(code);
 await page.locator('[data-apply]').click();
 await expect(page.locator('html')).toHaveAttribute('lang',code);
 await expect(page.locator('.locale-dialog')).not.toBeVisible();
}
async function mockProviders(page){
 await page.route('**/api/auth/*/config',r=>r.fulfill({json:{enabled:true,clientId:'ui-test',nonce:'a'.repeat(64)}}));
 await page.addInitScript(()=>{window.google={accounts:{id:{initialize:c=>window.testGoogleCallback=c.callback,renderButton:(n,options)=>{window.googleOptions=options;n.innerHTML='<button type="button">Google</button>';}}}};});
 await page.route('**/js/cuenta/microsoft-sdk.js',r=>r.fulfill({contentType:'text/javascript',body:'window.RumboMicrosoft={create:async()=>({handleRedirectPromise:async()=>null,clearCache:async()=>{},loginRedirect:async options=>{window.microsoftOptions=options;}})};'}));
}
test('tarjetas: los diez idiomas, validación, cambios de idioma y acceso social conservan los datos',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await mockProviders(page);
  await page.route('**/api/auth/google',r=>r.fulfill({status:409,json:{code:'RUMBO_PASSWORD_SETUP_REQUIRED',email:'verified@example.test',error:'Crea tu contraseña.'}}));
  for(const file of ['iniciar-sesion.html','registro.html']){
   await page.goto(base+'/'+file);await expect(page.locator('#microsoft-signin')).toBeEnabled();
   await page.locator('#email').fill('traveler@example.test');
   for(const code of languages){
    await language(page,code);
    await expect.poll(()=>page.evaluate(()=>window.googleOptions.locale)).toBe(code);
    await expect(page.locator('#email')).toHaveValue('traveler@example.test');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${file}: ${code}`);
    const heading=await page.locator('h1').innerText();
    if(code!=='es')assert.ok(!['Iniciar sesión','Crear cuenta'].includes(heading),code);
   }
   await language(page,'en');await page.locator('#email').fill('');
   await page.locator('#auth-form [type=submit]').click();
   const invalid=file==='registro.html'?'#full-name':'#email';
   assert.equal(await page.locator(invalid).evaluate(n=>n.validationMessage),'Fill in this field.');
   await page.evaluate(()=>window.testGoogleCallback({credential:'ui-token'}));
   await expect(page.locator('h1')).toHaveText('Create your password');
   await page.locator('#password').fill('Keep this password 123!');
   for(const code of languages){
    await language(page,code);await expect(page.locator('#email')).toHaveValue('verified@example.test');
    await expect(page.locator('#password')).toHaveValue('Keep this password 123!');
    const identity=await page.locator('.auth-social-identity').innerText();
    if(code!=='es')assert.ok(!identity.includes('Cuenta de Google')&&!identity.includes('Usar otra cuenta'),code);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
   await language(page,'en');await page.locator('.auth-social-identity button').click();
   await expect(page.locator('h1')).toHaveText(file==='registro.html'?'Create account':'Log in');
   await language(page,'es');await expect(page.locator('h1')).toHaveText(file==='registro.html'?'Crear cuenta':'Iniciar sesión');
  }
  await language(page,'fr');await page.locator('#microsoft-signin').click();
  await expect.poll(()=>page.evaluate(()=>window.microsoftOptions?.extraQueryParameters.ui_locales)).toBe('fr');
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
test('recuperación: idioma en todos los pasos, errores, contador y confirmación',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:900}});
  await page.route('**/api/auth/password/*',r=>{
   const action=r.request().url().split('/').pop(),body=r.request().postDataJSON();
   if(action==='request')return r.fulfill({json:{requestId:'a'.repeat(64),message:'Si el correo corresponde a una cuenta con contraseña, recibirás un código. Revisa también tu carpeta de spam.'}});
   if(action==='verify')return body.code==='123456'?r.fulfill({json:{resetToken:'b'.repeat(64)}}):r.fulfill({status:400,json:{error:'El código es incorrecto o venció. Puedes solicitar uno nuevo.'}});
   return r.fulfill({json:{message:'Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.'}});
  });
  await page.goto(base+'/recuperar-contrasena.html');
  for(const code of languages){
   await language(page,code);
   if(code!=='es')assert.ok(!(await page.locator('#recovery-title').innerText()).includes('Olvidaste'));
  }
  await language(page,'en');await page.locator('#recovery-email').fill('traveler@example.test');await page.locator('#recovery-email-form [type=submit]').click();
  await expect(page.locator('#recovery-title')).toHaveText('Check your email');
  for(const code of languages){
   await language(page,code);await expect(page.locator('#recovery-description')).toContainText('traveler@example.test');
   if(code!=='es'){
    assert.ok(!(await page.locator('#recovery-step').innerText()).includes('PASO'));
    assert.ok(!(await page.locator('#recovery-status').innerText()).includes('Revisa'));
    assert.ok(!(await page.locator('#recovery-resend').innerText()).includes('Reenviar en'));
   }
  }
  await language(page,'en');await page.locator('#recovery-code').fill('999999');await page.locator('#recovery-code-form [type=submit]').click();
  await expect(page.locator('#recovery-status')).toHaveText('The code is incorrect or expired. Request a new one.');
  await page.locator('#recovery-code').fill('123456');await page.locator('#recovery-code-form [type=submit]').click();
  await expect(page.locator('#recovery-password-form')).toBeVisible();
  for(const code of languages){await language(page,code);if(code!=='es')assert.ok(!(await page.locator('#recovery-title').innerText()).includes('contraseña'));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
  await language(page,'en');await page.locator('#new-password').fill('New password 123!');await page.locator('#confirm-password').fill('Other password 123!');await page.locator('#recovery-password-form [type=submit]').click();
  await expect(page.locator('#recovery-status')).toHaveText('Passwords don’t match.');
  await page.locator('#confirm-password').fill('New password 123!');await page.locator('#recovery-password-form [type=submit]').click();
  await expect(page.locator('#recovery-success')).toBeVisible();
  for(const code of languages){await language(page,code);if(code!=='es')assert.ok(!(await page.locator('#recovery-status').innerText()).includes('puedes iniciar'));}
  await language(page,'es');await expect(page.locator('#recovery-title')).toHaveText('Contraseña actualizada');
 }finally{await browser.close();}
});

test('Google real: el botón y su texto accesible siguen el idioma sin recargar el formulario',async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:900}});
  await page.goto(base+'/iniciar-sesion.html');
  const button=page.locator('#google-signin [role=button]');
  await expect(button).toBeVisible({timeout:20000});
  await page.locator('#email').fill('traveler@example.test');
  for(const [code,label] of [['en','Continue with Google'],['ar','المواصلة باستخدام Google'],['es','Continuar con Google']]){
   await language(page,code);
   await expect(button).toHaveAccessibleName(new RegExp(label),{timeout:20000});
   assert.equal(await button.innerText(),'');
   await expect(page.locator('#email')).toHaveValue('traveler@example.test');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
 }finally{await browser.close();}
});
