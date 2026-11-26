import type { SbesTrackId } from './sbesTracks';
import type { SymposiumId } from './symposia';

interface ConfirmedPerson {
  name: string;
  affiliation: string;
}

export interface CommitteePerson extends ConfirmedPerson {
  photo?: string;
  photoFraming?: 'top' | 'rotate-left';
}

export const GENERAL_ORGANIZATION: readonly CommitteePerson[] = [
  { name: 'Laerte Xavier', affiliation: 'PUC Minas', photo: 'laerte-xavier.png' },
  { name: 'João Eduardo Montandon', affiliation: 'UFMG', photo: 'joao-eduardo-montandon.jpg' },
  { name: 'Johnatan Alves', affiliation: 'UFLA', photo: 'johnatan-alves.png' },
  { name: 'Aline Brito', affiliation: 'UFOP', photo: 'aline-brito.jpg' },
  { name: 'Lucas Vegi', affiliation: 'UFV', photo: 'lucas-vegi.jpg' },
  { name: 'Luciana Lourdes', affiliation: 'IFMG', photo: 'luciana-lourdes.jpg' },
];

export const WEBSITE_TEAM: readonly CommitteePerson[] = [
  { name: 'Abner Almeida', affiliation: 'PUC Minas', photo: 'abner-almeida.jpg' },
  { name: 'Enzo Casaes', affiliation: 'PUC Minas', photo: 'enzo-casaes.jpg' },
];

export const PROGRAM_CHAIRS: Record<SymposiumId, ConfirmedPerson[]> = {
  sbes: [],
  sblp: [{ name: 'Fernando Pereira', affiliation: 'UFMG' }],
  sbcars: [
    { name: 'Larissa Rocha', affiliation: 'UEFS' },
    { name: 'Matheus Paixão', affiliation: 'UECE' },
  ],
  sast: [
    { name: 'Patricia Machado', affiliation: 'UFCG' },
    { name: 'Adenilso Simão', affiliation: 'ICMC/USP' },
  ],
};

export const SBES_TRACK_CHAIRS = {
  research: [
    { name: 'Thelma Colanzi', affiliation: 'UEM', photo: 'thelma-colanzi.png' },
    { name: 'Cleidson de Souza', affiliation: 'UFPA', photo: 'cleidson-de-souza.png' },
  ],
  ideas: [
    { name: 'Edna', affiliation: 'UnB' },
    { name: 'Rodrigo Santos', affiliation: 'UNIRIO', photo: 'rodrigo-santos.png', photoFraming: 'top' },
  ],
  tools: [
    { name: 'Simone Souza', affiliation: 'ICMC/USP', photo: 'simone-souza.png', photoFraming: 'rotate-left' },
    { name: 'Davi Viana', affiliation: 'UFMA', photo: 'davi-viana.png' },
  ],
  education: [
    { name: 'Patricia Matsubara', affiliation: 'UFMS', photo: 'patricia-matsubara.png' },
    { name: 'Allyson Araújo', affiliation: 'UFCA', photo: 'allyson-araujo.png' },
  ],
} satisfies Partial<Record<SbesTrackId, CommitteePerson[]>>;
