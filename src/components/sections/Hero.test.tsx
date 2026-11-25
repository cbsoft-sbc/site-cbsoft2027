import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { HERO_SLIDE_INTERVAL } from '@/hooks/useHeroCarousel';
import { Hero } from './Hero';

let motion: MediaQueryList;
let motionChange: () => void;

beforeEach(async () => {
  await i18n.changeLanguage('pt');
  vi.useFakeTimers();
  motion = {
    matches: false,
    addEventListener: vi.fn((_, listener) => { motionChange = listener as () => void; }),
    removeEventListener: vi.fn(),
  } as unknown as MediaQueryList;
  vi.spyOn(window, 'matchMedia').mockReturnValue(motion);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function advance() {
  act(() => vi.advanceTimersByTime(HERO_SLIDE_INTERVAL));
}

function currentPhoto() {
  return document.querySelector('.home-hero__indicator[aria-current="true"]')?.getAttribute('aria-label');
}

function photos() {
  return document.querySelectorAll<HTMLImageElement>('.home-hero__photo');
}

function photoInfo() {
  return screen.getByRole('button', { name: 'Créditos e licença da foto' });
}

it.each([
  ['pt', 'O congresso começa em', 'Tempo restante até o início do congresso', '00 Dias, 00 Horas, 00 Minutos', 'Segundos'],
  ['en', 'The congress starts in', 'Time remaining until the congress begins', '00 Days, 00 Hours, 00 Minutes', 'Seconds'],
])('counts down to midnight in Brasília and labels the timer in %s', async (lang, title, label, units, seconds) => {
  await i18n.changeLanguage(lang);
  vi.setSystemTime(new Date('2027-09-27T02:59:59Z'));
  render(<Hero />);

  expect(screen.getByRole('heading', { name: title })).toBeTruthy();
  expect(screen.getByRole('timer', { name: `${label}: ${units}, 01 ${seconds}` })).toBeTruthy();

  act(() => vi.advanceTimersByTime(1_000));
  expect(screen.getByRole('timer', { name: `${label}: ${units}, 00 ${seconds}` })).toBeTruthy();
});

describe('Hero carousel', () => {
  it('prioritizes the first photo and shows its alternative text and credit', () => {
    render(<Hero />);
    expect(photos()).toHaveLength(1);
    expect(photos()[0].getAttribute('src')).toContain('fontes-praca-liberdade.webp');
    expect(photos()[0].parentElement?.querySelector('source')?.getAttribute('srcset')).toContain('fontes-praca-liberdade-mobile.webp');
    expect(photos()[0].getAttribute('fetchpriority')).toBe('high');
    expect(photos()[0].getAttribute('loading')).toBe('eager');
    expect(screen.getByRole('img', { name: 'Jatos d’água e jardins na Praça da Liberdade, em Belo Horizonte' })).toBe(photos()[0]);
    expect(photoInfo().getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('link', { name: 'CC BY-SA 3.0' })).toBeNull();
    fireEvent.click(photoInfo());
    expect(screen.getByRole('link', { name: 'Praça da Liberdade - BH' }).getAttribute('href')).toContain('panoramio_(2).jpg');
    expect(screen.getByRole('link', { name: 'CC BY-SA 3.0' }).getAttribute('href')).toBe('https://creativecommons.org/licenses/by-sa/3.0/');
    expect(screen.getByRole('timer')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Seja nosso patrocinador' }).getAttribute('href')).toBe('#patrocinio');
  });

  it('advances through all photos in order and wraps around', () => {
    render(<Hero />);
    const nextPhotos = [
      'coreto-praca-liberdade', 'secretaria-da-fazenda', 'igreja-da-pampulha',
      'cidade-administrativa-mg', 'mercado-central', 'palacio-tiradentes',
    ];
    for (const [index, id] of nextPhotos.entries()) {
      advance();
      expect(currentPhoto()).toBe(`Mostrar foto ${index + 2}`);
      expect(photos()[index + 1].getAttribute('src')).toContain(`${id}.webp`);
      expect(photos()[index + 1].getAttribute('loading')).toBe('lazy');
    }
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
  });

  it('supports previous, next, direct selection and keyboard arrows', () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole('button', { name: 'Foto anterior' }));
    expect(currentPhoto()).toBe('Mostrar foto 7');
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(currentPhoto()).toBe('Mostrar foto 1');
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar foto 2' }));
    expect(currentPhoto()).toBe('Mostrar foto 2');
    const next = screen.getByRole('button', { name: 'Próxima foto' });
    fireEvent.keyDown(next, { key: 'ArrowRight' });
    expect(currentPhoto()).toBe('Mostrar foto 3');
    fireEvent.keyDown(next, { key: 'ArrowLeft' });
    expect(currentPhoto()).toBe('Mostrar foto 2');
  });

  it('keeps the previous image and credit visible until the selected photo loads', () => {
    render(<Hero />);
    fireEvent.load(photos()[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    fireEvent.click(photoInfo());
    expect(photos()[0].classList.contains('is-visible')).toBe(true);
    expect(photos()[1].classList.contains('is-visible')).toBe(false);
    expect(screen.getByRole('link', { name: 'Praça da Liberdade - BH' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: /Coreto/ })).toBeNull();
    fireEvent.load(photos()[1]);
    expect(photos()[1].classList.contains('is-visible')).toBe(true);
    expect(photos()[0].classList.contains('is-visible')).toBe(false);
    expect(screen.getByRole('link', { name: 'Coreto da Praça da Liberdade BH' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toBeTruthy();
  });

  it('opens the credit on mouse hover and dismisses it with Escape from a link', () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar foto 5' }));
    fireEvent.load(photos()[1]);

    const trigger = photoInfo();
    fireEvent(trigger, Object.assign(new MouseEvent('pointerover', { bubbles: true }), { pointerType: 'mouse' }));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const licence = screen.getByRole('link', { name: 'CC BY 3.0' });
    expect(licence.getAttribute('href')).toBe('https://creativecommons.org/licenses/by/3.0/');
    expect(screen.getByText(/Leo Drumond/)).toBeTruthy();

    licence.focus();
    fireEvent.keyDown(licence, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('pauses while hovering the hero, then waits a full interval before resuming', () => {
    render(<Hero />);
    const hero = screen.getByRole('region', { name: 'O congresso começa em' });
    fireEvent.mouseEnter(hero);
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
    fireEvent.mouseLeave(hero);
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 2');
  });

  it('pauses while the CTA or a control has focus, including focus moving inside the hero', () => {
    render(<Hero />);
    const link = screen.getByRole('link', { name: 'Seja nosso patrocinador' });
    const next = screen.getByRole('button', { name: 'Próxima foto' });
    fireEvent.focus(link);
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
    fireEvent.blur(link, { relatedTarget: next });
    fireEvent.focus(next);
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
    fireEvent.blur(next, { relatedTarget: document.body });
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 2');
  });

  it('pauses during touch or pointer interaction and resumes after release', () => {
    render(<Hero />);
    fireEvent.pointerDown(screen.getByRole('region', { name: 'O congresso começa em' }));
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
    fireEvent.pointerUp(window);
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 2');
  });

  it('disables autoplay for reduced motion while preserving manual navigation', () => {
    Object.defineProperty(motion, 'matches', { value: true, configurable: true });
    render(<Hero />);
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(currentPhoto()).toBe('Mostrar foto 2');
    Object.defineProperty(motion, 'matches', { value: false });
    act(() => motionChange());
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 3');
  });

  it('pauses in hidden tabs and resumes when visible', () => {
    render(<Hero />);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 1');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    advance();
    expect(currentPhoto()).toBe('Mostrar foto 2');
  });

  it('skips a broken photo and keeps the countdown visible', () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    fireEvent.error(photos()[1]);
    expect(currentPhoto()).toBe('Mostrar foto 3');
    expect((screen.getByRole('button', { name: 'Mostrar foto 2' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('timer')).toBeTruthy();
  });

  it('translates controls, alternative text and the credit note into English', async () => {
    render(<Hero />);
    await act(async () => { await i18n.changeLanguage('en'); });
    expect(screen.getByRole('button', { name: 'Previous photo' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next photo' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show photo 1' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Fountains and gardens at Praça da Liberdade in Belo Horizonte' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Photo credits and licence' }));
    expect(screen.getByText(/Resized and reframed WebP/)).toBeTruthy();
  });

  it('no longer shows the CBSoft logo; the header carries the brand', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.home-hero__logo')).toBeNull();
    expect(container.querySelector('img[src*="logo"]')).toBeNull();
    // The auxiliary wave graphic stays.
    expect(container.querySelector('.home-hero__wave img')).not.toBeNull();
  });
});
