(() => {
  "use strict";

  function init() {
    const $ = selector => document.querySelector(selector);

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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setText("#year", new Date().getFullYear());

    /* CATÁLOGO FICTICIO EN HNL
       Las imágenes son ilustrativas, no prueba de disponibilidad. */

    const catalog = [
      {
        id: "roatan",
        name: "Roatán",
        country: "Honduras",
        style: "playa",
        price: 8500,
        duration: "4 días / 3 noches",
        code: "RMB-01",
        image: "photo-1514282401047-d79a71a590e8",
        alt: "Paisaje tropical, fotografía ilustrativa de playa",
        description: "Una propuesta de descanso junto al mar y actividades acuáticas."
      },
      {
        id: "copan",
        name: "Copán Ruinas",
        country: "Honduras",
        style: "cultura",
        price: 4500,
        duration: "3 días / 2 noches",
        code: "RMB-02",
        image: "photo-1500530855697-b586d89ba3ee",
        alt: "Paisaje natural, fotografía de inspiración para una escapada",
        description: "Una escapada para explorar el patrimonio maya y la gastronomía local."
      },
      {
        id: "bali",
        name: "Bali",
        country: "Indonesia",
        style: "playa",
        price: 32000,
        duration: "8 días / 7 noches",
        code: "RMB-03",
        image: "photo-1537996194471-e657df975ab4",
        alt: "Templo tradicional de Bali junto al agua",
        description: "Templos, arrozales y playas para combinar descanso y exploración."
      },
      {
        id: "dolomitas",
        name: "Dolomitas",
        country: "Italia",
        style: "naturaleza",
        price: 19000,
        duration: "6 días / 5 noches",
        code: "RMB-04",
        image: "photo-1464822759023-fed622ff2c3b",
        alt: "Cumbres de montaña, fotografía ilustrativa",
        description: "Senderismo, paisajes de montaña y actividades al aire libre."
      },
      {
        id: "kioto",
        name: "Kioto",
        country: "Japón",
        style: "cultura",
        price: 43000,
        duration: "10 días / 9 noches",
        code: "RMB-05",
        image: "photo-1493976040374-85c8e12f0c0e",
        alt: "Calle tradicional de Kioto con una pagoda al fondo",
        description: "Barrios tradicionales, jardines, templos y gastronomía japonesa."
      }
    ];

    const styles = {
      playa: "Playa y descanso",
      naturaleza: "Naturaleza y aventura",
      cultura: "Cultura y ciudad",
      all: "Sin preferencia"
    };

    /* MODALES */

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
        "Los contactos del equipo están disponibles en el footer. No hay un sistema de tickets."
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

        // Solo se interpola el catálogo fijo definido en este archivo.
        card.innerHTML = `
          <div class="destination-image">
            <img
              src="https://images.unsplash.com/${trip.image}?auto=format&fit=crop&w=800&q=85"
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
                <small>Base de muestra por persona</small>
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

    $("#reset-filters").addEventListener("click", () => {
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

    /* ESTADO DEL PLAN Y DEL PASE */

    const emptyPlan = () => ({
      company: "",
      people: 0,
      style: "",
      budget: 0
    });

    let plan = emptyPlan();
    let step = "home";
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
        "#pass-status",
        ready ? "Idea preparada" : completed ? "En preparación" : "Por completar"
      );

      setText(
        "#pass-destination-name",
        chosenDestination?.name || "Por descubrir"
      );

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
      // Identificador decorativo local, NO es un localizador de reserva.
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

    /* EXPORTAR PASE A PNG
       Dibujo propio: no necesita librerías ni fotografías externas. */

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
          `${data.company} · ${data.people} ${
            data.people === 1 ? "persona" : "personas"
          }`,
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
        // Compartir texto directamente conserva la activación del clic.
        // Para compartir la imagen, se descarga y adjunta desde el dispositivo.
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
          setText("#pass-feedback", "Tu navegador no permite compartir aquí. Guarda la imagen y adjúntala.");
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        setText("#pass-feedback", "No se pudo compartir. Puedes descargar el pase como imagen.");
      }
    });

    /* CHAT */

    const panel = $("#help-chat");
    const launcher = $("#chat-launcher");
    const messages = $("#chat-messages");
    const options = $("#chat-options");
    const input = $("#chat-input");

    const planButtons = [...document.querySelectorAll("[data-open-planner]")];
    const helpButtons = [...document.querySelectorAll("[data-open-help]")];
    const openButtons = [launcher, ...planButtons, ...helpButtons];

    let opener = launcher;

    function setExpanded(value) {
      openButtons.forEach(button => {
        button.setAttribute("aria-expanded", String(value));
        button.setAttribute("aria-controls", "help-chat");
      });
    }

    function openChat(button) {
      opener = button;
      panel.hidden = false;
      setExpanded(true);
      $("#close-chat").focus();
    }

    function closeChat(restoreFocus = true) {
      panel.hidden = true;
      setExpanded(false);
      if (restoreFocus) opener.focus();
    }

    function addMessage(text, user = false, linkData = null) {
      const message = document.createElement("p");
      message.className = user ? "chat-message user" : "chat-message";
      message.textContent = text;

      if (linkData) {
        const link = document.createElement("a");
        link.href = linkData.href;
        link.textContent = linkData.label;

        link.addEventListener("click", () => {
          if (linkData.destination) {
            const trip = catalog.find(item => item.id === linkData.destination);
            if (trip) showDestination(trip);
          }

          openGuide(linkData.href);
          closeChat(false);

          const target = document.getElementById(linkData.href.slice(1));

          if (target) {
            if (!target.hasAttribute("tabindex")) {
              target.setAttribute("tabindex", "-1");
              target.addEventListener("blur", () => {
                target.removeAttribute("tabindex");
              }, { once: true });
            }
            target.focus({ preventScroll: true });
          }
        });

        message.appendChild(link);
      }

      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function showOptions(items) {
      options.replaceChildren();

      items.forEach(([label, value]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", () => {
          handleMessage(value, label);
          input.focus();
        });
        options.appendChild(button);
      });
    }

    function askQuestion() {
      input.inputMode = "text";

      if (step === "company") {
        setText("#chat-step-label", "1 de 4 · Compañía");
        input.placeholder = "Solo, pareja, familia o amigos";
        addMessage("¿Con quién viajarías?");
        showOptions([
          ["Solo", "solo"],
          ["En pareja", "pareja"],
          ["En familia", "familia"],
          ["Con amigos", "amigos"]
        ]);
      }

      if (step === "people") {
        setText("#chat-step-label", "2 de 4 · Viajeros");
        input.placeholder = "Número de personas";
        input.inputMode = "numeric";

        addMessage(
          "¿Cuántas personas viajan, incluyéndote? Indica entre 2 y 12. " +
          "No calculo tarifas infantiles ni descuentos de grupo."
        );

        showOptions([
          ["2 personas", "2"],
          ["3 personas", "3"],
          ["4 personas", "4"],
          ["5 personas", "5"]
        ]);
      }

      if (step === "style") {
        setText("#chat-step-label", "3 de 4 · Experiencia");
        input.placeholder = "Playa, naturaleza o cultura";
        addMessage("¿Qué experiencia prefieres?");
        showOptions([
          ["Playa", "playa"],
          ["Naturaleza", "naturaleza"],
          ["Cultura", "cultura"],
          ["Cualquiera", "cualquiera"]
        ]);
      }

      if (step === "budget") {
        setText("#chat-step-label", "4 de 4 · Presupuesto total");
        input.placeholder = "Total en HNL. Ejemplo: 30000";
        input.inputMode = "numeric";

        addMessage(
          `¿Cuál es el presupuesto TOTAL en lempiras para ${
            plan.people === 1 ? "ti" : `las ${plan.people} personas`
          }?\nEscribe una cantidad entera sin puntos ni comas. Ejemplo: 30000.`
        );

        showOptions([
          ["L 15,000", "15000"],
          ["L 30,000", "30000"],
          ["L 60,000", "60000"]
        ]);
      }
    }

    function startPlan(clear = false) {
      if (clear) messages.replaceChildren();

      plan = emptyPlan();
      step = "company";
      input.value = "";

      clearPass();
      askQuestion();
    }

    function showResults() {
      step = "done";
      input.inputMode = "text";
      input.placeholder = "Escribe ayuda o reiniciar";
      setText("#chat-step-label", "Tu comparación y tu pase");

      const affordable = catalog
        .filter(trip => trip.price * plan.people <= plan.budget)
        .sort((a, b) => a.price - b.price);

      const matching = affordable.filter(trip =>
        plan.style === "all" || trip.style === plan.style
      );

      const selected = matching.length ? matching : affordable.slice(0, 2);

      addMessage(
        `${plan.company} · ${plan.people} ${
          plan.people === 1 ? "persona" : "personas"
        }.\nPreferencia: ${styles[plan.style]}.\n` +
        `Presupuesto total: ${money(plan.budget)} HNL.`
      );

      if (!selected.length) {
        addMessage(
          "Ningún ejemplo entra en ese presupuesto. No significa que " +
          "no existan opciones reales: este catálogo es limitado."
        );
      } else {
        addMessage(
          matching.length
            ? "Estas propuestas coinciden con tu preferencia y su base de muestra no supera el presupuesto:"
            : "Estas alternativas encajan por importe base, pero son de otro estilo:"
        );

        selected.forEach(trip => {
          addMessage(
            `${trip.name} · ${trip.duration}\n` +
            `${money(trip.price)} por persona.\n` +
            `Base ficticia para tu grupo: ${money(trip.price * plan.people)} HNL.`,
            false,
            {
              label: `Ver ${trip.name} →`,
              href: "#destinos",
              destination: trip.id
            }
          );
        });
      }

      preparePass(selected, matching.length > 0);

      addMessage(
        "No he comprobado fechas ni disponibilidad. Los servicios incluidos " +
        "no están definidos: estos importes no son un presupuesto completo " +
        "ni una cotización."
      );

      if (selected.length) {
        addMessage(
          "Tu pase está preparado. Puedes elegir otro destino recomendado, " +
          "descargarlo o compartir el resumen.",
          false,
          {
            label: "Ver mi pase →",
            href: "#boarding-pass"
          }
        );
      }

      showOptions([
        ["Cambiar respuestas", "reiniciar"],
        ["Ayuda con presupuesto", "presupuesto"],
        ["Equipaje", "equipaje"]
      ]);
    }

    function answerHelp(topic) {
      const answers = {
        presupuesto: {
          text: "Separa transporte, hospedaje, comidas, traslados, actividades " +
            "e imprevistos. Comprueba qué incluye cada tarifa. Aquí trabajamos en HNL.",
          href: "#guia-presupuesto",
          label: "Ver guía de presupuesto →"
        },
        equipaje: {
          text: "Revisa clima, duración y condiciones del transporte. " +
            "Confirma las medidas y el peso con tu aerolínea.",
          href: "#guia-equipaje",
          label: "Ver guía de equipaje →"
        },
        servicios: {
          text: "Rumbo tiene previstos vuelos, hospedaje, experiencias, " +
            "traslados, seguros y tienda. No se pueden contratar todavía.",
          href: "#servicios",
          label: "Ver servicios →"
        }
      };

      if (answers[topic]) {
        addMessage(answers[topic].text, false, answers[topic]);
      } else {
        addMessage(
          "Escribe «planear», «reiniciar», «presupuesto», «equipaje» o «servicios». " +
          "Soy un orientador programado, no una IA generativa."
        );
      }

      if (!["home", "done"].includes(step)) {
        addMessage("Puedes continuar con la pregunta pendiente usando los botones.");
      }
    }

    function handleMessage(value, displayed = value) {
      const raw = String(value).trim().slice(0, 240);
      if (!raw) return;

      const text = normalize(raw);
      addMessage(displayed, true);
      input.value = "";

      if (["planear", "empezar", "reiniciar"].includes(text)) {
        startPlan();
        return;
      }

      if (["ayuda", "presupuesto", "equipaje", "servicios"].includes(text)) {
        answerHelp(text);
        return;
      }

      if (step === "company") {
        if (/\b(solo|sola|solitario)\b/.test(text)) {
          plan.company = "En solitario";
          plan.people = 1;
          step = "style";
        } else if (/\b(pareja|novio|novia|esposo|esposa)\b/.test(text)) {
          plan.company = "En pareja";
          plan.people = 2;
          step = "style";
        } else if (/\b(familia|hijos|hijas)\b/.test(text)) {
          plan.company = "En familia";
          step = "people";
        } else if (/\b(amigos|amigas|grupo)\b/.test(text)) {
          plan.company = "Con amigos";
          step = "people";
        } else {
          addMessage("Elige solo, pareja, familia o amigos.");
          return;
        }

        if (plan.people) {
          addMessage(
            `Usaré ${plan.people} ${
              plan.people === 1 ? "persona" : "personas"
            } para la comparación.`
          );
        }

        updatePass();
        askQuestion();
        return;
      }

      if (step === "people") {
        const match = text.match(/^(?:somos\s+)?(\d{1,2})(?:\s+personas)?$/);
        const people = match ? Number(match[1]) : 0;

        if (people < 2 || people > 12) {
          addMessage("Escribe un número entre 2 y 12.");
          return;
        }

        plan.people = people;
        step = "style";
        updatePass();
        askQuestion();
        return;
      }

      if (step === "style") {
        if (/\b(playa|mar|descanso)\b/.test(text)) plan.style = "playa";
        else if (/\b(naturaleza|aventura|montana|montanas|senderismo)\b/.test(text)) {
          plan.style = "naturaleza";
        } else if (/\b(cultura|ciudad|museos|historia)\b/.test(text)) {
          plan.style = "cultura";
        } else if (/\b(cualquiera|ideas|todo)\b/.test(text)) {
          plan.style = "all";
        } else {
          addMessage("Elige playa, naturaleza, cultura o cualquiera.");
          return;
        }

        step = "budget";
        updatePass();
        askQuestion();
        return;
      }

      if (step === "budget") {
        const match = text.match(/^(?:l\s*)?(\d{1,7})(?:\s*(?:hnl|lempiras?))?$/);
        const amount = match ? Number(match[1]) : 0;

        if (amount < 1 || amount > 1000000) {
          addMessage(
            "Indica entre 1 y 1000000 lempiras enteros, sin puntos ni comas. Ejemplo: 30000."
          );
          return;
        }

        plan.budget = amount;
        updatePass();
        showResults();
        return;
      }

      addMessage("Escribe «planear» para crear tu pase o «ayuda» para consultar las opciones.");
    }

    launcher.addEventListener("click", () => {
      if (panel.hidden) openChat(launcher);
      else closeChat();
    });

    $("#close-chat").addEventListener("click", () => closeChat());

    planButtons.forEach(button => {
      button.addEventListener("click", () => {
        openChat(button);
        if (step === "home") startPlan();
      });
    });

    helpButtons.forEach(button => {
      button.addEventListener("click", () => openChat(button));
    });

    $("#chat-restart").addEventListener("click", () => {
      startPlan(true);
      input.focus();
    });

    $("#chat-form").addEventListener("submit", event => {
      event.preventDefault();
      handleMessage(input.value);
      input.focus();
    });

    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        !panel.hidden &&
        !$("#module-dialog").open
      ) {
        closeChat();
      }
    });

    setExpanded(false);
    updatePass();

    addMessage(
      "¡Hola! Vamos a preparar una idea de viaje y convertirla en un pase " +
      "que puedas guardar. Trabajamos con un catálogo de muestra en lempiras."
    );

    showOptions([
      ["Crear mi pase", "planear"],
      ["Presupuesto", "presupuesto"],
      ["Equipaje", "equipaje"],
      ["Servicios", "servicios"]
    ]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();