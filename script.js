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
      price:trip.inspirationBudget, duration:`${trip.nights+1} días / ${trip.nights} noches`,
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
          <div class="destination-image">
            <img
              src="${trip.image.startsWith('imagenes-') ? trip.image : `https://images.unsplash.com/${trip.image}?auto=format&fit=crop&w=800&q=85` }"
              alt="${trip.alt}"
              width="800"
              height="900"
              loading="lazy"
            >
            <span class="image-tag">${trip.country}</span>
          </div>
          <div class="destination-body">
            <div class="card-title-row">
              <h3>${trip.name}</h3>
              <span>${trip.duration}</span>
            </div>
            <p>${trip.description}</p>
            <div class="card-bottom">
              <div class="price">
                <small>Presupuesto / persona</small>
                <strong>${money(trip.price)} <span>HNL</span></strong>
              </div>
              <button
                class="circle-link"
                type="button"
                aria-label="Ver propuesta de ${trip.name}"
                aria-haspopup="dialog"
              >↗</button>
            </div>
          </div>
        `;

        card.querySelector("button").addEventListener("click", () => {
          showModule(
            trip.name,
            `${trip.duration}. Presupuesto: ${money(trip.price)} HNL por persona. ` +
            "Los servicios incluidos, las fechas y la disponibilidad no están definidos. " +
            "No es una oferta contratable."
          );
        });

        track.appendChild(card);
      });

      setText(
        "#result-count",
        `${items.length} ${items.length === 1 ? "destino" : "destinos"} para descubrir`
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

    /* El orientador inspira; el ticket se emite al cerrar Mi viaje. */
    const emptyPlan=()=>({company:'',people:0,style:'',budget:0});
    let plan=emptyPlan();
    function clearPass() {}
    function preparePass(destinations) {
      const link=document.querySelector('#suggested-start');
      if(link&&destinations[0]){link.href='viajes.html?pantalla=vuelos&destino='+encodeURIComponent(destinations[0].id);link.textContent='Organizar un viaje a '+destinations[0].name+' →';}
    }

    /* RUMBITO */
    const panel = $("#help-chat");
    const launcher = $("#chat-launcher");
    const messages = $("#chat-messages");
    const input = $("#chat-input");
    const form = $("#chat-form");
    const send = form.querySelector('button[type="submit"]');
    const restart = $("#chat-restart");
    const options = $("#chat-options");
    let localState = {};
    let conversation = [];
    const openButtons = [launcher, ...document.querySelectorAll("[data-open-planner], [data-open-help]")];
    let opener = launcher;
    let busy = false;
    const avatars = [...document.querySelectorAll(".rumbito-avatar")];
    avatars.forEach((avatar, index) => {
      const skin = 'rumbito-lid-' + index;
      avatar.innerHTML = `<span class="rumbito-face"><img src="imagenes/rumbito-pin.png" width="256" height="256" alt="" draggable="false"><svg class="rumbito-blink" viewBox="0 0 1280 1280" aria-hidden="true"><defs><radialGradient id="${skin}"><stop stop-color="#f8f4f0"/><stop offset="1" stop-color="#f2ede9"/></radialGradient></defs><g><ellipse cx="508" cy="494" rx="55" ry="69" fill="url(#${skin})"/><path d="M478 494 Q504 519 533 484"/><ellipse cx="790" cy="443" rx="53" ry="73" fill="url(#${skin})"/><path d="M761 442 Q790 466 819 433"/></g></svg></span>`;
      avatar.style.setProperty('--blink-delay', (-index * 1.7) + 's');
      const surface = avatar.closest('button') || avatar;
      surface.addEventListener('pointermove', event => {
        if (reducedMotion.matches || event.pointerType === 'touch') return;
        const rect = surface.getBoundingClientRect();
        avatar.style.setProperty('--gaze-x', ((event.clientX - rect.left) / rect.width * 6 - 3) + 'px');
        avatar.style.setProperty('--gaze-y', ((event.clientY - rect.top) / rect.height * 6 - 3) + 'px');
      }, { passive: true });
      surface.addEventListener('pointerleave', () => {
        avatar.style.setProperty('--gaze-x', '0px');
        avatar.style.setProperty('--gaze-y', '0px');
      });
    });
    function greet() {
      if (reducedMotion.matches) return;
      const avatar = panel.querySelector('.rumbito-avatar');
      avatar.classList.remove('is-greeting');
      requestAnimationFrame(() => requestAnimationFrame(() => avatar.classList.add('is-greeting')));
    }
    panel.querySelector('.rumbito-avatar').addEventListener('animationend', event => {
      if (event.animationName === 'rumbito-greet') event.currentTarget.classList.remove('is-greeting');
    });
    let closeAnimation;
    function updateComposer() {
      send.disabled = busy || !input.value.trim();
      panel.classList.toggle('is-composing', !busy && !!input.value.trim());
    }
    input.addEventListener('input', updateComposer);

    function openChat(button) {
      clearTimeout(closeAnimation);
      panel.classList.remove("is-closing");
      opener = button;
      panel.hidden = false;
      greet();
      launcher.classList.add("chat-is-open");
      openButtons.forEach(item => item.setAttribute("aria-expanded", "true"));
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }

    function closeChat() {
      panel.classList.add("is-closing");
      closeAnimation = setTimeout(() => {
        panel.hidden = true;
        panel.classList.remove("is-closing");
      }, reducedMotion.matches ? 0 : 180);
      launcher.classList.remove("chat-is-open");
      openButtons.forEach(item => item.setAttribute("aria-expanded", "false"));
      opener.focus();
    }

    function addMessage(text, user = false) {
      const message = document.createElement("p");
      message.className = user ? "chat-message user" : "chat-message";
      message.textContent = text;
      messages.appendChild(message);
      while (messages.children.length > 60) messages.firstElementChild.remove();
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    function resetChat() {
      localState = {};
      conversation = [];
      plan = emptyPlan();
      clearPass();
      messages.replaceChildren();
      input.value = "";
      updateComposer();
      addMessage("¡Hola! Soy Rumbito, tu compañero de aventuras. Tú pones las ganas y yo te ayudo a encontrar el rumbo. ¿Playa, montaña o una ciudad por descubrir?");
      renderOptions(window.RumboChat.defaults);
      setText("#chat-step-label", "Un gran viaje empieza con una buena idea.");
    }

    function renderOptions(items = []) {
      options.replaceChildren();
      items.slice(0, 6).forEach(text => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.addEventListener("click", () => void sendMessage(text));
        options.appendChild(button);
      });
    }

    function appendActions(message, actions = []) {
      actions.forEach(action => {
        const url = new URL(action.href, location.href);
        if (!["viajes.html", "tienda.html", "index.html", "servicios.html"].some(file => url.pathname.endsWith("/" + file)) && !action.href.startsWith("#")) return;
        const link = document.createElement("a");
        link.href = action.href === "#mi-pase" ? "#servicios" : action.href;
        link.textContent = `${action.label} ↗`;
        if (action.href.startsWith("#")) link.addEventListener("click", () => closeChat());
        message.appendChild(link);
      });
    }

    function applyPlan(next) {
      if (!next) return;
      plan = {
        company: typeof next.company === "string" ? next.company.slice(0, 80) : "",
        people: Number.isInteger(next.people) && next.people >= 1 && next.people <= 12 ? next.people : 0,
        style: Object.hasOwn(styles, next.style) ? next.style : "",
        budget: Number.isFinite(next.budget) && next.budget > 0 ? next.budget : 0
      };
      clearPass();
      if (plan.company && plan.people && plan.style && plan.budget) {
        const affordable = catalog.filter(trip => trip.price * plan.people <= plan.budget);
        const matching = affordable.filter(trip => plan.style === "all" || trip.style === plan.style);
        const selected = next.destination ? affordable.filter(trip => trip.id === next.destination) : matching.length ? matching : affordable;
        const preferred = selected.find(trip => trip.id === next.destination);
        if (preferred) selected.sort((a, b) => Number(b === preferred) - Number(a === preferred));
        preparePass(selected, matching.length > 0);
      }
    }

    async function sendMessage(value) {
      const text = value.trim();
      if (!text || busy) return;
      if (text.length > 2000) return;
      busy = true;
      input.disabled = send.disabled = restart.disabled = true;
      options.querySelectorAll("button").forEach(button => button.disabled = true);
      panel.classList.remove("is-composing", "is-replied");
      panel.classList.add("is-thinking");
      form.setAttribute("aria-busy", "true");
      addMessage(text, true);
      input.value = "";
      const pending = addMessage("Rumbito está pensando…");
      pending.classList.add("is-typing");
      try {
        const result = await window.RumboChatClient.request(
          { message: text, history: conversation, plan, state: localState },
          { fallback: () => {
            const state = structuredClone(localState);
            const context = { catalog, trips: window.RumboViajesDatos?.destinations || [], flights: window.RumboViajesDatos?.flights,
              contacts: Array.from(document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]'), a => a.textContent.trim()) };
            return { ...window.RumboChat.respond(text, plan, context, state), state };
          } }
        );
        if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("No se recibió una respuesta. Vuelve a intentarlo.");
        localState = result.state || {};
        conversation = [...conversation, { role: "user", content: text }, { role: "assistant", content: result.reply.slice(0, 2000) }].slice(-12);
        pending.textContent = result.reply;
        panel.classList.add("is-replied");
        appendActions(pending, result.actions);
        renderOptions(result.options);
        const labels = { company: "Tu compañía de viaje", people: "El equipo de esta aventura", style: "Tu forma de viajar", budget: "Un presupuesto a tu medida" };
        setText("#chat-step-label", result.connectionNotice || labels[result.step] || "Sigamos dando forma a tu aventura.");
        applyPlan(result.plan);
      } catch (error) {
        pending.textContent = error.name === "TimeoutError" || error.name === "TypeError" || error.name === "SyntaxError" ? "No pude conectar con mi servicio de respuestas. Comprueba la conexión e inténtalo otra vez." : error.message;
        input.value = text;
      } finally {
        busy = false;
        input.disabled = restart.disabled = false;
        updateComposer();
        options.querySelectorAll("button").forEach(button => button.disabled = false);
        panel.classList.remove("is-thinking");
        pending.classList.remove("is-typing");
        form.setAttribute("aria-busy", "false");
        messages.scrollTop = messages.scrollHeight;
        if (!panel.hidden) input.focus();
      }
    }

    openButtons.forEach(button => {
      button.setAttribute("aria-controls", "help-chat");
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        if (button === launcher && !panel.hidden && !panel.classList.contains("is-closing")) closeChat();
        else openChat(button);
      });
    });
    $("#close-chat").addEventListener("click", closeChat);
    restart.addEventListener("click", () => { resetChat(); input.focus(); });
    form.addEventListener("submit", event => {
      event.preventDefault();
      void sendMessage(input.value);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden && !$("#module-dialog").open) closeChat();
    });
    resetChat();
    if (location.hash === "#hablar-rumbito") openChat(launcher);
    window.addEventListener("hashchange", () => { if (location.hash === "#hablar-rumbito") openChat(launcher); });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
