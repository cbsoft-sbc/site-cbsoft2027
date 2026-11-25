import './Committee.css';

import { useId, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal } from '@/components/ui/Reveal';
import { useLang } from '@/hooks/useLang';
import { pick } from '@/lib/localized';
import {
  GENERAL_CHAIRS,
  LOCAL_COMMITTEE_ROLES,
  PC_CHAIR_SYMPOSIA,
  WEBSITE_TEAM,
  type CommitteePerson,
} from '@/data/committee';

function PortraitGroup({ title, people }: { title: string; people: readonly CommitteePerson[] }) {
  const headingId = useId();

  return (
    <section className="committee-portraits" aria-labelledby={headingId}>
      <h2 id={headingId} className="committee-portraits__title">{title}</h2>
      <ul className="committee-portraits__list" role="list">
        {people.map(({ name, affiliation, photo }) => (
          <li key={photo} className="committee-portraits__person">
            <img
              className="committee-portraits__photo"
              src={`${import.meta.env.BASE_URL}images/organization/${photo}`}
              width={460}
              height={460}
              loading="lazy"
              decoding="async"
              alt=""
            />
            <p>{name}</p>
            <p className="committee-portraits__affiliation">{affiliation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2
        className="font-mono text-xs uppercase tracking-[.12em] pb-3 mb-4 border-b"
        style={{ borderColor: 'var(--line)', color: 'var(--purple)' }}
      >
        {title}
      </h2>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}

export function Committee() {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <Reveal id="comite" className="committee-section">
      <div className="container-xl">
        <div className="committee-portraits__groups">
          <PortraitGroup title={t('committee.generalChairs')} people={GENERAL_CHAIRS} />
          <PortraitGroup title={t('committee.website')} people={WEBSITE_TEAM} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-14">
          <Group title={t('committee.pcChairs')}>
            {PC_CHAIR_SYMPOSIA.map((acronym) => (
              <li key={acronym}>
                <span className="font-medium">{acronym}</span>{' '}
                — <span style={{ color: 'var(--slate)' }}>{t('committee.chairTbc')}</span>
              </li>
            ))}
          </Group>

          <Group title={t('committee.localCommittee')}>
            {LOCAL_COMMITTEE_ROLES.map((role) => (
              <li key={role.en}>
                <span className="font-medium">{pick(role, lang)}</span>{' '}
                — <span style={{ color: 'var(--slate)' }}>{t('committee.tbc')}</span>
              </li>
            ))}
          </Group>
        </div>
      </div>
    </Reveal>
  );
}
