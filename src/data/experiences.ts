import type { Localized } from '@/lib/localized';

export interface Experience {
  id: string;
  title: Localized;
  description: Localized;
  /** Short note shown next to the name, e.g. "Patrimônio Mundial da UNESCO". */
  tag?: Localized;
  /** Optional link for more information or booking. */
  url?: string;
}

export type ExperienceCategoryId = 'pampulha' | 'turismo' | 'gastronomia' | 'cultura' | 'deslocamento';

export interface ExperienceCategory {
  /** Also the section anchor on /experiencias (e.g. /experiencias#turismo). */
  id: ExperienceCategoryId;
  items: Experience[];
}

export const EXPERIENCES_PATH = '/experiencias';

/** Official Belo Horizonte tourism portal, for more routes and attractions. */
export const BH_TOURISM_PORTAL_URL = 'https://portalbelohorizonte.com.br/';

/** Tourism guide for participants. The event is at PUC Minas (Coração
 *  Eucarístico); Pampulha is listed as a destination, not as the venue.
 *  A category with no items shows a "to be announced" notice. */
export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  {
    id: 'pampulha',
    items: [
      {
        id: 'lagoa-pampulha',
        title: { pt: 'Lagoa da Pampulha', en: 'Pampulha Lake' },
        description: {
          pt: 'Um dos principais cartões-postais de Belo Horizonte. Ideal para caminhadas, passeios de bicicleta e contemplação da paisagem.',
          en: "One of Belo Horizonte's best-known landmarks. Ideal for walks, bike rides and taking in the view.",
        },
      },
      {
        id: 'igrejinha',
        title: {
          pt: 'Igreja São Francisco de Assis (Igrejinha da Pampulha)',
          en: 'Church of Saint Francis of Assisi (Igrejinha da Pampulha)',
        },
        tag: { pt: 'Patrimônio Mundial da UNESCO', en: 'UNESCO World Heritage' },
        description: {
          pt: 'Projetada por Oscar Niemeyer, com obras de Cândido Portinari, é um dos símbolos da arquitetura modernista brasileira.',
          en: 'Designed by Oscar Niemeyer, with works by Cândido Portinari, it is one of the symbols of Brazilian modernist architecture.',
        },
      },
      {
        id: 'mineirao',
        title: { pt: 'Mineirão', en: 'Mineirão Stadium' },
        description: {
          pt: 'Um dos estádios mais importantes do Brasil. Além de grandes partidas e eventos, oferece visitas ao Museu Brasileiro do Futebol, conforme programação.',
          en: "One of Brazil's most important stadiums. Besides major matches and events, it offers visits to the Brazilian Football Museum, subject to schedule.",
        },
      },
      {
        id: 'casa-do-baile',
        title: { pt: 'Casa do Baile', en: 'Casa do Baile' },
        description: {
          pt: 'Obra de Oscar Niemeyer às margens da Lagoa da Pampulha, conhecida por suas formas curvas e importância arquitetônica.',
          en: 'An Oscar Niemeyer building on the shore of Pampulha Lake, known for its curved forms and architectural significance.',
        },
      },
      {
        id: 'map',
        title: { pt: 'Museu de Arte da Pampulha (MAP)', en: 'Pampulha Art Museum (MAP)' },
        description: {
          pt: 'Espaço dedicado às artes visuais, instalado em um dos edifícios históricos do Conjunto Moderno da Pampulha.',
          en: 'A visual arts venue housed in one of the historic buildings of the Pampulha Modern Ensemble.',
        },
      },
      {
        id: 'parque-ecologico',
        title: { pt: 'Parque Ecológico da Pampulha', en: 'Pampulha Ecological Park' },
        description: {
          pt: 'Uma excelente opção para quem busca contato com a natureza, áreas verdes e momentos de tranquilidade.',
          en: 'A great option for anyone looking for nature, green spaces and a quiet break.',
        },
      },
    ],
  },
  {
    id: 'turismo',
    items: [
      {
        id: 'praca-liberdade',
        title: { pt: 'Praça da Liberdade e Circuito Liberdade', en: 'Liberdade Square and Circuito Liberdade' },
        description: {
          pt: 'Um dos conjuntos culturais mais importantes da cidade, com museus, centros culturais, jardins e edifícios históricos.',
          en: "One of the city's most important cultural complexes, with museums, cultural centres, gardens and historic buildings.",
        },
      },
      {
        id: 'mercado-central',
        title: { pt: 'Mercado Central', en: 'Central Market' },
        tag: { pt: 'Desde 1929', en: 'Since 1929' },
        description: {
          pt: 'Parada obrigatória para conhecer a cultura mineira, com centenas de lojas de queijos, doces, cafés, artesanato e produtos típicos.',
          en: 'A must for getting to know Minas Gerais culture, with hundreds of shops selling cheese, sweets, coffee, crafts and local products.',
        },
      },
      {
        id: 'parque-municipal',
        title: { pt: 'Parque Municipal Américo Renné Giannetti', en: 'Américo Renné Giannetti Municipal Park' },
        description: {
          pt: 'No centro da cidade, oferece áreas verdes, lagos e espaços para descanso em meio à movimentação urbana.',
          en: 'In the city centre, with green areas, lakes and places to rest amid the bustle of the city.',
        },
      },
      {
        id: 'praca-do-papa',
        title: { pt: 'Praça do Papa', en: 'Praça do Papa' },
        description: {
          pt: 'Em uma região elevada da cidade, proporciona uma das vistas panorâmicas mais bonitas de Belo Horizonte.',
          en: 'Set on high ground, it offers one of the most beautiful panoramic views of Belo Horizonte.',
        },
      },
      {
        id: 'mirante-mangabeiras',
        title: { pt: 'Mirante do Mangabeiras', en: 'Mangabeiras Lookout' },
        tag: { pt: 'Pôr do sol', en: 'Sunset' },
        description: {
          pt: 'Um dos melhores lugares para apreciar a paisagem da capital, especialmente durante o pôr do sol.',
          en: "One of the best places to take in the city's landscape, especially at sunset.",
        },
      },
      {
        id: 'feira-hippie',
        title: { pt: 'Feira Hippie de Belo Horizonte', en: 'Belo Horizonte Hippie Fair' },
        tag: { pt: 'Aos domingos', en: 'Sundays' },
        description: {
          pt: 'Tradicionalmente na Avenida Afonso Pena, reúne artesanato, roupas, acessórios, gastronomia e produtos de artistas locais.',
          en: 'Traditionally held on Avenida Afonso Pena, with crafts, clothing, accessories, food and work by local artists.',
        },
      },
    ],
  },
  {
    id: 'gastronomia',
    items: [
      {
        id: 'mercado-central-comida',
        title: { pt: 'Mercado Central', en: 'Central Market' },
        description: {
          pt: 'Experimente pão de queijo, queijo minas, doce de leite, fígado com jiló, torresmo e outras especialidades regionais.',
          en: 'Try pão de queijo, Minas cheese, doce de leite, liver with jiló, pork crackling and other regional specialities.',
        },
      },
      {
        id: 'mercado-novo',
        title: { pt: 'Mercado Novo', en: 'Mercado Novo' },
        description: {
          pt: 'Reúne bares, restaurantes, cafés, lojas criativas e ambientes com propostas gastronômicas variadas.',
          en: 'A mix of bars, restaurants, cafés, creative shops and a wide range of food concepts.',
        },
      },
      {
        id: 'savassi',
        title: { pt: 'Savassi', en: 'Savassi' },
        description: {
          pt: 'Uma das regiões mais movimentadas da cidade, com muitos bares, restaurantes, cafeterias e opções de entretenimento noturno.',
          en: "One of the city's liveliest areas, full of bars, restaurants, cafés and nightlife.",
        },
      },
      {
        id: 'lourdes',
        title: { pt: 'Lourdes', en: 'Lourdes' },
        description: {
          pt: 'Bairro conhecido por restaurantes, cafés e estabelecimentos gastronômicos, da culinária mineira à cozinha contemporânea.',
          en: 'A neighbourhood known for restaurants and cafés, from Minas Gerais cooking to contemporary cuisine.',
        },
      },
      {
        id: 'santa-tereza',
        title: { pt: 'Santa Tereza', en: 'Santa Tereza' },
        tag: { pt: 'Música ao vivo', en: 'Live music' },
        description: {
          pt: 'Bairro tradicional, conhecido pela boemia, música ao vivo, bares e forte identidade cultural.',
          en: 'A traditional neighbourhood known for its bohemian spirit, live music, bars and strong cultural identity.',
        },
      },
    ],
  },
  {
    id: 'cultura',
    items: [
      {
        id: 'circuito-liberdade',
        title: { pt: 'Circuito Liberdade', en: 'Circuito Liberdade' },
        description: {
          pt: 'Reserve algumas horas para os museus e espaços culturais da Praça da Liberdade, como o CCBB BH, o Memorial Minas Gerais Vale, o MM Gerdau e o Espaço do Conhecimento UFMG.',
          en: "Set aside a few hours for the museums and cultural spaces around Liberdade Square, such as CCBB BH, Memorial Minas Gerais Vale, MM Gerdau and UFMG's Espaço do Conhecimento.",
        },
      },
      {
        id: 'conjunto-pampulha',
        title: { pt: 'Conjunto Moderno da Pampulha', en: 'Pampulha Modern Ensemble' },
        description: {
          pt: 'Explore os edifícios projetados por Oscar Niemeyer, um dos mais importantes conjuntos arquitetônicos do modernismo brasileiro.',
          en: 'Explore the buildings designed by Oscar Niemeyer, one of the most important architectural ensembles of Brazilian modernism.',
        },
      },
      {
        id: 'inhotim',
        title: { pt: 'Inhotim', en: 'Inhotim' },
        tag: { pt: '~60 km · reserve um dia inteiro', en: '~60 km · plan a full day' },
        description: {
          pt: 'Em Brumadinho, é um dos maiores centros de arte contemporânea a céu aberto do mundo, com galerias, jardins botânicos e paisagens naturais.',
          en: "In Brumadinho, it is one of the world's largest open-air contemporary art centres, combining galleries, botanical gardens and natural landscapes.",
        },
      },
      {
        id: 'praca-estacao',
        title: { pt: 'Praça da Estação e Museu de Artes e Ofícios', en: 'Praça da Estação and Museum of Arts and Crafts' },
        description: {
          pt: 'Uma oportunidade de conhecer parte da história da cidade, sua arquitetura e a evolução do trabalho no Brasil.',
          en: "A chance to see part of the city's history, its architecture and how work has evolved in Brazil.",
        },
      },
    ],
  },
  {
    id: 'deslocamento',
    items: [
      {
        id: 'onibus',
        title: { pt: 'Ônibus', en: 'Buses' },
        description: {
          pt: 'A cidade tem ampla rede de linhas municipais. As linhas que atendem o local do evento estão na página Local do Evento.',
          en: 'The city has a wide network of municipal bus routes. The routes serving the event venue are listed on the Event Venue page.',
        },
      },
      {
        id: 'move',
        title: { pt: 'MOVE/BRT', en: 'MOVE/BRT' },
        description: {
          pt: 'O sistema de ônibus rápido conecta diferentes regiões da cidade, incluindo a Pampulha ao Centro.',
          en: 'The bus rapid transit system links different parts of the city, including Pampulha and the city centre.',
        },
      },
      {
        id: 'aplicativos',
        title: { pt: 'Aplicativos de transporte', en: 'Ride-hailing apps' },
        description: {
          pt: 'Uber e 99 são alternativas práticas entre o local do evento, hotéis, restaurantes e atrações turísticas.',
          en: 'Uber and 99 are convenient options between the venue, hotels, restaurants and attractions.',
        },
      },
    ],
  },
];
