import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { PageMetadata } from '@/components/layout/PageMetadata';
import { SYMPOSIA } from '@/data/symposia';
import { SBES_TRACKS } from '@/data/sbesTracks';
import { CAMPUS_MAP_PATH } from '@/data/venue';
import { sbesTrackCallPath, symposiumCallPath } from '@/data/callPaths';
import { PAPERS_SYMPOSIA, symposiumPapersPath } from '@/data/acceptedPapers';

/* Every page but the home loads on demand, so the first visit only
 * downloads the home's JavaScript. */
const LocationPage = lazy(() => import('@/pages/LocationPage').then((m) => ({ default: m.LocationPage })));
const CampusMapPage = lazy(() => import('@/pages/CampusMapPage').then((m) => ({ default: m.CampusMapPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const WorkshopsCallPage = lazy(() => import('@/pages/WorkshopsCallPage').then((m) => ({ default: m.WorkshopsCallPage })));
const RegistrationPage = lazy(() => import('@/pages/RegistrationPage').then((m) => ({ default: m.RegistrationPage })));
const ConductPage = lazy(() => import('@/pages/ConductPage').then((m) => ({ default: m.ConductPage })));
const AccommodationPage = lazy(() => import('@/pages/AccommodationPage').then((m) => ({ default: m.AccommodationPage })));
const ExperiencesPage = lazy(() => import('@/pages/ExperiencesPage').then((m) => ({ default: m.ExperiencesPage })));
const ProgramPage = lazy(() => import('@/pages/ProgramPage').then((m) => ({ default: m.ProgramPage })));
const OrganizationPage = lazy(() => import('@/pages/OrganizationPage').then((m) => ({ default: m.OrganizationPage })));
const VolunteersPage = lazy(() => import('@/pages/VolunteersPage').then((m) => ({ default: m.VolunteersPage })));
const AcceptedPapersPage = lazy(() => import('@/pages/AcceptedPapersPage').then((m) => ({ default: m.AcceptedPapersPage })));
const PreviousEditionsPage = lazy(() => import('@/pages/PreviousEditionsPage').then((m) => ({ default: m.PreviousEditionsPage })));
const SymposiumCallPage = lazy(() => import('@/pages/SymposiumCallPage').then((m) => ({ default: m.SymposiumCallPage })));

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PageMetadata />
      <Header />
      {/* Keeps the footer below the fold while a page's code loads. */}
      <Suspense fallback={<main className="route-loading" aria-busy="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/local" element={<LocationPage />} />
          <Route path={CAMPUS_MAP_PATH} element={<CampusMapPage />} />
          <Route path="/acomodacoes" element={<AccommodationPage />} />
          <Route path="/experiencias" element={<ExperiencesPage />} />
          <Route path="/programacao" element={<ProgramPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/edicoes-anteriores" element={<PreviousEditionsPage />} />
          <Route path="/inscricoes" element={<RegistrationPage />} />
          <Route path="/codigo-de-conduta" element={<ConductPage />} />
          <Route path="/organizacao" element={<OrganizationPage />} />
          <Route path="/voluntarios" element={<VolunteersPage />} />
          <Route path="/artigos-aceitos" element={<AcceptedPapersPage />} />
          <Route path="/sbes/:track/artigos-aceitos" element={<AcceptedPapersPage />} />
          {PAPERS_SYMPOSIA.map((id) => (
            <Route key={id} path={symposiumPapersPath(id)} element={<AcceptedPapersPage symposium={id} />} />
          ))}
          <Route path="/workshops/chamada" element={<WorkshopsCallPage />} />
          {SYMPOSIA.map(({ id }) => (
            <Route key={id} path={symposiumCallPath(id)} element={<SymposiumCallPage id={id} />} />
          ))}
          {SBES_TRACKS.map(({ id }) => (
            <Route key={id} path={sbesTrackCallPath(id)} element={<SymposiumCallPage id="sbes" track={id} />} />
          ))}
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}
