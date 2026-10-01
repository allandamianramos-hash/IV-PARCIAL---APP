// ============================================================
// LA TIENDA DEL VIAJERO | RUMBO
// JavaScript completo
// ============================================================

// CATÁLOGO DE PRODUCTOS
const PRODUCTS = [
  {
    id: 1,
    name: "Mochila de viaje",
    category: "Equipaje",
    price: 450,
    image: "imagenes/mochila.jpg",
    imageAlt: "Mochila de viaje",
    imageKind: "photo",
    description: "Mochila práctica para llevar tus cosas durante el viaje."
  },
  {
    id: 2,
    name: "Maleta de viaje",
    category: "Equipaje",
    price: 650,
    image: "imagenes/maleta.jpg",
    imageAlt: "Maleta de viaje",
    imageKind: "photo",
    description: "Maleta para organizar y transportar tu equipaje."
  },
  {
    id: 3,
    name: "Bolso de mano",
    category: "Equipaje",
    price: 250,
    image: "imagenes/bolso-mano.jpg",
    imageAlt: "Bolso de mano",
    imageKind: "photo",
    description: "Bolso cómodo para llevar objetos personales."
  },
  {
    id: 4,
    name: "Riñonera",
    category: "Equipaje",
    price: 120,
    image: "imagenes/rinonera.jpg",
    imageAlt: "Riñonera",
    imageKind: "photo",
    description: "Riñonera compacta para llevar objetos pequeños."
  },
  {
    id: 5,
    name: "Etiqueta para maleta",
    category: "Equipaje",
    price: 50,
    image: "imagenes/producto-43.jpg",
    imageAlt: "Etiqueta para maleta",
    imageKind: "generated",
    description: "Etiqueta para identificar fácilmente tu equipaje."
  },
  {
    id: 6,
    name: "Candado para maleta",
    category: "Equipaje",
    price: 80,
    image: "imagenes/producto-76.jpg",
    imageAlt: "Candado para maleta",
    imageKind: "generated",
    description: "Candado compacto para asegurar tu equipaje."
  },
  {
    id: 7,
    name: "Power Bank",
    category: "Tecnología",
    price: 350,
    image: "imagenes/power-bank.jpg",
    imageAlt: "Power Bank",
    imageKind: "photo",
    description: "Batería portátil para mantener cargado tu celular."
  },
  {
    id: 8,
    name: "Cargador de celular",
    category: "Tecnología",
    price: 150,
    image: "imagenes/cargador.jpg",
    imageAlt: "Cargador de celular",
    imageKind: "photo",
    description: "Cargador práctico para usar durante tus viajes."
  },
  {
    id: 9,
    name: "Cable USB",
    category: "Tecnología",
    price: 70,
    image: "imagenes/producto-47.jpg",
    imageAlt: "Cable USB",
    imageKind: "generated",
    description: "Cable USB para cargar y conectar dispositivos."
  },
  {
    id: 10,
    name: "Adaptador universal",
    category: "Tecnología",
    price: 220,
    image: "imagenes/adaptador.jpg",
    imageAlt: "Adaptador universal",
    imageKind: "photo",
    description: "Adaptador para conectar dispositivos en diferentes lugares."
  },
  {
    id: 11,
    name: "Audífonos",
    category: "Tecnología",
    price: 180,
    image: "imagenes/audifonos.jpg",
    imageAlt: "Audífonos",
    imageKind: "photo",
    description: "Audífonos para escuchar música durante el viaje."
  },
  {
    id: 12,
    name: "Soporte para celular",
    category: "Tecnología",
    price: 100,
    image: "imagenes/soporte-celular.jpg",
    imageAlt: "Soporte para celular",
    imageKind: "photo",
    description: "Soporte pequeño y práctico para tu celular."
  },
  {
    id: 13,
    name: "Almohada de viaje",
    category: "Confort",
    price: 180,
    image: "imagenes/almohada-viaje.jpg",
    imageAlt: "Almohada de viaje",
    imageKind: "photo",
    description: "Almohada cómoda para descansar durante el viaje."
  },
  {
    id: 14,
    name: "Botella reutilizable",
    category: "Confort",
    price: 120,
    image: "imagenes/botella.jpg",
    imageAlt: "Botella reutilizable",
    imageKind: "photo",
    description: "Botella reutilizable para llevar agua."
  },
  {
    id: 15,
    name: "Antifaz para dormir",
    category: "Confort",
    price: 60,
    image: "imagenes/producto-61.jpg",
    imageAlt: "Antifaz para dormir",
    imageKind: "generated",
    description: "Antifaz para descansar con mayor comodidad."
  },
  {
    id: 16,
    name: "Tapones para oídos",
    category: "Confort",
    price: 45,
    image: "imagenes/tapones-oidos.jpg",
    imageAlt: "Tapones para oídos",
    imageKind: "photo",
    description: "Tapones pequeños para descansar durante el viaje."
  },
  {
    id: 17,
    name: "Paraguas compacto",
    category: "Confort",
    price: 150,
    image: "imagenes/paraguas.jpg",
    imageAlt: "Paraguas compacto",
    imageKind: "photo",
    description: "Paraguas compacto para llevar fácilmente."
  },
  {
    id: 18,
    name: "Toalla de viaje",
    category: "Confort",
    price: 130,
    image: "imagenes/toalla-viaje.jpg",
    imageAlt: "Toalla de viaje",
    imageKind: "photo",
    description: "Toalla práctica y fácil de transportar."
  },
  {
    id: 19,
    name: "Porta pasaporte",
    category: "Seguridad",
    price: 100,
    image: "imagenes/producto-41.jpg",
    imageAlt: "Porta pasaporte",
    imageKind: "generated",
    description: "Funda para mantener protegido tu pasaporte."
  },
  {
    id: 20,
    name: "Porta documentos",
    category: "Seguridad",
    price: 120,
    image: "imagenes/porta-documentos.jpg",
    imageAlt: "Porta documentos",
    imageKind: "photo",
    description: "Organizador para documentos importantes."
  },
  {
    id: 21,
    name: "Billetera de viaje",
    category: "Seguridad",
    price: 110,
    image: "imagenes/billetera.jpg",
    imageAlt: "Billetera de viaje",
    imageKind: "photo",
    description: "Billetera práctica para guardar dinero y tarjetas."
  },
  {
    id: 22,
    name: "Bolsa impermeable",
    category: "Seguridad",
    price: 100,
    image: "imagenes/producto-22.jpg",
    imageAlt: "Bolsa impermeable",
    imageKind: "generated",
    description: "Bolsa para proteger objetos de la humedad."
  },
  {
    id: 23,
    name: "Correa para maleta",
    category: "Seguridad",
    price: 90,
    image: "imagenes/producto-35.jpg",
    imageAlt: "Correa para maleta",
    imageKind: "generated",
    description: "Correa para sujetar y reconocer tu maleta."
  },
  {
    id: 24,
    name: "Linterna",
    category: "Seguridad",
    price: 100,
    image: "imagenes/linterna.jpg",
    imageAlt: "Linterna",
    imageKind: "photo",
    description: "Linterna pequeña para llevar durante el viaje."
  },
  {
    id: 25,
    name: "Neceser de viaje",
    category: "Cuidado",
    price: 130,
    image: "imagenes/neceser.jpg",
    imageAlt: "Neceser de viaje",
    imageKind: "photo",
    description: "Neceser para organizar artículos personales."
  },
  {
    id: 26,
    name: "Botellas para líquidos",
    category: "Cuidado",
    price: 80,
    image: "imagenes/producto-92.jpg",
    imageAlt: "Botellas para líquidos",
    imageKind: "generated",
    description: "Botellas pequeñas para llevar líquidos."
  },
  {
    id: 27,
    name: "Cepillo de dientes de viaje",
    category: "Cuidado",
    price: 55,
    image: "imagenes/cepillo-dientes.jpg",
    imageAlt: "Cepillo de dientes de viaje",
    imageKind: "photo",
    description: "Cepillo compacto para llevar en el equipaje."
  },
  {
    id: 28,
    name: "Kit de higiene",
    category: "Cuidado",
    price: 150,
    image: "imagenes/kit-higiene.jpg",
    imageAlt: "Kit de higiene",
    imageKind: "photo",
    description: "Kit práctico para artículos de higiene personal."
  },
  {
    id: 29,
    name: "Protector solar",
    category: "Cuidado",
    price: 180,
    image: "imagenes/protector-solar.jpg",
    imageAlt: "Protector solar",
    imageKind: "photo",
    description: "Protector solar para incluir en tu equipaje."
  },
  {
    id: 30,
    name: "Botiquín básico",
    category: "Cuidado",
    price: 200,
    image: "imagenes/botiquin.jpg",
    imageAlt: "Botiquín básico",
    imageKind: "photo",
    description: "Botiquín básico para llevar artículos de primeros auxilios."
  }
];


// ============================================================
// OPCIONES DE CADA PRODUCTO
// ============================================================

