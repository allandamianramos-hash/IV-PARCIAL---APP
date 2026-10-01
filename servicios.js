(() => {
  'use strict';
  const root = document.querySelector('.services-main');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => `L ${Number(value).toLocaleString('es-HN', { maximumFractionDigits: 0 })}`;
  const KEY = 'rumbo.services.v1';
  const read = (key, fallback) => { try { return JSON.parse((window.RumboStorage || localStorage).getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { (window.RumboStorage || localStorage).setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const download = text => { const url = URL.createObjectURL(new Blob(['\uFEFF'+text], {type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href=url; a.download='mi-viaje-rumbo.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 10000); };
  const catalog = window.RumboViajesDatos.destinations;
  const configs = {
    traslados: {name:'Traslados', title:'Traslados al aeropuerto', intro:'Del aeropuerto al primer paseo. Elige una ruta y encuentra espacio para todos y sus maletas.', icon:'↔', stamp:'DEL PUNTO A AL PUNTO B'},
    seguros: {name:'Seguro de viaje', title:'Comparar seguros de viaje', intro:'Compara planes y guarda una opción para revisarla después.', icon:'◇', stamp:'CUIDA LO QUE IMPORTA'},
    guias: {name:'Guías locales', title:'Recorridos con guías locales', intro:'Consulta recorridos culturales, parques, playas y mercados de cada destino.', icon:'◎', stamp:'HISTORIAS QUE CONECTAN'}
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
  const hero = (title, intro, eyebrow, icon='↗', stamp='') => {
    const [src,alt]=servicePhotos[section]||['imagenes-viajes/naturaleza.jpg','Sendero entre árboles para explorar nuevos lugares'];
    return `<section class="service-hero"><div><h1>${title}</h1><p>${intro}</p>${section==='servicios'?'<a class="button button-primary service-explore" href="#opciones-servicios">Elegir un servicio <span aria-hidden="true">↘</span></a>':''}</div><figure class="service-photo"><img src="${src}" alt="${alt}" width="720" height="540"></figure></section>`;
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
    root.innerHTML=crumb(c.name)+hero(c.title,c.intro,'LOS DETALLES HACEN EL VIAJE',c.icon,c.stamp)+tabs()+`<div class="service-stage"><span>01</span><div><h2>Personaliza tu búsqueda</h2><p>Primero los detalles; después compara y elige.</p></div></div><form id="service-search" class="service-form">${fields}<div class="service-form-foot"><p id="form-notice">Ajusta los detalles y compara las opciones.</p><button class="button button-primary">Ver opciones ↗</button></div></form><div class="service-stage"><span>02</span><div><h2>Compara y elige tu opción</h2><p>Revisa qué incluye cada alternativa y guarda tu favorita en Mi viaje.</p></div></div><div class="service-layout"><section aria-labelledby="results-title"><h2 id="results-title">Opciones para tu viaje</h2><p id="results-count" role="status"></p><div id="service-results" class="service-results"></div></section><aside class="service-summary" aria-label="Resumen"><p class="eyebrow">TU ELECCIÓN</p><h2>Resumen del servicio</h2><div id="summary-content"><p>Elige una opción para revisar el importe y guardarla.</p></div><button id="save-service" class="button button-primary" disabled>Guardar y continuar →</button><p id="service-status" class="service-status" role="status" aria-live="polite"></p></aside></div>`;
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
        const base=(window.RumboDatabase?.catalog?.serviceRates?.transfers || {roatan:750,sps:800,sjo:950})[values.route];
        detail=`${$('#route').selectedOptions[0].textContent}${values.direction==='back'?' (ruta inversa)':''} · ${detail} · ${values.time} · ${values.bags} maletas`;
        options=[{id:'compacto',title:'Auto privado',tag:'Auto privado',capacity:3,bags:2,factor:1,desc:'Un vehículo solo para tu grupo. Ideal para viajar ligero.'},{id:'familiar',title:'Miniván privada',tag:'Miniván privada',capacity:6,bags:6,factor:1.65,desc:'Más espacio para las maletas y para las personas que te acompañan.'},{id:'grupo',title:'Van para grupos',tag:'Van para grupos',capacity:12,bags:12,factor:2.6,desc:'Vehículo con capacidad para hasta 12 pasajeros.'}].filter(o=>o.capacity>=people && o.bags>=Number(values.bags)).map(o=>({...o,total:Math.round(base*o.factor),unit:'Total por vehículo · un trayecto',items:[`Hasta ${o.capacity} pasajeros y ${o.bags} maletas`,'Recogida y destino según la ruta elegida','Paradas adicionales no incluidas']}));
      } else if(section==='seguros') {
        const days=Math.round((Date.parse(values.end)-Date.parse(values.date))/86400000)+1;
        detail=`${$('#zone').selectedOptions[0].textContent} · ${values.date} al ${values.end} · ${days} ${days===1?'día':'días'} · ${people} ${people===1?'viajero':'viajeros'}`;
        options=[{id:'esencial',title:'Esencial',price:35,tag:'Lo básico del camino',desc:'Una primera idea de asistencia para una escapada sencilla.',items:['Asistencia médica: límite L 100,000','Equipaje: no contemplado','Cancelación: no contemplada']},{id:'acompanado',title:'Acompañado',price:60,tag:'Más aspectos del viaje',desc:'Una propuesta que también contempla contratiempos con el equipaje.',items:['Asistencia médica: límite L 250,000','Equipaje: límite L 8,000','Cancelación: no contemplada']},{id:'amplio',title:'Más tranquilo',price:95,tag:'Una comparación más amplia',desc:'Compara también interrupciones del viaje.',items:['Asistencia médica: límite L 500,000','Equipaje: límite L 15,000','Interrupción: límite L 20,000']}].map(o=>({...o,price:window.RumboDatabase?.catalog?.serviceRates?.insurance?.[o.id] ?? o.price})).map(o=>({...o,total:o.price*days*people*(values.zone==='internacional'?2:1),unit:`${days} ${days===1?'día':'días'} × ${people} ${people===1?'viajero':'viajeros'}`,items:[...o.items,'Excluye actividades de riesgo y condiciones preexistentes']}));
      } else {
        const d=catalog.find(d=>d.id===values.destination); detail=`${d.name} · ${detail}`;
        options=[{id:d.id+'-paseo',title:`Una primera mirada a ${d.name}`,tag:'Recorrido cultural · 2 horas',style:'cultura',language:'es',price:380,desc:'Un paseo para orientarte, escuchar historias y reconocer los rincones del destino.'},{id:d.id+'-paisaje',title:'El paisaje, paso a paso',tag:'Al aire libre · 3 horas',style:d.type==='playa'?'playa':'naturaleza',language:'en',price:550,desc:'Una salida pausada para disfrutar del entorno y llevarte una perspectiva distinta.'},{id:d.id+'-sabores',title:'Historias y sabores del lugar',tag:'Cultura local · 3 horas',style:'cultura',language:'es',price:650,desc:'Una idea de recorrido para conocer el destino a través de sus costumbres y su cocina.'}].map(o=>({...o,price:window.RumboDatabase?.catalog?.serviceRates?.guides?.[o.id.split('-').pop()] ?? o.price})).filter(o=>(values.language==='all'||o.language===values.language)&&(values.style==='all'||o.style===values.style)).map(o=>({...o,total:o.price*people,unit:`${money(o.price)} por persona × ${people}`,items:[`Idioma del recorrido: ${o.language==='es'?'español':'inglés'}`,'Acompañamiento de guía local (perfil por confirmar)','Entradas, comidas y traslados no incluidos']}));
      }
      $('#results-count').textContent=`${options.length} ${options.length===1?'opción':'opciones'} · ${detail}`;
      $('#form-notice').textContent='Resultados actualizados. Revisa el precio y las condiciones antes de elegir.';
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

  function guidesPage() {
    root.classList.add('guides-page');
    const saved = records().find(r => r.section === 'guias');
    const trip = read('rumbo.integrante2.viaje.v1', {});
    const initial = [params.get('destino'), saved?.values?.destination, trip?.destinationId].map(id => catalog.find(d => d.id === id)).find(Boolean) || catalog[0];
    const styles = { cultura: 'Cultura', naturaleza: 'Naturaleza', playa: 'Playa', gastronomia: 'Gastronomía' };
    const experiences = window.RumboGuias || [];
    root.innerHTML = crumb('Guías locales') + `
      <section class="guide-hero" aria-labelledby="guide-title">
        <div class="guide-hero-copy"><h1 id="guide-title">Guías locales</h1><p>Recorridos a pie, parques, playas y mercados. Consulta las paradas de cada propuesta, ajusta la fecha y calcula el precio para tu grupo.</p><a href="#guide-search" class="button button-primary">Consultar recorridos <span aria-hidden="true">↓</span></a><dl class="guide-catalog-facts"><div><dt>Destinos</dt><dd>${catalog.length}</dd></div><div><dt>Recorridos</dt><dd>${experiences.length}</dd></div><div><dt>Categorías</dt><dd>${Object.keys(styles).length}</dd></div></dl></div>
        <figure class="guide-hero-photo"><img id="guide-cover" src="${initial.image}" alt="${escape(initial.alt)}" width="720" height="650" fetchpriority="high"><figcaption><strong id="guide-cover-name">${escape(initial.name)}</strong><span id="guide-cover-country">${escape(initial.country)}</span></figcaption></figure>
      </section>
      ${tabs()}
      <nav class="guide-page-nav" aria-label="En esta página"><a href="#guide-search">Buscar recorridos</a><a href="#guide-summary-title">Mi selección</a><a href="#guide-faq-title">Preguntas frecuentes</a></nav>
      <section id="guide-search" class="guide-search" aria-labelledby="guide-search-title"><div class="guide-heading"><div><h2 id="guide-search-title">Destino y preferencias</h2></div><a class="text-link" href="viajes.html?pantalla=destinos">Ver todos los destinos ↗</a></div>
      <form id="guide-form" class="guide-form">${select('destination','Tu destino',catalog.map(d=>[d.id,escape(d.name)]))}${input('date','Fecha del paseo','date',today(),`min="${today()}"`)}${input('people','Personas','number',2,'min="1" max="12" step="1"')}${select('language','Idioma del guía',[['es','Español'],['en','Inglés']])}${select('time','Horario preferido',[['09:00','Mañana · 09:00'],['14:00','Tarde · 14:00']])}<div class="guide-form-note"><span>Los resultados se actualizan al cambiar tus preferencias.</span><button type="reset" class="guide-text-button">Restablecer</button></div></form></section>
      <div class="guide-layout"><section aria-labelledby="guide-results-title"><div class="guide-heading guide-results-heading"><div><p class="eyebrow" id="guide-region"></p><h2 id="guide-results-title"></h2><p id="guide-count" role="status" aria-live="polite"></p></div><div class="service-field"><label for="guide-sort">Ordenar por</label><select id="guide-sort"><option value="recommended">Orden sugerido</option><option value="price">Menor precio</option><option value="duration">Menor duración</option></select></div></div>
      <div class="guide-filters" role="group" aria-label="Tipo de experiencia">${[['all','Todas'],...Object.entries(styles)].map(([id,label])=>`<button type="button" data-guide-filter="${id}" aria-pressed="${id==='all'}">${label}</button>`).join('')}</div><p class="guide-category-note" id="guide-category-note"></p><div id="guide-results" class="guide-results"></div></section>
      <aside class="guide-summary" aria-labelledby="guide-summary-title"><h2 id="guide-summary-title" tabindex="-1">Tu selección</h2><div id="guide-selection"><div class="guide-summary-empty"><h3>Ningún recorrido seleccionado</h3><p>Elige una experiencia para ver aquí los detalles y el total de tu grupo.</p></div></div><button type="button" id="guide-save" class="button button-primary" disabled>Guardar en Mi viaje <span aria-hidden="true">↗</span></button><p id="guide-status" role="status" aria-live="polite"></p><a href="servicios.html?seccion=mi-viaje" class="guide-trip-link">Ver Mi viaje</a><p class="guide-demo">Experiencias y precios de demostración. Guardar una idea no confirma una reserva ni realiza un cobro.</p></aside></div>
      <section class="guide-destination" aria-labelledby="guide-destination-title"><div><p class="eyebrow">ANTES DE SALIR</p><h2 id="guide-destination-title"></h2><p id="guide-tip"></p><a id="guide-destination-link" class="text-link">Conocer el destino ↗</a></div><div><h3>Lleva lo esencial</h3><ul><li>Calzado cómodo y agua para el recorrido.</li><li>Protección para el sol o la lluvia.</li><li>Confirma el punto de encuentro y las necesidades de tu grupo.</li></ul></div></section>
      <section class="guide-faq" aria-labelledby="guide-faq-title"><div><h2 id="guide-faq-title">Preguntas frecuentes</h2><a href="servicios.html?seccion=ayuda" class="text-link">Ir al centro de ayuda ↗</a></div><div>${[
        ['¿Qué incluye el precio?','El importe orientativo contempla el acompañamiento de un guía para la duración indicada. Entradas, comidas, bebidas y traslados se organizan por separado. El total se calcula por persona.'],
        ['¿Quién será mi guía y dónde nos encontramos?','El perfil del guía, su disponibilidad, el idioma y el punto exacto de encuentro están por confirmar. Aquí puedes guardar tus preferencias para planear el recorrido.'],
        ['¿Puedo ir con niños o personas con movilidad reducida?','Incluye a todas las personas en el grupo. La accesibilidad, las edades admitidas y cualquier adaptación deben confirmarse antes de reservar con el proveedor.'],
        ['¿Puedo cambiar o cancelar mi elección?','Puedes volver a esta página y guardar una nueva experiencia para reemplazar la anterior, o quitarla desde Mi viaje. Las condiciones de una reserva real dependerán del proveedor.']
      ].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>`;
    const form = $('#guide-form');
    $('#destination').value = initial.id;
    for (const name of ['date','people','language','time']) {
      const value = saved?.values?.[name] ?? ({date:trip?.checkIn || trip?.date, people:trip?.travelers})[name];
      if (value == null) continue;
      const field = form.elements[name], original = field.value;
      field.value = String(value);
      if (!field.value || !field.checkValidity()) field.value = original;
    }
    let activeFilter = 'all', selected = null, options = [];
    const formattedDate = value => new Intl.DateTimeFormat('es-HN',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00'));
    const destination = () => catalog.find(d => d.id === $('#destination').value) || initial;

    function showSelection() {
      $('#guide-save').disabled = !selected || !form.checkValidity();
      $('#guide-save').textContent = 'Guardar en Mi viaje ↗';
      $('#guide-status').textContent = '';
      if (!selected) { $('#guide-selection').innerHTML='<div class="guide-summary-empty"><h3>Ningún recorrido seleccionado</h3><p>Elige una experiencia para ver aquí los detalles y el total de tu grupo.</p></div>'; return; }
      const d = destination(), people = Number($('#people').value);
      $('#guide-selection').innerHTML = `<p class="guide-summary-location">${escape(d.name)} · ${escape(d.country)}</p><h3>${escape(selected.title)}</h3><dl><div><dt>Fecha</dt><dd>${formattedDate($('#date').value)}</dd></div><div><dt>Horario preferido</dt><dd>${$('#time').value}</dd></div><div><dt>Grupo</dt><dd>${people} ${people===1?'persona':'personas'}</dd></div><div><dt>Duración estimada</dt><dd>${selected.hours} horas</dd></div><div><dt>Idioma solicitado</dt><dd>${$('#language').value==='es'?'Español':'Inglés'}</dd></div></dl><div class="guide-price-breakdown"><span>${money(selected.price)} × ${people} ${people===1?'persona':'personas'}</span><strong>${money(selected.price*people)}</strong><small>Total orientativo del grupo</small></div>`;
    }
    function render() {
      const d = destination();
      $('#date').min = today();
      const valid = form.checkValidity();
      $('#guide-cover').src = d.id==='roatan'?'imagenes-viajes/guia-roatan-portada.jpg':d.image; $('#guide-cover').alt = d.id==='roatan'?'Vista aérea de Roatán, Honduras':d.alt;
      $('#guide-cover-name').textContent = d.name; $('#guide-cover-country').textContent = d.country;
      $('#guide-region').textContent = `${d.country} · GUÍAS LOCALES`;
      $('#guide-results-title').textContent = `Recorridos en ${d.name}`;
      $('#guide-destination-title').textContent = `Información para visitar ${d.name}`;
      $('#guide-tip').textContent = d.tip;
      $('#guide-destination-link').href = `viajes.html?pantalla=detalle-destino&destino=${encodeURIComponent(d.id)}`;
      const cityOptions = experiences.filter(o=>o.destination===d.id).map(o=>{
        const rateKey=o.style==='naturaleza'?'paisaje':o.style==='gastronomia'?'sabores':'paseo';
        const rate=window.RumboDatabase?.catalog?.serviceRates?.guides?.[rateKey];
        return {...o,price:Number.isFinite(rate)&&rate>0?rate:o.price};
      });
      root.querySelectorAll('[data-guide-filter]').forEach(b=>{
        const type=b.dataset.guideFilter;
        const count=cityOptions.filter(o=>type==='all'||o.style===type).length;
        b.textContent=(type==='all'?'Todas':styles[type])+' · '+count;
        b.setAttribute('aria-pressed',String(type===activeFilter));
      });
      options = cityOptions.filter(o=>activeFilter==='all'||o.style===activeFilter);
      $('#guide-category-note').textContent = activeFilter==='all' ? 'El precio incluye acompañamiento. Entradas, consumiciones y transporte se pagan aparte.' : styles[activeFilter]+' en '+d.name+' · Duración y tarifa orientativas.';
      if ($('#guide-sort').value==='price') options.sort((a,b)=>a.price-b.price);
      if ($('#guide-sort').value==='duration') options.sort((a,b)=>a.hours-b.hours);
      if (!valid || !options.some(o=>o.id===selected?.id)) selected=null;
      $('#guide-count').textContent = valid ? `${options.length} ${options.length===1?'experiencia':'experiencias'} · Precios por persona` : 'Revisa la fecha y el número de personas para continuar.';
      $('#guide-results').innerHTML = options.length ? options.map(o=>`<article class="guide-card" data-selected="${selected?.id===o.id}"><div class="guide-card-image"><img src="${o.image}" alt="${escape(o.alt)}" loading="lazy" width="960" height="640" style="object-position:${o.position||'50% 50%'}"><span>${styles[o.style]}</span></div><div class="guide-card-content"><p class="guide-card-meta">${escape(d.name)} <span aria-hidden="true">·</span> ${o.hours} horas estimadas</p><h3>${escape(o.title)}</h3><p>${escape(o.description)}</p><details><summary>Ver detalles del paseo</summary><div class="guide-route-details"><h4>Paradas propuestas</h4><ol class="guide-route">${o.stops.map(stop=>`<li>${escape(stop)}</li>`).join('')}</ol><p><strong>Incluye:</strong> acompañamiento durante ${o.hours} horas estimadas.</p><p><strong>Por separado:</strong> entradas, comidas y traslados.</p><p>Punto de encuentro, accesibilidad, guía e idioma sujetos a confirmación.</p><a class="guide-photo-credit" href="${escape(o.photoPage)}" target="_blank" rel="noopener noreferrer">Fuente de la fotografía ↗</a></div></details><div class="guide-card-bottom"><div><small>Precio orientativo</small><strong>${money(o.price)} <span>/ persona</span></strong></div><button class="button button-outline" data-guide-choose="${o.id}" aria-label="Elegir: ${escape(o.title)}" aria-pressed="${selected?.id===o.id}" ${valid?'':'disabled'}>${selected?.id===o.id?'Seleccionada ✓':'Elegir experiencia'}</button></div></div></article>`).join('') : '<div class="service-empty"><h3>No hay recorridos en esta categoría.</h3><p>No hay propuestas de este tipo aquí. Explora las demás experiencias o elige otro destino.</p><button id="guide-clear" class="button button-outline">Ver todas las experiencias</button></div>';
      $('#guide-clear')?.addEventListener('click',()=>setFilter('all'));
      showSelection();
    }
    function setFilter(value) {
      activeFilter=value;
      root.querySelectorAll('[data-guide-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.guideFilter===value)));
      render();
    }
    form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity())render();});
    let previousDestination=initial.id;
    function updatePreferences(){
      if(previousDestination!==$('#destination').value){previousDestination=$('#destination').value;activeFilter='all';selected=null;}
      render();
    }
    form.addEventListener('input',updatePreferences);
    form.addEventListener('change',updatePreferences);
    form.addEventListener('reset',()=>{setTimeout(()=>{$('#destination').value=initial.id;$('#date').value=today();selected=null;$('#guide-sort').value='recommended';setFilter('all');},0);});
    $('#guide-sort').addEventListener('change',render);
    root.querySelectorAll('[data-guide-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.guideFilter)));
    $('#guide-results').addEventListener('click',e=>{
      const button=e.target.closest('[data-guide-choose]'); if(!button || button.disabled || !form.reportValidity())return;
      selected=options.find(o=>o.id===button.dataset.guideChoose);
      root.querySelectorAll('[data-guide-choose]').forEach(b=>{const active=b===button;b.setAttribute('aria-pressed',String(active));b.textContent=active?'Seleccionada ✓':'Elegir experiencia';b.closest('article').dataset.selected=String(active);});
      showSelection(); $('#guide-status').innerHTML='Selección actualizada. <a href="#guide-summary-title">Revisar el resumen</a>';
      const link=document.createElement('a');link.className='guide-review-link';link.href='#guide-summary-title';link.textContent='Revisar y guardar ↓';
      root.querySelectorAll('.guide-review-link').forEach(a=>a.remove());button.after(link);
    });
    $('#guide-save').addEventListener('click',()=>{
      if(!selected || !form.reportValidity())return;
      const d=destination(), values=Object.fromEntries(new FormData(form));
      const detail=`${d.name} · ${values.date} · ${values.time} · ${values.people} ${Number(values.people)===1?'persona':'personas'} · ${values.language==='es'?'Español':'Inglés'} · ${selected.hours} horas`;
      const next=records().filter(r=>r.section!=='guias');
      next.push({section:'guias',optionId:selected.id,title:`${selected.title} · ${d.name}`,detail,total:selected.price*Number(values.people),values,destinationId:d.id,savedAt:new Date().toISOString()});
      if(write(KEY,next)) { $('#guide-save').disabled=true;$('#guide-save').textContent='Guardada ✓';$('#guide-status').textContent='Tu experiencia está guardada. Puedes consultarla en Mi viaje o reemplazarla por otra.'; }
      else { $('#guide-status').textContent='No se pudo guardar. Puedes descargar tu elección.';const b=document.createElement('button');b.className='guide-text-button';b.textContent='Descargar resumen';b.onclick=()=>download(`${selected.title}\n${detail}\n${money(selected.price*Number(values.people))}`);$('#guide-status').append(b); }
    });
    render();
    if(saved?.values?.destination===initial.id) {
      selected=options.find(o=>o.id===saved.optionId) || null;
      if(selected)render();
      else $('#guide-status').textContent='El recorrido guardado ya no está en este catálogo. Elige uno de los recorridos actuales para reemplazarlo.';
    }
  }

  function hub(){
    root.innerHTML=hero('Servicios de viaje','Consulta vuelos, hoteles, traslados, seguros y guías. Las selecciones se reúnen en Mi viaje.','ORGANIZA TU VIAJE')+`<div class="service-grid" id="opciones-servicios">${[
      ['✈','Vuelos','Compara horarios, clases y precios para llegar a tu destino.','viajes.html?pantalla=vuelos','Buscar vuelos'],['⌂','Hoteles','Elige dónde descansar y calcula tu estancia completa.','viajes.html?pantalla=hoteles','Buscar hoteles'],['↔','Traslados','Conecta el aeropuerto y tu hospedaje con espacio para todos.','servicios.html?seccion=traslados','Organizar traslado'],['◇','Seguro de viaje','Explora planes y compara sus diferencias.','servicios.html?seccion=seguros','Comparar planes'],['◎','Guías locales','Consulta recorridos, paradas, duración y precios por persona.','servicios.html?seccion=guias','Explorar recorridos'],['▣','Tienda de viaje','Compara equipaje y accesorios, y prepara una lista de productos.','tienda.html','Explorar tienda']
    ].map(([icon,title,desc,url,label])=>`<article class="service-tile" ${url==='tienda.html'?'id="tienda"':''}><img class="service-tile-photo" src="${servicePhotos[url.includes("traslados")?"traslados":url.includes("seguros")?"seguros":url.includes("guias")?"guias":url.includes("hoteles")?"hoteles":url.includes("tienda")?"tienda":"vuelos"][0]}" alt="${title}" loading="lazy" width="560" height="320"><h2>${title}</h2><p>${desc}</p><a class="text-link" href="${url}">${label} ↗</a></article>`).join('')}</div><div class="service-footer-links"><a class="button button-outline" href="viajes.html?pantalla=destinos">Todavía estoy buscando un destino</a><a class="button button-primary" href="servicios.html?seccion=mi-viaje">Ver mis elecciones ↗</a></div>`;
  }

  function savedPage(){ window.RumboJourney.renderSummary(root); }

  const help = {
    ayuda:['Centro de ayuda','Encuentra respuestas para moverte por Rumbo.',[
      ['¿Por dónde empiezo?','Explora Destinos, abre un lugar y elige si quieres buscar un vuelo o un hotel. En Servicios puedes añadir los demás detalles.'],['¿Dónde encuentro mis elecciones?','En Mi viaje encontrarás vuelos, hospedaje, servicios y productos juntos, con un único total y un resumen descargable.'],['¿Se guardan mis datos?','Tus elecciones se guardan localmente y se envían al servidor cuando hay conexión. El indicador inferior confirma el guardado. Todavía no hay sincronización entre dispositivos; borrar las cookies desconecta este navegador de lo guardado.'],['¿Cómo cambio una selección?','Abre el servicio, ajusta los datos y guarda otra opción. La nueva elección reemplaza la anterior de ese servicio. También puedes quitarla desde Mi viaje.']]],
    cambios:['Cambiar o eliminar selecciones','Vuelve a elegir cuando lo necesites.',[['Cambiar vuelos y hoteles','Abre el resumen del viaje y ajusta destino, fechas o viajeros. Las elecciones incompatibles se descartan y podrás comparar de nuevo.'],['Quitar servicios y productos','En Mi viaje puedes eliminar vuelos, hospedaje, servicios y productos, o vaciar el viaje completo. También puedes deshacer la última eliminación. Para cambiar cantidades, abre el carrito de la tienda.']]],
    acerca:['Acerca de Rumbo','Rumbo está pensado para reunir la inspiración y la organización de un viaje en un mismo lugar.',[['Nuestra intención','Ayudarte a descubrir un destino, entender cada elección y preparar el viaje sin saltar entre pantallas confusas.'],['Nuestro compañero','Rumbito es tu copiloto de viaje: una mascota de ubicación que te acompaña a descubrir nuevos destinos. Te ayuda a empezar por lo que importa para ti.'],['Tu viaje organizado','Explora destinos, compara opciones y reúne tus elecciones en Mi viaje.']]],
    equipo:['Equipo de Rumbo','Un proyecto construido por estudiantes para aprender creando.',[['El equipo de Rumbo','Allan Ramos, Omar Tabora, Dianny Moreira, Dilan Banegas y Yeison Carbajal. Los canales de contacto del equipo están disponibles en la página principal.'],['Lo que estamos construyendo','Una experiencia de viaje que conecte destinos, servicios y accesorios con una navegación sencilla y una identidad propia.']]],
    privacidad:['Privacidad y datos','Información sobre tus datos en Rumbo.',[['Qué se guarda aquí','Rumbo conserva en el navegador y, cuando hay conexión, en su servidor tus preferencias del viaje, servicios elegidos, carrito, favoritos, preparativos, resumen y alias. Una cookie de visitante vincula esos datos con este navegador. Al crear una cuenta se guardan tu nombre, correo y un hash protegido de la contraseña.'],['Cómo borrar lo guardado','Puedes quitar servicios desde Mi viaje, vaciar productos desde el carrito y eliminar el perfil con su botón. Esas acciones se sincronizan cuando hay conexión. Borrar las cookies desconecta este navegador de lo guardado, pero no borra por sí solo los datos del servidor.'],['Recursos externos','Algunas fotografías y las tipografías se cargan desde servicios externos. El navegador se conecta a esos proveedores para mostrarlos.'],['Conversaciones con Rumbito','Los mensajes y el historial reciente del chat se envían a nuestro proveedor de IA para generar respuestas. La aplicación no guarda conversaciones en disco; los proveedores pueden aplicar sus propias políticas de tratamiento de datos. No compartas datos sensibles en el chat.'],['Tu sesión','La sesión usa una cookie de hasta 30 días. Cerrar sesión revoca el acceso de este navegador; borrar cookies no elimina tu cuenta. Los datos de viaje de cada cuenta se mantienen separados.']]],
    terminos:['Condiciones de uso','Condiciones de uso de Rumbo.',[['Organizar tu viaje','Reúne destinos, fechas, servicios y productos en un solo plan.'],['Tu resumen','Guarda tus selecciones y descarga el resumen desde Mi viaje.'],['Imágenes y contenidos','Las fotografías de referencia tienen sus créditos en el catálogo de destinos y la tienda. No implican relación comercial con marcas o proveedores.']]]
  };
  function helpPage(id){const [title,intro,items]=help[id];root.innerHTML=crumb('Información')+hero(title,intro,'CONOCE RUMBO','?','UN POCO DE AYUDA')+`<section class="help-card">${items.map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}</summary><p>${a}</p></details>`).join('')}<div class="service-footer-links"><a class="button button-primary" href="index.html#contacto">Contactar al equipo ↗</a><a class="button button-outline" href="servicios.html">Explorar servicios</a></div></section>`;}
  function account(){
    const profile=read('rumbo.profile.v1',{});
    root.innerHTML=crumb('Mi perfil')+hero('Perfil de viaje','Crea tu perfil de viaje con un alias y tu estilo de viaje. Se vincula a tu cuenta cuando has iniciado sesión; revisa el indicador de guardado para comprobar la conexión.','TU ESPACIO EN RUMBO','◎','A TU MANERA')+`<section class="help-card service-profile"><h2>Mi perfil</h2><p>Elige tu alias y tu estilo de viaje.</p><form id="profile-form" class="service-form">${input('alias','¿Cómo quieres que te llamemos?','text',escape(typeof profile?.alias==='string'?profile.alias:''),'maxlength="40" autocomplete="off" placeholder="Tu alias"')}${select('preference','Tu estilo de viaje',[['playa','Playa y descanso'],['naturaleza','Naturaleza'],['cultura','Cultura e historia']])}<div class="service-form-foot"><button class="button button-primary">Guardar perfil</button><button type="button" class="button button-outline" id="delete-profile">Eliminar perfil</button></div></form><p id="service-status" class="service-status" role="status"></p><a class="text-link" href="servicios.html?seccion=mi-viaje">Ir a mi viaje ↗</a></section>`;
    if(['playa','naturaleza','cultura'].includes(profile?.preference))$('#preference').value=profile.preference;
    $('#profile-form').addEventListener('submit',e=>{e.preventDefault();const alias=$('#alias').value.trim();if(!alias){$('#alias').setCustomValidity('Escribe un alias.');$('#alias').reportValidity();return;}status(write('rumbo.profile.v1',{alias,preference:$('#preference').value})?`Listo, ${alias}. Tu perfil se guardó localmente; el indicador de guardado confirma su envío al servidor.`:'No se pudo guardar el perfil. Revisa los permisos del navegador.');});
    $('#alias').addEventListener('input',()=>$('#alias').setCustomValidity(''));
    $('#delete-profile').addEventListener('click',()=>{try{(window.RumboStorage || localStorage).removeItem('rumbo.profile.v1');$('#profile-form').reset();$('#alias').value='';status('Perfil eliminado. Tus elecciones de viaje se conservan.');}catch{status('No se pudo eliminar el perfil.');}});
  }
  if(section==='guias') guidesPage();
  else if(Object.hasOwn(configs,section)) servicePage();
  else if(section==='mi-viaje')savedPage();
  else if(section==='perfil')account();
  else if(section==='iniciar-sesion'||section==='registro')location.replace(section+'.html');
  else if(section==='equipo')location.replace('index.html#nuestro-equipo');
  else if(section==='legal'){document.title='Información legal | Rumbo';root.innerHTML=crumb('Información legal')+hero('Información legal.','Fuentes y licencias de los recursos visuales de Rumbo.','RUMBO')+document.querySelector('#legal-content').innerHTML;}
  else if(Object.hasOwn(help,section))helpPage(section);
  else if(section==='servicios')hub();
  else {document.title='Página no encontrada | Rumbo';root.innerHTML=hero('Ese camino aún no existe.','Vuelve a nuestros servicios y elige por dónde continuar.','RUMBO')+'<a class="button button-primary" href="servicios.html">Ver servicios ↗</a>';}
  window.addEventListener('pageshow',event=>{if(event.persisted && section==='mi-viaje')savedPage();});
  window.addEventListener('storage',event=>{if(section==='mi-viaje' && [KEY,'rumbo.integrante2.viaje.v1','rumbo.store.cart.v2','rumbo.checkout.v1',null].includes(event.key))savedPage();});
})();
