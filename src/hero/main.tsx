import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatedHeading, FadeIn, useReducedMotion } from './animations';
import './hero.css';

type Slide = {
  id: string; title: string; description: string;
  photos: { src: string; alt: string }[];
  cta: { text: string; href: string };
};
type Flight = { economy: number; baseEconomy: number; discountPercent: number };
type Destination = { id: string; country: string };
declare const RUMBO_HERO_CONFIG: { slides: Slide[] };
declare global {
  interface Window {
    RumboLocale?: { language: string; translate: (text: string) => string; formatMoney: (amount: number) => string };
    RumboViajesDatos?: {
      destinations: Destination[];
      flights: (destination: Destination, origin: string, travelers: number) => Flight[];
    };
  }
}

const slides = RUMBO_HERO_CONFIG.slides;
const money = (amount: number) => window.RumboLocale?.formatMoney(amount) ?? `L ${new Intl.NumberFormat('en-US', { useGrouping: true, maximumFractionDigits: 2 }).format(amount)}`;
const t = (text: string, values: Record<string, string | number> = {}) =>
  (window.RumboLocale?.translate(text) ?? text).replace(/\{(\w+)\}/g, (match, key) => String(values[key] ?? match));

function Hero() {
  const reducedMotion = useReducedMotion();
  const [, setLocaleRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setLocaleRevision(value => value + 1);
    window.addEventListener('rumbo:localechange', refresh);
    refresh();
    return () => window.removeEventListener('rumbo:localechange', refresh);
  }, []);
  const [current, setCurrent] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [requestedPhotos, setRequestedPhotos] = useState(() => new Set([0]));
  const readyPhotos = useRef(new Set<number>());
  const pendingSlide = useRef<{ index: number; manual: boolean } | null>(null);
  const section = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const slide = slides[current];
  const destination = window.RumboViajesDatos?.destinations.find(item => item.id === slide.id);
  const flight = destination ? window.RumboViajesDatos?.flights(destination, 'Tegucigalpa', 1)[0] : undefined;
  const available = flight && Number.isFinite(flight.economy);
  const discount = available ? flight.discountPercent : 0;
  const title = t(slide.title);
  const headline = t(discount ? '{destination},\n{discount}% menos.' : '{destination},\nun viaje distinto.', {destination:title,discount});

  function activate(index: number, manual: boolean) {
    pendingSlide.current = null;
    setLoadingPhoto(false);
    setCurrent(index);
    setAnnouncement(manual ? t('{destination}, {index} de {total}', {destination:t(slides[index].title),index:index+1,total:slides.length}) : '');
  }

  function show(index: number, manual = true) {
    const next = (index + slides.length) % slides.length;
    if (next === current || readyPhotos.current.has(next)) { activate(next, manual); return; }
    pendingSlide.current = { index: next, manual };
    setLoadingPhoto(true);
    if (manual) setAnnouncement(t('Cargando la fotografía de {destination}…', {destination:t(slides[next].title)}));
    setRequestedPhotos(previous => new Set([...previous, next]));
  }

  function photoReady(index: number) {
    readyPhotos.current.add(index);
    if (pendingSlide.current?.index === index) activate(index, pendingSlide.current.manual);
  }

  useEffect(() => {
    // Keep the originals at full resolution, but request only the next photo ahead.
    // A slide changes once its image has decoded, avoiding blank frames on slower networks.
    setRequestedPhotos(previous => new Set([...previous, (current + 1) % slides.length]));
  }, [current]);

  useEffect(() => {
    if (reducedMotion || loadingPhoto) return;
    const timer = window.setInterval(() => {
      const hero = section.current;
      if (!hero || document.hidden || document.querySelector('dialog[open]')) return;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      // Allow keyboard users to follow a link without moving it under their focus.
      if (hero.contains(document.activeElement) && document.activeElement?.matches(':focus-visible')) return;
      if (readyPhotos.current.has(current)) show(current + 1, false);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [current, loadingPhoto, reducedMotion]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (!touch.current) return;
    const dx = event.changedTouches[0].clientX - touch.current.x;
    const dy = event.changedTouches[0].clientY - touch.current.y;
    // Vertical gestures keep normal page scrolling; only deliberate horizontal swipes change slides.
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    touch.current = null;
  }

  // Rotación automática con las mismas flechas, teclado y gestos.
  return <section ref={section} className="travel-hero font-sans" translate="no" data-promo-carousel data-destination={slide.id}
    aria-roledescription={t('carrusel')} aria-label={t('Destinos y ofertas de Rumbo')} aria-busy={loadingPhoto} onKeyDown={onKeyDown}
    onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={onTouchEnd}>
    <div className="hero-background" aria-hidden="true">
      {slides.map((item, index) => <img key={item.id} src={requestedPhotos.has(index) ? item.photos[0].src : undefined} alt="" className="hero-photo" data-place={item.id} data-active={index === current}
        fetchPriority={index === 0 ? 'high' : 'low'} decoding="async"
        onLoad={event => { void event.currentTarget.decode().then(() => photoReady(index), () => photoReady(index)); }}
        onError={() => {
          setRequestedPhotos(previous => { const remaining = new Set(previous); remaining.delete(index); return remaining; });
          if (pendingSlide.current?.index === index) {
            pendingSlide.current = null;
            setLoadingPhoto(false);
            setAnnouncement(t('No se pudo cargar {destination}. Volvé a intentar en unos momentos.', {destination:t(item.title)}));
          }
        }} />)}
    </div>
    <article className="hero-content relative px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16 lg:grid lg:grid-cols-2 lg:items-end"
      data-promo-slide aria-roledescription={t('diapositiva')} aria-label={t('{destination}, {index} de {total}',{destination:title,index:current+1,total:slides.length})}>
      <div className="hero-copy">
        <AnimatedHeading key={headline} text={headline} />
        <FadeIn animationKey={slide.id} delay={300} duration={500}><p className="hero-description text-base md:text-lg text-gray-300 mb-5">{t(slide.description)}</p></FadeIn>
        <FadeIn animationKey={slide.id} delay={450} duration={500} className="hero-actions flex flex-wrap gap-4">
          <a href={slide.cta.href} className="hero-primary bg-white text-black px-8 py-3 rounded-lg font-medium">{discount ? t('Aprovechar oferta') : t('Explorar {destination}',{destination:title})}<span aria-hidden="true">↗</span></a>
          <a href="#buscador" className="hero-secondary liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black">{t('Buscar mi viaje')}</a>
        </FadeIn>
      </div>
      <FadeIn animationKey={slide.id} delay={450} duration={500} className="hero-fare-wrap flex items-end justify-start lg:justify-end">
        <div className="hero-fare liquid-glass border border-white/20 px-6 py-3 rounded-xl">
          <div className="hero-fare-top"><span>{t('Vuelo a {destination}',{destination:title})}</span>{discount > 0 && <span className="hero-saving">−{discount}%</span>}</div>
          {available ? <><p className="hero-old-price">{t('Desde')} {discount > 0 && <del>{money(flight.baseEconomy)}</del>}</p>
            <p className="hero-price" data-promo-price={slide.id}>{money(flight.economy)}<span> / {t('persona')}</span></p></> : <p className="hero-price-unavailable">{t('Consultá las tarifas disponibles')}</p>}
          <p className="hero-route">Tegucigalpa <span aria-hidden="true">↗</span> {title} <span>· {t('Solo ida')}</span></p>
          <p className="hero-fare-note">{t('Tarifa de demostración · Hospedaje aparte.')}</p>
        </div>
      </FadeIn>
    </article>
    <div className="hero-bottom px-6 md:px-12 lg:px-16">
        <div className="hero-step" role="group" aria-label={t('Cambiar destino')}>
          <button type="button" className="liquid-glass" data-promo-prev aria-label={t('Destino anterior')} onClick={() => show(current - 1)}>←</button>
          <button type="button" className="liquid-glass" data-promo-next aria-label={t('Destino siguiente')} onClick={() => show(current + 1)}>→</button>
        </div>
    </div>
    <span className="sr-only" data-promo-status aria-live="polite" aria-atomic="true">{announcement}</span>
  </section>;
}

function mount() {
  const root = document.getElementById('home-hero-root');
  if (root) createRoot(root).render(<Hero />);

}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
else mount();
