// Catálogo de referencia. Créditos de cada fotografía al pie de la tienda.
const PRODUCTS = [
  {
    "id": 1,
    "name": "Mochila de viaje",
    "category": "Equipaje",
    "price": 450,
    "image": "imagenes/mochila.jpg",
    "description": "Mochila práctica para llevar tus cosas durante el viaje."
  },
  {
    "id": 2,
    "name": "Maleta de viaje",
    "category": "Equipaje",
    "price": 650,
    "image": "imagenes/maleta.jpg",
    "description": "Maleta para organizar y transportar tu equipaje."
  },
  {
    "id": 3,
    "name": "Bolso de mano",
    "category": "Equipaje",
    "price": 250,
    "image": "imagenes/bolso-mano.jpg",
    "description": "Bolso cómodo para llevar objetos personales."
  },
  {
    "id": 4,
    "name": "Riñonera",
    "category": "Equipaje",
    "price": 120,
    "image": "imagenes/rinonera.jpg",
    "description": "Riñonera compacta para llevar objetos pequeños."
  },
  {
    "id": 5,
    "name": "Etiqueta para maleta",
    "category": "Equipaje",
    "price": 50,
    "image": "imagenes/etiqueta-maleta.jpg",
    "description": "Etiqueta para identificar fácilmente tu equipaje."
  },
  {
    "id": 6,
    "name": "Candado para maleta",
    "category": "Equipaje",
    "price": 80,
    "image": "imagenes/candado-maleta.jpg",
    "description": "Candado compacto para asegurar tu equipaje."
  },
  {
    "id": 7,
    "name": "Power Bank",
    "category": "Tecnología",
    "price": 350,
    "image": "imagenes/power-bank.jpg",
    "description": "Batería portátil para mantener cargado tu celular."
  },
  {
    "id": 8,
    "name": "Cargador de celular",
    "category": "Tecnología",
    "price": 150,
    "image": "imagenes/cargador.jpg",
    "description": "Cargador práctico para usar durante tus viajes."
  },
  {
    "id": 9,
    "name": "Cable USB",
    "category": "Tecnología",
    "price": 70,
    "image": "imagenes/cable-usb.jpg",
    "description": "Cable USB para cargar y conectar dispositivos."
  },
  {
    "id": 10,
    "name": "Adaptador universal",
    "category": "Tecnología",
    "price": 220,
    "image": "imagenes/adaptador.jpg",
    "description": "Adaptador para conectar dispositivos en diferentes lugares."
  },
  {
    "id": 11,
    "name": "Audífonos",
    "category": "Tecnología",
    "price": 180,
    "image": "imagenes/audifonos.jpg",
    "description": "Audífonos para escuchar música durante el viaje."
  },
  {
    "id": 12,
    "name": "Soporte para celular",
    "category": "Tecnología",
    "price": 100,
    "image": "imagenes/soporte-celular.jpg",
    "description": "Soporte pequeño y práctico para tu celular."
  },
  {
    "id": 13,
    "name": "Almohada de viaje",
    "category": "Confort",
    "price": 180,
    "image": "imagenes/almohada-viaje.jpg",
    "description": "Almohada cómoda para descansar durante el viaje."
  },
  {
    "id": 14,
    "name": "Botella reutilizable",
    "category": "Confort",
    "price": 120,
    "image": "imagenes/botella.jpg",
    "description": "Botella reutilizable para llevar agua."
  },
  {
    "id": 15,
    "name": "Antifaz para dormir",
    "category": "Confort",
    "price": 60,
    "image": "imagenes/antifaz.jpg",
    "description": "Antifaz para descansar con mayor comodidad."
  },
  {
    "id": 16,
    "name": "Tapones para oídos",
    "category": "Confort",
    "price": 45,
    "image": "imagenes/tapones-oidos.jpg",
    "description": "Tapones pequeños para descansar durante el viaje."
  },
  {
    "id": 17,
    "name": "Paraguas compacto",
    "category": "Confort",
    "price": 150,
    "image": "imagenes/paraguas.jpg",
    "description": "Paraguas compacto para llevar fácilmente."
  },
  {
    "id": 18,
    "name": "Toalla de viaje",
    "category": "Confort",
    "price": 130,
    "image": "imagenes/toalla-viaje.jpg",
    "description": "Toalla práctica y fácil de transportar."
  },
  {
    "id": 19,
    "name": "Porta pasaporte",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/porta-pasaporte.jpg",
    "description": "Funda para mantener protegido tu pasaporte."
  },
  {
    "id": 20,
    "name": "Porta documentos",
    "category": "Seguridad",
    "price": 120,
    "image": "imagenes/porta-documentos.jpg",
    "description": "Organizador para documentos importantes."
  },
  {
    "id": 21,
    "name": "Billetera de viaje",
    "category": "Seguridad",
    "price": 110,
    "image": "imagenes/billetera.jpg",
    "description": "Billetera práctica para guardar dinero y tarjetas."
  },
  {
    "id": 22,
    "name": "Bolsa impermeable",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/bolsa-impermeable.jpg",
    "description": "Bolsa para proteger objetos de la humedad."
  },
  {
    "id": 23,
    "name": "Correa para maleta",
    "category": "Seguridad",
    "price": 90,
    "image": "imagenes/correa-maleta.jpg",
    "description": "Correa para sujetar y reconocer tu maleta."
  },
  {
    "id": 24,
    "name": "Linterna",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/linterna.jpg",
    "description": "Linterna pequeña para llevar durante el viaje."
  },
  {
    "id": 25,
    "name": "Neceser de viaje",
    "category": "Cuidado",
    "price": 130,
    "image": "imagenes/neceser.jpg",
    "description": "Neceser para organizar artículos personales."
  },
  {
    "id": 26,
    "name": "Botellas para líquidos",
    "category": "Cuidado",
    "price": 80,
    "image": "imagenes/botellas-liquidos.jpg",
    "description": "Botellas pequeñas para llevar líquidos."
  },
  {
    "id": 27,
    "name": "Cepillo de dientes de viaje",
    "category": "Cuidado",
    "price": 55,
    "image": "imagenes/cepillo-dientes.jpg",
    "description": "Cepillo compacto para llevar en el equipaje."
  },
  {
    "id": 28,
    "name": "Kit de higiene",
    "category": "Cuidado",
    "price": 150,
    "image": "imagenes/kit-higiene.jpg",
    "description": "Kit práctico para artículos de higiene personal."
  },
  {
    "id": 29,
    "name": "Protector solar",
    "category": "Cuidado",
    "price": 180,
    "image": "imagenes/protector-solar.jpg",
    "description": "Protector solar para incluir en tu equipaje."
  },
  {
    "id": 30,
    "name": "Botiquín básico",
    "category": "Cuidado",
    "price": 200,
    "image": "imagenes/botiquin.jpg",
    "description": "Botiquín básico para llevar artículos de primeros auxilios."
  }
];
const PHOTO_CREDITS = [
  {
    "id": 1,
    "title": "Blue backpack",
    "page": "https://unsplash.com/photos/_H0fjILH5Vw",
    "author": "Sun Lingyan",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    "id": 2,
    "title": "Olive carry-on suitcase",
    "page": "https://unsplash.com/photos/zQsEp5sRSKY",
    "author": "American Green Travel",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "url": "https://images.unsplash.com/photo-1670888616478-771051efa21d?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    "id": 3,
    "title": "Leather duffel bag on the ground.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Leather_duffel_bag_on_the_ground.jpg",
    "author": "Harsh Jadav",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  {
    "id": 4,
    "title": "Sling bag",
    "page": "https://unsplash.com/photos/0SRsZS6hXYA",
    "author": "Romain B",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "url": "https://images.unsplash.com/photo-1727719589286-3e22d4d3fbed?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    "id": 5,
    "title": "UnixWare luggage tag.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:UnixWare_luggage_tag.jpg",
    "author": "Jonathan Schilling",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "id": 6,
    "title": "File:Combination-lock-254923 1920.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Combination-lock-254923_1920.jpg",
    "author": "Huskyherz",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Combination-lock-254923_1920.jpg/960px-Combination-lock-254923_1920.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  {
    "id": 7,
    "title": "Powerbank and cable",
    "author": "MOISES RIBEIRO",
    "page": "https://www.pexels.com/photo/11031423/",
    "url": "https://images.pexels.com/photos/11031423/pexels-photo-11031423.png?fm=jpg&w=1000",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/"
  },
  {
    "id": 8,
    "title": "USB charger",
    "page": "https://unsplash.com/photos/cQTlLkl2Fnw",
    "author": "Mika Baumeister",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "url": "https://images.unsplash.com/photo-1596877445530-ad74838754c6?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    "id": 9,
    "title": "White charging cable",
    "page": "https://www.pexels.com/photo/914912/",
    "author": "Matthias Zomer",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "url": "https://images.pexels.com/photos/914912/pexels-photo-914912.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    "id": 10,
    "title": "Travel adapter",
    "page": "https://unsplash.com/photos/OaNfWxDJ4AI",
    "author": "Gavin Phillips",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "url": "https://images.unsplash.com/photo-1763161786687-43d0c9babdf0?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    "id": 11,
    "title": "Earfun wireless black headphones, September 2024 20.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Earfun_wireless_black_headphones,_September_2024_20.jpg",
    "author": "Chenspec",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "id": 12,
    "title": "Phone stand",
    "page": "https://www.pexels.com/photo/15979597/",
    "author": "COPPERTIST WU",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "url": "https://images.pexels.com/photos/15979597/pexels-photo-15979597.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    "id": 13,
    "title": "Inflatable travel pillow",
    "author": "Mykhailo Petrushchak",
    "page": "https://www.pexels.com/photo/31443013/",
    "url": "https://images.pexels.com/photos/31443013/pexels-photo-31443013.jpeg?fm=jpg&w=1000",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/"
  },
  {
    "id": 14,
    "title": "Reusable collapsible bottle",
    "author": "cottonbro studio",
    "page": "https://www.pexels.com/photo/3738061/",
    "url": "https://images.pexels.com/photos/3738061/pexels-photo-3738061.jpeg?fm=jpg&w=1000",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/"
  },
  {
    "id": 15,
    "title": "Silk sleep mask",
    "author": "MANITO SILK",
    "page": "https://unsplash.com/photos/yJtAmnvc1bs",
    "url": "https://images.unsplash.com/photo-1742794565428-1a74fa73f1c9?fm=jpg&fit=max&w=1000&q=85",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license/"
  },
  {
    "id": 16,
    "title": "3M EARPLUGS YELLOW.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:3M_EARPLUGS_YELLOW.jpg",
    "author": "Dinkun Chen",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "id": 17,
    "title": "Folding umbrella 01.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Folding_umbrella_01.jpg",
    "author": "Kritzolina",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "id": 18,
    "title": "Rolled white towels",
    "page": "https://www.pexels.com/photo/17428224/",
    "author": "Dmitriy Steinke",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "url": "https://images.pexels.com/photos/17428224/pexels-photo-17428224.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    "id": 19,
    "title": "Passport holder",
    "page": "https://unsplash.com/photos/KbtMWr6ysrw",
    "author": "WanderLabs",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license",
    "url": "https://images.unsplash.com/photo-1549937917-03ccda498729?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    "id": 20,
    "title": "Breast wallet.JPG",
    "page": "https://commons.wikimedia.org/wiki/File:Breast_wallet.JPG",
    "author": "KVDP",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Breast_wallet.JPG"
  },
  {
    "id": 21,
    "title": "Flap Boy Slim Wallet from JAIMIE JACOBS 01.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Flap_Boy_Slim_Wallet_from_JAIMIE_JACOBS_01.jpg",
    "author": "www.kartenetui.info",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  {
    "id": 22,
    "title": "Ortlieb Atrack, OutDoor 2018, Friedrichshafen (1X7A9931) (cropped).jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Ortlieb_Atrack,_OutDoor_2018,_Friedrichshafen_(1X7A9931)_(cropped).jpg",
    "author": "Matti Blume",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "id": 23,
    "title": "Luggage buckle straps 2017 A.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Luggage_buckle_straps_2017_A.jpg",
    "author": "Fructibus",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  {
    "id": 24,
    "title": "Fenix P1D LED flashlight (2739718566).jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Fenix_P1D_LED_flashlight_(2739718566).jpg",
    "author": "Darron Birgenheier from Reno, NV, USA",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  {
    "id": 25,
    "title": "Travel toiletries bag",
    "page": "https://www.pexels.com/photo/9185875/",
    "author": "Timur Weber",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "url": "https://images.pexels.com/photos/9185875/pexels-photo-9185875.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    "id": 26,
    "title": "30ml PET mist spray bottle.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:30ml_PET_mist_spray_bottle.jpg",
    "author": "Plasticbottlesupplier",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "id": 27,
    "title": "Bamboo toothbrush and case",
    "page": "https://www.pexels.com/photo/7814562/",
    "author": "Mikhail Nilov",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "url": "https://images.pexels.com/photos/7814562/pexels-photo-7814562.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    "id": 28,
    "title": "Hanging travel hygiene kit",
    "page": "https://www.pexels.com/photo/9185865/",
    "author": "Timur Weber",
    "license": "Pexels License",
    "licenseUrl": "https://www.pexels.com/license/",
    "url": "https://images.pexels.com/photos/9185865/pexels-photo-9185865.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    "id": 29,
    "title": "Sunscreen product photography",
    "author": "Tuan Nguyen",
    "page": "https://unsplash.com/photos/AuDD-ejVWLA",
    "url": "https://images.unsplash.com/photo-1738721798337-1c0036181229?fm=jpg&fit=max&w=1000&q=85",
    "license": "Unsplash License",
    "licenseUrl": "https://unsplash.com/license/"
  },
  {
    "id": 30,
    "title": "Kit pronto soccorso moto (aperto).JPG",
    "page": "https://commons.wikimedia.org/wiki/File:Kit_pronto_soccorso_moto_(aperto).JPG",
    "author": "Umberto NURS",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  }
];
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const money = value => 'L ' + new Intl.NumberFormat('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;
  const productsById = new Map(PRODUCTS.map(p => [p.id, p]));
  const CART_KEY = 'rumbo.store.cart.v2', FAVORITES_KEY = 'rumbo.store.favorites.v2';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const grid = $('#products-grid'), cartDialog = $('#cart-modal'), detailDialog = $('#product-modal');
  let cart = [], favorites = new Set(), category = 'Todos', favoritesOnly = false;
  let toastTimer, toastAction = null, toastTrigger = null, searchTimer;
  const buttonTimers = new WeakMap();

  function storageRead(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  }
  function storageWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { $('#storage-notice').hidden = false; }
  }
  function sanitizeCart(value) {
    if (!Array.isArray(value)) return [];
    const valid = new Map();
    value.slice(0, 100).forEach(item => {
      if (item && productsById.has(item.id) && Number.isInteger(item.quantity) && item.quantity > 0) {
        valid.set(item.id, { id: item.id, quantity: Math.min(99, item.quantity) });
      }
    });
    return [...valid.values()];
  }
  function loadState() {
    cart = sanitizeCart(storageRead(CART_KEY));
    const saved = storageRead(FAVORITES_KEY);
    favorites = new Set(Array.isArray(saved) ? saved.filter(id => productsById.has(id)) : []);
  }
  function saveCart() { storageWrite(CART_KEY, cart); }
  function total() { return cart.reduce((sum, item) => sum + productsById.get(item.id).price * item.quantity, 0); }

  function renderProducts() {
    const query = normalize($('#product-search').value);
    const sort = $('#product-sort').value;
    const list = PRODUCTS.filter(p => (category === 'Todos' || p.category === category) &&
      (!favoritesOnly || favorites.has(p.id)) && normalize(`${p.name} ${p.category} ${p.description}`).includes(query));
    if (sort === 'price-asc') list.sort((a,b) => a.price-b.price || a.id-b.id);
    if (sort === 'price-desc') list.sort((a,b) => b.price-a.price || a.id-b.id);
    if (sort === 'name') list.sort((a,b) => a.name.localeCompare(b.name, 'es'));
    grid.innerHTML = list.map((p, index) => `<article class="product-card" data-product="${p.id}" style="--delay:${Math.min(index, 7)*25}ms">
      <div class="product-image-container"><button class="image-detail-button" type="button" data-detail="${p.id}" aria-label="Ver detalle de ${escapeHTML(p.name)}"><img class="product-image" src="${p.image}?v=catalogo-limpio-3" alt="${escapeHTML(p.name)}, fotografía de referencia" width="600" height="600" loading="lazy" decoding="async"></button>
      <button class="icon-button favorite-button" type="button" data-favorite="${p.id}" aria-pressed="${favorites.has(p.id)}" aria-label="${favorites.has(p.id) ? 'Quitar de favoritos:' : 'Guardar como favorito:'} ${escapeHTML(p.name)}">${icon('heart')}</button></div>
      <div class="product-info"><p class="product-category">${escapeHTML(p.category)}</p><h3 class="product-title"><button type="button" data-detail="${p.id}">${escapeHTML(p.name)}</button></h3><p class="product-description">${escapeHTML(p.description)}</p><div class="product-bottom"><span class="product-price">${money(p.price)} <small>HNL</small></span><button class="add-btn" type="button" data-add="${p.id}" aria-label="Agregar ${escapeHTML(p.name)} al carrito"><span aria-hidden="true">+</span> Agregar</button></div></div></article>`).join('');
    $('#products-result').textContent = `${list.length} de ${PRODUCTS.length} productos${category !== 'Todos' ? ' · ' + category : ''}`;
    $('#empty-products').hidden = list.length > 0;
    $('#reset-filters').hidden = !query && category === 'Todos' && !favoritesOnly && sort === 'featured';
    $('#favorites-label').hidden = !favoritesOnly;
    document.querySelectorAll('.filter-btn').forEach(b => {
      const active = b.dataset.category === category;
      b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active));
    });
    updateFavoriteCount();
  }
  function updateFavoriteCount() {
    $('#favorites-count').textContent = favorites.size;
    $('#favorites-count').hidden = favorites.size === 0;
    $('#favorites-toggle').setAttribute('aria-pressed', String(favoritesOnly));
    $('#favorites-toggle').setAttribute('aria-label', favoritesOnly ? 'Mostrar todos los productos' : `Mostrar favoritos (${favorites.size})`);
  }
  function resetFilters() {
    clearTimeout(searchTimer); category = 'Todos'; favoritesOnly = false;
    $('#product-search').value = ''; $('#product-sort').value = 'featured'; renderProducts();
  }
  function hideToast(restore = false) {
    clearTimeout(toastTimer); const focused = $('#toast').contains(document.activeElement);
    $('#toast').hidden = true;
    if (restore && focused) (toastTrigger?.isConnected ? toastTrigger : $('#open-cart-btn')).focus();
  }
  function scheduleToastHide() {
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if ($('#toast').matches(':hover') || $('#toast').contains(document.activeElement)) scheduleToastHide();
      else hideToast();
    }, 6000);
  }
  function notify(message, actionLabel = 'Ver carrito', action = openCart) {
    toastTrigger = document.activeElement;
    $('#toast-message').textContent = message;
    $('#toast-action').textContent = actionLabel;
    $('#toast-action').hidden = !action;
    toastAction = action; $('#toast').hidden = false; scheduleToastHide();
  }
  function animateAdd(p, source, rect) {
    const button = source?.matches('[data-add]') ? source : null;
    if (button) {
      clearTimeout(buttonTimers.get(button)); button.classList.add('added'); button.textContent = '✓ Añadido';
      buttonTimers.set(button, setTimeout(() => {
        if (button.isConnected) { button.classList.remove('added'); button.innerHTML = '<span aria-hidden="true">+</span> Agregar'; }
      }, 1400));
    }
    if (reducedMotion.matches) return;
    $('#cart-count').animate([{transform:'scale(1)'},{transform:'scale(1.4)'},{transform:'scale(1)'}], {duration:420,easing:'ease-out'});
    const start = rect || source?.closest('.product-card')?.querySelector('img')?.getBoundingClientRect();
    if (!start || start.bottom < 0 || start.top > innerHeight) return;
    const end = $('#open-cart-btn').getBoundingClientRect();
    const img = document.createElement('img'); img.src = p.image + '?v=catalogo-limpio-3'; img.alt = ''; img.className = 'flying-product';
    const x = start.left + start.width/2 - 35, y = start.top + start.height/2 - 35;
    Object.assign(img.style, {left:x+'px',top:y+'px',width:'70px',height:'70px'}); document.body.appendChild(img);
    const animation = img.animate([{transform:'translate(0,0) scale(1)',opacity:.95},{transform:`translate(${end.left+end.width/2-x-35}px,${end.top+end.height/2-y-35}px) scale(.18)`,opacity:.15}], {duration:620,easing:'cubic-bezier(.4,0,.2,1)'});
    animation.finished.catch(() => {}).finally(() => img.remove());
  }
  function addToCart(id, source, rect) {
    const p = productsById.get(id); if (!p) return;
    const existing = cart.find(item => item.id === id);
    if (existing?.quantity >= 99) { notify('Puedes añadir hasta 99 unidades de cada producto.'); return; }
    if (existing) existing.quantity++; else cart.push({id,quantity:1});
    saveCart(); renderCart(); animateAdd(p, source, rect); notify(`${p.name} añadido a tu carrito.`);
  }
  function renderCart() {
    const active = document.activeElement;
    const focusedAction = $('#cart-items').contains(active) ? {id:active.dataset.id,action:active.dataset.action} : null;
    const count = cart.reduce((sum, item) => sum+item.quantity, 0);
    $('#cart-count').textContent = count;
    $('#open-cart-btn').setAttribute('aria-label', `Abrir carrito, ${count} ${count===1?'artículo':'artículos'}`);
    $('#cart-items-label').textContent = `(${count})`;
    $('#cart-subtotal').textContent = money(total()); $('#cart-total').textContent = money(total());
    $('#checkout-btn').disabled = !cart.length;
    $('#cart-items').innerHTML = cart.length ? cart.map(item => {
      const p = productsById.get(item.id);
      return `<article class="cart-item"><img class="cart-item-image" src="${p.image}?v=catalogo-limpio-3" alt="${escapeHTML(p.name)}" width="76" height="91"><div class="cart-item-main"><h3>${escapeHTML(p.name)}</h3><p class="unit-price">${money(p.price)} / unidad</p><div class="cart-item-bottom"><div class="quantity-controls"><button type="button" data-id="${p.id}" data-action="minus" aria-label="Reducir cantidad de ${escapeHTML(p.name)}" ${item.quantity===1?'disabled':''}>−</button><output aria-label="Cantidad de ${escapeHTML(p.name)}">${item.quantity}</output><button type="button" data-id="${p.id}" data-action="plus" aria-label="Aumentar cantidad de ${escapeHTML(p.name)}" ${item.quantity===99?'disabled':''}>+</button></div><span class="line-total">${money(p.price*item.quantity)}</span></div><button class="remove-btn" type="button" data-id="${p.id}" data-action="remove">Eliminar</button></div></article>`;
    }).join('') : `<div class="empty-cart">${icon('bag')}<h3>Tu próxima aventura<br>todavía tiene espacio.</h3><p>Agrega tus esenciales y los encontrarás aquí.</p></div>`;
    if (focusedAction && cartDialog.open) {
      const match = $(`#cart-items [data-id="${focusedAction.id}"][data-action="${focusedAction.action}"]:not(:disabled)`);
      (match || $(`#cart-items [data-id="${focusedAction.id}"][data-action="remove"]`) || $('#cart-items button:not(:disabled)') || $('#continue-shopping')).focus({preventScroll:true});
    }
  }
  function openCart() {
    hideToast(); if (detailDialog.open) detailDialog.close();
    if (!cartDialog.open) { renderCart(); cartDialog.showModal(); document.body.classList.add('dialog-open'); $('#close-cart-btn').focus(); }
  }
  function showDetail(id) {
    const p = productsById.get(id); if (!p) return;
    $('#product-detail').innerHTML = `<div class="detail-layout"><img class="detail-image" src="${p.image}?v=catalogo-limpio-3" alt="${escapeHTML(p.name)}, fotografía de referencia"><div class="detail-copy"><p class="product-category">${escapeHTML(p.category)}</p><h2 id="detail-title">${escapeHTML(p.name)}</h2><p>${escapeHTML(p.description)}</p><div class="detail-price">${money(p.price)} <small>HNL</small></div><button type="button" class="button button-primary" data-detail-add="${p.id}">Agregar al carrito ${icon('bag')}</button><p class="reference-note">Fotografía de referencia. Precio de demostración; marca, modelo y disponibilidad sin confirmar.</p></div></div>`;
    hideToast(); detailDialog.showModal(); document.body.classList.add('dialog-open'); $('#close-detail').focus();
  }

  grid.addEventListener('click', event => {
    const b = event.target.closest('button'); if (!b) return;
    if (b.dataset.add) addToCart(Number(b.dataset.add), b);
    if (b.dataset.detail) showDetail(Number(b.dataset.detail));
    if (b.dataset.favorite) {
      const id = Number(b.dataset.favorite), wasSaved = favorites.has(id);
      if (wasSaved) favorites.delete(id); else favorites.add(id);
      storageWrite(FAVORITES_KEY, [...favorites]);
      if (favoritesOnly) {
        renderProducts(); (grid.querySelector('[data-favorite]') || $('#favorites-toggle')).focus({preventScroll:true});
      } else {
        b.setAttribute('aria-pressed', String(!wasSaved));
        b.setAttribute('aria-label', `${wasSaved?'Guardar como favorito:':'Quitar de favoritos:'} ${productsById.get(id).name}`);
        updateFavoriteCount();
      }
      notify(wasSaved ? 'Producto eliminado de favoritos.' : 'Producto guardado en favoritos.', 'Ver favoritos', () => {
        resetFilters(); favoritesOnly = true; renderProducts(); $('#catalogo').scrollIntoView(); $('#favorites-toggle').focus({preventScroll:true});
      });
    }
  });
  $('#product-detail').addEventListener('click', event => {
    const b = event.target.closest('[data-detail-add]'); if (!b) return;
    const rect = $('.detail-image').getBoundingClientRect();
    const id = Number(b.dataset.detailAdd); detailDialog.close(); addToCart(id, null, rect);
  });
  $('#cart-items').addEventListener('click', event => {
    const b = event.target.closest('[data-action]'); if (!b) return;
    const id = Number(b.dataset.id), item = cart.find(item => item.id===id); if (!item) return;
    if (b.dataset.action === 'remove') {
      const removed = {...item}; cart = cart.filter(item => item.id!==id); saveCart(); renderCart();
      $('#cart-feedback').textContent = productsById.get(id).name+' eliminado del carrito.';
      // Deshacer permanece dentro del diálogo, accesible con teclado.
      const undo = document.createElement('button'); undo.type='button'; undo.className='text-button'; undo.id='cart-undo'; undo.textContent='Deshacer eliminación';
      $('#cart-undo')?.remove(); $('.cart-summary').prepend(undo);
      undo.addEventListener('click', () => { const current=cart.find(i=>i.id===id); if(current)current.quantity=Math.min(99,current.quantity+removed.quantity);else cart.push(removed);saveCart();renderCart();undo.remove();$('#close-cart-btn').focus();$('#cart-feedback').textContent='Producto recuperado.'; });
    } else {
      item.quantity = Math.max(1, Math.min(99, item.quantity+(b.dataset.action==='plus'?1:-1)));
      saveCart(); renderCart(); $('#cart-feedback').textContent=`${productsById.get(id).name}: ${item.quantity} unidades. Total ${money(total())}.`;
    }
  });
  $('#product-search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer=setTimeout(renderProducts,120); });
  $('#product-sort').addEventListener('change', renderProducts);
  document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', () => {category=b.dataset.category;renderProducts();}));
  document.querySelectorAll('[data-category-shortcut]').forEach(b => b.addEventListener('click', () => {
    resetFilters(); category=b.dataset.categoryShortcut; renderProducts(); $('#catalogo').scrollIntoView(); $(`.filter-btn[data-category="${category}"]`).focus({preventScroll:true});
  }));
  $('#favorites-toggle').addEventListener('click', () => { favoritesOnly=!favoritesOnly;renderProducts();$('#catalogo').scrollIntoView(); });
  $('#reset-filters').addEventListener('click', () => {resetFilters();$('#product-search').focus();});
  $('#empty-reset').addEventListener('click', () => {resetFilters();$('#product-search').focus();});
  $('#open-cart-btn').addEventListener('click', openCart);
  $('#close-cart-btn').addEventListener('click', () => cartDialog.close());
  $('#continue-shopping').addEventListener('click', () => cartDialog.close());
  $('#close-detail').addEventListener('click', () => detailDialog.close());
  [cartDialog, detailDialog].forEach(dialog => {
    dialog.addEventListener('close', () => { if(!cartDialog.open && !detailDialog.open)document.body.classList.remove('dialog-open'); });
    let outside=false;
    dialog.addEventListener('pointerdown', e => {const r=dialog.getBoundingClientRect();outside=e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;});
    dialog.addEventListener('click', e => {const r=dialog.getBoundingClientRect();if(outside && (e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();outside=false;});
  });
  $('#toast-action').addEventListener('click', () => {const action=toastAction;hideToast();action?.();});
  $('#toast-close').addEventListener('click', () => hideToast(true));
  $('#checkout-btn').addEventListener('click', () => {
    if (!cart.length) return;
    const lines=['RUMBO · MI LISTA DE VIAJE','Catálogo de demostración. No es un pedido ni un comprobante de pago.','',...cart.map(item=>{const p=productsById.get(item.id);return `${item.quantity} × ${p.name} — ${money(p.price)} por unidad — ${money(p.price*item.quantity)}`;}),'',`Subtotal de productos: ${money(total())} HNL`,'Envío e impuestos adicionales: no calculados.','Precios, características y disponibilidad sin confirmar.'];
    const url=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\r\n')],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='mi-lista-rumbo.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
    $('#cart-feedback').textContent='Lista preparada. Revisa las descargas de tu navegador. El carrito se ha conservado.';
    $('#checkout-btn').textContent='✓ Lista descargada';setTimeout(()=>{$('#checkout-btn').innerHTML='Descargar mi lista <span aria-hidden="true">↓</span>';},2000);
  });
  window.addEventListener('storage', event => {if([CART_KEY,FAVORITES_KEY,null].includes(event.key)){loadState();renderProducts();renderCart();}});
  document.addEventListener('error', event => {
    const image=event.target;if(image instanceof HTMLImageElement && !image.dataset.failed){image.dataset.failed='true';image.alt='Fotografía no disponible';image.style.objectFit='contain';}
  },true);
  PHOTO_CREDITS.forEach(credit => {
    const li=document.createElement('li'),link=document.createElement('a'),license=document.createElement('a');
    link.href=credit.page;link.target='_blank';link.rel='noopener noreferrer';link.textContent=productsById.get(credit.id).name+' — '+credit.title;
    license.href=credit.licenseUrl||credit.page;license.target='_blank';license.rel='noopener noreferrer';license.textContent=credit.license;
    li.append(link,document.createTextNode(' · '+credit.author+' · '),license,document.createTextNode(' · Archivo reducido; encuadre de presentación.'));$('#photo-credits').appendChild(li);
  });
  $('#year').textContent=new Date().getFullYear();loadState();renderProducts();renderCart();
})();


