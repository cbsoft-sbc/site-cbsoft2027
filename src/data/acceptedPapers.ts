import type { AcceptedPaper } from './sbesTracks';

/** Symposia with a single accepted-papers page. SBES has one per track
 *  (see sbesTracks.ts). */
export type PapersSymposiumId = 'sblp' | 'sbcars' | 'sast';

export const PAPERS_SYMPOSIA: PapersSymposiumId[] = ['sblp', 'sbcars', 'sast'];

/** Accepted papers per symposium; empty until the 2027 notifications are out. */
export const SYMPOSIUM_PAPERS: Record<PapersSymposiumId, AcceptedPaper[]> = {
  sblp: [],
  sbcars: [],
  sast: [],
};

/** e.g. /sbcars/artigos-aceitos — the first segment makes the header
 *  highlight the symposium (getCurrentHeaderMenu). */
export const symposiumPapersPath = (id: PapersSymposiumId) => `/${id}/artigos-aceitos`;
