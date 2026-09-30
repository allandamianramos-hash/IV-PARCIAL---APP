/* Campañas del inicio. Los importes proceden del mismo catálogo que el resumen. */
(() => {
  'use strict';
  const root = document.querySelector('[data-promo-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-promo-slide]')];
  const dots = [...root.querySelectorAll('[data-promo-dot]')];
  const pause = root.querySelector('[data-promo-pause]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const money = n => 'L ' + n.toLocaleString('es-HN', { maximumFractionDigits: 2 });
  root.querySelectorAll('[data-promo-price]').forEach(el => {
    const d = window.RumboViajesDatos.destinations.find(d => d.id === el.dataset.promoPrice);
    if (!d) return;
    const f = window.RumboViajesDatos.flights(d, 'Tegucigalpa')[0];
    el.innerHTML = `<span class="campaign-price-line"><del>${money(f.baseEconomy)}</del> <strong>${money(f.economy)}</strong></span><small>por persona · ida desde Tegucigalpa</small>`;
  });
  let current = 0, timer, paused = motion.matches, hover = false, focused = false;
  function schedule() {
    clearTimeout(timer);
    const playing = !paused && !hover && !focused && !document.hidden;
    root.dataset.playing = String(playing);
    pause.textContent = paused ? '▶ Reproducir' : 'Ⅱ Pausar';
    pause.setAttribute('aria-label', paused ? 'Reproducir promociones automáticamente' : 'Pausar promociones');
    if (playing) timer = setTimeout(() => show(current + 1), 5000);
  }
  function show(index, manual = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    // Prepara la siguiente imagen mientras se lee la actual.
    slides[(current + 1) % slides.length].querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    root.querySelector('[data-promo-count]').textContent = `0${current + 1} / 0${slides.length}`;
    if (manual) root.querySelector('[data-promo-status]').textContent = `Promoción ${current + 1} de ${slides.length}: ${slides[current].dataset.title}`;
    schedule();
  }
  root.querySelector('[data-promo-prev]').addEventListener('click', () => show(current - 1, true));
  root.querySelector('[data-promo-next]').addEventListener('click', () => show(current + 1, true));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  root.addEventListener('mouseenter', () => { hover = true; schedule(); });
  root.addEventListener('mouseleave', () => { hover = false; schedule(); });
  root.addEventListener('focusin', () => { focused = true; schedule(); });
  root.addEventListener('focusout', event => { if (!root.contains(event.relatedTarget)) { focused = false; schedule(); } });
  root.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  let startX = null;
  root.addEventListener('touchstart', event => { startX = event.touches[0]?.clientX; }, { passive: true });
  root.addEventListener('touchend', event => {
    const delta = (event.changedTouches[0]?.clientX ?? startX) - startX;
    if (startX !== null && Math.abs(delta) > 65) show(current + (delta < 0 ? 1 : -1), true);
    startX = null;
  }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { paused = motion.matches; schedule(); });
  show(0);
})();
