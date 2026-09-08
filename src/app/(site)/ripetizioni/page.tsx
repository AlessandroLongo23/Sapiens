import type { Metadata } from 'next';
import { ArrowRight, BadgeCheck, BookOpen, Handshake, MapPin, MousePointerClick, Send, UsersRound } from 'lucide-react';
import { SITE_NAME, TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { getPublishedTutors } from '@/lib/server/tutoring';
import { citiesOf } from '@/lib/tutoring/filter';
import { HOME_CRUMB, TUTORING_CRUMB } from '@/components/content/Breadcrumb';
import { HowItWorks } from '@/components/tutoring/HowItWorks';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { Stat } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { TutorList } from '@/components/tutoring/TutorList';

/** The list is public and cached as static HTML, refreshed in the background; filtering happens in the browser from the URL. */
export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
	title: `Ripetizioni private: tutor online e in presenza | ${SITE_NAME}`,
	description: 'Trova un tutor per matematica, fisica, chimica e informatica, online o in presenza, per medie, superiori e università. Scegli il profilo, invia la richiesta e organizzate le lezioni tra voi: nessuna commissione sulle lezioni.',
	path: TUTORING_ROOT
});

const STEPS = [
	{ icon: MousePointerClick, title: 'Scegli il tutor', text: 'Filtra per materia, livello e città e leggi i profili. I cognomi e i contatti restano privati.' },
	{ icon: Send, title: 'Invia la richiesta', text: 'Racconta di cosa hai bisogno. Il tutor riceve il messaggio, non i tuoi contatti, e ha 48 ore per rispondere.' },
	{ icon: Handshake, title: 'Vi mettiamo in contatto', text: 'Se accetta, ricevete i contatti a vicenda e concordate orari e prezzo direttamente. Sapiens non trattiene nulla sulle lezioni.' }
];

export default async function TutoringPage() {
	const tutors = await getPublishedTutors();
	const subjects = new Set(tutors.flatMap((t) => t.subjects)).size;
	const verified = tutors.filter((t) => t.verified).length;
	const cities = citiesOf(tutors).length;

	return (
		<Page>
			<PageHeader
				crumbs={[HOME_CRUMB, TUTORING_CRUMB]}
				icon={UsersRound}
				title="Ripetizioni"
				lead="Tutor di matematica, fisica, chimica e informatica per medie, superiori e università. Scegli il profilo, chiedi aiuto e, se il tutor accetta, organizzate le lezioni tra voi."
				stats={
					<>
						<Stat icon={UsersRound}>{tutors.length} tutor</Stat>
						<Stat icon={BookOpen} color="text-teal-500">{subjects} {subjects === 1 ? 'materia' : 'materie'}</Stat>
						<Stat icon={MapPin} color="text-indigo-500">{cities} città</Stat>
						{verified > 0 && <Stat icon={BadgeCheck} color="text-sky-500">{verified} {verified === 1 ? 'verificato' : 'verificati'}</Stat>}
					</>
				}
			/>
			<TutorList tutors={tutors} />
			<section className="mt-14 sm:mt-20" aria-labelledby="come-funziona">
				<h2 id="come-funziona" className="mb-6 text-2xl font-semibold text-fg">Come funziona</h2>
				<HowItWorks steps={STEPS} />
				<p className="mt-5 max-w-3xl text-sm text-fg-subtle">
					Come ordiniamo i tutor: con l&apos;ordine &quot;Consigliati&quot; mostriamo prima i profili con identità verificata, poi i più recenti. Nessun tutor paga per salire in classifica. Gli altri ordinamenti seguono il prezzo indicativo o la data di iscrizione.
				</p>
			</section>
			<section className="mt-10 flex flex-col gap-4 rounded-2xl border border-edge bg-surface p-6 sm:flex-row sm:items-center sm:p-8" aria-labelledby="sei-un-tutor">
				<div className="flex-1 space-y-1">
					<h2 id="sei-un-tutor" className="text-xl font-semibold text-fg">Dai ripetizioni?</h2>
					<p className="text-sm text-fg-muted">Studenti universitari e laureati in materie scientifiche possono aprire un profilo gratuito. Nessuna commissione sulle lezioni: i contatti degli studenti arrivano solo quando accetti una richiesta.</p>
				</div>
				<LinkButton href={`${TUTORING_ROOT}/diventa-tutor`} variant="secondary" size="lg">
					Scopri come funziona
					<ArrowRight className="size-4" aria-hidden="true" />
				</LinkButton>
			</section>
		</Page>
	);
}
