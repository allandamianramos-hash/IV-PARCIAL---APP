/* INTEGRANTE 2
   1. Catálogo y tarifas de demostración.
   2. Vistas de destinos, detalle, vuelos y hoteles.
   3. Conexiones con el inicio, conservando script.js del equipo.
*/

/* INTEGRANTE 2 · Catálogo de demostración.
   Aquí se pueden cambiar destinos, horarios y precios sin tocar el inicio.
   Todos los importes están en lempiras. No son tarifas ni reservas reales. */
(() => {
  'use strict';

  const destinations = [
    {
      id: 'roatan', name: 'Roatán', country: 'Honduras', region: 'honduras',
      type: 'playa', tag: 'Playa y descanso', image: 'imagenes-viajes/playa.jpg',
      alt: 'Playa tropical de aguas claras, fotografía de inspiración',
      intro: 'Días de mar, arena y una pausa que se siente diferente.',
      description: 'Roatán es una opción para disfrutar del Caribe hondureño. Combina tiempo en la playa con paseos por la isla y actividades en el mar, según tus gustos.',
      highlights: ['Disfrutar de la playa', 'Explorar la isla', 'Conocer la gastronomía local'],
      tip: 'Deja tiempo libre entre actividades para disfrutar del mar a tu ritmo.',
      arrival: 'Roatán', transfer: '', nights: 3, economy: 3200, duration: 55,
      hotels: [
        { id: 'paradise', name: 'Hotel Paradise', stars: 4, area: 'Zona de playa', rate: 1500, image: 'hotel-playa.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] },
        { id: 'brisa', name: 'Brisa del Caribe', stars: 3, area: 'Cerca del centro', rate: 1200, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Aire acondicionado'] },
        { id: 'coral', name: 'Coral Boutique', stars: 5, area: 'Frente al mar', rate: 2600, image: 'hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] }
      ]
    },
    {
      id: 'la-ceiba', name: 'La Ceiba', country: 'Honduras', region: 'honduras',
      type: 'naturaleza', tag: 'Naturaleza y aventura', image: 'imagenes-viajes/naturaleza.jpg',
      alt: 'Paisaje natural con vegetación, fotografía de inspiración',
      intro: 'El punto de partida para una escapada entre naturaleza y costa.',
      description: 'La Ceiba reúne vida de ciudad, costa y opciones de aventura en sus alrededores. Puedes organizar una estancia tranquila o dedicar tiempo a conocer sus paisajes naturales.',
      highlights: ['Pasear por la costa', 'Planear un recorrido por la naturaleza', 'Probar sabores locales'],
      tip: 'Lleva calzado cómodo si incluyes recorridos por senderos.',
      arrival: 'La Ceiba', transfer: '', nights: 3, economy: 2400, duration: 45,
      hotels: [
        { id: 'rio', name: 'Hotel Río Verde', stars: 3, area: 'Zona natural', rate: 950, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Estacionamiento'] },
        { id: 'palmas', name: 'Las Palmas Lodge', stars: 4, area: 'Alrededores de la ciudad', rate: 1450, image: 'hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] },
        { id: 'bahia', name: 'Bahía Serena', stars: 4, area: 'Zona de costa', rate: 1850, image: 'hotel-playa.jpg', amenities: ['Piscina', 'Wi-Fi'] }
      ]
    },
    {
      id: 'copan', name: 'Copán Ruinas', country: 'Honduras', region: 'honduras',
      type: 'cultura', tag: 'Cultura e historia', image: 'imagenes-viajes/cultura.jpg',
      alt: 'Ruinas mayas de Copán entre árboles, fotografía de Mónica J. Mora',
      intro: 'Historia maya, calles para caminar y días sin prisa.',
      description: 'Copán Ruinas invita a conocer la historia maya y disfrutar de un pueblo con espacios para pasear, comer y descansar. Puedes combinar visitas culturales con recorridos por sus alrededores.',
      highlights: ['Conocer el sitio arqueológico', 'Caminar por el pueblo', 'Explorar los alrededores'],
      tip: 'Reserva tiempo para el traslado terrestre desde la ciudad de llegada.',
      arrival: 'San Pedro Sula', transfer: 'El vuelo llega a San Pedro Sula. El traslado terrestre a Copán Ruinas no está incluido.',
      nights: 2, economy: 2100, duration: 40,
      hotels: [
        { id: 'patio', name: 'Hotel Patio Maya', stars: 3, area: 'Zona del pueblo', rate: 850, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'jardin', name: 'Jardín de Copán', stars: 4, area: 'Alrededores del pueblo', rate: 1350, image: 'hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Estacionamiento'] },
        { id: 'loma', name: 'La Loma Boutique', stars: 4, area: 'Zona tranquila', rate: 1700, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] }
      ]
    },
    {
      id: 'bali', name: 'Bali', country: 'Indonesia', region: 'internacional',
      type: 'playa', tag: 'Playa y calma', image: 'imagenes-viajes/bali.jpg',
      alt: 'Templo junto al agua en Bali',
      intro: 'Entre templos, arrozales y tardes que terminan frente al mar.',
      description: 'Bali combina paisajes de playa con espacios culturales y zonas de vegetación. Organiza el viaje por áreas para dedicar más tiempo a las experiencias que te interesan.',
      highlights: ['Conocer templos', 'Recorrer paisajes de arrozales', 'Descansar cerca del mar'],
      tip: 'Distribuye las actividades por zonas y contempla tiempo para desplazarte.',
      arrival: 'Bali', transfer: '', nights: 7, economy: 28500, duration: 1630,
      hotels: [
        { id: 'loto', name: 'Jardín de Loto', stars: 3, area: 'Zona de jardines', rate: 1700, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'ubud', name: 'Verde Retreat', stars: 4, area: 'Entorno natural', rate: 2300, image: 'hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] },
        { id: 'oceano', name: 'Océano Resort', stars: 5, area: 'Zona de playa', rate: 3400, image: 'hotel-playa.jpg', amenities: ['Piscina', 'Wi-Fi'] }
      ]
    },
    {
      id: 'dolomitas', name: 'Dolomitas', country: 'Italia', region: 'internacional',
      type: 'naturaleza', tag: 'Aire libre', image: 'imagenes-viajes/dolomitas.jpg',
      alt: 'Cumbres rocosas entre nubes, fotografía de inspiración',
      intro: 'Senderos, lagos y una buena razón para salir de la rutina.',
      description: 'Las Dolomitas ofrecen una experiencia centrada en la montaña. Elige una base para alojarte y organiza recorridos acordes con tus preferencias y el tiempo disponible.',
      highlights: ['Contemplar paisajes de montaña', 'Explorar senderos', 'Conocer pueblos de la zona'],
      tip: 'Elige recorridos adecuados a tu experiencia y revisa las condiciones antes de salir.',
      arrival: 'Venecia', transfer: 'El vuelo llega a Venecia. El traslado a las Dolomitas se organiza por separado y no está incluido.',
      nights: 5, economy: 22500, duration: 1050,
      hotels: [
        { id: 'alpino', name: 'Refugio Alpino', stars: 3, area: 'Pueblo de montaña', rate: 2200, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'valle', name: 'Valle Sereno', stars: 4, area: 'Zona de montaña', rate: 3100, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Estacionamiento'] },
        { id: 'cumbres', name: 'Cumbres Boutique', stars: 5, area: 'Entorno natural', rate: 4200, image: 'hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] }
      ]
    },
    {
      id: 'kioto', name: 'Kioto', country: 'Japón', region: 'internacional',
      type: 'cultura', tag: 'Cultura y ciudad', image: 'imagenes-viajes/kioto.jpg',
      alt: 'Calle tradicional de Kioto con una pagoda al fondo',
      intro: 'Calles con historia, jardines y nuevos sabores por descubrir.',
      description: 'Kioto es un destino para conocer espacios tradicionales, jardines y barrios con identidad propia. Combina tus visitas con momentos para caminar y descubrir la ciudad.',
      highlights: ['Visitar templos y jardines', 'Pasear por calles tradicionales', 'Descubrir la gastronomía'],
      tip: 'Agrupa las visitas cercanas para aprovechar mejor cada día.',
      arrival: 'Osaka', transfer: 'El vuelo llega a Osaka. El traslado a Kioto no está incluido.',
      nights: 9, economy: 33000, duration: 1530,
      hotels: [
        { id: 'sakura', name: 'Casa Sakura', stars: 3, area: 'Zona urbana', rate: 1900, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi'] },
        { id: 'bambu', name: 'Jardín de Bambú', stars: 4, area: 'Zona tranquila', rate: 2750, image: 'hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'luna', name: 'Luna de Kioto', stars: 5, area: 'Zona céntrica', rate: 3900, image: 'hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] }
      ]
    }
  ];

  // Nombres ficticios propios para cada alojamiento de demostración.
  const hotelNames = {
    roatan: ['Hotel Paradise', 'Brisa del Caribe', 'Coral Boutique', 'Apartamentos Marea Clara', 'Villa Caracola'],
    'la-ceiba': ['Hotel Río Verde', 'Las Palmas Lodge', 'Bahía Serena', 'Apartamentos Sendero del Río', 'Hotel Ceiba Dorada'],
    copan: ['Hotel Patio Maya', 'Jardín de Copán', 'La Loma Boutique', 'Apartamentos Casa del Glifo', 'Posada Piedra de Jade'],
    bali: ['Jardín de Loto', 'Verde Retreat', 'Océano Resort', 'Apartamentos Arrozal de Seda', 'Villa Flor de Frangipani'],
    dolomitas: ['Refugio Alpino', 'Valle Sereno', 'Cumbres Boutique', 'Apartamentos Nido de Abeto', 'Chalet Roca del Alba'],
    kioto: ['Casa Sakura', 'Jardín de Bambú', 'Luna de Kioto', 'Apartamentos Patio de Arce', 'Posada Farol de Papel'],
    utila: ['Posada Concha Azul', 'Hotel Jardín del Manglar', 'Boutique Faro de Nácar', 'Apartamentos Brisa del Arrecife', 'Villa Cayo Escondido'],
    tela: ['Hotel Arena de Ámbar', 'Lodge Sendero de Palmas', 'Boutique Bahía del Sol', 'Apartamentos Patio de Cocos', 'Villa Orquídea Costera'],
    yojoa: ['Posada Orilla del Junco', 'Lodge Bosque de Niebla', 'Boutique Mirador del Agua', 'Apartamentos Casa del Colibrí', 'Hotel Reflejos del Lago'],
    antigua: ['Posada Patio de Canela', 'Hotel Jardín de los Arcos', 'Boutique Casona del Volcán', 'Apartamentos Balcón de Barro', 'Casa Buganvilia Colonial'],
    panama: ['Hotel Istmo de Luz', 'Hotel Patio del Canal', 'Boutique Azotea del Pacífico', 'Apartamentos Ventana del Casco', 'Hotel Bahía de Cristal'],
    cancun: ['Posada Duna Turquesa', 'Hotel Jardín de las Conchas', 'Boutique Mar de Ópalo', 'Apartamentos Viento de Arena', 'Villa Laguna del Amanecer'],
    miami: ['Hotel Ocean Mosaic', 'Hotel Palm Avenue', 'Boutique Biscayne Glow', 'Apartamentos Coral Courtyard', 'Hotel Sunset Terrace'],
    madrid: ['Posada Patio del Laurel', 'Hotel Jardín de la Villa', 'Boutique Cúpula de Cobre', 'Apartamentos Balcón de las Letras', 'Hotel Azotea del Olmo']
  };

  // Nuevas propuestas de demostración; créditos fotográficos en el catálogo.
  const additions = [
    ['utila','Utila','Honduras','playa','Utila',3,3500,65,1400,'Una isla para disfrutar del mar y organizar una escapada tranquila.'],
    ['tela','Tela','Honduras','playa','San Pedro Sula',3,2100,40,1150,'Playas, sabores caribeños y paseos por la costa hondureña.'],
    ['yojoa','Lago de Yojoa','Honduras','naturaleza','San Pedro Sula',2,2100,40,950,'Días entre paisajes verdes, senderos y descanso cerca del lago.'],
    ['antigua','Antigua Guatemala','Guatemala','cultura','Ciudad de Guatemala',4,4800,110,1350,'Calles coloniales, plazas y cafés para descubrir caminando.'],
    ['panama','Ciudad de Panamá','Panamá','cultura','Ciudad de Panamá',4,6500,160,1850,'Una escapada entre el Casco Antiguo y la ciudad contemporánea.'],
    ['cancun','Cancún','México','playa','Cancún',5,7200,210,2300,'Descanso junto al Caribe y tiempo para explorar la costa.'],
    ['miami','Miami','Estados Unidos','playa','Miami',4,8200,180,2900,'Playas, barrios con personalidad y paseos por la ciudad.'],
    ['madrid','Madrid','España','cultura','Madrid',6,19500,840,2400,'Museos, parques y plazas para disfrutar de una estancia urbana.']
  ];
  additions.forEach(([id,name,country,type,arrival,nights,economy,duration,base,intro]) => {
    const nature = type === 'naturaleza';
    destinations.push({
      id,name,country,region:country==='Honduras'?'honduras':'internacional',type,
      tag:type==='playa'?'Playa y descanso':nature?'Naturaleza y aventura':'Cultura y ciudad',
      image:`imagenes-viajes/destino-${id}.jpg`,
      alt:`Vista de ${name}; fotografía de Wikimedia Commons`,
      intro,description:intro+' Combina tus visitas con tiempo libre y elige el alojamiento que mejor se adapte a tu presupuesto.',
      highlights:type==='playa'?['Paseos por la costa','Gastronomía local','Tiempo de descanso']:nature?['Contemplar paisajes','Recorridos al aire libre','Descanso en la naturaleza']:['Recorrer el centro','Conocer espacios culturales','Probar sabores locales'],
      tip:'Confirma traslados, horarios y disponibilidad con los proveedores antes de reservar.',
      arrival,transfer:arrival!==name?`Llegada aérea propuesta: ${arrival}. El traslado a ${name} se organiza por separado y no está incluido.`:'',
      nights,economy,duration,
      hotels:[
        {id:`${id}-esencial`,name:hotelNames[id][0],stars:3,area:'Zona urbana',rate:base,image:'hotel-habitacion.jpg',amenities:['Wi-Fi','Aire acondicionado']},
        {id:`${id}-jardin`,name:hotelNames[id][1],stars:4,area:'Zona tranquila',rate:Math.round(base*1.3),image:'hotel-piscina.jpg',amenities:['Piscina','Wi-Fi','Desayuno']},
        {id:`${id}-boutique`,name:hotelNames[id][2],stars:5,area:'Zona de descanso',rate:Math.round(base*1.8),image:type==='playa'?'hotel-playa.jpg':'hotel-habitacion.jpg',amenities:['Wi-Fi','Desayuno','Estacionamiento']}
      ]
    });
  });
  destinations.forEach(d => {
    const base = Math.min(...d.hotels.map(h=>h.rate));
    d.hotels.push(
      {id:`${d.id}-apartamentos`,name:hotelNames[d.id][3],stars:3,area:'Zona residencial',rate:Math.round(base*.85),image:'hotel-habitacion.jpg',amenities:['Wi-Fi','Cocina','Estacionamiento']},
      {id:`${d.id}-terraza`,name:hotelNames[d.id][4],stars:4,area:'Zona tranquila',rate:Math.round(base*1.45),image:'hotel-piscina.jpg',amenities:['Piscina','Wi-Fi','Desayuno']}
    );
  });

  const hotelPhotos = {
  "paradise": {
    "image": "hotel-paradise.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "WiNG",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_Four_Seasons_Hotel_%26_Resort_Macau_Swimming_Pool_2009.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "brisa": {
    "image": "hotel-brisa.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Basile Morin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Canopy_bed_of_Amantaka_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "coral": {
    "image": "hotel-coral.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Dalyan,_Turkey_March_2022_-_Nish_Caria_Butik_Hotel_%26_Restaurant_-_Pool.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "roatan-apartamentos": {
    "image": "hotel-roatan-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Marina Kuperman Villatoro",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Premier-hotel-bedroom_Huehuetenango_Guatemala.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "roatan-terraza": {
    "image": "hotel-roatan-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Ian Cunliffe",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Talland_Bay_Hotel_and_swimming_pool_-_geograph.org.uk_-_1190750.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "rio": {
    "image": "hotel-rio-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cerulean_Tower_Tokyu_Hotel_Sky_View_Floor_Deluxe_Single_bedroom_20160923-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "palmas": {
    "image": "hotel-palmas-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Hiroshima_Moderate_Double_bedroom_20190928-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bahia": {
    "image": "hotel-bahia.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Anass Sedrati",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Pool_-_Nicon_Hotel.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "la-ceiba-apartamentos": {
    "image": "hotel-la-ceiba-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Anthony O'Neil",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom,_Bear_Hotel_(geograph_4847914).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "la-ceiba-terraza": {
    "image": "hotel-la-ceiba-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Gary J. Wood from Toronto, ON, Canada",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Omni_Interlocken_Resort,_pool.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "patio": {
    "image": "hotel-patio.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Curt Smith from Bellevue, WA, USA",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom,_H%C3%B4tel_d%27Abbaye,_Paris_May_2017.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "jardin": {
    "image": "hotel-jardin.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Uxmal,_Yucatan,_Mexico_-_Swimming_pool,_Uxmal_Resort_Maya_2021.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "loma": {
    "image": "hotel-loma.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "jjmusgrove",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Antigua_Guatemala_-_Fine_Hotel_Bedroom.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "copan-apartamentos": {
    "image": "hotel-copan-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Trusty_Kanazawa_Korinbo_Superior_Single_bedroom_20131206-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "copan-terraza": {
    "image": "hotel-copan-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Andy Gnias",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Roosevelt_from_the_hotel_pool.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "loto": {
    "image": "hotel-loto.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "掬茶",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Single_bedroom_of_Hotel_Hokke_Club_Hakodate.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "ubud": {
    "image": "hotel-ubud-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cross_Hotel_Kyoto_Superior_King_bedroom_20210724-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "oceano": {
    "image": "hotel-oceano.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Thomas from Switzerland",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_pool_(6323259177).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "bali-apartamentos": {
    "image": "hotel-bali-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "掬茶",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Single_bedroom_of_APA_Hotel_Hachinohe_Chuo.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bali-terraza": {
    "image": "hotel-bali-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Monica Wong from New York City, NY, United States",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Infinity_Pool_at_the_Cancun_Caribe_Park_Royal_Grand_Hotel_%26_Resort.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "alpino": {
    "image": "hotel-alpino.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bancroft_Hotel,_Berkeley,_California_-_Bedroom.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "valle": {
    "image": "hotel-valle.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Bob Harvey",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_bedroom_-_geograph.org.uk_-_5280127.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "cumbres": {
    "image": "hotel-cumbres-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_La_Raison_Osaka_Standard_Twin_bedroom_20161216-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "dolomitas-apartamentos": {
    "image": "hotel-dolomitas-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Edit_Yokohama_Single_bedroom_20190714-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "dolomitas-terraza": {
    "image": "hotel-dolomitas-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Kyoto_Ekimae_Corner_Twin_bedroom_20220205-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "sakura": {
    "image": "hotel-sakura.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Kobe_Deluxe_Single_bedroom_20111122-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bambu": {
    "image": "hotel-bambu.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "jjmusgrove",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Lake_Bedroom_Guatemala_2018.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "luna": {
    "image": "hotel-luna.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Thomas from Switzerland",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_pool_with_view_over_the_valley_(6323256471).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "kioto-apartamentos": {
    "image": "hotel-kioto-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Lotte_City_Hotel_Kinshicho_Elite_Single_bedroom_20140927-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "kioto-terraza": {
    "image": "hotel-kioto-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Jim Killock",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Thermal_Pool.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "utila-esencial": {
    "image": "hotel-utila-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Sunroute_Ariake_Standard_Single_bedroom_20110603-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-jardin": {
    "image": "hotel-utila-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hakodate_Kokusai_Hotel_Premium_Twin_bedroom_20201017-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-boutique": {
    "image": "hotel-utila-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Tokyo_Oshiage_Single_bedroom_20160220-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-apartamentos": {
    "image": "hotel-utila-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kobe_Portopia_Hotel_Oval_Club_single_bedroom_20130621-002.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-terraza": {
    "image": "hotel-utila-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Musashi-Kosugi_single_bedroom_20100618-001.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "tela-esencial": {
    "image": "hotel-tela-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kyoto_Brighton_Hotel_Superior_Double_bedroom_20200823-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-jardin": {
    "image": "hotel-tela-jardin-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Millennium_Mitsui_Garden_Hotel_Tokyo_Superior_Double_bedroom_20170318-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-boutique": {
    "image": "hotel-tela-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Celestine_Hotel_Superior_Double_bedroom_20160501-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-apartamentos": {
    "image": "hotel-tela-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kyoto_Century_Hotel_Kyo-Premium_bedroom_20210717-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-terraza": {
    "image": "hotel-tela-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Niwa_Tokyo_standard_bedroom_20131027-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-esencial": {
    "image": "hotel-yojoa-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Tokyu_Bizfort_Kobe_Motomachi_single_bedroom_20120427-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-jardin": {
    "image": "hotel-yojoa-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Kanazawa_Moderate_Double_bedroom_20200103-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-boutique": {
    "image": "hotel-yojoa-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:ANA_Hotel_Okayama_Upper_Floor_Single_bedroom_20150809-002.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-apartamentos": {
    "image": "hotel-yojoa-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Amalie_Deluxe_Twin_bedroom_20130531-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-terraza": {
    "image": "hotel-yojoa-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Piena_Kobe_Royal_Twin_bedroom_20141124-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-esencial": {
    "image": "hotel-antigua-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Kyoto_Standard_Twin_bedroom_20130201-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-jardin": {
    "image": "hotel-antigua-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Sendai_Standard_Single_B_bedroom_20100809-001.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "antigua-boutique": {
    "image": "hotel-antigua-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Nishitetsu_Hotel_Croom_Hakata_Premium_Business_bedroom_20190413-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-apartamentos": {
    "image": "hotel-antigua-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Associa_Takayama_Resort_Standard_Twin_bedroom_20170723-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-terraza": {
    "image": "hotel-antigua-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Ginza_Premier_Moderate_bedroom_20151223-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "panama-esencial": {
    "image": "hotel-panama-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Nick Anderson",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Waldorf_London_hotel_room.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "panama-jardin": {
    "image": "hotel-panama-jardin-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_Gate_Hotel_Kaminarimon_Modest_Semi_Double_bedroom_20140928-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "panama-boutique": {
    "image": "hotel-panama-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Mack Male from Edmonton, AB, Canada",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_hotel_room_(2342689366).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "panama-apartamentos": {
    "image": "hotel-panama-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Osaka_Premier_Superior_bedroom_20140316-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "panama-terraza": {
    "image": "hotel-panama-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Palickap",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Yerevan,_Silachi_Hotel,_room_2.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-esencial": {
    "image": "hotel-cancun-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Huzaifakumo",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Gombe_International_Hotel_Room_2.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-jardin": {
    "image": "hotel-cancun-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Kurt Kaiser",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_in_hotel_room.jpg",
    "photoLicense": "CC0",
    "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "cancun-boutique": {
    "image": "hotel-cancun-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "OhanaUnitedTalk page",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kuujjuarapik_Co-op_hotel_room_2.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-apartamentos": {
    "image": "hotel-cancun-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Good_Nature_Hotel_Kyoto_Garden_View_Terrace_Double_bedroom_20200704-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-terraza": {
    "image": "hotel-cancun-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cross_Hotel_Osaka_Comfort_Floor_twin_bedroom_20120217-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "miami-esencial": {
    "image": "hotel-miami-esencial-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotels_single_bedroom_20110806-001.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "miami-jardin": {
    "image": "hotel-miami-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Casey And Sonja",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Congress_Plaza_Hotel_(Room)_(4347277667).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "miami-boutique": {
    "image": "hotel-miami-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Douglas Muth from Philadelphia, PA, USA",
    "photoSource": "https://commons.wikimedia.org/wiki/File:My_Hotel_Room_(51750469535).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "miami-apartamentos": {
    "image": "hotel-miami-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Andy Mitchell from Glasgow, UK",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Royal_Marine_Hotel_room_(3280716439).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "miami-terraza": {
    "image": "hotel-miami-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Fredericknoronha",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Chandigarh,_India_starred_hotel_room_01.jpg",
    "photoLicense": "CC BY 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "madrid-esencial": {
    "image": "hotel-madrid-esencial-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Bai Timan Lam SAREOYSEE",
    "photoSource": "https://commons.wikimedia.org/wiki/File:MC_%E6%BE%B3%E9%96%80_Hotel_Okura_Macau_%E5%A4%A7%E5%80%89%E9%85%92%E5%BA%97_bedroom_%E6%88%BF%E9%96%93_May_2018_LGM_01.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "madrid-jardin": {
    "image": "hotel-madrid-jardin-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Tess Mattew",
    "photoSource": "https://commons.wikimedia.org/wiki/File:2025.07.13_Interior_bedroom_Hotel_Hlybokae_01.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "madrid-boutique": {
    "image": "hotel-madrid-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:My_hotel_room_in_Heihe_for_179_yuan_%3D_US_$29!_(8809150032).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "madrid-apartamentos": {
    "image": "hotel-madrid-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "JIP",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Hotel_Korpilampi.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "madrid-terraza": {
    "image": "hotel-madrid-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "JIP",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_ProfilHotels_Riddargatan.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  }
};
  destinations.forEach(d => d.hotels.forEach(h => Object.assign(h, hotelPhotos[h.id])));

  // El catálogo activo solo ofrece destinos con aeropuerto identificado.
  // Cambiar el identificador evita convertir una selección anterior en otra ciudad.
  const airportReplacements = {
    'la-ceiba': ['san-jose','San José','Museos, mercados y parques en el Valle Central de Costa Rica.', ['Conocer museos','Pasear por los parques','Probar la gastronomía local']],
      copan: ['paris','París','Museos, cafés y paseos junto al Sena en la capital francesa.', ['Visitar la Torre Eiffel','Explorar el Louvre','Pasear por Montmartre']],
      yojoa: ['roma','Roma','Historia, plazas y sabores italianos en la Ciudad Eterna.', ['Conocer el Coliseo','Visitar la Fontana di Trevi','Pasear por Trastevere']],
      utila: ['nueva-york','Nueva York','Rascacielos, parques y barrios llenos de vida.', ['Pasear por Central Park','Visitar sus museos','Conocer Times Square']],
      tela: ['barcelona','Barcelona','Arquitectura, gastronomía y paseos junto al Mediterráneo.', ['Conocer la Sagrada Familia','Recorrer el Barrio Gótico','Pasear por la Barceloneta']],
    antigua: ['ciudad-guatemala','Ciudad de Guatemala','Museos, mercados y barrios para una escapada urbana.', ['Visitar museos','Recorrer mercados','Descubrir la ciudad']],
    dolomitas: ['venecia','Venecia','Canales, puentes y plazas para descubrir a pie.', ['Pasear junto a los canales','Conocer sus plazas','Explorar sus barrios']],
    kioto: ['osaka','Osaka','Gastronomía, barrios animados y cultura urbana japonesa.', ['Probar sabores locales','Explorar los barrios','Visitar espacios culturales']]
  };
  destinations.forEach(d => {
    const replacement = airportReplacements[d.id];
    if (!replacement) return;
    const [id,name,intro,highlights] = replacement;
    Object.assign(d,{id,name,arrival:name,intro,description:intro,type:'cultura',tag:'Cultura y ciudad',highlights,
      image:`imagenes-viajes/destino-${id}.jpg`,alt:`Vista de ${name}; fotografía de Wikimedia Commons`,
      transfer:'',tip:'Organiza el traslado entre el aeropuerto y tu hospedaje por separado.'});
    if(id==='san-jose'){
        Object.assign(d,{country:'Costa Rica',region:'internacional',economy:6200,duration:180,
          image:'imagenes-viajes/destino-san-jose-teatro.jpg',alt:'Fachada del Teatro Nacional en San José, Costa Rica'});
      const names=['Hotel Patio del Café','Lodge Jardín de la Sabana','Boutique Valle del Sol','Apartamentos Paseo del Cedro','Hotel Cúpula Esmeralda'];
      d.hotels.forEach((h,i)=>{h.name=names[i];h.area=i===1?'Zona de parques':'Zona urbana';});
    }
      const popularCities = {
        paris: ['Francia',24000,900,6,['Maison Lumière','Hotel Jardín del Sena','Boutique Atelier Azul','Suites de la Ópera','Posada del Bulevar']],
        roma: ['Italia',23000,960,5,['Hotel Patio del Tíber','Casa del Olivo','Boutique Terra Dorada','Suites del Mosaico','Posada Via Serena']],
        'nueva-york': ['Estados Unidos',13000,480,5,['Hotel Hudson Garden','Skyline Loft','Boutique Maple House','Suites del Puente','Hotel Avenue Central']],
        barcelona: ['España',21500,840,5,['Hotel Patio del Eixample','Casa del Mosaico','Boutique Brisa Catalana','Suites del Paseo','Hotel Jardín Condal']]
      };
      if(popularCities[id]){
        const [country,economy,duration,nights,names]=popularCities[id];
        Object.assign(d,{country,region:'internacional',economy,duration,nights});
        d.hotels.forEach((h,i)=>Object.assign(h,{name:names[i],area:i===0?'Zona céntrica':'Zona urbana',rate:1800+i*450}));
      }
    d.hotels.forEach(h => {
      h.name=h.name.replace('Jardín de Copán','Jardín del Valle').replace('Luna de Kioto','Luna de Naniwa')
        .replace('Refugio Alpino','Posada del Canal').replace('Cumbres Boutique','Palacio de la Laguna')
        .replace('Chalet Roca del Alba','Casa del Puente').replace('Hotel Reflejos del Lago','Hotel Reflejos de la Plaza')
        .replace('Posada Orilla del Junco','Posada del Campanario');
      if(h.area.includes('montaña'))h.area='Zona urbana';
    });
  });
  const airports = {
    roatan: ['RTB','Juan Manuel Gálvez'], 'san-jose':['SJO','Juan Santamaría (Alajuela, sirve a San José)'],
      paris:['CDG','París-Charles de Gaulle'], roma:['FCO','Leonardo da Vinci–Fiumicino'],
      'nueva-york':['JFK','John F. Kennedy'], barcelona:['BCN','Josep Tarradellas Barcelona-El Prat'], bali:['DPS','I Gusti Ngurah Rai'],
    venecia:['VCE','Marco Polo'], osaka:['KIX','Kansai'],
    'ciudad-guatemala':['GUA','La Aurora'],panama:['PTY','Tocumen'],
    cancun:['CUN','Internacional de Cancún'],miami:['MIA','Internacional de Miami'],madrid:['MAD','Adolfo Suárez Madrid-Barajas']
  };
  destinations.forEach(d => {
    const [code,name]=airports[d.id];
    d.airport={code,name};
    if(d.id==='tela'){d.arrival='Tela';d.transfer='';}
    if(d.id==='bali')d.arrival='Denpasar, Bali';
  });

  const airlines = {
    cm:{name:'CM Airlines',url:'https://www.cmairlines.com/es'},
    avianca:{name:'avianca',url:'https://www.avianca.com/es/'},
    copa:{name:'Copa Airlines',url:'https://www.copaair.com/es/vuelos'},
    american:{name:'American Airlines',url:'https://www.aa.com/es-us/vuelos'},
    iberia:{name:'Iberia',url:'https://www.iberia.com/es/'}
  };

  const rooms = {
    estandar: { name: 'Estándar', capacity: 2, factor: 1 },
    familiar: { name: 'Familiar', capacity: 4, factor: 1.6 },
    suite: { name: 'Suite', capacity: 2, factor: 2 }
  };

  const origins = ['Tegucigalpa', 'San Pedro Sula'];

  // Una sola fuente de descuentos para anuncios, vuelos y resumen final.
  const promotions = {
    cancun: { percent: 25, name: 'Escapadas seleccionadas' },
    madrid: { percent: 25, name: 'Escapadas seleccionadas' },
      venecia: { percent: 20, name: 'Tu próximo rumbo: Italia' },
      paris: { percent: 10, name: 'Escapadas a París' },
      barcelona: { percent: 10, name: 'Escapadas a Barcelona' }
  };
  if (window.RumboDatabase?.connected) {
    const catalog = window.RumboDatabase.catalog;
    destinations.splice(0, destinations.length, ...catalog.destinations);
    for (const key of Object.keys(rooms)) delete rooms[key];
    Object.assign(rooms, catalog.rooms);
    origins.splice(0, origins.length, ...catalog.origins);
    for (const key of Object.keys(promotions)) delete promotions[key];
    Object.assign(promotions, catalog.promotions);
  }
  const discounted = (amount, percent) => Math.round(amount * (100 - percent)) / 100;
  destinations.forEach(d => { d.promotion = promotions[d.id] || null; });

  function flights(destination, origin, travelers = 1) {
    if (!destination || !Number.isFinite(destination.economy) || !origins.includes(origin)) return [];
    if (destination.arrival === origin) return [];
    const groupDiscount = Number.isInteger(travelers) && travelers >= 3 && travelers <= 12 ? 5 : 0;
    const destinationDiscount = destination.promotion?.percent || 0;
    const discountPercent = Math.round((100-(100-destinationDiscount)*(100-groupDiscount)/100)*100)/100;
    const extra = origin === 'San Pedro Sula' ? 200 : 0;
    const providers = destination.region==='honduras'?['cm']:['bali','osaka'].includes(destination.id)?['american']:['madrid','venecia'].includes(destination.id)?['iberia','avianca','american']:['avianca','copa','american'];
    return ['08:30', '12:15', '16:45', '06:00', '14:20', '19:10'].map((departure, index) => ({
      id: `${destination.id}-${origins.indexOf(origin)}-${index}`,
      code: `DEMO ${210 + destinations.indexOf(destination) * 10 + index}`,
      airline: airlines[providers[index % providers.length]],
      departure,
      minutes: destination.duration + (index === 1 ? 20 : 0),
      baseEconomy: destination.economy + extra + index * 350,
      baseExecutive: Math.round((destination.economy + extra + index * 350) * 1.65),
      economy: discounted(destination.economy + extra + index * 350, discountPercent),
      executive: discounted(Math.round((destination.economy + extra + index * 350) * 1.65), discountPercent),
      discountPercent, groupDiscount,
      stops: destination.region === 'honduras' ? 'Sin escalas' : 'Con conexiones'
    }));
  }

  const inspirationBudgets = { roatan:8500, 'la-ceiba':6500, copan:4500, bali:32000, dolomitas:19000, kioto:43000 };
  destinations.forEach(d => { d.inspirationBudget = (!window.RumboDatabase?.connected && inspirationBudgets[d.id]) || d.economy + Math.min(...d.hotels.map(h=>h.rate))*d.nights; });
  destinations.filter(d => d.promotion).forEach(d => {
    d.originalInspirationBudget = d.economy + Math.min(...d.hotels.map(h => h.rate)) * d.nights;
    d.inspirationBudget = discounted(d.economy, d.promotion.percent) + Math.min(...d.hotels.map(h => h.rate)) * d.nights;
  });
  window.RumboViajesDatos = { destinations, rooms, origins, flights, promotions };
})();


/* Abre una de las cuatro vistas del mismo archivo HTML.
   Las plantillas evitan mezclar controles de diferentes apartados. */
(() => {
  'use strict';
  if (!document.body.classList.contains('rv-page')) return;
  const titles = {
    destinos: 'Destinos',
    'detalle-destino': 'Detalle del destino',
    vuelos: 'Selección de vuelo',
    hoteles: 'Selección de hotel'
  };
  const requested = new URLSearchParams(location.search).get('pantalla');
  const view = Object.hasOwn(titles, requested) ? requested : 'destinos';
  const template = document.getElementById(`rv-vista-${view}`);
  document.getElementById('contenido').appendChild(template.content.cloneNode(true));
  document.body.dataset.page = view;
  document.title = `${titles[view]} | Rumbo`;
})();

/* INTEGRANTE 2 · Funciones de destinos, vuelos y hoteles.
   JavaScript puro: sin frameworks, módulos externos ni servidor obligatorio.
   Este bloque se activa en la vista elegida de viajes.html. */
(() => {
  'use strict';

  const page = document.body.dataset.page;
  if (!['destinos', 'detalle-destino', 'vuelos', 'hoteles'].includes(page)) return;
  const { destinations, rooms, origins, flights } = window.RumboViajesDatos;
  const $ = selector => document.querySelector(selector);
  let refreshPage = () => {};
  const params = new URLSearchParams(location.search);
  const STORAGE_KEY = 'rumbo.integrante2.viaje.v1';
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => `L. ${Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  const integer = (value, min, max, fallback) => Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= max ? Number(value) : fallback;
  const destinationById = id => destinations.find(item => item.id === id);

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function addDays(value, days) {
    const date = new Date(`${value}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }
  const formatDate = value => new Intl.DateTimeFormat('es-HN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
  const duration = minutes => `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;
  function arrival(flight) {
    const [hours, minutes] = flight.departure.split(':').map(Number);
    const total = hours * 60 + minutes + flight.minutes;
    return { time: `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`, days: Math.floor(total / 1440) };
  }

  // Se guarda una selección independiente; no se utiliza el carrito de la tienda.
  let stored = {};
  try { stored = JSON.parse((window.RumboStorage || localStorage).getItem(STORAGE_KEY) || '{}') || {}; } catch (_) { stored = {}; }
  const fields = { destinationId: 'destino', origin: 'origen', date: 'salida', checkIn: 'entrada', travelers: 'viajeros', nights: 'noches', cabin: 'clase', rooms: 'habitaciones', flightId: 'vuelo', hotelId: 'hotel', roomType: 'tipoHabitacion' };
  let state = {
    destinationId: 'roatan', origin: 'Tegucigalpa', date: addDays(today(), 14), checkIn: '',
    travelers: 1, nights: 3, cabin: 'economica', rooms: 1, flightId: '', hotelId: '', roomType: 'estandar'
  };
  for (const key of Object.keys(fields)) {
    if (stored[key] !== undefined) state[key] = stored[key];
    if (params.has(fields[key])) state[key] = params.get(fields[key]);
  }
  // Un enlace a otro destino no debe heredar el vuelo o el hotel anterior.
  if (params.has('destino') && params.get('destino') !== stored.destinationId) {
    if (!params.has('vuelo')) state.flightId = '';
    if (!params.has('hotel')) state.hotelId = '';
    if (!params.has('noches')) state.nights = destinationById(params.get('destino'))?.nights || 3;
  }
  const invalidDestination = params.has('destino') && !destinationById(params.get('destino'));
  // Al volver con las flechas del navegador, recupera la elección más reciente.
  if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward' && stored.destinationId === state.destinationId) {
    for (const key of Object.keys(fields)) if (stored[key] !== undefined) state[key] = stored[key];
  }

  function currentDestination() { return destinationById(state.destinationId); }
  function currentFlight() { return flights(currentDestination(), state.origin, state.travelers).find(flight => flight.id === state.flightId); }
  function currentHotel() { return currentDestination().hotels.find(hotel => hotel.id === state.hotelId); }
  function rate(hotel, roomType = state.roomType) { return Math.round(hotel.rate * rooms[roomType].factor); }
  function flightRate(flight) { return state.cabin === 'ejecutiva' ? flight.executive : flight.economy; }
  function earliestCheckIn() {
    const flight = currentFlight();
    return flight ? addDays(state.date, arrival(flight).days) : state.date;
  }
  function cleanState() {
    if (!destinationById(state.destinationId)) state.destinationId = 'roatan';
    if (!origins.includes(state.origin)) state.origin = origins[0];
    state.travelers = integer(state.travelers, 1, 12, 1);
    state.nights = integer(state.nights, 1, 30, currentDestination().nights);
    state.rooms = integer(state.rooms, 1, 6, 1);
    if (!['economica', 'ejecutiva'].includes(state.cabin)) state.cabin = 'economica';
    if (!Object.hasOwn(rooms, state.roomType)) state.roomType = 'estandar';
    if (!validDate(state.date) || state.date < today()) {
      state.date = addDays(today(), 14);
      state.flightId = ''; state.hotelId = ''; state.checkIn = '';
    }
    if (!currentFlight()) state.flightId = '';
    if (!currentHotel() || rooms[state.roomType].capacity * state.rooms < state.travelers) state.hotelId = '';
    const earliest = earliestCheckIn();
    if (!validDate(state.checkIn) || state.checkIn < earliest) state.checkIn = earliest;
  }
  cleanState();

  function contextFor(destination) {
    return destination.id === state.destinationId ? {} : {
      destinationId: destination.id, nights: destination.nights,
      flightId: '', hotelId: '', roomType: 'estandar', checkIn: state.date
    };
  }
  // Llevar los datos en la URL permite pasar de página incluso si se bloquea (window.RumboStorage || localStorage).
  function link(path, overrides = {}) {
    const [file, hash] = path.split('#');
    const values = { ...state, ...overrides };
    const query = new URLSearchParams({ pantalla: file });
    for (const [key, name] of Object.entries(fields)) query.set(name, values[key] || '');
    return `viajes.html?${query}${hash ? `#${hash}` : ''}`;
  }
  function updateNavigation() {
    document.querySelectorAll('[data-context]').forEach(element => {
      if (!element.dataset.path) element.dataset.path = element.getAttribute('href');
      element.href = link(element.dataset.path);
    });
  }
  let storageAvailable = true;
  function persist(updateURL = true) {
    cleanState();
    try { (window.RumboStorage || localStorage).setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { storageAvailable = false; }
    updateNavigation();
    if (updateURL && page !== 'destinos') {
      try { history.replaceState(null, '', link(`${page}${location.hash}`)); } catch (_) { /* file:// puede limitar History. */ }
    }
  }
  function updateTrip(patch) {
    const old = { ...state };
    Object.assign(state, patch);
    if (old.destinationId !== state.destinationId) { state.flightId = ''; state.hotelId = ''; state.roomType = 'estandar'; }
    if (['origin', 'date'].some(key => old[key] !== state[key])) state.flightId = '';
    if (old.date !== state.date) state.checkIn = state.date;
    persist();
  }
  let toastTimer;
  function toast(message) {
    const element = $('#rv-toast');
    element.textContent = message; element.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { element.hidden = true; }, 3500);
  }
  function destinationOptions() { return destinations.map(item => `<option value="${item.id}">${item.name} · ${item.airport.code}</option>`).join(''); }
  function notFound() {
    $('#contenido').innerHTML = '<section class="rv-empty" style="margin-top:32px"><h1>Ese destino no está en el catálogo.</h1><p>Elige una de las opciones disponibles para continuar.</p><a class="button button-primary" href="viajes.html?pantalla=destinos">Explorar destinos ↗</a></section>';
  }

  // 1. CATÁLOGO: búsqueda por nombre, tipo, región y presupuesto.
  function initDestinations() {
    const form = $('#destination-filters');
    for (const name of ['q', 'tipo', 'zona', 'presupuesto']) {
      if (params.has(name)) form.elements[name].value = params.get(name);
    }
    for (const select of form.querySelectorAll('select')) if (!select.value) select.value = 'all';
    if (['price-low', 'name'].includes(params.get('orden'))) $('#orden-destinos').value = params.get('orden');

    function render() {
      const q = normalize(form.elements.q.value);
      const type = form.elements.tipo.value;
      const region = form.elements.zona.value;
      const budget = form.elements.presupuesto.value;
      let results = destinations.filter(item =>
        normalize(`${item.name} ${item.country} ${item.tag}`).includes(q) &&
        (type === 'all' || item.type === type) &&
        (region === 'all' || item.region === region) &&
        (budget === 'all' || item.inspirationBudget <= Number(budget))
      );
      const order = $('#orden-destinos').value;
      if (order === 'price-low') results.sort((a, b) => a.inspirationBudget - b.inspirationBudget);
      if (order === 'name') results.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      $('#destination-count').textContent = `${results.length} ${results.length === 1 ? 'destino para descubrir' : 'destinos para descubrir'}`;
      $('#destination-empty').hidden = results.length !== 0;
      $('#destination-list').innerHTML = results.map(item => {
        const href = escapeHTML(link('detalle-destino', contextFor(item)));
        return `<article class="rv-destination-card"><a href="${href}" class="rv-card-photo" tabindex="-1" aria-hidden="true"><img src="${item.image}" alt="" width="1100" height="760" loading="lazy"><span class="rv-card-tag">${item.tag}</span></a>
          <div class="rv-card-content"><p class="rv-card-country">${item.country}</p><h3><a href="${href}">${item.name}</a></h3><p>${item.intro}</p><p class="rv-demo-caption">Aeropuerto: ${item.airport.name} (${item.airport.code})</p>${item.promotion ? `<p class="promo-note"><span class="promo-badge">−${item.promotion.percent}% en vuelos</span> Descuento automático</p>` : ''}<div class="rv-card-footer"><div><small>Idea de presupuesto / persona</small>${item.originalInspirationBudget ? `<del class="promo-original">${money(item.originalInspirationBudget)}</del>` : ''}<strong>${money(item.inspirationBudget)}</strong></div><a href="${href}" aria-label="Ver destino ${item.name}">Ver destino ↗</a></div></div></article>`;
      }).join('');
      const query = new URLSearchParams(new FormData(form));
      query.set('orden', order);
      const anchor = ['#creditos-imagenes', '#catalogo'].includes(location.hash) ? location.hash : '';
      // Entrar a Destinos conserva el comienzo de la página; solo un ancla explícita salta al catálogo.
      try { history.replaceState(null, '', `viajes.html?pantalla=destinos&${query}${anchor}`); } catch (_) { /* Navegación local. */ }
    }
    function reset() { form.reset(); $('#orden-destinos').value = 'recommended'; render(); }
    form.addEventListener('submit', event => { event.preventDefault(); render(); });
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    $('#orden-destinos').addEventListener('change', render);
    $('#limpiar-destinos').addEventListener('click', reset);
    $('#restablecer-destinos').addEventListener('click', reset);
    refreshPage = render;
    render();
    const credits = $('#creditos-imagenes');
    function openCredits() {
      if (credits && location.hash === '#creditos-imagenes') credits.open = true;
    }
    window.addEventListener('hashchange', openCredits);
    openCredits();
  }

  // 2. DETALLE: información y datos iniciales del viaje.
  function initDetail() {
    refreshPage = initDetail;
    const destination = currentDestination();
    document.title = `${destination.name} | Rumbo`;
    $('#destination-detail').innerHTML = `<nav class="rv-breadcrumb" aria-label="Ruta de navegación"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><a href="viajes.html?pantalla=destinos">Destinos</a><span aria-hidden="true">/</span><span aria-current="page">${destination.name}</span></nav>
      <section class="rv-detail-hero" aria-labelledby="page-title"><img src="${destination.image}" alt="${destination.alt}" width="1100" height="760"><div class="rv-detail-title"><p class="rv-card-country">${destination.country} · ${destination.tag}</p><h1 id="page-title">${destination.name}</h1><p>${destination.intro}</p></div></section>
      <div class="rv-detail-body"><section class="rv-detail-copy"><p class="eyebrow">UN POCO DE INSPIRACIÓN</p><h2>Lo que te espera.</h2><p>${destination.description}</p><ul class="rv-highlight-list">${destination.highlights.map(item => `<li><span aria-hidden="true">↗</span>${item}</li>`).join('')}</ul><div class="rv-tip"><strong>Para organizarte</strong>${destination.tip}</div><p><a class="rv-link-button" href="servicios.html?seccion=guias&destino=${destination.id}">Explorar recorridos con guía en ${destination.name} ↗</a></p>${destination.transfer ? `<p class="rv-notice">${destination.transfer}</p>` : ''}<p class="rv-caption">Fotografía de inspiración. Las actividades se presentan como ideas y no están incluidas en los precios de vuelo u hotel.</p></section>
      <aside class="rv-plan-panel" aria-labelledby="detail-plan-title"><p class="eyebrow">DA EL PRIMER PASO</p><h2 id="detail-plan-title">Tu escapada a ${destination.name}</h2>${destination.promotion ? `<p class="promo-badge">−${destination.promotion.percent}% en vuelos · descuento aplicado</p>` : ''}<p class="rv-detail-price">Vuelo desde ${destination.promotion ? `<del class="promo-original">${money(destination.economy)}</del>` : ''}<strong>${money(flights(destination, 'Tegucigalpa')[0]?.economy ?? destination.economy)}</strong></p>${destination.promotion ? '<p class="promo-note">Aplica a vuelos de ida, en ambas clases y orígenes del catálogo. Sin cupón. Hotel y otros servicios por separado. Oferta de demostración de Rumbo; no se transfiere a la aerolínea.</p>' : ''}<p class="rv-caption" style="margin: -8px 0 22px">Por persona · económica · solo ida desde Tegucigalpa.</p>
      <form id="detail-form"><div class="rv-field"><label for="detail-date">Fecha de salida</label><input id="detail-date" type="date" value="${state.date}" min="${today()}" required></div><div class="rv-field-pair"><div class="rv-field"><label for="detail-travelers">Viajeros</label><input id="detail-travelers" type="number" value="${state.travelers}" min="1" max="12" step="1" required></div><div class="rv-field"><label for="detail-nights">Noches de hotel</label><input id="detail-nights" type="number" value="${state.nights}" min="1" max="30" step="1" required></div></div><button class="button button-primary" type="submit" name="next" value="vuelos">Elegir vuelo <span aria-hidden="true">↗</span></button><button class="rv-link-button" type="submit" name="next" value="hoteles">Solo necesito hotel →</button></form></aside></div>`;
    $('#detail-form').addEventListener('submit', event => {
      event.preventDefault();
      updateTrip({ date: $('#detail-date').value, travelers: Number($('#detail-travelers').value), nights: Number($('#detail-nights').value) });
      if (event.submitter?.value === 'hoteles') { state.flightId = ''; persist(); window.RumboJourney?.skipFlight(); }
      location.href = link(event.submitter?.value === 'hoteles' ? 'hoteles' : 'vuelos');
    });
  }

  // RESUMEN COMPARTIDO: suma únicamente los servicios seleccionados.
  function summaryParts() {
    const flight = currentFlight();
    const hotel = currentHotel();
    const flightTotal = flight ? flightRate(flight) * state.travelers : 0;
    const hotelTotal = hotel ? rate(hotel) * state.nights * state.rooms : 0;
    const flightHTML = flight ? `<p><strong>${state.origin} → ${currentDestination().arrival}</strong></p><p>${flight.airline.name} · ${flight.code} · simulación</p><p>${formatDate(state.date)} · ${flight.departure} · ${state.cabin === 'economica' ? 'Económica' : 'Ejecutiva'}</p>${flight.discountPercent ? `<p class="promo-note">Descuento ${flight.discountPercent}% aplicado${flight.groupDiscount ? ' (incluye grupo)' : ''} · ahorras ${money(((state.cabin === 'ejecutiva' ? flight.baseExecutive : flight.baseEconomy) - flightRate(flight)) * state.travelers)}</p>` : ''}<p>${money(flightRate(flight))} × ${state.travelers} ${state.travelers === 1 ? 'pasajero' : 'pasajeros'}</p><a href="${flight.airline.url}" target="_blank" rel="noopener noreferrer">Consultar aerolínea ↗</a><div class="rv-summary-line"><span>Vuelo de ida</span><strong>${money(flightTotal)}</strong></div>` : '<p>Sin vuelo seleccionado.</p>';
    const hotelHTML = hotel ? `<p><strong>${hotel.name} · ${rooms[state.roomType].name}</strong></p><p>${formatDate(state.checkIn)} → ${formatDate(addDays(state.checkIn, state.nights))}</p><p>${state.travelers} ${state.travelers === 1 ? 'huésped' : 'huéspedes'} · ${state.rooms} ${state.rooms === 1 ? 'habitación' : 'habitaciones'}</p><p>${money(rate(hotel))} × ${state.nights} noches × ${state.rooms} hab.</p><div class="rv-summary-line"><span>Hospedaje</span><strong>${money(hotelTotal)}</strong></div>` : '<p>Sin hotel seleccionado.</p>';
    return { flight, hotel, total: flightTotal + hotelTotal, flightHTML, hotelHTML };
  }
  function renderSummary(mode, afterClear) {
    const element = $('#resumen-viaje');
    const destination = currentDestination();
    const parts = summaryParts();
    element.innerHTML = `<p class="eyebrow">A TU MEDIDA</p><h2>Tu próximo rumbo</h2><div class="rv-summary-destination"><img src="${destination.image}" alt="" width="59" height="62"><div><strong>${destination.name}</strong><small>${destination.country}</small></div></div>
      <div class="rv-summary-part"><h3>01 / Vuelo ${mode === 'hoteles' ? `<a href="${escapeHTML(link('vuelos'))}">${parts.flight ? 'Cambiar' : 'Elegir'}</a>` : ''}</h3>${parts.flightHTML}</div>
      <div class="rv-summary-part"><h3>02 / Hotel</h3>${parts.hotelHTML}</div>
      <div class="rv-summary-total"><span>Subtotal elegido</span><strong id="summary-total" data-amount="${parts.total}" aria-live="polite">${money(parts.total)}</strong></div>
      <p class="rv-caption">Suma de las opciones elegidas. Actividades y traslados no incluidos.</p>
      ${mode === 'vuelos' ? `<button class="button button-primary" id="continue-hotel" type="button" ${parts.flight ? '' : 'disabled'}>Elegir hotel ↗</button><a class="rv-link-button rv-summary-clear" href="${escapeHTML(link('hoteles', { flightId: '' }))}">Continuar solo con hotel →</a>` : `<button class="button button-primary" id="save-selection" type="button" ${parts.hotel ? '' : 'disabled'}>Continuar a transporte →</button>`}
      ${parts.flight || parts.hotel ? '<button class="rv-link-button rv-summary-clear" id="clear-selection" type="button">Quitar selecciones</button>' : ''}`;
    $('#continue-hotel')?.addEventListener('click', () => { location.href = link('hoteles'); });
    $('#save-selection')?.addEventListener('click', () => {
      persist();
      location.href = 'servicios.html?seccion=traslados';
    });
    $('#clear-selection')?.addEventListener('click', () => {
      state.flightId = ''; state.hotelId = ''; persist(); afterClear(); toast('Se quitaron el vuelo y el hotel de tu selección.');
    });
  }

  // Desactiva selecciones antiguas cuando hay datos editados sin aplicar.
  function bindSearchForm(form, apply, noticeSelector, mode) {
    function markDirty() {
      document.querySelectorAll('[data-select-flight], [data-select-hotel]').forEach(button => { button.disabled = true; });
      const next = mode === 'vuelos' ? $('#continue-hotel') : $('#save-selection');
      if (next) next.disabled = true;
      $(noticeSelector).textContent = 'Aplica los cambios con el botón Actualizar para ver los nuevos resultados.';
      form.dataset.dirty = 'true';
    }
    form.addEventListener('input', markDirty);
    form.addEventListener('change', () => {
      markDirty();
      if (form.checkValidity()) form.requestSubmit();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.dataset.dirty = 'false';
      apply();
    });
  }

  // 3. VUELOS: horarios de ejemplo, clase y precio para todos los pasajeros.
  function initFlights() {
    const form = $('#flight-search');
    $('#flight-destination').innerHTML = destinationOptions();
    $('#flight-origin').innerHTML = origins.map(item => `<option>${item}</option>`).join('');
    function fillForm() {
      $('#flight-destination').value = state.destinationId;
      $('#flight-origin').value = state.origin;
      $('#flight-date').value = state.date;
      $('#flight-date').min = today();
      $('#flight-travelers').value = state.travelers;
      $('#flight-cabin').value = state.cabin;
    }
    function render() {
      const destination = currentDestination();
      const options = flights(destination, state.origin, state.travelers);
      if ($('#flight-sort').value === 'price-low') options.sort((a, b) => flightRate(a) - flightRate(b));
      if ($('#flight-sort').value === 'time') options.sort((a, b) => a.departure.localeCompare(b.departure));
      $('#flight-result-title').textContent = `${state.origin} → ${destination.arrival}`;
      $('#flight-results-meta').textContent = `${options.length} opciones · ${formatDate(state.date)} · ${state.travelers} ${state.travelers === 1 ? 'pasajero' : 'pasajeros'}`;
      $('#flight-transfer').textContent = `Aeropuerto de llegada: ${destination.airport.name} (${destination.airport.code}). La existencia del aeropuerto no garantiza vuelos directos ni disponibilidad para estas fechas. ${destination.transfer}`;
      $('#flight-transfer').hidden = false;
      $('#flight-form-notice').textContent = [destination.promotion ? `${destination.promotion.percent}% por destino.` : '', state.travelers >= 3 ? '5% adicional por grupo aplicado sobre la tarifa rebajada.' : 'Desde 3 pasajeros: 5% adicional en vuelos.', 'Válido para 3 a 12 pasajeros, ambas clases. Hotel y servicios aparte. Tarifas de demostración.'].filter(Boolean).join(' ');
      $('#flight-list').innerHTML = options.length ? options.map((flight, index) => {
        const end = arrival(flight);
        const selected = state.flightId === flight.id;
        return `<article class="rv-flight-card" data-selected="${selected}" aria-label="Vuelo ${flight.code}">
          <div class="rv-flight-top"><div class="rv-flight-name"><span class="rv-plane-icon" aria-hidden="true">✈</span><div><strong>${flight.airline.name}</strong><small>Referencia ${flight.code} · no es número de vuelo</small></div></div><span class="rv-badge">Boleto de muestra</span></div>
          <div class="rv-ticket-details"><span><small>Fecha de salida</small><strong>${formatDate(state.date)}</strong></span><span><small>Pasajeros</small><strong>${state.travelers}</strong></span><span><small>Clase</small><strong>${state.cabin === 'economica' ? 'Económica' : 'Ejecutiva'}</strong></span></div>
          <div class="rv-flight-timing"><div class="rv-time"><strong>${flight.departure}</strong><small>${state.origin}</small></div><div class="rv-flight-line"><span>${duration(flight.minutes)}</span><div aria-hidden="true"></div><span>${flight.stops}</span></div><div class="rv-time"><strong>${end.time}${end.days ? `<sup> +${end.days} d</sup>` : ''}</strong><small>${destination.arrival}</small></div></div>
          <div class="rv-airline-booking"><a href="${flight.airline.url}" target="_blank" rel="noopener noreferrer">Consultar en ${flight.airline.name} ↗<span class="sr-only"> (abre una pestaña nueva)</span></a><p>Horario, ruta, equipaje y precio simulados. Consulta rutas y disponibilidad en el sitio oficial; tus selecciones no se transfieren y este boleto no permite abordar.</p></div>
          <div class="rv-flight-bottom"><p>${state.cabin === 'economica' ? 'Económica<br>Equipaje de mano' : 'Ejecutiva<br>Mano + una maleta'}<br>${end.days ? `Llegada: ${formatDate(addDays(state.date, end.days))}` : 'Llegada el mismo día'}</p><div class="rv-price">${flight.discountPercent ? `<span class="promo-badge">−${flight.discountPercent}% aplicado</span><del class="promo-original">${money(state.cabin === 'ejecutiva' ? flight.baseExecutive : flight.baseEconomy)}</del>` : ''}<strong>${money(flightRate(flight))}</strong><small>Por persona · solo ida</small><small>${money(flightRate(flight) * state.travelers)} por ${state.travelers} ${state.travelers === 1 ? 'pasajero' : 'pasajeros'}</small></div><button class="rv-select-button" type="button" data-select-flight="${flight.id}" aria-pressed="${selected}" aria-label="${selected ? 'Vuelo seleccionado' : 'Seleccionar vuelo'} ${flight.code} de las ${flight.departure}">${selected ? 'Seleccionado ✓' : 'Elegir vuelo'}</button></div></article>`;
      }).join('') : `<div class="rv-empty"><h3>Ya sales de la ciudad de conexión.</h3><p>Desde ${state.origin}, este viaje continúa por tierra hacia ${destination.name}. El traslado no está incluido.</p><a class="button button-primary" href="${escapeHTML(link('hoteles', { flightId: '' }))}">Elegir hotel ↗</a></div>`;
      renderSummary('vuelos', render);
      updateNavigation();
    }
    refreshPage = () => { fillForm(); render(); };
    fillForm(); render();
    bindSearchForm(form, () => {
      const newId = $('#flight-destination').value;
      const changingDestination = newId !== state.destinationId;
      updateTrip({
        destinationId: newId, origin: $('#flight-origin').value, date: $('#flight-date').value,
        travelers: Number($('#flight-travelers').value), cabin: $('#flight-cabin').value,
        ...(changingDestination ? { nights: destinationById(newId).nights, checkIn: $('#flight-date').value } : {})
      });
      fillForm(); render();
    }, '#flight-form-notice', 'vuelos');
    $('#flight-sort').addEventListener('change', () => {
      if (form.dataset.dirty === 'true') { form.requestSubmit(); return; }
      render();
    });
    $('#flight-list').addEventListener('click', event => {
      const button = event.target.closest('[data-select-flight]');
      if (!button || button.disabled || form.dataset.dirty === 'true') return;
      state.flightId = button.dataset.selectFlight;
      persist(); render();
      $(`[data-select-flight="${state.flightId}"]`)?.focus({ preventScroll: true });
      toast('Vuelo guardado. Continúa con el hospedaje.');
    });
  }

  // 4. HOTELES: tarifa × noches × habitaciones, con validación de capacidad.
  function initHotels() {
    const form = $('#hotel-search');
    const filters = $('#hotel-filters');
    const draftRoomTypes = {};
    $('#hotel-destination').innerHTML = destinationOptions();
    function fillForm() {
      $('#hotel-destination').value = state.destinationId;
      $('#hotel-date').value = state.checkIn;
      $('#hotel-date').min = earliestCheckIn();
      $('#hotel-nights').value = state.nights;
      $('#hotel-travelers').value = state.travelers;
      $('#hotel-rooms').value = state.rooms;
    }
    function chosenRoom(hotel) {
      return draftRoomTypes[hotel.id] || (hotel.id === state.hotelId ? state.roomType : 'estandar');
    }
    function render() {
      const destination = currentDestination();
      const stars = $('#hotel-stars').value;
      const maxInput = $('#hotel-max-price').value;
      const max = maxInput === '' ? Infinity : Math.max(0, Number(maxInput));
      const breakfast = $('#hotel-breakfast').checked;
      const dirty = form.dataset.dirty === 'true';
      let results = destination.hotels.filter(hotel =>
        (stars === 'all' || hotel.stars >= Number(stars)) &&
        rate(hotel, chosenRoom(hotel)) <= max &&
        (!breakfast || hotel.amenities.includes('Desayuno'))
      );
      if ($('#hotel-sort').value === 'price-low') results.sort((a, b) => rate(a, chosenRoom(a)) - rate(b, chosenRoom(b)));
      if ($('#hotel-sort').value === 'stars') results.sort((a, b) => b.stars - a.stars);
      $('#hotel-result-title').textContent = `Tu estancia en ${destination.name}`;
      $('#hotel-results-meta').textContent = `${results.length} ${results.length === 1 ? 'hotel' : 'hoteles'} · ${state.nights} ${state.nights === 1 ? 'noche' : 'noches'} · ${state.rooms} ${state.rooms === 1 ? 'habitación' : 'habitaciones'} · ${state.travelers} ${state.travelers === 1 ? 'huésped' : 'huéspedes'}`;
      if (!dirty) $('#hotel-form-notice').textContent = `Salida del hotel: ${formatDate(addDays(state.checkIn, state.nights))}. Cada habitación tiene una capacidad según su tipo.`;
      $('#hotel-empty').hidden = results.length !== 0;
      $('#hotel-list').innerHTML = results.map(hotel => {
        const type = chosenRoom(hotel);
        const nightly = rate(hotel, type);
        const selected = hotel.id === state.hotelId && type === state.roomType;
        const enoughSpace = rooms[type].capacity * state.rooms >= state.travelers;
        return `<article class="rv-hotel-card" data-selected="${selected}"><img class="rv-hotel-photo" src="imagenes-viajes/${hotel.image}" alt="${escapeHTML(hotel.imageAlt || 'Fotografía de referencia de un alojamiento')}" width="700" height="700" loading="lazy">
          <div class="rv-hotel-content"><p class="rv-stars" aria-label="${hotel.stars} estrellas de demostración">${'★'.repeat(hotel.stars)}</p><h3>${hotel.name}</h3><p class="rv-hotel-location">${destination.name} · ${hotel.area}</p><p class="rv-demo-caption">Hospedaje de demostración · fotografía de referencia</p><ul class="rv-amenities" aria-label="Servicios">${hotel.amenities.map(item => `<li>${item}</li>`).join('')}</ul>
          <div class="rv-field rv-room-choice"><label for="room-${hotel.id}">Tipo de habitación en ${hotel.name}</label><select id="room-${hotel.id}" data-room-hotel="${hotel.id}">${Object.entries(rooms).map(([key, room]) => `<option value="${key}" ${key === type ? 'selected' : ''}>${room.name} · hasta ${room.capacity} personas / hab.</option>`).join('')}</select></div>
          <div class="rv-hotel-price-row"><div class="rv-price"><strong>${money(nightly)}</strong><small>Por noche / habitación</small></div><button class="rv-select-button" type="button" data-select-hotel="${hotel.id}" aria-pressed="${selected}" aria-label="${selected ? 'Hotel seleccionado' : 'Seleccionar'} ${hotel.name}" ${!enoughSpace || dirty ? 'disabled' : ''}>${selected ? 'Seleccionado ✓' : 'Elegir hotel'}</button></div><p class="rv-hotel-total">${state.nights} ${state.nights === 1 ? 'noche' : 'noches'} × ${state.rooms} ${state.rooms === 1 ? 'habitación' : 'habitaciones'} · <strong>${money(nightly * state.nights * state.rooms)}</strong></p>
          ${enoughSpace ? '' : `<p class="rv-capacity-error">Para ${state.travelers} personas necesitas al menos ${Math.ceil(state.travelers / rooms[type].capacity)} habitaciones de este tipo, o elegir otra capacidad.</p>`}</div></article>`;
      }).join('');
      renderSummary('hoteles', render);
      if (dirty) $('#save-selection').disabled = true;
      updateNavigation();
    }
    refreshPage = () => {
      for (const key of Object.keys(draftRoomTypes)) delete draftRoomTypes[key];
      fillForm(); render();
    };
    fillForm(); render();
    bindSearchForm(form, () => {
      const newId = $('#hotel-destination').value;
      const changingDestination = newId !== state.destinationId;
      updateTrip({
        destinationId: newId, checkIn: $('#hotel-date').value,
        nights: Number($('#hotel-nights').value), rooms: Number($('#hotel-rooms').value), travelers: Number($('#hotel-travelers').value)
      });
      if (changingDestination) { for (const key of Object.keys(draftRoomTypes)) delete draftRoomTypes[key]; filters.reset(); }
      fillForm(); render();
    }, '#hotel-form-notice', 'hoteles');
    filters.addEventListener('submit', event => { event.preventDefault(); render(); });
    filters.addEventListener('input', render);
    filters.addEventListener('change', render);
    filters.addEventListener('reset', () => setTimeout(render, 0));
    $('#hotel-reset-empty').addEventListener('click', () => filters.reset());
    $('#hotel-list').addEventListener('change', event => {
      const select = event.target.closest('[data-room-hotel]');
      if (!select) return;
      const hotelId = select.dataset.roomHotel;
      draftRoomTypes[hotelId] = select.value;
      if (state.hotelId === hotelId) {
        state.roomType = select.value; persist();
        if (!state.hotelId) toast('Elige más habitaciones o un tipo con capacidad suficiente.');
      }
      render(); $(`#room-${hotelId}`)?.focus({ preventScroll: true });
    });
    $('#hotel-list').addEventListener('click', event => {
      const button = event.target.closest('[data-select-hotel]');
      if (!button || button.disabled || form.dataset.dirty === 'true') return;
      const hotel = currentDestination().hotels.find(item => item.id === button.dataset.selectHotel);
      if (!hotel) return;
      const type = chosenRoom(hotel);
      state.hotelId = hotel.id; state.roomType = type;
      persist(); render();
      $(`[data-select-hotel="${hotel.id}"]`)?.focus({ preventScroll: true });
      toast('Hospedaje guardado. Continúa a transporte.');
    });
  }

  // Activa el comportamiento correspondiente a cada página de viajes.
  const activeNav = page === 'detalle-destino' ? 'destinos' : page;
  document.querySelector(`[data-nav="${activeNav}"]`)?.setAttribute('aria-current', 'page');
  document.querySelector(`[data-step="${page}"]`)?.setAttribute('aria-current', 'step');
  if (invalidDestination && page !== 'destinos') { notFound(); return; }
  persist(false);
  if (page === 'destinos') initDestinations();
  if (page === 'detalle-destino') initDetail();
  if (page === 'vuelos') initFlights();
  if (page === 'hoteles') initHotels();
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    try {
      const latest = JSON.parse((window.RumboStorage || localStorage).getItem(STORAGE_KEY) || '{}');
      if (latest.destinationId !== state.destinationId) return;
      for (const key of Object.keys(fields)) if (latest[key] !== undefined) state[key] = latest[key];
      persist(); refreshPage();
    } catch (_) { /* La selección actual sigue disponible en la página. */ }
  });
})();

/* Conexiones con el inicio.
   Se ejecutan después del código principal. Los buscadores, el carrusel,
   el orientador y la descarga del pase conservan su funcionamiento.
   Solo los accesos de destinos, vuelos y hospedaje abren este módulo. */
(() => {
  'use strict';

  function connectHome() {
    const search = document.getElementById('travel-search');
    const track = document.getElementById('destinations-track');
    if (!search || !track) return;

    const destinations = window.RumboViajesDatos.destinations;
    const normalize = value => String(value).normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    const findDestination = name => destinations.find(item => normalize(item.name) === normalize(name));
    const boardingPass = document.getElementById('boarding-pass');

    // Lee únicamente los datos que el orientador ya muestra en el pase.
    function readPass() {
      if (!boardingPass?.classList.contains('is-ready')) return null;
      const id = document.getElementById('pass-destination-select').value;
      const destination = destinations.find(item => item.id === id);
      const company = document.getElementById('plan-company').textContent;
      const match = company.match(/·\s*(\d+)\s+personas?/);
      const travelers = match ? Number(match[1]) : 1;
      return destination ? { destination, travelers } : null;
    }

    function tripURL(view, destination, pass) {
      const query = new URLSearchParams({ pantalla: view });
      if (destination) query.set('destino', destination.id);
      if (destination && pass) {
        query.set('viajeros', pass.travelers);
        query.set('noches', destination.nights);
        query.set('habitaciones', Math.ceil(pass.travelers / 2));
        query.set('clase', 'economica');
        query.set('origen', 'Tegucigalpa');
        query.set('tipoHabitacion', 'estandar');
        query.set('vuelo', '');
        query.set('hotel', '');
        query.set('entrada', '');
      }
      return `viajes.html?${query}`;
    }

    // Conecta los botones que antes mostraban la información provisional.
    // La delegación también funciona después de filtrar o mover el carrusel.
    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      const service = event.target.closest('[data-module="flights"], [data-module="stays"]');
      const cardButton = event.target.closest('#destinations-track .circle-link');
      if (!service && !cardButton) return;

      const pass = readPass();
      const destination = cardButton
        ? findDestination(cardButton.closest('.destination-card').querySelector('h3').textContent)
        : findDestination(document.getElementById('destination').value) || pass?.destination;
      if (cardButton && !destination) return;
      const view = cardButton ? 'detalle-destino' : service.dataset.module === 'flights' ? 'vuelos' : 'hoteles';
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = tripURL(view, destination, pass);
    }, true);

    // Estos accesos ahora navegan a otra página, en lugar de abrir un diálogo.
    document.querySelectorAll('[data-module="flights"], [data-module="stays"]').forEach(button => {
      button.removeAttribute('aria-haspopup');
    });
    function updateCardButtons() {
      track.querySelectorAll('.circle-link').forEach(button => button.removeAttribute('aria-haspopup'));
    }
    updateCardButtons();
    new MutationObserver(updateCardButtons).observe(track, { childList: true });

    // Conserva el ajuste para evitar sugerencias guardadas de otros formularios.
    search.autocomplete = 'off';
    document.getElementById('destination').autocomplete = 'off';

    // Añade una continuación al pase sin cambiar las recomendaciones del equipo.
    function updatePassLinks() {
      const pass = readPass();
      document.getElementById('rv-pass-services').hidden = !pass;
      if (!pass) return;
      document.getElementById('rv-pass-flight').href = tripURL('vuelos', pass.destination, pass);
      document.getElementById('rv-pass-hotel').href = tripURL('hoteles', pass.destination, pass);
    }
    if (boardingPass) {
      updatePassLinks();
      new MutationObserver(updatePassLinks).observe(boardingPass, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['class']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', connectHome, { once: true });
  } else {
    connectHome();
  }
})();
