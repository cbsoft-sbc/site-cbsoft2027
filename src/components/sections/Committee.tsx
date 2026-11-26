import './Committee.css';

import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { PersonIcon } from '@/components/ui/CallIcons';
import { Reveal } from '@/components/ui/Reveal';
import {
  GENERAL_ORGANIZATION,
  SBES_TRACK_CHAIRS,
  WEBSITE_TEAM,
  type CommitteePerson,
} from '@/data/committee';

function PortraitGroup({ title, people, heading: Heading = 'h2' }: {
  title: string;
  people: readonly CommitteePerson[];
  heading?: 'h2' | 'h3';
}) {
  const headingId = useId();

  return (
    <section className="committee-portraits" aria-labelledby={headingId}>
      <Heading id={headingId} className="committee-portraits__title">{title}</Heading>
      <ul className="committee-portraits__list" role="list">
        {people.map(({ name, affiliation, photo, photoFraming }) => (
          <li key={name} className="committee-portraits__person">
            {photo ? (
              <img
                className={photoFraming ? `committee-portraits__photo committee-portraits__photo--${photoFraming}` : 'committee-portraits__photo'}
                src={`${import.meta.env.BASE_URL}images/organization/${photo}`}
                width={460}
                height={460}
                loading="lazy"
                decoding="async"
                alt=""
              />
            ) : (
              <div className="committee-portraits__photo committee-portraits__placeholder" aria-hidden="true">
                <PersonIcon />
              </div>
            )}
            <p>{name}</p>
            <p className="committee-portraits__affiliation">{affiliation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Committee() {
  const { t } = useTranslation();
  const trackChairsHeadingId = useId();

  return (
    <Reveal id="comite" className="committee-section">
      <div className="container-xl">
        <div className="committee-portraits__groups">
          <PortraitGroup title={t('committee.generalOrganization')} people={GENERAL_ORGANIZATION} />
          <PortraitGroup title={t('committee.website')} people={WEBSITE_TEAM} />
          <section className="committee-portraits" aria-labelledby={trackChairsHeadingId}>
            <h2 id={trackChairsHeadingId} className="committee-portraits__title">
              {t('committee.sbesTrackChairs')}
            </h2>
            <div className="committee-portraits__tracks">
              {Object.entries(SBES_TRACK_CHAIRS).map(([id, chairs]) => (
                <PortraitGroup
                  key={id}
                  heading="h3"
                  title={t(`headerMenu.sbes.tracks.${id}.title`)}
                  people={chairs}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Reveal>
  );
}
