import type { Program } from '@/data/program';

/** Test-only program: two days, two rooms, every kind of filter value. */
export const PROGRAM_FIXTURE: Program = {
  rooms: [
    { id: 'aud1', name: { pt: 'Auditório 1', en: 'Auditorium 1' } },
    { id: 'sala2', name: 'Sala 2' },
  ],
  sessions: [
    {
      id: 'opening',
      day: '2027-09-28',
      start: '09:00',
      end: '10:00',
      event: 'cbsoft',
      category: 'opening',
      title: { pt: 'Abertura do CBSoft', en: 'CBSoft Opening' },
    },
    {
      id: 'sbes-research-1',
      day: '2027-09-28',
      start: '10:30',
      end: '12:00',
      roomId: 'aud1',
      event: 'sbes',
      track: 'research',
      category: 'papers',
      title: { pt: 'Sessão Técnica: Testes de Software', en: 'Technical Session: Software Testing' },
      chair: { name: 'Ana Souza', affiliation: 'PUC Minas' },
      activities: [
        { id: 'p1', title: 'Mutation Testing at Scale', speakers: [{ name: 'Bruno Lima' }] },
        { id: 'p2', title: 'Flaky Tests in CI', speakers: [{ name: 'Carla Pereira' }] },
      ],
    },
    {
      id: 'sblp-1',
      day: '2027-09-28',
      start: '10:30',
      end: '12:00',
      roomId: 'sala2',
      event: 'sblp',
      category: 'papers',
      title: { pt: 'Sessão Técnica: Compiladores', en: 'Technical Session: Compilers' },
      activities: [
        { id: 'p3', title: 'Type Inference for Lua', speakers: [{ name: 'João Gonçalves' }] },
      ],
    },
    {
      id: 'keynote-1',
      day: '2027-09-29',
      start: '09:00',
      end: '10:00',
      roomId: 'aud1',
      event: 'cbsoft',
      category: 'keynote',
      title: { pt: 'Palestra: IA e Engenharia de Software', en: 'Keynote: AI and Software Engineering' },
      speakers: [{ name: 'Márcia Ribeiro', affiliation: 'UFMG' }],
    },
    {
      id: 'workshop-tba',
      day: '2027-09-29',
      start: null,
      end: null,
      event: 'workshops',
      category: 'workshop',
      title: { pt: 'Workshop de Educação', en: 'Education Workshop' },
    },
  ],
};
