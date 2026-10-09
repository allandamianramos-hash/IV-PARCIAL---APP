// Catálogo revisado. Snapshot compartido: config/store-catalog.json.
const CATALOG_REVISION = "2026-10-catalogo-unico";
const RETIRED_PRODUCT_IDS = {"35":23,"36":25,"39":1,"40":4,"41":19,"42":20,"43":5,"45":7,"46":8,"47":9,"48":10,"49":11,"51":12,"57":7,"59":13,"61":15,"62":16,"66":14,"69":18,"71":14,"73":21,"76":6,"77":23,"81":5,"82":34,"83":24,"85":20,"87":27,"92":26,"93":25,"95":29,"97":28};
const PRODUCTS = [
  {
    "id": 1,
    "name": "Mochila de viaje",
    "category": "Equipaje",
    "price": 450,
    "image": "imagenes/productos/recorte-1.png",
    "imageAlt": "Mochila de viaje",
    "imageKind": "generated",
    "description": "Mochila práctica para llevar tus cosas durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 2,
    "name": "Maleta de viaje",
    "category": "Equipaje",
    "price": 650,
    "image": "imagenes/productos/recorte-2.png",
    "imageAlt": "Maleta de viaje",
    "imageKind": "generated",
    "description": "Maleta para organizar y transportar tu equipaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Verde",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 3,
    "name": "Bolso de mano",
    "category": "Equipaje",
    "price": 250,
    "image": "imagenes/productos/revisado-3.png",
    "imageAlt": "Bolso de mano",
    "imageKind": "generated",
    "description": "Bolso de fin de semana con asas y correa ajustable.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 4,
    "name": "Riñonera",
    "category": "Equipaje",
    "price": 120,
    "image": "imagenes/productos/recorte-4.png",
    "imageAlt": "Riñonera",
    "imageKind": "generated",
    "description": "Riñonera compacta para llevar objetos pequeños.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Verde",
      "sizeKey": null
    }
  },
  {
    "id": 5,
    "name": "Etiquetas para equipaje",
    "category": "Equipaje",
    "price": 50,
    "image": "imagenes/productos/recorte-5.png",
    "imageAlt": "Etiquetas para equipaje",
    "imageKind": "generated",
    "description": "Tres etiquetas para identificar tu equipaje."
  },
  {
    "id": 6,
    "name": "Candado de combinación",
    "category": "Equipaje",
    "price": 80,
    "image": "imagenes/productos/recorte-6.png",
    "imageAlt": "Candado de combinación",
    "imageKind": "generated",
    "description": "Candado compacto para asegurar tu equipaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Negro",
      "sizeKey": null
    }
  },
  {
    "id": 7,
    "name": "Batería portátil",
    "category": "Tecnología",
    "price": 350,
    "image": "imagenes/productos/revisado-7.png",
    "imageAlt": "Batería portátil",
    "imageKind": "generated",
    "description": "Carga de respaldo para tus dispositivos durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 8,
    "name": "Cargador de pared USB-C",
    "category": "Tecnología",
    "price": 150,
    "image": "imagenes/productos/revisado-8.png",
    "imageAlt": "Cargador de pared USB-C",
    "imageKind": "generated",
    "description": "Cargador compacto con enchufe plegable.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 9,
    "name": "Cable USB-C",
    "category": "Tecnología",
    "price": 70,
    "image": "imagenes/productos/recorte-9.png",
    "imageAlt": "Cable USB-C",
    "imageKind": "generated",
    "description": "Cable USB para cargar y conectar dispositivos.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Negro",
      "sizeKey": "Largo"
    }
  },
  {
    "id": 10,
    "name": "Adaptador universal",
    "category": "Tecnología",
    "price": 220,
    "image": "imagenes/productos/recorte-10.png",
    "imageAlt": "Adaptador universal",
    "imageKind": "generated",
    "description": "Adaptador para conectar dispositivos en diferentes lugares."
  },
  {
    "id": 11,
    "name": "Audífonos Bluetooth",
    "category": "Tecnología",
    "price": 180,
    "image": "imagenes/productos/revisado-11.png",
    "imageAlt": "Audífonos Bluetooth",
    "imageKind": "generated",
    "description": "Audífonos inalámbricos con estuche de carga.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 12,
    "name": "Soporte plegable para celular",
    "category": "Tecnología",
    "price": 100,
    "image": "imagenes/productos/revisado-12.png",
    "imageAlt": "Soporte plegable para celular",
    "imageKind": "generated",
    "description": "Base ajustable para apoyar el celular en una mesa.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 13,
    "name": "Almohada cervical de espuma",
    "category": "Confort",
    "price": 180,
    "image": "imagenes/productos/revisado-13.png",
    "imageAlt": "Almohada cervical de espuma",
    "imageKind": "generated",
    "description": "Almohada de espuma con funda suave para el trayecto.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 14,
    "name": "Botella plegable",
    "category": "Confort",
    "price": 120,
    "image": "imagenes/productos/revisado-14.png",
    "imageAlt": "Botella plegable",
    "imageKind": "generated",
    "description": "Botella de silicona que ocupa menos espacio al guardarla.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 15,
    "name": "Antifaz para dormir",
    "category": "Confort",
    "price": 60,
    "image": "imagenes/productos/recorte-15.png",
    "imageAlt": "Antifaz para dormir",
    "imageKind": "generated",
    "description": "Antifaz para descansar con mayor comodidad.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Negro",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 16,
    "name": "Tapones para oídos",
    "category": "Confort",
    "price": 45,
    "image": "imagenes/productos/revisado-16.png",
    "imageAlt": "Tapones para oídos",
    "imageKind": "generated",
    "description": "Un par reutilizable con estuche para llevarlos protegidos.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 17,
    "name": "Paraguas compacto",
    "category": "Confort",
    "price": 150,
    "image": "imagenes/productos/revisado-17.png",
    "imageAlt": "Paraguas compacto",
    "imageKind": "generated",
    "description": "Paraguas plegable con funda para llevar en el bolso.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 18,
    "name": "Toalla de microfibra",
    "category": "Confort",
    "price": 130,
    "image": "imagenes/productos/recorte-18.png",
    "imageAlt": "Toalla de microfibra",
    "imageKind": "generated",
    "description": "Toalla práctica y fácil de transportar.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Turquesa",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 19,
    "name": "Funda para pasaporte",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/productos/recorte-19.png",
    "imageAlt": "Funda para pasaporte",
    "imageKind": "generated",
    "description": "Funda para mantener protegido tu pasaporte.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Café",
      "sizeKey": null
    }
  },
  {
    "id": 20,
    "name": "Organizador de documentos",
    "category": "Seguridad",
    "price": 120,
    "image": "imagenes/productos/recorte-20.png",
    "imageAlt": "Organizador de documentos",
    "imageKind": "generated",
    "description": "Organizador para documentos importantes.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 21,
    "name": "Billetera de viaje",
    "category": "Seguridad",
    "price": 110,
    "image": "imagenes/productos/revisado-21.png",
    "imageAlt": "Billetera de viaje",
    "imageKind": "generated",
    "description": "Billetera para billetes y tarjetas de uso diario.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Café",
      "sizeKey": null
    }
  },
  {
    "id": 22,
    "name": "Bolsa estanca",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/productos/recorte-22.png",
    "imageAlt": "Bolsa estanca",
    "imageKind": "generated",
    "description": "Bolsa para proteger objetos de la humedad.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 23,
    "name": "Correa para maleta",
    "category": "Seguridad",
    "price": 90,
    "image": "imagenes/productos/recorte-23.png",
    "imageAlt": "Correa para maleta",
    "imageKind": "generated",
    "description": "Correa para sujetar y reconocer tu maleta.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Turquesa",
      "sizeKey": null
    }
  },
  {
    "id": 24,
    "name": "Linterna de mano",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/productos/revisado-24.png",
    "imageAlt": "Linterna de mano",
    "imageKind": "generated",
    "description": "Luz compacta para llevar entre tus esenciales.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 25,
    "name": "Neceser de viaje",
    "category": "Cuidado",
    "price": 130,
    "image": "imagenes/productos/recorte-25.png",
    "imageAlt": "Neceser de viaje",
    "imageKind": "generated",
    "description": "Neceser para organizar artículos personales.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Beige",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 26,
    "name": "Botellas rellenables",
    "category": "Cuidado",
    "price": 80,
    "image": "imagenes/productos/recorte-26.png",
    "imageAlt": "Botellas rellenables",
    "imageKind": "generated",
    "description": "Tres botellas rellenables con bolsa transparente.",
    "preview": {
      "mode": "cutout",
      "baseColor": null,
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 27,
    "name": "Cepillo dental plegable",
    "category": "Cuidado",
    "price": 55,
    "image": "imagenes/productos/revisado-27.png",
    "imageAlt": "Cepillo dental plegable",
    "imageKind": "generated",
    "description": "Cepillo que se guarda dentro de su propio mango.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 28,
    "name": "Kit de higiene personal",
    "category": "Cuidado",
    "price": 150,
    "image": "imagenes/productos/revisado-28.png",
    "imageAlt": "Kit de higiene personal nuevo con estuche azul y cuatro accesorios",
    "imageKind": "generated",
    "description": "Estuche con cepillo plegable, pasta dental, desodorante y jabonera.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 29,
    "name": "Protector solar",
    "category": "Cuidado",
    "price": 180,
    "image": "imagenes/productos/revisado-29.png",
    "imageAlt": "Protector solar",
    "imageKind": "generated",
    "description": "Protector solar en un envase fácil de llevar.",
    "preview": {
      "mode": "cutout",
      "baseColor": null,
      "sizeKey": "Presentación"
    }
  },
  {
    "id": 30,
    "name": "Botiquín de viaje",
    "category": "Cuidado",
    "price": 200,
    "image": "imagenes/productos/revisado-30.png",
    "imageAlt": "Botiquín de viaje",
    "imageKind": "generated",
    "description": "Estuche con compartimentos para primeros auxilios.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Rojo",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 31,
    "name": "Organizador para camisas",
    "category": "Equipaje",
    "price": 90,
    "image": "imagenes/productos/recorte-31.png",
    "imageAlt": "Organizador para camisas",
    "imageKind": "generated",
    "description": "Organizador plano para llevar las camisas dobladas.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Gris",
      "sizeKey": null
    }
  },
  {
    "id": 32,
    "name": "Bolsa para zapatos",
    "category": "Equipaje",
    "price": 70,
    "image": "imagenes/productos/recorte-32.png",
    "imageAlt": "Bolsa para zapatos",
    "imageKind": "generated",
    "description": "Bolsa para guardar los zapatos separados del resto del equipaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 33,
    "name": "Cubos organizadores de ropa",
    "category": "Equipaje",
    "price": 120,
    "image": "imagenes/productos/recorte-33.png",
    "imageAlt": "Cubos organizadores de ropa",
    "imageKind": "generated",
    "description": "Tres cubos de distintos tamaños para organizar la ropa.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Turquesa",
      "sizeKey": null
    }
  },
  {
    "id": 34,
    "name": "Funda textil para maleta",
    "category": "Equipaje",
    "price": 160,
    "image": "imagenes/productos/recorte-34.png",
    "imageAlt": "Funda textil para maleta",
    "imageKind": "generated",
    "description": "Funda para proteger la maleta durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 35,
    "name": "Báscula para equipaje",
    "category": "Equipaje",
    "price": 85,
    "image": "imagenes/productos/revisado-35.png",
    "imageAlt": "Báscula para equipaje",
    "imageKind": "generated",
    "description": "Pesa tu maleta antes de salir de casa.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 36,
    "name": "Joyero de viaje",
    "category": "Equipaje",
    "price": 140,
    "image": "imagenes/productos/revisado-36.png",
    "imageAlt": "Joyero de viaje",
    "imageKind": "generated",
    "description": "Compartimentos suaves para llevar anillos y accesorios.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Rosa",
      "sizeKey": null
    }
  },
  {
    "id": 37,
    "name": "Bolsa para ropa sucia",
    "category": "Equipaje",
    "price": 75,
    "image": "imagenes/productos/recorte-37.png",
    "imageAlt": "Bolsa para ropa sucia",
    "imageKind": "generated",
    "description": "Bolsa para separar la ropa usada durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Gris",
      "sizeKey": null
    }
  },
  {
    "id": 38,
    "name": "Bolsa plegable de viaje",
    "category": "Equipaje",
    "price": 150,
    "image": "imagenes/productos/recorte-38.png",
    "imageAlt": "Bolsa plegable de viaje",
    "imageKind": "generated",
    "description": "Bolsa ligera que puede doblarse y guardarse fácilmente.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Borgoña",
      "sizeKey": null
    }
  },
  {
    "id": 39,
    "name": "Funda para portátil",
    "category": "Equipaje",
    "price": 280,
    "image": "imagenes/productos/revisado-39.png",
    "imageAlt": "Funda para portátil",
    "imageKind": "generated",
    "description": "Funda acolchada para proteger el portátil en el equipaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 40,
    "name": "Portatrajes plegable",
    "category": "Equipaje",
    "price": 110,
    "image": "imagenes/productos/revisado-40.png",
    "imageAlt": "Portatrajes plegable",
    "imageKind": "generated",
    "description": "Protege camisas y prendas durante el traslado.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 41,
    "name": "Bolsas de compresión al vacío",
    "category": "Equipaje",
    "price": 90,
    "image": "imagenes/productos/revisado-41.png",
    "imageAlt": "Bolsas de compresión al vacío",
    "imageKind": "generated",
    "description": "Bolsas para reducir el volumen de la ropa al empacar."
  },
  {
    "id": 42,
    "name": "Bolsa acolchada para cámara",
    "category": "Equipaje",
    "price": 140,
    "image": "imagenes/productos/revisado-42.png",
    "imageAlt": "Bolsa acolchada para cámara",
    "imageKind": "generated",
    "description": "Compartimentos acolchados para cámara y accesorios.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 43,
    "name": "Carrito plegable para equipaje",
    "category": "Equipaje",
    "price": 60,
    "image": "imagenes/productos/revisado-43.png",
    "imageAlt": "Carrito plegable para equipaje",
    "imageKind": "generated",
    "description": "Base con ruedas y asa extensible para transportar bultos.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 44,
    "name": "Organizador de cables",
    "category": "Equipaje",
    "price": 100,
    "image": "imagenes/productos/recorte-44.png",
    "imageAlt": "Organizador de cables",
    "imageKind": "generated",
    "description": "Bolsa pequeña para organizar accesorios.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Naranja",
      "sizeKey": null
    }
  },
  {
    "id": 45,
    "name": "Router portátil",
    "category": "Tecnología",
    "price": 220,
    "image": "imagenes/productos/revisado-45.png",
    "imageAlt": "Router portátil",
    "imageKind": "generated",
    "description": "Router compacto para llevar tu conexión de viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 46,
    "name": "Cargador para automóvil",
    "category": "Tecnología",
    "price": 150,
    "image": "imagenes/productos/revisado-46.png",
    "imageAlt": "Cargador para automóvil",
    "imageKind": "generated",
    "description": "Carga tus dispositivos desde la toma del automóvil.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 47,
    "name": "Funda impermeable para celular",
    "category": "Tecnología",
    "price": 75,
    "image": "imagenes/productos/revisado-47.png",
    "imageAlt": "Funda impermeable para celular",
    "imageKind": "generated",
    "description": "Funda transparente con cierre y cordón para el celular.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 48,
    "name": "Regleta compacta de viaje",
    "category": "Tecnología",
    "price": 250,
    "image": "imagenes/productos/revisado-48.png",
    "imageAlt": "Regleta compacta de viaje",
    "imageKind": "generated",
    "description": "Tomas y puertos en una regleta fácil de empacar."
  },
  {
    "id": 49,
    "name": "Audífonos de diadema",
    "category": "Tecnología",
    "price": 250,
    "image": "imagenes/productos/revisado-49.png",
    "imageAlt": "Audífonos de diadema",
    "imageKind": "generated",
    "description": "Audífonos plegables con almohadillas sobre la oreja.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 50,
    "name": "Audífonos con cable",
    "category": "Tecnología",
    "price": 100,
    "image": "imagenes/productos/recorte-50.png",
    "imageAlt": "Audífonos con cable",
    "imageKind": "generated",
    "description": "Audífonos económicos para escuchar música."
  },
  {
    "id": 51,
    "name": "Trípode para celular",
    "category": "Tecnología",
    "price": 90,
    "image": "imagenes/productos/revisado-51.png",
    "imageAlt": "Trípode para celular",
    "imageKind": "generated",
    "description": "Trípode compacto con pinza ajustable.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 52,
    "name": "Memoria USB",
    "category": "Tecnología",
    "price": 120,
    "image": "imagenes/productos/recorte-52.png",
    "imageAlt": "Memoria USB",
    "imageKind": "generated",
    "description": "Memoria pequeña para guardar archivos importantes.",
    "preview": {
      "mode": "cutout",
      "baseColor": null,
      "sizeKey": null
    }
  },
  {
    "id": 53,
    "name": "Lector de tarjetas",
    "category": "Tecnología",
    "price": 100,
    "image": "imagenes/productos/recorte-53.png",
    "imageAlt": "Lector de tarjetas",
    "imageKind": "generated",
    "description": "Lector compacto para transferir archivos."
  },
  {
    "id": 54,
    "name": "Hub USB",
    "category": "Tecnología",
    "price": 180,
    "image": "imagenes/productos/recorte-54.png",
    "imageAlt": "Hub USB",
    "imageKind": "generated",
    "description": "Dispositivo para conectar varios accesorios USB."
  },
  {
    "id": 55,
    "name": "Luz de lectura USB",
    "category": "Tecnología",
    "price": 80,
    "image": "imagenes/productos/recorte-55.png",
    "imageAlt": "Luz de lectura USB",
    "imageKind": "generated",
    "description": "Luz pequeña para leer durante el viaje."
  },
  {
    "id": 56,
    "name": "Reloj despertador de viaje",
    "category": "Tecnología",
    "price": 180,
    "image": "imagenes/productos/recorte-56.png",
    "imageAlt": "Reloj despertador de viaje",
    "imageKind": "generated",
    "description": "Reloj compacto para llevar durante los viajes."
  },
  {
    "id": 57,
    "name": "Panel solar plegable",
    "category": "Tecnología",
    "price": 280,
    "image": "imagenes/productos/revisado-57.png",
    "imageAlt": "Panel solar plegable",
    "imageKind": "generated",
    "description": "Panel compacto con salida USB para tus trayectos al aire libre."
  },
  {
    "id": 58,
    "name": "Cable multifunción",
    "category": "Tecnología",
    "price": 120,
    "image": "imagenes/productos/recorte-58.png",
    "imageAlt": "Cable multifunción",
    "imageKind": "generated",
    "description": "Cable con diferentes conexiones para viajes."
  },
  {
    "id": 59,
    "name": "Reposapiés de viaje",
    "category": "Confort",
    "price": 200,
    "image": "imagenes/productos/revisado-59.png",
    "imageAlt": "Reposapiés de viaje",
    "imageKind": "generated",
    "description": "Apoyo colgante y ajustable para descansar los pies.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 60,
    "name": "Almohada inflable",
    "category": "Confort",
    "price": 120,
    "image": "imagenes/productos/recorte-60.png",
    "imageAlt": "Almohada inflable",
    "imageKind": "generated",
    "description": "Almohada ligera que puede inflarse para viajar.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Gris",
      "sizeKey": null
    }
  },
  {
    "id": 61,
    "name": "Gafas de sol",
    "category": "Confort",
    "price": 60,
    "image": "imagenes/productos/revisado-61.png",
    "imageAlt": "Gafas de sol",
    "imageKind": "generated",
    "description": "Gafas ligeras con estuche para llevarlas protegidas.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 62,
    "name": "Sombrero plegable",
    "category": "Confort",
    "price": 50,
    "image": "imagenes/productos/revisado-62.png",
    "imageAlt": "Sombrero plegable",
    "imageKind": "generated",
    "description": "Sombrero ligero para tus paseos al aire libre.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Beige",
      "sizeKey": "Talla"
    }
  },
  {
    "id": 63,
    "name": "Manta de viaje",
    "category": "Confort",
    "price": 220,
    "image": "imagenes/productos/recorte-63.png",
    "imageAlt": "Manta de viaje",
    "imageKind": "generated",
    "description": "Manta cómoda para utilizar durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Turquesa",
      "sizeKey": "Tamaño"
    }
  },
  {
    "id": 64,
    "name": "Calcetines de viaje",
    "category": "Confort",
    "price": 70,
    "image": "imagenes/productos/recorte-64.png",
    "imageAlt": "Calcetines de viaje",
    "imageKind": "generated",
    "description": "Calcetines cómodos para viajar.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Gris",
      "sizeKey": "Talla"
    }
  },
  {
    "id": 65,
    "name": "Pantuflas de viaje",
    "category": "Confort",
    "price": 120,
    "image": "imagenes/productos/recorte-65.png",
    "imageAlt": "Pantuflas de viaje",
    "imageKind": "generated",
    "description": "Pantuflas ligeras para descansar.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Gris",
      "sizeKey": "Talla"
    }
  },
  {
    "id": 66,
    "name": "Cubiertos de viaje",
    "category": "Confort",
    "price": 130,
    "image": "imagenes/productos/revisado-66.png",
    "imageAlt": "Cubiertos de viaje",
    "imageKind": "generated",
    "description": "Cuchara, tenedor y cuchillo en un estuche compacto.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 67,
    "name": "Botella térmica",
    "category": "Confort",
    "price": 220,
    "image": "imagenes/productos/recorte-67.png",
    "imageAlt": "Botella térmica",
    "imageKind": "generated",
    "description": "Botella para mantener bebidas durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 68,
    "name": "Vaso térmico",
    "category": "Confort",
    "price": 180,
    "image": "imagenes/productos/recorte-68.png",
    "imageAlt": "Vaso térmico",
    "imageKind": "generated",
    "description": "Vaso reutilizable para bebidas.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Verde",
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 69,
    "name": "Poncho impermeable",
    "category": "Confort",
    "price": 140,
    "image": "imagenes/productos/revisado-69.png",
    "imageAlt": "Poncho impermeable",
    "imageKind": "generated",
    "description": "Poncho ligero con bolsa para guardarlo.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Talla"
    }
  },
  {
    "id": 70,
    "name": "Cojín de asiento",
    "category": "Confort",
    "price": 150,
    "image": "imagenes/productos/recorte-70.png",
    "imageAlt": "Cojín de asiento",
    "imageKind": "generated",
    "description": "Cojín para viajar con mayor comodidad.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Gris",
      "sizeKey": null
    }
  },
  {
    "id": 71,
    "name": "Recipiente plegable para comida",
    "category": "Confort",
    "price": 130,
    "image": "imagenes/productos/revisado-71.png",
    "imageAlt": "Recipiente plegable para comida",
    "imageKind": "generated",
    "description": "Recipiente de silicona que se pliega al terminar.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 72,
    "name": "Bolsa para snacks",
    "category": "Confort",
    "price": 70,
    "image": "imagenes/productos/recorte-72.png",
    "imageAlt": "Bolsa para snacks",
    "imageKind": "generated",
    "description": "Bolsa pequeña para llevar snacks durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": null,
      "sizeKey": "Capacidad"
    }
  },
  {
    "id": 73,
    "name": "Alarma personal",
    "category": "Seguridad",
    "price": 130,
    "image": "imagenes/productos/revisado-73.png",
    "imageAlt": "Alarma personal",
    "imageKind": "generated",
    "description": "Alarma compacta con anilla para llevar a mano.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 74,
    "name": "Tarjetero",
    "category": "Seguridad",
    "price": 70,
    "image": "imagenes/productos/recorte-74.png",
    "imageAlt": "Tarjetero",
    "imageKind": "generated",
    "description": "Tarjetero compacto para organizar tarjetas.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Negro",
      "sizeKey": null
    }
  },
  {
    "id": 75,
    "name": "Candado con llave",
    "category": "Seguridad",
    "price": 65,
    "image": "imagenes/productos/recorte-75.png",
    "imageAlt": "Candado con llave",
    "imageKind": "generated",
    "description": "Candado para asegurar el equipaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Dorado",
      "sizeKey": null
    }
  },
  {
    "id": 76,
    "name": "Cerradura portátil de puerta",
    "category": "Seguridad",
    "price": 85,
    "image": "imagenes/productos/revisado-76.png",
    "imageAlt": "Cerradura portátil de puerta",
    "imageKind": "generated",
    "description": "Accesorio desmontable para puertas compatibles.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 77,
    "name": "Cable retráctil de seguridad",
    "category": "Seguridad",
    "price": 80,
    "image": "imagenes/productos/revisado-77.png",
    "imageAlt": "Cable retráctil de seguridad",
    "imageKind": "generated",
    "description": "Cable compacto para sujetar objetos durante una parada.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 78,
    "name": "Funda impermeable A4",
    "category": "Seguridad",
    "price": 90,
    "image": "imagenes/productos/recorte-78.png",
    "imageAlt": "Funda impermeable A4",
    "imageKind": "generated",
    "description": "Funda con cierre para proteger papeles de tamaño A4."
  },
  {
    "id": 79,
    "name": "Portacredencial con cordón",
    "category": "Seguridad",
    "price": 75,
    "image": "imagenes/productos/recorte-79.png",
    "imageAlt": "Portacredencial con cordón",
    "imageKind": "generated",
    "description": "Portacredencial con ventana y cordón para llevarla a mano.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 80,
    "name": "Portadocumentos de cuello",
    "category": "Seguridad",
    "price": 100,
    "image": "imagenes/productos/recorte-80.png",
    "imageAlt": "Portadocumentos de cuello",
    "imageKind": "generated",
    "description": "Bolsa con cordón para llevar los documentos cerca.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Beige",
      "sizeKey": null
    }
  },
  {
    "id": 81,
    "name": "Localizador de equipaje",
    "category": "Seguridad",
    "price": 45,
    "image": "imagenes/productos/revisado-81.png",
    "imageAlt": "Localizador de equipaje",
    "imageKind": "generated",
    "description": "Localizador compacto con funda y anilla.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 82,
    "name": "Mosquetones con seguro",
    "category": "Seguridad",
    "price": 160,
    "image": "imagenes/productos/revisado-82.png",
    "imageAlt": "Mosquetones con seguro",
    "imageKind": "generated",
    "description": "Dos mosquetones para sujetar accesorios al equipaje. No aptos para escalada.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 83,
    "name": "Linterna frontal",
    "category": "Seguridad",
    "price": 75,
    "image": "imagenes/productos/revisado-83.png",
    "imageAlt": "Linterna frontal",
    "imageKind": "generated",
    "description": "Luz con cinta ajustable para tener las manos libres.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 84,
    "name": "Luz de seguridad",
    "category": "Seguridad",
    "price": 90,
    "image": "imagenes/productos/recorte-84.png",
    "imageAlt": "Luz de seguridad",
    "imageKind": "generated",
    "description": "Luz pequeña para mejorar la visibilidad."
  },
  {
    "id": 85,
    "name": "Fundas RFID para tarjetas",
    "category": "Seguridad",
    "price": 140,
    "image": "imagenes/productos/revisado-85.png",
    "imageAlt": "Fundas RFID para tarjetas",
    "imageKind": "generated",
    "description": "Fundas individuales para guardar tus tarjetas."
  },
  {
    "id": 86,
    "name": "Bolsa oculta de viaje",
    "category": "Seguridad",
    "price": 130,
    "image": "imagenes/productos/recorte-86.png",
    "imageAlt": "Bolsa oculta de viaje",
    "imageKind": "generated",
    "description": "Bolsa discreta para llevar objetos personales.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Beige",
      "sizeKey": null
    }
  },
  {
    "id": 87,
    "name": "Hilo dental",
    "category": "Cuidado",
    "price": 55,
    "image": "imagenes/productos/revisado-87.png",
    "imageAlt": "Hilo dental",
    "imageKind": "generated",
    "description": "Dispensador compacto para tu neceser."
  },
  {
    "id": 88,
    "name": "Estuche para cepillo dental",
    "category": "Cuidado",
    "price": 55,
    "image": "imagenes/productos/recorte-88.png",
    "imageAlt": "Estuche para cepillo dental",
    "imageKind": "generated",
    "description": "Estuche para proteger el cepillo dental.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 89,
    "name": "Peine de viaje",
    "category": "Cuidado",
    "price": 45,
    "image": "imagenes/productos/recorte-89.png",
    "imageAlt": "Peine de viaje",
    "imageKind": "generated",
    "description": "Peine compacto para llevar fácilmente.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Negro",
      "sizeKey": null
    }
  },
  {
    "id": 90,
    "name": "Cepillo para cabello",
    "category": "Cuidado",
    "price": 70,
    "image": "imagenes/productos/recorte-90.png",
    "imageAlt": "Cepillo para cabello",
    "imageKind": "generated",
    "description": "Cepillo compacto para el cabello."
  },
  {
    "id": 91,
    "name": "Espejo pequeño",
    "category": "Cuidado",
    "price": 50,
    "image": "imagenes/productos/recorte-91.png",
    "imageAlt": "Espejo pequeño",
    "imageKind": "generated",
    "description": "Espejo pequeño para llevar en el bolso."
  },
  {
    "id": 92,
    "name": "Frascos para crema",
    "category": "Cuidado",
    "price": 80,
    "image": "imagenes/productos/revisado-92.png",
    "imageAlt": "Frascos para crema",
    "imageKind": "generated",
    "description": "Tres recipientes rellenables con tapa de rosca."
  },
  {
    "id": 93,
    "name": "Pastillero semanal",
    "category": "Cuidado",
    "price": 150,
    "image": "imagenes/productos/revisado-93.png",
    "imageAlt": "Pastillero semanal",
    "imageKind": "generated",
    "description": "Siete compartimentos para organizar tus artículos personales.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 94,
    "name": "Toallitas húmedas",
    "category": "Cuidado",
    "price": 45,
    "image": "imagenes/productos/recorte-94.png",
    "imageAlt": "Toallitas húmedas",
    "imageKind": "generated",
    "description": "Toallitas prácticas para llevar durante el viaje."
  },
  {
    "id": 95,
    "name": "Repelente de insectos",
    "category": "Cuidado",
    "price": 130,
    "image": "imagenes/productos/revisado-95.png",
    "imageAlt": "Repelente de insectos",
    "imageKind": "generated",
    "description": "Envase compacto de repelente para tus actividades al aire libre.",
    "preview": {
      "mode": "cutout",
      "baseColor": null,
      "sizeKey": "Presentación"
    }
  },
  {
    "id": 96,
    "name": "Gel antibacterial",
    "category": "Cuidado",
    "price": 60,
    "image": "imagenes/productos/recorte-96.png",
    "imageAlt": "Gel antibacterial",
    "imageKind": "generated",
    "description": "Gel práctico para mantener las manos limpias durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": null,
      "sizeKey": "Presentación"
    }
  },
  {
    "id": 97,
    "name": "Kit de costura de viaje",
    "category": "Cuidado",
    "price": 160,
    "image": "imagenes/productos/revisado-97.png",
    "imageAlt": "Kit de costura de viaje",
    "imageKind": "generated",
    "description": "Hilos y accesorios para pequeños arreglos.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 98,
    "name": "Estuche para jabón",
    "category": "Cuidado",
    "price": 50,
    "image": "imagenes/productos/recorte-98.png",
    "imageAlt": "Estuche para jabón",
    "imageKind": "generated",
    "description": "Estuche para transportar jabón durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 99,
    "name": "Kit de higiene familiar",
    "category": "Cuidado",
    "price": 220,
    "image": "imagenes/productos/recorte-99.png",
    "imageAlt": "Kit de higiene familiar",
    "imageKind": "generated",
    "description": "Kit práctico para llevar artículos personales de la familia.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Azul",
      "sizeKey": null
    }
  },
  {
    "id": 100,
    "name": "Kit de cuidado infantil",
    "category": "Cuidado",
    "price": 180,
    "image": "imagenes/productos/recorte-100.png",
    "imageAlt": "Kit de cuidado infantil",
    "imageKind": "generated",
    "description": "Kit compacto para llevar artículos de cuidado infantil durante el viaje.",
    "preview": {
      "mode": "cutout",
      "baseColor": "Beige",
      "sizeKey": null
    }
  }
];
const PRODUCT_OPTIONS = {
  "1": {
    "Color": [
      "Azul",
      "Negro",
      "Rojo",
      "Gris"
    ],
    "Tamaño": [
      "Pequeña",
      "Mediana",
      "Grande"
    ]
  },
  "2": {
    "Color": [
      "Negro",
      "Azul",
      "Rojo",
      "Verde"
    ],
    "Tamaño": [
      "20 pulgadas",
      "24 pulgadas",
      "28 pulgadas"
    ]
  },
  "3": {
    "Color": [
      "Azul",
      "Negro",
      "Beige"
    ],
    "Tamaño": [
      "Compacto",
      "Mediano",
      "Grande"
    ]
  },
  "4": {
    "Color": [
      "Verde",
      "Negro",
      "Azul"
    ]
  },
  "5": {},
  "6": {
    "Color": [
      "Negro",
      "Azul",
      "Rojo"
    ]
  },
  "7": {
    "Color": [
      "Azul",
      "Negro",
      "Blanco"
    ],
    "Capacidad": [
      "10,000 mAh",
      "20,000 mAh"
    ]
  },
  "8": {
    "Color": [
      "Azul",
      "Negro",
      "Blanco"
    ]
  },
  "9": {
    "Color": [
      "Negro",
      "Azul"
    ],
    "Largo": [
      "1 metro",
      "2 metros"
    ]
  },
  "10": {},
  "11": {
    "Color": [
      "Azul",
      "Negro",
      "Blanco"
    ]
  },
  "12": {
    "Color": [
      "Azul",
      "Negro",
      "Gris"
    ]
  },
  "13": {
    "Color": [
      "Azul",
      "Gris",
      "Rosa"
    ],
    "Tamaño": [
      "Infantil",
      "Adulto"
    ]
  },
  "14": {
    "Color": [
      "Azul",
      "Verde",
      "Rosa"
    ],
    "Capacidad": [
      "500 ml",
      "750 ml"
    ]
  },
  "15": {
    "Color": [
      "Negro",
      "Azul",
      "Rosa"
    ],
    "Tamaño": [
      "Infantil",
      "Adulto"
    ]
  },
  "16": {
    "Color": [
      "Azul",
      "Rosa"
    ]
  },
  "17": {
    "Color": [
      "Azul",
      "Negro",
      "Rojo"
    ]
  },
  "18": {
    "Color": [
      "Turquesa",
      "Gris",
      "Azul"
    ],
    "Tamaño": [
      "Mediana",
      "Grande"
    ]
  },
  "19": {
    "Color": [
      "Café",
      "Negro",
      "Azul"
    ]
  },
  "20": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "21": {
    "Color": [
      "Café",
      "Negro",
      "Azul"
    ]
  },
  "22": {
    "Color": [
      "Azul",
      "Rojo",
      "Negro"
    ],
    "Capacidad": [
      "5 litros",
      "10 litros",
      "20 litros"
    ]
  },
  "23": {
    "Color": [
      "Turquesa",
      "Negro",
      "Rojo"
    ]
  },
  "24": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "25": {
    "Color": [
      "Beige",
      "Azul",
      "Rosa"
    ],
    "Tamaño": [
      "Compacto",
      "Grande"
    ]
  },
  "26": {
    "Capacidad": [
      "30 ml",
      "60 ml",
      "100 ml"
    ]
  },
  "27": {
    "Color": [
      "Azul",
      "Rosa"
    ]
  },
  "28": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "29": {
    "Presentación": [
      "50 ml",
      "100 ml"
    ]
  },
  "30": {
    "Tamaño": [
      "Compacto",
      "Familiar"
    ]
  },
  "31": {
    "Color": [
      "Gris",
      "Azul"
    ]
  },
  "32": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "33": {
    "Color": [
      "Turquesa",
      "Gris",
      "Azul"
    ]
  },
  "34": {
    "Color": [
      "Azul",
      "Negro",
      "Rojo"
    ],
    "Tamaño": [
      "20 pulgadas",
      "24 pulgadas",
      "28 pulgadas"
    ]
  },
  "35": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "36": {
    "Color": [
      "Rosa",
      "Beige",
      "Azul"
    ]
  },
  "37": {
    "Color": [
      "Gris",
      "Azul"
    ]
  },
  "38": {
    "Color": [
      "Borgoña",
      "Azul",
      "Negro"
    ]
  },
  "39": {
    "Color": [
      "Azul",
      "Gris",
      "Negro"
    ],
    "Tamaño": [
      "13 pulgadas",
      "15 pulgadas",
      "16 pulgadas"
    ]
  },
  "40": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "41": {},
  "42": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "43": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "44": {
    "Color": [
      "Naranja",
      "Azul",
      "Gris"
    ]
  },
  "45": {
    "Color": [
      "Azul",
      "Blanco"
    ]
  },
  "46": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "47": {
    "Color": [
      "Azul",
      "Negro",
      "Rosa"
    ]
  },
  "48": {},
  "49": {
    "Color": [
      "Azul",
      "Negro",
      "Beige"
    ]
  },
  "50": {},
  "51": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "52": {
    "Capacidad": [
      "32 GB",
      "64 GB",
      "128 GB"
    ]
  },
  "53": {},
  "54": {},
  "55": {},
  "56": {},
  "57": {},
  "58": {},
  "59": {
    "Color": [
      "Azul",
      "Gris"
    ]
  },
  "60": {
    "Color": [
      "Gris",
      "Azul"
    ]
  },
  "61": {
    "Color": [
      "Azul",
      "Negro",
      "Café"
    ]
  },
  "62": {
    "Color": [
      "Beige",
      "Azul",
      "Gris"
    ],
    "Talla": [
      "S/M",
      "L/XL"
    ]
  },
  "63": {
    "Color": [
      "Turquesa",
      "Gris",
      "Beige"
    ],
    "Tamaño": [
      "Individual",
      "Doble"
    ]
  },
  "64": {
    "Color": [
      "Gris",
      "Negro"
    ],
    "Talla": [
      "36–39",
      "40–43",
      "44–46"
    ]
  },
  "65": {
    "Color": [
      "Gris",
      "Azul"
    ],
    "Talla": [
      "36–39",
      "40–43",
      "44–46"
    ]
  },
  "66": {
    "Color": [
      "Azul",
      "Verde"
    ]
  },
  "67": {
    "Color": [
      "Azul",
      "Negro",
      "Verde"
    ],
    "Capacidad": [
      "500 ml",
      "750 ml",
      "1 litro"
    ]
  },
  "68": {
    "Color": [
      "Verde",
      "Azul",
      "Rosa"
    ],
    "Capacidad": [
      "350 ml",
      "500 ml"
    ]
  },
  "69": {
    "Color": [
      "Azul",
      "Verde"
    ],
    "Talla": [
      "Infantil",
      "Adulto"
    ]
  },
  "70": {
    "Color": [
      "Gris",
      "Azul"
    ]
  },
  "71": {
    "Color": [
      "Azul",
      "Verde"
    ],
    "Capacidad": [
      "500 ml",
      "1 litro"
    ]
  },
  "72": {
    "Capacidad": [
      "500 ml",
      "1 litro"
    ]
  },
  "73": {
    "Color": [
      "Azul",
      "Rosa"
    ]
  },
  "74": {
    "Color": [
      "Negro",
      "Café",
      "Azul"
    ]
  },
  "75": {
    "Color": [
      "Dorado",
      "Plateado"
    ]
  },
  "76": {
    "Color": [
      "Azul",
      "Rojo"
    ]
  },
  "77": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "78": {},
  "79": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "80": {
    "Color": [
      "Beige",
      "Azul",
      "Negro"
    ]
  },
  "81": {
    "Color": [
      "Azul",
      "Negro",
      "Rosa"
    ]
  },
  "82": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "83": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "84": {},
  "85": {},
  "86": {
    "Color": [
      "Beige",
      "Negro"
    ]
  },
  "87": {},
  "88": {
    "Color": [
      "Azul",
      "Rosa"
    ]
  },
  "89": {
    "Color": [
      "Negro",
      "Azul"
    ]
  },
  "90": {},
  "91": {},
  "92": {},
  "93": {
    "Color": [
      "Azul",
      "Rosa"
    ]
  },
  "94": {},
  "95": {
    "Presentación": [
      "60 ml",
      "100 ml"
    ]
  },
  "96": {
    "Presentación": [
      "50 ml",
      "100 ml"
    ]
  },
  "97": {
    "Color": [
      "Azul",
      "Beige"
    ]
  },
  "98": {
    "Color": [
      "Azul",
      "Rosa"
    ]
  },
  "99": {
    "Color": [
      "Azul",
      "Negro"
    ]
  },
  "100": {
    "Color": [
      "Beige",
      "Azul",
      "Rosa"
    ]
  }
};
const OPTION_PRICE_ADJUSTMENTS = {
  "1": {
    "Tamaño": {
      "Mediana": 0,
      "Grande": 100
    }
  },
  "2": {
    "Tamaño": {
      "20 pulgadas": 0,
      "24 pulgadas": 150,
      "28 pulgadas": 300
    }
  },
  "3": {
    "Tamaño": {
      "Mediano": 50
    }
  },
  "7": {
    "Capacidad": {
      "10,000 mAh": 0,
      "20,000 mAh": 150
    }
  },
  "9": {
    "Largo": {
      "1 metro": 0,
      "2 metros": 20
    }
  },
  "14": {
    "Capacidad": {
      "500 ml": 0,
      "750 ml": 30
    }
  },
  "18": {
    "Tamaño": {
      "Mediana": 0,
      "Grande": 30
    }
  },
  "26": {
    "Capacidad": {
      "30 ml": 0,
      "60 ml": 20
    }
  },
  "29": {
    "Presentación": {
      "100 ml": 0
    }
  },
  "30": {
    "Tamaño": {
      "Compacto": 0
    }
  }
};

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

