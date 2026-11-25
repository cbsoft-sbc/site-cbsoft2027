import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { App } from '@/App';

beforeEach(async () => {
  await i18n.changeLanguage('pt');
});

afterEach(() => {
  window.history.replaceState(null, '', import.meta.env.BASE_URL);
  vi.restoreAllMocks();
});

describe('OrganizationPage', () => {
  it('opens from the CBSOFT\'27 menu and shows partners and committee', () => {
    window.history.replaceState(null, '', import.meta.env.BASE_URL);
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: "CBSOFT'27" })[0]);
    fireEvent.click(screen.getByRole('link', { name: /^Organização/ }));
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}organizacao`);
    expect(screen.getByRole('heading', { level: 1, name: 'Organização' })).toBeTruthy();
    expect(screen.getByText('Realização')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Quem organiza o CBSOFT 2027' })).toBeNull();

    const chairs = screen.getByRole('region', { name: 'Coordenação Geral' });
    const chair = within(chairs).getByRole('listitem');
    expect(within(chair).getByText('José Laerte Xavier')).toBeTruthy();
    expect(within(chair).getByText('PUC Minas')).toBeTruthy();
    expect(chair.querySelector('img')?.getAttribute('src')).toBe(
      `${import.meta.env.BASE_URL}images/organization/jose-laerte-xavier.jpg`,
    );

    const website = screen.getByRole('region', { name: 'Website' });
    const team = within(website).getAllByRole('listitem');
    expect(within(team[0]).getByText('Abner Almeida')).toBeTruthy();
    expect(within(team[1]).getByText('Enzo Casaes')).toBeTruthy();
    expect(within(website).getAllByText('PUC Minas')).toHaveLength(2);
    expect(website.compareDocumentPosition(screen.getByText('Realização')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(team.map((person) => person.querySelector('img')?.getAttribute('src'))).toEqual([
      `${import.meta.env.BASE_URL}images/organization/abner-almeida.jpg`,
      `${import.meta.env.BASE_URL}images/organization/enzo-casaes.jpg`,
    ]);
  });

  it('opens from the mobile CBSOFT menu and closes the menu after navigating', () => {
    window.history.replaceState(null, '', import.meta.env.BASE_URL);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const menu = screen.getByRole('navigation', { name: 'Navegação móvel' });
    fireEvent.click(within(menu).getByRole('button', { name: "CBSOFT'27" }));
    fireEvent.click(within(menu).getByRole('link', { name: /^Organização/ }));
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}organizacao`);
    expect(screen.getByRole('heading', { level: 1, name: 'Organização' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).toBeNull();
  });

  it('renders on direct access in English', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}organizacao`);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Organization' })).toBeTruthy();
    expect(screen.getByText('Promoted by')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Who is organizing CBSOFT 2027' })).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'General Chairs' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Website Development' })).toBeTruthy();
    expect(screen.getAllByText('PUC Minas')).toHaveLength(3);
  });

  it('scrolls to the committee when opened with #comite', () => {
    const original = Element.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      window.history.replaceState(null, '', `${import.meta.env.BASE_URL}organizacao#comite`);
      render(<App />);
      expect(scrollIntoView).toHaveBeenCalled();
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });
});