const PRODUCT_OPTIONS = {

  // =========================
  // EQUIPAJE
  // =========================

  1: {
    Color: ['Negro', 'Azul', 'Rojo', 'Gris'],
    Tamaño: ['Pequeña', 'Mediana', 'Grande']
  },

  2: {
    Color: ['Negro', 'Azul', 'Rojo', 'Verde'],
    Tamaño: ['20 pulgadas', '24 pulgadas', '28 pulgadas']
  },

  3: {
    Color: ['Negro', 'Café', 'Beige', 'Azul'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  4: {
    Color: ['Negro', 'Azul', 'Rojo', 'Rosa'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  5: {
    Color: ['Negro', 'Azul', 'Rojo', 'Verde'],
    Tipo: ['Simple', 'Con ventana']
  },

  6: {
    Color: ['Negro', 'Plateado', 'Dorado'],
    Tipo: ['3 dígitos', '4 dígitos']
  },


  // =========================
  // TECNOLOGÍA
  // =========================

  7: {
    Color: ['Negro', 'Blanco', 'Azul'],
    Capacidad: ['10,000 mAh', '20,000 mAh']
  },

  8: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['USB-C', 'USB-A']
  },

  9: {
    Color: ['Negro', 'Blanco'],
    Largo: ['1 metro', '2 metros']
  },

  10: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['Universal']
  },

  11: {
    Color: ['Negro', 'Blanco', 'Azul'],
    Tipo: ['Inalámbricos', 'Alámbricos']
  },

  12: {
    Color: ['Negro', 'Gris', 'Azul'],
    Uso: ['Escritorio', 'Auto']
  },


  // =========================
  // CONFORT
  // =========================

  13: {
    Color: ['Gris', 'Azul', 'Negro'],
    Tamaño: ['Pequeña', 'Mediana', 'Grande']
  },

  14: {
    Color: ['Transparente', 'Azul', 'Negro', 'Rosa'],
    Capacidad: ['500 ml', '750 ml', '1 litro']
  },

  15: {
    Color: ['Negro', 'Azul', 'Rosa', 'Gris'],
    Tamaño: ['Niño', 'Adulto']
  },

  16: {
    Color: ['Amarillo', 'Azul', 'Rosa'],
    Tamaño: ['Niño', 'Adulto'],
    Cantidad: ['2 pares', '4 pares']
  },

  17: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  18: {
    Color: ['Blanco', 'Gris', 'Azul'],
    Tamaño: ['Pequeña', 'Mediana', 'Grande']
  },


  // =========================
  // SEGURIDAD
  // =========================

  19: {
    Color: ['Negro', 'Café', 'Azul'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  20: {
    Color: ['Negro', 'Café', 'Azul'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  21: {
    Color: ['Negro', 'Café', 'Azul'],
    Tipo: ['Básica', 'Con compartimentos']
  },

  22: {
    Color: ['Negro', 'Azul', 'Transparente'],
    Tamaño: ['Pequeña', 'Mediana', 'Grande']
  },

  23: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Estándar']
  },

  24: {
    Color: ['Negro', 'Gris'],
    Potencia: ['100 lm', '300 lm']
  },


  // =========================
  // CUIDADO
  // =========================

  25: {
    Color: ['Negro', 'Beige', 'Azul', 'Rosa'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  26: {
    Color: ['Transparente', 'Azul', 'Rosa'],
    Capacidad: ['30 ml', '60 ml', '100 ml'],
    Cantidad: ['2 unidades', '4 unidades']
  },

  27: {
    Color: ['Natural', 'Blanco', 'Azul', 'Rosa'],
    Edad: ['Niño', 'Adulto'],
    Tipo: ['Suave', 'Medio']
  },

  28: {
    Tipo: ['Básico', 'Completo'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande'],
    Edad: ['Niño', 'Adulto']
  },

  29: {
    Edad: ['Niño', 'Adulto'],
    FPS: ['FPS 30', 'FPS 50'],
    Presentación: ['100 ml', '200 ml']
  },

  30: {
    Tipo: ['Básico', 'Familiar'],
    Tamaño: ['Compacto', 'Mediano', 'Grande']
  }

};

/* =========================================================
   PRODUCTOS 31 AL 100
   Los 30 productos originales NO se modifican
   ========================================================= */

PRODUCTS.push(

  // =========================
  // EQUIPAJE
  // =========================

  {
    id: 31,
    name: "Organizador de maleta",
    category: "Equipaje",
    price: 90,
    image: "imagenes/producto-31.jpg",
    imageAlt: "Organizador de maleta",
    imageKind: "generated",
    description: "Organizador para mantener la ropa ordenada dentro de la maleta."
  },

  {
    id: 32,
    name: "Bolsa para zapatos",
    category: "Equipaje",
    price: 70,
    image: "imagenes/producto-32.jpg",
    imageAlt: "Bolsa para zapatos",
    imageKind: "generated",
    description: "Bolsa para guardar los zapatos separados del resto del equipaje."
  },

  {
    id: 33,
    name: "Cubos organizadores de ropa",
    category: "Equipaje",
    price: 120,
    image: "imagenes/producto-33.jpg",
    imageAlt: "Cubos organizadores de ropa",
    imageKind: "generated",
    description: "Cubos para organizar y separar la ropa dentro de la maleta."
  },

  {
    id: 34,
    name: "Funda para maleta",
    category: "Equipaje",
    price: 160,
    image: "imagenes/producto-34.jpg",
    imageAlt: "Funda para maleta",
    imageKind: "generated",
    description: "Funda para proteger la maleta durante el viaje."
  },

  {
    id: 35,
    name: "Correa para maleta",
    category: "Equipaje",
    price: 85,
    image: "imagenes/producto-35.jpg",
    imageAlt: "Correa para maleta",
    imageKind: "generated",
    description: "Correa ajustable para asegurar el equipaje."
  },

  {
    id: 36,
    name: "Neceser de viaje",
    category: "Equipaje",
    price: 140,
    image: "imagenes/producto-36.jpg",
    imageAlt: "Neceser de viaje",
    imageKind: "generated",
    description: "Neceser para llevar artículos personales."
  },

  {
    id: 37,
    name: "Bolsa para ropa sucia",
    category: "Equipaje",
    price: 75,
    image: "imagenes/producto-37.jpg",
    imageAlt: "Bolsa para ropa sucia",
    imageKind: "generated",
    description: "Bolsa para separar la ropa usada durante el viaje."
  },

  {
    id: 38,
    name: "Bolsa plegable de viaje",
    category: "Equipaje",
    price: 150,
    image: "imagenes/producto-38.jpg",
    imageAlt: "Bolsa plegable de viaje",
    imageKind: "generated",
    description: "Bolsa ligera que puede doblarse y guardarse fácilmente."
  },

  {
    id: 39,
    name: "Mochila de viaje",
    category: "Equipaje",
    price: 280,
    image: "imagenes/producto-39.jpg",
    imageAlt: "Mochila de viaje",
    imageKind: "generated",
    description: "Mochila práctica para llevar objetos personales."
  },

  {
    id: 40,
    name: "Riñonera de viaje",
    category: "Equipaje",
    price: 110,
    image: "imagenes/producto-40.jpg",
    imageAlt: "Riñonera de viaje",
    imageKind: "generated",
    description: "Riñonera para llevar objetos pequeños durante el viaje."
  },

  {
    id: 41,
    name: "Porta pasaporte",
    category: "Equipaje",
    price: 90,
    image: "imagenes/producto-41.jpg",
    imageAlt: "Porta pasaporte",
    imageKind: "generated",
    description: "Estuche para proteger y organizar el pasaporte."
  },

  {
    id: 42,
    name: "Organizador de documentos",
    category: "Equipaje",
    price: 140,
    image: "imagenes/producto-42.jpg",
    imageAlt: "Organizador de documentos",
    imageKind: "generated",
    description: "Organizador para documentos, tarjetas y pasaporte."
  },

  {
    id: 43,
    name: "Etiquetas para equipaje",
    category: "Equipaje",
    price: 60,
    image: "imagenes/producto-43.jpg",
    imageAlt: "Etiquetas para equipaje",
    imageKind: "generated",
    description: "Etiquetas para identificar fácilmente las maletas."
  },

  {
    id: 44,
    name: "Bolsa para accesorios de viaje",
    category: "Equipaje",
    price: 100,
    image: "imagenes/producto-44.jpg",
    imageAlt: "Bolsa para accesorios de viaje",
    imageKind: "generated",
    description: "Bolsa pequeña para organizar accesorios."
  },


  // =========================
  // TECNOLOGÍA
  // =========================

  {
    id: 45,
    name: "Cargador portátil",
    category: "Tecnología",
    price: 220,
    image: "imagenes/power-bank.jpg",
    imageAlt: "Cargador portátil",
    imageKind: "photo",
    description: "Batería portátil para cargar dispositivos durante el viaje."
  },

  {
    id: 46,
    name: "Cargador de celular",
    category: "Tecnología",
    price: 150,
    image: "imagenes/cargador.jpg",
    imageAlt: "Cargador de celular",
    imageKind: "photo",
    description: "Cargador compacto para llevar durante los viajes."
  },

  {
    id: 47,
    name: "Cable USB-C",
    category: "Tecnología",
    price: 75,
    image: "imagenes/producto-47.jpg",
    imageAlt: "Cable USB-C",
    imageKind: "generated",
    description: "Cable para cargar y conectar dispositivos compatibles."
  },

  {
    id: 48,
    name: "Adaptador universal de viaje",
    category: "Tecnología",
    price: 250,
    image: "imagenes/adaptador.jpg",
    imageAlt: "Adaptador universal de viaje",
    imageKind: "photo",
    description: "Adaptador para conectar dispositivos en diferentes tipos de enchufe."
  },

  {
    id: 49,
    name: "Audífonos Bluetooth",
    category: "Tecnología",
    price: 250,
    image: "imagenes/audifonos.jpg",
    imageAlt: "Audífonos Bluetooth",
    imageKind: "photo",
    description: "Audífonos inalámbricos para escuchar música durante el viaje."
  },

  {
    id: 50,
    name: "Audífonos con cable",
    category: "Tecnología",
    price: 100,
    image: "imagenes/producto-50.jpg",
    imageAlt: "Audífonos con cable",
    imageKind: "generated",
    description: "Audífonos económicos para escuchar música."
  },

  {
    id: 51,
    name: "Soporte para celular",
    category: "Tecnología",
    price: 90,
    image: "imagenes/soporte-celular.jpg",
    imageAlt: "Soporte para celular",
    imageKind: "photo",
    description: "Soporte compacto para colocar el teléfono."
  },

  {
    id: 52,
    name: "Memoria USB",
    category: "Tecnología",
    price: 120,
    image: "imagenes/producto-52.jpg",
    imageAlt: "Memoria USB",
    imageKind: "generated",
    description: "Memoria pequeña para guardar archivos importantes."
  },

  {
    id: 53,
    name: "Lector de tarjetas",
    category: "Tecnología",
    price: 100,
    image: "imagenes/producto-53.jpg",
    imageAlt: "Lector de tarjetas",
    imageKind: "generated",
    description: "Lector compacto para transferir archivos."
  },

  {
    id: 54,
    name: "Hub USB",
    category: "Tecnología",
    price: 180,
    image: "imagenes/producto-54.jpg",
    imageAlt: "Hub USB",
    imageKind: "generated",
    description: "Dispositivo para conectar varios accesorios USB."
  },

  {
    id: 55,
    name: "Luz de lectura USB",
    category: "Tecnología",
    price: 80,
    image: "imagenes/producto-55.jpg",
    imageAlt: "Luz de lectura USB",
    imageKind: "generated",
    description: "Luz pequeña para leer durante el viaje."
  },

  {
    id: 56,
    name: "Reloj despertador de viaje",
    category: "Tecnología",
    price: 180,
    image: "imagenes/producto-56.jpg",
    imageAlt: "Reloj despertador de viaje",
    imageKind: "generated",
    description: "Reloj compacto para llevar durante los viajes."
  },

  {
    id: 57,
    name: "Batería portátil compacta",
    category: "Tecnología",
    price: 280,
    image: "imagenes/power-bank.jpg",
    imageAlt: "Batería portátil compacta",
    imageKind: "photo",
    description: "Batería portátil para mantener cargados los dispositivos."
  },

  {
    id: 58,
    name: "Cable multifunción",
    category: "Tecnología",
    price: 120,
    image: "imagenes/producto-58.jpg",
    imageAlt: "Cable multifunción",
    imageKind: "generated",
    description: "Cable con diferentes conexiones para viajes."
  },


  // =========================
  // CONFORT
  // =========================

  {
    id: 59,
    name: "Almohada cervical",
    category: "Confort",
    price: 200,
    image: "imagenes/almohada-viaje.jpg",
    imageAlt: "Almohada cervical",
    imageKind: "photo",
    description: "Almohada para apoyar cómodamente el cuello."
  },

  {
    id: 60,
    name: "Almohada inflable",
    category: "Confort",
    price: 120,
    image: "imagenes/producto-60.jpg",
    imageAlt: "Almohada inflable",
    imageKind: "generated",
    description: "Almohada ligera que puede inflarse para viajar."
  },

  {
    id: 61,
    name: "Antifaz para dormir",
    category: "Confort",
    price: 60,
    image: "imagenes/producto-61.jpg",
    imageAlt: "Antifaz para dormir",
    imageKind: "generated",
    description: "Antifaz para descansar durante el viaje."
  },

  {
    id: 62,
    name: "Tapones para los oídos",
    category: "Confort",
    price: 50,
    image: "imagenes/tapones-oidos.jpg",
    imageAlt: "Tapones para los oídos",
    imageKind: "photo",
    description: "Tapones pequeños para ayudar a descansar durante el viaje."
  },

  {
    id: 63,
    name: "Manta de viaje",
    category: "Confort",
    price: 220,
    image: "imagenes/producto-63.jpg",
    imageAlt: "Manta de viaje",
    imageKind: "generated",
    description: "Manta cómoda para utilizar durante el viaje."
  },

  {
    id: 64,
    name: "Calcetines de viaje",
    category: "Confort",
    price: 70,
    image: "imagenes/producto-64.jpg",
    imageAlt: "Calcetines de viaje",
    imageKind: "generated",
    description: "Calcetines cómodos para viajar."
  },

  {
    id: 65,
    name: "Pantuflas de viaje",
    category: "Confort",
    price: 120,
    image: "imagenes/producto-65.jpg",
    imageAlt: "Pantuflas de viaje",
    imageKind: "generated",
    description: "Pantuflas ligeras para descansar."
  },

  {
    id: 66,
    name: "Botella reutilizable",
    category: "Confort",
    price: 130,
    image: "imagenes/botella.jpg",
    imageAlt: "Botella reutilizable",
    imageKind: "photo",
    description: "Botella reutilizable para llevar agua."
  },

  {
    id: 67,
    name: "Botella térmica",
    category: "Confort",
    price: 220,
    image: "imagenes/producto-67.jpg",
    imageAlt: "Botella térmica",
    imageKind: "generated",
    description: "Botella para mantener bebidas durante el viaje."
  },

  {
    id: 68,
    name: "Vaso térmico",
    category: "Confort",
    price: 180,
    image: "imagenes/producto-68.jpg",
    imageAlt: "Vaso térmico",
    imageKind: "generated",
    description: "Vaso reutilizable para bebidas."
  },

  {
    id: 69,
    name: "Toalla de microfibra",
    category: "Confort",
    price: 140,
    image: "imagenes/producto-69.jpg",
    imageAlt: "Toalla de microfibra",
    imageKind: "generated",
    description: "Toalla ligera y fácil de transportar."
  },

  {
    id: 70,
    name: "Cojín de asiento",
    category: "Confort",
    price: 150,
    image: "imagenes/producto-70.jpg",
    imageAlt: "Cojín de asiento",
    imageKind: "generated",
    description: "Cojín para viajar con mayor comodidad."
  },

  {
    id: 71,
    name: "Botella deportiva",
    category: "Confort",
    price: 130,
    image: "imagenes/botella.jpg",
    imageAlt: "Botella deportiva",
    imageKind: "photo",
    description: "Botella práctica para llevar agua durante el viaje."
  },

  {
    id: 72,
    name: "Bolsa para snacks",
    category: "Confort",
    price: 70,
    image: "imagenes/producto-72.jpg",
    imageAlt: "Bolsa para snacks",
    imageKind: "generated",
    description: "Bolsa pequeña para llevar snacks durante el viaje."
  },


  // =========================
  // SEGURIDAD
  // =========================

  {
    id: 73,
    name: "Cartera de viaje",
    category: "Seguridad",
    price: 130,
    image: "imagenes/billetera.jpg",
    imageAlt: "Cartera de viaje",
    imageKind: "photo",
    description: "Cartera para llevar dinero y tarjetas."
  },

  {
    id: 74,
    name: "Tarjetero",
    category: "Seguridad",
    price: 70,
    image: "imagenes/producto-74.jpg",
    imageAlt: "Tarjetero",
    imageKind: "generated",
    description: "Tarjetero compacto para organizar tarjetas."
  },

  {
    id: 75,
    name: "Candado con llave",
    category: "Seguridad",
    price: 65,
    image: "imagenes/producto-75.jpg",
    imageAlt: "Candado con llave",
    imageKind: "generated",
    description: "Candado para asegurar el equipaje."
  },

  {
    id: 76,
    name: "Candado de combinación",
    category: "Seguridad",
    price: 85,
    image: "imagenes/producto-76.jpg",
    imageAlt: "Candado de combinación",
    imageKind: "generated",
    description: "Candado con combinación para maletas."
  },

  {
    id: 77,
    name: "Correa de seguridad para maleta",
    category: "Seguridad",
    price: 80,
    image: "imagenes/producto-35.jpg",
    imageAlt: "Correa de seguridad para maleta",
    imageKind: "generated",
    description: "Correa ajustable para asegurar el equipaje."
  },

  {
    id: 78,
    name: "Funda para documentos",
    category: "Seguridad",
    price: 90,
    image: "imagenes/producto-78.jpg",
    imageAlt: "Funda para documentos",
    imageKind: "generated",
    description: "Funda para proteger documentos importantes."
  },

  {
    id: 79,
    name: "Porta tarjetas de viaje",
    category: "Seguridad",
    price: 75,
    image: "imagenes/producto-79.jpg",
    imageAlt: "Porta tarjetas de viaje",
    imageKind: "generated",
    description: "Porta tarjetas compacto para viajar."
  },

  {
    id: 80,
    name: "Bolsa para pasaporte",
    category: "Seguridad",
    price: 100,
    image: "imagenes/producto-80.jpg",
    imageAlt: "Bolsa para pasaporte",
    imageKind: "generated",
    description: "Bolsa para proteger y llevar el pasaporte."
  },

  {
    id: 81,
    name: "Etiqueta identificadora",
    category: "Seguridad",
    price: 45,
    image: "imagenes/producto-43.jpg",
    imageAlt: "Etiqueta identificadora",
    imageKind: "generated",
    description: "Etiqueta para identificar el equipaje."
  },

  {
    id: 82,
    name: "Funda protectora para equipaje",
    category: "Seguridad",
    price: 160,
    image: "imagenes/producto-82.jpg",
    imageAlt: "Funda protectora para equipaje",
    imageKind: "generated",
    description: "Funda para proteger el equipaje durante el viaje."
  },

  {
    id: 83,
    name: "Linterna pequeña",
    category: "Seguridad",
    price: 75,
    image: "imagenes/linterna.jpg",
    imageAlt: "Linterna pequeña",
    imageKind: "photo",
    description: "Linterna compacta para llevar durante el viaje."
  },

  {
    id: 84,
    name: "Luz de seguridad",
    category: "Seguridad",
    price: 90,
    image: "imagenes/producto-84.jpg",
    imageAlt: "Luz de seguridad",
    imageKind: "generated",
    description: "Luz pequeña para mejorar la visibilidad."
  },

  {
    id: 85,
    name: "Organizador de documentos",
    category: "Seguridad",
    price: 140,
    image: "imagenes/producto-42.jpg",
    imageAlt: "Organizador de documentos",
    imageKind: "generated",
    description: "Organizador para documentos, tarjetas y reservas."
  },

  {
    id: 86,
    name: "Bolsa oculta de viaje",
    category: "Seguridad",
    price: 130,
    image: "imagenes/producto-86.jpg",
    imageAlt: "Bolsa oculta de viaje",
    imageKind: "generated",
    description: "Bolsa discreta para llevar objetos personales."
  },


  // =========================
  // CUIDADO
  // =========================

  {
    id: 87,
    name: "Cepillo dental de viaje",
    category: "Cuidado",
    price: 55,
    image: "imagenes/cepillo-dientes.jpg",
    imageAlt: "Cepillo dental de viaje",
    imageKind: "photo",
    description: "Cepillo dental práctico para llevar durante el viaje."
  },

  {
    id: 88,
    name: "Estuche para cepillo dental",
    category: "Cuidado",
    price: 55,
    image: "imagenes/producto-88.jpg",
    imageAlt: "Estuche para cepillo dental",
    imageKind: "generated",
    description: "Estuche para proteger el cepillo dental."
  },

  {
    id: 89,
    name: "Peine de viaje",
    category: "Cuidado",
    price: 45,
    image: "imagenes/producto-89.jpg",
    imageAlt: "Peine de viaje",
    imageKind: "generated",
    description: "Peine compacto para llevar fácilmente."
  },

  {
    id: 90,
    name: "Cepillo para cabello",
    category: "Cuidado",
    price: 70,
    image: "imagenes/producto-90.jpg",
    imageAlt: "Cepillo para cabello",
    imageKind: "generated",
    description: "Cepillo compacto para el cabello."
  },

  {
    id: 91,
    name: "Espejo pequeño",
    category: "Cuidado",
    price: 50,
    image: "imagenes/producto-91.jpg",
    imageAlt: "Espejo pequeño",
    imageKind: "generated",
    description: "Espejo pequeño para llevar en el bolso."
  },

  {
    id: 92,
    name: "Botellas para líquidos",
    category: "Cuidado",
    price: 80,
    image: "imagenes/producto-92.jpg",
    imageAlt: "Botellas para líquidos",
    imageKind: "generated",
    description: "Botellas pequeñas para llevar líquidos de cuidado personal."
  },

  {
    id: 93,
    name: "Estuche de cuidado personal",
    category: "Cuidado",
    price: 150,
    image: "imagenes/producto-36.jpg",
    imageAlt: "Estuche de cuidado personal",
    imageKind: "generated",
    description: "Estuche para organizar artículos de cuidado personal."
  },

  {
    id: 94,
    name: "Toallitas húmedas",
    category: "Cuidado",
    price: 45,
    image: "imagenes/producto-94.jpg",
    imageAlt: "Toallitas húmedas",
    imageKind: "generated",
    description: "Toallitas prácticas para llevar durante el viaje."
  },

  {
    id: 95,
    name: "Protector solar",
    category: "Cuidado",
    price: 130,
    image: "imagenes/protector-solar.jpg",
    imageAlt: "Protector solar",
    imageKind: "photo",
    description: "Protector solar para llevar durante viajes y actividades al aire libre."
  },

  {
    id: 96,
    name: "Gel antibacterial",
    category: "Cuidado",
    price: 60,
    image: "imagenes/producto-96.jpg",
    imageAlt: "Gel antibacterial",
    imageKind: "generated",
    description: "Gel práctico para mantener las manos limpias durante el viaje."
  },

  {
    id: 97,
    name: "Kit de cuidado personal",
    category: "Cuidado",
    price: 160,
    image: "imagenes/kit-higiene.jpg",
    imageAlt: "Kit de cuidado personal",
    imageKind: "photo",
    description: "Kit compacto con artículos básicos de cuidado personal."
  },

  {
    id: 98,
    name: "Estuche para jabón",
    category: "Cuidado",
    price: 50,
    image: "imagenes/producto-98.jpg",
    imageAlt: "Estuche para jabón",
    imageKind: "generated",
    description: "Estuche para transportar jabón durante el viaje."
  },

  {
    id: 99,
    name: "Kit de viaje familiar",
    category: "Cuidado",
    price: 220,
    image: "imagenes/producto-99.jpg",
    imageAlt: "Kit de viaje familiar",
    imageKind: "generated",
    description: "Kit práctico para llevar artículos personales de la familia."
  },

  {
    id: 100,
    name: "Kit de cuidado infantil",
    category: "Cuidado",
    price: 180,
    image: "imagenes/producto-100.jpg",
    imageAlt: "Kit de cuidado infantil",
    imageKind: "generated",
    description: "Kit compacto para llevar artículos de cuidado infantil durante el viaje."
  }

);


/* =========================================================
   OPCIONES PARA LOS PRODUCTOS 31 AL 100
   ========================================================= */

Object.assign(PRODUCT_OPTIONS, {

  // EQUIPAJE

  31: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  32: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  33: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande'],
    Cantidad: ['3 piezas', '6 piezas']
  },

  34: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Mediana', 'Grande']
  },

  35: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Estándar']
  },

  36: {
    Color: ['Negro', 'Azul', 'Beige', 'Rosa'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  37: {
    Color: ['Negro', 'Gris', 'Azul'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  38: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Pequeña', 'Grande']
  },

  39: {
    Color: ['Negro', 'Azul', 'Rojo', 'Verde'],
    Tamaño: ['Pequeña', 'Mediana', 'Grande']
  },

  40: {
    Color: ['Negro', 'Azul', 'Rojo', 'Rosa'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  41: {
    Color: ['Negro', 'Café', 'Azul'],
    Tamaño: ['Estándar']
  },

  42: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  43: {
    Color: ['Negro', 'Azul', 'Rojo', 'Verde'],
    Cantidad: ['1 unidad', '2 unidades', '4 unidades']
  },

  44: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeña', 'Mediana']
  },


  // TECNOLOGÍA

  45: {
    Color: ['Negro', 'Blanco', 'Azul'],
    Capacidad: ['5,000 mAh', '10,000 mAh', '20,000 mAh']
  },

  46: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['USB-C', 'USB-A']
  },

  47: {
    Color: ['Negro', 'Blanco'],
    Largo: ['1 metro', '2 metros']
  },

  48: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['Universal']
  },

  49: {
    Color: ['Negro', 'Blanco', 'Azul'],
    Tipo: ['Inalámbricos']
  },

  50: {
    Color: ['Negro', 'Blanco', 'Azul'],
    Tipo: ['Con micrófono', 'Sin micrófono']
  },

  51: {
    Color: ['Negro', 'Gris', 'Blanco'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  52: {
    Color: ['Negro', 'Azul'],
    Capacidad: ['32 GB', '64 GB', '128 GB']
  },

  53: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['USB-A', 'USB-C']
  },

  54: {
    Color: ['Negro', 'Gris'],
    Puertos: ['3 puertos', '4 puertos']
  },

  55: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['Flexible', 'Estándar']
  },

  56: {
    Color: ['Negro', 'Blanco'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  57: {
    Color: ['Negro', 'Azul'],
    Capacidad: ['10,000 mAh', '20,000 mAh']
  },

  58: {
    Color: ['Negro', 'Blanco'],
    Tipo: ['USB-C', 'Multiconector']
  },


  // CONFORT

  59: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Niño', 'Adulto']
  },

  60: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  61: {
    Color: ['Negro', 'Azul', 'Rosa'],
    Tamaño: ['Niño', 'Adulto']
  },

  62: {
    Color: ['Blanco', 'Azul', 'Rosa'],
    Tipo: ['Pequeños', 'Medianos']
  },

  63: {
    Color: ['Gris', 'Azul', 'Beige'],
    Tamaño: ['Individual', 'Grande']
  },

  64: {
    Color: ['Negro', 'Blanco', 'Gris'],
    Talla: ['Pequeña', 'Mediana', 'Grande']
  },

  65: {
    Color: ['Negro', 'Azul', 'Gris'],
    Talla: ['Pequeña', 'Mediana', 'Grande']
  },

  66: {
    Color: ['Negro', 'Azul', 'Blanco'],
    Capacidad: ['500 ml', '750 ml', '1 litro']
  },

  67: {
    Color: ['Negro', 'Azul', 'Blanco'],
    Capacidad: ['500 ml', '750 ml', '1 litro']
  },

  68: {
    Color: ['Negro', 'Azul', 'Blanco'],
    Capacidad: ['350 ml', '500 ml']
  },

  69: {
    Color: ['Blanco', 'Azul', 'Gris'],
    Tamaño: ['Mediana', 'Grande']
  },

  70: {
    Color: ['Negro', 'Gris', 'Azul'],
    Tamaño: ['Pequeño', 'Grande']
  },

  71: {
    Color: ['Negro', 'Azul', 'Rojo', 'Verde'],
    Capacidad: ['500 ml', '750 ml', '1 litro']
  },

  72: {
    Color: ['Transparente', 'Azul', 'Rosa'],
    Tamaño: ['Pequeña', 'Mediana'],
    Cantidad: ['1 unidad', '2 unidades']
  },


  // SEGURIDAD

  73: {
    Color: ['Negro', 'Café', 'Azul'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  74: {
    Color: ['Negro', 'Café', 'Azul'],
    Capacidad: ['4 tarjetas', '8 tarjetas']
  },

  75: {
    Color: ['Negro', 'Plateado', 'Dorado'],
    Tipo: ['Pequeño', 'Mediano']
  },

  76: {
    Color: ['Negro', 'Plateado', 'Dorado'],
    Tipo: ['3 dígitos', '4 dígitos']
  },

  77: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Largo: ['1 metro', '2 metros']
  },

  78: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  79: {
    Color: ['Negro', 'Café', 'Azul'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  80: {
    Color: ['Negro', 'Café', 'Azul'],
    Tamaño: ['Pequeña', 'Mediana']
  },

  81: {
    Color: ['Negro', 'Azul', 'Rojo', 'Verde'],
    Tipo: ['Básica', 'Grande']
  },

  82: {
    Color: ['Negro', 'Azul', 'Rojo'],
    Tamaño: ['Mediana', 'Grande']
  },

  83: {
    Color: ['Negro', 'Gris'],
    Potencia: ['100 lm', '200 lm']
  },

  84: {
    Color: ['Rojo', 'Azul', 'Verde'],
    Tipo: ['LED', 'Reflectante']
  },

  85: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  86: {
    Color: ['Negro', 'Azul', 'Gris'],
    Tamaño: ['Pequeña', 'Mediana']
  },


  // CUIDADO

  87: {
    Color: ['Azul', 'Rosa', 'Verde'],
    Edad: ['Niño', 'Adulto'],
    Tipo: ['Suave', 'Medio']
  },

  88: {
    Color: ['Azul', 'Rosa', 'Transparente'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  89: {
    Color: ['Negro', 'Azul', 'Rosa'],
    Edad: ['Niño', 'Adulto'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  90: {
    Color: ['Negro', 'Azul', 'Rosa'],
    Edad: ['Niño', 'Adulto']
  },

  91: {
    Color: ['Plateado', 'Rosa', 'Azul'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  92: {
    Color: ['Transparente', 'Azul', 'Rosa'],
    Capacidad: ['30 ml', '60 ml', '100 ml'],
    Cantidad: ['2 unidades', '4 unidades']
  },

  93: {
    Color: ['Negro', 'Beige', 'Azul', 'Rosa'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  94: {
    Tipo: ['Sin aroma', 'Aroma suave'],
    Cantidad: ['10 unidades', '20 unidades']
  },

  95: {
    Edad: ['Niño', 'Adulto'],
    FPS: ['FPS 30', 'FPS 50'],
    Presentación: ['100 ml', '200 ml']
  },

  96: {
    Aroma: ['Neutro', 'Aloe'],
    Presentación: ['60 ml', '120 ml']
  },

  97: {
    Tipo: ['Básico', 'Completo'],
    Edad: ['Niño', 'Adulto']
  },

  98: {
    Color: ['Azul', 'Rosa', 'Transparente'],
    Tamaño: ['Pequeño', 'Mediano']
  },

  99: {
    Tipo: ['Básico', 'Completo'],
    Tamaño: ['Pequeño', 'Mediano', 'Grande']
  },

  100: {
    Color: ['Azul', 'Rosa', 'Verde'],
    Edad: ['Niño', 'Adulto'],
    Tipo: ['Básico', 'Completo']
  }

});

// ============================================================
// PRECIOS SEGÚN LA OPCIÓN
// ============================================================
// El precio original es el precio de la opción más económica.
// Las demás opciones agregan una cantidad pequeña.
//
// Ejemplo:
// Maleta 20 pulgadas = L 650
// Maleta 24 pulgadas = L 800
// Maleta 28 pulgadas = L 950
// ============================================================

const OPTION_PRICE_ADJUSTMENTS = {

  1: {
    Tamaño: {
      "Mediana": 0,
      "Grande": 100
    }
  },

  2: {
    Tamaño: {
      "20 pulgadas": 0,
      "24 pulgadas": 150,
      "28 pulgadas": 300
    }
  },

  3: {
    Tamaño: {
      "Pequeño": 0,
      "Mediano": 50
    }
  },

  6: {
    Tipo: {
      "3 dígitos": 0,
      "4 dígitos": 20
    }
  },

  7: {
    Capacidad: {
      "10,000 mAh": 0,
      "20,000 mAh": 150
    }
  },

  8: {
    Tipo: {
      "USB-C": 0,
      "USB-A": -10
    }
  },

  9: {
    Largo: {
      "1 metro": 0,
      "2 metros": 20
    }
  },

  11: {
    Tipo: {
      "Inalámbricos": 0,
      "Alámbricos": -50
    }
  },

  12: {
    Uso: {
      "Escritorio": 0,
      "Auto": 20
    }
  },

  14: {
    Capacidad: {
      "500 ml": 0,
      "750 ml": 30
    }
  },

  16: {
    Cantidad: {
      "2 pares": 0,
      "4 pares": 30
    }
  },

  18: {
    Tamaño: {
      "Mediana": 0,
      "Grande": 30
    }
  },

  22: {
    Tamaño: {
      "Pequeña": 0,
      "Mediana": 30,
      "Grande": 60
    }
  },

  24: {
    Potencia: {
      "100 lm": 0,
      "300 lm": 40
    }
  },

  25: {
    Tamaño: {
      "Pequeño": 0,
      "Mediano": 30
    }
  },

  26: {
    Capacidad: {
      "30 ml": 0,
      "60 ml": 20
    }
  },

  28: {
    Tamaño: {
      "Mediano": 0,
      "Grande": 40
    }
  },

  29: {
    Tipo: {
      "FPS 30": 0,
      "FPS 50": 40
    },

    Presentación: {
      "100 ml": 0,
      "200 ml": 50
    }
  },

  30: {
    Tamaño: {
      "Compacto": 0,
      "Mediano": 40
    }
  }
};


// ============================================================
// CRÉDITOS DE FOTOGRAFÍAS
// ============================================================

const PHOTO_CREDITS = [
  {
    id: 1,
    title: "Blue backpack",
    page: "https://unsplash.com/photos/_H0fjILH5Vw",
    author: "Sun Lingyan",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    id: 2,
    title: "Olive carry-on suitcase",
    page: "https://unsplash.com/photos/zQsEp5sRSKY",
    author: "American Green Travel",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    url: "https://images.unsplash.com/photo-1670888616478-771051efa21d?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    id: 3,
    title: "Leather duffel bag on the ground.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Leather_duffel_bag_on_the_ground.jpg",
    author: "Harsh Jadav",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  {
    id: 4,
    title: "Sling bag",
    page: "https://unsplash.com/photos/0SRsZS6hXYA",
    author: "Romain B",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
    url: "https://images.unsplash.com/photo-1727719589286-3e22d4d3fbed?fm=jpg&fit=max&w=1000&q=85"
  },
  {
    id: 5,
    title: "UnixWare luggage tag.jpg",
    page: "https://commons.wikimedia.org/wiki/File:UnixWare_luggage_tag.jpg",
    author: "User",
    license: "CC BY-SA",
    licenseUrl: "https://creativecommons.org/licenses/"
  },
  {
    id: 6,
    title: "Luggage lock",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 7,
    title: "Power bank",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 8,
    title: "Phone charger",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 9,
    title: "USB cable",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 10,
    title: "Universal adapter",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 11,
    title: "Headphones",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 12,
    title: "Phone holder",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 13,
    title: "Travel pillow",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 14,
    title: "Reusable bottle",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 15,
    title: "Sleep mask",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 16,
    title: "Ear plugs",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 17,
    title: "Compact umbrella",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 18,
    title: "Travel towel",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 19,
    title: "Passport holder",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 20,
    title: "Travel document holder",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 21,
    title: "Travel wallet",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 22,
    title: "Waterproof bag",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 23,
    title: "Luggage strap",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 24,
    title: "Flashlight",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 25,
    title: "Travel toiletry bag",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 26,
    title: "Travel liquid bottles",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 27,
    title: "Travel toothbrush",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    url: "https://images.pexels.com/photos/9185865/pexels-photo-9185865.jpeg?auto=compress&cs=tinysrgb&w=1000"
  },
  {
    id: 28,
    title: "Travel hygiene kit",
    page: "https://unsplash.com/",
    author: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license"
  },
  {
    id: 29,
    title: "Sunscreen product photography",
    author: "Tuan Nguyen",
    page: "https://unsplash.com/photos/AuDD-ejVWLA",
    url: "https://images.unsplash.com/photo-1738721798337-1c0036181229?fm=jpg&fit=max&w=1000&q=85",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license/"
  },
  {
    id: 30,
    title: "Kit pronto soccorso moto",
    page: "https://commons.wikimedia.org/wiki/File:Kit_pronto_soccorso_moto_(aperto).JPG",
    author: "Umberto NURS",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  }
];

// Vista de demostración: una sola base conserva la geometría entre variantes.
const VARIANT_COLORS = {Negro:[.13,.15,.17],Azul:[.08,.32,.63],Rojo:[.68,.10,.13],Verde:[.24,.43,.29]};
const VARIANT_SIZES = {'20 pulgadas':.72,'24 pulgadas':.86,'28 pulgadas':1};
let variantSerial = 0;
function variantModel(product, options = {}) {
  if(product.id !== 2)return null;
  const color=Object.hasOwn(VARIANT_COLORS,options.Color)?options.Color:'Negro';
  const size=Object.hasOwn(VARIANT_SIZES,options.Tamaño)?options.Tamaño:'20 pulgadas';
  return {color,size,channels:VARIANT_COLORS[color],scale:VARIANT_SIZES[size],image:'imagenes/maleta-variantes-base.png'};
}
function variantMarkup(product, options = {}, className = 'detail-image') {
  const v=variantModel(product,options);if(!v)return '';
  const id='variant-color-'+(++variantSerial);
  const channels=v.channels.map((value,i)=>`<feFunc${'RGB'[i]} type="table" tableValues="0 .055 .12 ${value*.72} ${value} ${Math.min(1,value+.22)}"/>`).join('');
  return `<svg class="${className} variant-image" viewBox="0 0 1000 667" role="img" aria-label="Maleta de viaje, ${v.color}, ${v.size}." xmlns="http://www.w3.org/2000/svg"><defs><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${channels}<feFuncA type="identity"/></feComponentTransfer></filter></defs><image href="imagenes/maleta-fondo-jardin.png" width="1000" height="667" preserveAspectRatio="xMidYMid slice"/><g transform="translate(710 625) scale(${v.scale}) translate(-710 -625)"><ellipse cx="714" cy="613" rx="135" ry="14" fill="#182017" opacity=".23"/><image href="${v.image}" x="510" y="57" width="400" height="580" filter="url(#${id})"/></g></svg>`;
}
window.RumboVariantPreview={model:variantModel,markup:variantMarkup};

if (window.RumboDatabase?.connected) {
  const catalog = window.RumboDatabase.catalog;
  PRODUCTS.splice(0, PRODUCTS.length, ...catalog.products);
  for (const key of Object.keys(PRODUCT_OPTIONS)) delete PRODUCT_OPTIONS[key];
  Object.assign(PRODUCT_OPTIONS, catalog.productOptions);
  for (const key of Object.keys(OPTION_PRICE_ADJUSTMENTS)) delete OPTION_PRICE_ADJUSTMENTS[key];
  Object.assign(OPTION_PRICE_ADJUSTMENTS, catalog.priceAdjustments);
}
window.RumboProducts = PRODUCTS;
window.RumboProductPrice = (product, options = {}) => product.price + Object.entries(options || {}).reduce((sum, [key,value]) => sum + (Number(OPTION_PRICE_ADJUSTMENTS[product.id]?.[key]?.[value]) || 0), 0);


// ============================================================
// FUNCIONES PRINCIPALES
// ============================================================

(() => {

  "use strict";

  if (!document.querySelector("#products-grid")) return;

  const $ = selector => document.querySelector(selector);

  const money = value =>
    "L " +
    new Intl.NumberFormat("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const normalize = value =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const icon = name =>
    `<svg class="icon" aria-hidden="true"><use href="#${name}"/></svg>`;

  const productsById = new Map(
    PRODUCTS.map(product => [product.id, product])
  );

  const optionDefaults = options =>
    Object.fromEntries(
      Object.entries(options || {}).map(
        ([name, values]) => [name, values[0]]
      )
    );

  const optionSummary = options =>
    Object.entries(options || {})
      .map(([name, value]) => `${name}: ${value}`)
      .join(" · ");

  const optionsKey = options =>
    Object.entries(options || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => `${name}=${value}`)
      .join("|");


  // ==========================================================
  // CREAR LAS OPCIONES DEL PRODUCTO
  // ==========================================================

  const renderProductOptions = product => {

    const options = PRODUCT_OPTIONS[product.id] || {};

    return Object.entries(options)
      .map(([name, values]) => {

        return `
          <label class="product-option">
            <span>${escapeHTML(name)}</span>

            <select data-option-name="${escapeHTML(name)}">

              ${values
                .map(
                  value =>
                    `<option value="${escapeHTML(value)}">
                      ${escapeHTML(value)}
                    </option>`
                )
                .join("")}

            </select>
          </label>
        `;

      })
      .join("");
  };


  // ==========================================================
  // CARRITO
  // ==========================================================

  const CART_KEY = "rumbo.store.cart.v2";
  const FAVORITES_KEY = "rumbo.store.favorites.v2";

  const reducedMotion =
    matchMedia("(prefers-reduced-motion: reduce)");

  const grid = $("#products-grid");
  const cartDialog = $("#cart-modal");
  const detailDialog = $("#product-modal");

  let cart = [];
  let favorites = new Set();

  let category = "Todos";
  let favoritesOnly = false;

  let toastTimer;
  let toastAction = null;
  let toastTrigger = null;
  let searchTimer;

  const buttonTimers = new WeakMap();


  // ==========================================================
  // LOCAL STORAGE
  // ==========================================================

  function storageRead(key) {

    try {

      return JSON.parse(
        (window.RumboStorage || localStorage).getItem(key) || "[]"
      );

    } catch {

      return [];

    }
  }


  function storageWrite(key, value) {

    try {

      (window.RumboStorage || localStorage).setItem(
        key,
        JSON.stringify(value)
      );

    } catch {

      if ($("#storage-notice")) {
        $("#storage-notice").hidden = false;
      }

    }
  }


  // ==========================================================
  // LIMPIAR CARRITO
  // ==========================================================

  function sanitizeCart(value) {

    if (!Array.isArray(value)) return [];

    return value
      .slice(0, 100)
      .filter(item =>
        item &&
        productsById.has(item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      )
      .map(item => ({
        id: item.id,
        quantity: Math.min(99, item.quantity),
        options:
          item.options &&
          typeof item.options === "object"
            ? item.options
            : {}
      }));
  }


  function loadState() {

    cart = sanitizeCart(
      storageRead(CART_KEY)
    );

    const saved =
      storageRead(FAVORITES_KEY);

    favorites = new Set(
      Array.isArray(saved)
        ? saved.filter(id => productsById.has(id))
        : []
    );
  }


  function saveCart() {

    storageWrite(
      CART_KEY,
      cart
    );
  }


  // ==========================================================
  // CALCULAR PRECIO SEGÚN LAS OPCIONES
  // ==========================================================

  function getProductPrice(
    product,
    selectedOptions = {}
  ) {

    if (!product) return 0;

    const adjustments =
      OPTION_PRICE_ADJUSTMENTS[product.id] || {};

    let adjustment = 0;

    Object.entries(selectedOptions || {})
      .forEach(([name, value]) => {

        if (
          adjustments[name] &&
          adjustments[name][value] !== undefined
        ) {

          adjustment += Number(
            adjustments[name][value]
          );

        }

      });

    return product.price + adjustment;
  }


  // ==========================================================
  // TOTAL DEL CARRITO
  // ==========================================================

  function total() {

    return cart.reduce(
      (sum, item) => {

        const product =
          productsById.get(item.id);

        return (
          sum +
          getProductPrice(
            product,
            item.options
          ) *
          item.quantity
        );

      },
      0
    );
  }


  // ==========================================================
  // MOSTRAR EL CATÁLOGO
  // ==========================================================

  function renderProducts() {

    const query =
      normalize(
        $("#product-search").value
      );

    const sort =
      $("#product-sort").value;

    const list =
      PRODUCTS.filter(product =>

        (category === "Todos" ||
          product.category === category)

        &&

        (!favoritesOnly ||
          favorites.has(product.id))

        &&

        normalize(
          `${product.name}
           ${product.category}
           ${product.description}`
        ).includes(query)

      );


    if (sort === "price-asc") {

      list.sort(
        (a, b) =>
          a.price - b.price ||
          a.id - b.id
      );

    }


    if (sort === "price-desc") {

      list.sort(
        (a, b) =>
          b.price - a.price ||
          a.id - b.id
      );

    }


    if (sort === "name") {

      list.sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            "es"
          )
      );

    }


    grid.innerHTML =
      list.map(
        (product, index) => {

          return `
            <article
              class="product-card"
              data-product="${product.id}"
              style="--delay:${Math.min(index, 7) * 25}ms"
            >

              <div class="product-image-container">

                <button
                  class="image-detail-button"
                  type="button"
                  data-detail="${product.id}"
                  aria-label="Ver detalle de ${escapeHTML(product.name)}"
                >

                  <img
                    class="product-image"
                    src="${product.image}?v=catalogo-limpio-3"
                    alt="${escapeHTML(product.imageAlt || product.name)}"
                    width="600"
                    height="600"
                    loading="lazy"
                    decoding="async"
                  >

                </button>


                <button
                  class="icon-button favorite-button"
                  type="button"
                  data-favorite="${product.id}"
                  aria-pressed="${favorites.has(product.id)}"
                  aria-label="${
                    favorites.has(product.id)
                      ? "Quitar de favoritos:"
                      : "Guardar como favorito:"
                  } ${escapeHTML(product.name)}"
                >

                  ${icon("heart")}

                </button>

              </div>


              <div class="product-info">

                <p class="product-category">
                  ${escapeHTML(product.category)}
                </p>


                <h3 class="product-title">

                  <button
                    type="button"
                    data-detail="${product.id}"
                  >
                    ${escapeHTML(product.name)}
                  </button>

                </h3>


                <p class="product-description">
                  ${escapeHTML(product.description)}
                </p>


                <div class="product-bottom">

                  <span class="product-price">
                    ${money(product.price)}
                    <small>HNL</small>
                  </span>


                  <button
                    class="add-btn"
                    type="button"
                    data-add="${product.id}"
                    aria-label="Agregar ${escapeHTML(product.name)} al carrito"
                  >
                    <span aria-hidden="true">+</span>
                    Agregar
                  </button>


                  <button
                    class="customize-btn"
                    type="button"
                    data-detail="${product.id}"
                  >
                    Elegir opciones
                  </button>

                </div>

              </div>

            </article>
          `;

        }
      )
      .join("");


    $("#products-result").textContent =
      `${list.length} de ${PRODUCTS.length} productos` +
      (
        category !== "Todos"
          ? " · " + category
          : ""
      );


    $("#empty-products").hidden =
      list.length > 0;


    $("#reset-filters").hidden =
      !query &&
      category === "Todos" &&
      !favoritesOnly &&
      sort === "featured";


    $("#favorites-label").hidden =
      !favoritesOnly;


    document
      .querySelectorAll(".filter-btn")
      .forEach(button => {

        const active =
          button.dataset.category === category;

        button.classList.toggle(
          "active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          String(active)
        );

      });


    updateFavoriteCount();
  }


  // ==========================================================
  // FAVORITOS
  // ==========================================================

  function updateFavoriteCount() {

    $("#favorites-count").textContent =
      favorites.size;

    $("#favorites-count").hidden =
      favorites.size === 0;

    $("#favorites-toggle")
      .setAttribute(
        "aria-pressed",
        String(favoritesOnly)
      );

    $("#favorites-toggle")
      .setAttribute(
        "aria-label",
        favoritesOnly
          ? "Mostrar todos los productos"
          : `Mostrar favoritos (${favorites.size})`
      );
  }


  function resetFilters() {

    clearTimeout(searchTimer);

    category = "Todos";
    favoritesOnly = false;

    $("#product-search").value = "";

    $("#product-sort").value =
      "featured";

    renderProducts();
  }


  // ==========================================================
  // MENSAJES
  // ==========================================================

  function hideToast(restore = false) {

    clearTimeout(toastTimer);

    const focused =
      $("#toast").contains(
        document.activeElement
      );

    $("#toast").hidden = true;

    if (
      restore &&
      focused
    ) {

      (
        toastTrigger?.isConnected
          ? toastTrigger
          : $("#open-cart-btn")
      ).focus();

    }
  }


  function scheduleToastHide() {

    clearTimeout(toastTimer);

    toastTimer =
      setTimeout(() => {

        if (
          $("#toast").matches(":hover") ||
          $("#toast").contains(
            document.activeElement
          )
        ) {

          scheduleToastHide();

        } else {

          hideToast();

        }

      }, 6000);
  }


  function notify(message, actionLabel = 'Ver carrito', action = openCart) {
  toastTrigger = document.activeElement;

  $('#toast-message').textContent = message;

  $('#toast-action').textContent = actionLabel;

  $('#toast-action').hidden = !action;

  toastAction = action;

  $('#toast').hidden = false;

  scheduleToastHide();
}
  // ==========================================================
  // ANIMACIÓN AL AGREGAR
  // ==========================================================

  function animateAdd(
    product,
    source,
    rect
  ) {

    const button =
      source?.matches("[data-add]")
        ? source
        : null;


    if (button) {

      clearTimeout(
        buttonTimers.get(button)
      );

      button.classList.add("added");

      button.textContent =
        "✓ Añadido";


      buttonTimers.set(
        button,
        setTimeout(() => {

          if (button.isConnected) {

            button.classList.remove(
              "added"
            );

            button.innerHTML =
              '<span aria-hidden="true">+</span> Agregar';

          }

        }, 1400)
      );

    }


    if (reducedMotion.matches) {
      return;
    }


    $("#cart-count").animate(
      [
        {
          transform: "scale(1)"
        },
        {
          transform: "scale(1.4)"
        },
        {
          transform: "scale(1)"
        }
      ],
      {
        duration: 420,
        easing: "ease-out"
      }
    );


    const start =
      rect ||
      source
        ?.closest(".product-card")
        ?.querySelector("img")
        ?.getBoundingClientRect();


    if (
      !start ||
      start.bottom < 0 ||
      start.top > innerHeight
    ) {

      return;
    }


    const end =
      $("#open-cart-btn")
        .getBoundingClientRect();


    const img =
      document.createElement("img");

    img.src =
      product.image +
      "?v=catalogo-limpio-3";

    img.alt = "";

    img.className =
      "flying-product";


    const x =
      start.left +
      start.width / 2 -
      35;

    const y =
      start.top +
      start.height / 2 -
      35;


    Object.assign(
      img.style,
      {
        left: x + "px",
        top: y + "px",
        width: "70px",
        height: "70px"
      }
    );


    document.body.appendChild(img);


    const animation =
      img.animate(
        [
          {
            transform:
              "translate(0,0) scale(1)",
            opacity: 0.95
          },
          {
            transform:
              `translate(${
                end.left +
                end.width / 2 -
                x -
                35
              }px,${
                end.top +
                end.height / 2 -
                y -
                35
              }px) scale(.18)`,
            opacity: 0.15
          }
        ],
        {
          duration: 620,
          easing: "cubic-bezier(.4,0,.2,1)"
        }
      );


    animation.finished
      .catch(() => {})
      .finally(() => img.remove());
  }


  // ==========================================================
  // AGREGAR AL CARRITO
  // ==========================================================

  function addToCart(
    id,
    source,
    rect,
    selectedOptions = {}
  ) {

    const product =
      productsById.get(id);

    if (!product) return;


    const cleanOptions = {
      ...selectedOptions
    };


    const existing =
      cart.find(
        item =>
          item.id === id &&
          optionsKey(item.options) ===
            optionsKey(cleanOptions)
      );


    if (
      existing?.quantity >= 99
    ) {

      notify(
        "Puedes añadir hasta 99 unidades de cada producto."
      );

      return;
    }


    if (existing) {

      existing.quantity++;

    } else {

      cart.push({
        id,
        quantity: 1,
        options: cleanOptions
      });

    }
    saveCart();

    renderCart();

    animateAdd(
      product,
      source,
      rect
    );


    notify(
      `${product.name} añadido a tu carrito por ${money(
        getProductPrice(
          product,
          cleanOptions
        )
      )}.`
    );
  }


  // ==========================================================
  // MOSTRAR CARRITO
  // ==========================================================

  function renderCart() {

    const active =
      document.activeElement;


    const focusedAction =
      $("#cart-items").contains(active)
        ? {
            id: active.dataset.id,
            options: active.dataset.options,
            action: active.dataset.action
          }
        : null;


    const count =
      cart.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );


    $("#cart-count").textContent =
      count;


    $("#open-cart-btn")
      .setAttribute(
        "aria-label",
        `Abrir carrito, ${count} ${
          count === 1
            ? "artículo"
            : "artículos"
        }`
      );


    $("#cart-items-label").textContent =
      `(${count})`;


    $("#cart-subtotal").textContent =
      money(total());


    $("#cart-total").textContent =
      money(total());


    $("#checkout-btn").disabled =
      !cart.length;


    $("#cart-items").innerHTML =
      cart.length

        ? cart
            .map((item, index) => {

              const product =
                productsById.get(item.id);

              const itemOptionsKey =
                optionsKey(
                  item.options
                );


              return `
                <article class="cart-item">

                  ${variantMarkup(product,item.options,'cart-item-image')||`<img class="cart-item-image" src="${product.image}" alt="${escapeHTML(product.imageAlt || product.name)}" width="76" height="91">`}


                  <div class="cart-item-main">

                    <h3>
                      ${escapeHTML(product.name)}
                    </h3>


                    <p class="unit-price">
                      ${money(
                        getProductPrice(
                          product,
                          item.options
                        )
                      )}
                      / unidad
                    </p>


                    ${
                      item.options &&
                      Object.keys(item.options).length

                        ? `
                          <p class="cart-item-options">
                            ${escapeHTML(
                              optionSummary(
                                item.options
                              )
                            )}
                          </p>
                        `

                        : ""
                    }


                    <div class="cart-item-bottom">

                      <div class="quantity-controls">

                        <button
                          type="button"
                          data-id="${product.id}"
                          data-options="${escapeHTML(itemOptionsKey)}"
                          data-index="${index}"
                          data-action="minus"
                          aria-label="Reducir cantidad de ${escapeHTML(product.name)}"
                          ${
                            item.quantity === 1
                              ? "disabled"
                              : ""
                          }
                        >
                          −
                        </button>


                        <output
                          aria-label="Cantidad de ${escapeHTML(product.name)}"
                        >
                          ${item.quantity}
                        </output>


                        <button
                          type="button"
                          data-id="${product.id}"
                          data-options="${escapeHTML(itemOptionsKey)}"
                          data-index="${index}"
                          data-action="plus"
                          aria-label="Aumentar cantidad de ${escapeHTML(product.name)}"
                          ${
                            item.quantity === 99
                              ? "disabled"
                              : ""
                          }
                        >
                          +
                        </button>

                      </div>


                      <span class="line-total">
                        ${money(
                          getProductPrice(
                            product,
                            item.options
                          ) *
                          item.quantity
                        )}
                      </span>

                    </div>


                    <button
                      class="remove-btn"
                      type="button"
                      data-id="${product.id}"
                      data-options="${escapeHTML(itemOptionsKey)}"
                      data-index="${index}"
                      data-action="remove"
                    >
                      Eliminar
                    </button>

                  </div>

                </article>
              `;

            })
            .join("")

        : `
          <div class="empty-cart">

            ${icon("bag")}

            <h3>
              Tu carrito está vacío.
            </h3>

            <p>
              Añade productos del catálogo para calcular el total.
            </p>

          </div>
        `;


    if (
      focusedAction &&
      cartDialog.open
    ) {

      const match =
        $(
          `#cart-items [data-id="${focusedAction.id}"][data-options="${CSS.escape(
            focusedAction.options || ""
          )}"][data-action="${focusedAction.action}"]:not(:disabled)`
        );


      (
        match ||
        $("#cart-items button:not(:disabled)") ||
        $("#continue-shopping")
      ).focus({
        preventScroll: true
      });

    }
  }


  // ==========================================================
  // ABRIR CARRITO
  // ==========================================================

  function openCart() {

    hideToast();

    if (detailDialog.open) {
      detailDialog.close();
    }


    if (!cartDialog.open) {

      renderCart();

      cartDialog.showModal();

      document.body.classList.add(
        "dialog-open"
      );

      $("#close-cart-btn").focus();
    }
  }


  // ==========================================================
  // MOSTRAR DETALLE DEL PRODUCTO
  // ==========================================================

  function updateVariantPreview(product,options){
    const visual=$('.detail-visual');if(!visual||!variantModel(product,options))return;
    const original=visual.querySelector('.variant-original');
    original.setAttribute('aria-pressed','false');original.textContent='Ver fotografía original';
    visual.querySelector('.variant-stage').innerHTML=variantMarkup(product,options);
    const v=variantModel(product,options);
    visual.querySelector('.variant-caption').textContent=v.color+' · '+v.size;
  }
  $('#product-detail').addEventListener('click',event=>{
    const button=event.target.closest('.variant-original');if(!button)return;
    const visual=button.closest('.detail-visual'),product=productsById.get(Number(visual.dataset.visualProduct));
    const options=Object.fromEntries([...$('#product-detail').querySelectorAll('[data-option-name]')].map(s=>[s.dataset.optionName,s.value]));
    if(button.getAttribute('aria-pressed')==='true'){updateVariantPreview(product,options);return;}
    visual.querySelector('.variant-stage').innerHTML=`<img class="detail-image" src="${product.image}" alt="Fotografía original de ${escapeHTML(product.name)}">`;
    visual.querySelector('.variant-caption').textContent='Fotografía original';
    button.setAttribute('aria-pressed','true');button.textContent='Volver a mi variante';
  });

  function showDetail(id) {

    const product =
      productsById.get(id);

    if (!product) return;


    const options =
      PRODUCT_OPTIONS[product.id] || {};


    const optionControls =
      Object.keys(options).length

        ? `
          <div class="detail-options">

            <h3>
              Personaliza tu producto
            </h3>

            <p class="detail-options-note">
              Elige las opciones que prefieras antes de agregarlo.
            </p>

            ${renderProductOptions(product)}

          </div>
        `

        : "";


    const defaultOptions =
      optionDefaults(options);


    $("#product-detail").innerHTML = `

      <div class="detail-layout">

        <div class="detail-visual" data-visual-product="${product.id}">
          <div class="variant-stage">${variantMarkup(product,defaultOptions)||`<img class="detail-image" src="${product.image}" alt="${escapeHTML(product.imageAlt || product.name)}">`}</div>
          ${variantModel(product,defaultOptions)?`<p class="variant-caption" role="status">${escapeHTML(defaultOptions.Color)} · ${escapeHTML(defaultOptions.Tamaño)}</p><button type="button" class="variant-original" aria-pressed="false">Ver fotografía original</button>`:''}
        </div>


        <div class="detail-copy">

          <p class="product-category">
            ${escapeHTML(product.category)}
          </p>


          <h2 id="detail-title">
            ${escapeHTML(product.name)}
          </h2>


          <p>
            ${escapeHTML(product.description)}
          </p>


          ${optionControls}


          <div
            class="detail-price"
            data-detail-price="${product.id}"
          >
            ${money(
              getProductPrice(
                product,
                defaultOptions
              )
            )}
            <small>HNL</small>
          </div>


          <button
            type="button"
            class="button button-primary"
            data-detail-add="${product.id}"
          >
            Agregar al carrito
            ${icon("bag")}
          </button>

        </div>

      </div>

    `;


    hideToast();

    detailDialog.showModal();

    document.body.classList.add(
      "dialog-open"
    );

    $("#close-detail").focus({ preventScroll: true });
  }


  // ==========================================================
  // CLICS EN LOS PRODUCTOS
  // ==========================================================

  grid.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest("button");

      if (!button) return;


      // ------------------------------------------------------
      // AGREGAR
      // ------------------------------------------------------

      if (button.dataset.add) {

        const id =
          Number(button.dataset.add);

        const product =
          productsById.get(id);


        // Si el producto tiene opciones,
        // primero se abre el detalle.
        if (
          PRODUCT_OPTIONS[id] &&
          Object.keys(
            PRODUCT_OPTIONS[id]
          ).length
        ) {

          showDetail(id);

        } else {

          addToCart(
            id,
            button
          );

        }
      }


      // ------------------------------------------------------
      // DETALLE
      // ------------------------------------------------------

      if (button.dataset.detail) {

        showDetail(
          Number(
            button.dataset.detail
          )
        );

      }


      // ------------------------------------------------------
      // FAVORITOS
      // ------------------------------------------------------

      if (button.dataset.favorite) {

        const id =
          Number(
            button.dataset.favorite
          );


        const wasSaved =
          favorites.has(id);


        if (wasSaved) {

          favorites.delete(id);

        } else {

          favorites.add(id);

        }


        storageWrite(
          FAVORITES_KEY,
          [...favorites]
        );


        if (favoritesOnly) {

          renderProducts();

          (
            grid.querySelector(
              "[data-favorite]"
            ) ||
            $("#favorites-toggle")
          ).focus({
            preventScroll: true
          });

        } else {

          button.setAttribute(
            "aria-pressed",
            String(!wasSaved)
          );


          button.setAttribute(
            "aria-label",
            `${
              wasSaved
                ? "Guardar como favorito:"
                : "Quitar de favoritos:"
            } ${
              productsById.get(id).name
            }`
          );


          updateFavoriteCount();

        }


        notify(
          wasSaved
            ? "Producto eliminado de favoritos."
            : "Producto guardado en favoritos.",
          "Ver favoritos",
          () => {

            resetFilters();

            favoritesOnly = true;

            renderProducts();

            $("#catalogo")
              .scrollIntoView();

            $("#favorites-toggle")
              .focus({
                preventScroll: true
              });

          }
        );
      }

    }
  );


  // ==========================================================
  // AGREGAR DESDE EL DETALLE
  // ==========================================================

  $("#product-detail").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-detail-add]"
        );


      if (!button) return;


      const image =
        $(".detail-image");


      const rect =
        image
          ? image.getBoundingClientRect()
          : null;


      const id =
        Number(
          button.dataset.detailAdd
        );


      const selectedOptions = {};


      $("#product-detail")
        .querySelectorAll(
          "[data-option-name]"
        )
        .forEach(select => {

          selectedOptions[
            select.dataset.optionName
          ] = select.value;

        });


      detailDialog.close();


      addToCart(
        id,
        null,
        rect,
        selectedOptions
      );

    }
  );


  // ==========================================================
  // CAMBIAR OPCIONES Y ACTUALIZAR PRECIO
  // ==========================================================

  $("#product-detail").addEventListener(
    "change",
    event => {

      const select =
        event.target.closest(
          "[data-option-name]"
        );


      if (!select) return;


      const priceElement =
        $(".detail-price");


      if (!priceElement) return;


      const id =
        Number(
          priceElement.dataset.detailPrice
        );


      const product =
        productsById.get(id);


      if (!product) return;


      const selectedOptions = {};


      $("#product-detail")
        .querySelectorAll(
          "[data-option-name]"
        )
        .forEach(control => {

          selectedOptions[
            control.dataset.optionName
          ] = control.value;

        });


      updateVariantPreview(product,selectedOptions);

      priceElement.innerHTML =
        `${money(
          getProductPrice(
            product,
            selectedOptions
          )
        )} <small>HNL</small>`;
    }
  );


  // ==========================================================
  // CONTROLES DEL CARRITO
  // ==========================================================

  $("#cart-items").addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-action]"
        );


      if (!button) return;


      const index =
        Number(button.dataset.index);


      const item =
        cart[index];


      if (!item) return;


      const product =
        productsById.get(item.id);


      if (!product) return;


      // ------------------------------------------------------
      // ELIMINAR
      // ------------------------------------------------------

      if (
        button.dataset.action ===
        "remove"
      ) {

        const removed = {
          ...item,
          options: {
            ...(item.options || {})
          }
        };


        cart.splice(
          index,
          1
        );


        saveCart();

        renderCart();


        $("#cart-feedback").textContent =
          product.name +
          " eliminado del carrito.";


        const oldUndo =
          $("#cart-undo");


        if (oldUndo) {
          oldUndo.remove();
        }


        const undo =
          document.createElement(
            "button"
          );


        undo.type = "button";

        undo.className =
          "text-button";

        undo.id =
          "cart-undo";

        undo.textContent =
          "Deshacer eliminación";


        $(".cart-summary")
          .prepend(undo);


        undo.addEventListener(
          "click",
          () => {

            cart.splice(
              index,
              0,
              removed
            );


            saveCart();

            renderCart();

            undo.remove();

            $("#close-cart-btn")
              .focus();


            $("#cart-feedback")
              .textContent =
              "Producto recuperado.";

          }
        );

        return;
      }


      // ------------------------------------------------------
      // SUMAR / RESTAR
      // ------------------------------------------------------

      if (
        button.dataset.action ===
        "plus"
      ) {

        item.quantity =
          Math.min(
            99,
            item.quantity + 1
          );

      } else {

        item.quantity =
          Math.max(
            1,
            item.quantity - 1
          );

      }


      saveCart();

      renderCart();


      $("#cart-feedback").textContent =
        `${product.name}: ${
          item.quantity
        } unidades. Total ${
          money(total())
        }.`;

    }
  );


  // ==========================================================
  // BUSCADOR
  // ==========================================================

  $("#product-search").addEventListener(
    "input",
    () => {

      clearTimeout(
        searchTimer
      );


      searchTimer =
        setTimeout(
          renderProducts,
          120
        );

    }
  );


  // ==========================================================
  // ORDENAR PRODUCTOS
  // ==========================================================

  $("#product-sort").addEventListener(
    "change",
    renderProducts
  );


  // ==========================================================
  // FILTROS POR CATEGORÍA
  // ==========================================================

  document
    .querySelectorAll(
      ".filter-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          category =
            button.dataset.category;

          renderProducts();

        }
      );

    });


  // ==========================================================
  // ATAJOS DE CATEGORÍAS
  // ==========================================================

  document
    .querySelectorAll(
      "[data-category-shortcut]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          resetFilters();

          category =
            button.dataset.categoryShortcut;

          renderProducts();

          $("#catalogo")
            .scrollIntoView();


          const filter =
            $(
              `.filter-btn[data-category="${category}"]`
            );


          if (filter) {

            filter.focus({
              preventScroll: true
            });

          }

        }
      );

    });


  // ==========================================================
  // FAVORITOS
  // ==========================================================

  $("#favorites-toggle")
    .addEventListener(
      "click",
      () => {

        favoritesOnly =
          !favoritesOnly;

        renderProducts();

        $("#catalogo")
          .scrollIntoView();

      }
    );


  // ==========================================================
  // REINICIAR FILTROS
  // ==========================================================

  $("#reset-filters")
    .addEventListener(
      "click",
      () => {

        resetFilters();

        $("#product-search")
          .focus();

      }
    );


  $("#empty-reset")
    .addEventListener(
      "click",
      () => {

        resetFilters();

        $("#product-search")
          .focus();

      }
    );


  // ==========================================================
  // ABRIR / CERRAR CARRITO
  // ==========================================================

  $("#open-cart-btn")
    .addEventListener(
      "click",
      openCart
    );


  $("#close-cart-btn")
    .addEventListener(
      "click",
      () => cartDialog.close()
    );


  $("#continue-shopping")
    .addEventListener(
      "click",
      () => cartDialog.close()
    );


  // ==========================================================
  // CERRAR DETALLE
  // ==========================================================

  $("#close-detail")
    .addEventListener(
      "click",
      () => detailDialog.close()
    );


  // ==========================================================
  // CERRAR MODALES AL HACER CLIC AFUERA
  // ==========================================================

  [cartDialog, detailDialog]
    .forEach(dialog => {

      dialog.addEventListener(
        "close",
        () => {

          if (
            !cartDialog.open &&
            !detailDialog.open
          ) {

            document.body.classList.remove(
              "dialog-open"
            );

          }

        }
      );


      let outside = false;


      dialog.addEventListener(
        "pointerdown",
        event => {

          const rect =
            dialog.getBoundingClientRect();


          outside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

        }
      );


      dialog.addEventListener(
        "click",
        event => {

          const rect =
            dialog.getBoundingClientRect();


          if (
            outside &&
            (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
          ) {

            dialog.close();

          }


          outside = false;

        }
      );

    });


  // ==========================================================
  // TOAST
  // ==========================================================

  $('#toast-action').addEventListener('click', function () {
  if (typeof toastAction === 'function') {
    toastAction();
  } else {
    openCart();
  }

  hideToast();
});

  $("#toast-close")
    .addEventListener(
      "click",
      () => hideToast(true)
    );


  // ==========================================================
  // LISTA / CHECKOUT
  // ==========================================================

  $("#checkout-btn")
    .addEventListener(
      "click",
      () => {

        if (!cart.length) return;


        const lines = [
          "RUMBO · MI LISTA DE VIAJE",

          "",
          ...cart.map(item => {

            const product =
              productsById.get(
                item.id
              );


            const price =
              getProductPrice(
                product,
                item.options
              );


            const optionsText =
              item.options &&
              Object.keys(
                item.options
              ).length

                ? ` — ${
                    optionSummary(
                      item.options
                    )
                  }`

                : "";


            return (
              `${item.quantity} × ` +
              `${product.name}` +
              `${optionsText}` +
              ` — ${money(price)}` +
              ` por unidad — ` +
              `${money(
                price *
                item.quantity
              )}`
            );

          }),
          "",
          `Subtotal de productos: ${money(total())} HNL`,
          "Envío e impuestos adicionales: no calculados.",
          "Revisa tu selección en Mi viaje."
        ];


        const url =
          URL.createObjectURL(
            new Blob(
              [
                "\uFEFF" +
                lines.join("\r\n")
              ],
              {
                type:
                  "text/plain;charset=utf-8"
              }
            )
          );


        const link =
          document.createElement(
            "a"
          );


        link.href = url;

        link.download =
          "mi-lista-rumbo.txt";


        document.body.appendChild(
          link
        );


        link.click();

        link.remove();


        setTimeout(
          () =>
            URL.revokeObjectURL(
              url
            ),
          10000
        );


        $("#cart-feedback")
          .textContent =
          "Lista preparada. Revisa las descargas de tu navegador. El carrito se ha conservado.";


        $("#checkout-btn")
          .textContent =
          "✓ Lista descargada";


        setTimeout(
          () => {

            $("#checkout-btn")
              .innerHTML =
              'Descargar mi lista <span aria-hidden="true">↓</span>';

          },
          2000
        );

      }
    );


  // ==========================================================
  // SINCRONIZACIÓN DEL CARRITO
  // ==========================================================

  window.addEventListener(
    "storage",
    event => {

      if (
        [
          CART_KEY,
          FAVORITES_KEY,
          null
        ].includes(event.key)
      ) {

        loadState();

        renderProducts();

        renderCart();

      }

    }
  );


  // ==========================================================
  // ERROR EN IMÁGENES
  // ==========================================================

  document.addEventListener(
    "error",
    event => {

      const image =
        event.target;


      if (
        image instanceof
          HTMLImageElement &&
        !image.dataset.failed
      ) {

        image.dataset.failed =
          "true";

        image.alt =
          "Fotografía no disponible";

        image.style.objectFit =
          "contain";

      }

    },
    true
  );


  // ==========================================================
  // CRÉDITOS DE FOTOGRAFÍAS
  // ==========================================================

  // ==========================================================
  // AÑO
  // ==========================================================

  if ($("#year")) {
    $("#year").textContent =
      new Date().getFullYear();
  }


  // ==========================================================
  // INICIAR TIENDA
  // ==========================================================

  loadState();

  renderProducts();

  renderCart();
  const previewId=Number(new URLSearchParams(location.search).get('producto'));
  if(productsById.has(previewId))showDetail(previewId);

})();
