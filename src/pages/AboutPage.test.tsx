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
  it.each([
    ['pt', ['41º SBES', '31º SBLP', '21º SBCARS', '12º SAST'], 'Chamada de Trabalhos'],
    ['en', ['41st SBES', '31st SBLP', '21st SBCARS', '12th SAST'], 'Call for Papers'],
  ])('links each symposium card to its Call for Papers (%s)', async (lang, acronyms, cta) => {
    await i18n.changeLanguage(lang);
    const { container } = renderPage();
    const cards = [...container.querySelectorAll<HTMLAnchorElement>('a.symposium-card')];
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '/sbes/pesquisa/chamada',
      '/sblp/chamada',
      '/sbcars/chamada',
      '/sast/chamada',
    ]);
    cards.forEach((card, index) => {
      expect(card.textContent).toContain(acronyms[index]);
      expect(card.textContent).toContain(cta);
    });
    expect(within(cards[0]).getByText(lang === 'pt'
      ? 'Simpósio Brasileiro de Engenharia de Software'
      : 'Brazilian Symposium on Software Engineering')).toBeTruthy();
  });

  it('renders a single "Sobre o CBSoft" section with the four symposia as cards', () => {
    const { container } = renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Sobre o CBSoft' })).toBeTruthy();

    // The cards replace the former bulleted list.
    expect(container.querySelector('.about-symposia')).toBeNull();
    const cards = container.querySelectorAll('.symposium-card');
    expect(cards).toHaveLength(4);
    expect(cards[0].textContent).toContain('Dedicado à pesquisa e à prática em Engenharia de Software.');
    expect(cards[3].textContent).toContain('Dedicado à sistematização e à automação do teste de software.');

    expect(screen.getByText(/A programação inclui sessões técnicas/)).toBeTruthy();
  });

  it('describes each symposium in English inside its card', async () => {
    await i18n.changeLanguage('en');
    const { container } = renderPage();
    const descriptions = [...container.querySelectorAll('.symposium-card__description')].map((el) => el.textContent);

    expect(descriptions).toHaveLength(4);
    expect(descriptions[1]).toMatch(/^Brings together researchers and practitioners/);
    expect(descriptions.every((text) => /^[A-Z].*\.$/.test(text ?? ''))).toBe(true);
  });

  it.each([
    {
      lang: 'pt',
      title: 'Identidade Visual do CBSoft 2027',
      concept: 'Conceito da marca',
      photo: /Edifício Niemeyer/,
      logo: /Logo oficial do CBSOFT'27/,
      caption: 'Edifício Niemeyer, Oscar Niemeyer, 1954, Belo Horizonte, Minas Gerais',
      intro: /identidade visual.*(conecta|relaciona) tecnologia, arquitetura/i,
    },
    {
      lang: 'en',
      title: 'CBSoft 2027 Visual Identity',
      concept: 'Brand concept',
      photo: /Niemeyer Building/,
      logo: /Official CBSOFT'27 logo/,
      caption: 'Niemeyer Building, Oscar Niemeyer, 1954, Belo Horizonte, Minas Gerais',
      intro: /visual identity (connects|relates) technology, architecture/i,
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
      screen.getByRole('link', { name: 'listas de e-mail das Comissões Especiais' }).getAttribute('href'),
    ).toBe('https://www.sbc.org.br/comissoes-especiais/');
    expect(screen.getByRole('link', { name: 'acesse a página de associação' }).getAttribute('href')).toBe(
      'https://centraldesistemas.sbc.org.br/mom',
    );
  });

  it('presents the 2027 edition with the confirmed congress period', () => {
    const { container } = renderPage();
    const text = container.textContent ?? '';
    expect(text).toMatch(/18ª edição do CBSoft/);
    expect(text).toMatch(/Belo Horizonte/);
    expect(text).toContain('de 27 de setembro a 1º de outubro');
  });
});
