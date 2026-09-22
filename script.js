(() => {
  "use strict";

  function initRumbo() {
    const $ = selector => document.querySelector(selector);

    const normalize = value => String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    const euros = value => new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value);

    function setText(selector, text) {
      const element = $(selector);
      if (element) element.textContent = text;
    }

    setText("#year", new Date().getFullYear());

    /* ==========================================
       BUSCADOR
       ========================================== */

    const searchForm = $("#travel-search");

    const cards = [
      ...document.querySelectorAll(".destination-card")
    ];

    function filterDestinations() {
      const query = normalize($("#destination")?.value || "");
      const style = $("#travel-style")?.value || "all";
      const budget = $("#budget")?.value || "all";

      let visible = 0;

      cards.forEach(card => {
        const matchesQuery = normalize(card.dataset.search || "")
          .includes(query);

        const matchesStyle =
          style === "all" || card.dataset.style === style;

        const matchesBudget =
          budget === "all" ||
          Number(card.dataset.price) <= Number(budget);

        const show = matchesQuery && matchesStyle && matchesBudget;

        card.hidden = !show;
        if (show) visible++;
      });

      setText(
        "#result-count",
        `${visible} ${visible === 1 ? "destino" : "destinos"} para descubrir`
      );

      const empty = $("#empty-state");
      if (empty) empty.hidden = visible !== 0;
    }

    searchForm?.addEventListener("submit", event => {
      event.preventDefault();
      filterDestinations();
      $("#destinos")?.scrollIntoView({ block: "start" });
    });

    $("#reset-filters")?.addEventListener("click", () => {
      searchForm?.reset();
      filterDestinations();
    });

    const catalog = cards.map(card => ({
      name: card.querySelector("h3")?.textContent.trim() || "Destino",
      style: card.dataset.style,
      price: Number(card.dataset.price),
      duration:
        card.querySelector(".card-title-row > span")
          ?.textContent.trim() || ""
    })).filter(trip => Number.isFinite(trip.price) && trip.price > 0);

    /* ==========================================
       VENTANAS DE SERVICIOS
       ========================================== */

    const modules = {
      login: [
        "Tu espacio en Rumbo",
        "Aquí se integrará el acceso a tu cuenta. Este prototipo no " +
        "solicita contraseñas ni crea usuarios."
      ],
      cart: [
        "Tu carrito de viaje",
        "Este espacio está reservado para el carrito. Todavía no hay " +
        "compras ni pagos disponibles."
      ],
      flights: [
        "Encuentra tu vuelo",
        "Aquí se integrará la búsqueda de vuelos por origen, destino, " +
        "fechas y pasajeros. Aún no se consultan tarifas reales."
      ],
      stays: [
        "Encuentra dónde quedarte",
        "Este apartado conectará con la búsqueda de hospedajes. " +
        "No hay disponibilidad ni cotizaciones reales en esta demostración."
      ],
      experiences: [
        "Experiencias y guías locales",
        "Aquí se mostrarán actividades con duración, idioma, requisitos " +
        "y condiciones. Todavía no se pueden contratar."
      ],
      transfers: [
        "Organiza tus traslados",
        "Este módulo está previsto para organizar trayectos, horarios, " +
        "pasajeros y equipaje. No se realizan reservas reales."
      ],
      insurance: [
        "Seguro de viaje",
        "Aquí se presentarán opciones de proveedores autorizados. " +
        "Las coberturas y exclusiones deberán consultarse antes de contratar. " +
        "Este prototipo no ofrece pólizas."
      ],
      shop: [
        "La tienda del viajero",
        "Aquí se integrará el catálogo de equipaje y accesorios con " +
        "precios, existencias, envíos y devoluciones."
      ]
    };

    function showModule(title, description) {
      const dialog = $("#module-dialog");
      if (!dialog) return;

      setText("#module-title", title);
      setText("#module-description", description);

      if (!dialog.open) dialog.showModal();
    }

    document.querySelectorAll("[data-module]").forEach(button => {
      button.addEventListener("click", () => {
        const data = modules[button.dataset.module];
        if (data) showModule(...data);
      });
    });

    document.querySelectorAll("[data-trip]").forEach(button => {
      button.addEventListener("click", () => {
        showModule(
          `Tu viaje a ${button.dataset.trip}`,
          "Propuesta ficticia de demostración. Los servicios incluidos, " +
          "fechas y condiciones están pendientes de definir. No se ha " +
          "realizado ninguna reserva."
        );
      });
    });

    /* ==========================================
       GUÍAS
       ========================================== */

    function openGuide(hash) {
      if (!hash?.startsWith("#guia-")) return;

      const guide = document.getElementById(hash.slice(1));

      if (guide instanceof HTMLDetailsElement) {
        guide.open = true;
      }
    }

    document.addEventListener("click", event => {
      const link = event.target.closest('a[href^="#guia-"]');
      if (link) openGuide(link.getAttribute("href"));
    });

    window.addEventListener("hashchange", () => {
      openGuide(window.location.hash);
    });

    openGuide(window.location.hash);

    /* ==========================================
       CHAT
       Reconstruye el interior para evitar que
       el HTML y el JavaScript sean de versiones distintas.
       ========================================== */

    const panel = $("#help-chat");
    const launcher = $("#chat-launcher");

    if (!panel || !launcher) {
      console.error(
        "Rumbo: faltan #help-chat o #chat-launcher en index.html."
      );
      return;
    }

    // Evita inicializar este panel dos veces.
    if (panel.dataset.initialized === "true") return;
    panel.dataset.initialized = "true";

    // Plantilla fija: no incluye texto introducido por usuarios.
    panel.innerHTML = `
      <div class="chat-header">
        <div>
          <h2 id="chat-title">Tu rumbo, paso a paso</h2>
          <p>Orientador de viajes · modo demostración</p>
        </div>

        <button
          class="chat-close"
          id="close-chat"
          type="button"
          aria-label="Cerrar conversación"
        >×</button>
      </div>

      <div class="chat-progress">
        <span id="chat-step-label">¿Por dónde empezamos?</span>
        <span class="chat-mode">Sin registro</span>
      </div>

      <div
        class="chat-messages"
        id="chat-messages"
        role="log"
        aria-label="Conversación de orientación"
        aria-live="polite"
        aria-relevant="additions"
        tabindex="0"
      ></div>

      <div
        class="chat-options"
        id="chat-options"
        role="group"
        aria-label="Respuestas sugeridas"
      ></div>

      <form class="chat-form" id="chat-form">
        <label class="chat-input-label" for="chat-input">
          Tu respuesta
        </label>

        <div class="chat-input-row">
          <input
            id="chat-input"
            type="text"
            placeholder="Escribe aquí…"
            maxlength="240"
            autocomplete="off"
            required
          >

          <button
            class="chat-send"
            type="submit"
            aria-label="Enviar mensaje"
          >↑</button>
        </div>
      </form>

      <div class="chat-tools">
        <button id="chat-restart" type="button">
          Empezar de nuevo
        </button>
        <span>Sin reservas ni pagos</span>
      </div>

      <p class="chat-disclaimer">
        Respuestas programadas. Catálogo y precios ficticios en euros.
      </p>
    `;

    panel.setAttribute("aria-labelledby", "chat-title");

    const messages = $("#chat-messages");
    const options = $("#chat-options");
    const form = $("#chat-form");
    const input = $("#chat-input");

    const openButtons = [
      launcher,
      $("#open-help"),
      $("#start-trip-plan")
    ].filter(Boolean);

    let opener = launcher;
    let step = "home";

    const emptyPlan = () => ({
      company: "",
      people: 0,
      style: "",
      budget: 0
    });

    let plan = emptyPlan();

    const styles = {
      playa: "Playa y descanso",
      naturaleza: "Naturaleza y aventura",
      cultura: "Cultura y ciudad",
      all: "Sin preferencia"
    };

    function updateSummary(result) {
      setText(
        "#plan-company",
        plan.company
          ? `${plan.company}${plan.people ? ` · ${plan.people} personas` : ""}`
          : "¿Solo, en pareja o en grupo?"
      );

      setText(
        "#plan-experience",
        styles[plan.style] || "¿Descanso, naturaleza o cultura?"
      );

      setText(
        "#plan-budget",
        plan.budget ? euros(plan.budget) : "Tú marcas el punto de partida."
      );

      if (result) setText("#plan-result", result);
    }

    function setExpanded(value) {
      openButtons.forEach(button => {
        button.setAttribute("aria-expanded", String(value));
        button.setAttribute("aria-controls", "help-chat");
      });
    }

    function openChat(button) {
      opener = button || launcher;
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
      message.className = user
        ? "chat-message user-message"
        : "chat-message";

      // Nunca insertar el mensaje del usuario como HTML.
      message.textContent = text;

      if (linkData) {
        const link = document.createElement("a");
        link.href = linkData.href;
        link.textContent = linkData.label;

        link.addEventListener("click", () => {
          if (linkData.destination) {
            searchForm?.reset();
            if ($("#destination")) {
              $("#destination").value = linkData.destination;
            }
            filterDestinations();
          }

          openGuide(linkData.href);

          const target = document.getElementById(
            linkData.href.slice(1)
          );

          closeChat(false);

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
        setText("#chat-step-label", "1 de 4 · Con quién viajas");
        input.placeholder = "Solo, pareja, familia o amigos";

        addMessage("¿Con quién te gustaría viajar?");

        showOptions([
          ["Voy solo", "solo"],
          ["En pareja", "pareja"],
          ["En familia", "familia"],
          ["Con amigos", "amigos"]
        ]);
      }

      if (step === "people") {
        setText("#chat-step-label", "2 de 4 · Número de personas");
        input.placeholder = "Ejemplo: 4";
        input.inputMode = "numeric";

        addMessage(
          "¿Cuántas personas viajarían, incluyéndote? " +
          "Indica entre 2 y 12.\n" +
          "En esta demostración no puedo calcular tarifas infantiles."
        );

        showOptions([
          ["2 personas", "2"],
          ["3 personas", "3"],
          ["4 personas", "4"],
          ["5 personas", "5"]
        ]);
      }

      if (step === "style") {
        setText("#chat-step-label", "3 de 4 · Tu tipo de viaje");
        input.placeholder = "Playa, naturaleza o cultura";

        addMessage(
          "¿Qué te apetece más? Elige una preferencia principal " +
          "para esta primera comparación."
        );

        showOptions([
          ["Playa y descanso", "playa"],
          ["Naturaleza", "naturaleza"],
          ["Cultura y ciudad", "cultura"],
          ["Estoy abierto a ideas", "cualquiera"]
        ]);
      }

      if (step === "budget") {
        setText("#chat-step-label", "4 de 4 · Presupuesto total");
        input.placeholder = "Total en euros. Ejemplo: 3000";
        input.inputMode = "numeric";

        addMessage(
          `¿Cuál es el presupuesto TOTAL para ${
            plan.people === 1 ? "ti" : `las ${plan.people} personas`
          }?\n` +
          "Escribe euros enteros, sin puntos ni comas. Ejemplo: 3000."
        );

        showOptions([
          ["1.500 €", "1500"],
          ["3.000 €", "3000"],
          ["5.000 €", "5000"]
        ]);
      }
    }

    function startPlan(clear = false) {
      if (clear) messages.replaceChildren();

      plan = emptyPlan();
      step = "company";
      input.value = "";

      updateSummary("Estamos preparando tu primera idea.");
      askQuestion();
    }

    function showResults() {
      step = "done";
      input.inputMode = "text";
      input.placeholder = "Escribe ayuda o reiniciar";
      setText("#chat-step-label", "Tu primera comparación");

      const affordable = catalog
        .filter(trip => trip.price * plan.people <= plan.budget)
        .sort((a, b) => a.price - b.price);

      const matching = affordable.filter(trip =>
        plan.style === "all" || trip.style === plan.style
      );

      const selected = matching.length
        ? matching
        : affordable.slice(0, 2);

      addMessage(
        `${plan.company} · ${plan.people} ${
          plan.people === 1 ? "persona" : "personas"
        }.\n` +
        `Preferencia: ${styles[plan.style]}.\n` +
        `Presupuesto total: ${euros(plan.budget)}.\n` +
        `Equivalente aproximado por persona: ${
          euros(plan.budget / plan.people)
        }.`
      );

      if (!catalog.length) {
        addMessage(
          "No encuentro tarjetas de destinos válidas en esta página. " +
          "Puedo orientarte con el presupuesto, pero no comparar propuestas."
        );
        updateSummary("No hay destinos de muestra para comparar.");
      } else if (!selected.length) {
        addMessage(
          "Ninguno de nuestros ejemplos entra en ese presupuesto. " +
          "Esto no significa que no existan alternativas reales: " +
          "el catálogo de demostración es muy pequeño."
        );
        updateSummary("No hay coincidencias dentro del catálogo de muestra.");
      } else {
        addMessage(
          matching.length
            ? "Estas propuestas coinciden con tu preferencia y su importe " +
              "base de muestra no supera el presupuesto:"
            : "No hay coincidencias exactas con tu preferencia. Estas " +
              "alternativas encajan por importe base, pero son de otro estilo:"
        );

        selected.forEach(trip => {
          addMessage(
            `${trip.name} · ${trip.duration}\n` +
            `${euros(trip.price)} por persona.\n` +
            `Base de muestra para ${
              plan.people === 1 ? "ti" : "todo el grupo"
            }: ${euros(trip.price * plan.people)}.`,
            false,
            {
              label: `Explorar ${trip.name} →`,
              href: "#destinos",
              destination: trip.name
            }
          );
        });

        updateSummary(
          `${matching.length ? "Para explorar" : "Alternativas de otro estilo"}: ` +
          selected.map(trip => trip.name).join(", ") +
          ". Precios de muestra, no cotizaciones."
        );
      }

      addMessage(
        "Los importes son ficticios y los servicios incluidos no están " +
        "definidos. No he comprobado fechas, disponibilidad ni adecuación " +
        "para menores. Tampoco aplico descuentos de pareja o grupo."
      );

      showOptions([
        ["Cambiar mis respuestas", "reiniciar"],
        ["Organizar presupuesto", "presupuesto"],
        ["Revisar equipaje", "equipaje"]
      ]);
    }

    function answerHelp(topic) {
      if (topic === "presupuesto") {
        addMessage(
          "Divide el presupuesto en transporte, alojamiento, comidas, " +
          "traslados, actividades e imprevistos. Comprueba qué incluye " +
          "cada tarifa antes de sumar.\n" +
          "No puedo calcular un coste real completo con este catálogo.",
          false,
          {
            label: "Consultar guía de presupuesto →",
            href: "#guia-presupuesto"
          }
        );
      } else if (topic === "equipaje") {
        addMessage(
          "Piensa en el clima, la duración y las restricciones del transporte. " +
          "Confirma el peso y las medidas con la aerolínea y lleva contigo " +
          "documentación y objetos de valor.",
          false,
          {
            label: "Consultar guía de equipaje →",
            href: "#guia-equipaje"
          }
        );
      } else if (topic === "servicios") {
        addMessage(
          "Rumbo tiene previstos vuelos, hospedaje, experiencias, traslados, " +
          "seguros y tienda. Todavía no se pueden contratar.",
          false,
          {
            label: "Ver servicios →",
            href: "#servicios"
          }
        );
      } else {
        addMessage(
          "Escribe «planear» para preparar una idea, «reiniciar» para " +
          "cambiar tus respuestas, «presupuesto», «equipaje» o «servicios».\n" +
          "Soy un orientador programado: puedo reconocer respuestas " +
          "sencillas, pero no interpretar cualquier conversación."
        );
      }

      if (!["home", "done"].includes(step)) {
        addMessage(
          "Podemos continuar con la pregunta pendiente usando " +
          "los botones que aparecen debajo."
        );
      }
    }

    function handleMessage(value, displayedValue = value) {
      const raw = String(value).trim().slice(0, 240);
      if (!raw) return;

      const text = normalize(raw);
      addMessage(displayedValue, true);
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
            `Tomaré ${plan.people} ${
              plan.people === 1 ? "persona" : "personas"
            } para esta comparación.`
          );
        }

        updateSummary();
        askQuestion();
        return;
      }

      if (step === "people") {
        const match = text.match(/^(?:somos\s+)?(\d{1,2})(?:\s+personas)?$/);
        const people = match ? Number(match[1]) : 0;

        if (people < 2 || people > 12) {
          addMessage("Indica un número entre 2 y 12. Por ejemplo: 4.");
          return;
        }

        plan.people = people;
        step = "style";
        updateSummary();
        askQuestion();
        return;
      }

      if (step === "style") {
        if (/\b(playa|mar|descanso)\b/.test(text)) {
          plan.style = "playa";
        } else if (/\b(naturaleza|aventura|montana|montanas|senderismo)\b/.test(text)) {
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
        updateSummary();
        askQuestion();
        return;
      }

      if (step === "budget") {
        const match = text.match(/^(\d{1,7})\s*(?:€|euros?|eur)?$/);
        const amount = match ? Number(match[1]) : 0;

        if (amount < 1 || amount > 1000000) {
          addMessage(
            "Escribe el total en euros enteros, sin separadores. " +
            "Por ejemplo: 3000. No convierto otras monedas."
          );
          return;
        }

        plan.budget = amount;
        updateSummary();
        showResults();
        return;
      }

      addMessage(
        "Puedo ayudarte con una primera idea de viaje. " +
        "Pulsa «Preparar mi viaje» o escribe «planear». " +
        "También puedes escribir «ayuda»."
      );
    }

    /* EVENTOS DEL CHAT */

    launcher.addEventListener("click", () => {
      if (panel.hidden) openChat(launcher);
      else closeChat();
    });

    $("#close-chat").addEventListener("click", () => closeChat());

    $("#open-help")?.addEventListener("click", event => {
      openChat(event.currentTarget);
    });

    $("#start-trip-plan")?.addEventListener("click", event => {
      openChat(event.currentTarget);
      if (step === "home") startPlan();
    });

    $("#chat-restart").addEventListener("click", () => {
      startPlan(true);
      input.focus();
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      handleMessage(input.value);
      input.focus();
    });

    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        !panel.hidden &&
        !$("#module-dialog")?.open
      ) {
        closeChat();
      }
    });

    /* ESTADO INICIAL */

    panel.hidden = true;
    setExpanded(false);

    addMessage(
      "¡Hola! Podemos preparar una primera idea según tus gustos, " +
      "compañía y presupuesto.\n" +
      "Puedes usar los botones o escribir respuestas sencillas. " +
      "No necesitas registrarte."
    );

    showOptions([
      ["Preparar mi viaje", "planear"],
      ["Ayuda con presupuesto", "presupuesto"],
      ["Qué llevar", "equipaje"],
      ["Servicios de Rumbo", "servicios"]
    ]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRumbo, { once: true });
  } else {
    initRumbo();
  }
})();