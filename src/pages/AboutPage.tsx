import '@/styles/page-content.css';

import './AboutPage.css';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AboutSbc } from '@/components/sections/AboutSbc';
import { SymposiumCards } from '@/components/sections/SymposiumCards';
import { VisualIdentity } from '@/components/sections/VisualIdentity';
import { BrandBar } from '@/components/ui/BrandBar';
import { SYMPOSIUM_DESCRIPTIONS } from '@/data/about';

export function AboutPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="about-page" id="sobre-cbsoft">
      {/* Sobre o CBSoft — further sections of the page go below this one. */}
      <section className="about-section about-top" aria-labelledby="sobre-titulo">
        <div className="container-xl">
          <h1 id="sobre-titulo" className="about-title">
            <BrandBar />
            {t('aboutPage.title')}
          </h1>
          <div className="about-prose about-text">
            <p>{t('aboutPage.p1')}</p>
            <p>{t('aboutPage.p2')}</p>
          </div>
          <SymposiumCards linkToCall descriptions={SYMPOSIUM_DESCRIPTIONS} />
          <div className="about-prose about-text">
            <p>{t('aboutPage.program')}</p>
          </div>
        </div>
      </section>

      <VisualIdentity />
      <AboutSbc />
    </main>
  );
}
