import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { App } from '@/App';
import { VENUE } from '@/data/venue';
import { LocationPage } from './LocationPage';

const confirmedName = VENUE.name;
const confirmedAddress = VENUE.address;

beforeEach(async () => {
  await i18n.changeLanguage('pt');
  window.history.replaceState(null, '', import.meta.env.BASE_URL);
});

afterEach(() => {
  VENUE.name = confirmedName;
  VENUE.address = confirmedAddress;
  vi.restoreAllMocks();
  window.history.replaceState(null, '', import.meta.env.BASE_URL);
});

function renderPage() {
  return render(<MemoryRouter><LocationPage /></MemoryRouter>);
}

describe('event locality', () => {
  it('navigates from the home section to the venue route and provides a real map destination', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Localização.*PUC Minas/i }).getAttribute('href')).toBe(
      `${import.meta.env.BASE_URL}local`,
    );
    expect(screen.getByText('Ônibus — 5401, 9410, 4110 e 4111')).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Endereço, orientações e mapa' }));
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}local`);
    const heading = screen.getByRole('heading', { level: 1, name: 'Local do Evento' });
    expect(heading.previousElementSibling).toBeNull();
    expect(heading.firstElementChild?.matches('.brand-bar[aria-hidden="true"]')).toBe(true);
    expect(screen.queryByText(/Av\. Dom José Gaspar, 500/)).toBeNull();
    expect(screen.queryByText(/Ônibus — 5401/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Reproduzir o vídeo do CBSoft 2027' })).toBeNull();
    const map = screen.getByRole('link', { name: /Traçar rota no Google Maps/ });
    const destination = new URL(map.getAttribute('href')!).searchParams.get('destination');
    expect(destination).toContain('Coração Eucarístico');
    expect(destination).toContain('500');
    const embed = new URL(screen.getByTitle(/Google Maps: PUC Minas/).getAttribute('src')!);
    expect(embed.origin).toBe('https://www.google.com');
    expect(embed.pathname).toBe('/maps/embed');
    expect(embed.searchParams.get('pb')).toContain('Dom José Gaspar, 500');
    expect(screen.getByRole('link', { name: /Abrir no Google Maps/ }).getAttribute('href')).toBe(
      'https://www.google.com/maps?cid=5139803446538321391',
    );
    expect(screen.queryByText(/Campus Lourdes|Estação Central|Linha 4403|Raul Soares/)).toBeNull();
    expect(screen.queryByRole('img', { name: /Planta do campus/ })).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: 'Ver Mapa PUC' }));
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}mapa-puc`);
    expect(screen.getByRole('heading', { level: 1, name: 'Mapa PUC' })).toBeTruthy();
    expect(screen.queryByTitle(/Google Maps: PUC Minas/)).toBeNull();
  });

  it('loads the approved player only on demand and retains its YouTube fallback after poster failure', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.home-location__media iframe')).toBeNull();
    fireEvent.error(container.querySelector('.yt-poster')!);
    expect(container.querySelector('.yt-poster')).toBeNull();
    const fallback = screen.getByRole('link', { name: /Assistir no YouTube/ });
    expect(fallback.getAttribute('href')).toBe('https://www.youtube.com/watch?v=HPzwyRFs37I');
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir o vídeo do CBSoft 2027' }));
    const player = screen.getByTitle('CBSoft 2027 em Belo Horizonte');
    expect(player.getAttribute('src')).toContain('youtube-nocookie.com/embed/HPzwyRFs37I');
    expect(player.getAttribute('loading')).toBe('lazy');
    expect(screen.getByRole('link', { name: /Assistir no YouTube/ })).toBeTruthy();
  });

  it('provides English directions and preserves pending event access details', async () => {
    renderPage();
    await act(async () => { await i18n.changeLanguage('en'); });
    const heading = screen.getByRole('heading', { level: 1, name: 'Event Venue' });
    expect(heading.previousElementSibling).toBeNull();
    expect(heading.firstElementChild?.matches('.brand-bar[aria-hidden="true"]')).toBe(true);
    expect(screen.getByText(/The event entrance, building and rooms are still to be confirmed/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Get directions on Google Maps/ })).toBeTruthy();
    expect(screen.getByTitle('Google Maps: PUC Minas — Coração Eucarístico Campus')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'View PUC Campus Map' }).getAttribute('href')).toBe(
      '/mapa-puc',
    );
  });

  it('hides address, transport and navigation if the venue is no longer confirmed', () => {
    VENUE.name = null;
    VENUE.address = null;
    const { container } = renderPage();
    expect(screen.getAllByText('Local a confirmar').length).toBeGreaterThan(0);
    expect(container.querySelector('address')).toBeNull();
    expect(container.querySelector('.venue-transit')).toBeNull();
    expect(screen.queryByRole('link', { name: /Traçar rota/ })).toBeNull();
    expect(screen.queryByTitle(/Google Maps: PUC Minas/)).toBeNull();
    expect(screen.queryByRole('link', { name: 'Ver Mapa PUC' })).toBeNull();
  });

  it.each(['desktop', 'mobile'])('opens each map from the %s navigation', (mode) => {
    const scroll = vi.fn();
    const previous = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scroll;
    const openMenu = () => {
      if (mode === 'mobile') {
        fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
        const navigation = screen.getByRole('navigation', { name: 'Navegação móvel' });
        fireEvent.click(within(navigation).getByRole('button', { name: "CBSOFT'27" }));
      } else {
        fireEvent.click(screen.getByRole('button', { name: "CBSOFT'27" }));
      }
    };

    try {
      render(<App />);
      openMenu();
      expect(screen.queryByRole('link', { name: /Eventos sociais/i })).toBeNull();
      fireEvent.click(screen.getByRole('link', { name: 'Local do Evento' }));
      expect(window.location.hash).toBe('#mapa');
      const googleMap = screen.getByRole('region', { name: 'Mapa e navegação' });
      expect(scroll.mock.contexts.at(-1)).toBe(googleMap);
      expect(within(googleMap).getByTitle(/Google Maps: PUC Minas/)).toBeTruthy();

      openMenu();
      fireEvent.click(screen.getByRole('link', { name: 'Mapa PUC' }));
      expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}mapa-puc`);
      expect(window.location.hash).toBe('');
      const campusMap = screen.getByRole('region', { name: 'Mapa PUC' });
      const image = within(campusMap).getByRole('img', { name: /Planta do campus/ });
      const path = `${import.meta.env.BASE_URL}assets/images/mapa-puc-coracao-eucaristico.png`;
      expect(image.getAttribute('src')).toBe(path);
      expect(image.getAttribute('width')).toBe('768');
      expect(image.getAttribute('height')).toBe('1024');
      expect(within(campusMap).getByRole('link', { name: /Ver mapa em tamanho original/ }).getAttribute('href')).toBe(path);
    } finally {
      Element.prototype.scrollIntoView = previous;
    }
  });

  it('redirects the former campus-map anchor to the dedicated page', () => {
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}local#mapa-puc`);
    render(<App />);
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}mapa-puc`);
    expect(window.location.hash).toBe('');
    expect(document.title).toBe('Mapa PUC | CBSOFT 2027');
    expect(screen.getByRole('heading', { level: 1, name: 'Mapa PUC' })).toBeTruthy();
  });
});
