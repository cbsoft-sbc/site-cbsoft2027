import type { Localized } from '@/lib/localized';

export interface Experience {
  id: string;
  title: Localized;
  description: Localized;
  /** Optional link for more information or booking. */
  url?: string;
}

export type ExperienceCategoryId = 'turismo' | 'shows' | 'gastronomia';

export interface ExperienceCategory {
  /** Also the section anchor on /experiencias (e.g. /experiencias#turismo). */
  id: ExperienceCategoryId;
  items: Experience[];
}

export const EXPERIENCES_PATH = '/experiencias';

/** Experiences for participants, as approved by the organizing team.
 *  A category with no items shows a "to be announced" notice.
 *
 *  Example item:
 *  {
 *    id: 'mercado-central',
 *    title: { pt: 'Mercado Central', en: 'Central Market' },
 *    description: { pt: '…', en: '…' },
 *    url: 'https://…',
 *  },
 */
export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  { id: 'turismo', items: [] },
  { id: 'shows', items: [] },
  { id: 'gastronomia', items: [] },
];
