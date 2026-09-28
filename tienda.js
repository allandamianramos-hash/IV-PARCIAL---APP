// ============================================================
// LA TIENDA DEL VIAJERO | RUMBO
// JavaScript completo
// ============================================================

// CATÁLOGO DE 30 PRODUCTOS
const PRODUCTS = [
  {
    id: 1,
    name: "Mochila de viaje",
    category: "Equipaje",
    price: 450,
    image: "imagenes/mochila.jpg",
    description: "Mochila práctica para llevar tus cosas durante el viaje."
  },
  {
    id: 2,
    name: "Maleta de viaje",
    category: "Equipaje",
    price: 650,
    image: "imagenes/maleta.jpg",
    description: "Maleta para organizar y transportar tu equipaje."
  },
  {
    id: 3,
    name: "Bolso de mano",
    category: "Equipaje",
    price: 250,
    image: "imagenes/bolso-mano.jpg",
    description: "Bolso cómodo para llevar objetos personales."
  },
  {
    id: 4,
    name: "Riñonera",
    category: "Equipaje",
    price: 120,
    image: "imagenes/rinonera.jpg",
    description: "Riñonera compacta para llevar objetos pequeños."
  },
  {
    id: 5,
    name: "Etiqueta para maleta",
    category: "Equipaje",
    price: 50,
    image: "imagenes/etiqueta-maleta.jpg",
    description: "Etiqueta para identificar fácilmente tu equipaje."
  },
  {
    id: 6,
    name: "Candado para maleta",
    category: "Equipaje",
    price: 80,
    image: "imagenes/candado-maleta.jpg",
    description: "Candado compacto para asegurar tu equipaje."
  },
  {
    id: 7,
    name: "Power Bank",
    category: "Tecnología",
    price: 350,
    image: "imagenes/power-bank.jpg",
    description: "Batería portátil para mantener cargado tu celular."
  },
  {
    id: 8,
    name: "Cargador de celular",
    category: "Tecnología",
    price: 150,
    image: "imagenes/cargador.jpg",
    description: "Cargador práctico para usar durante tus viajes."
  },
  {
    id: 9,
    name: "Cable USB",
    category: "Tecnología",
    price: 70,
    image: "imagenes/cable-usb.jpg",
    description: "Cable USB para cargar y conectar dispositivos."
  },
  {
    id: 10,
    name: "Adaptador universal",
    category: "Tecnología",
    price: 220,
    image: "imagenes/adaptador.jpg",
    description: "Adaptador para conectar dispositivos en diferentes lugares."
  },
  {
    id: 11,
    name: "Audífonos",
    category: "Tecnología",
    price: 180,
    image: "imagenes/audifonos.jpg",
    description: "Audífonos para escuchar música durante el viaje."
  },
  {
    id: 12,
    name: "Soporte para celular",
    category: "Tecnología",
    price: 100,
    image: "imagenes/soporte-celular.jpg",
    description: "Soporte pequeño y práctico para tu celular."
  },
  {
    id: 13,
    name: "Almohada de viaje",
    category: "Confort",
    price: 180,
    image: "imagenes/almohada-viaje.jpg",
    description: "Almohada cómoda para descansar durante el viaje."
  },
  {
    id: 14,
    name: "Botella reutilizable",
    category: "Confort",
    price: 120,
    image: "imagenes/botella.jpg",
    description: "Botella reutilizable para llevar agua."
  },
  {
    id: 15,
    name: "Antifaz para dormir",
    category: "Confort",
    price: 60,
    image: "imagenes/antifaz.jpg",
    description: "Antifaz para descansar con mayor comodidad."
  },
  {
    id: 16,
    name: "Tapones para oídos",
    category: "Confort",
    price: 45,
    image: "imagenes/tapones-oidos.jpg",
    description: "Tapones pequeños para descansar durante el viaje."
  },
  {
    id: 17,
    name: "Paraguas compacto",
    category: "Confort",
    price: 150,
    image: "imagenes/paraguas.jpg",
    description: "Paraguas compacto para llevar fácilmente."
  },
  {
    id: 18,
    name: "Toalla de viaje",
    category: "Confort",
    price: 130,
    image: "imagenes/toalla-viaje.jpg",
    description: "Toalla práctica y fácil de transportar."
  },
  {
    id: 19,
    name: "Porta pasaporte",
    category: "Seguridad",
    price: 100,
    image: "imagenes/porta-pasaporte.jpg",
    description: "Funda para mantener protegido tu pasaporte."
  },
  {
    id: 20,
    name: "Porta documentos",
    category: "Seguridad",
    price: 120,
    image: "imagenes/porta-documentos.jpg",
    description: "Organizador para documentos importantes."
  },
  {
    id: 21,
    name: "Billetera de viaje",
    category: "Seguridad",
    price: 110,
    image: "imagenes/billetera.jpg",
    description: "Billetera práctica para guardar dinero y tarjetas."
  },
  {
    id: 22,
    name: "Bolsa impermeable",
    category: "Seguridad",
    price: 100,
    image: "imagenes/bolsa-impermeable.jpg",
    description: "Bolsa para proteger objetos de la humedad."
  },
  {
    id: 23,
    name: "Correa para maleta",
    category: "Seguridad",
    price: 90,
    image: "imagenes/correa-maleta.jpg",
    description: "Correa para sujetar y reconocer tu maleta."
  },
  {
    id: 24,
    name: "Linterna",
    category: "Seguridad",
    price: 100,
    image: "imagenes/linterna.jpg",
    description: "Linterna pequeña para llevar durante el viaje."
  },
  {
    id: 25,
    name: "Neceser de viaje",
    category: "Cuidado",
    price: 130,
    image: "imagenes/neceser.jpg",
    description: "Neceser para organizar artículos personales."
  },
  {
    id: 26,
    name: "Botellas para líquidos",
    category: "Cuidado",
    price: 80,
    image: "imagenes/botellas-liquidos.jpg",
    description: "Botellas pequeñas para llevar líquidos."
  },
  {
    id: 27,
    name: "Cepillo de dientes de viaje",
    category: "Cuidado",
    price: 55,
    image: "imagenes/cepillo-dientes.jpg",
    description: "Cepillo compacto para llevar en el equipaje."
  },
  {
    id: 28,
    name: "Kit de higiene",
    category: "Cuidado",
    price: 150,
    image: "imagenes/kit-higiene.jpg",
    description: "Kit práctico para artículos de higiene personal."
  },
  {
    id: 29,
    name: "Protector solar",
    category: "Cuidado",
    price: 180,
    image: "imagenes/protector-solar.jpg",
    description: "Protector solar para incluir en tu equipaje."
  },
  {
    id: 30,
    name: "Botiquín básico",
    category: "Cuidado",
    price: 200,
    image: "imagenes/botiquin.jpg",
    description: "Botiquín básico para llevar artículos de primeros auxilios."
  }
];


