import '@/styles/page-content.css';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Committee } from '@/components/sections/Committee';
import { PartnerRows } from '@/components/sections/Sponsorship';
import { BrandBar } from '@/components/ui/BrandBar';

export function OrganizationPage() {
  const { t } = useTranslation();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#comite') {
      document.getElementById('comite')?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <main className="about-page" id="organizacao" aria-labelledby="organizacao-titulo">
      <div className="organization-people">
        <header className="about-top container-xl">
          <h1 id="organizacao-titulo" className="about-title">
            <BrandBar />
            {t('organizationPage.title')}
          </h1>
        </header>
        <Committee />
      </div>

      <div className="container-xl">
        <PartnerRows />
      </div>
    </main>
  );
}
