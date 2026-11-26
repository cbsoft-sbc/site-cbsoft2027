import '@/styles/page-content.css';
import '@/styles/call-layout.css';
import '@/styles/links.css';

import './WorkshopsCallPage.css';

import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BrandBar } from '@/components/ui/BrandBar';
import { CalendarIcon, PeopleIcon, PersonIcon } from '@/components/ui/CallIcons';
import { SymposiumCards } from '@/components/sections/SymposiumCards';
import {
  SBC_AUTHOR_CONDUCT_URL,
  WORKSHOP_CHAIRS,
  WORKSHOP_MILESTONES,
  WORKSHOP_SUBMISSION_URL,
} from '@/data/workshopsCall';

interface SubmissionItem {
  text: string;
  sub?: string[];
}

/** Bulleted list with optional nested items, as in the official call. */
function ItemList({ items }: { items: SubmissionItem[] }) {
  return (
    <ul className="wcall-list">
      {items.map((item) => (
        <li key={item.text}>
          {item.text}
          {item.sub && (
            <ul className="wcall-list wcall-list--sub">
              {item.sub.map((subItem) => (
                <li key={subItem}>{subItem}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/** JEMS link, or a "to be announced" note while the 2027 call is closed. */
function SubmissionLink() {
  const { t } = useTranslation();
  if (!WORKSHOP_SUBMISSION_URL) {
    return <em>{t('workshopsCallPage.submissionLinkTbd')}</em>;
  }
  return (
    <a
      href={WORKSHOP_SUBMISSION_URL}
      className="wcall-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {WORKSHOP_SUBMISSION_URL}
    </a>
  );
}

export function WorkshopsCallPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const criteria = t('workshopsCallPage.criteria', { returnObjects: true }) as string[];
  const submissionItems = t('workshopsCallPage.submissionItems', {
    returnObjects: true,
  }) as SubmissionItem[];
  const preApprovedCriteria = t('workshopsCallPage.preApprovedCriteria', {
    returnObjects: true,
  }) as string[];
  const preApprovedItems = t('workshopsCallPage.preApprovedItems', {
    returnObjects: true,
  }) as SubmissionItem[];

  return (
    <main className="about-page" id="workshops-chamada">
      <section className="about-section wcall-top">
        <div className="container-xl">
          <div className="wcall-layout">
            <div className="wcall-main">
              <h1 className="about-h2">
                <BrandBar />
                {t('workshopsCallPage.title')}
              </h1>
              <h2 className="wcall-subtitle">{t('workshopsCallPage.contextTitle')}</h2>
              <div className="about-prose wcall-prose">
                <p>{t('workshopsCallPage.contextP1')}</p>
                <p>{t('workshopsCallPage.contextP2')}</p>
              </div>
              <SymposiumCards />
              <div className="about-prose wcall-prose">
                <p>{t('workshopsCallPage.contextP3')}</p>
              </div>

              <h2 className="about-h2 wcall-h2">
                <BrandBar />
                {t('workshopsCallPage.generalTitle')}
              </h2>
              <div className="about-prose wcall-prose">
                <p>{t('workshopsCallPage.generalIntro')}</p>
                <ul className="wcall-list">
                  {criteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  <Trans i18nKey="workshopsCallPage.duration" components={{ b: <strong /> }} />
                </p>
                <p>{t('workshopsCallPage.schedule')}</p>
                <p>{t('workshopsCallPage.preferredDate')}</p>
                <blockquote className="wcall-note">
                  <strong>{t('workshopsCallPage.importantLabel')}</strong>{' '}
                  {t('workshopsCallPage.important')}
                </blockquote>
              </div>

              <h2 className="about-h2 wcall-h2">
                <BrandBar />
                {t('workshopsCallPage.submissionTitle')}
              </h2>
              <div className="about-prose wcall-prose">
                <p>{t('workshopsCallPage.submissionPreApproved')}</p>
                <p>
                  {t('workshopsCallPage.submissionWhere')} <SubmissionLink />
                </p>
                <p>{t('workshopsCallPage.submissionMustInclude')}</p>
                <ItemList items={submissionItems} />
              </div>

              <h2 className="about-h2 wcall-h2">
                <BrandBar />
                {t('workshopsCallPage.preApprovedTitle')}
              </h2>
              <div className="about-prose wcall-prose">
                <p>
                  <Trans i18nKey="workshopsCallPage.preApprovedIntro" components={{ i: <em /> }} />
                </p>
                <ul className="wcall-list">
                  {preApprovedCriteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>
                  {t('workshopsCallPage.preApprovedWhere')} <SubmissionLink />
                </p>
                <p>{t('workshopsCallPage.preApprovedMustInclude')}</p>
                <ItemList items={preApprovedItems} />
                <p>{t('workshopsCallPage.preApprovedOutcome')}</p>
              </div>

              <h2 className="about-h2 wcall-h2">
                <BrandBar />
                {t('workshopsCallPage.ethicsTitle')}
              </h2>
              <div className="about-prose wcall-prose">
                <p>
                  <Trans
                    i18nKey="workshopsCallPage.ethics"
                    components={{
                      a: (
                        <a
                          href={SBC_AUTHOR_CONDUCT_URL}
                          className="wcall-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  />
                </p>
              </div>
            </div>

            <div className="wcall-side">
              <aside className="wcall-dates" aria-labelledby="wcall-dates-title">
                <h2 id="wcall-dates-title" className="wcall-dates__title">
                  <span className="wcall-dates__title-icon">
                    <CalendarIcon />
                  </span>
                  {t('workshopsCallPage.datesTitle')}
                </h2>
                <ol className="wcall-dates__list">
                  {WORKSHOP_MILESTONES.map((m) => (
                    <li key={m.key} className="wcall-dates__item">
                      <span className="wcall-side__icon">
                        <CalendarIcon />
                      </span>
                      <span className="wcall-dates__body">
                        <span className="wcall-dates__label">
                          {t(`workshopsCallPage.milestones.${m.key}`)}
                        </span>
                        <span className="wcall-dates__date">
                          {m.date ?? t('workshopsCallPage.tbd')}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </aside>

              <aside className="wcall-dates" aria-labelledby="wcall-org-title">
                <h2 id="wcall-org-title" className="wcall-dates__title">
                  <span className="wcall-dates__title-icon">
                    <PeopleIcon />
                  </span>
                  {t('workshopsCallPage.organizationTitle')}
                </h2>
                <div className="wcall-org">
                  <h3 className="wcall-org__subtitle">{t('workshopsCallPage.chairsTitle')}</h3>
                  <ul className="wcall-org__list">
                    {WORKSHOP_CHAIRS.map((chair, index) => (
                      <li key={index} className="wcall-org__item">
                        <span className="wcall-side__icon">
                          <PersonIcon />
                        </span>
                        <span className="wcall-org__body">
                          <span className="wcall-org__name">
                            {chair.name ?? t('committee.tbc')}
                            {chair.affiliation && <span> — {chair.affiliation}</span>}
                          </span>
                          {chair.email?.includes('@') ? (
                            <a href={`mailto:${chair.email}`} className="wcall-link">
                              {chair.email}
                            </a>
                          ) : chair.email && (
                            <span className="wcall-org__email">{chair.email}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
