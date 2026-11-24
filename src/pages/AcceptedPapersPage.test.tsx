import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { SBES_TRACKS } from '@/data/sbesTracks';
import { AcceptedPapersPage } from './AcceptedPapersPage';

beforeEach(async () => {
  await i18n.changeLanguage('pt');
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/artigos-aceitos" element={<AcceptedPapersPage />} />
        <Route path="/sbes/:track/artigos-aceitos" element={<AcceptedPapersPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AcceptedPapersPage', () => {
  it.each([
    ['pt', 'Artigos Aceitos', /será divulgada após a notificação/],
    ['en', 'Accepted Papers', /will be published after authors are notified/],
  ])('puts the shared page title first in %s', async (lang, title, notice) => {
    await i18n.changeLanguage(lang);
    renderAt('/artigos-aceitos');
    const heading = screen.getByRole('heading', { level: 1, name: title });
    expect(heading.previousElementSibling).toBeNull();
    expect(heading.firstElementChild?.matches('.brand-bar[aria-hidden="true"]')).toBe(true);
    expect(screen.queryByText('CBSoft 2027')).toBeNull();
    expect(screen.getByText(notice)).toBeTruthy();
  });

  it.each([
    ['pt', 'Artigos Aceitos', 'Trilha de Educação', 'Trilha de Pesquisa', /será divulgada após a notificação/],
    ['en', 'Accepted Papers', 'Education Track', 'Research Track', /will be published after authors are notified/],
  ])('shows the track below the title and a pending notice in %s', async (lang, title, current, other, notice) => {
    await i18n.changeLanguage(lang);
    renderAt('/sbes/educacao/artigos-aceitos');
    const heading = screen.getByRole('heading', { level: 1, name: title });
    expect(heading.previousElementSibling).toBeNull();
    expect(heading.firstElementChild?.matches('.brand-bar[aria-hidden="true"]')).toBe(true);
    expect(heading.nextElementSibling).toBe(screen.getByText(`SBES · ${current}`));
    expect(screen.getByText(notice)).toBeTruthy();
    expect(screen.getByRole('link', { name: other }).getAttribute('href')).toBe(
      '/sbes/pesquisa/artigos-aceitos',
    );
    expect(screen.getAllByRole('link')).toHaveLength(6);
  });

  it('lists article titles and authors when papers are available', () => {
    const track = SBES_TRACKS.find(({ id }) => id === 'research')!;
    track.papers.push({ title: 'Artigo de exemplo', authors: ['Autora A', 'Autor B'] });
    try {
      renderAt('/sbes/pesquisa/artigos-aceitos');
      expect(screen.getByText('Artigo de exemplo')).toBeTruthy();
      expect(screen.getByText('Autora A, Autor B')).toBeTruthy();
      expect(screen.queryByText(/será divulgada após a notificação/)).toBeNull();
    } finally {
      track.papers.pop();
    }
  });

  it('handles an unknown track', () => {
    renderAt('/sbes/inexistente/artigos-aceitos');
    expect(screen.getByRole('heading', { level: 1, name: 'Trilha não encontrada.' })).toBeTruthy();
  });
});
