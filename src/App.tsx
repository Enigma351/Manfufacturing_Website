import { useState, useEffect, useCallback, useRef, FormEvent, memo } from 'react';
import { siteData } from './data/content';
import {
  useScrollReveal,
  useSmoothScroll,
  useParallax,
  useCountUp,
  initSmoothScroll,
  useCardTiltGrid,
  getLenis,
} from './hooks/useAnimations';
import {
  FabricModal,
  ApplicationModal,
  ProcessModal,
  FeatureModal,
  SwatchTrayDrawer,
  FabricItem,
  ApplicationItem,
  ProcessStepItem,
  ManufacturingFeatureItem,
  LeadData,
} from './components/InteractiveModals';



// ── Image maps for fabric collections ──────────────────────────────
const shirtingImages: Record<string, string> = {
  'Premium Poplin': '/images/fabric_poplin.webp',
  'Satin Shirting': '/images/fabric_satin.webp',
  'Oxford Weave': '/images/fabric_oxford.webp',
  'Dobby White': '/images/fabric_dobby.webp',
  'Stretch Cotton': '/images/fabric_stretch.webp',
  'Linen Shirting': '/images/fabric_linen.webp',
};

const suitingImages: Record<string, string> = {
  'PV Suiting': '/images/fabric_pv_suiting.webp',
  'TR Suiting': '/images/fabric_tr_suiting.webp',
  'Cotton Suiting': '/images/fabric_cotton_suiting.webp',
  'Linen Suiting': '/images/fabric_linen_suiting.webp',
  'Stretch Suiting': '/images/fabric_stretch_suiting.webp',
  'Textured Suiting': '/images/fabric_dobby.webp', // reuse dobby image
};

const applicationImages: Record<string, string> = {
  'Fashion & Brands': '/images/fabric_satin.webp',
  'Corporate Uniforms': '/images/fabric_pv_suiting.webp',
  'Institutional Supply': '/images/fabric_poplin.webp',
  'Export & Manufacturing': '/images/philosophy_fabric.webp',
};

// ── SVG Icons ──────────────────────────────────────────────────────
const ArrowIcon = memo(function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
});

const FeatureIcon = memo(function FeatureIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    yarn: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="14" />
        <path d="M10 14c6 8 14 8 20 0" />
        <path d="M10 26c6-8 14-8 20 0" />
        <line x1="20" y1="6" x2="20" y2="34" />
      </svg>
    ),
    weave: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12h24M8 20h24M8 28h24" />
        <path d="M14 8v24M20 8v24M26 8v24" />
      </svg>
    ),
    finish: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 32L20 8l12 24" />
        <path d="M12 24h16" />
        <circle cx="20" cy="18" r="3" />
      </svg>
    ),
    quality: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="14" />
        <path d="M14 20l4 4 8-8" />
      </svg>
    ),
    custom: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="8" width="24" height="24" rx="2" />
        <path d="M16 14v12M24 14v12M12 20h16" />
      </svg>
    ),
    delivery: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="12" width="18" height="16" rx="1" />
        <path d="M24 18h6l4 6v4h-10" />
        <circle cx="14" cy="30" r="3" />
        <circle cx="28" cy="30" r="3" />
      </svg>
    ),
  };
  return <div className="feature__icon">{icons[icon] || icons.yarn}</div>;
});



