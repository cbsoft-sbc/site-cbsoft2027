import type { SymposiumId } from './symposia';
import { SBES_TRACKS, type SbesTrackId } from './sbesTracks';

/* Call-for-papers URLs. Kept apart from symposiumCalls.ts (the full call
 * texts, ~200 KB) so the header, routes and cards can link to a call
 * without pulling every call into the initial JavaScript. */

export const symposiumCallPath = (id: SymposiumId) => `/${id}/chamada`;

export const sbesTrackCallPath = (id: SbesTrackId) =>
  `/sbes/${SBES_TRACKS.find((track) => track.id === id)!.slug}/chamada`;
