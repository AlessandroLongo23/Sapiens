import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import '@/components/landing/prova/landing.css';
import { VERSIONS, VersionSwitch, type VersionSlug } from '@/components/landing/prova/common';
import { landingData } from '@/components/landing/prova/data';
import { QuadernoLanding } from '@/components/landing/prova/quaderno/QuadernoLanding';
import { OggettiLanding } from '@/components/landing/prova/oggetti/OggettiLanding';
import { ProvaLanding } from '@/components/landing/prova/prova/ProvaLanding';
import { MaterieLanding } from '@/components/landing/prova/materie/MaterieLanding';

/**
 * The three candidates for the new landing page, side by side, until one is chosen and
 * moves to `/`. Out of the index and of the sitemap, with no link from the site.
 */

type Params = { params: Promise<{ versione: string }> };

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
	return VERSIONS.map((v) => ({ versione: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { versione } = await params;
	const version = VERSIONS.find((v) => v.slug === versione);
	return { title: `Landing, versione ${version?.name ?? ''}`, robots: { index: false, follow: false } };
}

export default async function LandingTrial({ params }: Params) {
	const slug = (await params).versione as VersionSlug;
	if (!VERSIONS.some((v) => v.slug === slug)) notFound();
	const data = await landingData();
	return (
		<>
			{slug === 'quaderno' && <QuadernoLanding data={data} />}
			{slug === 'oggetti' && <OggettiLanding data={data} />}
			{slug === 'prova' && <ProvaLanding data={data} />}
			{slug === 'materie' && <MaterieLanding data={data} />}
			<VersionSwitch current={slug} />
		</>
	);
}
