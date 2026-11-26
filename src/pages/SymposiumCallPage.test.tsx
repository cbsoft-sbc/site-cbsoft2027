import { act, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { SBES_TRACK_CALLS, SYMPOSIUM_CALLS, type SymposiumCall } from '@/data/symposiumCalls';
import type { SymposiumId } from '@/data/symposia';
import type { SbesTrackId } from '@/data/sbesTracks';
import { SymposiumCallPage } from './SymposiumCallPage';

beforeEach(async () => {
  await act(async () => { await i18n.changeLanguage('pt'); });
});

const memberCount = (call: SymposiumCall) =>
  call.committees.reduce((total, committee) => total + committee.members.length, 0);

function renderPage(id: SymposiumId, track?: SbesTrackId) {
  return render(
    <MemoryRouter>
      <SymposiumCallPage id={id} track={track} />
    </MemoryRouter>,
  );
}

describe('SymposiumCallPage', () => {
  it('shows the SAST call with its sections, dates and committee', () => {
    const call = SYMPOSIUM_CALLS.sast!;
    renderPage('sast');
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Simpósio Brasileiro de Teste de Software Sistemático e Automatizado (SAST)',
      }),
    ).toBeTruthy();
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByRole('heading', { level: 2, name: 'Comitê de Programa' })).toBeTruthy();
    expect(screen.getAllByText('A definir')).toHaveLength(call.milestones.length + memberCount(call));
    expect(screen.queryByText('Roberta Coelho')).toBeNull();
    expect(
      screen.getByRole('link', { name: /Código de Conduta para Autores/ }).getAttribute('href'),
    ).toBe('https://sol.sbc.org.br/index.php/indice/conduta');
  });

  it('shows the SBCARS call with bold labels and no 2026 leftovers', () => {
    const call = SYMPOSIUM_CALLS.sbcars!;
    const { container } = renderPage('sbcars');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByText('Artigos de Dados:').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'Anonymous GitHub' }).getAttribute('href')).toBe(
      'https://anonymous.4open.science/',
    );
    expect(container.textContent).not.toMatch(/2026|São Paulo/);
  });

  it('switches the call text to English', async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
    renderPage('sast');
    expect(screen.getByRole('heading', { level: 2, name: 'Topics of Interest' })).toBeTruthy();
    expect(screen.getByText('AI-assisted software testing')).toBeTruthy();
    expect(screen.getByText('Adenilso Simão')).toBeTruthy();
    expect(screen.getByText('To be determined')).toBeTruthy();
  });

  it('shows the SBLP call with its dates note and no named contact', () => {
    const call = SYMPOSIUM_CALLS.sblp!;
    const { container } = renderPage('sblp');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByText(call.datesNote!.pt)).toBeTruthy();
    expect(container.textContent).not.toMatch(/2026|Anderson|afsilva/);
  });

  it('shows the SBES Research Track call under the track name', () => {
    const call = SBES_TRACK_CALLS.research!;
    const { container } = renderPage('sbes', 'research');
    expect(screen.getByRole('heading', { level: 1, name: 'SBES — Trilha de Pesquisa' })).toBeTruthy();
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(container.textContent).toContain('41st Brazilian Symposium on Software Engineering');
    expect(container.textContent).not.toMatch(/São Paulo|forms\.gle|Monalessa|\bx{3,}\b/i);
  });

  it('shows the SBES Education Track call with the shared SBES sections', () => {
    const call = SBES_TRACK_CALLS.education!;
    const { container } = renderPage('sbes', 'education');
    expect(screen.getByRole('heading', { level: 1, name: 'SBES — Trilha de Educação' })).toBeTruthy();
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(container.textContent).toContain('A Trilha de Educação do SBES 2027 adota um processo de revisão duplo-anônimo');
    expect(container.textContent).not.toMatch(/2026|São Paulo|Awdren|Carla Bezerra/);
  });

  it('shows the SBES Ideas Track call', () => {
    const call = SBES_TRACK_CALLS.ideas!;
    const { container } = renderPage('sbes', 'ideas');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(container.textContent).toContain('no máximo 6 (seis) páginas');
    expect(container.textContent).not.toMatch(/São Paulo|SBES 2025|Thelma|Cleidson/);
  });

  it('shows the SBES Tools Track call without the anonymous option', () => {
    const call = SBES_TRACK_CALLS.tools!;
    const { container } = renderPage('sbes', 'tools');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByText('\\documentclass[sigconf]{acmart}')).toBeTruthy();
    expect(container.textContent).not.toMatch(/sigconf,anonymous|São Paulo|SBES 2026|Edna/);
  });

  it('shows the SBES Industry Track call with coordination still pending', () => {
    const call = SBES_TRACK_CALLS.industry!;
    const { container } = renderPage('sbes', 'industry');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByText(call.datesNote!.pt)).toBeTruthy();
    expect(screen.getAllByText('A definir')).toHaveLength(call.milestones.length + call.chairs.length + memberCount(call));
    expect(container.textContent).not.toMatch(/2026|Aniche|Alura|Nubank/);
  });

  it('shows the CTIC-ES call with a pending organisation card and no named organisers', () => {
    const call = SBES_TRACK_CALLS.ctic!;
    const { container } = renderPage('sbes', 'ctic');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByRole('heading', { level: 2, name: 'Organização' })).toBeTruthy();
    expect(screen.getAllByText('A definir')).toHaveLength(call.milestones.length + call.chairs.length + memberCount(call));
    expect(container.textContent).toContain('VIII CTIC-ES');
    expect(container.textContent).not.toMatch(/VII CTIC|Accioly|phyllipe|setembro de 2026/);
  });

  it('shows the CTD-ES call with its two evaluation committees', () => {
    const call = SBES_TRACK_CALLS.ctd!;
    const { container } = renderPage('sbes', 'ctd');
    for (const section of call.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title.pt })).toBeTruthy();
    }
    expect(screen.getByRole('heading', { level: 2, name: 'Comitê Avaliador das Dissertações' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Comitê Avaliador das Teses' })).toBeTruthy();
    expect(screen.getAllByText('A definir')).toHaveLength(call.milestones.length + call.chairs.length + memberCount(call));
    expect(container.textContent).not.toMatch(/2025|SBES 2026|\bII Mostra|Felizardo|Travassos/);
  });

  it.each([
    { id: 'sblp', people: [['Fernando Pereira', 'UFMG']] },
    { id: 'sast', people: [['Patricia Machado', 'UFCG'], ['Adenilso Simão', 'ICMC/USP']] },
    { id: 'sbcars', people: [['Larissa Rocha', 'UEFS'], ['Matheus Paixão', 'UECE']] },
    { id: 'sbes', track: 'research', people: [['Thelma Colanzi', 'UEM'], ['Cleidson de Souza', 'UFPA']] },
    { id: 'sbes', track: 'ideas', people: [['Edna', 'UnB'], ['Rodrigo Santos', 'UNIRIO']] },
    { id: 'sbes', track: 'tools', people: [['Simone Souza', 'ICMC/USP'], ['Davi Viana', 'UFMA']] },
    { id: 'sbes', track: 'education', people: [['Patricia Matsubara', 'UFMS'], ['Allyson Araújo', 'UFCA']] },
  ] satisfies { id: SymposiumId; track?: SbesTrackId; people: string[][] }[])(
    'shows the confirmed chairs in the $id $track call',
    ({ id, track, people }) => {
      const { container } = renderPage(id, track);
      const organization = within(screen.getByRole('complementary', { name: 'Organização' }));
      const chairs = organization.getAllByRole('listitem');
      expect(chairs).toHaveLength(people.length);
      people.forEach(([name, affiliation], index) => {
        expect(within(chairs[index]).getByText(name)).toBeTruthy();
        expect(within(chairs[index]).getByText(affiliation)).toBeTruthy();
      });
      expect(container.textContent).not.toMatch(/\bx{3,}\b/i);
    },
  );

  it('announces a call that is not out yet', () => {
    renderPage('sbes');
    expect(screen.getByText('A chamada de trabalhos do SBES 2027 será divulgada em breve.')).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });
});
