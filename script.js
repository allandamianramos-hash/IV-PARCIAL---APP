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
        "No hay compras ni pagos disponibles en esta demostración."
      ],
      flights: [
        "Buscar vuelos",
        "Se integrará la consulta de vuelos, equipaje y tarifas. No hay disponibilidad real."
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
                <small>Presupuesto orientativo / persona</small>
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
            `${trip.duration}. Base ficticia: ${money(trip.price)} HNL por persona. ` +
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

    /* ESTADO DEL PLAN */
    const emptyPlan = () => ({
      company: "",
      people: 0,
      style: "",
      budget: 0
    });

    let plan = emptyPlan();
    let chosenDestination = null;
    let ideaCode = "";

    function updatePass(message) {
      const completed = [
        Boolean(plan.company),
        Boolean(plan.people),
        Boolean(plan.style),
        Boolean(plan.budget)
      ].filter(Boolean).length;

      setText(
        "#plan-company",
        plan.company
          ? `${plan.company}${plan.people
            ? ` · ${plan.people} ${plan.people === 1 ? "persona" : "personas"}`
            : ""}`
          : "Por definir"
      );

      setText("#plan-experience", styles[plan.style] || "Por definir");
      setText("#plan-budget", plan.budget ? money(plan.budget) : "Por definir");
      setText("#pass-progress-text", `${completed} de 4 datos completados`);
      $("#pass-progress-fill").style.width = `${completed * 25}%`;

      const ready = Boolean(chosenDestination && completed === 4);
      $("#boarding-pass").classList.toggle("is-ready", ready);
      $("#download-pass").disabled = !ready;
      $("#share-pass").disabled = !ready;

      setText(
        "#planner-button-label",
        ready ? "Editar mi pase" : completed ? "Continuar mi pase" : "Crear mi pase"
      );

      setText(
        "#pass-status",
        ready ? "Idea preparada" : completed ? "En preparación" : "Por completar"
      );
      setText("#pass-destination-name", chosenDestination?.name || "Por descubrir");
      setText("#pass-route-code", chosenDestination?.code || "RMB — —");
      setText("#pass-idea-code", ideaCode || "Pendiente");

      if (message) setText("#plan-result", message);
    }

    function clearPass() {
      chosenDestination = null;
      ideaCode = "";
      $("#pass-picker").hidden = true;
      $("#pass-destination-select").replaceChildren();
      setText("#pass-feedback", "");
      updatePass("Tu pase se actualizará mientras conversas.");
    }

    function createIdeaCode() {
      // Código decorativo local; no es un localizador de reserva.
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      return "IDEA-" + Array.from(
        bytes,
        byte => byte.toString(16).padStart(2, "0")
      ).join("").toUpperCase();
    }

    function preparePass(destinations, exactMatch) {
      const select = $("#pass-destination-select");
      select.replaceChildren();

      if (!destinations.length) {
        clearPass();
        updatePass("No hay coincidencias. Cambia tus respuestas para preparar otro pase.");
        return;
      }

      destinations.forEach(trip => {
        const option = document.createElement("option");
        option.value = trip.id;
        option.textContent = `${trip.name} · ${money(trip.price)} por persona`;
        select.appendChild(option);
      });

      chosenDestination = destinations[0];
      ideaCode = createIdeaCode();
      $("#pass-picker").hidden = destinations.length < 2;

      updatePass(
        exactMatch
          ? "Puedes guardar esta idea. Los importes son ficticios y no incluyen una reserva."
          : "El destino encaja por importe base, pero no coincide con tu preferencia principal."
      );
    }

    $("#pass-destination-select").addEventListener("change", event => {
      chosenDestination = catalog.find(trip => trip.id === event.target.value);
      setText("#pass-feedback", "");
      updatePass();
    });

    /* DESCARGA Y COMPARTIR */
    function getPassSnapshot() {
      if (!chosenDestination || !plan.budget) return null;

      return {
        destination: chosenDestination.name,
        route: chosenDestination.code,
        code: ideaCode,
        company: plan.company,
        people: plan.people,
        preference: styles[plan.style],
        budget: plan.budget
      };
    }

    function createPassImage(data) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1450;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas no disponible."));
          return;
        }

        ctx.fillStyle = "#edf3f1";
        ctx.fillRect(0, 0, 1200, 1450);
        ctx.fillStyle = "#fffefb";
        ctx.fillRect(70, 70, 1060, 1300);
        ctx.fillStyle = "#065f68";
        ctx.fillRect(70, 70, 1060, 180);

        function text(content, x, y, size, color = "#183044", weight = 400) {
          ctx.fillStyle = color;
          ctx.font = `${weight} ${size}px Arial, sans-serif`;
          ctx.fillText(content, x, y);
        }

        function fittedText(content, x, y, size, maxWidth) {
          let currentSize = size;
          do {
            ctx.font = `600 ${currentSize}px Arial, sans-serif`;
            if (ctx.measureText(content).width <= maxWidth) break;
            currentSize -= 2;
          } while (currentSize > 20);

          ctx.fillStyle = "#183044";
          ctx.fillText(content, x, y);
        }

        text("rumbo ↗", 130, 185, 70, "#ffffff", 700);
        text("PASE DE INSPIRACIÓN", 130, 330, 25, "#52636c", 600);
        text("DESTINO", 130, 415, 23, "#52636c");
        fittedText(data.destination, 130, 515, 88, 930);

        ctx.fillStyle = "#e8bd78";
        ctx.fillRect(130, 560, 940, 6);

        text("VIAJEROS", 130, 650, 23, "#52636c");
        text(
          `${data.company} · ${data.people} ${data.people === 1 ? "persona" : "personas"}`,
          130, 705, 35
        );
        text("PREFERENCIA", 130, 795, 23, "#52636c");
        text(data.preference, 130, 850, 35);
        text("PRESUPUESTO TOTAL · HNL", 130, 945, 23, "#52636c");
        text(money(data.budget), 130, 1015, 62, "#065f68", 600);

        ctx.fillStyle = "#fbf2e3";
        ctx.fillRect(70, 1080, 1060, 290);
        ctx.beginPath();
        ctx.setLineDash([12, 10]);
        ctx.strokeStyle = "#c4d2ca";
        ctx.lineWidth = 3;
        ctx.moveTo(70, 1080);
        ctx.lineTo(1130, 1080);
        ctx.stroke();
        ctx.setLineDash([]);

        text("RUTA CONCEPTUAL", 130, 1145, 22, "#52636c");
        text(data.route, 130, 1200, 34, "#183044", 600);
        text("CÓDIGO DE TU IDEA", 570, 1145, 22, "#52636c");
        text(data.code, 570, 1200, 31, "#183044", 600);
        text("NO VÁLIDO PARA VIAJAR · SIN RESERVA", 130, 1280, 25, "#65563f", 600);
        text("Presupuesto personal. No es una cotización.", 130, 1325, 23, "#65563f");

        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error("No se pudo crear la imagen."));
        }, "image/png");
      });
    }

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }

    $("#download-pass").addEventListener("click", async () => {
      const snapshot = getPassSnapshot();
      if (!snapshot) return;

      try {
        const blob = await createPassImage(snapshot);
        downloadBlob(blob, `rumbo-${snapshot.code.toLowerCase()}.png`);
        setText("#pass-feedback", "Imagen preparada. Revisa las descargas de tu navegador.");
      } catch {
        setText("#pass-feedback", "No se pudo generar la imagen. Prueba con otro navegador.");
      }
    });

    $("#share-pass").addEventListener("click", async () => {
      const snapshot = getPassSnapshot();
      if (!snapshot) return;

      const text =
        `Mi idea de viaje con Rumbo: ${snapshot.destination}. ` +
        `${snapshot.people} ${snapshot.people === 1 ? "persona" : "personas"}, ` +
        `presupuesto total ${money(snapshot.budget)} HNL. ` +
        "Pase de inspiración, sin reserva.";

      try {
        // Se invoca directamente para conservar la activación del clic.
        if (navigator.share) {
          await navigator.share({
            title: "Mi pase de inspiración · Rumbo",
            text
          });
          setText("#pass-feedback", "Contenido enviado al menú de compartir.");
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          setText("#pass-feedback", "Resumen copiado. Puedes pegarlo donde quieras compartirlo.");
        } else {
          const blob = await createPassImage(snapshot);
          downloadBlob(blob, `rumbo-${snapshot.code.toLowerCase()}.png`);
          setText(
            "#pass-feedback",
            "Tu navegador no permite compartir aquí. Guarda la imagen y adjúntala."
          );
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        setText("#pass-feedback", "No se pudo compartir. Puedes descargar el pase como imagen.");
      }
    });

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
    const openButtons = [launcher, ...document.querySelectorAll("[data-open-planner], [data-open-help]")];
    let opener = launcher;
    let busy = false;
    const avatars = [...document.querySelectorAll(".rumbito-avatar")];
    avatars.forEach(avatar => {
      avatar.innerHTML = `<svg viewBox="0 0 120 120" focusable="false" aria-hidden="true">
        <ellipse cx="60" cy="112" rx="35" ry="5" fill="#183044" opacity=".1"/>
        <rect x="23" y="30" width="74" height="71" rx="19" fill="#cd9d59"/>
        <path d="M43 22v-7q17-14 34 0v7" fill="none" stroke="#1c6570" stroke-width="7"/>
        <path d="m30 77-15 12m77-12 13-15M43 96l-5 13m39-13 5 13" stroke="#1c6570" stroke-width="9" stroke-linecap="round"/>
        <circle cx="60" cy="57" r="43" fill="#087f8c"/>
        <circle cx="60" cy="57" r="35" fill="#fff9e9" stroke="#e8bd78" stroke-width="3"/>
        <path d="M60 26v6M60 83v6M29 57h6M85 57h6" stroke="#c9ab77" stroke-width="3" stroke-linecap="round"/>
        <path d="m61 35 7 11-14-1z" fill="#d68755"/>
        <g class="rumbito-eyes"><ellipse cx="46" cy="53" rx="8" ry="10" fill="white"/><ellipse cx="74" cy="53" rx="8" ry="10" fill="white"/>
        <g class="rumbito-pupils" fill="#183044"><circle cx="47" cy="54" r="4.8"/><circle cx="75" cy="54" r="4.8"/></g></g>
        <circle cx="38" cy="66" r="5" fill="#efbd9e"/><circle cx="82" cy="66" r="5" fill="#efbd9e"/>
        <path d="M49 68q11 12 22 0" fill="none" stroke="#1c6570" stroke-width="3.5" stroke-linecap="round"/>
        <path d="m95 17 3-8 3 8 8 3-8 3-3 8-3-8-8-3z" fill="#e8bd78"/>
      </svg>`;

    });
    let pointerFrame = 0;
    document.addEventListener("pointermove", event => {
      if (reducedMotion.matches || event.pointerType === "touch" || pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        avatars.forEach(avatar => {
          const rect = avatar.getBoundingClientRect();
          if (!rect.width) return;
          const dx = Math.max(-3, Math.min(3, (event.clientX - rect.x - rect.width / 2) / 65));
          const dy = Math.max(-3, Math.min(3, (event.clientY - rect.y - rect.height / 2) / 65));
          avatar.style.setProperty("--gaze-x", `${dx}px`);
          avatar.style.setProperty("--gaze-y", `${dy}px`);
        });
        pointerFrame = 0;
      });
    }, { passive: true });

    function openChat(button) {
      opener = button;
      panel.hidden = false;
      launcher.classList.add("chat-is-open");
      openButtons.forEach(item => item.setAttribute("aria-expanded", "true"));
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }

    function closeChat() {
      panel.hidden = true;
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
      plan = emptyPlan();
      clearPass();
      messages.replaceChildren();
      input.value = "";
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
        link.href = action.href === "#mi-pase" ? "#" + $("#boarding-pass").closest("section").id : action.href;
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
      panel.classList.add("is-thinking");
      form.setAttribute("aria-busy", "true");
      addMessage(text, true);
      input.value = "";
      const pending = addMessage("Rumbito está pensando…");
      pending.classList.add("is-typing");
      try {
        await new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : 380));
        const context = {
          catalog,
          trips: window.RumboViajesDatos?.destinations || [],
          flights: window.RumboViajesDatos?.flights,
          contacts: Array.from(document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]'), a => a.textContent.trim())
        };
        const result = window.RumboChat.respond(text, plan, context, localState);
        if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("No se recibió una respuesta. Vuelve a intentarlo.");
        pending.textContent = result.reply;
        appendActions(pending, result.actions);
        renderOptions(result.options);
        const labels = { company: "Tu compañía de viaje", people: "El equipo de esta aventura", style: "Tu forma de viajar", budget: "Un presupuesto a tu medida" };
        setText("#chat-step-label", labels[result.step] || "Sigamos dando forma a tu aventura.");
        applyPlan(result.plan);
      } catch (error) {
        pending.textContent = "Se me escapó ese detalle. Intenta otra vez o empecemos con un destino, por ejemplo Roatán.";
        input.value = text;
      } finally {
        busy = false;
        input.disabled = send.disabled = restart.disabled = false;
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
        if (button === launcher && !panel.hidden) closeChat();
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
