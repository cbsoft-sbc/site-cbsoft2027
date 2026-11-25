import '@/styles/page-content.css';

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandBar } from '@/components/ui/BrandBar';
import { Button } from '@/components/ui/Button';
import { IMAGES } from '@/data/config';

export function CampusMapPage() {
  const { t } = useTranslation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="about-page" id="mapa-puc">
      <section className="about-section about-top" aria-labelledby="campus-map-title">
        <div className="container-xl">
          <h1 id="campus-map-title" className="about-title">
            <BrandBar />
            {t('headerMenu.guide.map.title')}
          </h1>
          <div className="mt-6">
            <Button variant="outline" href={IMAGES.mapa_puc} target="_blank" rel="noopener noreferrer">
              {t('campusMapPage.fullSize')}
            </Button>
          </div>
          <img
            className="mt-5 block h-auto w-full max-w-3xl rounded-xl"
            src={IMAGES.mapa_puc}
            alt={t('campusMapPage.imageAlt')}
            width={768}
            height={1024}
          />
        </div>
      </section>
    </main>
  );
}
