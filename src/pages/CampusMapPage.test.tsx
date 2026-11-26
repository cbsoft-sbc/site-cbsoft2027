import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { IMAGES } from '@/data/config';
import { CampusMapPage } from './CampusMapPage';

afterEach(async () => {
  await i18n.changeLanguage('pt');
});

describe('CampusMapPage', () => {
  it.each([
    ['pt', 'Ver mapa em tamanho original'],
    ['en', 'View full-size campus map'],
  ])('offers the original image only on the mobile layout (%s)', async (lang, label) => {
    await i18n.changeLanguage(lang);
    render(<CampusMapPage />);

    const link = screen.getByRole('link', { name: label });
    expect(link.getAttribute('href')).toBe(IMAGES.mapa_puc);
    expect(link.getAttribute('target')).toBe('_blank');
    // `lg:hidden` is display:none from 1024px, which also removes the link
    // from the keyboard order on desktop.
    expect(link.parentElement?.classList.contains('lg:hidden')).toBe(true);
  });

  it('keeps the map visible at its original size', () => {
    render(<CampusMapPage />);
    const map = screen.getByRole('img', { name: /Planta do campus/ });
    expect(map.getAttribute('src')).toBe(IMAGES.mapa_puc);
    expect(map.getAttribute('width')).toBe('1200');
    expect(map.getAttribute('height')).toBe('849');
    expect(map.classList.contains('lg:hidden')).toBe(false);
  });
});
