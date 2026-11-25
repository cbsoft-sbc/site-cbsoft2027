import './Hero.css';

import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { asset, IMAGES } from '@/data/config';
import { HERO_PHOTOS } from '@/data/heroPhotos';
import { useHeroCarousel } from '@/hooks/useHeroCarousel';
import { useHeroWave } from '@/hooks/useHeroWave';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Countdown } from './Countdown';
import { HeroEventPills } from './HeroEventPills';

function HeroPhotoCredit({ photo, onOpenChange }: {
  photo: (typeof HERO_PHOTOS)[number] | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const creditId = useId();
  const creditRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  function updateOpen(next: boolean) {
    setOpen(next);
    onOpenChange(next);
  }

  useOnClickOutside(creditRef, () => updateOpen(false), open);

  return (
    <div
      ref={creditRef}
      className="home-hero__photo-info"
      hidden={!photo}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') updateOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) {
          updateOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) updateOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          updateOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        className="home-hero__photo-info-button"
        type="button"
        aria-label={t('hero.carousel.photoInfo')}
        aria-expanded={open}
        aria-controls={open ? creditId : undefined}
        onClick={() => updateOpen(!open)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5m0-8.5h.01" />
        </svg>
      </button>
      {open && photo && (
        <div className="home-hero__photo-credit-panel" id={creditId}>
          <p className="home-hero__photo-credit">
            <a href={photo.source}>{photo.title}</a>
            <span>{photo.author}</span>
            <span>
              <a href={photo.license.url}>{photo.license.label}</a>
              {' · '}{t('hero.carousel.photoEdits')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const { t } = useTranslation();
  const carousel = useHeroCarousel(HERO_PHOTOS.length);
  const heroRef = useHeroWave(carousel.reducedMotion);
  const controlsDisabled = carousel.failed.length >= HERO_PHOTOS.length - 1;
  const visiblePhoto = carousel.failed.includes(carousel.visible) ? null : HERO_PHOTOS[carousel.visible];

  return (
    <section
      ref={heroRef}
      className="home-hero"
      aria-labelledby="hero-countdown-title"
      onMouseEnter={() => carousel.setHovered(true)}
      onMouseLeave={() => carousel.setHovered(false)}
      onPointerDownCapture={() => carousel.setInteracting(true)}
      onFocusCapture={() => carousel.setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) carousel.setFocused(false);
      }}
    >
      <div className="home-hero__photos" id="hero-photos">
        {HERO_PHOTOS.map(({ id, position }, index) => carousel.requested.includes(index) && !carousel.failed.includes(index) && (
          <picture key={id} aria-hidden={carousel.visible !== index}>
            <source media="(max-width: 640px)" srcSet={asset(`assets/images/belo-horizonte/${id}-mobile.webp`)} />
            <img
              className={`home-hero__photo${carousel.visible === index ? ' is-visible' : ''}`}
              src={asset(`assets/images/belo-horizonte/${id}.webp`)}
              alt={t(`hero.carousel.photos.${id}`)}
              style={{ objectPosition: position }}
              loading={index === 0 ? 'eager' : 'lazy'}
              {...{ fetchpriority: index === 0 ? 'high' : 'low' }}
              decoding="async"
              onLoad={() => carousel.onLoad(index)}
              onError={() => carousel.onError(index)}
            />
          </picture>
        ))}
      </div>

      <div className="home-hero__shade" aria-hidden="true" />

      <HeroPhotoCredit photo={visiblePhoto} onOpenChange={carousel.setPaused} />

      <div className="home-hero__content">
        <Countdown />

        <div className="home-hero__details">
          <HeroEventPills />

          <div className="home-hero__actions">
            <a className="home-hero__button_2" href="#patrocinio">
              {t('sponsorship.cta.sponsor.title')}
            </a>
          </div>

          <div
            className="home-hero__controls"
            role="group"
            aria-label={t('hero.carousel.label')}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                carousel.move(event.key === 'ArrowLeft' ? -1 : 1);
              }
            }}
          >
            <button type="button" aria-label={t('hero.carousel.previous')} aria-controls="hero-photos"
              disabled={controlsDisabled} onClick={() => carousel.move(-1)}>
              <span aria-hidden="true">‹</span>
            </button>
            {HERO_PHOTOS.map(({ id }, index) => (
              <button key={id} type="button" className="home-hero__indicator"
                aria-label={t('hero.carousel.goTo', { number: index + 1 })}
                aria-controls="hero-photos" aria-current={carousel.active === index ? 'true' : undefined}
                disabled={carousel.failed.includes(index)} onClick={() => carousel.select(index)}>
                <span aria-hidden="true" />
              </button>
            ))}
            <button type="button" aria-label={t('hero.carousel.next')} aria-controls="hero-photos"
              disabled={controlsDisabled} onClick={() => carousel.move(1)}>
              <span aria-hidden="true">›</span>
            </button>
            <span className="sr-only" aria-live={carousel.rotating ? 'off' : 'polite'} aria-atomic="true">
              {t('hero.carousel.position', { number: carousel.active + 1, total: HERO_PHOTOS.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="home-hero__wave" aria-hidden="true">
        <img src={IMAGES.grafismo_3} alt="" decoding="async" />
      </div>
    </section>
  );
}