// ============================================================
// OPCIONES DE CADA PRODUCTO
// ============================================================

const PRODUCT_OPTIONS = {

  1: {
    Color: ["Negro", "Azul", "Rojo"],
    Tamaño: ["Mediana", "Grande"]
  },

  2: {
    Color: ["Negro", "Azul", "Rojo"],
    Tamaño: ["20 pulgadas", "24 pulgadas", "28 pulgadas"]
  },

  3: {
    Color: ["Negro", "Café", "Beige"],
    Tamaño: ["Pequeño", "Mediano"]
  },

  4: {
    Color: ["Negro", "Azul", "Verde"],
    Tamaño: ["Único"]
  },

  5: {
    Color: ["Negro", "Azul", "Rojo", "Verde"],
    Tamaño: ["Estándar"]
  },

  6: {
    Color: ["Negro", "Plateado", "Dorado"],
    Tipo: ["3 dígitos", "4 dígitos"]
  },

  7: {
    Color: ["Negro", "Blanco"],
    Capacidad: ["10,000 mAh", "20,000 mAh"]
  },

  8: {
    Color: ["Negro", "Blanco"],
    Tipo: ["USB-C", "USB-A"]
  },

  9: {
    Color: ["Negro", "Blanco"],
    Largo: ["1 metro", "2 metros"]
  },

  10: {
    Color: ["Negro", "Blanco"],
    Tipo: ["Universal"]
  },

  11: {
    Color: ["Negro", "Blanco"],
    Tipo: ["Inalámbricos", "Alámbricos"]
  },

  12: {
    Color: ["Negro", "Gris"],
    Uso: ["Escritorio", "Auto"]
  },

  13: {
    Color: ["Gris", "Azul", "Negro"],
    Tamaño: ["Estándar"]
  },

  14: {
    Color: ["Transparente", "Azul", "Negro"],
    Capacidad: ["500 ml", "750 ml"]
  },

  15: {
    Color: ["Negro", "Azul", "Rosa"],
    Tamaño: ["Único"]
  },

  16: {
    Color: ["Amarillo", "Azul"],
    Cantidad: ["2 pares", "4 pares"]
  },

  17: {
    Color: ["Negro", "Azul", "Rojo"],
    Tamaño: ["Compacto"]
  },

  18: {
    Color: ["Blanco", "Gris", "Azul"],
    Tamaño: ["Mediana", "Grande"]
  },

  19: {
    Color: ["Negro", "Café", "Azul"],
    Tamaño: ["Estándar"]
  },

  20: {
    Color: ["Negro", "Café", "Azul"],
    Tamaño: ["Estándar"]
  },

  21: {
    Color: ["Negro", "Café", "Azul"],
    Tamaño: ["Estándar"]
  },

  22: {
    Color: ["Negro", "Azul", "Transparente"],
    Tamaño: ["Pequeña", "Mediana", "Grande"]
  },

  23: {
    Color: ["Negro", "Azul", "Rojo"],
    Tamaño: ["Estándar"]
  },

  24: {
    Color: ["Negro", "Gris"],
    Potencia: ["100 lm", "300 lm"]
  },

  25: {
    Color: ["Negro", "Beige", "Azul"],
    Tamaño: ["Pequeño", "Mediano"]
  },

  26: {
    Color: ["Transparente", "Azul", "Rosa"],
    Capacidad: ["30 ml", "60 ml"]
  },

  27: {
    Color: ["Natural", "Blanco", "Negro"],
    Tamaño: ["Adulto"]
  },

  28: {
    Color: ["Negro", "Beige", "Azul"],
    Tamaño: ["Mediano", "Grande"]
  },

  29: {
    Tipo: ["FPS 30", "FPS 50"],
    Presentación: ["100 ml", "200 ml"]
  },

  30: {
    Color: ["Rojo", "Azul", "Verde"],
    Tamaño: ["Compacto", "Mediano"]
  }
};


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

