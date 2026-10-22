import React, { useState, useEffect } from 'react';
import { getLenis } from '../hooks/useAnimations';

export interface FabricItem {
  name: string;
  desc: string;
  weave: string;
  composition: string;
  gsm: string;
  yarnCount: string;
  width: string;
  finish: string;
  silhouettes: string;
  idealFor: string;
}

export interface ApplicationItem {
  title: string;
  desc: string;
  sectors: string;
  recommendedBlends: string;
  moq: string;
  leadTime: string;
  features: readonly string[];
}

export interface ProcessStepItem {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  specs: readonly string[];
  machinery: string;
  testingStandard: string;
  image: string;
  origin: string;
}

export interface ManufacturingFeatureItem {
  title: string;
  desc: string;
  icon: string;
  technicalDetail: string;
  metrics: string;
}

export interface LeadData {
  refId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  swatches: string[];
  timestamp: string;
}

// ── Base Modal Backdrop ─────────────────────────────────────────────
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '780px',
}: ModalWrapperProps) {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Stop Lenis while modal is open so wheel/scroll events on the modal don't fight background scrolling
    const lenis = getLenis();
    if (lenis) {
      lenis.stop();
    }

    // Focus the modal container when it opens
    const modalEl = document.getElementById('mgt-modal-container');
    if (modalEl) {
      modalEl.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: keep Tab within the modal
      if (e.key === 'Tab') {
        const container = document.getElementById('mgt-modal-container');
        if (!container) return;
        const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter((el) => !el.closest('[aria-hidden="true"]'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore Lenis when modal closes
      const l = getLenis();
      if (l) {
        l.start();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="mgt-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mgt-modal-title"
      data-lenis-prevent
    >
      <div
        id="mgt-modal-container"
        className="mgt-modal-container"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        tabIndex={-1}
      >
        <div className="mgt-modal-header">
          <div className="mgt-modal-header__info">
            {subtitle && <span className="mgt-modal-header__sub">{subtitle}</span>}
            <h3 id="mgt-modal-title" className="mgt-modal-header__title">{title}</h3>
          </div>
          <button
            className="mgt-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mgt-modal-body" data-lenis-prevent>{children}</div>
      </div>
    </div>
  );
}

// ── 1. Fabric Specification & Swatch Request Modal ───────────────────
interface FabricModalProps {
  fabric: FabricItem | null;
  category: 'shirting' | 'suiting';
  imageUrl: string;
  isInSwatchTray: boolean;
  onToggleSwatch: (name: string) => void;
  onRequestSample: (fabric: FabricItem) => void;
  onClose: () => void;
}

export function FabricModal({
  fabric,
  category,
  imageUrl,
  isInSwatchTray,
  onToggleSwatch,
  onRequestSample,
  onClose,
}: FabricModalProps) {
  if (!fabric) return null;

  const waMessage = `Hello Madhur Govind Textiles, I would like to inquire about ${fabric.name} (${fabric.gsm}, ${fabric.composition}) for ${category === 'shirting' ? 'Shirting' : 'Suiting'}. Please share wholesale price and physical swatch availability.`;
  const waUrl = `https://wa.me/917506136851?text=${encodeURIComponent(waMessage)}`;

  return (
    <ModalWrapper
      isOpen={!!fabric}
      onClose={onClose}
      title={fabric.name}
      subtitle={`Pure White Collection • ${category === 'shirting' ? 'Shirting Quality' : 'Suiting Quality'}`}
      maxWidth="840px"
    >
      <div className="fabric-modal-grid">
        <div className="fabric-modal-visual">
          <div className="fabric-modal-visual__img-wrap">
            <img src={imageUrl} alt={fabric.name} className="fabric-modal-visual__img" />
            <div className="fabric-modal-visual__tag">{fabric.weave}</div>
          </div>
          <p className="fabric-modal-visual__desc">{fabric.desc}</p>
        </div>

        <div className="fabric-modal-details">
          <div className="fabric-specs-table">
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Composition</span>
              <span className="fabric-spec-val">{fabric.composition}</span>
            </div>
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Weight (GSM)</span>
              <span className="fabric-spec-val font-mono">{fabric.gsm}</span>
            </div>
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Yarn Count</span>
              <span className="fabric-spec-val font-mono">{fabric.yarnCount}</span>
            </div>
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Loom Width</span>
              <span className="fabric-spec-val">{fabric.width}</span>
            </div>
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Fabric Finish</span>
              <span className="fabric-spec-val">{fabric.finish}</span>
            </div>
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Recommended Cut</span>
              <span className="fabric-spec-val">{fabric.silhouettes}</span>
            </div>
            <div className="fabric-spec-row">
              <span className="fabric-spec-key">Ideal Market</span>
              <span className="fabric-spec-val">{fabric.idealFor}</span>
            </div>
          </div>

          <div className="fabric-modal-actions">
            <button
              type="button"
              className={`fabric-modal-action-btn ${isInSwatchTray ? 'is-active' : ''}`}
              onClick={() => onToggleSwatch(fabric.name)}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="btn-icon">
                {isInSwatchTray ? (
                  <path d="M16 6L8 14l-4-4" />
                ) : (
                  <>
                    <path d="M10 4v12M4 10h12" />
                  </>
                )}
              </svg>
              <span>{isInSwatchTray ? 'In Swatch Tray (Selected)' : 'Add to Swatch Tray'}</span>
            </button>

            <button
              type="button"
              className="fabric-modal-action-btn fabric-modal-action-btn--primary"
              onClick={() => {
                onRequestSample(fabric);
                onClose();
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="btn-icon">
                <rect x="3" y="4" width="14" height="12" rx="2" />
                <path d="M7 8h6M7 12h4" />
              </svg>
              <span>Order Swatch Samples &rarr;</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fabric-modal-action-btn fabric-modal-action-btn--wa"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Instant WhatsApp Quote</span>
            </a>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

// ── 2. Industry Application Modal ───────────────────────────────────
interface ApplicationModalProps {
  app: ApplicationItem | null;
  imageUrl: string;
  onInquireIndustry: (appTitle: string) => void;
  onClose: () => void;
}

export function ApplicationModal({
  app,
  imageUrl,
  onInquireIndustry,
  onClose,
}: ApplicationModalProps) {
  if (!app) return null;

  return (
    <ModalWrapper
      isOpen={!!app}
      onClose={onClose}
      title={app.title}
      subtitle="Industry Supply Programme • White Fabric Solutions"
      maxWidth="780px"
    >
      <div className="app-modal-content">
        <div className="app-modal-header-banner">
          <img src={imageUrl} alt={app.title} className="app-modal-banner-img" />
          <div className="app-modal-banner-overlay" />
          <p className="app-modal-banner-desc">{app.desc}</p>
        </div>

        <div className="app-modal-details-grid">
          <div className="app-modal-detail-card">
            <span className="app-modal-label">Target Sectors</span>
            <span className="app-modal-val">{app.sectors}</span>
          </div>
          <div className="app-modal-detail-card">
            <span className="app-modal-label">Recommended Blends</span>
            <span className="app-modal-val">{app.recommendedBlends}</span>
          </div>
          <div className="app-modal-detail-card">
            <span className="app-modal-label">Minimum Order Quantity (MOQ)</span>
            <span className="app-modal-val font-mono">{app.moq}</span>
          </div>
          <div className="app-modal-detail-card">
            <span className="app-modal-label">Production & Dispatch SLA</span>
            <span className="app-modal-val">{app.leadTime}</span>
          </div>
        </div>

        <div className="app-modal-features">
          <h4 className="app-modal-features__title">Quality & Compliance Standards</h4>
          <div className="app-modal-features__list">
            {app.features.map((feat, idx) => (
              <div key={idx} className="app-modal-feature-pill">
                <span className="app-modal-feature-bullet" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="app-modal-actions">
          <button
            type="button"
            className="btn-primary app-modal-cta"
            onClick={() => {
              onInquireIndustry(app.title);
              onClose();
            }}
          >
            <span>Inquire for {app.title} &rarr;</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// ── 3. Crafting Process Stage Inspection Modal ──────────────────────
interface ProcessModalProps {
  step: ProcessStepItem | null;
  onInquireProcess: (stageTitle: string) => void;
  onClose: () => void;
}

export function ProcessModal({
  step,
  onInquireProcess,
  onClose,
}: ProcessModalProps) {
  if (!step) return null;

  return (
    <ModalWrapper
      isOpen={!!step}
      onClose={onClose}
      title={step.title}
      subtitle={`Stage ${step.step} • ${step.subtitle}`}
      maxWidth="820px"
    >
      <div className="process-modal-layout">
        <div className="process-modal-media">
          <img src={step.image} alt={step.title} className="process-modal-img" />
          <div className="process-modal-origin">
            <span aria-hidden="true">🇮🇳</span>
            <span>{step.origin}</span>
          </div>
        </div>

        <div className="process-modal-info">
          <p className="process-modal-desc">{step.desc}</p>

          <div className="process-modal-specs-box">
            <div className="process-modal-spec-item">
              <span className="process-spec-title">Machinery & Technology</span>
              <span className="process-spec-detail">{step.machinery}</span>
            </div>
            <div className="process-modal-spec-item">
              <span className="process-spec-title">Testing & Verification</span>
              <span className="process-spec-detail">{step.testingStandard}</span>
            </div>
          </div>

          <div className="process-modal-bullets">
            <h4 className="process-bullets-title">Key Quality Controls</h4>
            <ul>
              {step.specs.map((spec, i) => (
                <li key={i}>{spec}</li>
              ))}
            </ul>
          </div>

          <div className="process-modal-cta-row">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onInquireProcess(step.title);
                onClose();
              }}
            >
              <span>Consult Mill Specialists &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

// ── 4. Manufacturing Feature Detail Modal ────────────────────────────
interface FeatureModalProps {
  feature: ManufacturingFeatureItem | null;
  onClose: () => void;
}

export function FeatureModal({ feature, onClose }: FeatureModalProps) {
  if (!feature) return null;

  return (
    <ModalWrapper
      isOpen={!!feature}
      onClose={onClose}
      title={feature.title}
      subtitle="Bhiwandi & Mumbai Manufacturing Infrastructure"
      maxWidth="620px"
    >
      <div className="feature-modal-content">
        <p className="feature-modal-desc">{feature.desc}</p>

        <div className="feature-modal-spec-box">
          <div className="feature-modal-row">
            <span className="feature-row-label">Engineering Precision</span>
            <span className="feature-row-val">{feature.technicalDetail}</span>
          </div>
          <div className="feature-modal-row">
            <span className="feature-row-label">Operational Capacity</span>
            <span className="feature-row-val font-mono">{feature.metrics}</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          <span>Understood • Return to Mill Overview</span>
        </button>
      </div>
    </ModalWrapper>
  );
}

// ── 5. Floating Swatch Request Tray Drawer ──────────────────────────
interface SwatchTrayProps {
  swatches: string[];
  onRemove: (name: string) => void;
  onClear: () => void;
  onProceedToInquiry: () => void;
}

export function SwatchTrayDrawer({
  swatches,
  onRemove,
  onClear,
  onProceedToInquiry,
}: SwatchTrayProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (swatches.length === 0) return null;

  return (
    <>
      {/* Floating Pill Trigger */}
      <button
        type="button"
        className="swatch-floating-pill"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`View swatch request tray (${swatches.length} selected)`}
        id="swatch-tray-pill"
      >
        <span className="swatch-floating-pill__badge">{swatches.length}</span>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="swatch-floating-pill__icon">
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M7 7h6M7 10h6M7 13h4" />
        </svg>
        <span className="swatch-floating-pill__text">Swatch Tray</span>
      </button>

      {/* Popover / Drawer */}
      {isOpen && (
        <div className="swatch-tray-popover" id="swatch-tray-popover" data-lenis-prevent>
          <div className="swatch-tray-popover__header">
            <div>
              <div className="swatch-tray-popover__title">Selected Swatches</div>
              <div className="swatch-tray-popover__subtitle">{swatches.length} fabric{swatches.length > 1 ? 's' : ''} ready for sample dispatch</div>
            </div>
            <button
              className="swatch-tray-popover__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close swatch tray"
            >
              &times;
            </button>
          </div>

          <div className="swatch-tray-popover__list" data-lenis-prevent>
            {swatches.map((name) => (
              <div key={name} className="swatch-tray-item">
                <span className="swatch-tray-item__name">{name}</span>
                <button
                  type="button"
                  className="swatch-tray-item__remove"
                  onClick={() => onRemove(name)}
                  aria-label={`Remove ${name} from tray`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="swatch-tray-popover__actions">
            <button
              type="button"
              className="swatch-tray-btn swatch-tray-btn--primary"
              onClick={() => {
                setIsOpen(false);
                onProceedToInquiry();
              }}
            >
              Proceed to Inquiry Form &rarr;
            </button>
            <button
              type="button"
              className="swatch-tray-btn swatch-tray-btn--clear"
              onClick={onClear}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </>
  );
}

