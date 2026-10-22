import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Global singleton for Lenis smooth scroll
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Initializes Lenis momentum smooth scrolling integrated with GSAP ScrollTrigger.
 * Delivers the ultra-smooth inertia glide seen on Arvind.com and Belcontex.com.
 */
export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  // On touch / mobile devices, native hardware-accelerated 120Hz scrolling is vastly superior.
  // Intercepting touch with JS creates stutters, layout freezes, and skips sections.
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches || 'ontouchstart' in window;
  if (isTouch) {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }

  if (lenisInstance) {
    lenisInstance.destroy();
  }

  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    syncTouch: false,
    touchMultiplier: 0,
    infinite: false,
  });

  lenisInstance = lenis;

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(500, 33);

  return () => {
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    lenisInstance = null;
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}

/**
 * Scroll-triggered reveal animations.
 * Uses positive bottom rootMargin so elements fade in smoothly before they reach eye level.
 */
export function useScrollReveal<T extends HTMLElement>(
  threshold = 0.05,
  rootMargin = '0px 0px 40px 0px'
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      const allReveals = el.querySelectorAll('.reveal, .reveal-line, .img-reveal, .reveal-stagger');
      allReveals.forEach((c) => c.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const revealElements = el.querySelectorAll('.reveal, .reveal-line, .img-reveal, .reveal-stagger');
    revealElements.forEach((child) => observer.observe(child));

    if (
      el.classList.contains('reveal') ||
      el.classList.contains('reveal-line') ||
      el.classList.contains('img-reveal') ||
      el.classList.contains('reveal-stagger')
    ) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * Hook for animated numerical counters with non-linear easing (Belcon Tex style).
 */
export function useCountUp(
  target: number,
  duration = 1800,
  suffix = ''
) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCount(el, target, duration, suffix);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, suffix]);

  return ref;
}

function animateCount(
  el: HTMLElement,
  target: number,
  duration: number,
  suffix: string
) {
  const start = performance.now();
  const isInteger = Number.isInteger(target);

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease Out Expo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = eased * target;

    el.textContent = (isInteger ? Math.round(current) : current.toFixed(1)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Hook for smooth anchor scrolling compatible with Lenis.
 */
export function useSmoothScroll() {
  return useCallback((href: string) => {
    const lenis = getLenis();
    if (lenis) {
      lenis.start();
      lenis.scrollTo(href, { offset: -70, duration: 1.2 });
    } else {
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, []);
}


/**
 * Hook for smooth scroll-driven parallax transform fallback.
 */
export function useParallax<T extends HTMLElement>(speed = 0.2, maxOffset = 150) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let rafId: number;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom > -50 && rect.top < vh + 50) {
        const centerOffset = rect.top + rect.height / 2 - vh / 2;
        let delta = centerOffset * speed;
        if (maxOffset) {
          delta = Math.max(-maxOffset, Math.min(maxOffset, delta));
        }
        el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed, maxOffset]);

  return ref;
}


/**
 * 3D tilt and specular glare for a container holding multiple cards (.fabric-card, .application-card).
 */
export function useCardTiltGrid<T extends HTMLElement>(cardSelector = '.fabric-card', intensity = 8) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const cards = container.querySelectorAll<HTMLElement>(cardSelector);
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        // Set CSS custom properties for specular shine
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      };

      const onMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);

      cleanups.push(() => {
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [cardSelector, intensity]);

  return containerRef;
}

