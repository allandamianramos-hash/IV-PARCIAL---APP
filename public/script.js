(() => {
  "use strict";

  function init() {
    const $ = selector => document.querySelector(selector);
    if (!$("#travel-search") || !$("#help-chat")) return;

    const normalize = value => String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    const money = value => `L ${new Intl.NumberFormat("es-HN", {
      maximumFractionDigits: 0
    }).format(value)}`;

    const setText = (selector, text) => {
      const element = $(selector);
      if (element) element.textContent = text;
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setText("#year", new Date().getFullYear());

    /* CATÁLOGO FICTICIO EN HNL */
    const catalog = window.RumboViajesDatos.destinations.map((trip,index) => ({
      id:trip.id, name:trip.name, country:trip.country, style:trip.type,
      price:trip.inspirationBudget, originalPrice:trip.originalInspirationBudget, promotion:trip.promotion, duration:`${trip.nights+1} días / ${trip.nights} noches`,
      code:`RMB-${String(index+1).padStart(2,'0')}`, image:trip.image, alt:trip.alt, description:trip.intro
    }));

    const styles = {
      playa: "Playa y descanso",
      naturaleza: "Naturaleza y aventura",
      cultura: "Cultura y ciudad",
      all: "Sin preferencia"
    };

    /* DIÁLOGOS */
    const modules = {
      login: [
        "Iniciar sesión",
        "Acceso pendiente de integración. No se solicitan contraseñas."
      ],
      register: [
        "Crear una cuenta",
        "Registro pendiente de integración. Todavía no se recopilan datos."
      ],
      cart: [
        "Carrito",
        "Encuentra equipaje y accesorios desde Servicios."
      ],
      flights: [
        "Buscar vuelos",
        "Consulta vuelos, equipaje y tarifas desde Servicios."
      ],
      stays: [
        "Consultar hospedaje",
        "La búsqueda de hospedajes y las cotizaciones están pendientes de integración."
      ],
      experiences: [
        "Experiencias y guías locales",
        "Catálogo de actividades y guías profesionales pendiente de integración."
      ],
      transfers: [
        "Traslados",
        "La consulta de rutas, horarios y pasajeros está pendiente de programación."
      ],
      insurance: [
        "Seguro de viaje",
        "Este prototipo no ofrece pólizas. Las futuras opciones deberán mostrar coberturas y exclusiones."
      ],
      shop: [
        "Tienda",
        "El catálogo, las existencias, los envíos y las devoluciones están pendientes."
      ],
      faq: [
        "Preguntas frecuentes",
        "Apartado pendiente de desarrollo."
      ],
      changes: [
        "Cambios y cancelaciones",
        "Todavía no hay reservas ni políticas comerciales publicadas."
      ],
      support: [
        "Centro de ayuda",
        "Encontrarás los teléfonos y correos del equipo al final de esta página."
      ],
      about: [
        "Acerca de Rumbo",
        "Presentación del proyecto pendiente de desarrollo."
      ],
      team: [
        "Nuestro equipo",
        "Presentación del equipo pendiente de desarrollo."
      ],
      privacy: [
        "Privacidad",
        "La política deberá redactarse antes de habilitar servicios que recopilen datos personales."
      ],
      terms: [
        "Términos y condiciones",
        "Apartado pendiente. El prototipo no permite contratar servicios."
      ]
    };

    function showModule(title, description) {
      setText("#module-title", title);
      setText("#module-description", description);
      if (!$("#module-dialog").open) $("#module-dialog").showModal();
    }

    document.querySelectorAll("[data-module]").forEach(button => {
      button.setAttribute("aria-haspopup", "dialog");
      button.addEventListener("click", () => {
        const content = modules[button.dataset.module];
        if (content) showModule(...content);
      });
    });

    /*
     * viajes.js conserva la navegación de vuelos, hospedaje y tarjetas.
     * Estos diálogos mantienen el comportamiento de respaldo del inicio.
     */

    /* DESTINOS Y CARRUSEL */
    const track = $("#destinations-track");
    const searchForm = $("#travel-search");
    const previous = $("#destinations-prev");
    const next = $("#destinations-next");

    function updateCarouselControls() {
      const limit = track.scrollWidth - track.clientWidth;
      previous.disabled = track.scrollLeft <= 3;
      next.disabled = limit <= 3 || track.scrollLeft >= limit - 3;
    }

    function renderDestinations(items) {
      track.replaceChildren();

      items.forEach(trip => {
        const card = document.createElement("article");
        card.className = "destination-card";

        // Solo se interpola el catálogo fijo, nunca mensajes del usuario.
        card.innerHTML = `
          <a class="destination-link" href="viajes.html?pantalla=detalle-destino&destino=${encodeURIComponent(trip.id)}">
            <div class="destination-image"><img src="${trip.image.startsWith('imagenes-') ? trip.image : 'https://images.unsplash.com/'+trip.image+'?auto=format&fit=crop&w=800&q=85'}" alt="${trip.alt}" width="800" height="600" loading="lazy"></div>
            <div class="destination-body"><h3>${trip.name}</h3><p>Desde ${money(trip.price)} por persona</p></div>
          </a>`;

        track.appendChild(card);
      });

      setText(
        "#result-count",
        `${items.length} ${items.length === 1 ? "destino disponible" : "destinos disponibles"}`
      );

      $("#empty-state").hidden = items.length > 0;
      track.scrollLeft = 0;
      requestAnimationFrame(updateCarouselControls);
    }

    function filterDestinations() {
      const query = normalize($("#destination").value);
      const style = $("#travel-style").value;
      const budget = $("#budget").value;

      const filtered = catalog.filter(trip =>
        normalize(`${trip.name} ${trip.country} ${trip.description}`).includes(query) &&
        (style === "all" || trip.style === style) &&
        (budget === "all" || trip.price <= Number(budget))
      );

      renderDestinations(filtered);
    }

    function moveCarousel(direction) {
      const card = track.querySelector(".destination-card");
      if (!card) return;

      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({
        left: direction * (card.getBoundingClientRect().width + gap),
        behavior: reducedMotion.matches ? "instant" : "smooth"
      });
    }

    previous.addEventListener("click", () => moveCarousel(-1));
    next.addEventListener("click", () => moveCarousel(1));
    track.addEventListener("scroll", updateCarouselControls, { passive: true });
    window.addEventListener("resize", updateCarouselControls);

    searchForm.addEventListener("submit", event => {
      event.preventDefault();
      filterDestinations();
      $("#destinos").scrollIntoView({ block: "start" });
    });

    $("#reset-filters")?.addEventListener("click", () => {
      searchForm.reset();
      filterDestinations();
    });

    function showDestination(trip) {
      searchForm.reset();
      $("#destination").value = trip.name;
      filterDestinations();
    }

    $("#surprise-destination").addEventListener("click", () => {
      const trip = catalog[Math.floor(Math.random() * catalog.length)];
      showDestination(trip);
      $("#destinos").scrollIntoView({ block: "start" });
      setText("#result-count", `Tu destino al azar: ${trip.name}`);
    });

    renderDestinations(catalog);

    /* GUÍAS */
    function openGuide(hash) {
      if (!hash.startsWith("#guia-")) return;
      const guide = document.getElementById(hash.slice(1));
      if (guide instanceof HTMLDetailsElement) guide.open = true;
    }

    document.addEventListener("click", event => {
      const link = event.target.closest('a[href^="#guia-"]');
      if (link) openGuide(link.getAttribute("href"));
    });

    window.addEventListener("hashchange", () => openGuide(location.hash));
    openGuide(location.hash);


  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
