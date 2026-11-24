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
  ['pt', 'Sobre', 'Acomodações'],
  ['en', 'About', 'Accommodation'],
])('shows only the translated labels and keeps the congress destinations in %s', async (lang, about, accommodation) => {
  await i18n.changeLanguage(lang);
  render(
    <MemoryRouter>
      <HeaderMegaMenu id="cbsoft" menu={HEADER_MENUS.cbsoft} onNavigate={() => {}} />
    </MemoryRouter>,
  );
  expect(screen.getByRole('link', { name: about }).getAttribute('href')).toBe('/sobre');
  expect(screen.getByRole('link', { name: accommodation }).getAttribute('href')).toBe('/acomodacoes');
  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(8);
  for (const link of links) {
    expect(link.querySelector('[aria-hidden="true"]')?.textContent).toBe('›');
  }
});

function renderSbes(mobile = false) {
  return render(
    <MemoryRouter>
      <HeaderMegaMenu id="sbes" menu={HEADER_MENUS.sbes} onNavigate={() => {}} mobile={mobile} />
    </MemoryRouter>,
  );
}

describe('HeaderMegaMenu — SBES tracks', () => {
  it('lists the seven tracks without the special 40-year track', () => {
    const { container } = renderSbes();
    expect(container.querySelectorAll('.header-mega-menu__group-trigger')).toHaveLength(7);
    expect(container.textContent).not.toMatch(/Especial|40 Anos/);
  });

  it('opens a track flyout on hover and closes it when the menu scrolls', () => {
    const { container } = renderSbes();
    const trigger = screen.getByRole('button', { name: /Trilha de Educação/ });
    const chevron = trigger.querySelector('[aria-hidden="true"]');
    expect(chevron?.textContent).toBe('›');
    fireEvent(trigger, Object.assign(new MouseEvent('pointerover', { bubbles: true }), { pointerType: 'mouse' }));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(chevron?.textContent).toBe('»');

    const flyout = screen.getByRole('group', { name: 'Trilha de Educação' });
    const call = within(flyout).getByRole('link', { name: 'Chamada de Trabalhos' });
    const papers = within(flyout).getByRole('link', { name: 'Artigos Aceitos' });
    expect(call.getAttribute('href')).toBe('/sbes/educacao/chamada');
    expect(papers.getAttribute('href')).toBe('/artigos-aceitos');
    expect(call.querySelector('[aria-hidden="true"]')?.textContent).toBe('›');
    expect(papers.querySelector('[aria-hidden="true"]')?.textContent).toBe('›');

    fireEvent.scroll(container.querySelector('.header-mega-menu__content')!);
    expect(screen.queryByRole('group')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(chevron?.textContent).toBe('›');
  });

  it('expands the links inline on mobile', () => {
    renderSbes(true);
    const trigger = screen.getByRole('button', { name: /Trilha de Pesquisa/ });
    fireEvent.click(trigger);
    expect(trigger.querySelector('[aria-hidden="true"]')?.textContent).toBe('›');
    expect(screen.getByRole('link', { name: 'Artigos Aceitos' }).getAttribute('href')).toBe('/artigos-aceitos');
  });
});
