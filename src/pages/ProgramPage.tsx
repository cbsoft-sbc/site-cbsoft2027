import '@/styles/page-content.css';
import './ProgramPage.css';

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { BrandBar } from '@/components/ui/BrandBar';
import { ProgramCalendarButton } from '@/components/program/ProgramCalendarButton';
import {
  PROGRAM,
  PROGRAM_CATEGORIES,
  PROGRAM_EVENTS,
  type Program,
  type ProgramEventId,
  type ProgramRoom,
  type ProgramSession,
  type ProgramSpeaker,
} from '@/data/program';
import { SBES_TRACKS } from '@/data/sbesTracks';
import { SYMPOSIA } from '@/data/symposia';
import { VENUE } from '@/data/venue';
import { useLang } from '@/hooks/useLang';
import type { Lang, Localized } from '@/lib/localized';
import {
  defaultDay,
  filterSessions,
  formatDay,
  formatTimeRange,
  hasConfirmedTime,
  programDays,
  sortSessions,
  text,
  type ProgramFilters,
} from '@/lib/program';

/** URL query keys: the selected day, view, filters and search survive
 *  reloads, shared links and the browser's back button. */
const PARAM = {
  day: 'dia',
  view: 'visao',
  event: 'simposio',
  track: 'trilha',
  category: 'categoria',
  q: 'q',
} as const;

type View = 'list' | 'grid';

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

const TRACK_IDS = SBES_TRACKS.map((track) => track.id);

const eventAcronym = (id: ProgramEventId) =>
  id === 'cbsoft' ? 'CBSoft' : id === 'workshops' ? 'Workshops' : SYMPOSIA.find((s) => s.id === id)?.acronym ?? id;

function speakerLine(speakers: ProgramSpeaker[]): string {
  return speakers.map((s) => (s.affiliation ? `${s.name} (${s.affiliation})` : s.name)).join(', ');
}

