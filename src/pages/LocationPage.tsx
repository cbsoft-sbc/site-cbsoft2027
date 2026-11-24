import '@/styles/page-content.css';
import '@/styles/venue.css';

import './LocationPage.css';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BrandBar } from '@/components/ui/BrandBar';
import { IMAGES } from '@/data/config';
import { VENUE } from '@/data/venue';
import { useLang } from '@/hooks/useLang';
import { pick } from '@/lib/localized';

export function LocationPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { hash, key } = useLocation();
  const confirmed = Boolean(VENUE.name && VENUE.address);

  useEffect(() => {
    const previous = document.title;
    document.title = t('locationPage.metaTitle');
    return () => { document.title = previous; };
  }, [t]);

  useEffect(() => {
    const map = hash === '#mapa' || hash === '#mapa-puc'
      ? document.getElementById(hash.slice(1))
      : null;
    if (map) {
      map.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, key]);

  return (
    <main className="about-page location-page" id="local-evento">
      <section className="about-section about-top">
        <div className="container-xl">
          <h1 className="about-title">
            <BrandBar />
            {t('locationPage.title')}
          </h1>
          <p className="about-lead">
            {VENUE.name ? pick(VENUE.name, lang) : t('location.unconfirmed')}
          </p>
          {confirmed && (
            <>
              <section id="mapa" className="venue-map" aria-labelledby="venue-map-title">
                <h2 className="about-h2" id="venue-map-title">{t('locationPage.mapTitle')}</h2>
                <iframe
                  className="venue-map__embed"
                  title={t('locationPage.mapEmbedTitle')}
                  src={`${VENUE.mapsEmbedUrl}&hl=${lang}`}
                  loading="lazy"
                  allowFullScreen
                />
                <p className="about-prose">{t('locationPage.mapDescription')}</p>
                <div className="venue-map-actions">
                  <Button variant="accent" href={VENUE.directionsUrl} target="_blank" rel="noopener noreferrer">
                    {t('locationPage.directions')}
                  </Button>
                  <Button variant="outline" href={VENUE.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {t('locationPage.openMap')}
                  </Button>
                </div>
                <p className="venue-source">
                  <a href={VENUE.officialUrl} target="_blank" rel="noopener noreferrer">
                    {t('locationPage.officialLocation')}
                  </a>
                </p>
              </section>
              <section id="mapa-puc" className="venue-map" aria-labelledby="venue-campus-map-title">
                <h2 className="about-h2" id="venue-campus-map-title">{t('headerMenu.guide.map.title')}</h2>
                <div className="venue-map-actions">
                  <Button variant="outline" href={IMAGES.mapa_puc} target="_blank" rel="noopener noreferrer">
                    {t('locationPage.campusMapFullSize')}
                  </Button>
                </div>
                <img
                  className="venue-map__image"
                  src={IMAGES.mapa_puc}
                  alt={t('locationPage.campusMapAlt')}
                  width={1086}
                  height={1448}
                  loading="lazy"
                />
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
