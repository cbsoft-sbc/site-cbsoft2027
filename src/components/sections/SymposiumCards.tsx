import './SymposiumCards.css';

import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLang } from '@/hooks/useLang';
import type { Localized } from '@/lib/localized';
import { SYMPOSIA, type SymposiumId } from '@/data/symposia';
import { sbesTrackCallPath, symposiumCallPath } from '@/data/callPaths';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Small line icon per symposium, drawn in its accent colour. */
const SYMPOSIUM_ICONS: Record<SymposiumId, ReactNode> = {
  // Software Engineering: stacked layers.
  sbes: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 3 3 8l9 5 9-5z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  // Programming Languages: code brackets.
  sblp: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
    </svg>
  ),
  // Components & Architecture: connected blocks.
  sbcars: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h4a3 3 0 0 1 3 3V14" />
    </svg>
  ),
  // Software Testing: check mark in a circle.
  sast: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  ),
};

/** SBES has one call per track; its card opens the Research Track call. */
const callPath = (id: SymposiumId) =>
  id === 'sbes' ? sbesTrackCallPath('research') : symposiumCallPath(id);

/** The four symposia as cards: icon, edition + acronym and full name, plus
 *  an optional one-sentence description. With `linkToCall`, each card opens
 *  the symposium's Call for Papers. */
export function SymposiumCards({
  linkToCall = false,
  descriptions,
}: {
  linkToCall?: boolean;
  descriptions?: Record<SymposiumId, Localized>;
}) {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <ul className={`symposium-cards${descriptions ? ' symposium-cards--described' : ''}`}>
      {SYMPOSIA.map((symposium) => {
        const content = (
          <>
            <span className="symposium-card__icon">{SYMPOSIUM_ICONS[symposium.id]}</span>
            <span className="symposium-card__acronym">
              {symposium.edition[lang]} {symposium.acronym}
            </span>
            <span className="symposium-card__name">{symposium.title[lang]}</span>
            {descriptions && (
              <span className="symposium-card__description">{descriptions[symposium.id][lang]}</span>
            )}
            {linkToCall && (
              <span className="symposium-card__cta">
                {t('symposiumCards.callForPapers')}
                <span aria-hidden="true"> →</span>
              </span>
            )}
          </>
        );
        return (
          <li
            key={symposium.id}
            style={{ '--accent': `var(--${symposium.accent})` } as CSSProperties}
          >
            {linkToCall ? (
              <Link to={callPath(symposium.id)} className="symposium-card symposium-card--link">
                {content}
              </Link>
            ) : (
              <div className="symposium-card">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
