import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { PUBLICATION } from '@/data/publication';
import { VENUE } from '@/data/venue';
import { formatShortDateRange } from '@/lib/dates';
import { HeroEventPills } from './HeroEventPills';

const originalDates = { ...PUBLICATION.dates };
const originalVenue = { ...VENUE };

afterEach(async () => {
  Object.assign(PUBLICATION.dates, originalDates);
  Object.assign(VENUE, originalVenue);
  await i18n.changeLanguage('pt');
});

function renderPills() {
  return render(<MemoryRouter><HeroEventPills /></MemoryRouter>);
}

describe('formatShortDateRange', () => {
  it('formats ranges across and within a month', () => {
    expect(formatShortDateRange('2027-09-27', '2027-10-01', 'pt')).toBe('27 set – 1 out 2027');
    expect(formatShortDateRange('2027-09-20', '2027-09-24', 'pt')).toBe('20 – 24 set 2027');
    expect(formatShortDateRange('2027-09-27', '2027-10-01', 'en')).toBe('Sep 27 – Oct 1, 2027');
  });
});

describe('Hero event pills', () => {
  it.each([
    ['pt', '27 set – 1 out 2027'],
    ['en', 'Sep 27 – Oct 1, 2027'],
  ])('shows the dates with calendar links and links the venue (%s)', async (lang, dates) => {
    await i18n.changeLanguage(lang);
    const { container } = renderPills();

    const summary = container.querySelector('summary')!;
    expect(summary.textContent).toContain(dates);
    expect(summary.textContent).toContain(i18n.t('agenda.addToCalendarAria'));
    fireEvent.click(summary);
    const google = screen.getByRole('link', { name: 'Google Calendar' });
    expect(new URL(google.getAttribute('href')!).searchParams.get('location'))
      .toBe(`${VENUE.name![lang as 'pt' | 'en']} — ${VENUE.address![lang as 'pt' | 'en']}`);

    const venue = screen.getByRole('link', { name: /PUC Minas · Belo Horizonte/ });
    expect(venue.getAttribute('href')).toBe(VENUE.infoUrl);
  });

  it('falls back to plain text while the dates and venue are unconfirmed', () => {
    PUBLICATION.dates.start = null;
    PUBLICATION.dates.end = null;
    VENUE.name = null;
    const { container } = renderPills();

    expect(container.querySelector('details')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.textContent).toContain('A definir');
    expect(container.textContent).toContain('Local a confirmar');
  });
});
