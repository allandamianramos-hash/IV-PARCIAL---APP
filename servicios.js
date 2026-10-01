(() => {
  'use strict';
  const root = document.querySelector('.services-main');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => `L ${Number(value).toLocaleString('es-HN', { maximumFractionDigits: 0 })}`;
  const KEY = 'rumbo.services.v1';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const download = text => { const url = URL.createObjectURL(new Blob(['\uFEFF'+text], {type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href=url; a.download='mi-viaje-rumbo.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000); };
  const catalog = window.RumboViajesDatos.destinations;
  const configs = {
    traslados: {name:'Traslados', title:'Llegar también puede ser fácil.', intro:'Del aeropuerto al primer paseo. Elige una ruta y encuentra espacio para todos y sus maletas.', icon:'↔', stamp:'DEL PUNTO A AL PUNTO B'},
    seguros: {name:'Seguro de viaje', title:'Dale espacio a la tranquilidad.', intro:'Compara planes y guarda una opción para revisarla después.', icon:'◇', stamp:'CUIDA LO QUE IMPORTA'},
    guias: {name:'Guías locales', title:'Un lugar se conoce mejor en compañía.', intro:'Encuentra una experiencia que conecte contigo: historia, naturaleza o una tarde junto al mar.', icon:'◎', stamp:'HISTORIAS QUE CONECTAN'}
  };
  const params = new URLSearchParams(location.search);
  const section = params.get('seccion') || 'servicios';
  const pageNames = {'mi-viaje':'Mi viaje',perfil:'Mi perfil',ayuda:'Centro de ayuda',acerca:'Acerca de Rumbo',equipo:'Nuestro equipo',cambios:'Cambios',privacidad:'Privacidad',terminos:'Condiciones de uso'};
  document.title = `${pageNames[section] || configs[section]?.name || 'Servicios'} | Rumbo`;
  const crumb = name => `<nav class="service-breadcrumb" aria-label="Ruta de navegación"><a href="index.html">Inicio</a><span>/</span><a href="servicios.html">Servicios</a><span>/</span><span aria-current="page">${name}</span></nav>`;
  const servicePhotos={
    vuelos:['imagenes-viajes/servicio-vuelo.jpg','Ala de avión sobre un paisaje de montañas'],
    hoteles:['imagenes-viajes/hotel-piscina.jpg','Piscina y terrazas de un hotel'],
    traslados:['imagenes-viajes/servicio-traslado.jpg','Taxi recorriendo una calle de la ciudad'],
    seguros:['imagenes-viajes/servicio-seguro.jpg','Pasaporte abierto preparado para un viaje'],
    guias:['imagenes-viajes/servicio-guia.jpg','Viajero caminando por un sendero natural'],
    tienda:['imagenes/bolso-mano.jpg','Bolso de viaje de cuero']
  };
  const hero = (title, intro, eyebrow, icon='↗', stamp='TU PRÓXIMO RUMBO') => {
    const [src,alt]=servicePhotos[section]||['imagenes-viajes/naturaleza.jpg','Sendero entre árboles para explorar nuevos lugares'];
    return `<section class="service-hero"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${intro}</p><span class="service-hero-label">${stamp}</span>${section==='servicios'?'<a class="button button-primary service-explore" href="#opciones-servicios">Elegir un servicio <span aria-hidden="true">↘</span></a>':''}</div><figure class="service-photo"><img src="${src}" alt="${alt}" width="720" height="540"></figure></section>`;
  };
  const tabs = () => `<nav class="service-tabs" aria-label="Servicios de viaje"><a href="viajes.html?pantalla=vuelos">Vuelos</a><a href="viajes.html?pantalla=hoteles">Hoteles</a>${Object.entries(configs).map(([id,c]) => `<a href="servicios.html?seccion=${id}" ${section===id?'aria-current="page"':''}>${c.name}</a>`).join('')}</nav>`;
  const input = (id,label,type,value,extra='') => `<div class="service-field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${value}" ${extra} required></div>`;
  const select = (id,label,options) => `<div class="service-field"><label for="${id}">${label}</label><select id="${id}" name="${id}">${options.map(([value,text])=>`<option value="${value}">${text}</option>`).join('')}</select></div>`;
  const records = () => { const data=read(KEY,[]); return Array.isArray(data) ? data.filter(r => r && Object.hasOwn(configs,r.section) && typeof r.title==='string' && typeof r.detail==='string' && Number.isFinite(r.total) && r.total>=0).slice(0,3) : []; };
  const status = text => { $('#service-status').textContent=text; };

  function servicePage() {
    const c=configs[section];
    document.title=`${c.name} | Rumbo`;
    let fields='';
    if(section==='traslados') fields=select('route','Ruta', [['roatan','Aeropuerto de Roatán → West Bay'],['sps','Aeropuerto Ramón Villeda Morales → San Pedro Sula'],['sjo','Aeropuerto Juan Santamaría → San José']])+input('date','Fecha del traslado','date',today(),`min="${today()}"`)+input('time','Hora de recogida','time','10:00')+input('people','Pasajeros','number',2,'min="1" max="12" step="1"')+input('bags','Maletas grandes','number',2,'min="0" max="12" step="1"')+select('direction','Sentido',[['out','Ida'],['back','Ruta inversa']]);
    if(section==='seguros') fields=select('zone','Zona del viaje',[['nacional','Honduras'],['internacional','Internacional']])+input('date','Inicio del viaje','date',today(),`min="${today()}"`)+input('end','Fin del viaje','date',today(),`min="${today()}"`)+input('people','Viajeros','number',1,'min="1" max="12" step="1"');
    if(section==='guias') fields=select('destination','Destino',catalog.map(d=>[d.id,d.name]))+input('date','Fecha del recorrido','date',today(),`min="${today()}"`)+input('people','Personas','number',2,'min="1" max="12" step="1"')+select('language','Idioma',[['all','Cualquier idioma'],['es','Español'],['en','Inglés']])+select('style','Experiencia',[['all','Todas'],['cultura','Cultura e historia'],['naturaleza','Naturaleza'],['playa','Costa y descanso']]);
    root.innerHTML=crumb(c.name)+hero(c.title,c.intro,'LOS DETALLES HACEN EL VIAJE',c.icon,c.stamp)+tabs()+`<div class="service-stage"><span>01</span><div><h2>Personaliza tu búsqueda</h2><p>Primero los detalles; después compara y elige.</p></div></div><form id="service-search" class="service-form">${fields}<div class="service-form-foot"><p id="form-notice">Ajusta los detalles y compara las opciones.</p><button class="button button-primary">Ver opciones ↗</button></div></form><div class="service-stage"><span>02</span><div><h2>Compara y elige tu opción</h2><p>Revisa qué incluye cada alternativa y guarda tu favorita en Mi viaje.</p></div></div><div class="service-layout"><section aria-labelledby="results-title"><h2 id="results-title">Opciones para tu viaje</h2><p id="results-count" role="status"></p><div id="service-results" class="service-results"></div></section><aside class="service-summary" aria-label="Resumen"><p class="eyebrow">TU ELECCIÓN</p><h2>Un detalle más, listo.</h2><div id="summary-content"><p>Elige una opción para revisar el importe y guardarla.</p></div><button id="save-service" class="button button-primary" disabled>Guardar y continuar →</button><p id="service-status" class="service-status" role="status" aria-live="polite"></p></aside></div>`;
    if(section==='guias' && catalog.some(d=>d.id===params.get('destino'))) $('#destination').value=params.get('destino');
    const form=$('#service-search'); let selected=null, options=[], detail='';
    const saved = records().find(r=>r.section===section);
    if(!saved) {
      const trip=read('rumbo.integrante2.viaje.v1',{});
      const destination=catalog.find(d=>d.id===trip?.destinationId);
      if(destination){
        const date=trip.checkIn || trip.date;
        if(typeof date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && date>=today())$('#date').value=date;
        if(!$('#date').checkValidity())$('#date').value=today();
        if(Number.isInteger(trip.travelers) && trip.travelers>=1 && trip.travelers<=12)$('#people').value=trip.travelers;
        if(section==='guias')$('#destination').value=destination.id;
        if(section==='traslados')$('#route').value=({roatan:'roatan','san-pedro-sula':'sps','san-jose':'sjo'})[destination.id] || 'roatan';
        if(section==='seguros'){
          $('#zone').value=destination.region==='honduras'?'nacional':'internacional';
          const end=new Date($('#date').value+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+Math.min(30,Math.max(1,Number(trip.nights)||1)));$('#end').value=end.toISOString().slice(0,10);
        }
      }
    }
    if(saved?.values && typeof saved.values==='object') {
      for(const field of form.querySelectorAll('input,select')) {
        const value=saved.values[field.name]; if(typeof value!=='string')continue;
        const original=field.value; field.value=value;
        if(!field.checkValidity() || !field.value)field.value=original;
      }
    }
    if(section==='guias' && catalog.some(d=>d.id===params.get('destino'))) $('#destination').value=params.get('destino');
    function clearSelection(){ selected=null; $('#save-service').disabled=true; $('#summary-content').innerHTML='<p>Elige una opción para revisar el importe y guardarla.</p>'; root.querySelectorAll('[data-choose]').forEach(b=>{b.setAttribute('aria-pressed','false');b.textContent='Elegir opción';b.closest('article').dataset.selected='false';}); status(''); }
    function validate(){
      $('#date').min=today();
      if(section==='seguros') { $('#end').min=$('#date').value; $('#end').setCustomValidity($('#end').value < $('#date').value?'La fecha final debe ser igual o posterior al inicio.':''); }
      return form.reportValidity();
    }
    function render(){
      if(!validate()) return;
      clearSelection(); form.dataset.dirty='false';
      const values=Object.fromEntries(new FormData(form)); const people=Number(values.people);
      detail=`${values.date} · ${people} ${people===1?'persona':'personas'}`;
      if(section==='traslados'){
        const base={roatan:750,sps:800,sjo:950}[values.route];
        detail=`${$('#route').selectedOptions[0].textContent}${values.direction==='back'?' (ruta inversa)':''} · ${detail} · ${values.time} · ${values.bags} maletas`;
        options=[{id:'compacto',title:'Un viaje para ti',tag:'Auto privado',capacity:3,bags:2,factor:1,desc:'Un vehículo solo para tu grupo. Ideal para viajar ligero.'},{id:'familiar',title:'Espacio para compartir',tag:'Miniván privada',capacity:6,bags:6,factor:1.65,desc:'Más espacio para las maletas y para las personas que te acompañan.'},{id:'grupo',title:'Todos en el mismo rumbo',tag:'Van para grupos',capacity:12,bags:12,factor:2.6,desc:'La salida empieza juntos, con espacio para todo el grupo.'}].filter(o=>o.capacity>=people && o.bags>=Number(values.bags)).map(o=>({...o,total:Math.round(base*o.factor),unit:'Total por vehículo · un trayecto',items:[`Hasta ${o.capacity} pasajeros y ${o.bags} maletas`,'Recogida y destino según la ruta elegida','Paradas adicionales no incluidas']}));
      } else if(section==='seguros') {
        const days=Math.round((Date.parse(values.end)-Date.parse(values.date))/86400000)+1;
        detail=`${$('#zone').selectedOptions[0].textContent} · ${values.date} al ${values.end} · ${days} ${days===1?'día':'días'} · ${people} ${people===1?'viajero':'viajeros'}`;
        options=[{id:'esencial',title:'Esencial',price:35,tag:'Lo básico del camino',desc:'Una primera idea de asistencia para una escapada sencilla.',items:['Asistencia médica: límite L 100,000','Equipaje: no contemplado','Cancelación: no contemplada']},{id:'acompanado',title:'Acompañado',price:60,tag:'Más aspectos del viaje',desc:'Una propuesta que también contempla contratiempos con el equipaje.',items:['Asistencia médica: límite L 250,000','Equipaje: límite L 8,000','Cancelación: no contemplada']},{id:'amplio',title:'Más tranquilo',price:95,tag:'Una comparación más amplia',desc:'Compara también interrupciones del viaje.',items:['Asistencia médica: límite L 500,000','Equipaje: límite L 15,000','Interrupción: límite L 20,000']}].map(o=>({...o,total:o.price*days*people*(values.zone==='internacional'?2:1),unit:`${days} ${days===1?'día':'días'} × ${people} ${people===1?'viajero':'viajeros'}`,items:[...o.items,'Excluye actividades de riesgo y condiciones preexistentes']}));
      } else {
        const d=catalog.find(d=>d.id===values.destination); detail=`${d.name} · ${detail}`;
        options=[{id:d.id+'-paseo',title:`Una primera mirada a ${d.name}`,tag:'Recorrido cultural · 2 horas',style:'cultura',language:'es',price:380,desc:'Un paseo para orientarte, escuchar historias y reconocer los rincones del destino.'},{id:d.id+'-paisaje',title:'El paisaje, paso a paso',tag:'Al aire libre · 3 horas',style:d.type==='playa'?'playa':'naturaleza',language:'en',price:550,desc:'Una salida pausada para disfrutar del entorno y llevarte una perspectiva distinta.'},{id:d.id+'-sabores',title:'Historias y sabores del lugar',tag:'Cultura local · 3 horas',style:'cultura',language:'es',price:650,desc:'Una idea de recorrido para conocer el destino a través de sus costumbres y su cocina.'}].filter(o=>(values.language==='all'||o.language===values.language)&&(values.style==='all'||o.style===values.style)).map(o=>({...o,total:o.price*people,unit:`${money(o.price)} por persona × ${people}`,items:[`Idioma del recorrido: ${o.language==='es'?'español':'inglés'}`,'Acompañamiento de guía local (perfil por confirmar)','Entradas, comidas y traslados no incluidos']}));
      }
      $('#results-count').textContent=`${options.length} ${options.length===1?'opción':'opciones'} · ${detail}`;
      $('#form-notice').textContent='Resultados actualizados. Elige la opción que mejor va contigo.';
      $('#service-results').innerHTML=options.length?options.map(o=>`<article class="service-option" data-option="${o.id}"><span class="service-badge">${o.tag}</span><h3>${o.title}</h3><p>${o.desc}</p><ul>${o.items.map(i=>`<li>${i}</li>`).join('')}</ul><div class="service-option-bottom"><div><strong>${money(o.total)}</strong><small>${o.unit}</small></div><button class="button button-outline" type="button" data-choose="${o.id}" aria-pressed="false" aria-label="Elegir ${o.title}">Elegir opción</button></div></article>`).join(''):'<div class="service-empty"><h3>No hay opciones con estos filtros.</h3><p>Prueba otro idioma o tipo de experiencia.</p><button class="button button-outline" type="button" id="reset-service">Limpiar filtros</button></div>';
      $('#reset-service')?.addEventListener('click',()=>{ $('#language').value='all'; $('#style').value='all'; render(); });
      const target=read('rumbo.integrante2.viaje.v1',{})?.destinationId;
      if(section==='traslados' && target && !['roatan','san-pedro-sula','san-jose'].includes(target)){
        options=[];
        $('#results-count').textContent='No hay rutas para el destino elegido.';
        $('#service-results').innerHTML='<div class="service-empty"><h3>Puedes continuar sin traslado.</h3><p>Las rutas disponibles actualmente son Roatán, San Pedro Sula y San José. No añadiremos un transporte que no corresponda a tu destino.</p></div>';
      }
    }
    form.addEventListener('input',()=>{clearSelection(); form.dataset.dirty='true'; $('#form-notice').textContent='Pulsa Ver opciones para aplicar tus cambios.'; root.querySelectorAll('[data-choose]').forEach(b=>b.disabled=true); if(section==='seguros') { $('#end').min=$('#date').value; $('#end').setCustomValidity(''); }});
    form.addEventListener('submit',event=>{event.preventDefault();render();});
    $('#service-results').addEventListener('click',event=>{
      const button=event.target.closest('[data-choose]'); if(!button || button.disabled || form.dataset.dirty==='true')return;
      selected=options.find(o=>o.id===button.dataset.choose); if(!selected)return;
      root.querySelectorAll('[data-choose]').forEach(b=>{const active=b===button;b.setAttribute('aria-pressed',String(active));b.textContent=active?'Seleccionado ✓':'Elegir opción';b.closest('article').dataset.selected=String(active);});
      $('#summary-content').innerHTML=`<h3>${selected.title}</h3><p>${escape(detail)}</p><p class="service-total">${money(selected.total)}</p><p>${selected.unit}</p>`; $('#save-service').disabled=false;status('');
    });
    $('#save-service').addEventListener('click',()=>{
      if(!selected||form.dataset.dirty==='true')return;
      const next=records().filter(r=>r.section!==section); next.push({section,title:selected.title,detail,total:selected.total,values:Object.fromEntries(new FormData(form)),destinationId:read('rumbo.integrante2.viaje.v1',{})?.destinationId,savedAt:new Date().toISOString()});
      if(write(KEY,next)){status('Guardado. Continuamos con el siguiente paso.'); location.href=({traslados:'servicios.html?seccion=seguros',seguros:'servicios.html?seccion=guias',guias:'tienda.html'})[section];}
      else {status('El navegador no permite guardar. Descarga el resumen para conservarlo.');const b=document.createElement('button');b.type='button';b.className='button button-outline';b.textContent='Descargar esta elección';b.onclick=()=>download(`${c.name}\n${selected.title}\n${detail}\n${money(selected.total)}`);$('#service-status').append(b);}
    });
    render();
    if(saved){const option=options.find(o=>o.title===saved.title);if(option)root.querySelector(`[data-choose="${option.id}"]`)?.click();}
  }

  function hub(){
    root.innerHTML=hero('Cada detalle, en su lugar.','Ya tienes la idea. Ahora elige qué necesitas para hacerla tuya. Puedes empezar por cualquier servicio.','ORGANIZA TU VIAJE')+`<div class="service-grid" id="opciones-servicios">${[
      ['✈','Vuelos','Compara horarios, clases y precios para llegar a tu destino.','viajes.html?pantalla=vuelos','Buscar vuelos'],['⌂','Hoteles','Elige dónde descansar y calcula tu estancia completa.','viajes.html?pantalla=hoteles','Buscar hoteles'],['↔','Traslados','Conecta el aeropuerto y tu hospedaje con espacio para todos.','servicios.html?seccion=traslados','Organizar traslado'],['◇','Seguro de viaje','Explora planes y compara sus diferencias.','servicios.html?seccion=seguros','Comparar planes'],['◎','Guías locales','Descubre historias, paisajes y costumbres en compañía.','servicios.html?seccion=guias','Explorar recorridos'],['▣','Tienda de viaje','Prepara tu equipaje con los esenciales que van contigo.','tienda.html','Explorar tienda']
    ].map(([icon,title,desc,url,label])=>`<article class="service-tile" ${url==='tienda.html'?'id="tienda"':''}><img class="service-tile-photo" src="${servicePhotos[url.includes("traslados")?"traslados":url.includes("seguros")?"seguros":url.includes("guias")?"guias":url.includes("hoteles")?"hoteles":url.includes("tienda")?"tienda":"vuelos"][0]}" alt="${title}" loading="lazy" width="560" height="320"><h2>${title}</h2><p>${desc}</p><a class="text-link" href="${url}">${label} ↗</a></article>`).join('')}</div><div class="service-footer-links"><a class="button button-outline" href="viajes.html?pantalla=destinos">Todavía estoy buscando un destino</a><a class="button button-primary" href="servicios.html?seccion=mi-viaje">Ver mis elecciones ↗</a></div>`;
  }

  function savedPage(){ window.RumboJourney.renderSummary(root); }

  const help = {
    ayuda:['Estamos para orientarte.','Encuentra respuestas para moverte por Rumbo.',[
      ['¿Por dónde empiezo?','Explora Destinos, abre un lugar y elige si quieres buscar un vuelo o un hotel. En Servicios puedes añadir los demás detalles.'],['¿Dónde encuentro mis elecciones?','En Mi viaje encontrarás vuelos, hospedaje, servicios y productos juntos, con un único total y un resumen descargable.'],['¿Se guardan mis datos?','Tus elecciones se guardan en este navegador cuando permite almacenamiento local. No se sincronizan entre dispositivos y pueden perderse si borras los datos del sitio.'],['¿Cómo cambio una selección?','Abre el servicio, ajusta los datos y guarda otra opción. La nueva elección reemplaza la anterior de ese servicio. También puedes quitarla desde Mi viaje.']]],
    cambios:['Tu plan puede cambiar.','Vuelve a elegir cuando lo necesites.',[['Cambiar vuelos y hoteles','Abre el resumen del viaje y ajusta destino, fechas o viajeros. Las elecciones incompatibles se descartan y podrás comparar de nuevo.'],['Quitar servicios y productos','En Mi viaje puedes eliminar vuelos, hospedaje, servicios y productos, o vaciar el viaje completo. También puedes deshacer la última eliminación. Para cambiar cantidades, abre el carrito de la tienda.']]],
    acerca:['Viajar empieza con una idea.','Rumbo está pensado para reunir la inspiración y la organización de un viaje en un mismo lugar.',[['Nuestra intención','Ayudarte a descubrir un destino, entender cada elección y preparar el viaje sin saltar entre pantallas confusas.'],['Nuestro compañero','Rumbito es tu copiloto de viaje: una mascota de ubicación que te acompaña a descubrir nuevos destinos. Te ayuda a empezar por lo que importa para ti.'],['Tu viaje organizado','Explora destinos, compara opciones y reúne tus elecciones en Mi viaje.']]],
    equipo:['Diferentes ideas. Un mismo rumbo.','Un proyecto construido por estudiantes para aprender creando.',[['El equipo de Rumbo','Allan Ramos, Omar Tabora, Dianny Moreira y Dilan Banegas. Los canales de contacto del equipo están disponibles en la página principal.'],['Lo que estamos construyendo','Una experiencia de viaje que conecte destinos, servicios y accesorios con una navegación sencilla y una identidad propia.']]],
    privacidad:['Tus datos, con claridad.','Información sobre tus datos en Rumbo.',[['Qué se guarda aquí','El navegador puede conservar preferencias del viaje, servicios elegidos, productos del carrito, favoritos y el alias del perfil local. No se solicitan contraseñas ni documentos en el perfil.'],['Cómo borrar lo guardado','Puedes quitar servicios desde Mi viaje, vaciar productos desde el carrito o borrar los datos del sitio en tu navegador. El perfil local tiene un botón para eliminarlo.'],['Recursos externos','Algunas fotografías y las tipografías se cargan desde servicios externos. El navegador se conecta a esos proveedores para mostrarlos.'],['Conversaciones con Rumbito','Los mensajes y el historial reciente del chat se envían a nuestro proveedor de IA para generar respuestas. La aplicación no guarda conversaciones en disco; los proveedores pueden aplicar sus propias políticas de tratamiento de datos. No compartas datos sensibles en el chat.'],['Próximas etapas','Antes de introducir cuentas, pagos o datos personales, será necesario definir y publicar la política correspondiente a esos servicios.']]],
    terminos:['Tu viaje empieza aquí.','Condiciones de uso de Rumbo.',[['Organizar tu viaje','Reúne destinos, fechas, servicios y productos en un solo plan.'],['Tu resumen','Guarda tus selecciones y descarga el resumen desde Mi viaje.'],['Imágenes y contenidos','Las fotografías de referencia tienen sus créditos en el catálogo de destinos y la tienda. No implican relación comercial con marcas o proveedores.']]]
  };
  function helpPage(id){const [title,intro,items]=help[id];root.innerHTML=crumb('Información')+hero(title,intro,'CONOCE RUMBO','?','UN POCO DE AYUDA')+`<section class="help-card">${items.map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><p>${a}</p></details>`).join('')}<div class="service-footer-links"><a class="button button-primary" href="index.html#contacto">Contactar al equipo ↗</a><a class="button button-outline" href="servicios.html">Explorar servicios</a></div></section>`;}
  function accountAccess(){
    const registration=section==='registro';
    const title=registration?'Registrarse':'Iniciar sesión';
    document.title=title+' | Rumbo';
    root.innerHTML=crumb(title)+hero(title,registration?'Tu próximo viaje también tendrá su propio espacio.':'Un espacio para tus viajes y preferencias.','TU CUENTA EN RUMBO','◎','VIAJA A TU MANERA')+`<section class="help-card service-profile"><h2>Las cuentas estarán disponibles próximamente</h2><p>El registro y el inicio de sesión todavía no están conectados a un servicio de autenticación. Por ahora, no se crean cuentas ni se inician sesiones.</p><p>Puedes seguir organizando tu viaje y usar tu perfil de viaje. Sus datos se guardan únicamente en este navegador y no se sincronizan entre dispositivos.</p><div class="service-footer-links"><a class="button button-primary" href="servicios.html?seccion=perfil">Usar mi perfil</a><a class="button button-outline" href="servicios.html?seccion=mi-viaje">Continuar a mi viaje ↗</a></div><p><a class="text-link" href="servicios.html?seccion=${registration?'iniciar-sesion':'registro'}">${registration?'Ir a Iniciar sesión':'Ir a Registrarse'} ↗</a></p></section>`;
  }
  function account(){
    const profile=read('rumbo.profile.v1',{});
    root.innerHTML=crumb('Mi perfil')+hero('Tu viaje empieza contigo.','Crea tu perfil de viaje con un alias y tu estilo de viaje. Se guarda solo en este navegador.','TU ESPACIO EN RUMBO','◎','A TU MANERA')+`<section class="help-card service-profile"><h2>Mi perfil</h2><p>Elige tu alias y tu estilo de viaje.</p><form id="profile-form" class="service-form">${input('alias','¿Cómo quieres que te llamemos?','text',escape(typeof profile?.alias==='string'?profile.alias:''),'maxlength="40" autocomplete="off" placeholder="Tu alias"')}${select('preference','Tu estilo de viaje',[['playa','Playa y descanso'],['naturaleza','Naturaleza'],['cultura','Cultura e historia']])}<div class="service-form-foot"><button class="button button-primary">Guardar perfil</button><button type="button" class="button button-outline" id="delete-profile">Eliminar perfil</button></div></form><p id="service-status" class="service-status" role="status"></p><a class="text-link" href="servicios.html?seccion=mi-viaje">Ir a mi viaje ↗</a></section>`;
    if(['playa','naturaleza','cultura'].includes(profile?.preference))$('#preference').value=profile.preference;
    $('#profile-form').addEventListener('submit',e=>{e.preventDefault();const alias=$('#alias').value.trim();if(!alias){$('#alias').setCustomValidity('Escribe un alias.');$('#alias').reportValidity();return;}status(write('rumbo.profile.v1',{alias,preference:$('#preference').value})?`Listo, ${alias}. Tu perfil está guardado en este navegador.`:'No se pudo guardar el perfil. Revisa los permisos del navegador.');});
    $('#alias').addEventListener('input',()=>$('#alias').setCustomValidity(''));
    $('#delete-profile').addEventListener('click',()=>{try{localStorage.removeItem('rumbo.profile.v1');$('#profile-form').reset();$('#alias').value='';status('Perfil eliminado. Tus elecciones de viaje se conservan.');}catch{status('No se pudo eliminar el perfil.');}});
  }
  if(Object.hasOwn(configs,section)) servicePage();
  else if(section==='mi-viaje')savedPage();
  else if(section==='perfil')account();
  else if(section==='iniciar-sesion'||section==='registro')accountAccess();
  else if(section==='equipo')location.replace('index.html#nuestro-equipo');
  else if(section==='legal'){document.title='Información legal | Rumbo';root.innerHTML=crumb('Información legal')+hero('Información legal.','Fuentes y licencias de los recursos visuales de Rumbo.','RUMBO')+document.querySelector('#legal-content').innerHTML;}
  else if(Object.hasOwn(help,section))helpPage(section);
  else if(section==='servicios')hub();
  else {document.title='Página no encontrada | Rumbo';root.innerHTML=hero('Ese camino aún no existe.','Vuelve a nuestros servicios y elige por dónde continuar.','RUMBO')+'<a class="button button-primary" href="servicios.html">Ver servicios ↗</a>';}
  window.addEventListener('pageshow',event=>{if(event.persisted && section==='mi-viaje')savedPage();});
  window.addEventListener('storage',event=>{if(section==='mi-viaje' && [KEY,'rumbo.integrante2.viaje.v1','rumbo.store.cart.v2','rumbo.checkout.v1',null].includes(event.key))savedPage();});
})();
