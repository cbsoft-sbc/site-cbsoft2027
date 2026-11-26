import './HeroEventPills.css';

import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PUBLICATION } from '@/data/publication';
import { VENUE } from '@/data/venue';
import { useCongressCalendarLinks } from '@/hooks/useCongressCalendarLinks';
import { useLang } from '@/hooks/useLang';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { formatShortDateRange } from '@/lib/dates';

function PillIcon({ calendar = false }: { calendar?: boolean }) {
  return (
    <svg className="hero-pill__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {calendar ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 11h18M8 3v4M16 3v4" />
        </>
      ) : (
        <>
          <path d="M12 22s7-6.3 7-13A7 7 0 0 0 5 9c0 6.7 7 13 7 13Z" />
          <circle cx="12" cy="9" r="2.5" />
        </>
      )}
    </svg>
  );
}

/** Date and venue pills in the hero. The date opens "add to calendar"
 *  links; the venue links to the location page. */
export function HeroEventPills() {
  const { t } = useTranslation();
  const lang = useLang();
  const links = useCongressCalendarLinks();
  const calendarRef = useRef<HTMLDetailsElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const closeCalendar = useCallback(() => {
    const details = calendarRef.current;
    if (!details?.open) return;
    details.open = false;
    details.querySelector('summary')?.focus();
  }, []);
  useOnClickOutside(calendarRef, closeCalendar, calendarOpen);

  const { start, end } = PUBLICATION.dates;
  const dateLabel = start && end ? formatShortDateRange(start, end, lang) : t('agenda.tbd');
  const dateContent = (
    <>
      <PillIcon calendar />
      <span>{dateLabel}</span>
    </>
  );

  return (
    <div className="hero-pills">
      {links ? (
        <details
          className="hero-pill hero-pill--date"
          ref={calendarRef}
          onToggle={(event) => setCalendarOpen(event.currentTarget.open)}
        >
          <summary className="hero-pill__trigger">
            {dateContent}
            <span className="sr-only">— {t('agenda.addToCalendarAria')}</span>
            <svg className="hero-pill__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <ul className="hero-pill__menu" aria-label={t('agenda.addToCalendarAria')}>
            <li><a href={links.google} target="_blank" rel="noopener noreferrer">Google Calendar</a></li>
            <li><a href={links.office} target="_blank" rel="noopener noreferrer">Outlook 365</a></li>
            <li><a href={links.live} target="_blank" rel="noopener noreferrer">Outlook Live</a></li>
          </ul>
        </details>
      ) : (
        <p className="hero-pill hero-pill__trigger">{dateContent}</p>
      )}

      {VENUE.name ? (
        <Link to={VENUE.infoUrl} className="hero-pill hero-pill__trigger">
          <PillIcon />
          <span>{t('hero.venueShort')}</span>
        </Link>
      ) : (
        <p className="hero-pill hero-pill__trigger">
          <PillIcon />
          <span>{t('location.unconfirmed')}</span>
        </p>
      )}
    </div>
  );
}
