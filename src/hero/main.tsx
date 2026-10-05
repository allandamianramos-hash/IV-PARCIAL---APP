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
    RumboViajesDatos?: {
      destinations: Destination[];
      flights: (destination: Destination, origin: string, travelers: number) => Flight[];
    };
  }
}

const slides = RUMBO_HERO_CONFIG.slides;
const money = (amount: number) => `L ${new Intl.NumberFormat('es-HN', { maximumFractionDigits: 2 }).format(amount)}`;
const countries: Record<string, string> = { venecia: 'Italia', cancun: 'México', osaka: 'Japón', paris: 'Francia' };
const places: Record<string, string> = { venecia: 'Gran Canal', cancun: 'Punta Cancún', osaka: 'Castillo de Osaka', paris: 'Torre Eiffel · El Sena' };

function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [announcement, setAnnouncement] = useState('');
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [requestedPhotos, setRequestedPhotos] = useState(() => new Set([0]));
  const readyPhotos = useRef(new Set<number>());
  const pendingSlide = useRef<{ index: number; manual: boolean } | null>(null);
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const isPlaying = !paused && !reduced && !focused && !hovered && inView && pageVisible && !loadingPhoto;
  const slide = slides[current];
  const destination = window.RumboViajesDatos?.destinations.find(item => item.id === slide.id);
  const flight = destination ? window.RumboViajesDatos?.flights(destination, 'Tegucigalpa', 1)[0] : undefined;
  const available = flight && Number.isFinite(flight.economy);
  const discount = available ? flight.discountPercent : 0;
  const headline = `${slide.title},\n${discount ? `${discount}% menos.` : 'un viaje distinto.'}`;

  function activate(index: number, manual: boolean) {
    pendingSlide.current = null;
    setLoadingPhoto(false);
    setCurrent(index);
    setAnnouncement(manual ? `${slides[index].title}, ${index + 1} de ${slides.length}` : '');
  }

  function show(index: number, manual = true) {
    const next = (index + slides.length) % slides.length;
    if (next === current || readyPhotos.current.has(next)) { activate(next, manual); return; }
    pendingSlide.current = { index: next, manual };
    setLoadingPhoto(true);
    if (manual) setAnnouncement(`Cargando la fotografía de ${slides[next].title}…`);
    setRequestedPhotos(previous => new Set([...previous, next]));
  }

  function photoReady(index: number) {
    readyPhotos.current.add(index);
    if (pendingSlide.current?.index === index) activate(index, pendingSlide.current.manual);
  }

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => show(current + 1, false), 8000);
    return () => clearTimeout(timer);
  }, [current, isPlaying]);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      document.body.classList.toggle('hero-in-view', entry.isIntersecting);
    });
    if (section.current) observer.observe(section.current);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      document.body.classList.remove('hero-in-view');
    };
  }, []);

  useEffect(() => {
    // Keep the originals at full resolution, but request only the next photo ahead.
    // A slide changes once its image has decoded, avoiding blank frames on slower networks.
    setRequestedPhotos(previous => new Set([...previous, (current + 1) % slides.length]));
  }, [current]);

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

  return <section ref={section} className="travel-hero font-sans" data-promo-carousel data-destination={slide.id} data-paused={!isPlaying}
    aria-roledescription="carrusel" aria-label="Destinos y ofertas de Rumbo" aria-busy={loadingPhoto} onKeyDown={onKeyDown}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
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
            setAnnouncement(`No se pudo cargar ${item.title}. Volvé a intentar en unos momentos.`);
          }
        }} />)}
    </div>
    <div className="hero-topline px-6 md:px-12 lg:px-16">
      <span>EL MUNDO TE ESPERA.</span><span>{String(current + 1).padStart(2, '0')} — {countries[slide.id]}</span>
    </div>
    <article className="hero-content relative px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16 lg:grid lg:grid-cols-2 lg:items-end"
      data-promo-slide aria-roledescription="diapositiva" aria-label={`${current + 1} de 4: ${slide.title}`}>
      <div className="hero-copy">
        <FadeIn animationKey={slide.id} delay={200} duration={1000}><p className="hero-eyebrow">{discount ? 'TU PRÓXIMA ESCAPADA, CON DESCUENTO' : 'UN DESTINO PARA SALIR DE LO HABITUAL'}</p></FadeIn>
        <AnimatedHeading key={headline} text={headline} />
        <FadeIn animationKey={slide.id} delay={800} duration={1000}><p className="hero-description text-base md:text-lg text-gray-300 mb-5">{slide.description}</p></FadeIn>
        <FadeIn animationKey={slide.id} delay={1200} duration={1000} className="flex flex-wrap gap-4">
          <a href={slide.cta.href} className="hero-primary bg-white text-black px-8 py-3 rounded-lg font-medium">{discount ? 'Aprovechar oferta' : `Explorar ${slide.title}`}<span aria-hidden="true">↗</span></a>
          <a href="#buscador" className="hero-secondary liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black">Buscar mi viaje</a>
        </FadeIn>
      </div>
      <FadeIn animationKey={slide.id} delay={1400} duration={1000} className="hero-fare-wrap flex items-end justify-start lg:justify-end">
        <div className="hero-fare liquid-glass border border-white/20 px-6 py-3 rounded-xl">
          <div className="hero-fare-top"><span>VUELO A {slide.title.toLocaleUpperCase('es')}</span>{discount > 0 && <span className="hero-saving">−{discount}%</span>}</div>
          {available ? <><p className="hero-old-price">Desde {discount > 0 && <del>{money(flight.baseEconomy)}</del>}</p>
            <p className="hero-price" data-promo-price={slide.id}>{money(flight.economy)}<span> / persona</span></p></> : <p className="hero-price-unavailable">Consultá las tarifas disponibles</p>}
          <p className="hero-route">Tegucigalpa <span aria-hidden="true">↗</span> {slide.title} <span>· Solo ida</span></p>
        </div>
      </FadeIn>
    </article>
    <div className="hero-bottom px-6 md:px-12 lg:px-16" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="hero-controls-row">
        <div className="hero-destinations" role="group" aria-label="Elegir destino">
          {slides.map((item, index) => <button type="button" key={item.id} data-promo-dot aria-current={index === current} aria-label={`Ver ${item.title}`} onClick={() => show(index)}>
            <span className="hero-tab-number">{String(index + 1).padStart(2, '0')}</span>{item.title}
            <span className="hero-tab-progress" aria-hidden="true"><span key={`${index}-${current}-${isPlaying}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} /></span>
          </button>)}
        </div>
        <a className="hero-scroll" href="#buscador">Seguí explorando <span aria-hidden="true">↓</span></a>
        <div className="hero-step"><span data-promo-count>{loadingPhoto ? 'Cargando…' : `${String(current + 1).padStart(2, '0')} / 04`}</span>
          <button type="button" className="liquid-glass" data-promo-pause aria-label={reduced ? 'Rotación automática desactivada' : paused ? 'Reanudar carrusel' : 'Pausar carrusel'} aria-pressed={paused || reduced} onClick={() => {
            if (paused) { setFocused(false); setHovered(false); }
            setPaused(value => !value);
          }} disabled={reduced} title={reduced ? 'Rotación desactivada por tu preferencia de movimiento reducido' : undefined}>{paused || reduced ? '▷' : 'Ⅱ'}</button>
          <button type="button" className="liquid-glass" data-promo-prev aria-label="Destino anterior" onClick={() => show(current - 1)}>←</button>
          <button type="button" className="liquid-glass" data-promo-next aria-label="Destino siguiente" onClick={() => show(current + 1)}>→</button>
        </div>
      </div>
      <div className="hero-footnote"><p>Tarifas de demostración · Hospedaje aparte.</p><span>{slide.title} · {places[slide.id]}</span></div>
    </div>
    <span className="sr-only" data-promo-status aria-live="polite" aria-atomic="true">{announcement}</span>
  </section>;
}

function mount() {
  const root = document.getElementById('home-hero-root');
  if (root) createRoot(root).render(<Hero />);
  // The shared header stays outside React so the existing account/session code remains its owner.
  const menu = document.querySelector<HTMLDetailsElement>('.hero-mobile-menu');
  menu?.addEventListener('click', event => { if ((event.target as HTMLElement).closest('a')) menu.open = false; });
  document.addEventListener('click', event => { if (menu?.open && !menu.contains(event.target as Node)) menu.open = false; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
else mount();