// ── Helper: Parse markdown-style *italic* in headings ──────────────
function renderHeading(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  HEADER                                                        ║
// ╚══════════════════════════════════════════════════════════════════╝
const Header = memo(function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const smoothScroll = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 60;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = useCallback(
    (href: string) => {
      setMobileOpen(false);
      smoothScroll(href);
    },
    [smoothScroll]
  );

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="header">
        <div className="container header__inner">
          <a href="#" className="header__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            {siteData.brand.name}
            <span>{siteData.brand.tagline}</span>
          </a>

          <nav className="header__nav">
            <div className="header__nav-links">
              {siteData.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="header__nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.href);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="header__right">
            <div className="header__actions">
              <a
                href={`tel:${siteData.inquiry.contact.phoneRaw}`}
                className="header__phone-link"
                title="Direct Trade Hotline"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="header__phone-icon">
                  <path d="M5 3h4l2 4-2.5 2a11 11 0 005 5L16 12l4 2v4a2 2 0 01-2 2C9 19 1 11 1 3a2 2 0 012-2z" />
                </svg>
                <span>{siteData.inquiry.contact.phone}</span>
              </a>
              <a
                href="#inquiry"
                className="header__cta"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('#inquiry');
                }}
              >
                Inquire
              </a>
            </div>

            <a
              href={`tel:${siteData.inquiry.contact.phoneRaw}`}
              className="header__mobile-phone-btn"
              title="Call Direct Hotline"
              aria-label={`Call ${siteData.inquiry.contact.phone}`}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 3h4l2 4-2.5 2a11 11 0 005 5L16 12l4 2v4a2 2 0 01-2 2C9 19 1 11 1 3a2 2 0 012-2z" />
              </svg>
            </a>

            <button
              className={`header__menu-toggle ${mobileOpen ? 'is-open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${mobileOpen ? 'is-open' : ''}`}>
        <div className="mobile-nav__menu">
          {siteData.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="mobile-nav__link"
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="mobile-nav__contact">
          <div className="mobile-nav__contact-tag">Direct Hotline & Billing Office</div>
          <a href={`tel:${siteData.inquiry.contact.phoneRaw}`} className="mobile-nav__contact-phone">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 3h4l2 4-2.5 2a11 11 0 005 5L16 12l4 2v4a2 2 0 01-2 2C9 19 1 11 1 3a2 2 0 012-2z" />
            </svg>
            <span>{siteData.inquiry.contact.phone}</span>
          </a>
          <div className="mobile-nav__contact-address">
            {siteData.inquiry.contact.billingAddress.premises}, {siteData.inquiry.contact.billingAddress.city}
          </div>
          <a
            href={siteData.inquiry.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav__wa-btn"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
});


// ╔══════════════════════════════════════════════════════════════════╗
// ║  HERO (Multi-Slide Luxury Textile Carousel — Belcon / Arvind)   ║
// ╚══════════════════════════════════════════════════════════════════╝
const heroSlides = [
  {
    tagline: 'Bhiwandi Craftsmanship & Pure White Excellence',
    title: 'The Art of Absolute White',
    emphasis: 'Mastering Pure Textiles Since 2010',
    description: 'Precision engineered shirting & suiting fabrics woven exclusively in pristine white. Sourced from Bhiwandi and crafted to world-class standards.',
    image: '/images/hero_fabric.webp',
  },
  {
    tagline: '500+ Specialized Weave Formulations in Pure White',
    title: 'Engineered Luxury Weaves',
    emphasis: 'Poplins, Satins, Dobbies & Twills',
    description: 'Silky micro-satins with luminous pearl luster, structured Oxfords, and intricate geometric dobby textures for premium apparel and uniforms.',
    image: '/images/fabric_satin.webp',
  },
  {
    tagline: 'Trusted Textile Partner for India’s Premier Labels',
    title: 'Uncompromising Quality & Scale',
    emphasis: 'From Loom to Global Garments',
    description: 'Supplying distinguished fashion designers, corporate uniforms, and international exports with 100% rigorous fabric inspection and punctual delivery.',
    image: '/images/philosophy_fabric.webp',
  },
];

const Hero = memo(function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const smoothScroll = useSmoothScroll();
  const heroParallaxRef = useParallax<HTMLDivElement>(0.18, 90);

  // Auto-advance every 6.5s unless paused/hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (deltaX > 45) {
      prevSlide();
    } else if (deltaX < -45) {
      nextSlide();
    }
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <section
      className="hero"
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero__bg" ref={heroParallaxRef}>
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.title}
            className={`hero__bg-slide ${idx === currentSlide ? 'is-active' : ''}`}
            aria-hidden={idx !== currentSlide}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="hero__bg-image"
              decoding="async"
              {...({ fetchpriority: idx === 0 ? "high" : "auto" } as React.ImgHTMLAttributes<HTMLImageElement>)}
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
        <div className="hero__bg-overlay" />
      </div>

      <div className="container hero__content" key={currentSlide}>
        <div className="reveal-line is-visible">
          <span className="reveal-line-inner section-label">
            {activeSlide.tagline}
          </span>
        </div>

        <h1 className="hero__title hero__title--animated">
          {activeSlide.title}
          <br />
          <em>{activeSlide.emphasis}</em>
        </h1>

        <p className="hero__subtitle hero__subtitle--animated">
          {activeSlide.description}
        </p>

        <div className="hero__cta-row hero__cta-row--animated">
          <a
            href="#collections"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              smoothScroll('#collections');
            }}
          >
            Explore Collections
            <ArrowIcon />
          </a>
          <a
            href="#inquiry"
            className="btn-outline"
            onClick={(e) => {
              e.preventDefault();
              smoothScroll('#inquiry');
            }}
          >
            Request Swatches
          </a>
        </div>
      </div>

      {/* Hero Carousel Navigation Controls (Belcon Tex style) */}
      <div className="hero__controls">
        <div className="hero__counter">
          <span className="hero__counter-active">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="hero__counter-divider">/</span>
          <span className="hero__counter-total">
            {String(heroSlides.length).padStart(2, '0')}
          </span>
        </div>

        <div className="hero__bars">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`hero__bar-btn ${idx === currentSlide ? 'is-active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
            >
              <span className="hero__bar-fill" />
            </button>
          ))}
        </div>

        <div className="hero__arrows">
          <button
            className="hero__arrow-btn"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button
            className="hero__arrow-btn"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>

      <a
        href="#philosophy"
        className="hero__scroll-hint"
        onClick={(e) => {
          e.preventDefault();
          smoothScroll('#philosophy');
        }}
        aria-label="Scroll to Philosophy section"
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </a>
    </section>
  );
});



// ── Ticker / Marquee Strip ──────────────────────────────────────────
const tickerItems = [
  '100% Focused on White',
  '500+ Fabric Varieties',
  'Precision Loom Weaving',
  'Custom Weave Development',
  'Strict Quality Control',
  'Export Grade Standards',
  'Bhiwandi Textile Craftsmanship',
];

const Ticker = memo(function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <div key={i} className="ticker__item">
            <span>{item}</span>
            <span className="ticker__dot" />
          </div>
        ))}
      </div>
    </div>
  );
});

// ╔══════════════════════════════════════════════════════════════════╗
// ║  PHILOSOPHY                                                    ║
// ╚══════════════════════════════════════════════════════════════════╝
const Philosophy = memo(function Philosophy() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const accentParallaxRef = useParallax<HTMLDivElement>(-0.16, 80);
  const watermarkParallaxRef = useParallax<HTMLDivElement>(0.32, 140);
  const imgParallaxRef = useParallax<HTMLImageElement>(0.08, 40);

  return (
    <section className="philosophy" id="philosophy" ref={sectionRef}>
      <div ref={watermarkParallaxRef} className="philosophy__watermark-bg" aria-hidden="true">
        MGT
      </div>
      <div className="container">
        <div className="philosophy__grid">
          <div className="philosophy__text">
            <div className="section-label reveal">{siteData.philosophy.label}</div>
            <h2 className="reveal">{renderHeading(siteData.philosophy.heading)}</h2>
            {siteData.philosophy.paragraphs.map((p, i) => (
              <p key={i} className="reveal" style={{ '--stagger-index': i + 1 } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>

          <div className="philosophy__visual">
            <div className="img-reveal">
              <img
                ref={imgParallaxRef}
                src="/images/philosophy_fabric.webp"
                alt="White fabric rolls in textile workshop"
                className="philosophy__img-main"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div ref={accentParallaxRef} className="philosophy__accent-text" aria-hidden="true">
              White
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// ── Divider Band (Charcoal) ─────────────────────────────────────────
const DividerBand = memo(function DividerBand() {
  const smoothScroll = useSmoothScroll();

  return (
    <div className="divider-band">
      <div className="container divider-band__inner">
        <div className="divider-band__text">
          Precision crafted white fabrics for <em>every silhouette</em>.
        </div>
        <a
          href="#inquiry"
          className="divider-band__cta"
          onClick={(e) => {
            e.preventDefault();
            smoothScroll('#inquiry');
          }}
        >
          Request Swatches &rarr;
        </a>
      </div>
    </div>
  );
});


// ╔══════════════════════════════════════════════════════════════════╗
// ║  COLLECTIONS                                                   ║
// ╚══════════════════════════════════════════════════════════════════╝
function Collections({
  onSelectFabric,
}: {
  onSelectFabric: (fabric: FabricItem, category: 'shirting' | 'suiting', image: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'shirting' | 'suiting'>('shirting');
  const [isTabSwitched, setIsTabSwitched] = useState(false);
  const sectionRef = useScrollReveal<HTMLElement>();
  const collectionsGridRef = useCardTiltGrid<HTMLDivElement>('.fabric-card', 7);

  const activeCategory = siteData.collections.categories.find(
    (c) => c.id === activeTab
  )!;

  const imageMap = activeTab === 'shirting' ? shirtingImages : suitingImages;

  return (
    <section className="collections" id="collections" ref={sectionRef}>
      <div className="container">
        <div className="collections__header">
          <div className="section-label reveal">{siteData.collections.label}</div>
          <h2 className="reveal">{renderHeading(siteData.collections.heading)}</h2>
          <div className="collections__tabs reveal">
            {siteData.collections.categories.map((cat) => (
              <button
                key={cat.id}
                className={`collections__tab ${activeTab === cat.id ? 'is-active' : ''}`}
                onClick={() => {
                  if (activeTab !== cat.id) {
                    setActiveTab(cat.id as 'shirting' | 'suiting');
                    setIsTabSwitched(true);
                    // Reset after tab-switch animation completes so future reveals use scroll stagger
                    setTimeout(() => setIsTabSwitched(false), 450);
                  }
                }}
                id={`tab-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="collections__grid" ref={collectionsGridRef} key={activeTab}>
          {activeCategory.fabrics.map((fabric, i) => {
            const img = imageMap[fabric.name] || '/images/fabric_poplin.webp';
            return (
              <div
                key={fabric.name}
                className={`fabric-card fabric-card--numbered ${isTabSwitched ? 'tab-visible' : 'reveal'}`}
                style={isTabSwitched ? { animationDelay: `${i * 0.04}s`, cursor: 'pointer' } : ({ '--stagger-index': i, cursor: 'pointer' } as React.CSSProperties)}
                id={`fabric-${fabric.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectFabric(fabric as FabricItem, activeTab, img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectFabric(fabric as FabricItem, activeTab, img);
                  }
                }}
                title={`Click to view ${fabric.name} specifications & request swatches`}
              >
                <div className="fabric-card__seq">{String(i + 1).padStart(2, '0')}</div>
                <div className="fabric-card__image">
                  <img
                    src={img}
                    alt={`${fabric.name} — ${fabric.desc}`}
                    loading="lazy"
                  />
                  <div className="fabric-card__image-overlay" />
                  <div className="fabric-card__weave-tag">
                    <span>{fabric.weave}</span>
                  </div>
                </div>
                <div className="fabric-card__info">
                  <div className="fabric-card__header-row">
                    <h3 className="fabric-card__name">{fabric.name}</h3>
                    <span className="fabric-card__arrow-btn" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </div>
                  <p className="fabric-card__desc">{fabric.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ╔══════════════════════════════════════════════════════════════════╗
// ║  MANUFACTURING                                                 ║
// ╚══════════════════════════════════════════════════════════════════╝
const statIcons: Record<string, JSX.Element> = {
  'Fabric varieties in white': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="stat-card__svg">
      <rect x="16" y="8" width="16" height="32" rx="4" />
      <line x1="16" y1="16" x2="32" y2="16" />
      <line x1="16" y1="24" x2="32" y2="24" />
      <line x1="16" y1="32" x2="32" y2="32" />
      <path d="M32 20c6 0 8 6 4 10s-10 4-10 10" />
      <circle cx="26" cy="40" r="2" fill="currentColor" />
    </svg>
  ),
  'Quality inspected output': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="stat-card__svg">
      <rect x="10" y="10" width="28" height="28" rx="2" />
      <line x1="10" y1="19" x2="38" y2="19" />
      <line x1="10" y1="28" x2="38" y2="28" />
      <line x1="19" y1="10" x2="19" y2="38" />
      <line x1="28" y1="10" x2="28" y2="38" />
      <circle cx="34" cy="34" r="8" fill="#1A1816" stroke="#c4a97d" strokeWidth="1.8" />
      <path d="M30 34l3 3 5-5" stroke="#c4a97d" strokeWidth="1.8" />
    </svg>
  ),
  'Years of textile expertise': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="stat-card__svg">
      <path d="M24 6L42 24L24 42L6 24Z" />
      <line x1="15" y1="15" x2="33" y2="33" />
      <line x1="33" y1="15" x2="15" y2="33" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  ),
  'Active business partners': (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="stat-card__svg">
      <rect x="8" y="10" width="32" height="8" rx="1" />
      <line x1="12" y1="18" x2="12" y2="38" />
      <line x1="16" y1="18" x2="16" y2="38" />
      <line x1="20" y1="18" x2="20" y2="38" />
      <line x1="24" y1="18" x2="24" y2="38" />
      <line x1="28" y1="18" x2="28" y2="38" />
      <line x1="32" y1="18" x2="32" y2="38" />
      <line x1="36" y1="18" x2="36" y2="38" />
    </svg>
  ),
};

const StatNumber = memo(function StatNumber({ stat }: { stat: { number: string; label: string } }) {
  const match = stat.number.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numericVal = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const countRef = useCountUp(numericVal, 1800, '');

  return (
    <div className="stat-card reveal">
      <div className="stat-card__icon-wrap">
        {statIcons[stat.label] || statIcons['Fabric varieties in white']}
      </div>
      <div className="stat-card__number">
        <span ref={countRef}>0</span>
        {suffix && <span className="stat-card__suffix">{suffix}</span>}
      </div>
      <div className="stat-card__label">{stat.label}</div>
    </div>
  );
});

const Manufacturing = memo(function Manufacturing({
  onSelectFeature,
}: {
  onSelectFeature: (feature: ManufacturingFeatureItem) => void;
}) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const watermarkRef = useParallax<HTMLDivElement>(-0.2, 100);

  return (
    <section className="manufacturing" id="manufacturing" ref={sectionRef}>
      <div ref={watermarkRef} className="manufacturing__watermark-bg" aria-hidden="true">
        PURE
      </div>
      <div className="container">
        <div className="manufacturing__header">
          <div className="section-label reveal">{siteData.manufacturing.label}</div>
          <h2 className="reveal">{renderHeading(siteData.manufacturing.heading)}</h2>
          <p className="reveal">{siteData.manufacturing.description}</p>
        </div>

        <div className="manufacturing__stats reveal-stagger">
          {siteData.manufacturing.stats.map((stat) => (
            <StatNumber key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="manufacturing__features reveal-stagger">
          {siteData.manufacturing.features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature reveal"
              style={{ '--stagger-index': i, cursor: 'pointer' } as React.CSSProperties}
              id={`feature-${feature.icon}`}
              onClick={() => onSelectFeature(feature as ManufacturingFeatureItem)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectFeature(feature as ManufacturingFeatureItem);
                }
              }}
              title={`Click to view ${feature.title} engineering details`}
            >
              <FeatureIcon icon={feature.icon} />
              <h3 className="feature__title">{feature.title}</h3>
              <p className="feature__desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ╔══════════════════════════════════════════════════════════════════╗
// ║  PROCESS (Crafting Process — Indian Origin Mill Stages)        ║
// ╚══════════════════════════════════════════════════════════════════╝
const ProcessStep = memo(function ProcessStep({
  step,
  index,
  onSelectStep,
}: {
  step: (typeof siteData.process.steps)[number];
  index: number;
  onSelectStep: (step: ProcessStepItem) => void;
}) {
  const isEven = index % 2 === 1;
  const imgParallaxRef = useParallax<HTMLImageElement>(0.08, 40);

  return (
    <article
      className={`process-step ${isEven ? 'process-step--reversed' : ''} reveal`}
      id={`process-step-${step.step}`}
      style={{ '--stagger-index': index, cursor: 'pointer' } as React.CSSProperties}
      onClick={() => onSelectStep(step as ProcessStepItem)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectStep(step as ProcessStepItem);
        }
      }}
      title={`Click to inspect Stage ${step.step}: ${step.title} technical specifications`}
    >
      <div className="process-step__media">
        <div className="process-step__image-wrap">
          <img
            ref={imgParallaxRef}
            src={step.image}
            alt={`${step.title} — ${step.origin}`}
            loading="lazy"
            decoding="async"
            className="process-step__img"
          />
          <div className="process-step__image-overlay" />
          <div className="process-step__origin-pill">
            <span className="process-step__origin-flag" aria-hidden="true">🇮🇳</span>
            <span>{step.origin}</span>
          </div>
          <div className="process-step__watermark" aria-hidden="true">
            {step.step}
          </div>
        </div>
      </div>

      <div className="process-step__content">
        <div className="process-step__badge-row">
          <div className="process-step__badge">
            <span className="process-step__badge-label">STAGE</span>
            <span className="process-step__badge-num">{step.step}</span>
          </div>
          <span className="process-step__subhead">{step.subtitle}</span>
        </div>

        <h3 className="process-step__title">{step.title}</h3>
        <p className="process-step__desc">{step.desc}</p>

        <div className="process-step__specs">
          {step.specs.map((spec, sIdx) => (
            <div key={sIdx} className="process-step__spec-pill">
              <span className="process-step__spec-dot" />
              <span>{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
});

const Process = memo(function Process({
  onSelectStep,
}: {
  onSelectStep: (step: ProcessStepItem) => void;
}) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const timelineRef = useRef<HTMLDivElement>(null);
  const threadFillRef = useRef<HTMLDivElement>(null);
  const threadDotRef = useRef<HTMLDivElement>(null);

  // High performance direct DOM scroll update — zero React re-renders!
  useEffect(() => {
    let rafId: number;
    const updateThread = () => {
      const el = timelineRef.current;
      if (!el || !threadFillRef.current || !threadDotRef.current) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      if (total > 0) {
        const progress = Math.min(1, Math.max(0, (vh * 0.75 - rect.top) / total));
        const pct = (progress * 100).toFixed(1);
        threadFillRef.current.style.height = `${pct}%`;
        threadDotRef.current.style.top = `${pct}%`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateThread);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateThread();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="process" id="process" ref={sectionRef}>
      <div className="container">
        <div className="process__header">
          <div className="section-label reveal">{siteData.process.label}</div>
          <h2 className="reveal">{renderHeading(siteData.process.heading)}</h2>
          <p className="process__intro reveal">{siteData.process.description}</p>
        </div>

        <div className="process__timeline reveal-stagger" ref={timelineRef}>
          <div className="process__thread-track" aria-hidden="true">
            <div
              ref={threadFillRef}
              className="process__thread-fill"
              style={{ height: '0%' }}
            />
            <div
              ref={threadDotRef}
              className="process__thread-glow-dot"
              style={{ top: '0%' }}
            />
          </div>

          {siteData.process.steps.map((step, idx) => (
            <ProcessStep key={step.step} step={step} index={idx} onSelectStep={onSelectStep} />
          ))}
        </div>
      </div>
    </section>
  );
});


// ╔══════════════════════════════════════════════════════════════════╗
// ║  APPLICATIONS                                                  ║
// ╚══════════════════════════════════════════════════════════════════╝
const Applications = memo(function Applications({
  onSelectApp,
}: {
  onSelectApp: (app: ApplicationItem, image: string) => void;
}) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const applicationsGridRef = useCardTiltGrid<HTMLDivElement>('.application-card', 7);

  return (
    <section className="applications" id="applications" ref={sectionRef}>
      <div className="container">
        <div className="applications__header">
          <div className="section-label reveal">{siteData.applications.label}</div>
          <h2 className="reveal">{renderHeading(siteData.applications.heading)}</h2>
          <p className="reveal">{siteData.applications.description}</p>
        </div>

        <div className="applications__grid reveal-stagger" ref={applicationsGridRef}>
          {siteData.applications.items.map((item, i) => {
            const img = applicationImages[item.title] || '/images/fabric_poplin.webp';
            return (
              <div
                key={item.title}
                className="application-card application-card--numbered reveal"
                style={{ '--stagger-index': i, cursor: 'pointer' } as React.CSSProperties}
                id={`app-${item.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                onClick={() => onSelectApp(item as ApplicationItem, img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectApp(item as ApplicationItem, img);
                  }
                }}
                title={`Click to view ${item.title} industry specifications & MOQs`}
              >
                <div className="application-card__seq">{String(i + 1).padStart(2, '0')}</div>
                <div className="application-card__image">
                  <img
                    src={img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="application-card__content">
                  <div className="application-card__header-row">
                    <h3 className="application-card__title">{item.title}</h3>
                    <span className="application-card__arrow-btn" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </div>
                  <p className="application-card__desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

// ╔══════════════════════════════════════════════════════════════════╗
// ║  INQUIRY / CONTACT                                             ║
// ╚══════════════════════════════════════════════════════════════════╝
const Inquiry = memo(function Inquiry({
  selectedSwatches,
  onRemoveSwatch,
  onClearSwatches,
  prefillInterest,
  prefillMessage,
}: {
  selectedSwatches: string[];
  onRemoveSwatch: (name: string) => void;
  onClearSwatches: () => void;
  prefillInterest?: string;
  prefillMessage?: string;
}) {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Sync prefill values from modals or navigation
  useEffect(() => {
    if (prefillInterest) {
      setInterest(prefillInterest);
    }
  }, [prefillInterest]);

  useEffect(() => {
    if (prefillMessage) {
      setMessage((prev) => (prev ? `${prev}\n${prefillMessage}` : prefillMessage));
    }
  }, [prefillMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    setIsSending(true);

    const refId = `MGT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timestamp =
      now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' ' +
      now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    const lead: LeadData = {
      refId,
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interest: interest || 'General White Fabric Inquiry',
      message: message.trim(),
      swatches: [...selectedSwatches],
      timestamp,
    };

    // Save to persistent localStorage
    try {
      const prev = JSON.parse(localStorage.getItem('mgt_trade_leads') || '[]');
      localStorage.setItem('mgt_trade_leads', JSON.stringify([lead, ...prev]));
    } catch {
      // storage quota or private mode fallback
    }

    // Construct structured transmission payload
    const formattedMsg = `*MADHUR GOVIND TEXTILES - TRADE INQUIRY*
Ref ID: ${refId}
Date: ${timestamp}
Name: ${lead.name}
Company: ${lead.company || 'Not Specified'}
Phone: ${lead.phone}
Email: ${lead.email}
Interest: ${lead.interest}
${lead.swatches.length > 0 ? `Selected Swatches: ${lead.swatches.join(', ')}\n` : ''}Requirements: ${lead.message || 'Requesting fabric catalog, physical swatches, and bulk pricing.'}`;

    const waUrl = `https://wa.me/917506136851?text=${encodeURIComponent(formattedMsg)}`;

    // Clear form inputs and swatch counter immediately
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClearSwatches();

    // Open WhatsApp in a new tab (keep user on site)
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setIsSending(false);
    }, 3000);
  };

  return (
    <section className="inquiry" id="inquiry" ref={sectionRef}>
      <div className="container">
        <div className="inquiry__grid">
          <div className="inquiry__text">
            <div className="section-label reveal">{siteData.inquiry.label}</div>
            <h2 className="reveal">{renderHeading(siteData.inquiry.heading)}</h2>
            <p className="reveal">{siteData.inquiry.description}</p>

            <div className="inquiry__contact-panel reveal">
              {/* Billing & Registered Office Card */}
              <div className="inquiry__office-card">
                <div className="inquiry__office-header">
                  <span className="inquiry__office-badge">
                    <span className="inquiry__badge-pulsing-dot" />
                    Registered & Billing Office
                  </span>
                  <span className="inquiry__hub-tag">Mumbai Textile Market</span>
                </div>

                <div className="inquiry__office-title">
                  {siteData.inquiry.contact.billingAddress.premises}
                </div>

                <div className="inquiry__address-grid">
                  <div className="inquiry__address-row">
                    <span className="inquiry__address-label">Floor & Unit</span>
                    <span className="inquiry__address-val">
                      {siteData.inquiry.contact.billingAddress.floor} &bull; {siteData.inquiry.contact.billingAddress.unit}
                    </span>
                  </div>
                  <div className="inquiry__address-row">
                    <span className="inquiry__address-label">Street</span>
                    <span className="inquiry__address-val">{siteData.inquiry.contact.billingAddress.street}</span>
                  </div>
                  <div className="inquiry__address-row">
                    <span className="inquiry__address-label">Landmark</span>
                    <span className="inquiry__address-val">{siteData.inquiry.contact.billingAddress.landmark}</span>
                  </div>
                  <div className="inquiry__address-row">
                    <span className="inquiry__address-label">City & State</span>
                    <span className="inquiry__address-val">
                      {siteData.inquiry.contact.billingAddress.city}, {siteData.inquiry.contact.billingAddress.state}, India
                    </span>
                  </div>
                </div>

                <div className="inquiry__office-actions">
                  <a
                    href={siteData.inquiry.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inquiry__map-btn"
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="inquiry__btn-icon">
                      <path d="M10 2C6.7 2 4 4.7 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z" />
                      <circle cx="10" cy="8" r="2.5" />
                    </svg>
                    <span>View Location on Map</span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="inquiry__btn-arrow">
                      <path d="M4 12L12 4M12 4H6M12 4V10" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="inquiry__channel-cards">
                <div className="inquiry__channel-card">
                  <div className="inquiry__channel-icon-wrap">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M5 3h4l2 4-2.5 2a11 11 0 005 5L16 12l4 2v4a2 2 0 01-2 2C9 19 1 11 1 3a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div className="inquiry__channel-info">
                    <div className="inquiry__channel-title">Direct Trade Hotline</div>
                    <a href={`tel:${siteData.inquiry.contact.phoneRaw}`} className="inquiry__channel-link inquiry__channel-link--phone">
                      <span>{siteData.inquiry.contact.phone}</span>
                    </a>
                    <div className="inquiry__channel-hint">Mon &ndash; Sat, 10:00 AM &ndash; 7:30 PM IST</div>
                  </div>
                </div>

                <div className="inquiry__channel-card">
                  <div className="inquiry__channel-icon-wrap inquiry__channel-icon-wrap--wa">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="inquiry__channel-info">
                    <div className="inquiry__channel-title">WhatsApp Swatch Desk</div>
                    <a
                      href={siteData.inquiry.contact.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inquiry__channel-link inquiry__channel-link--wa"
                    >
                      Chat on WhatsApp
                    </a>
                    <div className="inquiry__channel-hint">Instant swatch queries & specs</div>
                  </div>
                </div>

                <div className="inquiry__channel-card">
                  <div className="inquiry__channel-icon-wrap">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="4" width="16" height="12" rx="1" />
                      <path d="M2 4l8 6 8-6" />
                    </svg>
                  </div>
                  <div className="inquiry__channel-info">
                    <div className="inquiry__channel-title">Corporate Email</div>
                    <a href={`mailto:${siteData.inquiry.contact.email}`} className="inquiry__channel-link inquiry__channel-link--email">
                      {siteData.inquiry.contact.email}
                    </a>
                    <div className="inquiry__channel-hint">Formal tenders & bulk quotes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form className="inquiry__form reveal" onSubmit={handleSubmit} id="inquiry-form">
            {/* Attached Swatches Chips */}
            {selectedSwatches.length > 0 && (
              <div className="inquiry-swatches-box">
                <div className="inquiry-swatches-box__header">
                  <span className="inquiry-swatches-box__title">
                    Swatches Attached ({selectedSwatches.length})
                  </span>
                  <button
                    type="button"
                    className="inquiry-swatches-box__clear"
                    onClick={onClearSwatches}
                  >
                    Remove all
                  </button>
                </div>
                <div className="inquiry-swatches-pills">
                  {selectedSwatches.map((swatch) => (
                    <span key={swatch} className="inquiry-swatch-chip">
                      <span>{swatch}</span>
                      <button
                        type="button"
                        className="inquiry-swatch-chip__remove"
                        onClick={() => onRemoveSwatch(swatch)}
                        aria-label={`Remove ${swatch}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="inquiry-name">Full Name *</label>
                <input
                  type="text"
                  id="inquiry-name"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-company">Company</label>
                <input
                  type="text"
                  id="inquiry-company"
                  name="company"
                  placeholder="Brand / Firm / Institution"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="inquiry-email">Email *</label>
                <input
                  type="email"
                  id="inquiry-email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-phone">Phone / Mobile *</label>
                <input
                  type="tel"
                  id="inquiry-phone"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="inquiry-interest">Inquiry Category</label>
              <select
                id="inquiry-interest"
                name="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                <option value="">Select your interest</option>
                <option value="shirting">Shirting Fabrics (Poplin, Oxford, Satin)</option>
                <option value="suiting">Suiting Fabrics (PV, TR, Cotton, Linen)</option>
                <option value="uniform">Uniform & Institutional Programmes</option>
                <option value="custom">Custom Fabric Development</option>
                <option value="bulk">Bulk Mill & Export Orders</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="inquiry-message">Requirements & Specifications</label>
              <textarea
                id="inquiry-message"
                name="message"
                rows={4}
                placeholder="Tell us about your requirements — fabric type, meterage, yarn count, target application..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary inquiry__submit-btn"
              id="inquiry-submit"
              disabled={isSending}
            >
              <span>{isSending ? 'Opening WhatsApp...' : 'Send Trade Inquiry'}</span>
              {!isSending && <ArrowIcon />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});

// ╔══════════════════════════════════════════════════════════════════╗
// ║  FOOTER                                                        ║
// ╚══════════════════════════════════════════════════════════════════╝
const Footer = memo(function Footer() {
  const smoothScroll = useSmoothScroll();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__brand-name">{siteData.brand.name}</div>
            <p className="footer__brand-desc">{siteData.footer.description}</p>
          </div>

          <div>
            <div className="footer__col-title">Quick Links</div>
            <div className="footer__links">
              {siteData.footer.quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer__link"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScroll(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer__col-title">Business</div>
            <div className="footer__links">
              {siteData.footer.businessLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer__link"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScroll(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__office-col">
            <div className="footer__col-title">Registered & Billing Office</div>
            <div className="footer__office-box">
              <div className="footer__office-premises">{siteData.inquiry.contact.billingAddress.premises}</div>
              <div className="footer__office-text">
                {siteData.inquiry.contact.billingAddress.floor} &bull; {siteData.inquiry.contact.billingAddress.unit}
              </div>
              <div className="footer__office-text">
                {siteData.inquiry.contact.billingAddress.street}, {siteData.inquiry.contact.billingAddress.landmark}
              </div>
              <div className="footer__office-text">
                {siteData.inquiry.contact.billingAddress.city}, {siteData.inquiry.contact.billingAddress.state}, India
              </div>

              <div className="footer__office-links">
                <a href={`tel:${siteData.inquiry.contact.phoneRaw}`} className="footer__office-link">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 2h3l1.5 3-2 1.5a8 8 0 004 4L11 8.5l3 1.5v3a1.5 1.5 0 01-1.5 1.5C6 14.5 1.5 10 1.5 3.5A1.5 1.5 0 013 2z" />
                  </svg>
                  <span>{siteData.inquiry.contact.phone}</span>
                </a>
                <a href={`mailto:${siteData.inquiry.contact.email}`} className="footer__office-link">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1.5" y="3" width="13" height="10" rx="1" />
                    <path d="M1.5 3l6.5 5 6.5-5" />
                  </svg>
                  <span>{siteData.inquiry.contact.email}</span>
                </a>
                <a
                  href={siteData.inquiry.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__office-link footer__office-link--map"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
                    <circle cx="8" cy="6" r="1.8" />
                  </svg>
                  <span>Open in Google Maps &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} {siteData.brand.name}. All rights reserved.</span>
          <span>{siteData.brand.tagline}</span>
        </div>
      </div>
    </footer>
  );
});

// ── Floating WhatsApp Quick Inquiry ────────────────────────────────
const FloatingWhatsApp = memo(function FloatingWhatsApp() {
  return (
    <a
      href={siteData.inquiry.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      aria-label="Direct trade inquiry on WhatsApp (+91 75061 36851)"
      title="Direct Trade Inquiry on WhatsApp (+91 75061 36851)"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="floating-wa__icon">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="floating-wa__badge">WhatsApp Inquiry</span>
    </a>
  );
});

// ── Floating Back to Top Button with Circular SVG Progress Ring (Arvind Style) ─────
// High performance: Zero React re-renders on scroll!
const BackToTop = memo(function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const radius = 21;
  const circumference = 2 * Math.PI * radius; // ~131.95

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const isVis = scrollY > 350;
      setVisible((prev) => (prev !== isVis ? isVis : prev));

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!ringRef.current) return;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) {
          const progress = Math.min(1, Math.max(0, scrollY / total));
          ringRef.current.style.strokeDashoffset = `${(circumference * (1 - progress)).toFixed(2)}`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [circumference]);

  const scrollToTop = useCallback(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      id="back-to-top-btn"
    >
      <svg className="back-to-top__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          className="back-to-top__ring-bg"
          cx="24"
          cy="24"
          r={radius}
        />
        <circle
          ref={ringRef}
          className="back-to-top__ring-progress"
          cx="24"
          cy="24"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
        />
      </svg>
      <div className="back-to-top__arrow">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 12V4M4 8l4-4 4 4" />
        </svg>
      </div>
    </button>
  );
});

// ── Luxury Interactive Cursor (Arvind & Belcon Tex) ─────────────────
const CustomCursor = memo(function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible((prev) => (!prev ? true : prev));

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const hovered = !!(
        target &&
        target.closest(
          'a, button, input, select, textarea, .fabric-card, .application-card, .stat-card, .feature, .process-step__image-wrap, .hero__arrow-btn, .hero__bar-btn'
        )
      );
      setIsHovered((prev) => (prev !== hovered ? hovered : prev));
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isVisible ? 'is-visible' : ''} ${isHovered ? 'is-hover' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isVisible ? 'is-visible' : ''} ${isHovered ? 'is-hover' : ''}`}
        aria-hidden="true"
      />
    </>
  );
});

// ── Luxury Scroll Progress Bar (High performance: Zero React re-renders) ──
const ScrollProgressBar = memo(function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!barRef.current) return;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) {
          const ratio = Math.min(1, Math.max(0, window.scrollY / total));
          barRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress-bar"
      aria-hidden="true"
    />
  );
});

// ╔══════════════════════════════════════════════════════════════════╗
// ║  APP (Root Component)                                          ║
// ╚══════════════════════════════════════════════════════════════════╝
export default function App() {
  const smoothScroll = useSmoothScroll();

  // Initialize Lenis momentum smooth scrolling
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return () => cleanup();
  }, []);

  // Trigger initial reveal animations for elements in viewport on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const heroReveals = document.querySelectorAll('.hero .reveal, .hero .reveal-line, .hero .img-reveal');
      heroReveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 120);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // ── Modal State ───────────────────────────────────────────────────
  const [selectedFabric, setSelectedFabric] = useState<{
    fabric: FabricItem;
    category: 'shirting' | 'suiting';
    image: string;
  } | null>(null);

  const [selectedApp, setSelectedApp] = useState<{
    app: ApplicationItem;
    image: string;
  } | null>(null);

  const [selectedProcessStep, setSelectedProcessStep] = useState<ProcessStepItem | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<ManufacturingFeatureItem | null>(null);

  // ── Swatch Tray State (with localStorage persistence) ─────────────
  const [swatchTray, setSwatchTray] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('mgt_swatch_tray');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mgt_swatch_tray', JSON.stringify(swatchTray));
    } catch {
      // storage quota or private browsing
    }
  }, [swatchTray]);

  const handleToggleSwatch = useCallback((fabricName: string) => {
    setSwatchTray((prev) =>
      prev.includes(fabricName) ? prev.filter((n) => n !== fabricName) : [...prev, fabricName]
    );
  }, []);

  const handleRemoveSwatch = useCallback((fabricName: string) => {
    setSwatchTray((prev) => prev.filter((n) => n !== fabricName));
  }, []);

  const handleClearSwatches = useCallback(() => {
    setSwatchTray([]);
  }, []);

  // ── Form Prefill & Action Triggers ────────────────────────────────
  const [prefillInterest, setPrefillInterest] = useState<string>('');
  const [prefillMessage, setPrefillMessage] = useState<string>('');

  const handleSelectFabric = useCallback(
    (fabric: FabricItem, category: 'shirting' | 'suiting', image: string) => {
      setSelectedFabric({ fabric, category, image });
    },
    []
  );

  const handleSelectApp = useCallback((app: ApplicationItem, image: string) => {
    setSelectedApp({ app, image });
  }, []);

  const handleSelectStep = useCallback((step: ProcessStepItem) => {
    setSelectedProcessStep(step);
  }, []);

  const handleSelectFeature = useCallback((feature: ManufacturingFeatureItem) => {
    setSelectedFeature(feature);
  }, []);

  const handleRequestSample = useCallback(
    (fabric: FabricItem) => {
      if (!swatchTray.includes(fabric.name)) {
        setSwatchTray((prev) => [...prev, fabric.name]);
      }
      setPrefillInterest('shirting');
      setPrefillMessage(
        `Requesting physical swatch samples for ${fabric.name} (${fabric.gsm}, ${fabric.composition}).`
      );
      smoothScroll('#inquiry');
    },
    [smoothScroll, swatchTray]
  );

  const handleInquireIndustry = useCallback(
    (appTitle: string) => {
      let cat = 'bulk';
      if (appTitle.includes('Uniform')) cat = 'uniform';
      else if (appTitle.includes('Fashion')) cat = 'shirting';
      else if (appTitle.includes('Institutional')) cat = 'uniform';
      else cat = 'bulk';

      setPrefillInterest(cat);
      setPrefillMessage(`Inquiry for ${appTitle} supply programme — requesting bulk specifications.`);
      smoothScroll('#inquiry');
    },
    [smoothScroll]
  );

  const handleInquireProcess = useCallback(
    (stageTitle: string) => {
      setPrefillInterest('custom');
      setPrefillMessage(`Technical mill inquiry regarding Stage: ${stageTitle}.`);
      smoothScroll('#inquiry');
    },
    [smoothScroll]
  );

  const handleProceedToInquiryFromTray = useCallback(() => {
    setPrefillMessage(`Requesting physical swatches for: ${swatchTray.join(', ')}.`);
    smoothScroll('#inquiry');
  }, [smoothScroll, swatchTray]);

  return (
    <>
      <CustomCursor />
      <ScrollProgressBar />
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Philosophy />
        <DividerBand />
        <Collections onSelectFabric={handleSelectFabric} />
        <Manufacturing onSelectFeature={handleSelectFeature} />
        <Process onSelectStep={handleSelectStep} />
        <Applications onSelectApp={handleSelectApp} />
        <Inquiry
          selectedSwatches={swatchTray}
          onRemoveSwatch={handleRemoveSwatch}
          onClearSwatches={handleClearSwatches}
          prefillInterest={prefillInterest}
          prefillMessage={prefillMessage}
        />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />

      {/* ── Interactive Modals & Lead Systems ─────────────────────── */}
      <FabricModal
        fabric={selectedFabric?.fabric || null}
        category={selectedFabric?.category || 'shirting'}
        imageUrl={selectedFabric?.image || ''}
        isInSwatchTray={selectedFabric ? swatchTray.includes(selectedFabric.fabric.name) : false}
        onToggleSwatch={handleToggleSwatch}
        onRequestSample={handleRequestSample}
        onClose={() => setSelectedFabric(null)}
      />

      <ApplicationModal
        app={selectedApp?.app || null}
        imageUrl={selectedApp?.image || ''}
        onInquireIndustry={handleInquireIndustry}
        onClose={() => setSelectedApp(null)}
      />

      <ProcessModal
        step={selectedProcessStep}
        onInquireProcess={handleInquireProcess}
        onClose={() => setSelectedProcessStep(null)}
      />

      <FeatureModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />

      <SwatchTrayDrawer
        swatches={swatchTray}
        onRemove={handleRemoveSwatch}
        onClear={handleClearSwatches}
        onProceedToInquiry={handleProceedToInquiryFromTray}
      />
    </>
  );
}

