/* INTEGRANTE 2
   1. Catálogo y tarifas de demostración.
   2. Vistas de destinos, detalle, vuelos y hoteles.
   3. Conexiones con el inicio, conservando js/inicio/script.js del equipo.
*/

/* INTEGRANTE 2 · Catálogo de demostración.
   Aquí se pueden cambiar destinos, horarios y precios sin tocar el inicio.
   Todos los importes están en lempiras. No son tarifas ni reservas reales. */
(() => {
  'use strict';

  const destinations = [
    {
      id: 'roatan', name: 'Roatán', country: 'Honduras', region: 'honduras',
      type: 'playa', tag: 'Playa y descanso', image: 'imagenes-viajes/destinos/playa.jpg',
      alt: 'Playa tropical de aguas claras, fotografía de inspiración',
      intro: 'Playas de West Bay y West End, manglares y recorridos por la isla.',
      description: 'Roatán es una opción para disfrutar del Caribe hondureño. Combina tiempo en la playa con paseos por la isla y actividades en el mar, según tus gustos.',
      highlights: ['Disfrutar de la playa', 'Explorar la isla', 'Conocer la gastronomía local'],
      tip: 'Confirma el traslado entre las zonas de la isla y el punto de encuentro del recorrido.',
      arrival: 'Roatán', transfer: '', nights: 3, economy: 3200, duration: 55,
      hotels: [
        { id: 'paradise', name: 'Hotel Paradise', stars: 4, area: 'Zona de playa', rate: 1500, image: 'hoteles/hotel-playa.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] },
        { id: 'brisa', name: 'Brisa del Caribe', stars: 3, area: 'Cerca del centro', rate: 1200, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Aire acondicionado'] },
        { id: 'coral', name: 'Coral Boutique', stars: 5, area: 'Frente al mar', rate: 2600, image: 'hoteles/hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] }
      ]
    },
    {
      id: 'la-ceiba', name: 'La Ceiba', country: 'Honduras', region: 'honduras',
      type: 'naturaleza', tag: 'Naturaleza y aventura', image: 'imagenes-viajes/destinos/naturaleza.jpg',
      alt: 'Paisaje natural con vegetación, fotografía de inspiración',
      intro: 'El punto de partida para una escapada entre naturaleza y costa.',
      description: 'La Ceiba reúne vida de ciudad, costa y opciones de aventura en sus alrededores. Puedes organizar una estancia tranquila o dedicar tiempo a conocer sus paisajes naturales.',
      highlights: ['Pasear por la costa', 'Planear un recorrido por la naturaleza', 'Probar sabores locales'],
      tip: 'Lleva calzado cómodo si incluyes recorridos por senderos.',
      arrival: 'La Ceiba', transfer: '', nights: 3, economy: 2400, duration: 45,
      hotels: [
        { id: 'rio', name: 'Hotel Río Verde', stars: 3, area: 'Zona natural', rate: 950, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Estacionamiento'] },
        { id: 'palmas', name: 'Las Palmas Lodge', stars: 4, area: 'Alrededores de la ciudad', rate: 1450, image: 'hoteles/hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] },
        { id: 'bahia', name: 'Bahía Serena', stars: 4, area: 'Zona de costa', rate: 1850, image: 'hoteles/hotel-playa.jpg', amenities: ['Piscina', 'Wi-Fi'] }
      ]
    },
    {
      id: 'copan', name: 'Copán Ruinas', country: 'Honduras', region: 'honduras',
      type: 'cultura', tag: 'Cultura e historia', image: 'imagenes-viajes/destinos/cultura.jpg',
      alt: 'Ruinas mayas de Copán entre árboles, fotografía de Mónica J. Mora',
      intro: 'Historia maya, calles para caminar y días sin prisa.',
      description: 'Copán Ruinas invita a conocer la historia maya y disfrutar de un pueblo con espacios para pasear, comer y descansar. Puedes combinar visitas culturales con recorridos por sus alrededores.',
      highlights: ['Conocer el sitio arqueológico', 'Caminar por el pueblo', 'Explorar los alrededores'],
      tip: 'Reserva tiempo para el traslado terrestre desde la ciudad de llegada.',
      arrival: 'San Pedro Sula', transfer: 'El vuelo llega a San Pedro Sula. El traslado terrestre a Copán Ruinas no está incluido.',
      nights: 2, economy: 2100, duration: 40,
      hotels: [
        { id: 'patio', name: 'Hotel Patio Maya', stars: 3, area: 'Zona del pueblo', rate: 850, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'jardin', name: 'Jardín de Copán', stars: 4, area: 'Alrededores del pueblo', rate: 1350, image: 'hoteles/hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Estacionamiento'] },
        { id: 'loma', name: 'La Loma Boutique', stars: 4, area: 'Zona tranquila', rate: 1700, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] }
      ]
    },
    {
      id: 'bali', name: 'Bali', country: 'Indonesia', region: 'internacional',
      type: 'playa', tag: 'Playa y calma', image: 'imagenes-viajes/destinos/bali.jpg',
      alt: 'Templo junto al agua en Bali',
      intro: 'Templos de Tanah Lot y Uluwatu, arrozales de Ubud y costa de Sanur.',
      description: 'Bali combina paisajes de playa con espacios culturales y zonas de vegetación. Organiza el viaje por áreas para dedicar más tiempo a las experiencias que te interesan.',
      highlights: ['Conocer templos', 'Recorrer paisajes de arrozales', 'Descansar cerca del mar'],
      tip: 'Distribuye las actividades por zonas y contempla tiempo para desplazarte.',
      arrival: 'Bali', transfer: '', nights: 7, economy: 28500, duration: 1630,
      hotels: [
        { id: 'loto', name: 'Jardín de Loto', stars: 3, area: 'Zona de jardines', rate: 1700, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'ubud', name: 'Verde Retreat', stars: 4, area: 'Entorno natural', rate: 2300, image: 'hoteles/hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] },
        { id: 'oceano', name: 'Océano Resort', stars: 5, area: 'Zona de playa', rate: 3400, image: 'hoteles/hotel-playa.jpg', amenities: ['Piscina', 'Wi-Fi'] }
      ]
    },
    {
      id: 'dolomitas', name: 'Dolomitas', country: 'Italia', region: 'internacional',
      type: 'naturaleza', tag: 'Aire libre', image: 'imagenes-viajes/destinos/dolomitas.jpg',
      alt: 'Cumbres rocosas entre nubes, fotografía de inspiración',
      intro: 'Senderos, lagos y una buena razón para salir de la rutina.',
      description: 'Las Dolomitas ofrecen una experiencia centrada en la montaña. Elige una base para alojarte y organiza recorridos acordes con tus preferencias y el tiempo disponible.',
      highlights: ['Contemplar paisajes de montaña', 'Explorar senderos', 'Conocer pueblos de la zona'],
      tip: 'Elige recorridos adecuados a tu experiencia y revisa las condiciones antes de salir.',
      arrival: 'Venecia', transfer: 'El vuelo llega a Venecia. El traslado a las Dolomitas se organiza por separado y no está incluido.',
      nights: 5, economy: 22500, duration: 1050,
      hotels: [
        { id: 'alpino', name: 'Refugio Alpino', stars: 3, area: 'Pueblo de montaña', rate: 2200, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'valle', name: 'Valle Sereno', stars: 4, area: 'Zona de montaña', rate: 3100, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Estacionamiento'] },
        { id: 'cumbres', name: 'Cumbres Boutique', stars: 5, area: 'Entorno natural', rate: 4200, image: 'hoteles/hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] }
      ]
    },
    {
      id: 'kioto', name: 'Kioto', country: 'Japón', region: 'internacional',
      type: 'cultura', tag: 'Cultura y ciudad', image: 'imagenes-viajes/destinos/kioto.jpg',
      alt: 'Calle tradicional de Kioto con una pagoda al fondo',
      intro: 'Calles con historia, jardines y nuevos sabores por descubrir.',
      description: 'Kioto es un destino para conocer espacios tradicionales, jardines y barrios con identidad propia. Combina tus visitas con momentos para caminar y descubrir la ciudad.',
      highlights: ['Visitar templos y jardines', 'Pasear por calles tradicionales', 'Descubrir la gastronomía'],
      tip: 'Agrupa las visitas cercanas para aprovechar mejor cada día.',
      arrival: 'Osaka', transfer: 'El vuelo llega a Osaka. El traslado a Kioto no está incluido.',
      nights: 9, economy: 33000, duration: 1530,
      hotels: [
        { id: 'sakura', name: 'Casa Sakura', stars: 3, area: 'Zona urbana', rate: 1900, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi'] },
        { id: 'bambu', name: 'Jardín de Bambú', stars: 4, area: 'Zona tranquila', rate: 2750, image: 'hoteles/hotel-habitacion.jpg', amenities: ['Wi-Fi', 'Desayuno'] },
        { id: 'luna', name: 'Luna de Kioto', stars: 5, area: 'Zona céntrica', rate: 3900, image: 'hoteles/hotel-piscina.jpg', amenities: ['Piscina', 'Wi-Fi', 'Desayuno'] }
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
    ['panama','Ciudad de Panamá','Panamá','cultura','Ciudad de Panamá',4,6500,160,1850,'Casco Antiguo, Cerro Ancón y Parque Natural Metropolitano.'],
    ['cancun','Cancún','México','playa','Cancún',5,7200,210,2300,'Playa Delfines, laguna Nichupté y sitio arqueológico El Rey.'],
    ['miami','Miami','Estados Unidos','playa','Miami',4,8200,180,2900,'South Beach, Little Havana y jardines de Vizcaya.'],
    ['madrid','Madrid','España','cultura','Madrid',6,19500,840,2400,'Parque de El Retiro, Plaza Mayor y mercados del centro.']
  ];
  additions.forEach(([id,name,country,type,arrival,nights,economy,duration,base,intro]) => {
    const nature = type === 'naturaleza';
    destinations.push({
      id,name,country,region:country==='Honduras'?'honduras':'internacional',type,
      tag:type==='playa'?'Playa y descanso':nature?'Naturaleza y aventura':'Cultura y ciudad',
      image:`imagenes-viajes/destinos/destino-${id}.jpg`,
      alt:`Vista de ${name}; fotografía de Wikimedia Commons`,
      intro,description:intro+' Consulta las opciones de vuelo, hospedaje y recorridos con guía disponibles en el catálogo.',
      highlights:type==='playa'?['Paseos por la costa','Gastronomía local','Tiempo de descanso']:nature?['Contemplar paisajes','Recorridos al aire libre','Descanso en la naturaleza']:['Recorrer el centro','Conocer espacios culturales','Probar sabores locales'],
      tip:'Confirma traslados, horarios y disponibilidad con los proveedores antes de reservar.',
      arrival,transfer:arrival!==name?`Llegada aérea propuesta: ${arrival}. El traslado a ${name} se organiza por separado y no está incluido.`:'',
      nights,economy,duration,
      hotels:[
        {id:`${id}-esencial`,name:hotelNames[id][0],stars:3,area:'Zona urbana',rate:base,image:'hoteles/hotel-habitacion.jpg',amenities:['Wi-Fi','Aire acondicionado']},
        {id:`${id}-jardin`,name:hotelNames[id][1],stars:4,area:'Zona tranquila',rate:Math.round(base*1.3),image:'hoteles/hotel-piscina.jpg',amenities:['Piscina','Wi-Fi','Desayuno']},
        {id:`${id}-boutique`,name:hotelNames[id][2],stars:5,area:'Zona de descanso',rate:Math.round(base*1.8),image:type==='playa'?'hoteles/hotel-playa.jpg':'hoteles/hotel-habitacion.jpg',amenities:['Wi-Fi','Desayuno','Estacionamiento']}
      ]
    });
  });
  destinations.forEach(d => {
    const base = Math.min(...d.hotels.map(h=>h.rate));
    d.hotels.push(
      {id:`${d.id}-apartamentos`,name:hotelNames[d.id][3],stars:3,area:'Zona residencial',rate:Math.round(base*.85),image:'hoteles/hotel-habitacion.jpg',amenities:['Wi-Fi','Cocina','Estacionamiento']},
      {id:`${d.id}-terraza`,name:hotelNames[d.id][4],stars:4,area:'Zona tranquila',rate:Math.round(base*1.45),image:'hoteles/hotel-piscina.jpg',amenities:['Piscina','Wi-Fi','Desayuno']}
    );
  });

  const hotelPhotos = {
  "paradise": {
    "image": "hoteles/hotel-paradise.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "WiNG",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_Four_Seasons_Hotel_%26_Resort_Macau_Swimming_Pool_2009.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "brisa": {
    "image": "hoteles/hotel-brisa.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Basile Morin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Canopy_bed_of_Amantaka_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "coral": {
    "image": "hoteles/hotel-coral.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Dalyan,_Turkey_March_2022_-_Nish_Caria_Butik_Hotel_%26_Restaurant_-_Pool.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "roatan-apartamentos": {
    "image": "hoteles/hotel-roatan-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Marina Kuperman Villatoro",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Premier-hotel-bedroom_Huehuetenango_Guatemala.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "roatan-terraza": {
    "image": "hoteles/hotel-roatan-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Ian Cunliffe",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Talland_Bay_Hotel_and_swimming_pool_-_geograph.org.uk_-_1190750.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "rio": {
    "image": "hoteles/hotel-rio-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cerulean_Tower_Tokyu_Hotel_Sky_View_Floor_Deluxe_Single_bedroom_20160923-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "palmas": {
    "image": "hoteles/hotel-palmas-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Hiroshima_Moderate_Double_bedroom_20190928-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bahia": {
    "image": "hoteles/hotel-bahia.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Anass Sedrati",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Pool_-_Nicon_Hotel.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "la-ceiba-apartamentos": {
    "image": "hoteles/hotel-la-ceiba-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Anthony O'Neil",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom,_Bear_Hotel_(geograph_4847914).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "la-ceiba-terraza": {
    "image": "hoteles/hotel-la-ceiba-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Gary J. Wood from Toronto, ON, Canada",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Omni_Interlocken_Resort,_pool.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "patio": {
    "image": "hoteles/hotel-patio.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Curt Smith from Bellevue, WA, USA",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom,_H%C3%B4tel_d%27Abbaye,_Paris_May_2017.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "jardin": {
    "image": "hoteles/hotel-jardin.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Uxmal,_Yucatan,_Mexico_-_Swimming_pool,_Uxmal_Resort_Maya_2021.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "loma": {
    "image": "hoteles/hotel-loma.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "jjmusgrove",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Antigua_Guatemala_-_Fine_Hotel_Bedroom.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "copan-apartamentos": {
    "image": "hoteles/hotel-copan-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Trusty_Kanazawa_Korinbo_Superior_Single_bedroom_20131206-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "copan-terraza": {
    "image": "hoteles/hotel-copan-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Andy Gnias",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Roosevelt_from_the_hotel_pool.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "loto": {
    "image": "hoteles/hotel-loto.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "掬茶",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Single_bedroom_of_Hotel_Hokke_Club_Hakodate.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "ubud": {
    "image": "hoteles/hotel-ubud-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cross_Hotel_Kyoto_Superior_King_bedroom_20210724-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "oceano": {
    "image": "hoteles/hotel-oceano.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Thomas from Switzerland",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_pool_(6323259177).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "bali-apartamentos": {
    "image": "hoteles/hotel-bali-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "掬茶",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Single_bedroom_of_APA_Hotel_Hachinohe_Chuo.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bali-terraza": {
    "image": "hoteles/hotel-bali-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Monica Wong from New York City, NY, United States",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Infinity_Pool_at_the_Cancun_Caribe_Park_Royal_Grand_Hotel_%26_Resort.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "alpino": {
    "image": "hoteles/hotel-alpino.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bancroft_Hotel,_Berkeley,_California_-_Bedroom.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "valle": {
    "image": "hoteles/hotel-valle.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Bob Harvey",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_bedroom_-_geograph.org.uk_-_5280127.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "cumbres": {
    "image": "hoteles/hotel-cumbres-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_La_Raison_Osaka_Standard_Twin_bedroom_20161216-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "dolomitas-apartamentos": {
    "image": "hoteles/hotel-dolomitas-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Edit_Yokohama_Single_bedroom_20190714-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "dolomitas-terraza": {
    "image": "hoteles/hotel-dolomitas-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Kyoto_Ekimae_Corner_Twin_bedroom_20220205-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "sakura": {
    "image": "hoteles/hotel-sakura.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Kobe_Deluxe_Single_bedroom_20111122-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bambu": {
    "image": "hoteles/hotel-bambu.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "jjmusgrove",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Lake_Bedroom_Guatemala_2018.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "luna": {
    "image": "hoteles/hotel-luna.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Thomas from Switzerland",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_pool_with_view_over_the_valley_(6323256471).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "kioto-apartamentos": {
    "image": "hoteles/hotel-kioto-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Lotte_City_Hotel_Kinshicho_Elite_Single_bedroom_20140927-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "kioto-terraza": {
    "image": "hoteles/hotel-kioto-terraza.jpg",
    "imageAlt": "Fotografía de referencia de un hotel con piscina",
    "photoAuthor": "Jim Killock",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Thermal_Pool.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "utila-esencial": {
    "image": "hoteles/hotel-utila-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Sunroute_Ariake_Standard_Single_bedroom_20110603-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-jardin": {
    "image": "hoteles/hotel-utila-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hakodate_Kokusai_Hotel_Premium_Twin_bedroom_20201017-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-boutique": {
    "image": "hoteles/hotel-utila-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Tokyo_Oshiage_Single_bedroom_20160220-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-apartamentos": {
    "image": "hoteles/hotel-utila-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kobe_Portopia_Hotel_Oval_Club_single_bedroom_20130621-002.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "utila-terraza": {
    "image": "hoteles/hotel-utila-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Musashi-Kosugi_single_bedroom_20100618-001.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "tela-esencial": {
    "image": "hoteles/hotel-tela-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kyoto_Brighton_Hotel_Superior_Double_bedroom_20200823-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-jardin": {
    "image": "hoteles/hotel-tela-jardin-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Millennium_Mitsui_Garden_Hotel_Tokyo_Superior_Double_bedroom_20170318-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-boutique": {
    "image": "hoteles/hotel-tela-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Celestine_Hotel_Superior_Double_bedroom_20160501-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-apartamentos": {
    "image": "hoteles/hotel-tela-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kyoto_Century_Hotel_Kyo-Premium_bedroom_20210717-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "tela-terraza": {
    "image": "hoteles/hotel-tela-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Niwa_Tokyo_standard_bedroom_20131027-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-esencial": {
    "image": "hoteles/hotel-yojoa-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Tokyu_Bizfort_Kobe_Motomachi_single_bedroom_20120427-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-jardin": {
    "image": "hoteles/hotel-yojoa-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Kanazawa_Moderate_Double_bedroom_20200103-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-boutique": {
    "image": "hoteles/hotel-yojoa-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:ANA_Hotel_Okayama_Upper_Floor_Single_bedroom_20150809-002.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-apartamentos": {
    "image": "hoteles/hotel-yojoa-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Amalie_Deluxe_Twin_bedroom_20130531-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "yojoa-terraza": {
    "image": "hoteles/hotel-yojoa-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Piena_Kobe_Royal_Twin_bedroom_20141124-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-esencial": {
    "image": "hoteles/hotel-antigua-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Kyoto_Standard_Twin_bedroom_20130201-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-jardin": {
    "image": "hoteles/hotel-antigua-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Sendai_Standard_Single_B_bedroom_20100809-001.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "antigua-boutique": {
    "image": "hoteles/hotel-antigua-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Nishitetsu_Hotel_Croom_Hakata_Premium_Business_bedroom_20190413-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-apartamentos": {
    "image": "hoteles/hotel-antigua-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Associa_Takayama_Resort_Standard_Twin_bedroom_20170723-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "antigua-terraza": {
    "image": "hoteles/hotel-antigua-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Ginza_Premier_Moderate_bedroom_20151223-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "panama-esencial": {
    "image": "hoteles/hotel-panama-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Nick Anderson",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Waldorf_London_hotel_room.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "panama-jardin": {
    "image": "hoteles/hotel-panama-jardin-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_Gate_Hotel_Kaminarimon_Modest_Semi_Double_bedroom_20140928-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "panama-boutique": {
    "image": "hoteles/hotel-panama-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Mack Male from Edmonton, AB, Canada",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_hotel_room_(2342689366).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "panama-apartamentos": {
    "image": "hoteles/hotel-panama-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mitsui_Garden_Hotel_Osaka_Premier_Superior_bedroom_20140316-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "panama-terraza": {
    "image": "hoteles/hotel-panama-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Palickap",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Yerevan,_Silachi_Hotel,_room_2.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-esencial": {
    "image": "hoteles/hotel-cancun-esencial.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Huzaifakumo",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Gombe_International_Hotel_Room_2.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-jardin": {
    "image": "hoteles/hotel-cancun-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Kurt Kaiser",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_in_hotel_room.jpg",
    "photoLicense": "CC0",
    "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "cancun-boutique": {
    "image": "hoteles/hotel-cancun-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "OhanaUnitedTalk page",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Kuujjuarapik_Co-op_hotel_room_2.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-apartamentos": {
    "image": "hoteles/hotel-cancun-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Good_Nature_Hotel_Kyoto_Garden_View_Terrace_Double_bedroom_20200704-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "cancun-terraza": {
    "image": "hoteles/hotel-cancun-terraza-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cross_Hotel_Osaka_Comfort_Floor_twin_bedroom_20120217-001.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "miami-esencial": {
    "image": "hoteles/hotel-miami-esencial-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "J o",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotels_single_bedroom_20110806-001.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "miami-jardin": {
    "image": "hoteles/hotel-miami-jardin.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Casey And Sonja",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Congress_Plaza_Hotel_(Room)_(4347277667).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "miami-boutique": {
    "image": "hoteles/hotel-miami-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Douglas Muth from Philadelphia, PA, USA",
    "photoSource": "https://commons.wikimedia.org/wiki/File:My_Hotel_Room_(51750469535).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "miami-apartamentos": {
    "image": "hoteles/hotel-miami-apartamentos.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Andy Mitchell from Glasgow, UK",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Royal_Marine_Hotel_room_(3280716439).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "miami-terraza": {
    "image": "hoteles/hotel-miami-terraza.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Fredericknoronha",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Chandigarh,_India_starred_hotel_room_01.jpg",
    "photoLicense": "CC BY 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "madrid-esencial": {
    "image": "hoteles/hotel-madrid-esencial-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Bai Timan Lam SAREOYSEE",
    "photoSource": "https://commons.wikimedia.org/wiki/File:MC_%E6%BE%B3%E9%96%80_Hotel_Okura_Macau_%E5%A4%A7%E5%80%89%E9%85%92%E5%BA%97_bedroom_%E6%88%BF%E9%96%93_May_2018_LGM_01.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "madrid-jardin": {
    "image": "hoteles/hotel-madrid-jardin-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Tess Mattew",
    "photoSource": "https://commons.wikimedia.org/wiki/File:2025.07.13_Interior_bedroom_Hotel_Hlybokae_01.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "madrid-boutique": {
    "image": "hoteles/hotel-madrid-boutique.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "Sharon Hahn Darlin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:My_hotel_room_in_Heihe_for_179_yuan_%3D_US_$29!_(8809150032).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "madrid-apartamentos": {
    "image": "hoteles/hotel-madrid-apartamentos-ref.jpg",
    "imageAlt": "Fotografía de referencia de una habitación de hotel",
    "photoAuthor": "JIP",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Hotel_Korpilampi.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "madrid-terraza": {
    "image": "hoteles/hotel-madrid-terraza-ref.jpg",
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
      yojoa: ['roma','Roma','Coliseo, plazas de Trastevere y jardines de Villa Borghese.', ['Conocer el Coliseo','Visitar la Fontana di Trevi','Pasear por Trastevere']],
      utila: ['nueva-york','Nueva York','Central Park, el puente de Brooklyn y los barrios de Manhattan.', ['Pasear por Central Park','Visitar sus museos','Conocer Times Square']],
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
      image:`imagenes-viajes/destinos/destino-${id}.jpg`,alt:`Vista de ${name}; fotografía de Wikimedia Commons`,
      transfer:'',tip:'Organiza el traslado entre el aeropuerto y tu hospedaje por separado.'});
    if(id==='san-jose'){
        Object.assign(d,{country:'Costa Rica',region:'internacional',economy:6200,duration:180,
          image:'imagenes-viajes/destinos/destino-san-jose-teatro.jpg',alt:'Fachada del Teatro Nacional en San José, Costa Rica'});
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

  // Ampliación del catálogo de demostración; tarifas y alojamientos ficticios.
  const additionalDestinations = [
  {
    "id": "londres",
    "name": "Londres",
    "country": "Reino Unido",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "LHR",
      "name": "Heathrow"
    },
    "arrival": "Londres",
    "transfer": "",
    "nights": 6,
    "economy": 22500,
    "duration": 1020,
    "image": "imagenes-viajes/destinos/destino-londres.jpg",
    "alt": "Vista de Londres",
    "intro": "Museos, mercados y paseos por las orillas del Támesis.",
    "description": "Museos, mercados y paseos por las orillas del Támesis.",
    "highlights": [
      "Visitar el British Museum",
      "Caminar por South Bank",
      "Recorrer el mercado de Borough"
    ],
    "tip": "Revisá los tiempos de conexión y organizá el traslado entre el aeropuerto y tu hospedaje.",
    "hotels": [
      {
        "id": "londres-estancia-1",
        "name": "Hotel Alder House",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2600,
        "image": "hoteles/hotel-londres-estancia-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Thomas Duesing",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Siena_-_hotel_room_-_2012-5.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "londres-estancia-2",
        "name": "Posada del Támesis",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2990,
        "image": "hoteles/hotel-londres-estancia-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_bed_with_lit_lamp_at_Hotel_Esplanade_in_October_2023.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "londres-estancia-3",
        "name": "Suites Bloomsbury Lane",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3380,
        "image": "hoteles/hotel-londres-estancia-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Gary Bembridge from London, UK",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Lutetia_Paris_Room_419.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "londres-estancia-4",
        "name": "Hotel Rowan Court",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3770,
        "image": "hoteles/hotel-londres-estancia-4.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Usien",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_Hotel_Burgenland_in_Eisenstadt.JPG",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "londres-estancia-5",
        "name": "Casa del Olmo Inglés",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 4160,
        "image": "hoteles/hotel-londres-estancia-5.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_at_Hotel_Esplanade_in_Stockholm_in_the_evening.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "lisboa",
    "name": "Lisboa",
    "country": "Portugal",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "LIS",
      "name": "Humberto Delgado"
    },
    "arrival": "Lisboa",
    "transfer": "",
    "nights": 5,
    "economy": 20500,
    "duration": 990,
    "image": "imagenes-viajes/destinos/destino-lisboa.jpg",
    "alt": "Vista de Lisboa",
    "intro": "Tranvías, miradores y barrios para recorrer junto al Tajo.",
    "description": "Tranvías, miradores y barrios para recorrer junto al Tajo.",
    "highlights": [
      "Caminar por Alfama",
      "Visitar la Torre de Belém",
      "Probar pasteles de nata"
    ],
    "tip": "Revisá los tiempos de conexión y organizá el traslado entre el aeropuerto y tu hospedaje.",
    "hotels": [
      {
        "id": "lisboa-estancia-1",
        "name": "Hotel Patio del Azulejo",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1900,
        "image": "hoteles/hotel-lisboa-estancia-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Tim36272",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Room_with_queen_size_bed.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "lisboa-estancia-2",
        "name": "Casa da Amendoeira",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2185,
        "image": "hoteles/hotel-lisboa-estancia-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Derek Jensen (Tysto)",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel-room-renaissance-columbus-ohio.jpg",
        "photoLicense": "Public domain",
        "photoLicenseUrl": "",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "lisboa-estancia-3",
        "name": "Suites Brisa del Tajo",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2470,
        "image": "hoteles/hotel-lisboa-estancia-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_at_Elite_Hotel_Ideon_Lund_in_October_2023.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "lisboa-estancia-4",
        "name": "Posada Mirador del Tejo",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2755,
        "image": "hoteles/hotel-lisboa-estancia-4.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Kleon3",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Kruisherenhotel,_hotel_room_1.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "lisboa-estancia-5",
        "name": "Hotel Jardim de Alfama",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3040,
        "image": "hoteles/hotel-lisboa-estancia-5.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Kleon3",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Kruisherenhotel,_hotel_room_2.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "toronto",
    "name": "Toronto",
    "country": "Canadá",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "YYZ",
      "name": "Toronto Pearson"
    },
    "arrival": "Toronto",
    "transfer": "",
    "nights": 5,
    "economy": 14500,
    "duration": 540,
    "image": "imagenes-viajes/destinos/destino-toronto.jpg",
    "alt": "Vista de Toronto",
    "intro": "El lago Ontario, museos y mercados a tu ritmo.",
    "description": "El lago Ontario, museos y mercados a tu ritmo.",
    "highlights": [
      "Subir a la CN Tower",
      "Recorrer St. Lawrence Market",
      "Pasear por la costa del lago"
    ],
    "tip": "Revisá los tiempos de conexión y organizá el traslado entre el aeropuerto y tu hospedaje.",
    "hotels": [
      {
        "id": "toronto-estancia-1",
        "name": "Hotel Harbour Maple",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2500,
        "image": "hoteles/hotel-toronto-estancia-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JesusisGreat7",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_with_traditional_wooden_decor_and_city_view.jpg",
        "photoLicense": "CC0",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "toronto-estancia-2",
        "name": "Suites Birch Avenue",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2875,
        "image": "hoteles/hotel-toronto-estancia-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Larry D. Moore",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Room_Stanley_Hotel_Estes_Park_Colorado_2024.jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "toronto-estancia-3",
        "name": "Casa del Lago Ontario",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3250,
        "image": "hoteles/hotel-toronto-estancia-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Omenahotelli_hotel_room_in_Tampere.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "toronto-estancia-4",
        "name": "Hotel Willow Junction",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3625,
        "image": "hoteles/hotel-toronto-estancia-4.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Stck w",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Interior_of_Rental_Room_24,_Ikebukuro,_Tokyo,_Japan.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "toronto-estancia-5",
        "name": "Posada Queen Garden",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 4000,
        "image": "hoteles/hotel-toronto-estancia-5.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Atakra",
        "photoSource": "https://commons.wikimedia.org/wiki/File:La_fonda_hotel_room.jpg",
        "photoLicense": "CC0",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "rio-janeiro",
    "name": "Río de Janeiro",
    "country": "Brasil",
    "type": "playa",
    "region": "internacional",
    "tag": "Playa y descanso",
    "airport": {
      "code": "GIG",
      "name": "Galeão–Antônio Carlos Jobim"
    },
    "arrival": "Río de Janeiro",
    "transfer": "",
    "nights": 6,
    "economy": 17500,
    "duration": 780,
    "image": "imagenes-viajes/destinos/destino-rio-janeiro.jpg",
    "alt": "Vista de Río de Janeiro",
    "intro": "Playas de Ipanema, jardines y vistas desde el Pan de Azúcar.",
    "description": "Playas de Ipanema, jardines y vistas desde el Pan de Azúcar.",
    "highlights": [
      "Caminar por Ipanema",
      "Visitar el Pan de Azúcar",
      "Recorrer el Jardín Botánico"
    ],
    "tip": "Revisá los tiempos de conexión y organizá el traslado entre el aeropuerto y tu hospedaje.",
    "hotels": [
      {
        "id": "rio-janeiro-estancia-1",
        "name": "Hotel Jardim da Maré",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2000,
        "image": "hoteles/hotel-rio-janeiro-estancia-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_at_Omenahotelli_Tampere.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "rio-janeiro-estancia-2",
        "name": "Posada Brisa Carioca",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2300,
        "image": "hoteles/hotel-rio-janeiro-estancia-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "গীতাশ্ৰী গগৈ আপ্তে",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Two_beds_room_of_Hyatt_place_New_York_Chelsea.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "rio-janeiro-estancia-3",
        "name": "Suites Pedra do Sol",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2600,
        "image": "hoteles/hotel-rio-janeiro-estancia-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Deans Charbal",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Conrad_Indianapolis_hotel,_room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "rio-janeiro-estancia-4",
        "name": "Casa del Almendro Tropical",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2900,
        "image": "hoteles/hotel-rio-janeiro-estancia-4.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Aragon",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Aragon_Chambre_Henry_James.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "rio-janeiro-estancia-5",
        "name": "Hotel Varanda de Ipanema",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3200,
        "image": "hoteles/hotel-rio-janeiro-estancia-5.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Shixart1985",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Cozy_hotel_room_with_modern_furnishings_and_natural_light_flowing_through_the_curtains.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  }
];
  // Destinos adicionales: alojamientos y tarifas de demostración.
  additionalDestinations.push(...[
  {
    "id": "ciudad-mexico",
    "name": "Ciudad de México",
    "country": "México",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "MEX",
      "name": "Benito Juárez"
    },
    "arrival": "Ciudad de México",
    "transfer": "",
    "nights": 5,
    "economy": 8500,
    "duration": 240,
    "image": "imagenes-viajes/destinos/destino-ciudad-mexico.jpg",
    "alt": "Vista de Ciudad de México, México",
    "intro": "Chapultepec, Coyoacán y museos para recorrer por barrios.",
    "description": "Chapultepec, Coyoacán y museos para recorrer por barrios.",
    "highlights": [
      "Recorrer Chapultepec",
      "Visitar el Palacio de Bellas Artes",
      "Caminar por Coyoacán"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "ciudad-mexico-opcion-1",
        "name": "Patio del Cenzontle",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1500,
        "image": "hoteles/hotel-ciudad-mexico-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Eliedion",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Efteling_Loonsche_Land_Hotel_themed_room_water_-_bunk_beds.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "ciudad-mexico-opcion-2",
        "name": "Casa Jacaranda",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 1725,
        "image": "hoteles/hotel-ciudad-mexico-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Michael Gray",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Room_Chicago_Hilton2.jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "ciudad-mexico-opcion-3",
        "name": "Suites del Ahuehuete",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 1950,
        "image": "hoteles/hotel-ciudad-mexico-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Shixart1985",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Cozy_hotel_room_with_warm_lighting_and_refreshments_on_a_small_table.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "bogota",
    "name": "Bogotá",
    "country": "Colombia",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "BOG",
      "name": "El Dorado"
    },
    "arrival": "Bogotá",
    "transfer": "",
    "nights": 4,
    "economy": 7800,
    "duration": 300,
    "image": "imagenes-viajes/destinos/destino-bogota.jpg",
    "alt": "Vista de Bogotá, Colombia",
    "intro": "La Candelaria, el Museo del Oro y vistas desde Monserrate.",
    "description": "La Candelaria, el Museo del Oro y vistas desde Monserrate.",
    "highlights": [
      "Visitar el Museo del Oro",
      "Recorrer La Candelaria",
      "Subir a Monserrate"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "bogota-opcion-1",
        "name": "Casa del Arrayán",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1300,
        "image": "hoteles/hotel-bogota-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "阿道",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Guest_Room_of_Mandarin_Oriental,_Taipei_01.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "bogota-opcion-2",
        "name": "Hotel Patio Andino",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 1495,
        "image": "hoteles/hotel-bogota-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Aaveecloud",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Accommodation_Kouvola_traditional_room_upstairs_Rauhala_Inn.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "bogota-opcion-3",
        "name": "Suites del Ceramista",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 1690,
        "image": "hoteles/hotel-bogota-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Fung Hong Yuenai",
        "photoSource": "https://commons.wikimedia.org/wiki/File:TW_%E5%8F%B0%E7%81%A3_Taiwan_%E5%8F%B0%E5%8C%97%E5%B8%82_Taipei_City_%E4%B8%AD%E6%AD%A3%E5%8D%80_Zhongzheng_District_%E5%BF%A0%E5%AD%9D%E8%A5%BF%E8%B7%AF%E4%B8%80%E6%AE%B5_Zhongxiao_West_Road_1_section_%E5%8F%B0%E5%8C%97%E5%87%B1%E6%92%92%E5%A4%A7%E9%A3%AF%E5%BA%97_Caesar_Park_Taipei_hotel_room_window_curtain_n_beds_night_August_2019_SSG_03.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "cartagena",
    "name": "Cartagena",
    "country": "Colombia",
    "type": "playa",
    "region": "internacional",
    "tag": "Playa y descanso",
    "airport": {
      "code": "CTG",
      "name": "Rafael Núñez"
    },
    "arrival": "Cartagena",
    "transfer": "",
    "nights": 4,
    "economy": 8200,
    "duration": 330,
    "image": "imagenes-viajes/destinos/destino-cartagena.jpg",
    "alt": "Vista de Cartagena, Colombia",
    "intro": "Murallas, plazas y tardes junto al Caribe colombiano.",
    "description": "Murallas, plazas y tardes junto al Caribe colombiano.",
    "highlights": [
      "Caminar por las murallas",
      "Visitar el castillo de San Felipe",
      "Pasear por Getsemaní"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "cartagena-opcion-1",
        "name": "Casa del Balcón Coral",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1700,
        "image": "hoteles/hotel-cartagena-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Jakehutai",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Grand_Hyatt_Taipei_bedroom_in_Grand_Premier_Room.JPG",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "cartagena-opcion-2",
        "name": "Hotel Patio de Sal",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 1955,
        "image": "hoteles/hotel-cartagena-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Hermann Luyken",
        "photoSource": "https://commons.wikimedia.org/wiki/File:2014.11.15.151019_Bed_Imperial_Palace_Club_Shanghai.jpg",
        "photoLicense": "CC0",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "cartagena-opcion-3",
        "name": "Suites del Alcatraz",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2210,
        "image": "hoteles/hotel-cartagena-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "YosemiteYamper",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Room_18120,_Luxor_Resort_%26_Casino.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "lima",
    "name": "Lima",
    "country": "Perú",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "LIM",
      "name": "Jorge Chávez"
    },
    "arrival": "Lima",
    "transfer": "",
    "nights": 5,
    "economy": 11000,
    "duration": 420,
    "image": "imagenes-viajes/destinos/destino-lima.jpg",
    "alt": "Vista de Lima, Perú",
    "intro": "Malecón de Miraflores, Barranco y cocina peruana.",
    "description": "Malecón de Miraflores, Barranco y cocina peruana.",
    "highlights": [
      "Recorrer el malecón de Miraflores",
      "Caminar por Barranco",
      "Conocer el centro histórico"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "lima-opcion-1",
        "name": "Hotel Patio del Pacífico",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1600,
        "image": "hoteles/hotel-lima-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Wiki.webscapeoy",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Restored_Shashi_Kapoor_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "lima-opcion-2",
        "name": "Casa de la Garúa",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 1840,
        "image": "hoteles/hotel-lima-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "G. Edward Johnson",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Days_Inn_motel_room_Needles_CA_2026-04-04_19-12-45_1.jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "lima-opcion-3",
        "name": "Suites del Acantilado",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2080,
        "image": "hoteles/hotel-lima-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Nightscream",
        "photoSource": "https://commons.wikimedia.org/wiki/File:6.13.08ABQMarriotPyramidRoomByLuigiNovi8.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "buenos-aires",
    "name": "Buenos Aires",
    "country": "Argentina",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "EZE",
      "name": "Ministro Pistarini, Ezeiza"
    },
    "arrival": "Buenos Aires",
    "transfer": "",
    "nights": 6,
    "economy": 16000,
    "duration": 660,
    "image": "imagenes-viajes/destinos/destino-buenos-aires.jpg",
    "alt": "Vista de Buenos Aires, Argentina",
    "intro": "Librerías, cafés y paseos por Palermo y San Telmo.",
    "description": "Librerías, cafés y paseos por Palermo y San Telmo.",
    "highlights": [
      "Visitar librerías de Recoleta",
      "Recorrer San Telmo",
      "Caminar por los parques de Palermo"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "buenos-aires-opcion-1",
        "name": "Casa del Jacarandá Porteño",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1900,
        "image": "hoteles/hotel-buenos-aires-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Dale Cruse - 10M views from San Francisco, CA, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Tropical_Noir_Chic_Boutique_Hotel_Room_in_Lisbon_(54940806211).jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "buenos-aires-opcion-2",
        "name": "Hotel Patio del Tango",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2185,
        "image": "hoteles/hotel-buenos-aires-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Jonathan Schilling",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hyatt_Place_Chicago-South_room_interior.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "buenos-aires-opcion-3",
        "name": "Suites Pasaje del Sur",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2470,
        "image": "hoteles/hotel-buenos-aires-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Infrogmation of New Orleans",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Ocean_Palm_Room.JPG",
        "photoLicense": "CC BY 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "santiago",
    "name": "Santiago",
    "country": "Chile",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "SCL",
      "name": "Arturo Merino Benítez"
    },
    "arrival": "Santiago",
    "transfer": "",
    "nights": 5,
    "economy": 15000,
    "duration": 600,
    "image": "imagenes-viajes/destinos/destino-santiago.jpg",
    "alt": "Vista de Santiago, Chile",
    "intro": "Barrios históricos, parques y vistas desde el cerro San Cristóbal.",
    "description": "Barrios históricos, parques y vistas desde el cerro San Cristóbal.",
    "highlights": [
      "Subir al cerro San Cristóbal",
      "Visitar el Museo de la Memoria",
      "Recorrer el barrio Lastarria"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "santiago-opcion-1",
        "name": "Hotel Patio de los Andes",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1800,
        "image": "hoteles/hotel-santiago-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Rasse2",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Forest_Of_Hope_Guest_House.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "santiago-opcion-2",
        "name": "Casa del Peumo",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2070,
        "image": "hoteles/hotel-santiago-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Tournasol7",
        "photoSource": "https://commons.wikimedia.org/wiki/File:La_Bastide_en_Gascogne_(11).jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "santiago-opcion-3",
        "name": "Suites Cerro Claro",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2340,
        "image": "hoteles/hotel-santiago-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "SuperDalio",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Red_Roof_NextGen_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "medellin",
    "name": "Medellín",
    "country": "Colombia",
    "type": "naturaleza",
    "region": "internacional",
    "tag": "Naturaleza y aventura",
    "airport": {
      "code": "MDE",
      "name": "José María Córdova, Rionegro"
    },
    "arrival": "Medellín",
    "transfer": "",
    "nights": 4,
    "economy": 8500,
    "duration": 330,
    "image": "imagenes-viajes/destinos/destino-medellin.jpg",
    "alt": "Vista de Medellín, Colombia",
    "intro": "Jardín Botánico, parques y recorridos por el valle de Aburrá.",
    "description": "Jardín Botánico, parques y recorridos por el valle de Aburrá.",
    "highlights": [
      "Visitar el Jardín Botánico",
      "Caminar por el Parque Arví",
      "Conocer la Plaza Botero"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "medellin-opcion-1",
        "name": "Casa del Guayacán",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1400,
        "image": "hoteles/hotel-medellin-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Rangan Datta Wiki",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bari_Kothi_4.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "medellin-opcion-2",
        "name": "Hotel Valle Florido",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 1610,
        "image": "hoteles/hotel-medellin-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Missvain",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hyatt_Regency_Lake_Tahoe_Resort,_Spa_and_Casino_-_2021-10-17_-_Sarah_Stierch_02.jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "medellin-opcion-3",
        "name": "Suites Patio de Helechos",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 1820,
        "image": "hoteles/hotel-medellin-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Adioslepido",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Sober_Living_in_San_Diego.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "punta-cana",
    "name": "Punta Cana",
    "country": "República Dominicana",
    "type": "playa",
    "region": "internacional",
    "tag": "Playa y descanso",
    "airport": {
      "code": "PUJ",
      "name": "Internacional de Punta Cana"
    },
    "arrival": "Punta Cana",
    "transfer": "",
    "nights": 5,
    "economy": 10500,
    "duration": 360,
    "image": "imagenes-viajes/destinos/destino-punta-cana.jpg",
    "alt": "Vista de Punta Cana, República Dominicana",
    "intro": "Arena clara, costa de Bávaro y días de descanso junto al mar.",
    "description": "Arena clara, costa de Bávaro y días de descanso junto al mar.",
    "highlights": [
      "Descansar en la playa de Bávaro",
      "Pasear por la costa",
      "Probar la cocina dominicana"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "punta-cana-opcion-1",
        "name": "Hotel Duna de Coco",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2400,
        "image": "hoteles/hotel-punta-cana-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Morocco_2023_33.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "punta-cana-opcion-2",
        "name": "Casa Brisa de Bávaro",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2760,
        "image": "hoteles/hotel-punta-cana-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Infrogmation of New Orleans",
        "photoSource": "https://commons.wikimedia.org/wiki/File:PensacolaVictorianBnBPort.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "punta-cana-opcion-3",
        "name": "Suites Mar de Almendra",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3120,
        "image": "hoteles/hotel-punta-cana-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Prayitno from Los Angeles, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hyatt_Fisherman%27s_Bedroom_2.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "san-salvador",
    "name": "San Salvador",
    "country": "El Salvador",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "SAL",
      "name": "San Óscar Arnulfo Romero, San Luis Talpa"
    },
    "arrival": "San Salvador",
    "transfer": "",
    "nights": 3,
    "economy": 4200,
    "duration": 120,
    "image": "imagenes-viajes/destinos/destino-san-salvador.jpg",
    "alt": "Vista de San Salvador, El Salvador",
    "intro": "Centro Histórico, museos y cafés en la capital salvadoreña.",
    "description": "Centro Histórico, museos y cafés en la capital salvadoreña.",
    "highlights": [
      "Recorrer el Centro Histórico",
      "Visitar el Museo de Arte",
      "Caminar por el Parque Cuscatlán"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "san-salvador-opcion-1",
        "name": "Casa del Maquilishuat",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1200,
        "image": "hoteles/hotel-san-salvador-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Prayitno / Thank you for (12 millions +) view from Los Angeles, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Westin_Bonaventure_(6770536767).jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "san-salvador-opcion-2",
        "name": "Hotel Patio Cuscatleco",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 1380,
        "image": "hoteles/hotel-san-salvador-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "hatch.m from Tokyo, Japan",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Mandarin_Oriental_Tokyo_%5E1_-_Flickr_-_hatch.m.jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "san-salvador-opcion-3",
        "name": "Suites Volcán de Jade",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 1560,
        "image": "hoteles/hotel-san-salvador-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Tess Mattew",
        "photoSource": "https://commons.wikimedia.org/wiki/File:2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_05.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "san-juan",
    "name": "San Juan",
    "country": "Puerto Rico",
    "type": "playa",
    "region": "internacional",
    "tag": "Playa y descanso",
    "airport": {
      "code": "SJU",
      "name": "Luis Muñoz Marín, Carolina"
    },
    "arrival": "San Juan",
    "transfer": "",
    "nights": 5,
    "economy": 12000,
    "duration": 390,
    "image": "imagenes-viajes/destinos/destino-san-juan.jpg",
    "alt": "Vista de San Juan, Puerto Rico",
    "intro": "Calles del Viejo San Juan, fortalezas y costa de Condado.",
    "description": "Calles del Viejo San Juan, fortalezas y costa de Condado.",
    "highlights": [
      "Recorrer el Viejo San Juan",
      "Visitar el fuerte San Felipe del Morro",
      "Pasear por Condado"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "san-juan-opcion-1",
        "name": "Casa del Adoquín Azul",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2300,
        "image": "hoteles/hotel-san-juan-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "John Mason from Edinburgh, UK",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom,_Bowery_Hotel_New_York_(15642356845).jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "san-juan-opcion-2",
        "name": "Hotel Patio Borinquen",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2645,
        "image": "hoteles/hotel-san-juan-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Kenming Wang",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Forte_Hotel_Changhua_bedroom_on_13_April_2016.jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "san-juan-opcion-3",
        "name": "Suites Brisa del Morro",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2990,
        "image": "hoteles/hotel-san-juan-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Shixart1985",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Modern_bedroom_design_in_a_stylish_hotel_room_featuring_geometric_patterns_and_soft_linens.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "los-angeles",
    "name": "Los Ángeles",
    "country": "Estados Unidos",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "LAX",
      "name": "Internacional de Los Ángeles"
    },
    "arrival": "Los Ángeles",
    "transfer": "",
    "nights": 5,
    "economy": 13500,
    "duration": 480,
    "image": "imagenes-viajes/destinos/destino-los-angeles.jpg",
    "alt": "Vista de Los Ángeles, Estados Unidos",
    "intro": "Museos, Griffith Park y paseos por Santa Mónica.",
    "description": "Museos, Griffith Park y paseos por Santa Mónica.",
    "highlights": [
      "Visitar el Getty Center",
      "Caminar por Griffith Park",
      "Pasear por Santa Mónica"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "los-angeles-opcion-1",
        "name": "Hotel Laurel Avenue",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2800,
        "image": "hoteles/hotel-los-angeles-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Mastcraft",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Washington_Mayfair_Hotel,_Bedroom.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "los-angeles-opcion-2",
        "name": "Casa Pacific Terrace",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3220,
        "image": "hoteles/hotel-los-angeles-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_interior_at_hotel_Radisson_Blu_Oulu.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "los-angeles-opcion-3",
        "name": "Suites Silver Palm",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3640,
        "image": "hoteles/hotel-los-angeles-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "https://www.flickr.com/photos/toprural/",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_L%27Agora_Interior_1.jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "las-vegas",
    "name": "Las Vegas",
    "country": "Estados Unidos",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "LAS",
      "name": "Harry Reid"
    },
    "arrival": "Las Vegas",
    "transfer": "",
    "nights": 4,
    "economy": 13000,
    "duration": 510,
    "image": "imagenes-viajes/destinos/destino-las-vegas.jpg",
    "alt": "Vista de Las Vegas, Estados Unidos",
    "intro": "Espectáculos, gastronomía y recorridos por el Strip.",
    "description": "Espectáculos, gastronomía y recorridos por el Strip.",
    "highlights": [
      "Recorrer el Strip",
      "Visitar el Museo del Neón",
      "Ver un espectáculo"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "las-vegas-opcion-1",
        "name": "Hotel Desert Willow",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2300,
        "image": "hoteles/hotel-las-vegas-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Nick-D",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Interior_of_a_room_at_City_Lodge_OR_Tambo_Airport_hotel_February_2025.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "las-vegas-opcion-2",
        "name": "Suites Copper Dune",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2645,
        "image": "hoteles/hotel-las-vegas-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "TaurusEmerald",
        "photoSource": "https://commons.wikimedia.org/wiki/File:The_William_Vale_Hotel_Bedroom_Brooklyn,_NYC.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "las-vegas-opcion-3",
        "name": "Casa Mojave Court",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2990,
        "image": "hoteles/hotel-las-vegas-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JasonParis",
        "photoSource": "https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_(Warehouse_District)_-_Loft_523_Hotel_interior,_Feb_2011_-_3.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "vancouver",
    "name": "Vancouver",
    "country": "Canadá",
    "type": "naturaleza",
    "region": "internacional",
    "tag": "Naturaleza y aventura",
    "airport": {
      "code": "YVR",
      "name": "Internacional de Vancouver, Richmond"
    },
    "arrival": "Vancouver",
    "transfer": "",
    "nights": 6,
    "economy": 18000,
    "duration": 660,
    "image": "imagenes-viajes/destinos/destino-vancouver.jpg",
    "alt": "Vista de Vancouver, Canadá",
    "intro": "Stanley Park, Granville Island y paseos entre bosque y costa.",
    "description": "Stanley Park, Granville Island y paseos entre bosque y costa.",
    "highlights": [
      "Recorrer Stanley Park",
      "Visitar Granville Island",
      "Caminar por el Seawall"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "vancouver-opcion-1",
        "name": "Hotel Cedar Harbour",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2800,
        "image": "hoteles/hotel-vancouver-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "William J Sisti from Morristown, NJ, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom_-_Hotel_Pulitzer_(8698641138).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "vancouver-opcion-2",
        "name": "Casa Evergreen Cove",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3220,
        "image": "hoteles/hotel-vancouver-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "TravelingOtter",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom,_Westin_Canal_Place_-_New_Orleans.jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "vancouver-opcion-3",
        "name": "Suites Pacific Fern",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3640,
        "image": "hoteles/hotel-vancouver-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "William J Sisti from Morristown, NJ, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom_Suite_-_Hotel_Pulitzer_(8697518713).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "amsterdam",
    "name": "Ámsterdam",
    "country": "Países Bajos",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "AMS",
      "name": "Schiphol"
    },
    "arrival": "Ámsterdam",
    "transfer": "",
    "nights": 5,
    "economy": 23000,
    "duration": 990,
    "image": "imagenes-viajes/destinos/destino-amsterdam.jpg",
    "alt": "Vista de Ámsterdam, Países Bajos",
    "intro": "Canales, museos y recorridos a pie por Jordaan.",
    "description": "Canales, museos y recorridos a pie por Jordaan.",
    "highlights": [
      "Visitar el Rijksmuseum",
      "Pasear por Jordaan",
      "Recorrer sus canales"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "amsterdam-opcion-1",
        "name": "Casa del Canal de Olmo",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2700,
        "image": "hoteles/hotel-amsterdam-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_interior_at_apartment_hotel_Ona_Cala_P%C3%AD_Club,_Mallorca,_Spain.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "amsterdam-opcion-2",
        "name": "Hotel Tulip Courtyard",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3105,
        "image": "hoteles/hotel-amsterdam-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Prayitno / Thank you for (12 millions +) view",
        "photoSource": "https://commons.wikimedia.org/wiki/File:JW_Marriott_Hotel_New_Orleans_March_2012_Bedroom.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "amsterdam-opcion-3",
        "name": "Suites Puente de Ámbar",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3510,
        "image": "hoteles/hotel-amsterdam-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Prayitno from Los Angeles, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hyatt_Fisherman%27s_Bedroom_1.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "berlin",
    "name": "Berlín",
    "country": "Alemania",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "BER",
      "name": "Berlín Brandeburgo Willy Brandt"
    },
    "arrival": "Berlín",
    "transfer": "",
    "nights": 5,
    "economy": 22500,
    "duration": 1080,
    "image": "imagenes-viajes/destinos/destino-berlin.jpg",
    "alt": "Vista de Berlín, Alemania",
    "intro": "Isla de los Museos, parques y barrios con historia.",
    "description": "Isla de los Museos, parques y barrios con historia.",
    "highlights": [
      "Visitar la Isla de los Museos",
      "Conocer la Puerta de Brandeburgo",
      "Caminar por Tiergarten"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "berlin-opcion-1",
        "name": "Hotel Linden Hof",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2200,
        "image": "hoteles/hotel-berlin-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Nenad Stojkovic",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom_hotel_interior_with_open_door_window._(51536308276).jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "berlin-opcion-2",
        "name": "Casa del Patio de Berlín",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2530,
        "image": "hoteles/hotel-berlin-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Fred Cherrygarden",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Central_-_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "berlin-opcion-3",
        "name": "Suites Spree Garden",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2860,
        "image": "hoteles/hotel-berlin-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Tangerineduel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Grand_Island_Hotel_bedroom_2006.JPG",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "praga",
    "name": "Praga",
    "country": "Chequia",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "PRG",
      "name": "Václav Havel"
    },
    "arrival": "Praga",
    "transfer": "",
    "nights": 5,
    "economy": 23500,
    "duration": 1110,
    "image": "imagenes-viajes/destinos/destino-praga.jpg",
    "alt": "Vista de Praga, Chequia",
    "intro": "Puente de Carlos, plazas y miradores sobre el Moldava.",
    "description": "Puente de Carlos, plazas y miradores sobre el Moldava.",
    "highlights": [
      "Cruzar el puente de Carlos",
      "Recorrer la Ciudad Vieja",
      "Visitar el castillo de Praga"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "praga-opcion-1",
        "name": "Casa del Reloj de Ámbar",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1800,
        "image": "hoteles/hotel-praga-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "https://www.flickr.com/photos/toprural/",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_L%27Agora_Interior_2.jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "praga-opcion-2",
        "name": "Hotel Patio de Bohemia",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2070,
        "image": "hoteles/hotel-praga-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Fred Cherrygarden",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Central_-_Room_(II).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "praga-opcion-3",
        "name": "Suites Puente del Moldava",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2340,
        "image": "hoteles/hotel-praga-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Basile Morin",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Canopy_bed_of_Khan_Pool_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "estambul",
    "name": "Estambul",
    "country": "Turquía",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "IST",
      "name": "Aeropuerto de Estambul"
    },
    "arrival": "Estambul",
    "transfer": "",
    "nights": 6,
    "economy": 24500,
    "duration": 1200,
    "image": "imagenes-viajes/destinos/destino-estambul.jpg",
    "alt": "Vista de Estambul, Turquía",
    "intro": "Bazares, mezquitas y recorridos en ferry por el Bósforo.",
    "description": "Bazares, mezquitas y recorridos en ferry por el Bósforo.",
    "highlights": [
      "Recorrer el Gran Bazar",
      "Pasear en ferry por el Bósforo",
      "Visitar el palacio de Topkapi"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "estambul-opcion-1",
        "name": "Hotel Patio del Bósforo",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 1900,
        "image": "hoteles/hotel-estambul-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Bex Walton",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom_at_Town_Hall_Hotel,_London_2026-06-06.jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "estambul-opcion-2",
        "name": "Casa del Tulipán Turco",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2185,
        "image": "hoteles/hotel-estambul-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "TravelingOtter from Houston, Texas, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Junior_Suite_Bedroom_-_Westin_Ottawa_(40586472474).jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "estambul-opcion-3",
        "name": "Suites Cúpula de Jade",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2470,
        "image": "hoteles/hotel-estambul-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Marriott InternationalⓇ The Ritz-Carlton Hotel de la Paix, Geneva",
        "photoSource": "https://commons.wikimedia.org/wiki/File:The_Ritz-Carlton_Hotel_de_la_Paix,_Geneva_%E2%80%94_Grace_Kelly_Suite_Bedroom.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "dubai",
    "name": "Dubái",
    "country": "Emiratos Árabes Unidos",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "DXB",
      "name": "Internacional de Dubái"
    },
    "arrival": "Dubái",
    "transfer": "",
    "nights": 5,
    "economy": 27000,
    "duration": 1320,
    "image": "imagenes-viajes/destinos/destino-dubai.jpg",
    "alt": "Vista de Dubái, Emiratos Árabes Unidos",
    "intro": "Arquitectura, mercados de Al Fahidi y paseos junto al Creek.",
    "description": "Arquitectura, mercados de Al Fahidi y paseos junto al Creek.",
    "highlights": [
      "Recorrer Al Fahidi",
      "Pasear junto al Dubai Creek",
      "Visitar los mercados tradicionales"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "dubai-opcion-1",
        "name": "Hotel Patio de las Dunas",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2600,
        "image": "hoteles/hotel-dubai-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Radisson_Blu_Hotel_Shanghai_New_World_(interior),_December_2015_-_05.JPG",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "dubai-opcion-2",
        "name": "Casa del Dátil",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2990,
        "image": "hoteles/hotel-dubai-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Missvain",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Thatcher_Hotel_-_Feburary_2023_-_Sarah_Stierch_01.jpg",
        "photoLicense": "CC BY 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "dubai-opcion-3",
        "name": "Suites Creek Pearl",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3380,
        "image": "hoteles/hotel-dubai-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "TheTowerHotel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Tower_Hotel_-_Executive_Twin.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "tokio",
    "name": "Tokio",
    "country": "Japón",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "HND",
      "name": "Tokio Haneda"
    },
    "arrival": "Tokio",
    "transfer": "",
    "nights": 7,
    "economy": 34000,
    "duration": 1560,
    "image": "imagenes-viajes/destinos/destino-tokio.jpg",
    "alt": "Vista de Tokio, Japón",
    "intro": "Asakusa, jardines y barrios conectados por tren.",
    "description": "Asakusa, jardines y barrios conectados por tren.",
    "highlights": [
      "Visitar Sensō-ji en Asakusa",
      "Recorrer el parque de Ueno",
      "Caminar por Shibuya"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "tokio-opcion-1",
        "name": "Casa del Farol de Asakusa",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2500,
        "image": "hoteles/hotel-tokio-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Holly Cheng",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Disney_Aulani_1-bedroom_villa_(3).JPG",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "tokio-opcion-2",
        "name": "Hotel Jardín del Ginkgo",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2875,
        "image": "hoteles/hotel-tokio-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "JIP",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_Nice.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "tokio-opcion-3",
        "name": "Suites Puente de Sumida",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3250,
        "image": "hoteles/hotel-tokio-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Random photos 1989",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Budapest,_Astoria_Hotel,_58.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "seul",
    "name": "Seúl",
    "country": "Corea del Sur",
    "type": "cultura",
    "region": "internacional",
    "tag": "Cultura y ciudad",
    "airport": {
      "code": "ICN",
      "name": "Internacional de Incheon"
    },
    "arrival": "Seúl",
    "transfer": "",
    "nights": 7,
    "economy": 33000,
    "duration": 1530,
    "image": "imagenes-viajes/destinos/destino-seul.jpg",
    "alt": "Vista de Seúl, Corea del Sur",
    "intro": "Palacios, mercados y paseos junto al río Han.",
    "description": "Palacios, mercados y paseos junto al río Han.",
    "highlights": [
      "Visitar Gyeongbokgung",
      "Recorrer Bukchon",
      "Pasear junto al río Han"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "seul-opcion-1",
        "name": "Casa del Patio Hanok",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2100,
        "image": "hoteles/hotel-seul-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Xandrium",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Thiranagama_Sri_Lanka_Riff_Hotel_5-star_resort_Suite_bedroom.jpg",
        "photoLicense": "CC0",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "seul-opcion-2",
        "name": "Hotel Jardín del Han",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 2415,
        "image": "hoteles/hotel-seul-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Jeff Kern",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Wyndham_New_Orleans_at_Canal_Place_hotel_room_2002_02.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "seul-opcion-3",
        "name": "Suites Luna de Seúl",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 2730,
        "image": "hoteles/hotel-seul-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Gamgee",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Zimmer_im_Hotel_Dorint_Camp_de_Mar.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "singapur",
    "name": "Singapur",
    "country": "Singapur",
    "type": "naturaleza",
    "region": "internacional",
    "tag": "Naturaleza y aventura",
    "airport": {
      "code": "SIN",
      "name": "Changi"
    },
    "arrival": "Singapur",
    "transfer": "",
    "nights": 6,
    "economy": 35000,
    "duration": 1680,
    "image": "imagenes-viajes/destinos/destino-singapur.jpg",
    "alt": "Vista de Singapur, Singapur",
    "intro": "Jardines botánicos, barrios históricos y paseos por Marina Bay.",
    "description": "Jardines botánicos, barrios históricos y paseos por Marina Bay.",
    "highlights": [
      "Visitar los Jardines Botánicos",
      "Caminar por Marina Bay",
      "Recorrer Kampong Glam"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "singapur-opcion-1",
        "name": "Hotel Orchid Courtyard",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2800,
        "image": "hoteles/hotel-singapur-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "r",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Yanggakdo_International_Hotel_room_1.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "singapur-opcion-2",
        "name": "Casa del Jardín del Estrecho",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3220,
        "image": "hoteles/hotel-singapur-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Room_interior_in_the_Park_Hotel_Tokyo_in_Tokyo,_2019_-_328.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "singapur-opcion-3",
        "name": "Suites Marina Fern",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3640,
        "image": "hoteles/hotel-singapur-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Room_interior_in_the_Park_Hotel_Tokyo_in_Tokyo,_2019_-_329.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  },
  {
    "id": "sidney",
    "name": "Sídney",
    "country": "Australia",
    "type": "playa",
    "region": "internacional",
    "tag": "Playa y descanso",
    "airport": {
      "code": "SYD",
      "name": "Kingsford Smith"
    },
    "arrival": "Sídney",
    "transfer": "",
    "nights": 7,
    "economy": 39000,
    "duration": 1800,
    "image": "imagenes-viajes/destinos/destino-sidney.jpg",
    "alt": "Vista de Sídney, Australia",
    "intro": "La bahía, la Ópera y senderos costeros cerca de Bondi.",
    "description": "La bahía, la Ópera y senderos costeros cerca de Bondi.",
    "highlights": [
      "Conocer la Ópera de Sídney",
      "Pasear por la bahía",
      "Recorrer el sendero de Bondi a Coogee"
    ],
    "tip": "Agrupá tus visitas por zona y reservá tiempo para las conexiones y el traslado desde el aeropuerto.",
    "hotels": [
      {
        "id": "sidney-opcion-1",
        "name": "Hotel Harbour Wattle",
        "stars": 3,
        "area": "Zona urbana",
        "rate": 2900,
        "image": "hoteles/hotel-sidney-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Damienmcr",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_d%27Europe_-_Room_today.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "sidney-opcion-2",
        "name": "Casa del Eucalipto",
        "stars": 4,
        "area": "Zona residencial",
        "rate": 3335,
        "image": "hoteles/hotel-sidney-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "Random photos 1989",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Budapest,_Astoria_Hotel,_54.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "sidney-opcion-3",
        "name": "Suites Bondi Courtyard",
        "stars": 4,
        "area": "Zona urbana",
        "rate": 3770,
        "image": "hoteles/hotel-sidney-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de una habitación; alojamiento de demostración",
        "photoAuthor": "TheTowerHotel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Tower_Hotel_-_Standard.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      }
    ]
  }
]);
// BEGIN DESTINOS OCTUBRE 2026
additionalDestinations.push(...[
  {
    "id": "bangkok",
    "name": "Bangkok",
    "country": "Tailandia",
    "type": "cultura",
    "tag": "Templos y sabores",
    "signature": "La ciudad junto al Chao Phraya",
    "intro": "Cúpulas doradas, mercados y canales dan ritmo a la capital tailandesa.",
    "description": "Alterna los templos de Rattanakosin con los sabores de Chinatown y los parques urbanos. Los barcos del Chao Phraya ofrecen otra perspectiva de la ciudad.",
    "highlights": [
      "Gran Palacio",
      "Wat Pho",
      "Wat Arun"
    ],
    "tip": "Viste con hombros y rodillas cubiertos en los templos y reserva tiempo para el calor.",
    "arrival": "Bangkok",
    "transfer": "Airport Rail Link o taxi autorizado al centro; traslado no incluido.",
    "airport": {
      "code": "BKK",
      "name": "Suvarnabhumi"
    },
    "nights": 5,
    "economy": 30680,
    "duration": 1620,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-bangkok.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/bangkok.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/bangkok-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1706,
    "alt": "Panorámica de Bangkok desde la State Tower, Tailandia",
    "photoAuthor": "Ninara from Helsinki, Finland",
    "photoSource": "https://commons.wikimedia.org/wiki/File:4Y1A1159_Bangkok_(33536795515).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "bangkok-opcion-1",
        "name": "Horizonte Bangkok",
        "stars": 3,
        "area": "Rattanakosin",
        "rate": 1768,
        "image": "hoteles/hotel-bangkok-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Bangkok; oferta de demostración.",
        "photoAuthor": "Humsko",
        "photoSource": "https://commons.wikimedia.org/wiki/File:1._Travunija.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "bangkok-opcion-2",
        "name": "Casa Aurora Bangkok",
        "stars": 4,
        "area": "Silom",
        "rate": 2298,
        "image": "hoteles/hotel-bangkok-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Bangkok; oferta de demostración.",
        "photoAuthor": "Maz3LT0v92",
        "photoSource": "https://commons.wikimedia.org/wiki/File:2-osobowy_comfort_Hotel_Bartis.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "bangkok-opcion-3",
        "name": "Panorama Bangkok",
        "stars": 5,
        "area": "Sukhumvit",
        "rate": 3182,
        "image": "hoteles/hotel-bangkok-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Bangkok; oferta de demostración.",
        "photoAuthor": "104artsuites",
        "photoSource": "https://commons.wikimedia.org/wiki/File:203-sala.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "hong-kong",
    "name": "Hong Kong",
    "country": "China (Hong Kong)",
    "type": "cultura",
    "tag": "Bahía y rascacielos",
    "signature": "Dos orillas, una ciudad inolvidable",
    "intro": "La bahía Victoria une miradores, ferris y barrios llenos de vida.",
    "description": "Descubre la arquitectura de Central, los paseos marítimos de Kowloon y las tradiciones gastronómicas cantonesas entre mercados y casas de té.",
    "highlights": [
      "Victoria Harbour",
      "Victoria Peak",
      "Tsim Sha Tsui"
    ],
    "tip": "Combina el MTR con el Star Ferry y consulta la visibilidad antes de subir a los miradores.",
    "arrival": "Hong Kong",
    "transfer": "Airport Express o autobús hacia Kowloon o Hong Kong Island; traslado no incluido.",
    "airport": {
      "code": "HKG",
      "name": "Hong Kong International"
    },
    "nights": 4,
    "economy": 32240,
    "duration": 1560,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-hong-kong.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/hong-kong.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/hong-kong-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1920,
    "alt": "Rascacielos de Hong Kong iluminados sobre Victoria Harbour",
    "photoAuthor": "Max Bates",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hong_Kong_Skyline_from_Victoria_Harbour_(54750093251).jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "hong-kong-opcion-1",
        "name": "Horizonte Hong Kong",
        "stars": 3,
        "area": "Central",
        "rate": 3380,
        "image": "hoteles/hotel-hong-kong-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Hong Kong; oferta de demostración.",
        "photoAuthor": "104artsuites",
        "photoSource": "https://commons.wikimedia.org/wiki/File:402-sala.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "hong-kong-opcion-2",
        "name": "Casa Aurora Hong Kong",
        "stars": 4,
        "area": "Tsim Sha Tsui",
        "rate": 4394,
        "image": "hoteles/hotel-hong-kong-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Hong Kong; oferta de demostración.",
        "photoAuthor": "Christian Kloeppel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Al_Bustan_Rotana_room.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "hong-kong-opcion-3",
        "name": "Panorama Hong Kong",
        "stars": 5,
        "area": "Wan Chai",
        "rate": 6084,
        "image": "hoteles/hotel-hong-kong-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Hong Kong; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Lisbon_2025_113.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "macao",
    "name": "Macao",
    "country": "China (Macao)",
    "type": "cultura",
    "tag": "Encuentro de culturas",
    "signature": "Plazas portuguesas y tradiciones cantonesas",
    "intro": "Calles adoquinadas y fachadas históricas conviven con la energía contemporánea de Macao.",
    "description": "Su centro histórico invita a caminar entre iglesias, templos y plazas. Taipa y Coloane aportan sabores macaneses, casas tradicionales y paseos tranquilos.",
    "highlights": [
      "Ruinas de San Pablo",
      "Largo do Senado",
      "Templo A-Má"
    ],
    "tip": "Lleva calzado cómodo para cuestas y adoquines; reserva tiempo para trasladarte entre península e islas.",
    "arrival": "Macao",
    "transfer": "Autobús, taxi o conexión al tren ligero desde Taipa; traslado al hotel no incluido.",
    "airport": {
      "code": "MFM",
      "name": "Macau International"
    },
    "nights": 3,
    "economy": 33280,
    "duration": 1740,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-macao.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/macao.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/macao-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1709,
    "alt": "Panorámica de Macao con el Grand Lisboa junto al lago Nam Van",
    "photoAuthor": "kewl",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Macau_-_Skyline.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "macao-opcion-1",
        "name": "Horizonte Macao",
        "stars": 3,
        "area": "Sé",
        "rate": 2860,
        "image": "hoteles/hotel-macao-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Macao; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_S%C3%A3o_Paulo_2023_023.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "macao-opcion-2",
        "name": "Casa Aurora Macao",
        "stars": 4,
        "area": "Taipa",
        "rate": 3718,
        "image": "hoteles/hotel-macao-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Macao; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Morocco_2023_10.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "macao-opcion-3",
        "name": "Panorama Macao",
        "stars": 5,
        "area": "Coloane",
        "rate": 5148,
        "image": "hoteles/hotel-macao-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Macao; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Salvador,_Bahia_2025_207.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "antalya",
    "name": "Antalya",
    "country": "Turquía",
    "type": "playa",
    "tag": "Riviera turca",
    "signature": "Historia junto al Mediterráneo",
    "intro": "Antalya combina el casco antiguo de Kaleiçi con una costa de playas y acantilados.",
    "description": "Recorre puertas romanas, callejones otomanos y el puerto antiguo. Fuera del centro, el Mediterráneo y las cascadas ofrecen jornadas al aire libre.",
    "highlights": [
      "Kaleiçi",
      "Puerta de Adriano",
      "Playa Konyaaltı"
    ],
    "tip": "Reserva las caminatas para las horas frescas y distingue las cascadas Düden superiores de las inferiores.",
    "arrival": "Antalya",
    "transfer": "Tranvía o taxi autorizado hacia el centro; conexiones posteriores según hotel, no incluidas.",
    "airport": {
      "code": "AYT",
      "name": "Antalya"
    },
    "nights": 5,
    "economy": 27040,
    "duration": 1380,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-antalya.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/antalya.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/antalya-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1440,
    "alt": "Playa de Konyaaltı y montañas junto al Mediterráneo en Antalya",
    "photoAuthor": "Esginmurat",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Falezlerden_Antalya_Konyaalt%C4%B1_Plaj%C4%B1na_do%C4%9Fru_bir_g%C3%B6r%C3%BCn%C3%BCm.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "antalya-opcion-1",
        "name": "Horizonte Antalya",
        "stars": 3,
        "area": "Kaleiçi",
        "rate": 2210,
        "image": "hoteles/hotel-antalya-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Antalya; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Tallinn_2024_475.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "antalya-opcion-2",
        "name": "Casa Aurora Antalya",
        "stars": 4,
        "area": "Lara",
        "rate": 2873,
        "image": "hoteles/hotel-antalya-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Antalya; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Wiki_Indaba_2023_248.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "antalya-opcion-3",
        "name": "Panorama Antalya",
        "stars": 5,
        "area": "Konyaaltı",
        "rate": 3978,
        "image": "hoteles/hotel-antalya-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Antalya; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Wiki_Indaba_2024_144.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "kuala-lumpur",
    "name": "Kuala Lumpur",
    "country": "Malasia",
    "type": "cultura",
    "tag": "Sabores y arquitectura",
    "signature": "Una capital de muchas culturas",
    "intro": "Torres relucientes, mercados y templos muestran la diversidad de Kuala Lumpur.",
    "description": "Disfruta del entorno de las Petronas, la arquitectura del centro histórico y la cocina malaya, china e india. Los jardines urbanos permiten descansar del ritmo de la capital.",
    "highlights": [
      "Torres Petronas",
      "Merdeka Square",
      "Central Market"
    ],
    "tip": "Usa el transporte urbano entre barrios y adapta la vestimenta al visitar lugares de culto.",
    "arrival": "Kuala Lumpur",
    "transfer": "KLIA Ekspres o autobús hasta KL Sentral; traslado y conexiones al hotel no incluidos.",
    "airport": {
      "code": "KUL",
      "name": "Kuala Lumpur International"
    },
    "nights": 4,
    "economy": 29380,
    "duration": 1680,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-kuala-lumpur.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/kuala-lumpur.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/kuala-lumpur-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1441,
    "alt": "Cruce de Bukit Bintang entre los edificios de Kuala Lumpur",
    "photoAuthor": "Renek78",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Bukit_Bintang_junction_in_2024_2.jpg",
    "photoLicense": "CC0",
    "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "hotels": [
      {
        "id": "kuala-lumpur-opcion-1",
        "name": "Horizonte Kuala Lumpur",
        "stars": 3,
        "area": "Bukit Bintang",
        "rate": 1612,
        "image": "hoteles/hotel-kuala-lumpur-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Kuala Lumpur; oferta de demostración.",
        "photoAuthor": "Tandil Del Lago",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Caba%C3%B1as_compartidas.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "kuala-lumpur-opcion-2",
        "name": "Casa Aurora Kuala Lumpur",
        "stars": 4,
        "area": "KLCC",
        "rate": 2096,
        "image": "hoteles/hotel-kuala-lumpur-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Kuala Lumpur; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Coop_Hotel,_Sofia_(_1070739).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "kuala-lumpur-opcion-3",
        "name": "Panorama Kuala Lumpur",
        "stars": 5,
        "area": "Brickfields",
        "rate": 2902,
        "image": "hoteles/hotel-kuala-lumpur-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Kuala Lumpur; oferta de demostración.",
        "photoAuthor": "IHG",
        "photoSource": "https://commons.wikimedia.org/wiki/File:CrownePlaza_Interior_Melbourne.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "phuket",
    "name": "Phuket",
    "country": "Tailandia",
    "type": "playa",
    "tag": "Mar de Andamán",
    "signature": "Playas, miradores y casas de colores",
    "intro": "La isla de Phuket ofrece playas tropicales y un casco antiguo de gran personalidad.",
    "description": "Combina el ambiente de Phuket Town con calas de la costa oeste y atardeceres en el extremo sur. Cada zona de la isla propone un ritmo diferente.",
    "highlights": [
      "Phuket Old Town",
      "Playa Kata",
      "Cabo Promthep"
    ],
    "tip": "Respeta las banderas de playa; el mar y las excursiones náuticas dependen del tiempo.",
    "arrival": "Phuket",
    "transfer": "Autobús, van o taxi autorizado hacia Phuket Town o las playas; traslado no incluido.",
    "airport": {
      "code": "HKT",
      "name": "Phuket International"
    },
    "nights": 6,
    "economy": 31460,
    "duration": 1740,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-phuket.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/phuket.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/phuket-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1440,
    "alt": "Arena y mar de la playa Patong en la isla de Phuket",
    "photoAuthor": "jbremer57",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Patong_Beach_on_Phuket.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "phuket-opcion-1",
        "name": "Horizonte Phuket",
        "stars": 3,
        "area": "Old Phuket Town",
        "rate": 2080,
        "image": "hoteles/hotel-phuket-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Phuket; oferta de demostración.",
        "photoAuthor": "Ithadidi",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Delmar_hotel_room_sea_side.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "phuket-opcion-2",
        "name": "Casa Aurora Phuket",
        "stars": 4,
        "area": "Kata",
        "rate": 2704,
        "image": "hoteles/hotel-phuket-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Phuket; oferta de demostración.",
        "photoAuthor": "PaulPMoroney",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Deluxe_Suite_bedroom.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "phuket-opcion-3",
        "name": "Panorama Phuket",
        "stars": 5,
        "area": "Kamala",
        "rate": 3744,
        "image": "hoteles/hotel-phuket-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Phuket; oferta de demostración.",
        "photoAuthor": "Didierlefort",
        "photoSource": "https://commons.wikimedia.org/wiki/File:DL2A_Four_Seasons_Bora_Bora_6.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "pattaya",
    "name": "Pattaya",
    "country": "Tailandia",
    "type": "playa",
    "tag": "Costa del golfo",
    "signature": "Una escapada costera desde Bangkok",
    "intro": "Playas, miradores e islas cercanas definen esta ciudad del golfo de Tailandia.",
    "description": "Elige entre el ambiente urbano de Pattaya, los paseos de Jomtien y una excursión marítima a Koh Lan. Sus templos y mercados completan la estancia.",
    "highlights": [
      "Playa Jomtien",
      "Koh Lan",
      "Santuario de la Verdad"
    ],
    "tip": "Organiza la visita a Koh Lan según el estado del mar y confirma el último regreso.",
    "arrival": "Bangkok",
    "transfer": "Llegada aérea a Bangkok; continuar por carretera a Pattaya, aproximadamente 2–3 horas según tráfico. Traslado terrestre no incluido.",
    "airport": {
      "code": "BKK",
      "name": "Suvarnabhumi, Bangkok"
    },
    "nights": 5,
    "economy": 30160,
    "duration": 1620,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-pattaya.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/pattaya.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/pattaya-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1920,
    "alt": "Bahía y playa de Pattaya vistas desde un mirador",
    "photoAuthor": "Sergey S. Dukachev",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Pattaya_beach_from_view_point.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "hotels": [
      {
        "id": "pattaya-opcion-1",
        "name": "Horizonte Pattaya",
        "stars": 3,
        "area": "Jomtien",
        "rate": 1820,
        "image": "hoteles/hotel-pattaya-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Pattaya; oferta de demostración.",
        "photoAuthor": "Allvin Garamar",
        "photoSource": "https://commons.wikimedia.org/wiki/File:EXECUTIVE_ROOM_-_Teraskita_Hotel_Makassar.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "pattaya-opcion-2",
        "name": "Casa Aurora Pattaya",
        "stars": 4,
        "area": "Naklua",
        "rate": 2366,
        "image": "hoteles/hotel-pattaya-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Pattaya; oferta de demostración.",
        "photoAuthor": "Hotel Shakti City Jakarta",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Executive_Room_Shakti_Hotel_City_Jakarta.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "pattaya-opcion-3",
        "name": "Panorama Pattaya",
        "stars": 5,
        "area": "Pratumnak",
        "rate": 3276,
        "image": "hoteles/hotel-pattaya-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Pattaya; oferta de demostración.",
        "photoAuthor": "PaulPMoroney",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Executive_Suite_bedroom.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "taipei",
    "name": "Taipéi",
    "country": "Taiwán",
    "type": "cultura",
    "tag": "Templos y mercados",
    "signature": "Una ciudad que se saborea caminando",
    "intro": "Taipéi reúne templos tradicionales, mercados nocturnos y un horizonte dominado por Taipei 101.",
    "description": "Los barrios históricos de Wanhua y Dadaocheng muestran otra cara de la ciudad. El metro facilita combinar patrimonio, cocina local y miradores verdes.",
    "highlights": [
      "Taipei 101",
      "Templo Longshan",
      "Mercado nocturno Raohe"
    ],
    "tip": "Lleva una capa de lluvia ligera y consulta las condiciones del sendero de Xiangshan.",
    "arrival": "Taipéi",
    "transfer": "Airport MRT hasta Taipei Main Station o taxi autorizado; traslado no incluido.",
    "airport": {
      "code": "TPE",
      "name": "Taiwan Taoyuan International"
    },
    "nights": 4,
    "economy": 30940,
    "duration": 1620,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-taipei.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/taipei.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/taipei-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1706,
    "alt": "Panorámica de Taipéi con la torre Taipei 101",
    "photoAuthor": "毛貓大少爺",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Taipei_Skyline_2022.06.29.jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "hotels": [
      {
        "id": "taipei-opcion-1",
        "name": "Horizonte Taipéi",
        "stars": 3,
        "area": "Zhongzheng",
        "rate": 2470,
        "image": "hoteles/hotel-taipei-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Taipéi; oferta de demostración.",
        "photoAuthor": "Marc Gerard Del Rosario",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Fairmont_The_Palm_(11535774794).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "taipei-opcion-2",
        "name": "Casa Aurora Taipéi",
        "stars": 4,
        "area": "Xinyi",
        "rate": 3211,
        "image": "hoteles/hotel-taipei-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Taipéi; oferta de demostración.",
        "photoAuthor": "Hotelre",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Family_suite.jpg",
        "photoLicense": "CC BY 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "taipei-opcion-3",
        "name": "Panorama Taipéi",
        "stars": 5,
        "area": "Wanhua",
        "rate": 4446,
        "image": "hoteles/hotel-taipei-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Taipéi; oferta de demostración.",
        "photoAuthor": "Aishagrawal27",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Four_bed.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "milan",
    "name": "Milán",
    "country": "Italia",
    "type": "cultura",
    "tag": "Arte y diseño",
    "signature": "Estilo italiano entre plazas y canales",
    "intro": "La capital lombarda combina patrimonio monumental, diseño contemporáneo y barrios creativos.",
    "description": "Desde el Duomo hasta Brera, Milán invita a mirar sus fachadas y museos. Los Navigli añaden paseos junto al agua y el ambiente del aperitivo.",
    "highlights": [
      "Duomo de Milán",
      "Pinacoteca de Brera",
      "Naviglio Grande"
    ],
    "tip": "Reserva con anticipación los museos y las terrazas del Duomo; organiza cada jornada por barrios.",
    "arrival": "Milán",
    "transfer": "Malpensa Express o autobús hacia Milán; conexión al alojamiento no incluida.",
    "airport": {
      "code": "MXP",
      "name": "Milán Malpensa"
    },
    "nights": 4,
    "economy": 24440,
    "duration": 1020,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-milan.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/milan.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/milan-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1924,
    "alt": "Catedral de Milán desde la Piazza del Duomo",
    "photoAuthor": "Jiuguang Wang",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Milan_Cathedral_from_Piazza_del_Duomo.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "hotels": [
      {
        "id": "milan-opcion-1",
        "name": "Horizonte Milán",
        "stars": 3,
        "area": "Brera",
        "rate": 3250,
        "image": "hoteles/hotel-milan-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Milán; oferta de demostración.",
        "photoAuthor": "Chad Davis from Minneapolis, United States",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Guatemala_Hotel_(52633736890).jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "milan-opcion-2",
        "name": "Casa Aurora Milán",
        "stars": 4,
        "area": "Porta Venezia",
        "rate": 4225,
        "image": "hoteles/hotel-milan-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Milán; oferta de demostración.",
        "photoAuthor": "Claudia Cárdenas Ovando",
        "photoSource": "https://commons.wikimedia.org/wiki/File:HABITACION.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "milan-opcion-3",
        "name": "Panorama Milán",
        "stars": 5,
        "area": "Navigli",
        "rate": 5850,
        "image": "hoteles/hotel-milan-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Milán; oferta de demostración.",
        "photoAuthor": "Tiraspolsky",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hall._Hotel_Brosundet._Alesund._Norway.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "viena",
    "name": "Viena",
    "country": "Austria",
    "type": "cultura",
    "tag": "Palacios y música",
    "signature": "La elegancia de una capital imperial",
    "intro": "Viena une palacios, cafés y avenidas monumentales con parques donde bajar el ritmo.",
    "description": "Explora el centro histórico y sus museos, reserva tiempo para los jardines imperiales y descubre la tradición de sus cafés sin apresurar la visita.",
    "highlights": [
      "Catedral de San Esteban",
      "Palacio Hofburg",
      "Palacio Schönbrunn"
    ],
    "tip": "Comprueba reservas y horarios de palacios y conciertos antes de organizar el día.",
    "arrival": "Viena",
    "transfer": "Tren regional, S-Bahn, City Airport Train o autobús; traslado y enlace al hotel no incluidos.",
    "airport": {
      "code": "VIE",
      "name": "Viena International"
    },
    "nights": 4,
    "economy": 25740,
    "duration": 1080,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-viena.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/viena.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/viena-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1151,
    "alt": "Palacio de Schönbrunn y sus jardines en Viena",
    "photoAuthor": "Superbass",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Schoenbrunn_philharmoniker_2012.jpg",
    "photoLicense": "CC BY-SA 3.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "hotels": [
      {
        "id": "viena-opcion-1",
        "name": "Horizonte Viena",
        "stars": 3,
        "area": "Innere Stadt",
        "rate": 3380,
        "image": "hoteles/hotel-viena-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Viena; oferta de demostración.",
        "photoAuthor": "Matt @ PEK from Taipei, Taiwan",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Cool_Corner_Room_(5574721196).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "viena-opcion-2",
        "name": "Casa Aurora Viena",
        "stars": 4,
        "area": "Leopoldstadt",
        "rate": 4394,
        "image": "hoteles/hotel-viena-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Viena; oferta de demostración.",
        "photoAuthor": "Gshiknis",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Heritage_Machan_Tree_house_hotel_in_Lonavala,_India_-_2008.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "viena-opcion-3",
        "name": "Panorama Viena",
        "stars": 5,
        "area": "Neubau",
        "rate": 6084,
        "image": "hoteles/hotel-viena-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Viena; oferta de demostración.",
        "photoAuthor": "János Korom Dr.  >17 Million views from Wien, Austria",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Rialto_Suisse_1_0136_(33064196308).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "atenas",
    "name": "Atenas",
    "country": "Grecia",
    "type": "cultura",
    "tag": "Historia mediterránea",
    "signature": "La ciudad que conversa con la antigüedad",
    "intro": "Atenas entrelaza monumentos clásicos con barrios, mercados y colinas llenos de vida.",
    "description": "La Acrópolis marca el horizonte, pero también merecen tiempo las calles de Plaka, los sabores del centro y los paseos por sus colinas.",
    "highlights": [
      "Acrópolis",
      "Plaka",
      "Ágora antigua"
    ],
    "tip": "Reserva la franja de acceso a la Acrópolis y evita las horas de más calor en verano.",
    "arrival": "Atenas",
    "transfer": "Metro, tren suburbano, autobús o taxi autorizado; traslado al hotel no incluido.",
    "airport": {
      "code": "ATH",
      "name": "Atenas Eleftherios Venizelos"
    },
    "nights": 4,
    "economy": 25480,
    "duration": 1140,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-atenas.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/atenas.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/atenas-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1440,
    "alt": "Acrópolis de Atenas sobre la ciudad al amanecer",
    "photoAuthor": "Andrew Parlette",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Athens_Acropolis_at_Daybreak.jpg",
    "photoLicense": "CC BY 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "hotels": [
      {
        "id": "atenas-opcion-1",
        "name": "Horizonte Atenas",
        "stars": 3,
        "area": "Plaka",
        "rate": 2600,
        "image": "hoteles/hotel-atenas-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Atenas; oferta de demostración.",
        "photoAuthor": "Jony1988",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Double_room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "atenas-opcion-2",
        "name": "Casa Aurora Atenas",
        "stars": 4,
        "area": "Koukaki",
        "rate": 3380,
        "image": "hoteles/hotel-atenas-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Atenas; oferta de demostración.",
        "photoAuthor": "Matt @ PEK from Taipei, Taiwan",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Executive_Suites_bedroom_(5078857346).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "atenas-opcion-3",
        "name": "Panorama Atenas",
        "stars": 5,
        "area": "Psiri",
        "rate": 4680,
        "image": "hoteles/hotel-atenas-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Atenas; oferta de demostración.",
        "photoAuthor": "Open Grid Scheduler / Grid Engine",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Room_(32259665218).jpg",
        "photoLicense": "Public domain",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "budapest",
    "name": "Budapest",
    "country": "Hungría",
    "type": "cultura",
    "tag": "Danubio y termas",
    "signature": "Dos orillas con historias propias",
    "intro": "Buda y Pest se miran sobre el Danubio entre palacios, puentes y arquitectura monumental.",
    "description": "Alterna el barrio del castillo con los mercados de Pest y sus parques. Las termas forman parte de la experiencia urbana y requieren tiempo propio.",
    "highlights": [
      "Parlamento de Hungría",
      "Bastión de los Pescadores",
      "Puente de las Cadenas"
    ],
    "tip": "Reserva con anticipación visitas al Parlamento y consulta las normas de cada baño termal.",
    "arrival": "Budapest",
    "transfer": "Autobús del aeropuerto o taxi autorizado hacia el centro; traslado no incluido.",
    "airport": {
      "code": "BUD",
      "name": "Budapest Ferenc Liszt International"
    },
    "nights": 4,
    "economy": 23920,
    "duration": 1140,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-budapest.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/budapest.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/budapest-1280.jpg",
    "imageWidth": 2500,
    "imageHeight": 1293,
    "alt": "Río Danubio y puentes de Budapest desde la colina Gellért",
    "photoAuthor": "Visions of Domino",
    "photoSource": "https://commons.wikimedia.org/wiki/File:View_from_Gell%C3%A9rt_Hill_to_the_Danube,_Hungary_-_Budapest_(28493220635).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "budapest-opcion-1",
        "name": "Horizonte Budapest",
        "stars": 3,
        "area": "Belváros-Lipótváros",
        "rate": 2132,
        "image": "hoteles/hotel-budapest-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Budapest; oferta de demostración.",
        "photoAuthor": "GocheGanas",
        "photoSource": "https://commons.wikimedia.org/wiki/File:GocheGanas_elegant_suite_-_twin_beds_with_view.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "budapest-opcion-2",
        "name": "Casa Aurora Budapest",
        "stars": 4,
        "area": "Erzsébetváros",
        "rate": 2772,
        "image": "hoteles/hotel-budapest-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Budapest; oferta de demostración.",
        "photoAuthor": "cloud.shepherd",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_fisheye_(18961172206).jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "budapest-opcion-3",
        "name": "Panorama Budapest",
        "stars": 5,
        "area": "Várkerület",
        "rate": 3838,
        "image": "hoteles/hotel-budapest-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Budapest; oferta de demostración.",
        "photoAuthor": "Sahil Dhiman",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_Gurgaon,_India.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "florencia",
    "name": "Florencia",
    "country": "Italia",
    "type": "cultura",
    "tag": "Renacimiento y artesanía",
    "signature": "Arte a ambas orillas del Arno",
    "intro": "Florencia ofrece plazas renacentistas, talleres tradicionales y vistas desde sus colinas.",
    "description": "Recorre el centro histórico sin prisa y cruza el Arno hacia Oltrarno. Las grandes colecciones artísticas se disfrutan mejor reservando su propio horario.",
    "highlights": [
      "Catedral de Santa Maria del Fiore",
      "Ponte Vecchio",
      "Galería Uffizi"
    ],
    "tip": "Reserva museos con anticipación y lleva calzado para calles empedradas y pendientes.",
    "arrival": "Florencia",
    "transfer": "Tranvía o taxi hacia la ciudad; conexión al hotel no incluida.",
    "airport": {
      "code": "FLR",
      "name": "Florencia Amerigo Vespucci"
    },
    "nights": 4,
    "economy": 25480,
    "duration": 1140,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-florencia.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/florencia.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/florencia-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1709,
    "alt": "Catedral y centro histórico de Florencia desde Piazzale Michelangelo",
    "photoAuthor": "Giorgio Galeotti",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Firenze_-_Piazzale_Michelangelo,_Firenze,_Italy_-_April_6,_2015_02.jpg",
    "photoLicense": "CC BY 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "hotels": [
      {
        "id": "florencia-opcion-1",
        "name": "Horizonte Florencia",
        "stars": 3,
        "area": "Santa Maria Novella",
        "rate": 3250,
        "image": "hoteles/hotel-florencia-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Florencia; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:H%2B_Hotel,_Mannheim_(IMG_8735).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "florencia-opcion-2",
        "name": "Casa Aurora Florencia",
        "stars": 4,
        "area": "San Lorenzo",
        "rate": 4225,
        "image": "hoteles/hotel-florencia-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Florencia; oferta de demostración.",
        "photoAuthor": "Quant",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Suite_-_Living_Room_1.JPG",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "florencia-opcion-3",
        "name": "Panorama Florencia",
        "stars": 5,
        "area": "Santo Spirito",
        "rate": 5850,
        "image": "hoteles/hotel-florencia-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Florencia; oferta de demostración.",
        "photoAuthor": "Markus Spiske markusspiske",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_bedroom_windows_(Unsplash).jpg",
        "photoLicense": "Public domain",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "munich",
    "name": "Múnich",
    "country": "Alemania",
    "type": "cultura",
    "tag": "Tradición bávara",
    "signature": "Plazas, mercados y grandes jardines",
    "intro": "Múnich combina patrimonio bávaro, museos y una vida cotidiana que se disfruta al aire libre.",
    "description": "El casco antiguo permite explorar plazas y mercados a pie. Dedica otra jornada a sus jardines y a los barrios que muestran la faceta creativa de la ciudad.",
    "highlights": [
      "Marienplatz",
      "Viktualienmarkt",
      "Englischer Garten"
    ],
    "tip": "Comprueba reservas durante grandes eventos y deja tiempo para desplazarte en transporte público.",
    "arrival": "Múnich",
    "transfer": "S-Bahn o autobús al centro; traslado y conexiones al hotel no incluidos.",
    "airport": {
      "code": "MUC",
      "name": "Múnich Franz Josef Strauss"
    },
    "nights": 4,
    "economy": 25220,
    "duration": 1080,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-munich.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/munich.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/munich-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1730,
    "alt": "Torres y tejados del centro de Múnich",
    "photoAuthor": "Thomas Wolf, www.foto-tw.de",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Stadtbild_M%C3%BCnchen.jpg",
    "photoLicense": "CC BY-SA 3.0 de",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "hotels": [
      {
        "id": "munich-opcion-1",
        "name": "Horizonte Múnich",
        "stars": 3,
        "area": "Altstadt",
        "rate": 3120,
        "image": "hoteles/hotel-munich-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Múnich; oferta de demostración.",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Istanbul,_Turkey_(November_2023)_-_008.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "munich-opcion-2",
        "name": "Casa Aurora Múnich",
        "stars": 4,
        "area": "Maxvorstadt",
        "rate": 4056,
        "image": "hoteles/hotel-munich-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Múnich; oferta de demostración.",
        "photoAuthor": "Allvin Garamar",
        "photoSource": "https://commons.wikimedia.org/wiki/File:JUNIOR_SUITE_ROOM_-_Teraskita_Hotel_Makassar.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "munich-opcion-3",
        "name": "Panorama Múnich",
        "stars": 5,
        "area": "Haidhausen",
        "rate": 5616,
        "image": "hoteles/hotel-munich-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Múnich; oferta de demostración.",
        "photoAuthor": "Neynyrhtak",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Kimpton_Da_An_Premium_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "dublin",
    "name": "Dublín",
    "country": "Irlanda",
    "type": "cultura",
    "tag": "Letras y música",
    "signature": "Historias junto al río Liffey",
    "intro": "Dublín reúne patrimonio literario, música y barrios que invitan a recorrerlos a pie.",
    "description": "Descubre sus plazas georgianas, librerías y edificios históricos. Entre visitas, los parques y mercados ofrecen un buen descanso para conocer la ciudad.",
    "highlights": [
      "Trinity College",
      "Castillo de Dublín",
      "St Stephen's Green"
    ],
    "tip": "Lleva ropa impermeable y reserva las atracciones más solicitadas con antelación.",
    "arrival": "Dublín",
    "transfer": "Autobús del aeropuerto o taxi autorizado; traslado al alojamiento no incluido.",
    "airport": {
      "code": "DUB",
      "name": "Dublín"
    },
    "nights": 4,
    "economy": 24180,
    "duration": 1020,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-dublin.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/dublin.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/dublin-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1440,
    "alt": "Vista aérea de los edificios y el río de Dublín",
    "photoAuthor": "瑞丽江的河水",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Dublin_-_aerial_-_2025-07-07_01.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "dublin-opcion-1",
        "name": "Horizonte Dublín",
        "stars": 3,
        "area": "Temple Bar",
        "rate": 3770,
        "image": "hoteles/hotel-dublin-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Dublín; oferta de demostración.",
        "photoAuthor": "Enola.d",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Le_salon_de_l%27h%C3%B4tel_Yndo.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "dublin-opcion-2",
        "name": "Casa Aurora Dublín",
        "stars": 4,
        "area": "St Stephen's Green",
        "rate": 4901,
        "image": "hoteles/hotel-dublin-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Dublín; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel,_(IMG_8916).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "dublin-opcion-3",
        "name": "Panorama Dublín",
        "stars": 5,
        "area": "Smithfield",
        "rate": 6786,
        "image": "hoteles/hotel-dublin-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Dublín; oferta de demostración.",
        "photoAuthor": "Win4leisure",
        "photoSource": "https://commons.wikimedia.org/wiki/File:MAJESTIC_ROOM.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "edimburgo",
    "name": "Edimburgo",
    "country": "Reino Unido",
    "type": "cultura",
    "tag": "Castillo y callejones",
    "signature": "Una capital entre piedra y colinas",
    "intro": "Edimburgo combina el trazado medieval de Old Town con jardines y miradores volcánicos.",
    "description": "Su castillo domina calles donde conviven historias, museos y cafés. New Town y los paseos panorámicos completan una estancia de ritmo caminable.",
    "highlights": [
      "Castillo de Edimburgo",
      "Royal Mile",
      "Calton Hill"
    ],
    "tip": "Usa calzado con agarre; las cuestas y adoquines pueden estar húmedos incluso en días suaves.",
    "arrival": "Edimburgo",
    "transfer": "Tranvía, autobús o taxi hacia el centro; traslado no incluido.",
    "airport": {
      "code": "EDI",
      "name": "Edimburgo"
    },
    "nights": 4,
    "economy": 24960,
    "duration": 1080,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-edimburgo.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/edimburgo.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/edimburgo-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1440,
    "alt": "Panorámica de los edificios históricos de Edimburgo",
    "photoAuthor": "Andrew Colin",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Skyline_of_Edinburgh.jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "edimburgo-opcion-1",
        "name": "Horizonte Edimburgo",
        "stars": 3,
        "area": "Old Town",
        "rate": 3640,
        "image": "hoteles/hotel-edimburgo-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Edimburgo; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Ibis_Friedrichshafen_Airport,_Friedrichshafen_(1X7A9712-Pano).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "edimburgo-opcion-2",
        "name": "Casa Aurora Edimburgo",
        "stars": 4,
        "area": "New Town",
        "rate": 4732,
        "image": "hoteles/hotel-edimburgo-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Edimburgo; oferta de demostración.",
        "photoAuthor": "Sidheeq",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Inside_Southern_Sun_Cape_Sun.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "edimburgo-opcion-3",
        "name": "Panorama Edimburgo",
        "stars": 5,
        "area": "Stockbridge",
        "rate": 6552,
        "image": "hoteles/hotel-edimburgo-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Edimburgo; oferta de demostración.",
        "photoAuthor": "Наталья Бутрим",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Luxev1.jpg",
        "photoLicense": "Public domain",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "pekin",
    "name": "Pekín",
    "country": "China",
    "type": "cultura",
    "tag": "Herencia imperial",
    "signature": "Patios, palacios y jardines",
    "intro": "Pekín despliega su historia entre monumentos imperiales y callejones tradicionales.",
    "description": "Organiza las visitas por sectores para disfrutar sus grandes complejos. Los hutongs y parques añaden una dimensión cotidiana a la experiencia monumental.",
    "highlights": [
      "Ciudad Prohibida",
      "Templo del Cielo",
      "Parque Jingshan"
    ],
    "tip": "Confirma reservas oficiales e identificación requerida para cada monumento antes de viajar.",
    "arrival": "Pekín",
    "transfer": "Airport Express o taxi autorizado hacia Pekín; traslado y enlaces al hotel no incluidos.",
    "airport": {
      "code": "PEK",
      "name": "Pekín Capital International"
    },
    "nights": 5,
    "economy": 30940,
    "duration": 1620,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-pekin.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/pekin.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/pekin-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1707,
    "alt": "Distrito de negocios y rascacielos de Pekín",
    "photoAuthor": "N509FZ",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Skyline_of_Beijing_CBD_with_B-5906_approaching_(20211016171955)_(1).jpg",
    "photoLicense": "CC BY 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "hotels": [
      {
        "id": "pekin-opcion-1",
        "name": "Horizonte Pekín",
        "stars": 3,
        "area": "Dongcheng",
        "rate": 2210,
        "image": "hoteles/hotel-pekin-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Pekín; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Aloft,_Al_Rawdah_(IMG_20230812_182243).jpg",
        "photoLicense": "CC BY-SA 4.0 DEED.EN",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "pekin-opcion-2",
        "name": "Casa Aurora Pekín",
        "stars": 4,
        "area": "Xicheng",
        "rate": 2873,
        "image": "hoteles/hotel-pekin-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Pekín; oferta de demostración.",
        "photoAuthor": "Takeaway",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Mandarin_Oriental_Dhara_Dhevi_Chiang_Mai_07.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "pekin-opcion-3",
        "name": "Panorama Pekín",
        "stars": 5,
        "area": "Chaoyang",
        "rate": 3978,
        "image": "hoteles/hotel-pekin-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Pekín; oferta de demostración.",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Puerto_Vallarta,_Mexico_(February_2024)_-_005.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "shanghai",
    "name": "Shanghái",
    "country": "China",
    "type": "cultura",
    "tag": "Horizonte del Huangpu",
    "signature": "Tradición y futuro a la orilla del río",
    "intro": "Shanghái combina el perfil de Pudong con jardines clásicos y calles históricas.",
    "description": "Pasea por el Bund, descubre el entorno de Yuyuan y dedica tiempo a sus barrios arbolados. La ciudad ofrece contrastes que cambian de una orilla a otra.",
    "highlights": [
      "El Bund",
      "Jardín Yuyuan",
      "Lujiazui"
    ],
    "tip": "Comprueba el aeropuerto de llegada: Pudong y Hongqiao están en zonas distintas de la ciudad.",
    "arrival": "Shanghái",
    "transfer": "Metro, Maglev con conexión o taxi autorizado; traslado al alojamiento no incluido.",
    "airport": {
      "code": "PVG",
      "name": "Shanghái Pudong International"
    },
    "nights": 4,
    "economy": 30420,
    "duration": 1560,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-shanghai.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/shanghai.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/shanghai-1280.jpg",
    "imageWidth": 1920,
    "imageHeight": 1282,
    "alt": "Rascacielos de Shanghái junto al río Huangpu",
    "photoAuthor": "xiquinhosilva",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Huangpu_Park_20124-Shanghai_(32208802494).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "shanghai-opcion-1",
        "name": "Horizonte Shanghái",
        "stars": 3,
        "area": "Huangpu",
        "rate": 2600,
        "image": "hoteles/hotel-shanghai-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Shanghái; oferta de demostración.",
        "photoAuthor": "Rufouslark",
        "photoSource": "https://commons.wikimedia.org/wiki/File:N1_Hotel_Bulawayo_Twin_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "shanghai-opcion-2",
        "name": "Casa Aurora Shanghái",
        "stars": 4,
        "area": "Jing'an",
        "rate": 3380,
        "image": "hoteles/hotel-shanghai-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Shanghái; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Lisbon_2025_114.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "shanghai-opcion-3",
        "name": "Panorama Shanghái",
        "stars": 5,
        "area": "Xuhui",
        "rate": 4680,
        "image": "hoteles/hotel-shanghai-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Shanghái; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Salvador,_Bahia_2025_206.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "hanoi",
    "name": "Hanói",
    "country": "Vietnam",
    "type": "cultura",
    "tag": "Lagos y vida local",
    "signature": "La capital de los callejones y el café",
    "intro": "Hanói combina lagos, templos y la energía de sus calles comerciales tradicionales.",
    "description": "En el casco antiguo, cada calle revela oficios y aromas propios. Los paseos junto al agua y los monumentos históricos equilibran el ritmo de la capital.",
    "highlights": [
      "Lago Hoan Kiem",
      "Barrio Antiguo",
      "Templo de la Literatura"
    ],
    "tip": "Cruza las calles con calma y elige recorridos a pie cortos para disfrutar mejor del casco antiguo.",
    "arrival": "Hanói",
    "transfer": "Autobús o taxi autorizado hacia Hanói; traslado al hotel no incluido.",
    "airport": {
      "code": "HAN",
      "name": "Noi Bai International"
    },
    "nights": 4,
    "economy": 29380,
    "duration": 1740,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-hanoi.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/hanoi.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/hanoi-1280.jpg",
    "imageWidth": 2048,
    "imageHeight": 1093,
    "alt": "Panorámica de Hanói con la montaña Ba Vì al fondo",
    "photoAuthor": "Quangnlnhe182394",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Hanoi_skyline_with_Ba_Vi_Mountain.jpg",
    "photoLicense": "CC0",
    "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "hotels": [
      {
        "id": "hanoi-opcion-1",
        "name": "Horizonte Hanói",
        "stars": 3,
        "area": "Hoan Kiem",
        "rate": 1508,
        "image": "hoteles/hotel-hanoi-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Hanói; oferta de demostración.",
        "photoAuthor": "The Down Town Hotel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Premium_Suite_Room_1.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "hanoi-opcion-2",
        "name": "Casa Aurora Hanói",
        "stars": 4,
        "area": "Ba Dinh",
        "rate": 1960,
        "image": "hoteles/hotel-hanoi-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Hanói; oferta de demostración.",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Puerto_Vallarta,_Mexico_(February_2024)_-_001.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "hanoi-opcion-3",
        "name": "Panorama Hanói",
        "stars": 5,
        "area": "Tay Ho",
        "rate": 2714,
        "image": "hoteles/hotel-hanoi-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Hanói; oferta de demostración.",
        "photoAuthor": "Shixart1985",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Modern_hotel_room_with_large_window_and_stylish_furnishings_near_a_city_center_during_daytime.jpg",
        "photoLicense": "CC BY 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "ho-chi-minh",
    "name": "Ciudad Ho Chi Minh",
    "country": "Vietnam",
    "type": "cultura",
    "tag": "Mercados y avenidas",
    "signature": "La energía del sur de Vietnam",
    "intro": "Ciudad Ho Chi Minh reúne arquitectura histórica, mercados y una intensa vida callejera.",
    "description": "Explora su núcleo monumental y los barrios de tradición china. La cocina local, los cafés y los paseos urbanos permiten descubrirla a distintas horas.",
    "highlights": [
      "Palacio de la Reunificación",
      "Oficina Central de Correos",
      "Mercado Ben Thanh"
    ],
    "tip": "Deja margen para el tráfico y revisa qué terminal corresponde a tu vuelo.",
    "arrival": "Ciudad Ho Chi Minh",
    "transfer": "Autobús o taxi autorizado hacia el centro; traslado al alojamiento no incluido.",
    "airport": {
      "code": "SGN",
      "name": "Tan Son Nhat International"
    },
    "nights": 4,
    "economy": 29120,
    "duration": 1740,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-ho-chi-minh.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/ho-chi-minh.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/ho-chi-minh-1280.jpg",
    "imageWidth": 1920,
    "imageHeight": 1474,
    "alt": "Ayuntamiento histórico de Ciudad Ho Chi Minh",
    "photoAuthor": "Steffen Schmitz (more photos)",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Ho_Chi_Minh_City,_City_Hall,_2020-01_CN-03.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "ho-chi-minh-opcion-1",
        "name": "Horizonte Ciudad Ho Chi Minh",
        "stars": 3,
        "area": "Ben Nghe",
        "rate": 1612,
        "image": "hoteles/hotel-ho-chi-minh-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Ciudad Ho Chi Minh; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_S%C3%A3o_Paulo_2023_048.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "ho-chi-minh-opcion-2",
        "name": "Casa Aurora Ciudad Ho Chi Minh",
        "stars": 4,
        "area": "Ben Thanh",
        "rate": 2096,
        "image": "hoteles/hotel-ho-chi-minh-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Ciudad Ho Chi Minh; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Tallinn_2024_477.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "ho-chi-minh-opcion-3",
        "name": "Panorama Ciudad Ho Chi Minh",
        "stars": 5,
        "area": "Cholon",
        "rate": 2902,
        "image": "hoteles/hotel-ho-chi-minh-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Ciudad Ho Chi Minh; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Wiki_Indaba_2024_145.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "delhi",
    "name": "Delhi",
    "country": "India",
    "type": "cultura",
    "tag": "Capital de contrastes",
    "signature": "Historia mogola y grandes avenidas",
    "intro": "Delhi reúne ciudades históricas, monumentos y mercados que cuentan distintas épocas de la India.",
    "description": "Alterna el ambiente de Old Delhi con jardines y conjuntos monumentales del sur. Organizar las visitas por zonas ayuda a disfrutarla con más calma.",
    "highlights": [
      "Fuerte Rojo",
      "Tumba de Humayun",
      "Qutub Minar"
    ],
    "tip": "Comprueba normas de vestimenta en templos y reserva tiempo adicional por el tráfico.",
    "arrival": "Delhi",
    "transfer": "Airport Express o taxi autorizado hacia Delhi; traslado al hotel no incluido.",
    "airport": {
      "code": "DEL",
      "name": "Indira Gandhi International, Delhi"
    },
    "nights": 4,
    "economy": 28080,
    "duration": 1500,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-delhi.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/delhi.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/delhi-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1920,
    "alt": "Puerta de la India al amanecer en Delhi",
    "photoAuthor": "Kajalbeniwal19",
    "photoSource": "https://commons.wikimedia.org/wiki/File:India_gate_at_sunrise.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "delhi-opcion-1",
        "name": "Horizonte Delhi",
        "stars": 3,
        "area": "Connaught Place",
        "rate": 1690,
        "image": "hoteles/hotel-delhi-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Delhi; oferta de demostración.",
        "photoAuthor": "Photograph by Mike Peel (www.mikepeel.net).",
        "photoSource": "https://commons.wikimedia.org/wiki/File:At_Wiki_Indaba_2024_143.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "delhi-opcion-2",
        "name": "Casa Aurora Delhi",
        "stars": 4,
        "area": "Karol Bagh",
        "rate": 2197,
        "image": "hoteles/hotel-delhi-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Delhi; oferta de demostración.",
        "photoAuthor": "Tonylyongreas",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Room%40africana.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "delhi-opcion-3",
        "name": "Panorama Delhi",
        "stars": 5,
        "area": "Hauz Khas",
        "rate": 3042,
        "image": "hoteles/hotel-delhi-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Delhi; oferta de demostración.",
        "photoAuthor": "Mx. Granger",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Room_at_the_President_Hotel_Auckland.jpg",
        "photoLicense": "Public domain",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "mumbai",
    "name": "Mumbai",
    "country": "India",
    "type": "cultura",
    "tag": "Patrimonio junto al mar",
    "signature": "La ciudad que mira al mar Arábigo",
    "intro": "Mumbai combina arquitectura histórica, mercados y paseos costeros llenos de actividad.",
    "description": "Descubre el sur de la ciudad entre Colaba, Kala Ghoda y Marine Drive. Una salida a Elephanta añade patrimonio insular a la estancia urbana.",
    "highlights": [
      "Gateway of India",
      "Marine Drive",
      "Cuevas de Elephanta"
    ],
    "tip": "Consulta el estado del mar antes de ir a Elephanta y deja margen amplio para desplazamientos.",
    "arrival": "Mumbai",
    "transfer": "Taxi autorizado u opciones de transporte urbano según terminal; traslado al hotel no incluido.",
    "airport": {
      "code": "BOM",
      "name": "Chhatrapati Shivaji Maharaj International"
    },
    "nights": 4,
    "economy": 28600,
    "duration": 1500,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-mumbai.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/mumbai.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/mumbai-1280.jpg",
    "imageWidth": 1920,
    "imageHeight": 1439,
    "alt": "Puente Bandra-Worli Sea Link sobre el mar en Mumbai",
    "photoAuthor": "Rutiknatekar",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Mumbai_Bandra-Worli_Sea_Link.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "mumbai-opcion-1",
        "name": "Horizonte Mumbai",
        "stars": 3,
        "area": "Colaba",
        "rate": 2210,
        "image": "hoteles/hotel-mumbai-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Mumbai; oferta de demostración.",
        "photoAuthor": "Decoyboy",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Southbeachhotel-room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "mumbai-opcion-2",
        "name": "Casa Aurora Mumbai",
        "stars": 4,
        "area": "Fort",
        "rate": 2873,
        "image": "hoteles/hotel-mumbai-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Mumbai; oferta de demostración.",
        "photoAuthor": "Aishagrawal27",
        "photoSource": "https://commons.wikimedia.org/wiki/File:SuperDeluxe_Triple_Bed_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "mumbai-opcion-3",
        "name": "Panorama Mumbai",
        "stars": 5,
        "area": "Bandra",
        "rate": 3978,
        "image": "hoteles/hotel-mumbai-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Mumbai; oferta de demostración.",
        "photoAuthor": "M.Tarnowski",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Sypialnia_ks._marsz._Izabeli_Lubomirskiej.JPG",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "agra",
    "name": "Agra",
    "country": "India",
    "type": "cultura",
    "tag": "Arquitectura mogola",
    "signature": "Mármol y jardines a orillas del Yamuna",
    "intro": "Agra invita a descubrir el Taj Mahal y otras grandes obras del patrimonio mogol.",
    "description": "Organiza la visita al Taj con tiempo y completa el viaje con fortalezas, jardines y mercados. Las vistas desde la otra orilla muestran un paisaje diferente.",
    "highlights": [
      "Taj Mahal",
      "Fuerte de Agra",
      "Mehtab Bagh"
    ],
    "tip": "Confirma el calendario de apertura del Taj Mahal: la visita turística cierra los viernes.",
    "arrival": "Delhi",
    "transfer": "Llegada aérea a Delhi; continuar a Agra por carretera o tren con conexión terrestre. Reserva una jornada de traslado y verifica horarios. No está incluido.",
    "airport": {
      "code": "DEL",
      "name": "Indira Gandhi International, Delhi"
    },
    "nights": 3,
    "economy": 28080,
    "duration": 1500,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-agra.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/agra.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/agra-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1683,
    "alt": "Taj Mahal y su estanque reflectante en Agra",
    "photoAuthor": "Yann (talk)",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "agra-opcion-1",
        "name": "Horizonte Agra",
        "stars": 3,
        "area": "Taj Ganj",
        "rate": 1690,
        "image": "hoteles/hotel-agra-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Agra; oferta de demostración.",
        "photoAuthor": "Paradisus Bali",
        "photoSource": "https://commons.wikimedia.org/wiki/File:The_Reserve_Garden_Villa_at_Paradisus_by_Meli%C3%A1_Bali.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "agra-opcion-2",
        "name": "Casa Aurora Agra",
        "stars": 4,
        "area": "Fatehabad Road",
        "rate": 2197,
        "image": "hoteles/hotel-agra-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Agra; oferta de demostración.",
        "photoAuthor": "Matt @ PEK from Taipei, Taiwan",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Deluxe_Suite_Bedroom_(5547903570).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "agra-opcion-3",
        "name": "Panorama Agra",
        "stars": 5,
        "area": "Sadar Bazaar",
        "rate": 3042,
        "image": "hoteles/hotel-agra-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Agra; oferta de demostración.",
        "photoAuthor": "The Down Town Hotel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:The_Suite_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "jaipur",
    "name": "Jaipur",
    "country": "India",
    "type": "cultura",
    "tag": "Palacios y bazares",
    "signature": "La ciudad rosa de Rajasthan",
    "intro": "Jaipur ofrece palacios, observatorios y mercados de artesanía en un entorno de colinas.",
    "description": "El trazado de la ciudad vieja facilita combinar monumentos y bazares. Amber merece una salida propia para recorrer su fortaleza y sus alrededores.",
    "highlights": [
      "Hawa Mahal",
      "City Palace",
      "Fuerte Amber"
    ],
    "tip": "Protege tu visita del calor y planifica los fuertes con vehículo reservado por separado.",
    "arrival": "Jaipur",
    "transfer": "Taxi autorizado hacia Jaipur; traslado al alojamiento no incluido.",
    "airport": {
      "code": "JAI",
      "name": "Jaipur International"
    },
    "nights": 4,
    "economy": 29120,
    "duration": 1620,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-jaipur.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/jaipur.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/jaipur-1280.jpg",
    "imageWidth": 1920,
    "imageHeight": 1440,
    "alt": "Fachada rosa del Hawa Mahal en Jaipur",
    "photoAuthor": "Chainwit.",
    "photoSource": "https://commons.wikimedia.org/wiki/File:East_facade_Hawa_Mahal_Jaipur_from_ground_level_(July_2022)_-_img_01.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "jaipur-opcion-1",
        "name": "Horizonte Jaipur",
        "stars": 3,
        "area": "Pink City",
        "rate": 1768,
        "image": "hoteles/hotel-jaipur-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Jaipur; oferta de demostración.",
        "photoAuthor": "Eddie Maloney from  North Las Vegas, USA",
        "photoSource": "https://commons.wikimedia.org/wiki/File:EM_ROOM-WYNN_RESORT_(2844214667).jpg",
        "photoLicense": "CC BY-SA 2.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "jaipur-opcion-2",
        "name": "Casa Aurora Jaipur",
        "stars": 4,
        "area": "C-Scheme",
        "rate": 2298,
        "image": "hoteles/hotel-jaipur-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Jaipur; oferta de demostración.",
        "photoAuthor": "BTLVEC",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Tower_premium_king_room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "jaipur-opcion-3",
        "name": "Panorama Jaipur",
        "stars": 5,
        "area": "Bani Park",
        "rate": 3182,
        "image": "hoteles/hotel-jaipur-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Jaipur; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:TripInn,_Essen_(P1160424).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "el-cairo",
    "name": "El Cairo",
    "country": "Egipto",
    "type": "cultura",
    "tag": "Patrimonio del Nilo",
    "signature": "Una ciudad junto a milenios de historia",
    "intro": "El Cairo permite combinar barrios históricos con los grandes monumentos de la región de Giza.",
    "description": "Explora sus mercados y museos en jornadas separadas. Las pirámides se encuentran en Giza y requieren un traslado desde el centro de El Cairo.",
    "highlights": [
      "Pirámides de Giza",
      "Museo Egipcio",
      "Khan el-Khalili"
    ],
    "tip": "Reserva tiempo adicional para el tráfico entre El Cairo y Giza, especialmente al volver al aeropuerto.",
    "arrival": "El Cairo",
    "transfer": "Taxi autorizado o traslado reservado hacia El Cairo o Giza; servicio terrestre no incluido.",
    "airport": {
      "code": "CAI",
      "name": "El Cairo International"
    },
    "nights": 5,
    "economy": 26520,
    "duration": 1380,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-el-cairo.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/el-cairo.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/el-cairo-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1700,
    "alt": "Ópera de El Cairo, parque Al Hurriyah y río Nilo",
    "photoAuthor": "Jorge Láscar from Melbourne, Australia",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Cairo_Opera_House,_Al_Hurriyah_Park_and_the_Nile_river_(14797782354).jpg",
    "photoLicense": "CC BY 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "hotels": [
      {
        "id": "el-cairo-opcion-1",
        "name": "Horizonte El Cairo",
        "stars": 3,
        "area": "Zamalek",
        "rate": 2028,
        "image": "hoteles/hotel-el-cairo-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de El Cairo; oferta de demostración.",
        "photoAuthor": "BTLVEC",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Tower_premium.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "el-cairo-opcion-2",
        "name": "Casa Aurora El Cairo",
        "stars": 4,
        "area": "Downtown Cairo",
        "rate": 2636,
        "image": "hoteles/hotel-el-cairo-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de El Cairo; oferta de demostración.",
        "photoAuthor": "Kklerks",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Gastenkamer.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "el-cairo-opcion-3",
        "name": "Panorama El Cairo",
        "stars": 5,
        "area": "Garden City",
        "rate": 3650,
        "image": "hoteles/hotel-el-cairo-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de El Cairo; oferta de demostración.",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Guadalajara,_Jalisco,_Mexico_(2021)_-_001.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "marrakech",
    "name": "Marrakech",
    "country": "Marruecos",
    "type": "cultura",
    "tag": "Medina y jardines",
    "signature": "Patios y colores al pie del Atlas",
    "intro": "Marrakech combina el bullicio de la medina con palacios, jardines y barrios modernos.",
    "description": "Deja tiempo para orientarte entre zocos y callejones. Los patios históricos y los jardines ofrecen pausas tranquilas entre jornadas de exploración.",
    "highlights": [
      "Jemaa el-Fna",
      "Palacio de la Bahía",
      "Jardín Majorelle"
    ],
    "tip": "Acuerda tarifas antes de contratar servicios y reserva los jardines de mayor demanda.",
    "arrival": "Marrakech",
    "transfer": "Autobús o taxi autorizado; algunos alojamientos de la medina requieren un tramo a pie. Traslado no incluido.",
    "airport": {
      "code": "RAK",
      "name": "Marrakech-Menara"
    },
    "nights": 4,
    "economy": 24440,
    "duration": 1200,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-marrakech.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/marrakech.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/marrakech-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1440,
    "alt": "Mezquita Koutoubia y jardines de Marrakech",
    "photoAuthor": "Philippe Salgarolo",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Marrakech_Koutoubia.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "marrakech-opcion-1",
        "name": "Horizonte Marrakech",
        "stars": 3,
        "area": "Medina",
        "rate": 2132,
        "image": "hoteles/hotel-marrakech-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Marrakech; oferta de demostración.",
        "photoAuthor": "Indushotel",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Wedding_Suite.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "marrakech-opcion-2",
        "name": "Casa Aurora Marrakech",
        "stars": 4,
        "area": "Gueliz",
        "rate": 2772,
        "image": "hoteles/hotel-marrakech-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Marrakech; oferta de demostración.",
        "photoAuthor": "deror_avi",
        "photoSource": "https://commons.wikimedia.org/wiki/File:HK_Four_Seasons_Hotel_IMG_4918.JPG",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "marrakech-opcion-3",
        "name": "Panorama Marrakech",
        "stars": 5,
        "area": "Hivernage",
        "rate": 3838,
        "image": "hoteles/hotel-marrakech-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Marrakech; oferta de demostración.",
        "photoAuthor": "Matti Blume",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Central,_Friedrichshafen_(OW1A0355-Pano).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "ciudad-del-cabo",
    "name": "Ciudad del Cabo",
    "country": "Sudáfrica",
    "type": "naturaleza",
    "tag": "Montaña y océano",
    "signature": "Naturaleza al borde de la ciudad",
    "intro": "Ciudad del Cabo se extiende entre Table Mountain, barrios históricos y la costa atlántica.",
    "description": "Combina paisajes, paseos urbanos y la cocina del Cabo. El viento y las nubes pueden cambiar los planes de montaña, por lo que conviene mantener flexibilidad.",
    "highlights": [
      "Table Mountain",
      "Bo-Kaap",
      "V&A Waterfront"
    ],
    "tip": "Revisa el estado del teleférico y el tiempo antes de subir a Table Mountain.",
    "arrival": "Ciudad del Cabo",
    "transfer": "Taxi autorizado o traslado contratado hasta la ciudad; servicio no incluido.",
    "airport": {
      "code": "CPT",
      "name": "Ciudad del Cabo International"
    },
    "nights": 6,
    "economy": 33280,
    "duration": 1800,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-ciudad-del-cabo.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/ciudad-del-cabo.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/ciudad-del-cabo-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1479,
    "alt": "Playa de Camps Bay y montañas en Ciudad del Cabo",
    "photoAuthor": "Der Berzerker from Washington, DC, USA",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Camps_bay_(53460319478)_(cropped).jpg",
    "photoLicense": "CC BY-SA 2.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "hotels": [
      {
        "id": "ciudad-del-cabo-opcion-1",
        "name": "Horizonte Ciudad del Cabo",
        "stars": 3,
        "area": "City Bowl",
        "rate": 2860,
        "image": "hoteles/hotel-ciudad-del-cabo-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Ciudad del Cabo; oferta de demostración.",
        "photoAuthor": "ART HOTEL BISHKEK-KYRGYZSTAN",
        "photoSource": "https://commons.wikimedia.org/wiki/File:%D0%94%D0%B2%D1%83%D1%85%D0%BC%D0%B5%D1%81%D1%82%D0%BD%D1%8B%D0%B9_%D0%BD%D0%BE%D0%BC%D0%B5%D1%80_%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5_%D0%BA%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D0%B8_.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "ciudad-del-cabo-opcion-2",
        "name": "Casa Aurora Ciudad del Cabo",
        "stars": 4,
        "area": "Sea Point",
        "rate": 3718,
        "image": "hoteles/hotel-ciudad-del-cabo-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Ciudad del Cabo; oferta de demostración.",
        "photoAuthor": "Teetrikart",
        "photoSource": "https://commons.wikimedia.org/wiki/File:%E0%B8%AB%E0%B9%89%E0%B8%AD%E0%B8%87_VIP_Room.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "ciudad-del-cabo-opcion-3",
        "name": "Panorama Ciudad del Cabo",
        "stars": 5,
        "area": "Green Point",
        "rate": 5148,
        "image": "hoteles/hotel-ciudad-del-cabo-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Ciudad del Cabo; oferta de demostración.",
        "photoAuthor": "Famartin",
        "photoSource": "https://commons.wikimedia.org/wiki/File:2021-10-11_17_20_14_View_across_a_standard_king_bedroom_towards_the_balcony_on_the_22nd_floor_of_the_Diamond_Head_Tower_at_the_Hyatt_Regency_Waikiki_Resort_and_Spa_in_Waikiki,_Honolulu,_Oahu,_Hawaii.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "meca",
    "name": "La Meca",
    "country": "Arabia Saudita",
    "type": "cultura",
    "tag": "Patrimonio espiritual",
    "signature": "Un destino sagrado para viajeros musulmanes",
    "intro": "La Meca es un centro de peregrinación y patrimonio islámico con acceso reservado a musulmanes.",
    "description": "La estancia debe organizarse según los requisitos oficiales de entrada y peregrinación. Las propuestas culturales son de demostración y no incluyen permisos ni servicios de Hajj o Umrah.",
    "highlights": [
      "Masjid al-Haram",
      "Hira Cultural District",
      "Abraj Al Bait"
    ],
    "tip": "Acceso solo para musulmanes. Verifica visado, permisos y restricciones estacionales oficiales; una reserva demo no autoriza la peregrinación.",
    "arrival": "Yeda",
    "transfer": "Llegada aérea a Yeda; continuar a La Meca en tren Haramain con enlace local o por carretera. Traslado y permisos no incluidos.",
    "airport": {
      "code": "JED",
      "name": "Rey Abdulaziz International, Yeda"
    },
    "nights": 5,
    "economy": 29380,
    "duration": 1500,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-meca.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/meca.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/meca-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1722,
    "alt": "Gran Mezquita y Kaaba en La Meca",
    "photoAuthor": "Saudipics.com",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Mecca1.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "meca-opcion-1",
        "name": "Horizonte La Meca",
        "stars": 3,
        "area": "Ajyad",
        "rate": 3120,
        "image": "hoteles/hotel-meca-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de La Meca; oferta de demostración.",
        "photoAuthor": "Famartin",
        "photoSource": "https://commons.wikimedia.org/wiki/File:2021-10-11_17_21_07_View_across_a_standard_king_bedroom_towards_the_exit_on_the_22nd_floor_of_the_Diamond_Head_Tower_at_the_Hyatt_Regency_Waikiki_Resort_and_Spa_in_Waikiki,_Honolulu,_Oahu,_Hawaii.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "meca-opcion-2",
        "name": "Casa Aurora La Meca",
        "stars": 4,
        "area": "Al Aziziyah",
        "rate": 4056,
        "image": "hoteles/hotel-meca-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de La Meca; oferta de demostración.",
        "photoAuthor": ".mw-parser-output .commons-creator-table{background-color:#f0f0ff;box-sizing:border-box;font-size:95%;text-align:start;color:inherit}.mw-parser-output .commons-creator-table>tbody>tr{vertical-align:top}.mw-parser-output .commons-creator-table>tbody>tr>th{background-color:var(--background-color-neutral,#e0e0ee);font-weight:bold;text-align:start;color:inherit}.mw-parser-output .mw-collapsible-toggle-expanded.mw-collapsible-arrowtoggle,.mw-parser-output .mw-collapsible-toggle-expanded .mw-collapsible-arrowtoggle{padding-left:20px!important;background-image:url(\"https://upload.wikimedia.org/wikipedia/commons/1/10/MediaWiki_Vector_skin_action_arrow.png\");background-repeat:no-repeat;background-position:left center}.mw-parser-output .mw-collapsible-toggle-collapsed.mw-collapsible-arrowtoggle,.mw-parser-output .mw-collapsible-toggle-collapsed .mw-collapsible-arrowtoggle{padding-left:20px!important;background-repeat:no-repeat}.mw-parser-output .commons-creator-table[dir=\"ltr\"] .mw-collapsible-toggle-collapsed.mw-collapsible-arrowtoggle,.mw-parser-output .commons-creator-table[dir=\"ltr\"] .mw-collapsible-toggle-collapsed .mw-collapsible-arrowtoggle{background-image:url(\"https://upload.wikimedia.org/wikipedia/commons/4/41/MediaWiki_Vector_skin_right_arrow.png\");background-position:left center}.mw-parser-output .commons-creator-table[dir=\"rtl\"] .mw-collapsible-toggle-collapsed.mw-collapsible-arrowtoggle,.mw-parser-output .commons-creator-table[dir=\"rtl\"] .mw-collapsible-toggle-collapsed .mw-collapsible-arrowtoggle{background-image:url(\"https://upload.wikimedia.org/wikipedia/commons/1/1e/MediaWiki_Vector_skin_left_arrow.png\");background-position:right center}@media(max-width:719px){.mw-parser-output .commons-creator-table,.mw-parser-output .commons-creator-table>tbody{box-sizing:border-box;display:block;width:100%}.mw-parser-output .commons-creator-table>tbody{border-right:1px solid var(--border-color-base,#aaa);border-bottom:1px solid var(--border-color-base,#aaa)}.mw-parser-output .commons-creator-table>tbody>tr{border-top:1px solid var(--border-color-base,#aaa);display:flex;flex-wrap:wrap}.mw-parser-output .commons-creator-table>tbody>tr>th{border-left:1px solid var(--border-color-base,#aaa);padding:2px;flex:1 1 100%}.mw-parser-output .commons-creator-table>tbody>tr>td{border-left:1px solid var(--border-color-base,#aaa);padding:2px;flex:1 1}}@media(min-width:720px){.mw-parser-output .commons-creator-table{border:1px solid var(--border-color-base,#aaa);border-collapse:collapse;border-spacing:0;padding:5px}.mw-parser-output .commons-creator-table>tbody>tr>th,.mw-parser-output .commons-creator-table>tbody>tr>td{border:1px solid var(--border-color-base,#aaa);padding:2px}.mw-parser-output .commons-creator-table>tbody>tr>.halfwidth{max-width:10em}.mw-parser-output .commons-creator-table>tbody>tr>.fullwidth{max-width:20em}}@media screen{html.skin-theme-clientpref-night .mw-parser-output .commons-creator-table{background-color:#0c0b19}}@media screen and (prefers-color-scheme:dark){html.skin-theme-clientpref-os .mw-parser-output .commons-creator-table{background-color:#0c0b19}}\n\n\nBenoît Prieur (1975–)",
        "photoSource": "https://commons.wikimedia.org/wiki/File:H%C3%B4tel_Ibis_d%27Erevan_-_chambre.JPG",
        "photoLicense": "Public domain",
        "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "meca-opcion-3",
        "name": "Panorama La Meca",
        "stars": 5,
        "area": "Al Misfalah",
        "rate": 5616,
        "image": "hoteles/hotel-meca-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de La Meca; oferta de demostración.",
        "photoAuthor": "فندق درة النعيم",
        "photoSource": "https://commons.wikimedia.org/wiki/File:26%D8%B5%D9%88%D8%B1_%D8%A7%D9%84%D9%81%D9%86%D8%AF%D9%82.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "medina",
    "name": "Medina",
    "country": "Arabia Saudita",
    "type": "cultura",
    "tag": "Historia y recogimiento",
    "signature": "Memoria islámica entre oasis y montañas",
    "intro": "Medina reúne patrimonio espiritual, antiguos caminos y paisajes del oeste saudí.",
    "description": "Planifica los recorridos de acuerdo con las restricciones de cada recinto. La Mezquita del Profeta y sus dependencias están reservadas a musulmanes; otros accesos deben confirmarse localmente.",
    "highlights": [
      "Mezquita del Profeta",
      "Mezquita Quba",
      "Monte Uhud"
    ],
    "tip": "Los no musulmanes no pueden entrar a la Mezquita del Profeta ni a sus recintos. Confirma permisos y normas de los demás lugares antes de la visita.",
    "arrival": "Medina",
    "transfer": "Autobús o taxi autorizado hacia Medina; traslado al hotel no incluido.",
    "airport": {
      "code": "MED",
      "name": "Príncipe Mohammad bin Abdulaziz International"
    },
    "nights": 4,
    "economy": 28860,
    "duration": 1500,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-medina.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/medina.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/medina-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1707,
    "alt": "Vista aérea de la Mezquita del Profeta en Medina",
    "photoAuthor": "Konevi",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Al-Masjid_An-Nabawi_(Bird%27s_Eye_View).jpg",
    "photoLicense": "CC0",
    "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "hotels": [
      {
        "id": "medina-opcion-1",
        "name": "Horizonte Medina",
        "stars": 3,
        "area": "Bada'ah",
        "rate": 2730,
        "image": "hoteles/hotel-medina-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Medina; oferta de demostración.",
        "photoAuthor": "Another Believer",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Indianapolis,_October_2,_2024_-_004.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "medina-opcion-2",
        "name": "Casa Aurora Medina",
        "stars": 4,
        "area": "Qurban",
        "rate": 3549,
        "image": "hoteles/hotel-medina-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Medina; oferta de demostración.",
        "photoAuthor": "© 1971markus",
        "photoSource": "https://commons.wikimedia.org/wiki/File:29._Bonner_Stammtisch,_Petersberg_(Hotel-Suite_1.OG).jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "medina-opcion-3",
        "name": "Panorama Medina",
        "stars": 5,
        "area": "Al Aridh",
        "rate": 4914,
        "image": "hoteles/hotel-medina-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Medina; oferta de demostración.",
        "photoAuthor": "فندق درة النعيم",
        "photoSource": "https://commons.wikimedia.org/wiki/File:62%D8%B5%D9%88%D8%B1_%D8%A7%D9%84%D9%81%D9%86%D8%AF%D9%82.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  },
  {
    "id": "shenzhen",
    "name": "Shenzhen",
    "country": "China",
    "type": "cultura",
    "tag": "Diseño y bahía",
    "signature": "Una metrópoli creativa frente al mar",
    "intro": "Shenzhen combina arquitectura contemporánea, barrios comerciales y grandes parques urbanos.",
    "description": "Explora sus distritos por separado para apreciar la variedad de la ciudad. El diseño de OCT, los mercados de Luohu y los parques de Futian muestran facetas complementarias.",
    "highlights": [
      "OCT-LOFT",
      "Lianhuashan Park",
      "Shenzhen Bay Park"
    ],
    "tip": "Agrupa las visitas por distritos y usa el metro para evitar desplazamientos largos por carretera.",
    "arrival": "Shenzhen",
    "transfer": "Metro o taxi autorizado hacia Shenzhen; traslado y enlaces al hotel no incluidos.",
    "airport": {
      "code": "SZX",
      "name": "Shenzhen Bao'an International"
    },
    "nights": 4,
    "economy": 30940,
    "duration": 1680,
    "region": "internacional",
    "image": "imagenes-viajes/destinos/destino-shenzhen.jpg",
    "thumbnail": "imagenes-viajes/destinos/miniaturas/shenzhen.jpg",
    "mediumImage": "imagenes-viajes/destinos/miniaturas/shenzhen-1280.jpg",
    "imageWidth": 2560,
    "imageHeight": 1707,
    "alt": "Rascacielos del distrito de Futian en Shenzhen",
    "photoAuthor": "Charlie fong",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Commercial_area_of_futian_to_east2020.jpg",
    "photoLicense": "CC BY-SA 4.0",
    "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "hotels": [
      {
        "id": "shenzhen-opcion-1",
        "name": "Horizonte Shenzhen",
        "stars": 3,
        "area": "Futian",
        "rate": 2210,
        "image": "hoteles/hotel-shenzhen-opcion-1.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 1 de Shenzhen; oferta de demostración.",
        "photoAuthor": "فندق درة النعيم",
        "photoSource": "https://commons.wikimedia.org/wiki/File:56%D8%B5%D9%88%D8%B1_%D8%A7%D9%84%D9%81%D9%86%D8%AF%D9%82.jpg",
        "photoLicense": "CC BY-SA 4.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
        "amenities": [
          "Wi-Fi",
          "Aire acondicionado"
        ]
      },
      {
        "id": "shenzhen-opcion-2",
        "name": "Casa Aurora Shenzhen",
        "stars": 4,
        "area": "Nanshan",
        "rate": 2873,
        "image": "hoteles/hotel-shenzhen-opcion-2.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 2 de Shenzhen; oferta de demostración.",
        "photoAuthor": "Takeaway",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Mandarin_Oriental_Dhara_Dhevi_Chiang_Mai_03.jpg",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno"
        ]
      },
      {
        "id": "shenzhen-opcion-3",
        "name": "Panorama Shenzhen",
        "stars": 5,
        "area": "Luohu",
        "rate": 3978,
        "image": "hoteles/hotel-shenzhen-opcion-3.jpg",
        "imageAlt": "Fotografía de referencia de alojamiento para la opción 3 de Shenzhen; oferta de demostración.",
        "photoAuthor": "Deror_avi",
        "photoSource": "https://commons.wikimedia.org/wiki/File:Lotte_Hotel_P1070682.JPG",
        "photoLicense": "CC BY-SA 3.0",
        "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
        "amenities": [
          "Wi-Fi",
          "Desayuno",
          "Estacionamiento"
        ]
      }
    ]
  }
]);
// END DESTINOS OCTUBRE 2026
  destinations.push(...additionalDestinations);

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
      venecia: { percent: 20, name: 'Resumen del viaje: Italia' },
      paris: { percent: 10, name: 'Escapadas a París' },
      barcelona: { percent: 10, name: 'Escapadas a Barcelona' }
  };
  if (window.RumboDatabase?.connected) {
    const catalog = window.RumboDatabase.catalog;
    destinations.splice(0, destinations.length, ...catalog.destinations);
    // Mantiene las nuevas propuestas hasta que se actualice el catálogo SQL.
    // Los registros existentes en SQL conservan prioridad.
    destinations.push(...additionalDestinations.filter(item => !destinations.some(saved => saved.id === item.id)));
    for (const key of Object.keys(rooms)) delete rooms[key];
    Object.assign(rooms, catalog.rooms);
    origins.splice(0, origins.length, ...catalog.origins);
    for (const key of Object.keys(promotions)) delete promotions[key];
    Object.assign(promotions, catalog.promotions);
  }
  // Fotografías locales completas, con tamaños adaptados a cada pantalla.
  const destinationPhotos = {
    "roatan": ["playa.jpg", 2560, 1707, "Playa de arena blanca y palmeras frente al mar turquesa de Roatán", "Playas de West Bay y West End, manglares y recorridos por la isla."],
    "san-jose": ["destino-san-jose-teatro.jpg", 2560, 1920, "Fachada del Teatro Nacional en San José, Costa Rica", "Museos, mercados y parques en el Valle Central de Costa Rica."],
    "paris": ["destino-paris.jpg", 2560, 1600, "Vista de París; fotografía de Wikimedia Commons", "Museos, cafés y paseos junto al Sena en la capital francesa."],
    "bali": ["bali.jpg", 2560, 1707, "Templo Ulun Danu Bratan junto al lago en Bali", "Templos de Tanah Lot y Uluwatu, arrozales de Ubud y costa de Sanur."],
    "venecia": ["destino-venecia-rialto.jpg", 2560, 1401, "El Gran Canal de Venecia desde el puente de Rialto", "Canales, puentes y plazas para descubrir a pie."],
    "osaka": ["destino-osaka.jpg", 2560, 1706, "Vista de Osaka; fotografía de Wikimedia Commons", "Gastronomía, barrios animados y cultura urbana japonesa."],
    "nueva-york": ["destino-nueva-york.jpg", 2560, 1703, "Vista de Nueva York; fotografía de Wikimedia Commons", "Central Park, el puente de Brooklyn y los barrios de Manhattan."],
    "barcelona": ["destino-barcelona-sagrada-familia.jpg", 3840, 2560, "La Sagrada Familia iluminada al anochecer, con su reflejo en el estanque", "Arquitectura, gastronomía y paseos junto al Mediterráneo."],
    "roma": ["destino-roma.jpg", 2560, 1701, "Vista de Roma; fotografía de Wikimedia Commons", "Coliseo, plazas de Trastevere y jardines de Villa Borghese."],
    "ciudad-guatemala": ["destino-ciudad-guatemala.jpg", 2560, 1555, "Vista de Ciudad de Guatemala; fotografía de Wikimedia Commons", "Museos, mercados y barrios para una escapada urbana."],
    "panama": ["destino-panama.jpg", 2048, 1152, "Vista de Ciudad de Panamá; fotografía de Wikimedia Commons", "Casco Antiguo, Cerro Ancón y Parque Natural Metropolitano."],
    "cancun": ["destino-cancun.jpg", 2560, 1438, "Vista de Cancún; fotografía de Wikimedia Commons", "Playa Delfines, laguna Nichupté y sitio arqueológico El Rey."],
    "miami": ["destino-miami.jpg", 2560, 1422, "Vista de Miami; fotografía de Wikimedia Commons", "South Beach, Little Havana y jardines de Vizcaya."],
    "madrid": ["destino-madrid-cibeles.jpg", 3840, 2400, "Palacio y fuente de Cibeles iluminados por la noche en Madrid", "Parque de El Retiro, Plaza Mayor y mercados del centro."],
    "londres": ["destino-londres.jpg", 2560, 1259, "Vista de Londres", "Museos, mercados y paseos por las orillas del Támesis."],
    "lisboa": ["destino-lisboa.jpg", 2560, 1392, "Vista de las colinas y los tejados de Lisboa", "Tranvías, miradores y barrios para recorrer junto al Tajo."],
    "rio-janeiro": ["destino-rio-janeiro.jpg", 2560, 1444, "Cristo Redentor sobre el Corcovado, con Río de Janeiro y la bahía al fondo", "Playas de Ipanema, jardines y vistas desde el Pan de Azúcar."],
    "ciudad-mexico": ["destino-ciudad-mexico.jpg", 2272, 1704, "Vista de Ciudad de México, México", "Chapultepec, Coyoacán y museos para recorrer por barrios."],
    "bogota": ["destino-bogota.jpg", 2048, 1120, "Panorama de Bogotá al atardecer", "La Candelaria, el Museo del Oro y vistas desde Monserrate."],
    "cartagena": ["destino-cartagena.jpg", 2560, 1440, "Vista de Cartagena, Colombia", "Murallas, plazas y tardes junto al Caribe colombiano."],
    "lima": ["destino-lima.jpg", 2560, 1696, "Costa y parques de Miraflores en Lima", "Malecón de Miraflores, Barranco y cocina peruana."],
    "buenos-aires": ["destino-buenos-aires.jpg", 2560, 1714, "Puente de la Mujer y edificios de Puerto Madero en Buenos Aires", "Librerías, cafés y paseos por Palermo y San Telmo."],
    "santiago": ["destino-santiago.jpg", 2560, 1707, "Santiago de Chile al anochecer con la cordillera al fondo", "Barrios históricos, parques y vistas desde el cerro San Cristóbal."],
    "medellin": ["destino-medellin.jpg", 2560, 1920, "Vista panorámica de Medellín y las montañas del valle", "Jardín Botánico, parques y recorridos por el valle de Aburrá."],
    "punta-cana": ["destino-punta-cana.jpg", 2560, 1920, "Playa Bávaro en Punta Cana, con palmeras y mar turquesa", "Arena clara, costa de Bávaro y días de descanso junto al mar."],
    "san-salvador": ["destino-san-salvador.jpg", 2560, 1920, "Vista de San Salvador al anochecer con su volcán al fondo", "Centro Histórico, museos y cafés en la capital salvadoreña."],
    "san-juan": ["destino-san-juan.jpg", 2560, 1702, "Vista aérea de la costa y el Viejo San Juan", "Calles del Viejo San Juan, fortalezas y costa de Condado."],
    "los-angeles": ["destino-los-angeles.jpg", 2560, 1707, "Panorama de Los Ángeles con sus rascacielos al atardecer", "Museos, Griffith Park y paseos por Santa Mónica."],
    "las-vegas": ["destino-las-vegas.jpg", 2560, 1762, "Vista de Las Vegas, Estados Unidos", "Espectáculos, gastronomía y recorridos por el Strip."],
    "vancouver": ["destino-vancouver.jpg", 2560, 1920, "Vancouver, su puerto y las montañas al fondo", "Stanley Park, Granville Island y paseos entre bosque y costa."],
    "amsterdam": ["destino-amsterdam.jpg", 2560, 1697, "Canal de Ámsterdam junto a sus casas y puentes", "Canales, museos y recorridos a pie por Jordaan."],
    "berlin": ["destino-berlin.jpg", 1920, 1280, "Vista de Berlín, Alemania", "Isla de los Museos, parques y barrios con historia."],
    "estambul": ["destino-estambul.jpg", 2560, 1237, "Mezquitas y panorama de Estambul al atardecer", "Bazares, mezquitas y recorridos en ferry por el Bósforo."],
    "dubai": ["destino-dubai.jpg", 2560, 1920, "Vista de Dubái, Emiratos Árabes Unidos", "Arquitectura, mercados de Al Fahidi y paseos junto al Creek."],
    "tokio": ["destino-tokio.jpg", 2560, 1928, "Torre de Tokio iluminada y panorama nocturno de la ciudad", "Asakusa, jardines y barrios conectados por tren."],
    "seul": ["destino-seul.jpg", 2560, 1707, "Vista de Seúl, Corea del Sur", "Palacios, mercados y paseos junto al río Han."],
    "singapur": ["destino-singapur.jpg", 2560, 1737, "Vista de Singapur, Singapur", "Jardines botánicos, barrios históricos y paseos por Marina Bay."],
    "sidney": ["destino-sidney.jpg", 2544, 1406, "Ópera de Sídney y su bahía iluminadas de noche", "La bahía, la Ópera y senderos costeros cerca de Bondi."],
    "praga": ["destino-praga.jpg", 2560, 1706, "Vista de Praga y los puentes sobre el río Moldava", "Puente de Carlos, plazas y miradores sobre el Moldava."],
    "toronto": ["destino-toronto.jpg", 2560, 1704, "Vista de Toronto y la torre CN desde las islas", "El lago Ontario, museos y mercados a tu ritmo."]
  };
  const destinationSignatures = {
  "roatan": "Arrecifes y agua turquesa",
  "san-jose": "Café, arte y vida local",
  "paris": "Arte a orillas del Sena",
  "bali": "Templos entre lagos y arrozales",
  "venecia": "La vida junto al Gran Canal",
  "osaka": "Sabores y noches de neón",
  "nueva-york": "La ciudad desde las alturas",
  "barcelona": "Gaudí y el Mediterráneo",
  "roma": "Historia en cada plaza",
  "ciudad-guatemala": "Mercados y cultura viva",
  "panama": "Dos océanos, una ciudad",
  "cancun": "El Caribe en azul turquesa",
  "miami": "Diseño y brisa tropical",
  "madrid": "Arte y tardes de paseo",
  "londres": "Historias junto al Támesis",
  "lisboa": "Miradores y luz del Atlántico",
  "rio-janeiro": "Entre montañas y mar",
  "ciudad-mexico": "Arte, historia y sabor",
  "bogota": "Cultura al pie de los Andes",
  "cartagena": "Murallas frente al Caribe",
  "lima": "Cocina y vistas al Pacífico",
  "buenos-aires": "Cafés, tango y barrios con alma",
  "santiago": "La ciudad bajo los Andes",
  "medellin": "Jardines y vida entre montañas",
  "punta-cana": "Palmeras y días sin prisa",
  "san-salvador": "Cultura a la sombra del volcán",
  "san-juan": "Calles de color junto al mar",
  "los-angeles": "Cine y atardeceres del Pacífico",
  "las-vegas": "Luces que nunca descansan",
  "vancouver": "Bosque, montañas y océano",
  "amsterdam": "Canales y paseos sin prisa",
  "berlin": "Historia y espíritu creativo",
  "estambul": "Encuentro de dos continentes",
  "dubai": "Arquitectura entre mar y desierto",
  "tokio": "Tradición bajo luces de neón",
  "seul": "Palacios y energía urbana",
  "singapur": "Jardines entre rascacielos",
  "sidney": "La ciudad abierta a la bahía",
  "praga": "Puentes y tejados de cuento",
  "toronto": "La ciudad a orillas del Ontario"
};
  destinations.forEach(d => {
    d.signature = destinationSignatures[d.id] || d.signature || d.tag;
    d.imagePosition = ({barcelona:"50% 18%",madrid:"50% 0%"})[d.id] || "50% 50%";
    const photo = destinationPhotos[d.id];
    const photoKey = ({barcelona:"barcelona-sagrada-familia",madrid:"madrid-cibeles",venecia:"venecia-rialto"})[d.id] || d.id;
    if (photo) Object.assign(d, { image: `imagenes-viajes/destinos/${photo[0]}`, imageWidth: photo[1], imageHeight: photo[2], alt: photo[3], intro: photo[4], thumbnail: `imagenes-viajes/destinos/miniaturas/${photoKey}.jpg`, mediumImage: `imagenes-viajes/destinos/miniaturas/${photoKey}-1280.jpg` });
  });
  // BEGIN CATALOGO UNIFORME
  const completeHotelOptions = {
  "ciudad-mexico": [
    {
      "id": "ciudad-mexico-estancia-4",
      "name": "Ciudad de México · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1800,
      "image": "hoteles/estancia-ciudad-mexico-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Basile Morin",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Lobby_lounge_of_Amantaka_Suite_Amantaka_luxury_Resort_%26_Hotel_Luang_Prabang_Laos.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "ciudad-mexico-estancia-5",
      "name": "Ciudad de México · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2325,
      "image": "hoteles/estancia-ciudad-mexico-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Kurt Kaiser",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_in_hotel_room_4.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "bogota": [
    {
      "id": "bogota-estancia-4",
      "name": "Bogotá · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1560,
      "image": "hoteles/estancia-bogota-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Basile Morin",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Restaurant_room_of_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "bogota-estancia-5",
      "name": "Bogotá · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2015,
      "image": "hoteles/estancia-bogota-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ahbmamiat",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Banquet_Room_interior,_Brother_Hotel_20130212.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "cartagena": [
    {
      "id": "cartagena-estancia-4",
      "name": "Cartagena · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2040,
      "image": "hoteles/estancia-cartagena-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Sridhar Rao",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_beds.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "cartagena-estancia-5",
      "name": "Cartagena · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2635,
      "image": "hoteles/estancia-cartagena-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "David Adam Kess",
      "photoSource": "https://commons.wikimedia.org/wiki/File:La_Coupole_Hotel,_Quito_(interior)_pic.b476.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "lima": [
    {
      "id": "lima-estancia-4",
      "name": "Lima · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1920,
      "image": "hoteles/estancia-lima-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "David Adam Kess",
      "photoSource": "https://commons.wikimedia.org/wiki/File:La_Coupole_Hotel,_Quito_(interior)_pic.g1a.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "lima-estancia-5",
      "name": "Lima · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2480,
      "image": "hoteles/estancia-lima-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Jonathan Schilling",
      "photoSource": "https://commons.wikimedia.org/wiki/File:University_Arms_Hotel_-_room_interior_1999.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "buenos-aires": [
    {
      "id": "buenos-aires-estancia-4",
      "name": "Buenos Aires · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2280,
      "image": "hoteles/estancia-buenos-aires-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "David Adam Kess",
      "photoSource": "https://commons.wikimedia.org/wiki/File:La_Coupole_Hotel,_Quito_(interior)_dining_area._4o5.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "buenos-aires-estancia-5",
      "name": "Buenos Aires · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2945,
      "image": "hoteles/estancia-buenos-aires-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Pub. by Bell Block News & Novelty Co., Cincinnati, Ohio. \"Tichnor Quality Views,\" Reg. U. S. Pat. Off. Made Only by Tichnor Bros., Inc., Boston, Mass.",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Skyline_dining_room,_Terrace_Plaza_Hotel,_Cincinnati,_Ohio_(79213).jpg",
      "photoLicense": "Public domain",
      "photoLicenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "santiago": [
    {
      "id": "santiago-estancia-4",
      "name": "Santiago · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2160,
      "image": "hoteles/estancia-santiago-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Yourusernamewillbepublic2",
      "photoSource": "https://commons.wikimedia.org/wiki/File:View_from_hotel_bedroom_window_overlooking_frayed_bed.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "santiago-estancia-5",
      "name": "Santiago · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2790,
      "image": "hoteles/estancia-santiago-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Julius Barclay",
      "photoSource": "https://commons.wikimedia.org/wiki/File:A_bedroom_of_the_Grand_Hotel_Campo_dei_Fiori.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "medellin": [
    {
      "id": "medellin-estancia-4",
      "name": "Medellín · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1680,
      "image": "hoteles/estancia-medellin-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Carissa Rogers",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Kimpton_Hotel_Monaco_Salt_Lake_City,_room_interior.jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "medellin-estancia-5",
      "name": "Medellín · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2170,
      "image": "hoteles/estancia-medellin-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Schezar",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_window_Guoman_Tower_Hotel_2014-03-05.jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "punta-cana": [
    {
      "id": "punta-cana-estancia-4",
      "name": "Punta Cana · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2880,
      "image": "hoteles/estancia-punta-cana-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "This Photo was taken by Wolfgang Moroder.  \n\nFeel free to use my photos, but please mention me as the author and send me a  message. \n\n\n\nThis image is not in the public domain. Please respect the copyright protection. It may only be used according to the rules mentioned here. This specifically excludes use in social media, if applicable terms of the licenses listed here not appropriate.\n\n\n\nPlease do not upload an updated image here without consultation with the Author. The author would like to make corrections only at his own source. This ensures that the changes are preserved.Please if you think that any changes should be required, please inform the author.Otherwise you can upload a new image with a new name. Please use one of the templates derivative or extract.",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Belmond_Grand_Hotel_Europe_Saint_Petersburg_sitting_room_stairways.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "punta-cana-estancia-5",
      "name": "Punta Cana · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3720,
      "image": "hoteles/estancia-punta-cana-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "This Photo was taken by Wolfgang Moroder.  \n\nFeel free to use my photos, but please mention me as the author and send me a  message. \n\n\n\nThis image is not in the public domain. Please respect the copyright protection. It may only be used according to the rules mentioned here. This specifically excludes use in social media, if applicable terms of the licenses listed here not appropriate.\n\n\n\nPlease do not upload an updated image here without consultation with the Author. The author would like to make corrections only at his own source. This ensures that the changes are preserved.Please if you think that any changes should be required, please inform the author.Otherwise you can upload a new image with a new name. Please use one of the templates derivative or extract.",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Belmond_Grand_Hotel_Europe_Saint_Petersburg_sitting_room_2.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "san-salvador": [
    {
      "id": "san-salvador-estancia-4",
      "name": "San Salvador · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1440,
      "image": "hoteles/estancia-san-salvador-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ouuzo",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Rempart_Boutique_Hotel_Diyarbakir_Suite_Room_Interior.jpg",
      "photoLicense": "CC BY 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "san-salvador-estancia-5",
      "name": "San Salvador · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1860,
      "image": "hoteles/estancia-san-salvador-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Rob Farrow",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Burgh_Island_Hotel_-_Dining_Room_(geograph_6005073).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "san-juan": [
    {
      "id": "san-juan-estancia-4",
      "name": "San Juan · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2760,
      "image": "hoteles/estancia-san-juan-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Basile Morin",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Canopy_bed_and_wardrobes_in_Khan_Pool_Suite_at_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "san-juan-estancia-5",
      "name": "San Juan · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3565,
      "image": "hoteles/estancia-san-juan-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Swiscrevolve",
      "photoSource": "https://commons.wikimedia.org/wiki/File:GD_%E5%BB%A3%E6%9D%B1_%E8%82%87%E6%85%B6_Zhaoqing_Pearl_Hotel_Starlake_interior_hall_waiting_room_July_2012.JPG",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "los-angeles": [
    {
      "id": "los-angeles-estancia-4",
      "name": "Los Ángeles · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3360,
      "image": "hoteles/estancia-los-angeles-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Paradisus Bali",
      "photoSource": "https://commons.wikimedia.org/wiki/File:The_Reserve_Junior_Suite_Lagoon_Access_at_Paradisus_by_Meli%C3%A1_Bali.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "los-angeles-estancia-5",
      "name": "Los Ángeles · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4340,
      "image": "hoteles/estancia-los-angeles-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Tangerineduel",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Grand_Island_Hotel_interior_room_side_2006.JPG",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "las-vegas": [
    {
      "id": "las-vegas-estancia-4",
      "name": "Las Vegas · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2760,
      "image": "hoteles/estancia-las-vegas-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Kristina D.C. Hoeppner from Wellington, New Zealand",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_the_Kohinoor_Samudra_(2809899089).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "las-vegas-estancia-5",
      "name": "Las Vegas · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3565,
      "image": "hoteles/estancia-las-vegas-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Missvain",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Aria_Resort_and_Casino_-_Hotel_room_-_Sarah_Stierch_-_Feb_2019_03.jpg",
      "photoLicense": "CC BY 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "vancouver": [
    {
      "id": "vancouver-estancia-4",
      "name": "Vancouver · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3360,
      "image": "hoteles/estancia-vancouver-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Basile Morin",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Canopy_bed_of_Amantaka_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos_5x4.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "vancouver-estancia-5",
      "name": "Vancouver · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4340,
      "image": "hoteles/estancia-vancouver-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotel_Premier_Musashi-Kosugi_single_bedroom_20100618-002.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "amsterdam": [
    {
      "id": "amsterdam-estancia-4",
      "name": "Ámsterdam · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3240,
      "image": "hoteles/estancia-amsterdam-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Virginia State Parks staff",
      "photoSource": "https://commons.wikimedia.org/wiki/File:BC_-_Cabin_7_Bedroom_(5857339143).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "amsterdam-estancia-5",
      "name": "Ámsterdam · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4185,
      "image": "hoteles/estancia-amsterdam-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "N509FZ",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Normal_room_in_Beijing_Hotel_(20150822151912).JPG",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "berlin": [
    {
      "id": "berlin-estancia-4",
      "name": "Berlín · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2640,
      "image": "hoteles/estancia-berlin-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Eliedion",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Bedroom%27s_Pardoes_suite_Efteling_hotel.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "berlin-estancia-5",
      "name": "Berlín · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3410,
      "image": "hoteles/estancia-berlin-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Sean MacEntee from Monaghan, Ireland",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Burlington_Hotel_Bed_(3171851812).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "praga": [
    {
      "id": "praga-estancia-4",
      "name": "Praga · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2160,
      "image": "hoteles/estancia-praga-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Atwngirl",
      "photoSource": "https://commons.wikimedia.org/wiki/File:2022_-_Americus_Hotel_-_Meeting_Room_-_Allentown_PA.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "praga-estancia-5",
      "name": "Praga · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2790,
      "image": "hoteles/estancia-praga-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Stephen Craven",
      "photoSource": "https://commons.wikimedia.org/wiki/File:St_John%27s_Hotel,_Hull_-_pool_room_-_geograph.org.uk_-_7543000.jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "estambul": [
    {
      "id": "estambul-estancia-4",
      "name": "Estambul · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2280,
      "image": "hoteles/estancia-estambul-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Atwngirl",
      "photoSource": "https://commons.wikimedia.org/wiki/File:2022_-_Americus_Hotel_-_Double_Room_-_Allentown_PA.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "estambul-estancia-5",
      "name": "Estambul · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2945,
      "image": "hoteles/estancia-estambul-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Atwngirl",
      "photoSource": "https://commons.wikimedia.org/wiki/File:2022_-_Americus_Hotel_-_King_Room_-_Allentown_PA.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "dubai": [
    {
      "id": "dubai-estancia-4",
      "name": "Dubái · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3120,
      "image": "hoteles/estancia-dubai-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_Amalie_Deluxe_Twin_bedroom_20130531-003.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "dubai-estancia-5",
      "name": "Dubái · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4030,
      "image": "hoteles/estancia-dubai-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Atwngirl",
      "photoSource": "https://commons.wikimedia.org/wiki/File:2022_-_Americus_Hotel_-_Single_Room_-_Allentown_PA.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "tokio": [
    {
      "id": "tokio-estancia-4",
      "name": "Tokio · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3000,
      "image": "hoteles/estancia-tokio-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Tess Mattew",
      "photoSource": "https://commons.wikimedia.org/wiki/File:2025.07.13_Interior_bedroom_Hotel_Hlybokae_02.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "tokio-estancia-5",
      "name": "Tokio · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3875,
      "image": "hoteles/estancia-tokio-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Kobe_Portopia_Hotel_Oval_Club_single_bedroom_20130621-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "seul": [
    {
      "id": "seul-estancia-4",
      "name": "Seúl · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2520,
      "image": "hoteles/estancia-seul-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Andy Li",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Interior_of_a_room_of_The_Market_House,_Reading_2025-05-03.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "seul-estancia-5",
      "name": "Seúl · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3255,
      "image": "hoteles/estancia-seul-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Another Believer",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Room_interior_in_the_Park_Hotel_Tokyo_in_Tokyo,_2019_-_330.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "singapur": [
    {
      "id": "singapur-estancia-4",
      "name": "Singapur · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3360,
      "image": "hoteles/estancia-singapur-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Alan Light",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_(2085899949).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "singapur-estancia-5",
      "name": "Singapur · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4340,
      "image": "hoteles/estancia-singapur-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ridiculopathy",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Interior_of_the_Midland_Hotel,_Manchester,_UK_02.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "sidney": [
    {
      "id": "sidney-estancia-4",
      "name": "Sídney · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3480,
      "image": "hoteles/estancia-sidney-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Andy Li",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Interior_of_a_room_of_Travelodge_Bath_City_Centre_2025-07-22.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "sidney-estancia-5",
      "name": "Sídney · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4495,
      "image": "hoteles/estancia-sidney-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_and_window_at_Hotel_Esplanade_on_a_morning_in_October_2023.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "bangkok": [
    {
      "id": "bangkok-estancia-4",
      "name": "Bangkok · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2122,
      "image": "hoteles/estancia-bangkok-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Clarion_Hotel_Helsinki.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "bangkok-estancia-5",
      "name": "Bangkok · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2740,
      "image": "hoteles/estancia-bangkok-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "PPR 19",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Premier_room,_The_Peninsula_Paris,_4_June_2014.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "hong-kong": [
    {
      "id": "hong-kong-estancia-4",
      "name": "Hong Kong · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4056,
      "image": "hoteles/estancia-hong-kong-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Bed_and_window_at_Elite_Hotel_Ideon_Lund_on_an_evening_in_September_2024.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "hong-kong-estancia-5",
      "name": "Hong Kong · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 5239,
      "image": "hoteles/estancia-hong-kong-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Radisson_Blu_Hotel_Oulu.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "macao": [
    {
      "id": "macao-estancia-4",
      "name": "Macao · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3432,
      "image": "hoteles/estancia-macao-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Liz Lawley from Rochester, NY",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Broadmoor_Hotel,_suite.jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "macao-estancia-5",
      "name": "Macao · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4433,
      "image": "hoteles/estancia-macao-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Fred Cherrygarden",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Grand_Hotel_de_Londres_-_Room_II.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "antalya": [
    {
      "id": "antalya-estancia-4",
      "name": "Antalya · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2652,
      "image": "hoteles/estancia-antalya-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Ideon_Hotel_Lund_on_arrival_day.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "antalya-estancia-5",
      "name": "Antalya · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3426,
      "image": "hoteles/estancia-antalya-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_hotel_Inarin_Kultahovi,_Lapland,_Finland.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "kuala-lumpur": [
    {
      "id": "kuala-lumpur-estancia-4",
      "name": "Kuala Lumpur · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1934,
      "image": "hoteles/estancia-kuala-lumpur-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "OhanaUnitedTalk page",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Kuujjuarapik_Co-op_hotel_room_1.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "kuala-lumpur-estancia-5",
      "name": "Kuala Lumpur · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2499,
      "image": "hoteles/estancia-kuala-lumpur-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "r",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Yanggakdo_International_Hotel_room_2.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "phuket": [
    {
      "id": "phuket-estancia-4",
      "name": "Phuket · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2496,
      "image": "hoteles/estancia-phuket-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ammodramus",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Argo_Hotel_interior_dining_room.jpg",
      "photoLicense": "Public domain",
      "photoLicenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "phuket-estancia-5",
      "name": "Phuket · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3224,
      "image": "hoteles/estancia-phuket-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Mack Male from Edmonton, AB, Canada",
      "photoSource": "https://commons.wikimedia.org/wiki/File:The_hotel_room_(2342690818).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "pattaya": [
    {
      "id": "pattaya-estancia-4",
      "name": "Pattaya · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2184,
      "image": "hoteles/estancia-pattaya-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Michael Coghlan from Adelaide, Australia",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Room_-_Bed_and_Couch_(30381069315).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "pattaya-estancia-5",
      "name": "Pattaya · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2821,
      "image": "hoteles/estancia-pattaya-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Millennium_Mitsui_Garden_Hotel_Tokyo_Superior_Double_bedroom_20170318-002.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "taipei": [
    {
      "id": "taipei-estancia-4",
      "name": "Taipéi · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2964,
      "image": "hoteles/estancia-taipei-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Pittigrilli",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_Paris,_France,_with_metal-sphere-lamp_with_reflections_of_photographer,_2013.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "taipei-estancia-5",
      "name": "Taipéi · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3829,
      "image": "hoteles/estancia-taipei-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_La_Raison_Osaka_Standard_Twin_bedroom_20161216-002.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "milan": [
    {
      "id": "milan-estancia-4",
      "name": "Milán · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3900,
      "image": "hoteles/estancia-milan-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Okura_Kobe_Deluxe_Twin_bedroom_20120928-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "milan-estancia-5",
      "name": "Milán · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 5038,
      "image": "hoteles/estancia-milan-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Elite_Hotel_Ideon_Lund_in_September_2024.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "viena": [
    {
      "id": "viena-estancia-4",
      "name": "Viena · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4056,
      "image": "hoteles/estancia-viena-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Opera Cadet from PARIS, FRANCE",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Seminar_room_2_-_Paris_Opera_Cadet_Hotel.jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "viena-estancia-5",
      "name": "Viena · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 5239,
      "image": "hoteles/estancia-viena-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Richmond_Hotels_single_bedroom_20110806-002.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "atenas": [
    {
      "id": "atenas-estancia-4",
      "name": "Atenas · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3120,
      "image": "hoteles/estancia-atenas-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Casey And Sonja",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Congress_Plaza_Hotel_(Room)_(4347276905).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "atenas-estancia-5",
      "name": "Atenas · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4030,
      "image": "hoteles/estancia-atenas-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "John Pavelka from Austin, TX, USA",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Room_at_the_Amari_Hotel_(7476652362).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "budapest": [
    {
      "id": "budapest-estancia-4",
      "name": "Budapest · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2558,
      "image": "hoteles/estancia-budapest-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Unique Hotels",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Zen_Room_-_Kreutzwald_Hotel_Tallinn.jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "budapest-estancia-5",
      "name": "Budapest · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3305,
      "image": "hoteles/estancia-budapest-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "RobertoGlezV",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Gillow_Room.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "florencia": [
    {
      "id": "florencia-estancia-4",
      "name": "Florencia · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3900,
      "image": "hoteles/estancia-florencia-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Hotel_Kiilop%C3%A4%C3%A4.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "florencia-estancia-5",
      "name": "Florencia · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 5038,
      "image": "hoteles/estancia-florencia-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "阿道",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Interior_of_the_Double_Room_of_H%E2%82%82O_Hotel-02.2024-11-04.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "munich": [
    {
      "id": "munich-estancia-4",
      "name": "Múnich · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3744,
      "image": "hoteles/estancia-munich-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Trusty_Osaka_Abeno_regular_double_bedroom_20130502-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "munich-estancia-5",
      "name": "Múnich · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4836,
      "image": "hoteles/estancia-munich-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "This Photo was taken by Wolfgang Moroder.  \n\nFeel free to use my photos, but please mention me as the author and send me a  message. \n\n\n\nThis image is not in the public domain. Please respect the copyright protection. It may only be used according to the rules mentioned here. This specifically excludes use in social media, if applicable terms of the licenses listed here not appropriate.\n\n\n\nPlease do not upload an updated image here without consultation with the Author. The author would like to make corrections only at his own source. This ensures that the changes are preserved.Please if you think that any changes should be required, please inform the author.Otherwise you can upload a new image with a new name. Please use one of the templates derivative or extract.",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Belmond_Grand_Hotel_Europe_Saint_Petersburg_Dining_room_stained_glass_windows.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "dublin": [
    {
      "id": "dublin-estancia-4",
      "name": "Dublín · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4524,
      "image": "hoteles/estancia-dublin-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Yokohama_Bay_Hotel_Tokyu_Exective_Twin_Park_View_bedroom_20150429-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "dublin-estancia-5",
      "name": "Dublín · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 5844,
      "image": "hoteles/estancia-dublin-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:The_Gate_Hotel_Kyoto_Takasegawa_by_Hulic_Essential_Double_bedroom_20200811-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "edimburgo": [
    {
      "id": "edimburgo-estancia-4",
      "name": "Edimburgo · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4368,
      "image": "hoteles/estancia-edimburgo-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Hotel_Scandic_Malmen,_Stockholm.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "edimburgo-estancia-5",
      "name": "Edimburgo · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 5642,
      "image": "hoteles/estancia-edimburgo-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Daiwa_Royal_Hotel_Grande_Kyoto_Exective_Premier_Double_bedroom_20200830-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "pekin": [
    {
      "id": "pekin-estancia-4",
      "name": "Pekín · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2652,
      "image": "hoteles/estancia-pekin-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ken Srail from North Olmsted, OH",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Cedar_Point%27s_Express_Hotel_room_(34146752262).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "pekin-estancia-5",
      "name": "Pekín · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3426,
      "image": "hoteles/estancia-pekin-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ivan Mlinaric from Slovenia",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_Quam_Hotel_on_Kish_(2151534863).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "shanghai": [
    {
      "id": "shanghai-estancia-4",
      "name": "Shanghái · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3120,
      "image": "hoteles/estancia-shanghai-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Dennis G. Jarvis",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Imperial_Hotel_room_DK_2009.jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "shanghai-estancia-5",
      "name": "Shanghái · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4030,
      "image": "hoteles/estancia-shanghai-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Woodarelaisku",
      "photoSource": "https://commons.wikimedia.org/wiki/File:SK_Korea_tour_%E9%A6%96%E7%88%BE_%E6%9C%80%E4%BD%B3%E8%A5%BF%E6%96%B9_%E9%A6%96%E7%88%BE%E8%8A%B1%E5%9C%92%E9%85%92%E5%BA%97_Best_Western_Premier_Seoul_Garden_Hotel_room_interior_curtain_n_furniture_lighting_July-2013.JPG",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "hanoi": [
    {
      "id": "hanoi-estancia-4",
      "name": "Hanói · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1810,
      "image": "hoteles/estancia-hanoi-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Ben Salter",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Room_of_Burgh_Island_Hotel-4614268235.jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "hanoi-estancia-5",
      "name": "Hanói · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2337,
      "image": "hoteles/estancia-hanoi-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "https://www.flickr.com/photos/tipsfortravellers/",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Mercure_Santo_Domingo_Room_101_(2).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "ho-chi-minh": [
    {
      "id": "ho-chi-minh-estancia-4",
      "name": "Ciudad Ho Chi Minh · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 1934,
      "image": "hoteles/estancia-ho-chi-minh-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "David Hawgood",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Bow_Street_Magistrates%27_Court_room,_now_hotel_meeting_room_geograph-7166811-by-David-Hawgood.jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "ho-chi-minh-estancia-5",
      "name": "Ciudad Ho Chi Minh · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2499,
      "image": "hoteles/estancia-ho-chi-minh-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Monica D.",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_HRH_Tower_(Las_Vegas).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "delhi": [
    {
      "id": "delhi-estancia-4",
      "name": "Delhi · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2028,
      "image": "hoteles/estancia-delhi-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Good_Nature_Hotel_Kyoto_Garden_View_Terrace_Double_bedroom_20200704-002.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "delhi-estancia-5",
      "name": "Delhi · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2620,
      "image": "hoteles/estancia-delhi-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Mugimeshi",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Suite_Bedroom_at_Beaufort_Sukhothai_Hotel.jpg",
      "photoLicense": "CC BY 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "mumbai": [
    {
      "id": "mumbai-estancia-4",
      "name": "Mumbai · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2652,
      "image": "hoteles/estancia-mumbai-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Daiwa_Royal_Hotel_Grande_Kyoto_Deluxe_Double_Type-A_bedroom_20200222-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "mumbai-estancia-5",
      "name": "Mumbai · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3426,
      "image": "hoteles/estancia-mumbai-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Nagoya_Kanko_Hotel_Deluxe_Double_bedroom_20150607-001.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "agra": [
    {
      "id": "agra-estancia-4",
      "name": "Agra · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2028,
      "image": "hoteles/estancia-agra-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Conference_room_at_Hotel_Esplanade_in_Stockholm.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "agra-estancia-5",
      "name": "Agra · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2620,
      "image": "hoteles/estancia-agra-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Marriott InternationalⓇ The Ritz-Carlton Hotel de la Paix, Geneva",
      "photoSource": "https://commons.wikimedia.org/wiki/File:The_Ritz-Carlton_Hotel_de_la_Paix,_Geneva_%E2%80%94_Living_Room.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "jaipur": [
    {
      "id": "jaipur-estancia-4",
      "name": "Jaipur · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2122,
      "image": "hoteles/estancia-jaipur-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Gary Bembridge",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Concorde_Lafayette_Paris_Room_2412.jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "jaipur-estancia-5",
      "name": "Jaipur · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2740,
      "image": "hoteles/estancia-jaipur-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Monterey_La_Soeur_Osaka_standard_twin_bedroom_20121102-001.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "el-cairo": [
    {
      "id": "el-cairo-estancia-4",
      "name": "El Cairo · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2434,
      "image": "hoteles/estancia-el-cairo-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Tony Webster from Minneapolis, Minnesota, United States",
      "photoSource": "https://commons.wikimedia.org/wiki/File:AC_Hotel_Room_-_Bourbon,_New_Orleans_(27297729743).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "el-cairo-estancia-5",
      "name": "El Cairo · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3143,
      "image": "hoteles/estancia-el-cairo-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Gary Bembridge",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_Du_Louvre_Paris_Room_377.jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "marrakech": [
    {
      "id": "marrakech-estancia-4",
      "name": "Marrakech · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2558,
      "image": "hoteles/estancia-marrakech-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Sdkb",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hyatt_Place_New_York_Chelsea_room_interior.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "marrakech-estancia-5",
      "name": "Marrakech · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3305,
      "image": "hoteles/estancia-marrakech-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "J o",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Oriental_Hotel_Kobe_Executive_Floor_City-view_Twin_bedroom_20160207-002.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "ciudad-del-cabo": [
    {
      "id": "ciudad-del-cabo-estancia-4",
      "name": "Ciudad del Cabo · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3432,
      "image": "hoteles/estancia-ciudad-del-cabo-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "mwanasimba from La Réunion",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Room_in_Hotel_Tachfine_Marrakech_(2845716178).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "ciudad-del-cabo-estancia-5",
      "name": "Ciudad del Cabo · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4433,
      "image": "hoteles/estancia-ciudad-del-cabo-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Titanic Belfast",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Interiors-Presentation-Room-Titanic-Hotel-Belfast_(26533878649).jpg",
      "photoLicense": "CC BY 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "meca": [
    {
      "id": "meca-estancia-4",
      "name": "La Meca · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3744,
      "image": "hoteles/estancia-meca-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "HuiDongXLW RMDa",
      "photoSource": "https://commons.wikimedia.org/wiki/File:HZ_%E6%83%A0%E5%B7%9E_Huizhou_%E6%83%A0%E6%9D%B1_Huidong_%E9%87%91%E6%B5%B7%E7%81%A3%E5%A4%A7%E9%81%93_Jinhaiwan_Blvd_%E8%8F%AF%E7%BE%8E%E9%81%94%E9%85%92%E5%AE%B6_Ramada_Hotel_bedroom_November_2023_R12S_03.jpg",
      "photoLicense": "CC0",
      "photoLicenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "meca-estancia-5",
      "name": "La Meca · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4836,
      "image": "hoteles/estancia-meca-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Alex Nordstrom",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_Hotel_Presidente_InterContinental_Guadalajara.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "medina": [
    {
      "id": "medina-estancia-4",
      "name": "Medina · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3276,
      "image": "hoteles/estancia-medina-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_at_Thon_Kirkenes.jpg",
      "photoLicense": "CC BY-SA 4.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "medina-estancia-5",
      "name": "Medina · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 4232,
      "image": "hoteles/estancia-medina-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "Greg Willis from Denver, CO, usa",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Room_Interior_at_Mushara_Lodge_(3688069200).jpg",
      "photoLicense": "CC BY-SA 2.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ],
  "shenzhen": [
    {
      "id": "shenzhen-estancia-4",
      "name": "Shenzhen · Estancia Terraza",
      "stars": 3,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 2652,
      "image": "hoteles/estancia-shenzhen-1.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "User:Vmenkov",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Futu-Changsheng-Hotel-guest-room-0052.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
      "amenities": [
        "Wi-Fi",
        "Aire acondicionado"
      ]
    },
    {
      "id": "shenzhen-estancia-5",
      "name": "Shenzhen · Estancia Jardín",
      "stars": 4,
      "area": "Zona por confirmar con el alojamiento",
      "rate": 3426,
      "image": "hoteles/estancia-shenzhen-2.jpg",
      "imageAlt": "Fotografía de referencia para un alojamiento de demostración",
      "photoAuthor": "JIP",
      "photoSource": "https://commons.wikimedia.org/wiki/File:Hotel_room_in_Berlin_2.jpg",
      "photoLicense": "CC BY-SA 3.0",
      "photoLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
      "amenities": [
        "Wi-Fi",
        "Desayuno",
        "Aire acondicionado"
      ]
    }
  ]
};
  // Completar también los catálogos SQL antiguos sin alterar tarifas guardadas.
  destinations.forEach(d => {
    for (const hotel of completeHotelOptions[d.id] || []) {
      if (!d.hotels.some(saved => saved.id === hotel.id)) d.hotels.push({...hotel});
    }
    d.hotels.forEach(h => { if (!h.photoLicenseUrl && h.photoLicense === 'Public domain') h.photoLicenseUrl = 'https://creativecommons.org/publicdomain/mark/1.0/'; });
  });
  // END CATALOGO UNIFORME
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
  const homeDestinationIds = ['cancun', 'venecia', 'bali', 'paris', 'ciudad-del-cabo', 'rio-janeiro'];
  const travelStyleLabels = {playa:'Playa y descanso',naturaleza:'Naturaleza',cultura:'Cultura e historia'};
  function preferredTravelStyle() {
    try {
      const profile = JSON.parse((window.RumboStorage || localStorage).getItem('rumbo.profile.v1'));
      return Object.hasOwn(travelStyleLabels, profile?.preference) ? profile.preference : '';
    } catch { return ''; }
  }
  function recommendDestinations(items, preference = preferredTravelStyle()) {
    if (!Object.hasOwn(travelStyleLabels, preference)) return [...items];
    const matches = item => (item.type || item.style) === preference;
    return [...items.filter(matches), ...items.filter(item => !matches(item))];
  }
  function selectHomeDestinations(items = destinations, featured = false, preference = preferredTravelStyle()) {
    const ordered = featured
      ? [...homeDestinationIds.map(id => items.find(item => item.id === id)).filter(Boolean), ...items.filter(item => !homeDestinationIds.includes(item.id))]
      : items;
    return recommendDestinations(ordered, preference).slice(0, 6);
  }
  window.RumboViajesDatos = { destinations, rooms, origins, flights, promotions, selectHomeDestinations, travelStyleLabels, preferredTravelStyle, recommendDestinations };
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
  const totalLabel = document.querySelector('[data-destination-total]');
  if (totalLabel) totalLabel.textContent = `${destinations.length} destinos`;
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
  // Las visitas antiguas guardaban valores de ejemplo aun sin buscar ni elegir nada.
  if (!stored.flightId && !stored.hotelId && stored.searchConfigured !== true) stored = {};
  const fields = { destinationId: 'destino', origin: 'origen', date: 'salida', checkIn: 'entrada', travelers: 'viajeros', nights: 'noches', cabin: 'clase', rooms: 'habitaciones', flightId: 'vuelo', hotelId: 'hotel', roomType: 'tipoHabitacion' };
  let state = {
    destinationId: '', origin: '', date: '', checkIn: '',
    travelers: '', nights: '', cabin: '', rooms: '', flightId: '', hotelId: '', roomType: 'estandar'
  };
  for (const key of Object.keys(fields)) {
    if (stored[key] !== undefined) state[key] = stored[key];
    if (params.has(fields[key])) state[key] = params.get(fields[key]);
  }
  // Un enlace a otro destino no debe heredar el vuelo o el hotel anterior.
  if (params.has('destino') && params.get('destino') !== stored.destinationId) {
    if (!params.has('vuelo')) state.flightId = '';
    if (!params.has('hotel')) state.hotelId = '';
  }
  const invalidDestination = Boolean(params.get('destino')) && !destinationById(params.get('destino'));
  // Al volver con las flechas del navegador, recupera la elección más reciente.
  if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward' && stored.destinationId === state.destinationId) {
    for (const key of Object.keys(fields)) if (stored[key] !== undefined) state[key] = stored[key];
  }

  function currentDestination() { return destinationById(state.destinationId); }
  function currentFlight() { return currentDestination() && state.origin && state.travelers && state.cabin && validDate(state.date) ? flights(currentDestination(), state.origin, state.travelers).find(flight => flight.id === state.flightId) : undefined; }
  function currentHotel() { return state.nights && state.rooms && state.travelers && validDate(state.checkIn) ? currentDestination()?.hotels.find(hotel => hotel.id === state.hotelId) : undefined; }
  function rate(hotel, roomType = state.roomType) { return Math.round(hotel.rate * rooms[roomType].factor); }
  function flightRate(flight) { return state.cabin === 'ejecutiva' ? flight.executive : flight.economy; }
  function earliestCheckIn() {
    const flight = currentFlight();
    return flight ? addDays(state.date, arrival(flight).days) : state.date || today();
  }
  function cleanState() {
    if (!destinationById(state.destinationId)) state.destinationId = '';
    if (!origins.includes(state.origin)) state.origin = '';
    state.travelers = integer(state.travelers, 1, 12, '');
    state.nights = integer(state.nights, 1, 30, '');
    state.rooms = integer(state.rooms, 1, 6, '');
    if (!['economica', 'ejecutiva'].includes(state.cabin)) state.cabin = '';
    if (!Object.hasOwn(rooms, state.roomType)) state.roomType = 'estandar';
    if (!validDate(state.date) || state.date < today()) {
      state.date = '';
      state.flightId = '';
    }
    if (!currentFlight()) state.flightId = '';
    if (!currentHotel() || rooms[state.roomType].capacity * state.rooms < state.travelers) state.hotelId = '';
    const earliest = earliestCheckIn();
    if (!validDate(state.checkIn) || state.checkIn < earliest) { state.checkIn = ''; state.hotelId = ''; }
  }
  cleanState();

  function contextFor(destination) {
    return destination.id === state.destinationId ? {} : {
      destinationId: destination.id,
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
  function navigate(url) {
    if(window.RumboStorage?.navigate)return window.RumboStorage.navigate(url);
    location.href=url;
  }
  function persist(updateURL = true) {
    cleanState();
    const savedState = Object.fromEntries(Object.entries(state).filter(([key,value]) => !['travelers','nights','rooms'].includes(key) || value !== ''));
    try { (window.RumboStorage || localStorage).setItem(STORAGE_KEY, JSON.stringify({...savedState, searchConfigured: true})); } catch (_) { storageAvailable = false; }
    updateNavigation();
    if (updateURL && page !== 'destinos') {
      try { history.replaceState(history.state, '', link(`${page}${location.hash}`)); } catch (_) { /* file:// puede limitar History. */ }
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
  function destinationOptions() { return '<option value="" disabled>Seleccionar</option>' + destinations.map(item => `<option value="${item.id}">${item.name} · ${item.airport.code}</option>`).join(''); }
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
      const {preferredTravelStyle, recommendDestinations, travelStyleLabels} = window.RumboViajesDatos;
      const preference = preferredTravelStyle();
      const matches = preference ? results.filter(item => item.type === preference).length : 0;
      if (order === 'recommended') results = recommendDestinations(results, preference);
      if (order === 'price-low') results.sort((a, b) => a.inspirationBudget - b.inspirationBudget);
      if (order === 'name') results.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      $('#destination-personalization').hidden = !preference;
      if (preference) $('#destination-personalization-text').textContent = matches
        ? `${matches} destinos encajan con tu estilo: ${travelStyleLabels[preference]}.${order === 'recommended' ? ' Los mostramos primero para ti.' : ''}`
        : `Tu estilo es ${travelStyleLabels[preference]}. No hay coincidencias con estos filtros; puedes cambiarlos para ver más opciones.`;
      $('#destination-count').textContent = `${results.length} ${results.length === 1 ? 'destino para descubrir' : 'destinos para descubrir'}`;
      $('#destination-empty').hidden = results.length !== 0;
      $('#destination-list').innerHTML = results.map(item => {
        const href = escapeHTML(link('detalle-destino', contextFor(item)));
        return `<article class="rv-destination-card"><a href="${href}" class="rv-card-photo" tabindex="-1" aria-hidden="true"><img src="${item.thumbnail || item.image}" ${item.thumbnail ? `srcset="${item.thumbnail} 720w, ${item.mediumImage} 1280w, ${item.image} ${item.imageWidth}w" sizes="(max-width:700px) calc(100vw - 32px), (max-width:1050px) 45vw, 380px"` : ''} alt="" width="${item.imageWidth || 1100}" height="${item.imageHeight || 760}" loading="lazy" decoding="async"></a>${preference && item.type === preference ? '<span class="rv-profile-match">Para tu estilo de viaje</span>' : ''}
          <div class="rv-card-content"><p class="rv-card-country">${item.country}</p><h3><a href="${href}">${item.name}</a></h3><p class="rv-card-signature">${item.signature}</p><div class="rv-card-footer"><div><small>Presupuesto / persona</small><strong>${money(item.inspirationBudget)}</strong></div><a href="${href}" aria-label="Ver destino ${item.name}">Ver destino <span aria-hidden="true">↗</span></a></div></div></article>`;
      }).join('');
      const query = new URLSearchParams(new FormData(form));
      query.set('orden', order);
      const anchor = ['#creditos-imagenes', '#catalogo'].includes(location.hash) ? location.hash : '';
      // Entrar a Destinos conserva el comienzo de la página; solo un ancla explícita salta al catálogo.
      try { history.replaceState(history.state, '', `viajes.html?pantalla=destinos&${query}${anchor}`); } catch (_) { /* Navegación local. */ }
    }
    function reset() { form.reset(); $('#orden-destinos').value = 'recommended'; render(); }
    form.addEventListener('submit', event => { event.preventDefault(); render(); });
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    $('#orden-destinos').addEventListener('change', render);
    $('#limpiar-destinos').addEventListener('click', reset);
    $('#restablecer-destinos').addEventListener('click', reset);
    refreshPage = render;
    window.addEventListener('rumbo:profile-changed',render);
    window.addEventListener('storage',event=>{if(event.key==='rumbo.profile.v1')render();});
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
    $('#destination-detail').innerHTML = `<section class="rv-detail-hero" aria-labelledby="page-title"><img src="${destination.image}" style="object-position:${destination.imagePosition}" ${destination.thumbnail ? `srcset="${destination.thumbnail} 720w, ${destination.mediumImage} 1280w, ${destination.image} ${destination.imageWidth}w" sizes="(max-width:700px) calc(100vw - 32px), (max-width:1240px) calc(100vw - 64px), 1180px"` : ''} alt="${destination.alt}" width="${destination.imageWidth || 1100}" height="${destination.imageHeight || 760}" fetchpriority="high"><div class="rv-detail-title"><p class="rv-detail-country">${destination.country}</p><h1 id="page-title">${destination.name}</h1><p>${destination.signature}</p></div></section>
      <div class="rv-detail-body"><section class="rv-detail-copy"><h2>Descubre ${destination.name}</h2><p>${destination.intro}</p>${destination.description !== destination.intro ? `<p>${destination.description}</p>` : ''}<ul class="rv-highlight-list">${destination.highlights.map(item => `<li><span aria-hidden="true">↗</span>${item}</li>`).join('')}</ul><div class="rv-tip"><strong>Para organizarte</strong>${destination.tip}</div><p><a class="rv-link-button" href="servicios.html?seccion=traslados&destino=${destination.id}">Ver traslados en ${destination.name} ↗</a></p><p><a class="rv-link-button" href="servicios.html?seccion=seguros&destino=${destination.id}">Comparar seguros para este destino ↗</a></p><p><a class="rv-link-button" href="servicios.html?seccion=guias&destino=${destination.id}">Explorar recorridos con guía en ${destination.name} ↗</a></p>${destination.transfer ? `<p class="rv-notice">${destination.transfer}</p>` : ''}<p class="rv-caption">Las actividades se organizan por separado del vuelo y el hospedaje.</p></section>
      <aside class="rv-plan-panel" aria-labelledby="detail-plan-title"><h2 id="detail-plan-title">Planificar ${destination.name}</h2>${destination.promotion ? `<p class="promo-badge">−${destination.promotion.percent}% en vuelos · descuento aplicado</p>` : ''}<p class="rv-detail-price">Vuelo desde ${destination.promotion ? `<del class="promo-original">${money(destination.economy)}</del>` : ''}<strong>${money(flights(destination, 'Tegucigalpa')[0]?.economy ?? destination.economy)}</strong></p>${destination.promotion ? '<p class="promo-note">Aplica a vuelos de ida, en ambas clases y orígenes del catálogo. Sin cupón. Hotel y otros servicios por separado. Oferta de demostración de Rumbo; no se transfiere a la aerolínea.</p>' : ''}<p class="rv-caption" style="margin: -8px 0 22px">Por persona · económica · solo ida desde Tegucigalpa.</p>
      <form id="detail-form"><div class="rv-field"><label for="detail-date">Fecha de salida</label><input id="detail-date" type="date" value="${state.date}" min="${today()}" required></div><div class="rv-field-pair"><div class="rv-field"><label for="detail-travelers">Viajeros</label><input id="detail-travelers" type="number" value="${state.travelers}" min="1" max="12" step="1" required></div><div class="rv-field"><label for="detail-nights">Noches de hotel</label><input id="detail-nights" type="number" value="${state.nights}" min="1" max="30" step="1" required></div></div><button class="button button-primary" type="submit" name="next" value="vuelos">Elegir vuelo <span aria-hidden="true">↗</span></button><button class="rv-link-button" type="submit" name="next" value="hoteles">Solo necesito hotel →</button></form></aside></div>`;
    $('#detail-form').addEventListener('submit', event => {
      event.preventDefault();
      updateTrip({ date: $('#detail-date').value, travelers: Number($('#detail-travelers').value), nights: Number($('#detail-nights').value) });
      if (event.submitter?.value === 'hoteles') { state.flightId = ''; persist(); window.RumboJourney?.skipFlight(); }
      navigate(link(event.submitter?.value === 'hoteles' ? 'hoteles' : 'vuelos'));
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
    element.innerHTML = `<h2>Tu selección</h2>${destination ? `<div class="rv-summary-destination"><img src="${destination.image}" alt="" width="59" height="62"><div><strong>${destination.name}</strong><small>${destination.country}</small></div></div>` : '<p>Indica un destino o consulta las opciones disponibles.</p>'}
      <div class="rv-summary-part"><h3>Vuelo ${mode === 'hoteles' ? `<a href="${escapeHTML(link('vuelos'))}">${parts.flight ? 'Cambiar' : 'Elegir'}</a>` : ''}</h3>${parts.flightHTML}</div>
      <div class="rv-summary-part"><h3>Hospedaje</h3>${parts.hotelHTML}</div>
      <div class="rv-summary-total"><span>Subtotal elegido</span><strong id="summary-total" data-amount="${parts.total}" aria-live="polite">${money(parts.total)}</strong></div>
      <p class="rv-caption">Suma de las opciones elegidas. Actividades y traslados no incluidos.</p>
      ${mode === 'vuelos' ? `<button class="button button-primary" id="continue-hotel" type="button" ${parts.flight ? '' : 'disabled'}>Elegir hotel ↗</button><a data-skip-flight class="rv-link-button rv-summary-clear" href="${escapeHTML(link('hoteles', { flightId: '' }))}">Continuar solo con hotel →</a>` : `<button class="button button-primary" id="save-selection" type="button" ${parts.hotel ? '' : 'disabled'}>Continuar a transporte →</button>`}
      ${parts.flight || parts.hotel ? '<button class="rv-link-button rv-summary-clear" id="clear-selection" type="button">Quitar selecciones</button>' : ''}`;
    $('#continue-hotel')?.addEventListener('click', () => { navigate(link('hoteles')); });
    $('#save-selection')?.addEventListener('click', () => {
      persist();
      navigate('servicios.html?seccion=traslados');
    });
    $('#clear-selection')?.addEventListener('click', () => {
      state.flightId = ''; state.hotelId = ''; persist(); afterClear(); toast('Se quitaron el vuelo y el hotel de tu selección.');
    });
  }

  // Desactiva selecciones antiguas cuando hay datos editados sin aplicar.
  function bindSearchForm(form, apply, noticeSelector, mode) {
    const signature = () => JSON.stringify([...new FormData(form)]);
    let applied = signature();
    function markDirty() {
      if (signature() === applied && form.dataset.dirty !== 'true') return;
      document.querySelectorAll('[data-select-flight], [data-select-hotel]').forEach(button => { button.disabled = true; });
      const next = mode === 'vuelos' ? $('#continue-hotel') : $('#save-selection');
      if (next) next.disabled = true;
      $(noticeSelector).textContent = 'Aplica los cambios con el botón Actualizar para ver los nuevos resultados.';
      form.dataset.dirty = 'true';
    }
    form.addEventListener('input', markDirty);
    form.addEventListener('change', () => {
      if (signature() === applied && form.dataset.dirty !== 'true') return;
      markDirty();
      if (form.checkValidity()) form.requestSubmit();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (signature() === applied && form.dataset.dirty !== 'true') return;
      form.dataset.dirty = 'false';
      apply();
      applied = signature();
    });
  }

  // 3. VUELOS: horarios de ejemplo, clase y precio para todos los pasajeros.
  function initFlights() {
    const form = $('#flight-search');
    $('#flight-destination').innerHTML = destinationOptions();
    $('#flight-origin').innerHTML = '<option value="" disabled>Seleccionar</option>' + origins.map(item => `<option>${item}</option>`).join('');
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
      if (!destination || !state.origin || !state.date || !state.travelers || !state.cabin) {
        $('#flight-result-title').textContent = 'Buscar vuelos';
        $('#flight-results-meta').textContent = 'Completa los datos de tu viaje para ver opciones y precios.';
        $('#flight-form-notice').textContent = 'Completa los datos de tu viaje para ver opciones y precios.';
        $('#flight-transfer').hidden = true;
        $('#flight-list').innerHTML = '<div class="rv-empty"><h3>Buscar vuelos</h3><p>Completa los datos de tu viaje para ver opciones y precios.</p></div>';
        renderSummary('vuelos', render);
        return;
      }
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
          <div class="rv-flight-top"><div class="rv-flight-name"><div><strong>${flight.airline.name}</strong><small>Referencia ${flight.code} · no es número de vuelo</small></div></div></div>
          <div class="rv-flight-timing"><div class="rv-time"><strong>${flight.departure}</strong><small>${state.origin}</small></div><div class="rv-flight-line"><span>${duration(flight.minutes)}</span><div aria-hidden="true"></div><span>${flight.stops}</span></div><div class="rv-time"><strong>${end.time}${end.days ? `<sup> +${end.days} d</sup>` : ''}</strong><small>${destination.arrival}</small></div></div>
          <details class="booking-details"><summary>Ver condiciones</summary><div class="rv-ticket-details"><span><small>Fecha de salida</small><strong>${formatDate(state.date)}</strong></span><span><small>Pasajeros</small><strong>${state.travelers}</strong></span><span><small>Clase</small><strong>${state.cabin === 'economica' ? 'Económica' : 'Ejecutiva'}</strong></span></div><div class="rv-airline-booking"><a href="${flight.airline.url}" target="_blank" rel="noopener noreferrer">Consultar en ${flight.airline.name} ↗<span class="sr-only"> (abre una pestaña nueva)</span></a><p>Horario, ruta, equipaje y precio simulados. Consulta rutas y disponibilidad en el sitio oficial; tus selecciones no se transfieren y este boleto no permite abordar.</p></div></details>
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
        ...(changingDestination ? { checkIn: $('#flight-date').value } : {})
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
      const earliest = earliestCheckIn();
      if (!state.checkIn || state.checkIn < earliest) state.checkIn = earliest;
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
      if (!destination || !state.checkIn || !state.nights || !state.travelers || !state.rooms) {
        $('#hotel-result-title').textContent = 'Buscar hoteles';
        $('#hotel-results-meta').textContent = 'Completa los datos de tu viaje para ver opciones y precios.';
        $('#hotel-form-notice').textContent = 'Completa los datos de tu viaje para ver opciones y precios.';
        $('#hotel-empty').hidden = true;
        $('#hotel-list').innerHTML = '<div class="rv-empty"><h3>Buscar hoteles</h3><p>Completa los datos de tu viaje para ver opciones y precios.</p></div>';
        renderSummary('hoteles', render);
        return;
      }
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
          <div class="rv-hotel-content"><p class="rv-stars" aria-label="${hotel.stars} estrellas de demostración">${'★'.repeat(hotel.stars)}</p><h3>${hotel.name}</h3><p class="rv-hotel-location">${destination.name} · ${hotel.area}</p><ul class="rv-amenities" aria-label="Servicios">${hotel.amenities.map(item => `<li>${item}</li>`).join('')}</ul>
          <div class="rv-field rv-room-choice"><label for="room-${hotel.id}">Tipo de habitación en ${hotel.name}</label><select id="room-${hotel.id}" data-room-hotel="${hotel.id}">${Object.entries(rooms).map(([key, room]) => `<option value="${key}" ${key === type ? 'selected' : ''}>${room.name} · hasta ${room.capacity} personas / hab.</option>`).join('')}</select></div>
          <div class="rv-hotel-price-row"><div class="rv-price"><strong>${money(nightly)}</strong><small>Por noche / habitación</small></div><button class="rv-select-button" type="button" data-select-hotel="${hotel.id}" aria-pressed="${selected}" aria-label="${selected ? 'Hotel seleccionado' : 'Seleccionar'} ${hotel.name}" ${!enoughSpace || dirty ? 'disabled' : ''}>${selected ? 'Seleccionado ✓' : 'Elegir hotel'}</button></div><p class="rv-hotel-total">${state.nights} ${state.nights === 1 ? 'noche' : 'noches'} × ${state.rooms} ${state.rooms === 1 ? 'habitación' : 'habitaciones'} · <strong>${money(nightly * state.nights * state.rooms)}</strong></p>
          <p class="booking-disclosure">Hospedaje de demostración · fotografía de referencia</p><details class="rv-photo-credit"><summary>Créditos de la fotografía</summary><p>Foto: ${escapeHTML(hotel.photoAuthor || 'Autor indicado en la fuente')} · <a href="${escapeHTML(hotel.photoLicenseUrl || hotel.photoSource)}" target="_blank" rel="noopener noreferrer">${escapeHTML(hotel.photoLicense || 'Ver licencia')}</a>. Adaptada para la web. <a href="${escapeHTML(hotel.photoSource)}" target="_blank" rel="noopener noreferrer">Ver original ↗</a></p></details>${enoughSpace ? '' : `<p class="rv-capacity-error">Para ${state.travelers} personas necesitas al menos ${Math.ceil(state.travelers / rooms[type].capacity)} habitaciones de este tipo, o elegir otra capacidad.</p>`}</div></article>`;
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
        ...(!state.date ? {date: $('#hotel-date').value} : {}),
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
  if ((invalidDestination && page !== 'destinos') || (page === 'detalle-destino' && !currentDestination())) { notFound(); return; }
  updateNavigation();
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
