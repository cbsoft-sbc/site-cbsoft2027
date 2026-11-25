import { describe, expect, it } from 'vitest';
import { PROGRAM_FIXTURE } from '@/test/programFixture';
import {
  defaultDay,
  filterSessions,
  hasConfirmedTime,
  matchesSearch,
  programDays,
  sessionDateTime,
  sortSessions,
} from './program';

const { sessions } = PROGRAM_FIXTURE;
const ids = (list: { id: string }[]) => list.map((s) => s.id);
const byId = (id: string) => sessions.find((s) => s.id === id)!;

describe('program search', () => {
  it('matches the session title in either language', () => {
    expect(matchesSearch(byId('sblp-1'), 'compiladores')).toBe(true);
    expect(matchesSearch(byId('sblp-1'), 'compilers')).toBe(true);
  });

  it('matches activity titles and speakers, ignoring case and accents', () => {
    expect(matchesSearch(byId('sbes-research-1'), 'FLAKY')).toBe(true);
    expect(matchesSearch(byId('sblp-1'), 'joao goncalves')).toBe(true);
    expect(matchesSearch(byId('keynote-1'), 'marcia')).toBe(true);
    expect(matchesSearch(byId('sbes-research-1'), 'ana souza')).toBe(true);
  });

  it('requires every word to match', () => {
    expect(matchesSearch(byId('sblp-1'), 'lua inference')).toBe(true);
    expect(matchesSearch(byId('sblp-1'), 'lua testing')).toBe(false);
  });
});

describe('program filters', () => {
  it('filters by event, track and category, combined with search', () => {
    expect(ids(filterSessions(sessions, { event: 'cbsoft' }))).toEqual(['opening', 'keynote-1']);
    expect(ids(filterSessions(sessions, { track: 'research' }))).toEqual(['sbes-research-1']);
    expect(ids(filterSessions(sessions, { category: 'papers' }))).toEqual(['sbes-research-1', 'sblp-1']);
    expect(ids(filterSessions(sessions, { category: 'papers', q: 'lua' }))).toEqual(['sblp-1']);
    expect(filterSessions(sessions, { event: 'sast' })).toHaveLength(0);
  });
});

describe('program days and times', () => {
  it('lists distinct days in order and opens on today during the congress', () => {
    const days = programDays(sessions);
    expect(days).toEqual(['2027-09-28', '2027-09-29']);
    expect(defaultDay(days, new Date('2026-11-25T12:00:00Z'))).toBe('2027-09-28');
    expect(defaultDay(days, new Date('2027-09-29T14:00:00Z'))).toBe('2027-09-29');
  });

  it('sorts by time, with unconfirmed times last', () => {
    const day2 = sessions.filter((s) => s.day === '2027-09-29');
    expect(ids(sortSessions([...day2].reverse()))).toEqual(['keynote-1', 'workshop-tba']);
  });

  it('uses Belo Horizonte time and only confirms sessions with a start time', () => {
    expect(new Date(sessionDateTime('2027-09-28', '10:30')).toISOString()).toBe('2027-09-28T13:30:00.000Z');
    expect(hasConfirmedTime(byId('keynote-1'))).toBe(true);
    expect(hasConfirmedTime(byId('workshop-tba'))).toBe(false);
  });
});
