/* La sesión vive en una cookie HttpOnly; nunca se guarda la contraseña en el navegador. */
(() => {
  function init(){
    const boot=JSON.parse(document.querySelector('#rumbo-bootstrap')?.textContent||'{}');
    let user=boot.user||null;
    const form=document.querySelector('#auth-form'),feedback=document.querySelector('#auth-feedback');
    const sessionKeys=['rumbo.store.cart.v2','rumbo.store.favorites.v2','rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.profile.v1','rumbo.checkout.v1','rumbo.no-flight.v1','rumbo.departureChecklist.v1','rumbo.sync.pending.v1','rumbo.sync.visitor.v1'];
    function changed(){
      try{sessionStorage.removeItem("rumbo.socialDemo");}catch{}
      try{sessionKeys.forEach(k=>localStorage.removeItem(k));localStorage.setItem('rumbo.auth.changed',String(Date.now()));}catch{}
    }
    async function request(path,data){
      if(await window.RumboStorage?.flush?.()===false)throw Error('No pudimos guardar tus cambios. Reintenta la conexión para continuar.');
      if(window.RumboDatabase?.connected===false){window.RumboStorage?.reportError?.('offline');throw Error('Conecta Rumbo para acceder a tu cuenta.');}
      if(window.RumboStorage?.hasPending?.())throw Error('Hay cambios pendientes de guardar. Reintenta antes de cambiar de cuenta.');
      let response;
      try{response=await fetch('/api/auth/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data||{}),signal:AbortSignal.timeout(path==='microsoft'?35000:path==='google'?35000:15000)});}
      catch(error){window.RumboStorage?.reportError?.('database');throw error;}
      if(response.status>=500)window.RumboStorage?.reportError?.('database');
      const result=await response.json();if(!response.ok){const error=Error(result.error||'No se pudo completar la solicitud.');error.status=response.status;error.code=result.code;error.email=result.email;throw error;}return result;
    }
    const returnPath=(()=>{
      const requested=new URLSearchParams(location.search).get('returnTo');
      if(!requested)return 'index.html';
      try{const url=new URL(requested,location.href);return url.origin===location.origin&&['/servicios.html','/tienda.html','/viajes.html','/index.html'].includes(url.pathname)?url.pathname+url.search:'index.html';}catch{return 'index.html';}
    })();
    const accounts=document.querySelector('.account-actions');
    let accountName;
    function updateGreeting(){
      if(!accountName)return;
      let alias='';
      try{const profile=JSON.parse((window.RumboStorage||localStorage).getItem('rumbo.profile.v1'));if(typeof profile?.alias==='string')alias=profile.alias.trim();}catch{}
      accountName.textContent=alias||user?.name?.trim().split(/\s+/)[0]||'viajero';
    }
    function render(){
      document.querySelectorAll('a[href="servicios.html?seccion=registro"]').forEach(a=>a.href='registro.html');
      document.querySelectorAll('a[href="servicios.html?seccion=iniciar-sesion"]').forEach(a=>a.href='iniciar-sesion.html');
      if(!accounts||!user)return;
      const menu=document.createElement('details');menu.className='account-menu';
      const toggle=document.createElement('summary');toggle.className='account-toggle';toggle.setAttribute('aria-label','Mi cuenta');
      toggle.innerHTML='<span class="account-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg></span><span>Mi cuenta</span><svg class="account-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
      const panel=document.createElement('div');panel.className='account-panel';
      const identity=document.createElement('div');identity.className='account-identity';
      const greeting=document.createElement('strong');const greetingLabel=document.createElement('span');greetingLabel.textContent='Hola, ';accountName=document.createElement('span');accountName.setAttribute('translate','no');updateGreeting();greeting.append(greetingLabel,accountName);
      const email=document.createElement('span');email.textContent=user.email||'';email.setAttribute('translate','no');
      identity.append(greeting,email);
      const nav=document.createElement('nav');nav.setAttribute('aria-label','Opciones de mi cuenta');
      const paths={profile:'<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',trip:'<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M9 7V4h6v3M8 11v6m8-6v6"/>',cart:'<path d="M3 3h2l3 12h10l3-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>'};
      for(const [label,href,icon]of [['Mi perfil','servicios.html?seccion=perfil','profile'],['Viajes y compras','servicios.html?seccion=historial','trip'],['Mi viaje actual','servicios.html?seccion=mi-viaje','trip'],['Mi carrito','tienda.html?carrito=1','cart']]){
        const link=document.createElement('a');link.href=href;link.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">'+paths[icon]+'</svg><span>'+label+'</span>';nav.append(link);
      }
      const logout=document.createElement('button');logout.type='button';logout.className='account-link auth-logout';logout.textContent='Cerrar sesión';
      const status=document.createElement('span');status.className='auth-header-status';status.setAttribute('role','status');
      logout.addEventListener('click',async()=>{
        logout.disabled=true;status.textContent='';
        try{await request('logout');window.google?.accounts?.id?.disableAutoSelect();changed();location.replace('index.html');}
        catch(e){status.textContent=e.name==='TimeoutError'?'La conexión tardó demasiado. Inténtalo de nuevo.':e.message;logout.disabled=false;}
      });
      panel.append(identity,nav,logout,status);menu.append(toggle,panel);
      document.addEventListener('click',e=>{if(!menu.contains(e.target))menu.open=false;});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;toggle.focus();}});
      accounts.classList.add('is-authenticated');accounts.replaceChildren(menu);
    }
    render();
    window.addEventListener('rumbo:profile-changed',updateGreeting);
    window.addEventListener('storage',e=>{if(e.key==='rumbo.profile.v1')updateGreeting();});
    let socialPending=null,submitting=false;
    const heading=document.querySelector('.auth-heading h1'),intro=document.querySelector('.auth-heading>p');
    const switchLink=document.querySelector('.auth-switch');
    const originalText=node=>window.RumboLocale?.originalText(node)||node.textContent;
    const originalForm=form?{title:originalText(heading),intro:originalText(intro),switchHTML:form.dataset.mode==='register'?'¿Ya tienes cuenta? <a href="iniciar-sesion.html">Iniciar sesión</a>':'¿No tienes una cuenta? <a href="registro.html">Regístrate</a>',submit:form.dataset.mode==='register'?'Crear mi cuenta':'Iniciar sesión',
      label:'Contraseña',placeholder:'Ej.: Viaje2026!',
      autocomplete:form.elements.password.autocomplete,minLength:form.elements.password.minLength}:null;
    function clearPasswordFields(){
      if(!form)return;form.elements.password.value='';form.elements.password.type='password';
      const toggle=document.querySelector('#toggle-password');toggle.textContent='Mostrar';toggle.setAttribute('aria-pressed','false');
      const confirm=form.querySelector('#social-password-confirm');if(confirm)confirm.value='';
    }
    function cancelSocial(){
      if(submitting||!socialPending)return;
      const pending=socialPending;socialPending=null;pending.credential='';pending.onClose();
      clearPasswordFields();form.elements.email.readOnly=false;form.elements.email.value='';
      const name=form.querySelector('#full-name');if(name){name.disabled=false;name.closest('.auth-field').hidden=false;}
      form.querySelector('.auth-social-identity')?.remove();form.querySelector('.auth-social-confirm')?.remove();
      form.querySelector('label[for=password]').textContent=originalForm.label;
      Object.assign(form.elements.password,{placeholder:originalForm.placeholder,autocomplete:originalForm.autocomplete});
      if(originalForm.minLength<0)form.elements.password.removeAttribute('minlength');else form.elements.password.minLength=originalForm.minLength;
      const help=form.querySelector('#password-help');if(help)help.hidden=false;
      heading.textContent=originalForm.title;intro.textContent=originalForm.intro;form.querySelector('[type=submit]').textContent=originalForm.submit;
      switchLink.innerHTML=originalForm.switchHTML;
      document.querySelector('.auth-social').hidden=false;feedback.textContent='';delete form.dataset.socialProvider;form.elements.email.focus();
    }
    function requireRumboPassword(provider,credential,error,onClose,onSuccess){
      if(submitting){onClose();throw Error('Espera a que termine el acceso en curso.');}
      // The email is returned only after server-side identity and nonce verification.
      if(!form||typeof error.email!=='string'||!error.email){onClose();throw Error('No se pudo recuperar el correo verificado. Vuelve a elegir tu cuenta.');}
      if(socialPending)cancelSocial();
      const setup=error.code==='RUMBO_PASSWORD_SETUP_REQUIRED';
      socialPending={provider,credential,setup,onClose,onSuccess};form.dataset.socialProvider=provider;
      clearPasswordFields();form.elements.email.value=error.email;form.elements.email.readOnly=true;
      const name=form.querySelector('#full-name');if(name){name.disabled=true;name.closest('.auth-field').hidden=true;}
      heading.textContent=setup?'Crear tu contraseña':'Iniciar sesión';
      intro.textContent=setup?'Crea una contraseña de Rumbo para completar tu cuenta.':'Escribe tu contraseña de Rumbo para continuar.';
      if(!setup)switchLink.innerHTML='¿No tienes una cuenta? <a href="registro.html">Regístrate</a>';
      const identity=document.createElement('div');identity.className='auth-social-identity';
      const label=document.createElement('span');label.textContent='Cuenta de '+(provider==='google'?'Google':'Microsoft')+' verificada';
      const change=document.createElement('button');change.type='button';change.textContent='Usar otra cuenta';change.addEventListener('click',cancelSocial);
      identity.append(label,change);form.prepend(identity);
      form.querySelector('label[for=password]').textContent='Contraseña de Rumbo';
      Object.assign(form.elements.password,{placeholder:'Ej.: Viaje2026!',autocomplete:setup?'new-password':'current-password',minLength:setup?8:1});
      const help=form.querySelector('#password-help');if(help)help.hidden=true;
      if(setup){
        const confirm=document.createElement('div');confirm.className='auth-field auth-social-confirm';
        confirm.innerHTML='<label for="social-password-confirm">Repite la contraseña</label><input id="social-password-confirm" type="password" autocomplete="new-password" minlength="8" maxlength="128" required><small>Al menos 8 caracteres. Usa una contraseña propia de Rumbo.</small>';
        form.elements.password.closest('.auth-field').after(confirm);
      }
      form.querySelector('[type=submit]').textContent=setup?'Crear contraseña y entrar':'Iniciar sesión';
      document.querySelector('.auth-social').hidden=true;feedback.textContent='';
      form.elements.password.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'instant'});
    }
    window.addEventListener('pagehide',()=>{if(socialPending)socialPending.credential='';socialPending=null;clearPasswordFields();});
    const googleContainer=document.querySelector('#google-signin');
    if(googleContainer&&!user){
      const googleStatus=document.querySelector('#google-feedback');
      let googleBusy=false,googleResizeObserver;
      async function receiveGoogle(response){
        if(googleBusy||submitting||socialPending)return;googleBusy=true;googleStatus.textContent='Comprobando tu cuenta de Google…';
        try{await request('google',{credential:response.credential});changed();location.replace(returnPath);}
        catch(error){
          googleStatus.textContent=error.message;
          if(['RUMBO_PASSWORD_REQUIRED','RUMBO_PASSWORD_SETUP_REQUIRED'].includes(error.code)){
            try{requireRumboPassword('google',response.credential,error,()=>{googleBusy=false;googleStatus.textContent='';},async()=>{});}catch(e){googleStatus.textContent=e.message;}
          }
          else googleBusy=false;
        }
      }
      async function setupGoogle(){
        googleStatus.textContent='Cargando Google…';
        try{
          const response=await fetch('/api/auth/google/config',{signal:AbortSignal.timeout(15000)});
          const config=await response.json();
          if(!response.ok)throw Error(config.error||'No se pudo cargar Google.');
          if(!config.enabled){googleStatus.textContent='Google estará disponible pronto. Puedes usar tu correo y contraseña.';return;}
          let sdkLocale=window.RumboLocale?.language||'es',managedLibrary=false,loadingLanguage=false;
          function loadGoogleLibrary(locale){return new Promise((resolve,reject)=>{
            const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client?hl='+encodeURIComponent(locale);script.async=true;
            const timer=setTimeout(()=>reject(Error('Google tardó demasiado en cargar. Recarga la página.')),15000);
            script.onload=()=>{clearTimeout(timer);resolve();};
            script.onerror=()=>{clearTimeout(timer);reject(Error('No se pudo cargar Google. Revisa tu conexión o el bloqueador del navegador.'));};
            document.head.append(script);
          });}
          if(!window.google?.accounts?.id){managedLibrary=true;await loadGoogleLibrary(sdkLocale);}
          const initializeGoogle=()=>window.google.accounts.id.initialize({client_id:config.clientId,nonce:config.nonce,callback:receiveGoogle,auto_select:false,button_auto_select:false});
          initializeGoogle();
          // Use Google's own multicolor mark and existing sign-in handler.
          googleResizeObserver?.disconnect();
          let renderedWidth=0,renderedLocale='';
          const googleButton=document.createElement('div');googleButton.className='auth-google-button';googleContainer.replaceChildren(googleButton);
          function renderGoogleButton(){
            if(!googleContainer.clientWidth)return;
            const width=Math.floor(googleContainer.clientWidth);
            const locale=window.RumboLocale?.language||document.documentElement.lang||'es';
            // GIS uses the library language for its accessible fallback button,
            // and the render option for its iframe. Keep both in the same locale.
            if(managedLibrary&&sdkLocale!==locale){
              if(loadingLanguage)return;
              loadingLanguage=true;
              loadGoogleLibrary(locale).then(()=>{sdkLocale=locale;initializeGoogle();renderedLocale='';loadingLanguage=false;googleStatus.textContent='';renderGoogleButton();})
                .catch(error=>{loadingLanguage=false;googleStatus.textContent=error.message;});
              return;
            }
            if(width===renderedWidth&&locale===renderedLocale)return;
            renderedLocale=locale;
            renderedWidth=width;
            window.google.accounts.id.renderButton(googleButton,{type:'icon',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',locale});
          }
          renderGoogleButton();
          googleResizeObserver=new ResizeObserver(renderGoogleButton);
          googleResizeObserver.observe(googleContainer);
          window.addEventListener('rumbo:localechange',renderGoogleButton);
          googleStatus.textContent='';
        }catch(error){googleStatus.textContent=error.name==='TimeoutError'?'La conexión tardó demasiado. Recarga la página.':error.message;}
      }
      setupGoogle();
    }
    const microsoftButton=document.querySelector('#microsoft-signin');
    if(microsoftButton&&!user){
      const status=document.querySelector('#microsoft-feedback');
      let client,config,busy=false;
      function microsoftError(error){
        if(['user_cancelled','access_denied'].includes(error.errorCode))return 'Cancelaste el acceso con Microsoft. Puedes intentarlo de nuevo.';
        if(error.errorCode==='interaction_in_progress')return 'Ya hay un acceso con Microsoft en curso. Completa ese acceso o recarga la página.';
        if(error.errorCode)return 'Microsoft no pudo completar el acceso ('+error.errorCode+'). Inténtalo de nuevo o usa tu correo.';
        return error.message||'No se pudo conectar con Microsoft. Inténtalo de nuevo.';
      }
      async function setupMicrosoft(){
        status.textContent='Cargando Microsoft…';
        try{
          const response=await fetch('/api/auth/microsoft/config',{signal:AbortSignal.timeout(15000)});
          config=await response.json();if(!response.ok)throw Error(config.error||'No se pudo cargar Microsoft.');
          if(!config.enabled){status.textContent='Microsoft estará disponible pronto. Puedes usar Google o tu correo.';return;}
          if(!window.RumboMicrosoft)throw Error('No se pudo cargar Microsoft. Recarga la página.');
          client=await window.RumboMicrosoft.create(config.clientId);
          const result=await client.handleRedirectPromise();
          status.textContent='';microsoftButton.disabled=false;
          if(result){
            await client.clearCache();
            busy=true;status.textContent='Comprobando tu cuenta de Microsoft…';
            try{await request('microsoft',{credential:result.idToken});await client.clearCache();changed();location.replace(returnPath);}
            catch(error){status.textContent=error.message;if(['RUMBO_PASSWORD_REQUIRED','RUMBO_PASSWORD_SETUP_REQUIRED'].includes(error.code))requireRumboPassword('microsoft',result.idToken,error,()=>{busy=false;microsoftButton.disabled=false;status.textContent='';client.clearCache().catch(()=>{});},()=>client.clearCache());else busy=false;}
          }
        }catch(error){status.textContent=microsoftError(error);if(client)microsoftButton.disabled=false;}
      }
      microsoftButton.addEventListener('click',async()=>{
        if(busy||!client)return;busy=true;microsoftButton.disabled=true;status.textContent='Conectando con Microsoft…';
        try{
          if(await window.RumboStorage?.flush?.()===false||window.RumboStorage?.hasPending?.())throw Error('Guarda tus cambios pendientes antes de continuar.');
          // Renew the challenge before leaving, even when this page has been open for a while.
          const response=await fetch('/api/auth/microsoft/config',{signal:AbortSignal.timeout(15000)});
          const fresh=await response.json();if(!response.ok||!fresh.enabled)throw Error(fresh.error||'Microsoft no está disponible.');
          await client.loginRedirect({scopes:['openid','profile','email'],nonce:fresh.nonce,prompt:'login',extraQueryParameters:{ui_locales:window.RumboLocale?.language||'es',mkt:window.RumboLocale?.language||'es'}});
        }catch(error){busy=false;microsoftButton.disabled=false;status.textContent=microsoftError(error);}
      });
      setupMicrosoft();
    }
    if(form){
      if(user){if(!window.RumboStorage?.isRedirecting?.())location.replace(returnPath);return;}
      const register=form.dataset.mode==='register';
      form.addEventListener('submit',async event=>{
        event.preventDefault();if(submitting||!form.reportValidity())return;
        if(socialPending){
          const pending=socialPending,confirm=form.querySelector('#social-password-confirm');
          if(pending.setup&&form.elements.password.value!==confirm.value){feedback.textContent='Las contraseñas no coinciden.';confirm.focus();return;}
          if(pending.setup&&new TextEncoder().encode(form.elements.password.value).length>72){feedback.textContent='Usa al menos 8 caracteres y como máximo 72 bytes.';return;}
          submitting=true;const submit=form.querySelector('[type=submit]'),change=form.querySelector('.auth-social-identity button');submit.disabled=true;change.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent='Comprobando tu contraseña…';
          try{
            await request(pending.provider,{credential:pending.credential,[pending.setup?'newPassword':'password']:form.elements.password.value});
            clearPasswordFields();pending.credential='';await pending.onSuccess();socialPending=null;changed();location.replace(returnPath);
          }catch(error){
            clearPasswordFields();feedback.textContent=error.message;
            if(error.code==='RUMBO_PASSWORD_REQUIRED'&&pending.setup){
              submitting=false;requireRumboPassword(pending.provider,pending.credential,error,pending.onClose,pending.onSuccess);
            }else if((error.status===401&&error.code!=='RUMBO_PASSWORD_REQUIRED')||['GOOGLE_EXPIRED','MICROSOFT_EXPIRED'].includes(error.code)){
              submitting=false;cancelSocial();feedback.textContent=error.message;
            }
            form.elements.password.focus();
          }finally{submitting=false;submit.disabled=false;change.disabled=false;form.removeAttribute('aria-busy');}
          return;
        }
        submitting=true;
        const submit=form.querySelector('[type=submit]');submit.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent=register?'Creando tu cuenta…':'Comprobando tus datos…';
        try{
          const data={email:form.elements.email.value.trim(),password:form.elements.password.value};
          if(register){
            data.name=form.elements.name.value.trim();
            if(new TextEncoder().encode(data.password).length>72)throw Error('La contraseña es demasiado larga. Usa una más corta, de al menos 8 caracteres.');
          }
          await request(register?'register':'login',data);form.elements.password.value='';changed();location.replace(returnPath);
        }catch(e){form.elements.password.value='';feedback.textContent=e.name==='TimeoutError'?'La conexión tardó demasiado. Inténtalo de nuevo.':e.message;feedback.focus();submit.disabled=false;form.removeAttribute('aria-busy');}finally{submitting=false;}
      });
      const toggle=document.querySelector('#toggle-password');
      toggle.addEventListener('click',()=>{const field=form.elements.password;const show=field.type==='password';field.type=show?'text':'password';toggle.textContent=show?'Ocultar':'Mostrar';toggle.setAttribute('aria-pressed',String(show));});
    }
    window.addEventListener('storage',e=>{if(e.key==='rumbo.auth.changed')location.reload();});
    window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
    window.addEventListener('focus',async()=>{
      try{const response=await fetch('/api/auth/me');if(!response.ok)return;const data=await response.json();if((data.user?.id||null)!==(user?.id||null)){
        if(window.RumboStorage?.hasPending?.()){window.RumboStorage?.reportError?.('session');return;}
        changed();location.reload();
      }}catch{}
    });
  }
  // Deferred scripts run while readyState is "interactive". Wait until js/compartido/navigation.js
  // has built the header before replacing its guest links with the current user.
  if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
