import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { App } from '@/App';

const BASE = import.meta.env.BASE_URL;

beforeEach(async () => {
  // jsdom does not implement scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
  await i18n.changeLanguage('pt');
});

afterEach(() => {
  window.history.replaceState(null, '', BASE);
});

async function setLang(lang: 'pt' | 'en') {
  await act(async () => { await i18n.changeLanguage(lang); });
}

describe('CBSOFT\'27 menu → Experiências', () => {
  it.each([
    ['pt', "CBSOFT'27", 'Experiências'],
    ['en', "CBSOFT'27", 'Experiences'],
  ] as const)('opens the page with the mouse (%s)', async (lang, menu, label) => {
    await setLang(lang);
    window.history.replaceState(null, '', BASE);
    render(<App />);
    const trigger = screen.getAllByRole('button', { name: menu })[0];
    fireEvent(trigger, Object.assign(new MouseEvent('pointerover', { bubbles: true }), { pointerType: 'mouse' }));
    const link = screen.getByRole('link', { name: label });
    fireEvent.click(link);
    expect(window.location.pathname).toBe(`${BASE}experiencias`);
    expect(screen.getByRole('heading', { level: 1, name: label })).toBeTruthy();
  });

  it('is reachable with the keyboard', () => {
    window.history.replaceState(null, '', BASE);
    render(<App />);
    const trigger = screen.getAllByRole('button', { name: "CBSOFT'27" })[0];
    trigger.focus();
    // Keyboard activation of a button fires click with detail 0.
    fireEvent.click(trigger, { detail: 0 });
    const link = screen.getByRole('link', { name: /^Experiências/ });
    link.focus();
    expect(document.activeElement).toBe(link);
    expect(link.getAttribute('href')).toBe(`${BASE}experiencias`);
    fireEvent.click(link, { detail: 0 });
    expect(window.location.pathname).toBe(`${BASE}experiencias`);
  });

  it.each([
    ['pt', 'Abrir menu', 'Navegação móvel', 'Experiências'],
    ['en', 'Open menu', 'Mobile navigation', 'Experiences'],
  ] as const)('opens the page from the mobile menu by touch (%s)', async (lang, open, nav, label) => {
    await setLang(lang);
    window.history.replaceState(null, '', BASE);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: open }));
    const menu = screen.getByRole('navigation', { name: nav });
    fireEvent.click(within(menu).getByRole('button', { name: "CBSOFT'27" }));
    fireEvent.click(within(menu).getByRole('link', { name: new RegExp(`^${label}`) }));
    expect(window.location.pathname).toBe(`${BASE}experiencias`);
    expect(screen.queryByRole('navigation', { name: nav })).toBeNull();
  });
});

describe('ExperiencesPage', () => {
  it('shows every category with a waiting message on direct access', () => {
    window.history.replaceState(null, '', `${BASE}experiencias`);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Experiências' })).toBeTruthy();
    for (const name of ['Turismo em BH', 'Shows e Concertos', 'Gastronomia em BH']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeTruthy();
    }
    expect(screen.getAllByText('Em breve')).toHaveLength(3);
    expect(document.title).toBe("Experiências — CBSOFT'27");
  });

  it('renders in English', async () => {
    await setLang('en');
    window.history.replaceState(null, '', `${BASE}experiencias`);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Experiences' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Food in BH' })).toBeTruthy();
    expect(screen.getAllByText('Coming soon')).toHaveLength(3);
    expect(document.title).toBe("Experiences — CBSOFT'27");
  });
});
