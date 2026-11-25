import '@/styles/page-content.css';
import '@/styles/links.css';

import './ExperiencesPage.css';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { BrandBar } from '@/components/ui/BrandBar';
import { EXPERIENCE_CATEGORIES } from '@/data/experiences';
import { useLang } from '@/hooks/useLang';
import { pick } from '@/lib/localized';

/** Experiences for participants, grouped by category (tourism, shows, food).
 *  Each category shows a placeholder until the organizing team approves its
 *  content in src/data/experiences.ts. */
export function ExperiencesPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash]);

  return (
    <main className="about-page" id="experiencias">
      <section className="about-section about-top" aria-labelledby="experiencias-titulo">
        <div className="container-xl">
          <h1 id="experiencias-titulo" className="about-title">
            <BrandBar />
            {t('experiencesPage.title')}
          </h1>
          <div className="about-prose about-text">
            <p>{t('experiencesPage.intro')}</p>
          </div>

          {EXPERIENCE_CATEGORIES.map(({ id, items }) => (
            <section key={id} id={id} className="experiences-category" aria-labelledby={`${id}-titulo`}>
              <h2 id={`${id}-titulo`} className="about-h2">
                {t(`experiencesPage.categories.${id}`)}
              </h2>

              {items.length > 0 ? (
                <ul className="experiences-list">
                  {items.map((item) => (
                    <li key={item.id} className="experiences-card">
                      <h3>{pick(item.title, lang)}</h3>
                      <p>{pick(item.description, lang)}</p>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="wcall-link">
                          {t('experiencesPage.moreInfo')}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="experiences-pending">{t('experiencesPage.pending')}</p>
              )}
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