export function ProgramPage({ program = PROGRAM }: { program?: Program }) {
  const { t } = useTranslation();
  const lang = useLang();
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filters: ProgramFilters = {
    event: oneOf(params.get(PARAM.event), PROGRAM_EVENTS),
    track: oneOf(params.get(PARAM.track), TRACK_IDS),
    category: oneOf(params.get(PARAM.category), PROGRAM_CATEGORIES),
    q: params.get(PARAM.q) ?? '',
  };
  const view: View = params.get(PARAM.view) === 'grade' ? 'grid' : 'list';
  const hasFilters = Boolean(filters.event || filters.track || filters.category || filters.q?.trim());

  const days = useMemo(() => programDays(program.sessions), [program]);
  const requestedDay = params.get(PARAM.day);
  const day = requestedDay && days.includes(requestedDay) ? requestedDay : defaultDay(days);

  // Only offer filter options that actually occur in the program.
  const events = PROGRAM_EVENTS.filter((id) => program.sessions.some((s) => s.event === id));
  const tracks = TRACK_IDS.filter((id) => program.sessions.some((s) => s.track === id));
  const categories = PROGRAM_CATEGORIES.filter((id) => program.sessions.some((s) => s.category === id));

  const filtered = filterSessions(program.sessions, filters);
  const roomOrder = program.rooms.map((room) => room.id);
  const daySessions = sortSessions(filtered.filter((s) => s.day === day), roomOrder);
  const countByDay = (d: string) => filtered.filter((s) => s.day === d).length;

  /** Replace (not push) so typing in the search box does not flood the history. */
  function update(changes: Partial<Record<keyof typeof PARAM, string | null>>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      const name = PARAM[key as keyof typeof PARAM];
      if (value) next.set(name, value);
      else next.delete(name);
    }
    setParams(next, { replace: true, preventScrollReset: true });
  }

  function clearFilters() {
    update({ event: null, track: null, category: null, q: null });
  }

  const roomName = (id?: string): string | null => {
    const room = id ? program.rooms.find((r) => r.id === id) : undefined;
    return room ? text(room.name, lang) : null;
  };

  if (program.sessions.length === 0) {
    return (
      <main className="about-page program-page" id="programacao">
        <section className="about-section about-top" aria-labelledby="programacao-titulo">
          <div className="container-xl">
            <h1 id="programacao-titulo" className="about-title">
              <BrandBar />
              {t('programPage.title')}
            </h1>
            <div className="program-pending">
              <strong>{t('programPage.pendingTitle')}</strong>
              <p>{t('programPage.pendingText')}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="about-page program-page" id="programacao">
      <section className="about-section about-top" aria-labelledby="programacao-titulo">
        <div className="container-xl">
          <h1 id="programacao-titulo" className="about-title">
            <BrandBar />
            {t('programPage.title')}
          </h1>

          <form className="program-filters" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="program-field program-field--search">
              <span>{t('programPage.searchLabel')}</span>
              <input
                type="search"
                value={filters.q}
                placeholder={t('programPage.searchPlaceholder')}
                onChange={(event) => update({ q: event.target.value })}
              />
            </label>

            <label className="program-field">
              <span>{t('programPage.eventLabel')}</span>
              <select
                value={filters.event ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  // Tracks belong to SBES; drop the track when leaving it.
                  update({ event: value, track: value === 'sbes' ? filters.track ?? null : null });
                }}
              >
                <option value="">{t('programPage.allEvents')}</option>
                {events.map((id) => (
                  <option key={id} value={id}>{t(`programPage.events.${id}`, { defaultValue: eventAcronym(id) })}</option>
                ))}
              </select>
            </label>

            {tracks.length > 0 && (
              <label className="program-field">
                <span>{t('programPage.trackLabel')}</span>
                <select
                  value={filters.track ?? ''}
                  onChange={(event) => {
                    const value = event.target.value;
                    update({ track: value, event: value ? 'sbes' : filters.event ?? null });
                  }}
                >
                  <option value="">{t('programPage.allTracks')}</option>
                  {tracks.map((id) => (
                    <option key={id} value={id}>{t(`headerMenu.sbes.tracks.${id}.title`)}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="program-field">
              <span>{t('programPage.categoryLabel')}</span>
              <select
                value={filters.category ?? ''}
                onChange={(event) => update({ category: event.target.value })}
              >
                <option value="">{t('programPage.allCategories')}</option>
                {categories.map((id) => (
                  <option key={id} value={id}>{t(`programPage.categories.${id}`)}</option>
                ))}
              </select>
            </label>

            {hasFilters && (
              <button type="button" className="program-clear" onClick={clearFilters}>
                {t('programPage.clearFilters')}
              </button>
            )}
          </form>

          <div className="program-toolbar">
            <div className="program-days" role="group" aria-label={t('programPage.daysAria')}>
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  className="program-day"
                  aria-pressed={d === day}
                  onClick={() => update({ day: d })}
                >
                  <span>{formatDay(d, lang)}</span>
                  {hasFilters && <span className="program-day__count">{countByDay(d)}</span>}
                </button>
              ))}
            </div>

            <div className="program-views" role="group" aria-label={t('programPage.viewAria')}>
              <button type="button" aria-pressed={view === 'list'} onClick={() => update({ view: null })}>
                {t('programPage.viewList')}
              </button>
              <button type="button" aria-pressed={view === 'grid'} onClick={() => update({ view: 'grade' })}>
                {t('programPage.viewGrid')}
              </button>
            </div>
          </div>

          <h2 className="program-day-title">{day && formatDay(day, lang, 'long')}</h2>
          <p className="program-count" aria-live="polite">
            {t('programPage.results', { count: daySessions.length })}
          </p>

          {daySessions.length === 0 ? (
            <div className="program-empty">
              <p>{t('programPage.noResults')}</p>
              {hasFilters && (
                <button type="button" className="program-clear" onClick={clearFilters}>
                  {t('programPage.clearFilters')}
                </button>
              )}
            </div>
          ) : view === 'grid' ? (
            <ProgramGrid sessions={daySessions} rooms={program.rooms} lang={lang} roomName={roomName} />
          ) : (
            <ProgramList sessions={daySessions} lang={lang} roomName={roomName} />
          )}
        </div>
      </section>
    </main>
  );
}

interface ViewProps {
  sessions: ProgramSession[];
  lang: Lang;
  roomName: (id?: string) => string | null;
}

/** Sessions grouped under their start time. */
function ProgramList({ sessions, lang, roomName }: ViewProps) {
  const { t } = useTranslation();
  const slots = new Map<string, ProgramSession[]>();
  for (const session of sessions) {
    const key = formatTimeRange(session) ?? t('programPage.timeTba');
    slots.set(key, [...(slots.get(key) ?? []), session]);
  }

  return (
    <ol className="program-list">
      {[...slots].map(([time, items]) => (
        <li key={time} className="program-slot">
          <p className="program-slot__time">{time}</p>
          <ul className="program-slot__sessions">
            {items.map((session) => (
              <li key={session.id}>
                <SessionCard session={session} lang={lang} room={roomName(session.roomId)} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/** Rooms as columns, start times as rows. Plenary sessions (no room) span
 *  the whole row. Scrolls sideways on narrow screens. */
function ProgramGrid({ sessions, rooms, lang, roomName }: ViewProps & { rooms: ProgramRoom[] }) {
  const { t } = useTranslation();
  const usedRooms = rooms.filter((room) => sessions.some((s) => s.roomId === room.id));
  const times = [...new Set(sessions.map((s) => s.start ?? ''))];

  return (
    <div className="program-grid-wrap" tabIndex={0} aria-label={t('programPage.viewGrid')}>
      <table className="program-grid">
        <thead>
          <tr>
            <th scope="col">{t('programPage.time')}</th>
            {usedRooms.map((room) => (
              <th key={room.id} scope="col">{text(room.name, lang)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.flatMap((time) => {
            const atTime = sessions.filter((s) => (s.start ?? '') === time);
            const plenary = atTime.filter((s) => !s.roomId || !usedRooms.some((r) => r.id === s.roomId));
            const inRooms = atTime.filter((s) => !plenary.includes(s));
            const label = time || t('programPage.timeTba');
            const rows = plenary.map((session) => (
              <tr key={session.id}>
                <th scope="row">{label}</th>
                <td colSpan={Math.max(usedRooms.length, 1)}>
                  <SessionCard session={session} lang={lang} room={roomName(session.roomId)} compact />
                </td>
              </tr>
            ));
            if (inRooms.length > 0) {
              rows.push(
                <tr key={`${time}-rooms`}>
                  <th scope="row">{label}</th>
                  {usedRooms.map((room) => (
                    <td key={room.id}>
                      {inRooms
                        .filter((s) => s.roomId === room.id)
                        .map((session) => (
                          <SessionCard key={session.id} session={session} lang={lang} room={roomName(session.roomId)} hideRoom compact />
                        ))}
                    </td>
                  ))}
                </tr>,
              );
            }
            return rows;
          })}
        </tbody>
      </table>
    </div>
  );
}

function SessionCard({
  session,
  lang,
  room,
  compact = false,
  hideRoom = false,
}: {
  session: ProgramSession;
  lang: Lang;
  room: string | null;
  compact?: boolean;
  /** In the grid the column already names the room. */
  hideRoom?: boolean;
}) {
  const { t } = useTranslation();
  const acronym = eventAcronym(session.event);
  const both = (fn: (l: Lang) => string): Localized => ({ pt: fn('pt'), en: fn('en') });
  const venue = VENUE.name ? VENUE.name[lang] : '';

  return (
    <article className={`program-session program-session--${session.event}${compact ? ' is-compact' : ''}`}>
      <p className="program-session__meta">
        <span className="program-tag">{t(`programPage.categories.${session.category}`)}</span>
        <span>{acronym}</span>
        {session.track && <span>{t(`headerMenu.sbes.tracks.${session.track}.title`)}</span>}
      </p>
      <h3 className="program-session__title">{text(session.title, lang)}</h3>
      {compact && formatTimeRange(session) && <p className="program-session__detail">{formatTimeRange(session)}</p>}
      {room && !hideRoom && <p className="program-session__detail">{t('programPage.room')}: {room}</p>}
      {session.speakers && session.speakers.length > 0 && (
        <p className="program-session__detail">{speakerLine(session.speakers)}</p>
      )}
      {session.chair && (
        <p className="program-session__detail">{t('programPage.chair')}: {speakerLine([session.chair])}</p>
      )}
      {session.description && !compact && (
        <p className="program-session__description">{text(session.description, lang)}</p>
      )}
      {session.activities && session.activities.length > 0 && (
        <ul className="program-activities">
          {session.activities.map((activity) => (
            <li key={activity.id}>
              {activity.start && <span className="program-activities__time">{activity.start}</span>}
              <span className="program-activities__title">{text(activity.title, lang)}</span>
              <span className="program-activities__speakers">{speakerLine(activity.speakers)}</span>
            </li>
          ))}
        </ul>
      )}
      {hasConfirmedTime(session) && (
        <ProgramCalendarButton
          session={session}
          title={both((l) => `${acronym} — ${text(session.title, l)}`)}
          description={both((l) =>
            [
              session.description ? text(session.description, l) : '',
              session.speakers ? speakerLine(session.speakers) : '',
            ].filter(Boolean).join('\n'),
          )}
          location={[room, venue].filter(Boolean).join(' — ')}
        />
      )}
    </article>
  );
}
