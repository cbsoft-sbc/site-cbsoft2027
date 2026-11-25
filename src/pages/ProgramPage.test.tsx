import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import { App } from '@/App';
import { PROGRAM_FIXTURE } from '@/test/programFixture';
import { ProgramPage } from './ProgramPage';

let search = '';
function LocationProbe() {
  search = useLocation().search;
  return null;
}

function renderProgram(url = '/programacao') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/programacao" element={<><ProgramPage program={PROGRAM_FIXTURE} /><LocationProbe /></>} />
      </Routes>
    </MemoryRouter>,
  );
}

const sessionTitles = () => screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);
const param = (name: string) => new URLSearchParams(search).get(name);

beforeEach(async () => {
  await i18n.changeLanguage('pt');
  window.scrollTo = vi.fn();
});

afterEach(() => {
  window.history.replaceState(null, '', import.meta.env.BASE_URL);
});

describe('ProgramPage — pending', () => {
  it('shows "Em breve" at /programacao while the official program is pending', () => {
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}programacao`);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Programação' })).toBeTruthy();
    expect(screen.getByText('Em breve')).toBeTruthy();
    expect(screen.queryByRole('search')).toBeNull();
    expect(document.title).toBe("Programação — CBSOFT'27");
  });

  it('shows "Coming soon" in English', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    window.history.replaceState(null, '', `${import.meta.env.BASE_URL}programacao`);
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Schedule' })).toBeTruthy();
    expect(screen.getByText('Coming soon')).toBeTruthy();
  });
});

describe('ProgramPage — days', () => {
  it('opens on the first day and switches days', () => {
    renderProgram();
    const days = screen.getByRole('group', { name: 'Dias da programação' });
    const [day1, day2] = within(days).getAllByRole('button');
    expect(day1.getAttribute('aria-pressed')).toBe('true');
    expect(sessionTitles()).toEqual([
      'Abertura do CBSoft',
      'Sessão Técnica: Testes de Software',
      'Sessão Técnica: Compiladores',
    ]);

    fireEvent.click(day2);
    expect(day2.getAttribute('aria-pressed')).toBe('true');
    expect(param('dia')).toBe('2027-09-29');
    expect(sessionTitles()).toEqual(['Palestra: IA e Engenharia de Software', 'Workshop de Educação']);
    expect(screen.getByText('Horário a confirmar')).toBeTruthy();
  });

  it('opens the day given in the URL and ignores an unknown one', () => {
    renderProgram('/programacao?dia=2027-09-29');
    expect(sessionTitles()[0]).toBe('Palestra: IA e Engenharia de Software');
    renderProgram('/programacao?dia=2030-01-01');
    expect(screen.getAllByRole('heading', { level: 3 })).toBeTruthy();
  });
});

describe('ProgramPage — search and filters', () => {
  it('searches by title or speaker, ignoring accents', () => {
    renderProgram();
    const input = screen.getByRole('searchbox', { name: 'Buscar' });

    fireEvent.change(input, { target: { value: 'compiladores' } });
    expect(sessionTitles()).toEqual(['Sessão Técnica: Compiladores']);
    expect(screen.getByText('1 atividade')).toBeTruthy();
    expect(param('q')).toBe('compiladores');

    fireEvent.change(input, { target: { value: 'carla pereira' } });
    expect(sessionTitles()).toEqual(['Sessão Técnica: Testes de Software']);

    fireEvent.change(input, { target: { value: 'marcia' } });
    expect(sessionTitles()).toEqual([]);
    expect(screen.getByText(/Nenhuma atividade encontrada/)).toBeTruthy();
    // The day tabs show where the matches are.
    const days = screen.getByRole('group', { name: 'Dias da programação' });
    expect(within(days).getAllByRole('button').map((b) => b.textContent?.slice(-1))).toEqual(['0', '1']);
  });

  it('filters by symposium, SBES track and category', () => {
    renderProgram();
    fireEvent.change(screen.getByRole('combobox', { name: 'Simpósio ou evento' }), { target: { value: 'sblp' } });
    expect(sessionTitles()).toEqual(['Sessão Técnica: Compiladores']);
    expect(param('simposio')).toBe('sblp');

    // Choosing a track switches the symposium to SBES.
    fireEvent.change(screen.getByRole('combobox', { name: 'Trilha do SBES' }), { target: { value: 'research' } });
    expect(sessionTitles()).toEqual(['Sessão Técnica: Testes de Software']);
    expect(param('simposio')).toBe('sbes');
    expect(param('trilha')).toBe('research');

    fireEvent.click(screen.getAllByRole('button', { name: 'Limpar filtros' })[0]);
    fireEvent.change(screen.getByRole('combobox', { name: 'Categoria' }), { target: { value: 'opening' } });
    expect(sessionTitles()).toEqual(['Abertura do CBSoft']);
  });

  it('restores filters from the URL and keeps them when changing day', () => {
    renderProgram('/programacao?simposio=cbsoft&q=palestra');
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('palestra');
    expect((screen.getByRole('combobox', { name: 'Simpósio ou evento' }) as HTMLSelectElement).value).toBe('cbsoft');
    expect(sessionTitles()).toEqual([]);

    const days = screen.getByRole('group', { name: 'Dias da programação' });
    fireEvent.click(within(days).getAllByRole('button')[1]);
    expect(sessionTitles()).toEqual(['Palestra: IA e Engenharia de Software']);
    expect(param('simposio')).toBe('cbsoft');
    expect(param('q')).toBe('palestra');
  });
});

describe('ProgramPage — views and calendar', () => {
  it('switches to the grid by room', () => {
    renderProgram();
    fireEvent.click(screen.getByRole('button', { name: 'Grade por sala' }));
    expect(param('visao')).toBe('grade');
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
      'Horário',
      'Auditório 1',
      'Sala 2',
    ]);
  });

  it('offers "Add to calendar" only for sessions with a confirmed time', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderProgram('/programacao?dia=2027-09-29');
    const buttons = screen.getAllByRole('button', { name: /Adicionar ao calendário/ });
    expect(buttons).toHaveLength(1); // the workshop has no time yet

    fireEvent.click(buttons[0]);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Google Calendar' }));
    const url = decodeURIComponent(String(open.mock.calls[0][0]));
    expect(url).toContain('20270929T120000Z/20270929T130000Z');
    expect(url).toContain('CBSoft — Palestra: IA e Engenharia de Software');
    expect(url).toContain('Auditório 1');
    open.mockRestore();
  });

  it('renders in English', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    renderProgram();
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeTruthy();
    expect(sessionTitles()[0]).toBe('CBSoft Opening');
    expect(screen.getByRole('button', { name: 'Grid by room' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /Add to calendar/ }).length).toBeGreaterThan(0);
  });
});
