import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { Header } from './Header';

beforeEach(async () => {
  await i18n.changeLanguage('pt');
});

function renderHeader(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Header /></MemoryRouter>);
}

function BackButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Voltar</button>;
}

it('reveals the SBC logo only when scrolling up at the top of the current visit', () => {
  const sbcLink = () => screen.queryByRole('link', { name: /Sociedade Brasileira de Computação/ });
  vi.stubGlobal('scrollY', 0);
  try {
    render(
      <MemoryRouter initialEntries={['/sobre']}>
        <Header />
        <BackButton />
      </MemoryRouter>,
    );
    expect(sbcLink()).toBeNull();

    fireEvent.wheel(window, { deltaY: 20 });
    vi.stubGlobal('scrollY', 120);
    fireEvent.scroll(window);
    expect(sbcLink()).toBeNull();

    fireEvent.wheel(window, { deltaY: -20 });
    vi.stubGlobal('scrollY', 100);
    fireEvent.scroll(window);
    expect(sbcLink()).toBeNull();

    vi.stubGlobal('scrollY', 0);
    fireEvent.scroll(window);
    expect(sbcLink()).toBeTruthy();

    fireEvent.wheel(window, { deltaY: 20 });
    expect(sbcLink()).toBeNull();

    fireEvent.keyDown(document.body, { key: 'ArrowUp' });
    expect(sbcLink()).toBeTruthy();

    fireEvent.click(screen.getByRole('link', { name: 'Inscreva-se' }));
    fireEvent.scroll(window);
    expect(sbcLink()).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    fireEvent.scroll(window);
    expect(sbcLink()).toBeNull();

    fireEvent.wheel(window, { deltaY: -20 });
    expect(sbcLink()).toBeTruthy();
  } finally {
    vi.unstubAllGlobals();
  }
});

it('opens the desktop menu and track with the arrow keys and restores focus with Escape', () => {
  renderHeader('/');
  const sbes = screen.getByRole('button', { name: 'SBES' });
  sbes.focus();
  fireEvent.keyDown(sbes, { key: 'ArrowDown' });

  const track = screen.getByRole('button', { name: 'Trilha de Pesquisa' });
  expect(document.activeElement).toBe(track);
  fireEvent.keyDown(track, { key: 'ArrowRight' });

  const call = screen.getByRole('link', { name: 'Chamada de Trabalhos' });
  expect(document.activeElement).toBe(call);
  fireEvent.keyDown(call, { key: 'Escape' });
  expect(document.activeElement).toBe(track);
  expect(track.getAttribute('aria-expanded')).toBe('false');

  fireEvent.keyDown(track, { key: 'Escape' });
  expect(document.activeElement).toBe(sbes);
  expect(sbes.getAttribute('aria-expanded')).toBe('false');
});

describe('Header current section', () => {
  it.each([
    ['/', "CBSOFT'27"],
    ['/local#mapa', "CBSOFT'27"],
    ['/sbes/educacao/chamada', 'SBES'],
    ['/sbes/pesquisa/artigos-aceitos', 'SBES'],
    ['/sblp/chamada', 'SBLP'],
    ['/sbcars/chamada', 'SBCARS'],
    ['/sast/chamada', 'SAST'],
    ['/sblp/artigos-aceitos', 'SBLP'],
    ['/sbcars/artigos-aceitos', 'SBCARS'],
    ['/sast/artigos-aceitos', 'SAST'],
    ['/artigos-aceitos', "CBSOFT'27"],
    ['/workshops/chamada', 'WORKSHOPS'],
  ])('marks only the current section at %s', (path, label) => {
    const { container } = renderHeader(path);
    const current = screen.getByRole('button', { name: label });
    expect(current.classList.contains('is-current')).toBe(true);
    expect(current.getAttribute('aria-current')).toBe('location');
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(1);
    expect(current.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the current symposium highlighted when opening a different menu', () => {
    renderHeader('/sast/chamada');
    const current = screen.getByRole('button', { name: 'SAST' });
    const other = screen.getByRole('button', { name: 'SBLP' });
    fireEvent.click(other);
    expect(current.getAttribute('aria-current')).toBe('location');
    expect(other.hasAttribute('aria-current')).toBe(false);
    fireEvent.keyDown(other, { key: 'Escape' });
    expect(other.getAttribute('aria-expanded')).toBe('false');
    expect(current.classList.contains('is-current')).toBe(true);
  });

  it('updates the highlight after navigation and when returning home', () => {
    renderHeader('/sast/chamada');
    fireEvent.click(screen.getByRole('button', { name: 'SBLP' }));
    fireEvent.click(screen.getByRole('link', { name: /Chamada de Trabalhos/ }));
    expect(screen.getByRole('button', { name: 'SBLP' }).getAttribute('aria-current')).toBe('location');
    expect(screen.getByRole('button', { name: 'SAST' }).hasAttribute('aria-current')).toBe(false);
    fireEvent.click(screen.getByRole('link', { name: /página inicial/ }));
    expect(screen.getByRole('button', { name: "CBSOFT'27" }).getAttribute('aria-current')).toBe('location');
  });

  it('keeps the same current section on mobile after navigating', () => {
    renderHeader('/sbes/educacao/chamada');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const menu = screen.getByRole('navigation', { name: 'Navegação móvel' });
    expect(within(menu).getByRole('button', { name: 'SBES' }).getAttribute('aria-current')).toBe('location');
    fireEvent.click(within(menu).getByRole('button', { name: 'SBCARS' }));
    fireEvent.click(within(menu).getByRole('link', { name: /Chamada de Trabalhos/ }));
    expect(screen.queryByRole('navigation', { name: 'Navegação móvel' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const updatedMenu = screen.getByRole('navigation', { name: 'Navegação móvel' });
    expect(within(updatedMenu).getByRole('button', { name: 'SBCARS' }).getAttribute('aria-current')).toBe('location');
    expect(within(updatedMenu).getByRole('button', { name: 'SBES' }).hasAttribute('aria-current')).toBe(false);
  });
});

describe('Header current section on accepted-papers pages', () => {
  const current = (root: HTMLElement = document.body) =>
    within(root)
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-current') === 'location')
      .map((button) => button.textContent);

  it('highlights no symposium on the general list', () => {
    renderHeader('/artigos-aceitos');
    expect(current()).toEqual(["CBSOFT'27"]);
  });

  it('follows the symposium when moving between accepted-papers pages', () => {
    renderHeader('/');
    for (const symposium of ['SBCARS', 'SBLP', 'SAST']) {
      fireEvent.click(screen.getByRole('button', { name: symposium }));
      fireEvent.click(screen.getByRole('link', { name: /Artigos Aceitos/ }));
      expect(current()).toEqual([symposium]);
    }
  });

  it("highlights SBES from a track's accepted papers", () => {
    renderHeader('/sbcars/artigos-aceitos');
    fireEvent.click(screen.getByRole('button', { name: 'SBES' }));
    fireEvent.click(screen.getByRole('button', { name: /Trilha de Pesquisa/ }));
    fireEvent.click(screen.getByRole('link', { name: 'Artigos Aceitos' }));
    expect(current()).toEqual(['SBES']);
  });

  it('highlights the symposium in the mobile menu', () => {
    renderHeader('/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    let menu = screen.getByRole('navigation', { name: 'Navegação móvel' });
    fireEvent.click(within(menu).getByRole('button', { name: 'SBCARS' }));
    fireEvent.click(within(menu).getByRole('link', { name: /Artigos Aceitos/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    menu = screen.getByRole('navigation', { name: 'Navegação móvel' });
    expect(current(menu)).toEqual(['SBCARS']);
  });
});
