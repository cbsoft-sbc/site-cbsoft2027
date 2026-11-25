import { readFileSync } from 'node:fs';
import { act } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { renderApp } from '@/test/renderApp';
import { SYMPOSIA } from '@/data/symposia';
import { PUBLICATION, congressDays, registrationOpen } from '@/data/publication';
import pt from '@/i18n/locales/pt/common.json';
import en from '@/i18n/locales/en/common.json';

/** Pre-deploy guard: nothing unapproved or dead-ended reaches the public. */

const ROUTES = [
  '/',
  '/sobre',
  '/inscricoes',
  '/codigo-de-conduta',
  '/voluntarios',
  '/artigos-aceitos',
  '/workshops/chamada',
  '/sbes/pesquisa/chamada',
  '/sbes/educacao/chamada',
  '/sast/chamada',
];

function renderAt(path: string) {
  window.history.replaceState(null, '', import.meta.env.BASE_URL + path.replace(/^\//, ''));
  return renderApp();
}

afterEach(async () => {
  window.history.replaceState(null, '', import.meta.env.BASE_URL);
  await i18n.changeLanguage('pt');
});

function flatten(value: unknown, prefix = ''): Record<string, unknown> {
  if (value === null || typeof value !== 'object') return { [prefix]: value };
  return Object.entries(value).reduce<Record<string, unknown>>(
    (out, [key, child]) => ({ ...out, ...flatten(child, prefix ? `${prefix}.${key}` : key) }),
    {},
  );
}

describe('publication guard', () => {
  it.each(['pt', 'en'])('no public link points to a bare "#" (%s)', async (lang) => {
    await i18n.changeLanguage(lang);
    for (const route of ROUTES) {
      const { container, unmount } = await renderAt(route);
      expect(container.querySelector('main'), `page content on ${route}`).not.toBeNull();
      const dead = [...container.ownerDocument.querySelectorAll('a')]
        .map((a) => a.getAttribute('href'))
        .filter((href) => href == null || href.trim() === '' || href.trim() === '#');
      expect(dead, `dead links on ${route}`).toEqual([]);
      unmount();
    }
  });

  it('PT and EN translations have the same, non-empty keys', () => {
    const ptKeys = flatten(pt);
    const enKeys = flatten(en);
    expect(Object.keys(enKeys).sort()).toEqual(Object.keys(ptKeys).sort());
    for (const [key, value] of Object.entries({ ...ptKeys, ...enKeys })) {
      expect(typeof value === 'string' && value.trim().length > 0, key).toBe(true);
    }
  });

  it('metadata names exactly the official symposia and no unconfirmed dates', () => {
    const html = readFileSync('index.html', 'utf8');
    const meta = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
    const acronyms = SYMPOSIA.map((s) => s.acronym);
    for (const text of [meta, pt.homePage.metaDescription, en.homePage.metaDescription]) {
      const named = text.match(/\bS[A-Z]{3,5}\b/g) ?? [];
      expect(named).toEqual(acronyms);
      if (!PUBLICATION.dates.start) {
        expect(text).not.toMatch(/\b20\d\d-\d\d-\d\d\b|\bde (janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b/i);
      }
    }
  });

  it('keeps registration "Em breve" until it is approved', async () => {
    expect(registrationOpen()).toBe(false);
    const { container, unmount } = await renderAt('/inscricoes');
    expect(container.querySelector('table')).toBeNull();
    expect(container.textContent).toContain(pt.registrationPage.ctaSoon);
    expect(container.textContent).toContain(pt.registrationPage.soon);
    unmount();

    await act(async () => { await i18n.changeLanguage('en'); });
    const enView = await renderAt('/inscricoes');
    expect(enView.container.textContent).toContain(en.registrationPage.ctaSoon);
    enView.unmount();
  });

  it('shows fees and the SBC link once registration is approved', async () => {
    const saved = { ...PUBLICATION.registration };
    PUBLICATION.registration.feesApproved = true;
    PUBLICATION.registration.url = 'https://example.org/inscricao';
    try {
      const { container } = await renderAt('/inscricoes');
      expect(container.querySelector('table')).not.toBeNull();
      expect(container.querySelector('a[href="https://example.org/inscricao"]')).not.toBeNull();
    } finally {
      Object.assign(PUBLICATION.registration, saved);
    }
  });

  it('hides the congress length while the dates are pending', async () => {
    const saved = { ...PUBLICATION.dates };
    PUBLICATION.dates.start = null;
    PUBLICATION.dates.end = null;
    try {
      const { container } = await renderAt('/');
      expect(congressDays()).toBeNull();
      expect(container.textContent).not.toContain(pt.about.statDays);
    } finally {
      Object.assign(PUBLICATION.dates, saved);
    }
  });
});
