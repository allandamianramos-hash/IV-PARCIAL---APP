import { useEffect, useState, type ReactNode } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function FadeIn({ children, delay = 0, duration = 1000, className = '', animationKey = 'initial' }: {
  children: ReactNode; delay?: number; duration?: number; className?: string; animationKey?: string;
}) {
  const reduced = useReducedMotion();
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const visible = visibleKey === animationKey;
  useEffect(() => {
    const timer = window.setTimeout(() => setVisibleKey(animationKey), reduced ? 0 : delay);
    return () => clearTimeout(timer);
  }, [delay, reduced, animationKey]);
  return <div className={`transition-opacity ${className}`} style={{ opacity: visible || reduced ? 1 : 0, transitionDuration: `${reduced || !visible ? 0 : duration}ms` }}>{children}</div>;
}

export function AnimatedHeading({ text, delay = 200, duration = 500 }: {
  text: string; delay?: number; duration?: number;
}) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), reduced ? 0 : delay);
    return () => clearTimeout(timer);
  }, [delay, reduced]);
  return <h1 className="hero-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4" style={{ letterSpacing: '-0.04em' }} aria-label={text.replace('\n', ' ')}>
    {text.split('\n').map((line, lineIndex) => <span className="hero-heading-line" aria-hidden="true" key={lineIndex} style={{
      opacity: visible || reduced ? 1 : 0,
      transform: visible || reduced ? 'translateY(0)' : 'translateY(8px)',
      transitionProperty: 'opacity, transform',
      transitionDuration: `${reduced ? 0 : duration}ms`,
      transitionDelay: `${reduced ? 0 : lineIndex * 100}ms`,
    }}>{line}</span>)}
  </h1>;
}
