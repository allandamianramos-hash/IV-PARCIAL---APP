/* Rumbito comparte la misma conversación y presentación en todas las páginas. */
(() => {
  'use strict';
  function init() {
    const $ = selector => document.querySelector(selector);
    if (!$('#chat-launcher')) {
      const mount = document.createElement('div');
      mount.innerHTML = "  <!-- CHAT -->\n  <button\n    class=\"chat-launcher\"\n    id=\"chat-launcher\"\n    type=\"button\"\n    aria-expanded=\"false\"\n    aria-controls=\"help-chat\"\n  >\n    <span class=\"rumbito-avatar\" aria-hidden=\"true\"></span>\n    <span><strong>Rumbito</strong><small>Tu copiloto de viaje</small></span>\n  </button>\n\n  <section\n    class=\"chat-panel\"\n    id=\"help-chat\"\n    role=\"dialog\"\n    aria-modal=\"false\"\n    aria-labelledby=\"chat-title\"\n    hidden\n  >\n    <div class=\"chat-header\">\n      <span class=\"rumbito-avatar\" aria-hidden=\"true\"></span>\n      <div>\n        <h2 id=\"chat-title\">Rumbito</h2>\n        <p>Tu copiloto para descubrir el mundo</p>\n      </div>\n      <button class=\"close-button\" id=\"close-chat\" type=\"button\" aria-label=\"Cerrar chat\">\n        <svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" aria-hidden=\"true\"><path d=\"m6 6 12 12M18 6 6 18\"/></svg>\n      </button>\n    </div>\n\n    <div class=\"chat-progress\">\n      <span id=\"chat-step-label\">Un gran viaje empieza con una buena idea.</span>\n    </div>\n\n    <div\n      class=\"chat-messages\"\n      id=\"chat-messages\"\n      role=\"log\"\n      aria-label=\"Conversación\"\n      aria-live=\"polite\"\n      aria-relevant=\"additions\"\n      tabindex=\"0\"\n    ></div>\n\n\n    <div class=\"chat-options\" id=\"chat-options\" aria-label=\"Sugerencias para conversar\"></div>\n    <form class=\"chat-form\" id=\"chat-form\">\n      <label for=\"chat-input\">Tu respuesta</label>\n      <div class=\"chat-input-row\">\n        <input\n          id=\"chat-input\"\n          type=\"text\"\n          placeholder=\"Cuéntame tu idea de viaje…\"\n          maxlength=\"2000\"\n          autocomplete=\"off\"\n          required\n        >\n        <button class=\"chat-send\" type=\"submit\" aria-label=\"Enviar mensaje\">↑</button>\n      </div>\n    </form>\n\n    <div class=\"chat-tools\">\n      <button type=\"button\" id=\"chat-restart\">Empezar de nuevo</button>\n    </div>\n  </section>\n\n";
      document.body.append(...mount.childNodes);
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setText = (selector, text) => { const element = $(selector); if (element) element.textContent = text; };
    const catalog = window.RumboViajesDatos.destinations.map(trip => ({ ...trip, style: trip.type, price: trip.inspirationBudget }));
    const styles = { playa: 'Playa y descanso', naturaleza: 'Naturaleza y aventura', cultura: 'Cultura y ciudad', all: 'Sin preferencia' };
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
        const href = action.href === "#mi-pase" ? "#servicios" : action.href;
        const onHome = /\/(?:index\.html)?$/.test(location.pathname);
        link.href = href.startsWith('#') && !onHome ? (href === '#servicios' ? 'servicios.html' : 'index.html' + href) : href;
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
      if (event.key === "Escape" && !panel.hidden && !document.querySelector("dialog[open]")) closeChat();
    });
    const launchAvatar = launcher.querySelector('.rumbito-avatar');
    function notice() {
      if (reducedMotion.matches || document.hidden || !panel.hidden || launcher.matches(':hover')) return;
      launchAvatar.classList.add('is-noticing');
    }
    launchAvatar.addEventListener('animationend', event => {
      if (event.animationName === 'rumbito-notice') launchAvatar.classList.remove('is-noticing');
    });
    launcher.addEventListener('pointerenter', () => launchAvatar.classList.remove('is-noticing'));
    let noticeTimer = setInterval(notice, 16000);
    window.addEventListener('pagehide', () => clearInterval(noticeTimer));
    window.addEventListener('pageshow', event => { if (event.persisted) { noticeTimer = setInterval(notice, 16000); notice(); } });
    resetChat();
    if (location.hash === "#hablar-rumbito") openChat(launcher);
    window.addEventListener("hashchange", () => { if (location.hash === "#hablar-rumbito") openChat(launcher); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
