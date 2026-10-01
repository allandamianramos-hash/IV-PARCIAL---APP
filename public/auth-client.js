/* La sesión vive en una cookie HttpOnly; nunca se guarda la contraseña en el navegador. */
(() => {
  function init(){
    const boot=JSON.parse(document.querySelector('#rumbo-bootstrap')?.textContent||'{}');
    let user=boot.user||null;
    const form=document.querySelector('#auth-form'),feedback=document.querySelector('#auth-feedback');
    const sessionKeys=['rumbo.store.cart.v2','rumbo.store.favorites.v2','rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.profile.v1','rumbo.checkout.v1','rumbo.no-flight.v1','rumbo.departureChecklist.v1','rumbo.sync.pending.v1','rumbo.sync.visitor.v1'];
    function changed(){
      try{sessionKeys.forEach(k=>localStorage.removeItem(k));localStorage.setItem('rumbo.auth.changed',String(Date.now()));}catch{}
    }
    async function request(path,data){
      await window.RumboStorage?.flush?.();
      if(window.RumboStorage?.hasPending?.())throw Error('Hay cambios pendientes de guardar. Usa Reintentar antes de cambiar de cuenta.');
      const response=await fetch('/api/auth/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data||{}),signal:AbortSignal.timeout(15000)});
      const result=await response.json();if(!response.ok)throw Error(result.error||'No se pudo completar la solicitud.');return result;
    }
    const accounts=document.querySelector('.account-actions');
    function render(){
      document.querySelectorAll('a[href="servicios.html?seccion=registro"]').forEach(a=>a.href='registro.html');
      document.querySelectorAll('a[href="servicios.html?seccion=iniciar-sesion"]').forEach(a=>a.href='iniciar-sesion.html');
      if(!accounts||!user)return;
      const name=document.createElement('span');name.className='auth-user-name';name.textContent=user.name;name.title=user.name;
      const logout=document.createElement('button');logout.type='button';logout.className='account-link auth-logout';logout.textContent='Cerrar sesión';
      const status=document.createElement('span');status.className='auth-header-status';status.setAttribute('role','status');
      logout.addEventListener('click',async()=>{
        logout.disabled=true;status.textContent='';
        try{await window.RumboStorage?.flush?.();await request('logout');changed();location.replace('index.html');}
        catch(e){status.textContent=e.name==='TimeoutError'?'La conexión tardó demasiado. Inténtalo de nuevo.':e.message;logout.disabled=false;}
      });
      accounts.replaceChildren(name,logout,status);
    }
    render();
    if(form){
      if(user){location.replace('index.html');return;}
      const register=form.dataset.mode==='register';
      form.addEventListener('submit',async event=>{
        event.preventDefault();if(!form.reportValidity())return;
        const submit=form.querySelector('[type=submit]');submit.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent=register?'Creando tu cuenta…':'Comprobando tus datos…';
        try{
          const data={email:form.elements.email.value.trim(),password:form.elements.password.value};
          if(register){
            data.name=form.elements.name.value.trim();
            if(new TextEncoder().encode(data.password).length>72)throw Error('La contraseña es demasiado larga. Usa una más corta, de al menos 8 caracteres.');
          }
          await request(register?'register':'login',data);form.elements.password.value='';changed();location.replace('index.html');
        }catch(e){feedback.textContent=e.name==='TimeoutError'?'La conexión tardó demasiado. Inténtalo de nuevo.':e.message;feedback.focus();submit.disabled=false;form.removeAttribute('aria-busy');}
      });
      const toggle=document.querySelector('#toggle-password');
      toggle.addEventListener('click',()=>{const field=form.elements.password;const show=field.type==='password';field.type=show?'text':'password';toggle.textContent=show?'Ocultar':'Mostrar';toggle.setAttribute('aria-pressed',String(show));});
    }
    window.addEventListener('storage',e=>{if(e.key==='rumbo.auth.changed')location.reload();});
    window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
    window.addEventListener('focus',async()=>{
      try{const response=await fetch('/api/auth/me');if(!response.ok)return;const data=await response.json();if((data.user?.id||null)!==(user?.id||null)){changed();location.reload();}}catch{}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
