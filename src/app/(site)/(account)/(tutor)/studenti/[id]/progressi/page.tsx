import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { studentFolder } from '@/lib/server/tutor-folder';
import { Empty, SectionTitle } from '@/components/tutoring/agenda/Paper';
import { NotShared, ProgressFigures, ProgressLessons, WeekTicks } from '@/components/tutoring/agenda/ProgressPanel';

export const metadata: Metadata = pageMetadata({ title: 'Progressi | Area tutor | Sapiens', path: '/studenti' });

/** What a student who shares their exercises lets the tutor read: how much, how often, how far on each lesson. */
export default async function StudentProgressPage({ params }: { params: Promise<{ id: string }> }) {
	const folder = await studentFolder(params);
	if (!folder) return null;
	const { link, progress } = folder.sheet;
	if (!progress) {
		return (
			<section aria-labelledby="progressi">
				<SectionTitle id="progressi" title="Progressi" />
				{link.status === 'ended' ? <Empty>Con le lezioni interrotte i progressi non sono più condivisi.</Empty> : <NotShared name={link.name} joined={link.joined} />}
			</section>
		);
	}
	return (
		<div className="space-y-10">
			<section aria-labelledby="progressi" className="space-y-7">
				<SectionTitle id="progressi" title="Progressi" />
				<ProgressFigures progress={progress} />
				<div>
					<p className="label-mono mb-3 text-fg-subtle">Ultimi sette giorni</p>
					<WeekTicks week={progress.week} />
				</div>
				{progress.openMistakes > 0 && <p className="text-sm text-fg-muted">{progress.openMistakes === 1 ? 'Ha un livello con un errore' : `Ha ${progress.openMistakes} livelli con errori`} ancora da rifare.</p>}
			</section>
			<section aria-labelledby="lezioni-lavorate">
				<SectionTitle id="lezioni-lavorate" title="Lezioni su cui ha lavorato" count={progress.lessons.length} />
				<ProgressLessons progress={progress} name={link.name} />
			</section>
		</div>
	);
}
