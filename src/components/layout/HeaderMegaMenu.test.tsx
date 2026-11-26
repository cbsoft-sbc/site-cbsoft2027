import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { HEADER_MENUS } from '@/data/headerMenu';
import { HeaderMegaMenu } from './HeaderMegaMenu';

beforeEach(async () => {
  await i18n.changeLanguage('pt');
});

it.each([
  ['pt', 'Sobre', 'Acomodações', 'Programação', 'Experiências'],
  ['en', 'About', 'Accommodation', 'Schedule', 'Experiences'],
])('shows only the translated labels and keeps the congress destinations in %s', async (lang, about, accommodation, program, experiences) => {
  await i18n.changeLanguage(lang);
  render(
    <MemoryRouter>
      <HeaderMegaMenu id="cbsoft" menu={HEADER_MENUS.cbsoft} onNavigate={() => {}} />
    </MemoryRouter>,
  );
  expect(screen.getByRole('link', { name: about }).getAttribute('href')).toBe('/sobre');
  expect(screen.getByRole('link', { name: accommodation }).getAttribute('href')).toBe('/acomodacoes');
  expect(screen.getByRole('link', { name: program }).getAttribute('href')).toBe('/programacao');
  expect(screen.getByRole('link', { name: experiences }).getAttribute('href')).toBe('/experiencias');
  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(10);
  for (const link of links) {
    expect(link.querySelector('.header-mega-menu__chevron')).toBeNull();
  }
});

function renderSymposiumMenu(id: 'sbes' | 'sblp' | 'sbcars' | 'sast', mobile = false) {
  return render(
    <MemoryRouter>
      <HeaderMegaMenu id={id} menu={HEADER_MENUS[id]} onNavigate={() => {}} mobile={mobile} />
    </MemoryRouter>,
  );
}

it.each([
  ['pt', false, 'Trilhas do SBES', 'Programa'],
  ['en', true, 'SBES tracks', 'Program'],
])('keeps the SBES headings and shows SBLP, SBCARS, and SAST links without headings in %s', async (lang, mobile, tracksTitle, programTitle) => {
  await i18n.changeLanguage(lang);
  const sbes = renderSymposiumMenu('sbes', mobile);
  expect(screen.getAllByRole('heading').map((heading) => heading.textContent)).toEqual([tracksTitle, programTitle]);
  expect(screen.getByRole('link', { name: lang === 'pt' ? 'Programação' : 'Schedule' }).getAttribute('href'))
    .toBe('/programacao?simposio=sbes');
  sbes.unmount();

  for (const id of ['sblp', 'sbcars', 'sast'] as const) {
    const menu = renderSymposiumMenu(id, mobile);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      `/${id}/chamada`,
      `/programacao?simposio=${id}`,
      `/${id}/artigos-aceitos`,
    ]);
    menu.unmount();
  }
});

describe('HeaderMegaMenu — SBES tracks', () => {
  it('lists the seven tracks without the special 40-year track', () => {
    const { container } = renderSymposiumMenu('sbes');
    expect(container.querySelectorAll('.header-mega-menu__group-trigger')).toHaveLength(7);
    expect(container.textContent).not.toMatch(/Especial|40 Anos/);
  });

  it('opens a track flyout on hover and closes it when the menu scrolls', () => {
    const { container } = renderSymposiumMenu('sbes');
    const trigger = screen.getByRole('button', { name: /Trilha de Educação/ });
    const chevron = trigger.querySelector('[aria-hidden="true"]');
    expect(chevron?.textContent).toBe('>');
    fireEvent(trigger, Object.assign(new MouseEvent('pointerover', { bubbles: true }), { pointerType: 'mouse' }));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    const flyout = screen.getByRole('group', { name: 'Trilha de Educação' });
    const call = within(flyout).getByRole('link', { name: 'Chamada de Trabalhos' });
    const papers = within(flyout).getByRole('link', { name: 'Artigos Aceitos' });
    expect(call.getAttribute('href')).toBe('/sbes/educacao/chamada');
    expect(papers.getAttribute('href')).toBe('/sbes/educacao/artigos-aceitos');
    expect(call.querySelector('.header-mega-menu__chevron')).toBeNull();
    expect(papers.querySelector('.header-mega-menu__chevron')).toBeNull();

    fireEvent.scroll(container.querySelector('.header-mega-menu__content')!);
    expect(screen.queryByRole('group')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(chevron?.textContent).toBe('>');
  });

  it('expands the links inline on mobile', () => {
    renderSymposiumMenu('sbes', true);
    const trigger = screen.getByRole('button', { name: /Trilha de Pesquisa/ });
    fireEvent.click(trigger);
    expect(trigger.querySelector('[aria-hidden="true"]')?.textContent).toBe('>');
    const papers = screen.getByRole('link', { name: 'Artigos Aceitos' });
    expect(papers.getAttribute('href')).toBe('/sbes/pesquisa/artigos-aceitos');
    expect(papers.querySelector('.header-mega-menu__chevron')).toBeNull();
  });
});
