export type HeaderMenuId =
    | 'cbsoft'
    | 'sbes'
    | 'sblp'
    | 'sbcars'
    | 'sast'
    | 'workshops'
    | 'more';

import { SBES_TRACKS, type SbesTrackId } from './sbesTracks';
import { sbesTrackCallPath, symposiumCallPath } from './symposiumCalls';
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
    titleKey: string;
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

/** Likewise, every "Artigos Aceitos" link shares one page for now; the
 *  per-track pages (/sbes/<slug>/artigos-aceitos) are ready for later. */
export const ACCEPTED_PAPERS_PATH = '/artigos-aceitos';

/** An SBES track: its call for papers and its accepted-papers page. */
const sbesTrack = (id: SbesTrackId): HeaderMenuLink => ({
    ...link(`sbes.tracks.${id}`, sbesTrackCallPath(id)),
    children: [
        { href: sbesTrackCallPath(id), titleKey: 'headerMenu.sbes.trackCall' },
        { href: ACCEPTED_PAPERS_PATH, titleKey: 'headerMenu.sbes.trackPapers' },
    ],
});

const symposiumMenu = (id: 'sblp' | 'sbcars' | 'sast'): HeaderMenuDefinition => [
    {
        titleKey: `headerMenu.${id}.title`,
        links: [
            link(`${id}.call`, symposiumCallPath(id)),
            //link(`${id}.program`, '#agenda'),
            link(`${id}.papers`, ACCEPTED_PAPERS_PATH),
        ],
    },
];

// The current app is a single page. Keep its anchor navigation; connect
// dedicated pages here when their routes and 2027 content are available.
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
                // link('program.schedule', '#agenda'),
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
                link('guide.venue', '/local#mapa'),
                link('guide.map', CAMPUS_MAP_PATH),
                link('guide.accommodation', '/acomodacoes'),
                // link('guide.experiences', '#experiencias-bh'),
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
            links: SBES_TRACKS.map((track) => sbesTrack(track.id)),
        },
        /*{
            titleKey: 'headerMenu.sbes.programTitle',
            links: [link('sbes.program', '#agenda')],
        },*/
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
                // link('workshops.program', '#agenda'),
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
