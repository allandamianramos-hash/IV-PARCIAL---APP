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

    function renderDestinations(items, featured = false) {
      const visible = window.RumboViajesDatos.selectHomeDestinations(items, featured);
      track.replaceChildren();

      visible.forEach(trip => {
        const card = document.createElement("article");
        card.className = "destination-card";

        // Solo se interpola el catálogo fijo, nunca mensajes del usuario.
        card.innerHTML = `
          <a class="destination-link" href="viajes.html?pantalla=detalle-destino&destino=${encodeURIComponent(trip.id)}">
            <div class="destination-image"><img src="${trip.image.startsWith('imagenes-') ? trip.image : 'https://images.unsplash.com/'+trip.image+'?auto=format&fit=crop&w=800&q=85'}" alt="${trip.alt}" width="800" height="600" loading="lazy"></div>
            <div class="destination-body"><span class="destination-country">${trip.country} · ${trip.duration}</span><h3>${trip.name}<span aria-hidden="true">↗</span></h3><p>Desde ${money(trip.price)} por persona</p></div>
          </a>`;

        track.appendChild(card);
      });

      setText(
        "#result-count",
        featured ? `${visible.length} destacados de ${catalog.length} destinos` : `Mostrando ${visible.length} de ${items.length} ${items.length === 1 ? "destino" : "destinos"}`
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

      const featured = !query && style === 'all' && budget === 'all';
      renderDestinations(filtered, featured);
      const allLink = $('#all-destinations');
      const params = new URLSearchParams({ pantalla: 'destinos', q: query, tipo: style, presupuesto: budget });
      allLink.href = 'viajes.html?' + params + '#catalogo';
      allLink.textContent = featured ? 'Ver todos los destinos ↗' : 'Ver todos los resultados ↗';
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

    renderDestinations(catalog, true);

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
