import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import '@/components/landing/prova/landing.css';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { landingData } from '@/components/landing/prova/data';
import { OggettiLanding } from '@/components/landing/prova/oggetti/OggettiLanding';

// The counts are refreshed when a publish calls /api/revalidate; the daily timer only heals a render that found the database down.
export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({ path: '/' });

/**
 * The landing page: for now the "Oggetti" version of the candidates at /prova-home, where
 * the others stay to be compared (vault/Sessioni/2026-10-07 Tre versioni della landing.md).
 */
export default async function HomePage() {
	return <OggettiLanding data={await landingData()} />;
}