// Every selection retains the same source photograph and product geometry.
const VARIANT_SIZES = {'20 pulgadas':.72,'24 pulgadas':.86,'28 pulgadas':1};
const variantEscape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cleanProductOptions(product, options = {}) {
  return Object.fromEntries(Object.entries(PRODUCT_OPTIONS[product.id]||{}).map(([key,values])=>[key,values.includes(options[key])?options[key]:values[0]]));
}
function variantModel(product, options = {}) {
  if(!product.preview)return null;
  const selected=cleanProductOptions(product,options),key=product.preview.sizeKey;
  const sizes=PRODUCT_OPTIONS[product.id]?.[key]||[],size=selected[key]||'';
  const scale=product.id===2?VARIANT_SIZES[size]:sizes.length>1?.84+.16*sizes.indexOf(size)/(sizes.length-1):1;
  return {color:selected.Color||product.preview.baseColor||'',size,scale,options:selected,
    summary:Object.values(selected).join(' · '),image:product.image};
}
function variantMarkup(product, options = {}, className = 'detail-image') {
  const v=variantModel(product,options);if(!v)return '';
  return `<div class="${variantEscape(className)} variant-image" data-variant-product="${product.id}" data-variant-options="${variantEscape(JSON.stringify(v.options))}" role="img" aria-label="${variantEscape(product.name+', '+v.summary)}"><img class="variant-fallback" src="${variantEscape(product.image)}" alt="" decoding="async"></div>`;
}
window.RumboVariantPreview={model:variantModel,markup:variantMarkup,cleanOptions:cleanProductOptions};

