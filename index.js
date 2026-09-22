/* ==================================================
   RUMBO / INTERACCIONES DEL PROTOTIPO
   Sin backend, autenticación, pagos ni persistencia.
   ================================================== */

"use strict";

/* AÑO DEL FOOTER */

document.getElementById("year").textContent = new Date().getFullYear();

/* BUSCADOR LOCAL DE DESTINOS */

const searchForm = document.getElementById("travel-search");
const destinationInput = document.getElementById("destination");
const styleInput = document.getElementById("travel-style");
const budgetInput = document.getElementById("budget");

const destinationCards = [
  ...document.querySelectorAll(".destination-card")
];

const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filterDestinations() {
  const query = normalizeText(destinationInput.value);
  const selectedStyle = styleInput.value;
  const selectedBudget = budgetInput.value;

  let visibleCount = 0;

  destinationCards.forEach(card => {
    const matchesDestination =
      normalizeText(card.dataset.search).includes(query);

    const matchesStyle =
      selectedStyle === "all" ||
      card.dataset.style === selectedStyle;

    const matchesBudget =
      selectedBudget === "all" ||
      Number(card.dataset.price) <= Number(selectedBudget);

    const visible =
      matchesDestination && matchesStyle && matchesBudget;

    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  resultCount.textContent = visibleCount === 1
    ? "1 destino para descubrir"
    : `${visibleCount} destinos para descubrir`;

  emptyState.hidden = visibleCount !== 0;
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  filterDestinations();

  document.getElementById("destinos").scrollIntoView({
    block: "start"
  });
});

document.getElementById("reset-filters").addEventListener("click", () => {
  searchForm.reset();
  filterDestinations();
});

/* MODALES DE LOS MÓDULOS PENDIENTES
   Sustituir estos eventos por rutas o componentes reales. */

const moduleDialog = document.getElementById("module-dialog");
const moduleTitle = document.getElementById("module-title");
const moduleDescription = document.getElementById("module-description");

const modules = {
  login: {
    title: "Tu espacio en Rumbo",
    description:
      "Aquí se integrará el inicio de sesión para consultar reservas, " +
      "guardar destinos y administrar tus datos. En este prototipo no " +
      "se solicitan credenciales ni se crean cuentas."
  },

  cart: {
    title: "Tu carrito de viaje",
    description:
      "Este espacio está reservado para el futuro carrito. El equipo " +
      "podrá conectar aquí los accesorios y los servicios que admitan " +
      "compra. Por ahora no hay artículos añadidos ni pagos disponibles."
  },

  flights: {
    title: "El siguiente paso: despegar",
    description:
      "Aquí se integrará la búsqueda de vuelos por origen, destino, " +
      "fechas y pasajeros. Esta portada presenta el acceso al módulo; " +
      "todavía no consulta tarifas ni disponibilidad."
  },

  stays: {
    title: "Encuentra dónde quedarte",
    description:
      "Este apartado conectará con la búsqueda de hospedajes y sus " +
      "filtros de fechas, huéspedes, ubicación y presupuesto. No hay " +
      "alojamientos disponibles para reservar en esta demostración."
  },

  luggage: {
    title: "Equipaje y mochilas",
    description:
      "Esta categoría está preparada para el catálogo de maletas, " +
      "mochilas y organizadores. Las fichas de producto, existencias " +
      "y conexión con el carrito se integrarán posteriormente."
  },

  glasses: {
    title: "Pequeños detalles, grandes viajes",
    description:
      "Aquí se presentará el catálogo de lentes y accesorios. " +
      "Las imágenes actuales son ilustrativas: todavía no hay " +
      "productos, precios ni existencias confirmadas."
  }
};

function openModule(title, description) {
  moduleTitle.textContent = title;
  moduleDescription.textContent = description;
  moduleDialog.showModal();
}

document.querySelectorAll("[data-module]").forEach(button => {
  button.addEventListener("click", () => {
    const module = modules[button.dataset.module];

    if (module) {
      openModule(module.title, module.description);
    }
  });
});

document.querySelectorAll("[data-trip]").forEach(button => {
  button.addEventListener("click", () => {
    openModule(
      `Tu próxima historia en ${button.dataset.trip}`,
      "Esta propuesta forma parte del catálogo ficticio de Rumbo. " +
      "La futura ficha del viaje mostrará itinerario, servicios incluidos, " +
      "fechas y condiciones. El precio de muestra no es una oferta " +
      "contratable y no se ha realizado ninguna reserva."
    );
  });
});

/* GUÍAS: abrir el desplegable cuando se navega a su enlace */

function openLinkedGuide() {
  const id = window.location.hash.slice(1);

  if (!id.startsWith("guia-")) return;

  const guide = document.getElementById(id);

  if (guide instanceof HTMLDetailsElement) {
    guide.open = true;
  }
}

document.querySelectorAll('a[href^="#guia-"]').forEach(link => {
  link.addEventListener("click", () => {
    const guide = document.getElementById(
      link.getAttribute("href").slice(1)
    );

    if (guide instanceof HTMLDetailsElement) {
      guide.open = true;
    }
  });
});

window.addEventListener("hashchange", openLinkedGuide);
openLinkedGuide();

/* CHAT DE ORIENTACIÓN
   Función: preguntas frecuentes y navegación asistida.
   No interpreta texto libre ni sustituye atención real. */

const chatLauncher = document.getElementById("chat-launcher");
const chatPanel = document.getElementById("help-chat");
const closeChatButton = document.getElementById("close-chat");
const chatMessages = document.getElementById("chat-messages");

let chatOpener = chatLauncher;

const helpAnswers = {
  destinations: {
    text:
      "¿Buscas descanso, naturaleza o cultura? En Destinos puedes " +
      "explorar tres propuestas de muestra. Usa el filtro de tipo de " +
      "viaje para encontrar la que más se acerque a tu idea.",
    link: "#destinos",
    label: "Explorar destinos →"
  },

  budget: {
    text:
      "En el buscador puedes fijar un presupuesto máximo por persona. " +
      "Ten presente que los precios son ficticios y los servicios incluidos " +
      "aún no están definidos. Para un viaje real, considera también " +
      "comidas, traslados, actividades e imprevistos.",
    link: "#search-title",
    label: "Ir al buscador →"
  },

  luggage: {
    text:
      "Empieza por el clima, la duración del viaje y las restricciones " +
      "de tu transporte. Preparamos una guía breve para ayudarte a " +
      "organizar lo esencial sin llenar de más tu maleta.",
    link: "#guia-equipaje",
    label: "Leer la guía de equipaje →"
  },

  booking: {
    text:
      "Todavía no. Rumbo es un prototipo de diseño: no procesa " +
      "reservas, pagos ni solicitudes de atención. Los accesos a " +
      "vuelos, hospedajes, cuenta y carrito señalan dónde se " +
      "integrarán esas funciones."
  }
};

function openChat(opener = chatLauncher) {
  chatOpener = opener;
  chatPanel.hidden = false;
  chatLauncher.setAttribute("aria-expanded", "true");
  closeChatButton.focus();
}

function closeChat(restoreFocus = true) {
  chatPanel.hidden = true;
  chatLauncher.setAttribute("aria-expanded", "false");

  if (restoreFocus) {
    chatOpener.focus();
  }
}

chatLauncher.addEventListener("click", () => {
  if (chatPanel.hidden) {
    openChat(chatLauncher);
  } else {
    closeChat();
  }
});

document.getElementById("open-help").addEventListener("click", event => {
  openChat(event.currentTarget);
});

closeChatButton.addEventListener("click", () => closeChat());

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    !chatPanel.hidden &&
    !moduleDialog.open
  ) {
    closeChat();
  }
});

function addChatMessage(text, isUser = false, answer = null) {
  const message = document.createElement("p");

  message.className = isUser
    ? "chat-message user-message"
    : "chat-message";

  message.textContent = text;

  if (answer?.link) {
    const link = document.createElement("a");

    link.href = answer.link;
    link.textContent = answer.label;

    link.addEventListener("click", () => {
      const target = document.getElementById(answer.link.slice(1));

      if (target instanceof HTMLDetailsElement) {
        target.open = true;
      }

      closeChat(false);

      // Mantiene el foco accesible en el destino de la navegación.
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

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.querySelectorAll("[data-help]").forEach(button => {
  button.addEventListener("click", () => {
    const answer = helpAnswers[button.dataset.help];

    if (!answer) return;

    addChatMessage(button.textContent.trim(), true);
    addChatMessage(answer.text, false, answer);
  });
});