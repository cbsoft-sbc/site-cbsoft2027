import {
  PROGRAM_UTC_OFFSET,
  type ProgramCategory,
  type ProgramEventId,
  type ProgramSession,
  type ProgramText,
} from '@/data/program';
import type { SbesTrackId } from '@/data/sbesTracks';
import type { Lang } from './localized';

export interface ProgramFilters {
  event?: ProgramEventId;
  track?: SbesTrackId;
  category?: ProgramCategory;
  /** Free text matched against titles and speaker names. */
  q?: string;
}

export function text(value: ProgramText, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang];
}

function bothLanguages(value: ProgramText | undefined): string[] {
  if (!value) return [];
  return typeof value === 'string' ? [value] : [value.pt, value.en];
}

/** Lowercase, without accents, so "programacao" finds "Programação". */
export function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

/** Title (session or any of its activities) or speaker, in either language. */
export function matchesSearch(session: ProgramSession, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = normalize(
    [
      ...bothLanguages(session.title),
      ...(session.speakers ?? []).map((s) => s.name),
      session.chair?.name ?? '',
      ...(session.activities ?? []).flatMap((a) => [
        ...bothLanguages(a.title),
        ...a.speakers.map((s) => s.name),
      ]),
    ].join(' '),
  );
  return terms.every((term) => haystack.includes(term));
}

export function filterSessions(sessions: ProgramSession[], filters: ProgramFilters): ProgramSession[] {
  return sessions.filter(
    (s) =>
      (!filters.event || s.event === filters.event) &&
      (!filters.track || s.track === filters.track) &&
      (!filters.category || s.category === filters.category) &&
      (!filters.q || matchesSearch(s, filters.q)),
  );
}

/** Distinct days, in order. */
export function programDays(sessions: ProgramSession[]): string[] {
  return [...new Set(sessions.map((s) => s.day))].sort();
}

/** By start time (unconfirmed times last), then by room order. */
export function sortSessions(sessions: ProgramSession[], roomOrder: string[] = []): ProgramSession[] {
  const roomIndex = (s: ProgramSession) => {
    const i = s.roomId ? roomOrder.indexOf(s.roomId) : -1;
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...sessions].sort(
    (a, b) =>
      (a.start ?? '99:99').localeCompare(b.start ?? '99:99') ||
      (a.end ?? '').localeCompare(b.end ?? '') ||
      roomIndex(a) - roomIndex(b),
  );
}

/** The day to open on: today during the congress, otherwise the first day. */
export function defaultDay(days: string[], today: Date = new Date()): string | undefined {
  const local = new Date(today.getTime() - 3 * 3600000).toISOString().slice(0, 10);
  return days.includes(local) ? local : days[0];
}

/** ISO date-time in Belo Horizonte time, e.g. 2027-09-28T10:30:00-03:00. */
export function sessionDateTime(day: string, time: string): string {
  return `${day}T${time}:00${PROGRAM_UTC_OFFSET}`;
}

/** "Add to calendar" is offered only when the day and start time are confirmed. */
export function hasConfirmedTime(session: ProgramSession): session is ProgramSession & { start: string } {
  return Boolean(session.day && session.start);
}

export function formatDay(day: string, lang: Lang, format: 'short' | 'long' = 'short'): string {
  const date = new Date(sessionDateTime(day, '12:00'));
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: format === 'short' ? 'short' : 'long',
    day: 'numeric',
    month: format === 'short' ? 'short' : 'long',
  });
}

export function formatTimeRange(session: ProgramSession): string | null {
  if (!session.start) return null;
  return session.end ? `${session.start} – ${session.end}` : session.start;
}
