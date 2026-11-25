import type { Localized } from '@/lib/localized';
import { SYMPOSIA, type SymposiumId } from './symposia';

/**
 * Facts for the standalone "Sobre o CBSoft" page (/sobre).
 *
 * Only officially available information is kept here. The 2026 congress was
 * the XVII edition, so 2027 is the XVIII (18ª). Dates and the host venue are
 * NOT confirmed yet (see PUBLICATION) — the page must show "A definir" and
 * must not name an institution.
 */
export const ABOUT_CONGRESS = {
  /** Roman-numeral form, e.g. used as "18ª edição do CBSoft". */
  editionRoman: 'XVIII',
  /** Ordinal form, e.g. used as "18ª edição do CBSoft". */
  editionOrdinal: '18ª',
  year: 2027,
  city: 'Belo Horizonte',
  state: 'MG',
  stateName: 'Minas Gerais',
  symposiaCount: SYMPOSIA.length,
} as const;

/** One sentence per symposium, shown on its card on the "Sobre" page. */
export const SYMPOSIUM_DESCRIPTIONS: Record<SymposiumId, Localized> = {
  sbes: {
    pt: 'Dedicado à pesquisa e à prática em Engenharia de Software.',
    en: 'Dedicated to research and practice in Software Engineering.',
  },
  sblp: {
    pt: 'Reúne pesquisadores e profissionais interessados no projeto, na implementação e na teoria de linguagens de programação.',
    en: 'Brings together researchers and practitioners interested in the design, implementation and theory of programming languages.',
  },
  sbcars: {
    pt: 'Abrange temas como linhas de produto de software, desenvolvimento de software baseado em componentes, arquiteturas de software e reutilização.',
    en: 'Covers topics such as software product lines, component-based software development, software architectures and reuse.',
  },
  sast: {
    pt: 'Dedicado à sistematização e à automação do teste de software.',
    en: 'Dedicated to the systematization and automation of software testing.',
  },
};

/** Links in the "Sobre a SBC" section. The 2026 site pointed to a misspelt
 *  /comissoes-especiasis/ URL (404); this is the working address. */
export const SBC_SPECIAL_COMMITTEES_URL = 'https://www.sbc.org.br/comissoes-especiais/';
export const SBC_MEMBERSHIP_URL = 'https://centraldesistemas.sbc.org.br/mom';