window.RumboProducts = PRODUCTS;


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
        localStorage.getItem(key) || "[]"
      );

    } catch {

      return [];

    }
  }


  function storageWrite(key, value) {

    try {

      localStorage.setItem(
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
  // MOSTRAR LOS 30 PRODUCTOS
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
                    alt="${escapeHTML(product.name)}, fotografía de referencia"
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


  function notify(
    message,
    actionLabel = "Ver carrito",
    action = openCart
  ) {

    toastTrigger =
      document.activeElement;

    $("#toast-message").textContent =
      message;

    $("#toast-action").textContent =
      actionLabel;

    $("#toast-action").hidden =
      !action;

    toastAction = action;

    $("#toast").hidden = false;

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
<<<<<<< HEAD
=======
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
  if (new URLSearchParams(location.search).get('carrito') === '1') openCart();
})();
>>>>>>> f22c22b8f03d58e2148ea5951c41d94f194b46b6


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

                  <img
                    class="cart-item-image"
                    src="${product.image}?v=catalogo-limpio-3"
                    alt="${escapeHTML(product.name)}"
                    width="76"
                    height="91"
                  >


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
              Tu próxima aventura<br>
              todavía tiene espacio.
            </h3>

            <p>
              Agrega tus esenciales y los encontrarás aquí.
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

        <img
          class="detail-image"
          src="${product.image}?v=catalogo-limpio-3"
          alt="${escapeHTML(product.name)}, fotografía de referencia"
        >


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


          <p class="reference-note">
            Fotografía de referencia. Precio de demostración; marca, modelo y disponibilidad sin confirmar.
          </p>

        </div>

      </div>

    `;


    hideToast();

    detailDialog.showModal();

    document.body.classList.add(
      "dialog-open"
    );

    $("#close-detail").focus();
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

  $("#toast-action")
    .addEventListener(
      "click",
      () => {

        const action =
          toastAction;

        hideToast();

        if (action) {
          action();
        }

      }
    );


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
          "Catálogo de demostración. No es un pedido ni un comprobante de pago.",
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
          "Precios, características y disponibilidad sin confirmar."
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

  PHOTO_CREDITS.forEach(
    credit => {

      const li =
        document.createElement(
          "li"
        );

      const link =
        document.createElement(
          "a"
        );

      const license =
        document.createElement(
          "a"
        );


      const product =
        productsById.get(
          credit.id
        );


      if (!product) return;


      link.href =
        credit.page;

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";

      link.textContent =
        product.name +
        " — " +
        credit.title;


      license.href =
        credit.licenseUrl ||
        credit.page;

      license.target =
        "_blank";

      license.rel =
        "noopener noreferrer";

      license.textContent =
        credit.license;


      li.append(
        link,
        document.createTextNode(
          " · " +
          (credit.author || "") +
          " · "
        ),
        license,
        document.createTextNode(
          " · Archivo reducido; encuadre de presentación."
        )
      );


      $("#photo-credits")
        .appendChild(li);

    }
  );


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

})();