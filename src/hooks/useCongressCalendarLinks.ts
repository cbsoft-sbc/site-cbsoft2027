import { useTranslation } from 'react-i18next';
import { ABOUT_CONGRESS } from '@/data/about';
import { PUBLICATION } from '@/data/publication';
import { VENUE } from '@/data/venue';
import { useLang } from '@/hooks/useLang';
import { buildCalendarLinks } from '@/lib/calendar';

/** "Add to calendar" links for the whole congress, or `null` until the
 *  dates and the venue are both confirmed. */
export function useCongressCalendarLinks() {
  const { t } = useTranslation();
  const lang = useLang();
  const { start, end } = PUBLICATION.dates;

  if (!start || !end || !VENUE.name || !VENUE.address) return null;

  return buildCalendarLinks({
    title: {
      pt: t('about.calendarTitle', { lng: 'pt', year: ABOUT_CONGRESS.year }),
      en: t('about.calendarTitle', { lng: 'en', year: ABOUT_CONGRESS.year }),
    },
    description: {
      pt: t('about.p1', { lng: 'pt' }),
      en: t('about.p1', { lng: 'en' }),
    },
    start,
    end,
    allDay: true,
    location: `${VENUE.name[lang]} — ${VENUE.address[lang]}`,
    url: import.meta.env.BASE_URL,
  }, lang);
}
