import '@/styles/page-content.css';
import '@/styles/links.css';

import './ExperiencesPage.css';

import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { BrandBar } from '@/components/ui/BrandBar';
import { BH_TOURISM_PORTAL_URL, EXPERIENCE_CATEGORIES, type ExperienceCategoryId } from '@/data/experiences';
import { VENUE } from '@/data/venue';
import { useLang } from '@/hooks/useLang';
import { pick } from '@/lib/localized';

/** Tourism guide for participants: each section has a title, a short intro
 *  and its places below. A category with no items shows a "to be announced"
 *  notice. */
export function ExperiencesPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [hash]);

  /** Closing line that belongs to one section only. */
  const extras: Partial<Record<ExperienceCategoryId, ReactNode>> = {
    gastronomia: <p className="guide-note">{t('experiencesPage.dishes')}</p>,
    cultura: (
      <p className="guide-more">
        <a href={BH_TOURISM_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="wcall-link">
          {t('experiencesPage.portal')} ↗
        </a>
      </p>
    ),
    deslocamento: (
      <p className="guide-more">
        <Link to={VENUE.infoUrl} className="wcall-link">
          {t('experiencesPage.venueLink')} →
        </Link>
      </p>
    ),
  };

  return (
    <main className="about-page" id="experiencias">
      <section className="about-section about-top" aria-labelledby="experiencias-titulo">
        <div className="container-xl">
          <h1 id="experiencias-titulo" className="about-title">
            <BrandBar />
            {t('experiencesPage.title')}
          </h1>
          <div className="about-prose about-text guide-intro">
            <p>{t('experiencesPage.intro')}</p>
            <p>{t('experiencesPage.introGuide')}</p>
          </div>

          {EXPERIENCE_CATEGORIES.map(({ id, items }) => (
            <section key={id} id={id} className="guide-section" aria-labelledby={`${id}-titulo`}>
              <header className="guide-section__head">
                <h2 id={`${id}-titulo`} className="about-h2">
                  {t(`experiencesPage.categories.${id}`)}
                </h2>
                <p>{t(`experiencesPage.categoryIntros.${id}`)}</p>
              </header>

              <div className="guide-section__body">
                {items.length > 0 ? (
                  <ul className="guide-list">
                    {items.map((item) => (
                      <li key={item.id}>
                        <div className="guide-list__title">
                          <h3>{pick(item.title, lang)}</h3>
                          {item.tag && <span className="guide-list__tag">{pick(item.tag, lang)}</span>}
                        </div>
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
                {extras[id]}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
