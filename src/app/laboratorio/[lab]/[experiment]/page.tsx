import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/lib/config/site';
import { findExperiment, parseSession } from '@/lib/lab/catalog';
import { LabSession } from '@/components/lab/menu/LabSession';

/**
 * A lab session, full screen: the experiment chosen in the menu (/laboratorio), with its settings in the query
 * (modo, stanza, qualita, and for a class postazioni, gruppi, avatar, banchi, segnali).
 */
type Props = { params: Promise<{ lab: string; experiment: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { lab, experiment } = await params;
	const found = findExperiment(lab, experiment);
	return { title: `${found?.experiment.title ?? 'Laboratorio'} | ${SITE_NAME}`, robots: { index: false, follow: false } };
}

export default async function LabSessionPage({ params, searchParams }: Props) {
	const { lab, experiment } = await params;
	const found = findExperiment(lab, experiment);
	if (!found || found.experiment.status !== 'ready') notFound();
	return (
		<main id="contenuto">
			<LabSession session={parseSession(await searchParams)} title={found.experiment.title} lab={found.lab.title} experiment={found.experiment} />
		</main>
	);
}
