import type { Localized } from '@/lib/localized';
import type { SbesTrackId } from './sbesTracks';
import type { SymposiumId } from './symposia';

/** Official CBSoft 2027 program, as provided by the program coordination.
 *  While `sessions` is empty, /programacao shows "Em breve".
 *
 *  Times are local to Belo Horizonte (UTC−03:00, no daylight saving). */
export const PROGRAM_UTC_OFFSET = '-03:00';

export const PROGRAM_PATH = '/programacao';

/** Events that share the program: the congress itself (opening, keynotes,
 *  breaks, social), the four symposia and the workshops. */
export type ProgramEventId = 'cbsoft' | SymposiumId | 'workshops';

export const PROGRAM_EVENTS: ProgramEventId[] = ['cbsoft', 'sbes', 'sblp', 'sbcars', 'sast', 'workshops'];

/** The program already filtered to one event, e.g. /programacao?simposio=sbes. */
export const programPath = (event: ProgramEventId) => `${PROGRAM_PATH}?simposio=${event}`;

export type ProgramCategory =
  | 'opening'
  | 'keynote'
  | 'papers'
  | 'panel'
  | 'tutorial'
  | 'workshop'
  | 'tools'
  | 'competition'
  | 'social'
  | 'break';

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  'opening',
  'keynote',
  'papers',
  'panel',
  'tutorial',
  'workshop',
  'tools',
  'competition',
  'social',
  'break',
];

/** Text that may be given once (e.g. a paper title kept in its original
 *  language) or per language. */
export type ProgramText = string | Localized;

export interface ProgramRoom {
  id: string;
  name: ProgramText;
}

export interface ProgramSpeaker {
  name: string;
  affiliation?: string;
}

/** One item inside a session: a paper presentation, a talk, a demo… */
export interface ProgramActivity {
  id: string;
  title: ProgramText;
  speakers: ProgramSpeaker[];
  /** 'HH:MM', when the item has its own slot inside the session. */
  start?: string;
  end?: string;
}

/** A block of the program in one room: a keynote, a paper session, a break… */
export interface ProgramSession {
  id: string;
  /** 'YYYY-MM-DD'. */
  day: string;
  /** 'HH:MM', or null while the time is not confirmed. Sessions without a
   *  confirmed time do not offer "Add to calendar". */
  start: string | null;
  end: string | null;
  /** A ProgramRoom id. Leave empty for plenary items (breaks, opening…). */
  roomId?: string;
  event: ProgramEventId;
  /** SBES track, when `event` is 'sbes'. */
  track?: SbesTrackId;
  category: ProgramCategory;
  title: ProgramText;
  description?: ProgramText;
  /** Keynote speakers, panelists, tutorial instructors… */
  speakers?: ProgramSpeaker[];
  /** Session chair. */
  chair?: ProgramSpeaker;
  activities?: ProgramActivity[];
}

export interface Program {
  rooms: ProgramRoom[];
  sessions: ProgramSession[];
}

/* Example session:
 * {
 *   id: 'sbes-research-1',
 *   day: '2027-09-28',
 *   start: '10:30',
 *   end: '12:00',
 *   roomId: 'auditorio-1',
 *   event: 'sbes',
 *   track: 'research',
 *   category: 'papers',
 *   title: { pt: 'Sessão Técnica 1: Testes', en: 'Technical Session 1: Testing' },
 *   chair: { name: 'Fulana de Tal', affiliation: 'PUC Minas' },
 *   activities: [
 *     { id: 'p1', title: 'Paper title', speakers: [{ name: 'Autor', affiliation: 'UFMG' }] },
 *   ],
 * }
 */
export const PROGRAM: Program = {
  rooms: [],
  sessions: [],
};
