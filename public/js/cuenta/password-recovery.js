(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const forms=[$('#recovery-email-form'),$('#recovery-code-form'),$('#recovery-password-form')];
  if(!forms[0])return;
  let email='',requestId='',resetToken='',busy=false,resendAt=0;
  const status=$('#recovery-status');
  function step(index,title,description){
    forms.forEach((form,i)=>form.hidden=i!==index);
    $('#recovery-title').textContent=title;$('#recovery-description').textContent=description;
    $('#recovery-step').textContent=index<3?`PASO ${index+1} DE 3`:'TODO LISTO';
    $('#recovery-success').hidden=index!==3;
    $('#recovery-title').focus();
  }
  async function call(action,body){
    const response=await fetch('/api/auth/password/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(40000)});
    const data=await response.json();if(!response.ok)throw Error(data.error||'No pudimos completar la solicitud.');return data;
  }
  async function run(operation){
    if(busy)return;busy=true;status.dataset.tone='pending';status.textContent='Un momento…';
    document.querySelectorAll('.auth-card button').forEach(button=>button.disabled=true);
    try{await operation();status.dataset.tone='success';}catch(error){status.dataset.tone='error';status.textContent=error.name==='TimeoutError'?'La conexión tardó demasiado. Inténtalo de nuevo.':error.message||'Revisa tu conexión e inténtalo otra vez.';}
    finally{busy=false;document.querySelectorAll('.auth-card button').forEach(button=>button.disabled=false);updateResend();}
  }
  async function requestCode(){
    const data=await call('request',{email});requestId=data.requestId;resetToken='';resendAt=Date.now()+60000;
    $('#recovery-code').value='';step(1,'Revisa tu correo',`Introduce el código enviado a ${email}.`);status.textContent=data.message;
  }
  forms[0].addEventListener('submit',event=>{event.preventDefault();if(!forms[0].reportValidity())return;email=$('#recovery-email').value.trim();run(requestCode);});
  forms[1].addEventListener('submit',event=>{event.preventDefault();if(!forms[1].reportValidity())return;run(async()=>{
    const data=await call('verify',{requestId,code:$('#recovery-code').value.trim()});resetToken=data.resetToken;$('#recovery-code').value='';
    step(2,'Elige una nueva contraseña','Tu código está verificado. Guarda una contraseña para volver a entrar.');status.textContent='';
  });});
  forms[2].addEventListener('submit',event=>{event.preventDefault();if(!forms[2].reportValidity())return;
    const password=$('#new-password').value;
    if(password!==$('#confirm-password').value){status.dataset.tone='error';status.textContent='Las contraseñas no coinciden.';return;}
    if(new TextEncoder().encode(password).length>72){status.dataset.tone='error';status.textContent='La contraseña es demasiado larga. Usa una más corta.';return;}
    run(async()=>{const data=await call('reset',{requestId,resetToken,password});requestId='';resetToken='';forms[2].reset();
      step(3,'Contraseña actualizada','Tu cuenta está lista. Inicia sesión para continuar.');status.textContent=data.message;$('#recovery-social-note').hidden=true;
    });
  });
  function updateResend(){
    const seconds=Math.max(0,Math.ceil((resendAt-Date.now())/1000)),button=$('#recovery-resend');
    button.disabled=busy||seconds>0;
    const source=seconds?`Reenviar en ${seconds} s`:'Reenviar código';
    const text=window.RumboLocale?.translate(source)||source;
    if(button.textContent!==text)button.textContent=text;
  }
  $('#recovery-resend').setAttribute('translate','no');
  window.addEventListener('rumbo:localechange',updateResend);
  const timer=setInterval(updateResend,1000);window.addEventListener('pagehide',()=>{clearInterval(timer);resetToken='';requestId='';forms[2].reset();});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
  $('#recovery-resend').addEventListener('click',()=>run(requestCode));
  $('#recovery-change-email').addEventListener('click',()=>{requestId='';resetToken='';status.textContent='';step(0,'¿Olvidaste tu contraseña?','Te enviaremos un código para recuperar el acceso.');});
  $('#recovery-restart').addEventListener('click',()=>{forms[2].reset();$('#recovery-change-email').click();});
  $('#recovery-show-password').addEventListener('change',event=>{for(const id of ['#new-password','#confirm-password'])$(id).type=event.target.checked?'text':'password';});
})();
