import '@/components/sections/AddToCalendar.css';

import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProgramSession } from '@/data/program';
import { useLang } from '@/hooks/useLang';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { buildCalendarLinks, type CalendarLinks } from '@/lib/calendar';
import type { Localized } from '@/lib/localized';
import { sessionDateTime } from '@/lib/program';

const SERVICES: { key: keyof CalendarLinks; label: string }[] = [
  { key: 'google', label: 'Google Calendar' },
  { key: 'office', label: 'Outlook 365' },
  { key: 'live', label: 'Outlook Live' },
];

interface Props {
  session: ProgramSession & { start: string };
  title: Localized;
  description: Localized;
  location: string;
}

/** "Add to calendar" for one session with a confirmed day and time. */
export function ProgramCalendarButton({ session, title, description, location }: Props) {
  const { t } = useTranslation();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOnClickOutside(rootRef, close, open);

  const links = buildCalendarLinks(
    {
      title,
      description,
      start: sessionDateTime(session.day, session.start),
      end: session.end ? sessionDateTime(session.day, session.end) : undefined,
      allDay: false,
      location,
      url: `${import.meta.env.BASE_URL}programacao?dia=${session.day}`,
    },
    lang,
  );

  return (
    <div className="program-cal" ref={rootRef}>
      <button
        type="button"
        className="program-cal__trigger"
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" />
        </svg>
        {t('programPage.addToCalendar')}
      </button>

      {open && (
        <div className="cal-menu" role="menu" aria-label={t('agenda.addToCalendarAria')}>
          {SERVICES.map((svc) => (
            <button
              key={svc.key}
              type="button"
              className="cal-opt"
              role="menuitem"
              onClick={() => {
                window.open(links[svc.key], '_blank', 'noopener');
                close();
                triggerRef.current?.focus();
              }}
            >
              <span>{svc.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
