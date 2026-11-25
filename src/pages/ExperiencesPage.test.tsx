import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { App } from '@/App';
import { renderApp } from '@/test/renderApp';

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
    expect(await screen.findByRole('heading', { level: 1, name: label })).toBeTruthy();
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
  it('shows the Belo Horizonte guide in five sections on direct access', async () => {
    window.history.replaceState(null, '', `${BASE}experiencias`);
    await renderApp();
    expect(screen.getByRole('heading', { level: 1, name: 'Experiências' })).toBeTruthy();
    const sections = ['Conjunto da Pampulha', 'Pontos turísticos', 'Gastronomia e vida noturna', 'Passeios culturais', 'Como se deslocar'];
    for (const name of sections) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeTruthy();
    }
    // Every section has content now; none is "to be announced".
    expect(screen.queryByText('Em breve')).toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: 'Igreja São Francisco de Assis (Igrejinha da Pampulha)' })).toBeTruthy();
    expect(screen.getByText(/Não deixe de provar pão de queijo/)).toBeTruthy();
    expect(screen.getByText('Patrimônio Mundial da UNESCO')).toBeTruthy();
    expect(document.title).toBe("Experiências — CBSOFT'27");
  });

  it('has no photo or page index above the sections', async () => {
    window.history.replaceState(null, '', `${BASE}experiencias`);
    const { container } = await renderApp();
    const main = container.querySelector('main')!;
    expect(main.querySelector('img')).toBeNull();
    expect(screen.queryByRole('navigation', { name: 'Nesta página' })).toBeNull();
  });

  it('keeps the venue at PUC Minas and points transport to the venue page', async () => {
    window.history.replaceState(null, '', `${BASE}experiencias`);
    const { container } = await renderApp();
    const main = container.querySelector('main')!;
    // Pampulha is a destination here, not the event venue.
    expect(main.textContent).not.toMatch(/realizado na região do Campus Pampulha/);
    expect(main.textContent).not.toMatch(/5106|5102/);
    const transport = screen.getByRole('region', { name: /Como se deslocar/ });
    expect(within(transport).getByRole('link', { name: /Como chegar ao local do evento/ }).getAttribute('href')).toBe(`${BASE}local`);
    expect(screen.getByRole('link', { name: /portal oficial de turismo/ }).getAttribute('href')).toBe('https://portalbelohorizonte.com.br/');
  });

  it('renders in English', async () => {
    await setLang('en');
    window.history.replaceState(null, '', `${BASE}experiencias`);
    await renderApp();
    expect(screen.getByRole('heading', { level: 1, name: 'Experiences' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Food and nightlife' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Pampulha Lake' })).toBeTruthy();
    expect(screen.getByText('UNESCO World Heritage')).toBeTruthy();
    expect(screen.queryByText('Coming soon')).toBeNull();
    expect(document.title).toBe("Experiences — CBSOFT'27");
  });
});
