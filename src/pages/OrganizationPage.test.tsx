import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { App } from '@/App';
import { renderApp } from '@/test/renderApp';

beforeEach(async () => {
  await i18n.changeLanguage('pt');
});

afterEach(() => {
  window.history.replaceState(null, '', import.meta.env.BASE_URL);
  vi.restoreAllMocks();
});

describe('OrganizationPage', () => {
  it('opens from the CBSOFT\'27 menu and shows partners and committee', async () => {
    window.history.replaceState(null, '', import.meta.env.BASE_URL);
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: "CBSOFT'27" })[0]);
    fireEvent.click(screen.getByRole('link', { name: /^Organização/ }));
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}organizacao`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Organização' })).toBeTruthy();
    expect(screen.getByText('Realização')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Quem organiza o CBSoft 2027/i })).toBeNull();

    const generalOrganization = screen.getByRole('region', { name: 'Organização Geral' });
    const photoBase = `${import.meta.env.BASE_URL}images/organization/`;
    const portraits = within(generalOrganization).getAllByRole('listitem');
    expect(portraits.map((person) => [person.querySelector('p')?.textContent, person.querySelector('img')?.getAttribute('src')])).toEqual([
      ['Laerte Xavier', photoBase + 'laerte-xavier.png'],
      ['João Eduardo Montandon', photoBase + 'joao-eduardo-montandon.jpg'],
      ['Johnatan Alves', photoBase + 'johnatan-alves.png'],
      ['Aline Brito', photoBase + 'aline-brito.jpg'],
      ['Lucas Vegi', photoBase + 'lucas-vegi.jpg'],
      ['Luciana Lourdes', photoBase + 'luciana-lourdes.jpg'],
    ]);
    expect(within(generalOrganization).queryByText('Coordenação Geral')).toBeNull();
    expect(within(generalOrganization).queryByText('Função a definir')).toBeNull();
    for (const affiliation of ['PUC Minas', 'UFMG', 'UFLA', 'UFOP', 'UFV', 'IFMG']) {
      expect(within(generalOrganization).getByText(affiliation)).toBeTruthy();
    }
    expect(screen.queryByRole('heading', { name: 'Coordenação do Programa Científico' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Comitê Local' })).toBeNull();
    const trackChairs = screen.getByRole('region', { name: 'Coordenação das Trilhas do SBES' });
    const trackPortraits = within(trackChairs).getAllByRole('listitem');
    expect(trackPortraits.map((person) => [person.querySelector('p')?.textContent, person.querySelector('img')?.getAttribute('src')])).toEqual([
      ['Thelma Colanzi', photoBase + 'thelma-colanzi.png'],
      ['Cleidson de Souza', photoBase + 'cleidson-de-souza.png'],
      ['Edna', undefined],
      ['Rodrigo Santos', photoBase + 'rodrigo-santos.png'],
      ['Simone Souza', photoBase + 'simone-souza.png'],
      ['Davi Viana', photoBase + 'davi-viana.png'],
      ['Patricia Matsubara', photoBase + 'patricia-matsubara.png'],
      ['Allyson Araújo', photoBase + 'allyson-araujo.png'],
    ]);
    const ideas = within(trackChairs).getByRole('region', { name: 'Trilha de Ideias Inovadoras e Resultados Emergentes' });
    expect(within(ideas).getByText('UnB')).toBeTruthy();
    expect(ideas.querySelector('.committee-portraits__placeholder')).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 2, name: 'Comitê Consultivo' })).toBeNull();
    expect(screen.queryByText('A definir')).toBeNull();

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

  it('opens from the mobile CBSOFT menu and closes the menu after navigating', async () => {
    window.history.replaceState(null, '', import.meta.env.BASE_URL);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const menu = screen.getByRole('navigation', { name: 'Navegação móvel' });
    fireEvent.click(within(menu).getByRole('button', { name: "CBSOFT'27" }));
    fireEvent.click(within(menu).getByRole('link', { name: /^Organização/ }));
    expect(window.location.pathname).toBe(`${import.meta.env.BASE_URL}organizacao`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Organização' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).toBeNull();
  });

  it('renders on direct access in English', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}organizacao`);
    await renderApp();
    expect(screen.getByRole('heading', { level: 1, name: 'Organization' })).toBeTruthy();
    expect(screen.getByText('Promoted by')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Who is organizing CBSoft 2027/i })).toBeNull();
    const generalOrganization = screen.getByRole('region', { name: 'General Organization' });
    expect(within(generalOrganization).getAllByRole('listitem')).toHaveLength(6);
    expect(within(generalOrganization).queryByText('General Chair')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Program Committee Chairs' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Local Committee' })).toBeNull();
    const trackChairs = screen.getByRole('region', { name: 'SBES Track Chairs' });
    expect(within(trackChairs).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Research Track',
      'New Ideas and Emerging Results Track',
      'Tools Track',
      'Education Track',
    ]);
    expect(screen.queryByRole('heading', { level: 2, name: 'Advisory Committee' })).toBeNull();
    expect(within(generalOrganization).queryByText('Role to be determined')).toBeNull();
    expect(screen.queryByText('To be determined')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Website Development' })).toBeTruthy();
    expect(screen.getAllByText('PUC Minas')).toHaveLength(3);
  });

  it('scrolls to the committee when opened with #comite', async () => {
    const original = Element.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      window.history.replaceState(null, '', `${import.meta.env.BASE_URL}organizacao#comite`);
      await renderApp();
      expect(scrollIntoView).toHaveBeenCalled();
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });
});
