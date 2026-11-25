import '@/styles/page-content.css';
import '@/styles/call-layout.css';
import '@/styles/links.css';

import './AcceptedPapersPage.css';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { BrandBar } from '@/components/ui/BrandBar';
import { SYMPOSIUM_PAPERS, type PapersSymposiumId } from '@/data/acceptedPapers';
import { SBES_TRACKS, acceptedPapersPath, type AcceptedPaper } from '@/data/sbesTracks';
import { SYMPOSIA } from '@/data/symposia';

function PaperList({ papers, pending }: { papers: AcceptedPaper[]; pending: string }) {
  return papers.length > 0 ? (
    <ol className="papers-list">
      {papers.map((paper) => (
        <li key={paper.title}>
          <strong>{paper.title}</strong>
          <span>{paper.authors.join(', ')}</span>
        </li>
      ))}
    </ol>
  ) : (
    <p className="papers-pending">{pending}</p>
  );
}

/** Accepted papers: the general page (/artigos-aceitos, CBSOFT'27 menu),
 *  one symposium (/sbcars/artigos-aceitos) or one SBES track
 *  (/sbes/:track/artigos-aceitos). */
export function AcceptedPapersPage({ symposium }: { symposium?: PapersSymposiumId }) {
  const { t } = useTranslation();
  const { track: slug } = useParams();
  const track = SBES_TRACKS.find((item) => item.slug === slug);
  const trackNotFound = Boolean(slug && !track);
  const trackTitle = track ? t(`headerMenu.sbes.tracks.${track.id}.title`) : '';
  const acronym = symposium ? SYMPOSIA.find((s) => s.id === symposium)?.acronym ?? '' : '';

  useEffect(() => {
    const previous = document.title;
    if (symposium) document.title = t('acceptedPapersPage.symposiumMetaTitle', { acronym });
    else if (!slug) document.title = t('acceptedPapersPage.generalMetaTitle');
    else if (track) document.title = t('acceptedPapersPage.metaTitle', { track: trackTitle });
    window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, [t, symposium, acronym, slug, track, trackTitle]);

  return (
    <main className="about-page" id="artigos-aceitos">
      <section className="about-section about-top" aria-labelledby="artigos-titulo">
        <div className="container-xl">
          <h1 id="artigos-titulo" className="about-title">
            {!trackNotFound && <BrandBar />}
            {t(trackNotFound ? 'acceptedPapersPage.notFound' : 'acceptedPapersPage.title')}
          </h1>

          {symposium ? (
            <>
              <p className="papers-track">{acronym} 2027</p>
              <PaperList
                papers={SYMPOSIUM_PAPERS[symposium]}
                pending={t('acceptedPapersPage.symposiumPending', { acronym })}
              />
            </>
          ) : !slug ? (
            <p className="papers-pending">{t('acceptedPapersPage.generalPending')}</p>
          ) : track && (
            <>
              <p className="papers-track">
                {t('acceptedPapersPage.trackLabel', { track: trackTitle })}
              </p>

              <PaperList papers={track.papers} pending={t('acceptedPapersPage.pending')} />

              <h2 className="about-h2 wcall-h2">
                <BrandBar />
                {t('acceptedPapersPage.otherTracks')}
              </h2>
              <ul className="papers-tracks">
                {SBES_TRACKS.filter((item) => item.id !== track.id).map((item) => (
                  <li key={item.id}>
                    <Link to={acceptedPapersPath(item)} className="wcall-link">
                      {t(`headerMenu.sbes.tracks.${item.id}.title`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