if (window.RumboDatabase?.connected) {
  const catalog = window.RumboDatabase.catalog;
  // Old database seeds must not restore duplicate photos, names or obsolete variants.
  const prices=new Map(catalog.products.map(product=>[product.id,product.price]));
  for(const product of PRODUCTS){const price=prices.get(product.id);if(Number.isFinite(price)&&price>0)product.price=price;}
}
window.RumboProducts = PRODUCTS;
window.RumboProductPrice = (product, options = {}) => product.price + Object.entries(cleanProductOptions(product,options)).reduce((sum, [key,value]) => sum + (Number(OPTION_PRICE_ADJUSTMENTS[product.id]?.[key]?.[value]) || 0), 0);

// ============================================================
// FUNCIONES PRINCIPALES
// ============================================================

(() => {

  "use strict";

  if (!document.querySelector("#products-grid")) return;

  const $ = selector => document.querySelector(selector);

  const money = value =>
    "L " +
    new Intl.NumberFormat("en-US", {
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
      .map(item => {
        const id=item.catalogRevision===CATALOG_REVISION?item.id:(RETIRED_PRODUCT_IDS[item.id]||item.id);
        return {id,quantity:Math.min(99,item.quantity),options:cleanProductOptions(productsById.get(id),item.options||{}),catalogRevision:CATALOG_REVISION};
      });
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
                    src="${product.image}?v=catalogo-unico-4"
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
                    aria-label="${Object.keys(PRODUCT_OPTIONS[product.id]||{}).length?'Elegir opciones de':'Agregar al carrito:'} ${escapeHTML(product.name)}"
                  >
                    ${Object.keys(PRODUCT_OPTIONS[product.id]||{}).length?'Elegir opciones':'<span aria-hidden="true">+</span> Agregar'}
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
        options: cleanOptions,
        catalogRevision: CATALOG_REVISION
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
    if (document.querySelector("#store-checkout[open]")) renderStoreCheckout();

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
    const stage=visual.querySelector('.variant-stage');
    if(!stage.querySelector('[data-variant-product]'))stage.innerHTML=variantMarkup(product,options);
    window.RumboVariantRenderer?.update(stage.querySelector('[data-variant-product]'),product,options);
    const v=variantModel(product,options);
    visual.querySelector('.variant-caption').textContent=v.summary;
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
              Elige tu variante
            </h3>

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
          ${variantModel(product,defaultOptions)?`<p class="variant-caption" role="status">${escapeHTML(variantModel(product,defaultOptions).summary)}</p><button type="button" class="variant-original" aria-pressed="false">Ver fotografía original</button>`:''}
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
    window.RumboVariantRenderer?.mount($('#product-detail'));
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
            !detailDialog.open &&
            !document.querySelector("#store-checkout[open]")
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

  const checkoutDialog = $('#store-checkout');
  function renderStoreCheckout() {
    $('#checkout-items').innerHTML = cart.map(item => {
      const product = productsById.get(item.id);
      const options = optionSummary(item.options || {});
      return '<article class="checkout-item"><div><h3>' + escapeHTML(product.name) + '</h3><p>' + item.quantity + ' × ' + money(getProductPrice(product, item.options)) + '</p>' + (options ? '<p>' + escapeHTML(options) + '</p>' : '') + '</div><strong>' + money(getProductPrice(product, item.options) * item.quantity) + '</strong></article>';
    }).join('') || '<p>Tu carrito está vacío.</p>';
    $('#checkout-total').textContent = money(total());
  }
  $('#checkout-btn').addEventListener('click', () => {
    if (!cart.length) return;
    $('#cart-modal').close();
    renderStoreCheckout();
    checkoutDialog.showModal();
    document.body.classList.add('dialog-open');
    $('#close-checkout').focus();
  });
  $('#close-checkout').addEventListener('click', () => checkoutDialog.close());
  $('#edit-checkout-cart').addEventListener('click', () => { checkoutDialog.close(); openCart(); });
  checkoutDialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    if (!document.querySelector('dialog[open]')) $('#open-cart-btn').focus({preventScroll:true});
  });
  checkoutDialog.addEventListener('click', event => {
    if (event.target !== checkoutDialog) return;
    const box = checkoutDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) checkoutDialog.close();
  });

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
