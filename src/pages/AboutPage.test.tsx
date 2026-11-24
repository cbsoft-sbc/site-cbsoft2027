import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { AboutPage } from './AboutPage';

beforeEach(async () => {
  await i18n.changeLanguage('pt');
});

function renderPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );
}

describe('AboutPage', () => {
  it('renders a single "Sobre o CBSoft" section with the four symposia', () => {
    const { container } = renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Sobre o CBSoft' })).toBeTruthy();

    const items = container.querySelectorAll('.about-symposia li');
    expect(items).toHaveLength(4);
    expect(items[0].textContent).toMatch(/^XLI Simpósio Brasileiro de Engenharia de Software, .*;$/);
    expect(items[2].textContent).toMatch(/; e$/);
    expect(items[3].textContent).toMatch(/^XII Simpósio Brasileiro de Teste de Software.*\.$/);

    expect(screen.getByText(/A programação do CBSoft incluirá/)).toBeTruthy();
  });

  it('uses a spaced, localized conjunction in the English symposium list', async () => {
    await i18n.changeLanguage('en');
    const { container } = renderPage();
    const items = container.querySelectorAll('.about-symposia li');

    expect(items).toHaveLength(4);
    expect(items[0].textContent).toMatch(/;$/);
    expect(items[1].textContent).toMatch(/;$/);
    expect(items[2].textContent).toMatch(/; and$/);
    expect(items[3].textContent).toMatch(/\.$/);
  });

  it.each([
    {
      lang: 'pt',
      title: 'Identidade Visual do CBSOFT 2027',
      concept: 'Conceito da marca',
      photo: /Edifício Niemeyer/,
      logo: /Logo oficial do CBSOFT'27/,
      caption: 'Edifício Niemeyer, Oscar Niemeyer, 1954, Belo Horizonte, Minas Gerais',
      intro: /conecta tecnologia, arquitetura/,
    },
    {
      lang: 'en',
      title: 'CBSOFT 2027 Visual Identity',
      concept: 'Brand concept',
      photo: /Niemeyer Building/,
      logo: /Official CBSOFT'27 logo/,
      caption: 'Niemeyer Building, Oscar Niemeyer, 1954, Belo Horizonte, Minas Gerais',
      intro: /visual identity connects technology, architecture/,
    },
  ])('shows the visual identity with heading bars and a single photo caption in $lang', async ({
    lang, title, concept, photo, logo, caption, intro,
  }) => {
    await i18n.changeLanguage(lang);
    renderPage();

    const identity = within(screen.getByRole('region', { name: title }));
    for (const name of [title, concept]) {
      expect(identity.getByRole('heading', { name }).firstElementChild?.matches('.brand-bar')).toBe(true);
    }
    expect(identity.getByAltText(photo)).toBeTruthy();
    expect(identity.getByAltText(logo)).toBeTruthy();
    expect(identity.queryByText(intro)).toBeNull();

    const captions = identity.getByRole('figure').querySelectorAll('figcaption');
    expect(captions).toHaveLength(1);
    expect(captions[0].textContent).toBe(caption);
  });

  it('renders the "Sobre a SBC" section with working SBC links', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 2, name: 'Sobre a SBC' })).toBeTruthy();
    expect(screen.getByText(/fundada em julho de 1978/)).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'listas de e-mail das Comissões Especiais (CE)' }).getAttribute('href'),
    ).toBe('https://www.sbc.org.br/comissoes-especiais/');
    expect(screen.getByRole('link', { name: 'clique aqui' }).getAttribute('href')).toBe(
      'https://centraldesistemas.sbc.org.br/mom',
    );
  });

  it('presents the 2027 edition with the confirmed congress period', () => {
    const { container } = renderPage();
    const text = container.textContent ?? '';
    expect(text).toMatch(/XVIII edição do CBSoft/);
    expect(text).toMatch(/Belo Horizonte/);
    expect(text).toContain('de 27 de setembro a 1 de outubro');
  });
});
