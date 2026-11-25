import type { Localized } from '@/lib/localized';

export interface CommitteePerson {
  name: string;
  affiliation: string;
  photo: string;
}

export const GENERAL_CHAIRS: readonly CommitteePerson[] = [
  { name: 'José Laerte Xavier', affiliation: 'PUC Minas', photo: 'jose-laerte-xavier.jpg' },
];

export const WEBSITE_TEAM: readonly CommitteePerson[] = [
  { name: 'Abner Almeida', affiliation: 'PUC Minas', photo: 'abner-almeida.jpg' },
  { name: 'Enzo Casaes', affiliation: 'PUC Minas', photo: 'enzo-casaes.jpg' },
];

/** Program-committee chairs, one line per symposium (chair TBC). */
export const PC_CHAIR_SYMPOSIA = ['SBES', 'SBLP', 'SBCARS', 'SAST'] as const;

/** Comitê Local — role names; the "to be confirmed" tail is added in the UI. */
export const LOCAL_COMMITTEE_ROLES: Localized[] = [
  { pt: 'Infraestrutura', en: 'Infrastructure' },
  { pt: 'Divulgação', en: 'Communication' },
  { pt: 'Patrocínio', en: 'Sponsorship' },
];
