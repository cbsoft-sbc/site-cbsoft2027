export type HeaderMenuId =
    | 'cbsoft'
    | 'sbes'
    | 'sblp'
    | 'sbcars'
    | 'sast'
    | 'workshops'
    | 'more';

import { SBES_TRACKS, acceptedPapersPath, type SbesTrack } from './sbesTracks';
import { symposiumPapersPath } from './acceptedPapers';
import { sbesTrackCallPath, symposiumCallPath } from './callPaths';
import { EXPERIENCES_PATH } from './experiences';
import { PROGRAM_PATH, programPath } from './program';
import { CAMPUS_MAP_PATH } from './venue';

export interface HeaderMenuSubLink {
    href: string;
    titleKey: string;
}

export interface HeaderMenuLink {
    href: string;
    titleKey: string;
    external?: boolean;
    /** When set, the item is a group label and these are its links. */
    children?: HeaderMenuSubLink[];
}

export interface HeaderMenuSection {
    titleKey?: string;
    links: HeaderMenuLink[];
}

export type HeaderMenuDefinition = HeaderMenuSection[];

const link = (key: string, href: string, external = false): HeaderMenuLink => ({
    href,
    titleKey: `headerMenu.${key}.title`,
    external,
});

/** Calls for papers of the whole congress; each symposium also has its own
 *  page (symposiumCallPath). */
export const CALL_FOR_PAPERS_PATH = '/workshops/chamada';

/** General accepted-papers page (CBSOFT'27 menu). Each symposium has its
 *  own page — /sblp/artigos-aceitos, /sbes/<track>/artigos-aceitos… — so
 *  the header highlights the symposium being viewed. */
export const ACCEPTED_PAPERS_PATH = '/artigos-aceitos';

/** An SBES track: its call for papers and its accepted-papers page. */
const sbesTrack = (track: SbesTrack): HeaderMenuLink => ({
    ...link(`sbes.tracks.${track.id}`, sbesTrackCallPath(track.id)),
    children: [
        { href: sbesTrackCallPath(track.id), titleKey: 'headerMenu.sbes.trackCall' },
        { href: acceptedPapersPath(track), titleKey: 'headerMenu.sbes.trackPapers' },
    ],
});

const symposiumMenu = (id: 'sblp' | 'sbcars' | 'sast'): HeaderMenuDefinition => [
    {
        links: [
            link(`${id}.call`, symposiumCallPath(id)),
            link(`${id}.program`, programPath(id)),
            link(`${id}.papers`, symposiumPapersPath(id)),
        ],
    },
];

export const HEADER_MENUS: Record<HeaderMenuId, HeaderMenuDefinition> = {
    cbsoft: [
        {
            titleKey: 'headerMenu.event.title',
            links: [
                link('event.about', '/sobre'),
                link('event.organization', '/organizacao'),
                // link('event.speakers', '#palestrantes'),
            ],
        },
        {
            titleKey: 'headerMenu.program.title',
            links: [
                link('program.schedule', PROGRAM_PATH),
                link('program.articles', ACCEPTED_PAPERS_PATH),
                // link('program.special', '#eventos'),
            ],
        },
        {
            titleKey: 'headerMenu.participation.title',
            links: [
                // link('participation.volunteers', '/voluntarios'),
                link('participation.conduct', '/codigo-de-conduta'),
            ],
        },
        {
            titleKey: 'headerMenu.guide.title',
            links: [
                link('guide.venue', '/local'),
                link('guide.map', CAMPUS_MAP_PATH),
                link('guide.accommodation', '/acomodacoes'),
                link('guide.experiences', EXPERIENCES_PATH),
            ],
        },
        {
            titleKey: 'headerMenu.history.title',
            links: [link('history.previous', '/edicoes-anteriores')],
        },
    ],
    // One list of tracks; each opens a side flyout with its two links.
    sbes: [
        {
            titleKey: 'headerMenu.sbes.tracksTitle',
            links: SBES_TRACKS.map(sbesTrack),
        },
        {
            titleKey: 'headerMenu.sbes.programTitle',
            links: [link('sbes.program', programPath('sbes'))],
        },
    ],
    sblp: symposiumMenu('sblp'),
    sbcars: symposiumMenu('sbcars'),
    sast: symposiumMenu('sast'),
    workshops: [
        {
            titleKey: 'headerMenu.workshops.title',
            links: [
                link('workshops.call', '/workshops/chamada'),
                // link('workshops.accepted', '#workshops-aceitos'),
                link('workshops.program', programPath('workshops')),
                // link('workshops.papers', '#artigos-aceitos'),
            ],
        },
    ],
    more: [
        {
            titleKey: 'headerMenu.more.communityTitle',
            links: [
                link('more.artifacts', '#artefatos'),
                link('more.latam', '#latam-school'),
                link('more.highSchool', '#ensino-medio'),
            ],
        },
        {
            titleKey: 'headerMenu.more.eventsTitle',
            links: [
                link('more.aiware', 'https://aiware-latam.github.io/', true),
                link('more.freeSoftware', '#software-livre'),
            ],
        },
    ],
};
