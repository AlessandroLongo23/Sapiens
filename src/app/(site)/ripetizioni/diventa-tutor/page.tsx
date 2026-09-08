import type { Metadata } from 'next';
import { Ban, Check, GraduationCap, Handshake, Inbox, UserPen } from 'lucide-react';
import { SITE_NAME, TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { Breadcrumb, HOME_CRUMB, TUTORING_CRUMB } from '@/components/content/Breadcrumb';
import { Page } from '@/components/content/PageHeader';
import { Card } from '@/components/ui/Card';
import { BecomeTutorButton } from '@/components/tutoring/BecomeTutorButton';
import { HowItWorks } from '@/components/tutoring/HowItWorks';

const PATH = `${TUTORING_ROOT}/diventa-tutor`;

export const metadata: Metadata = pageMetadata({
	title: `Dai ripetizioni con ${SITE_NAME}: profilo gratuito, zero commissioni`,
	description: 'Dai ripetizioni di matematica, fisica, chimica o informatica con Sapiens: profilo gratuito, nessuna commissione sulle lezioni, contatti degli studenti solo quando accetti una richiesta.',
	path: PATH
});

const STEPS = [
	{ icon: UserPen, title: 'Crea il profilo', text: 'Nome, presentazione, materie, livelli, città o online, prezzo indicativo. Lo controlliamo e lo pubblichiamo.' },
	{ icon: Inbox, title: 'Ricevi le richieste', text: 'Gli studenti ti scrivono cosa serve. Vedi il messaggio, non i contatti, e hai 48 ore per rispondere.' },
	{ icon: Handshake, title: 'Accetta e organizzati', text: 'Se accetti, ricevete i contatti a vicenda e concordate orari e prezzo tra voi. Sapiens non entra nelle lezioni.' }
];
const YES = ['Profilo gratuito, senza abbonamento obbligatorio', 'Nessuna commissione sulle lezioni, mai', 'Un contatto va a un solo tutor: nessuna gara al ribasso', 'Telefono ed email restano privati finché non accetti'];
const NO = ['Non gestiamo i pagamenti delle lezioni', 'Non vincoliamo te o lo studente a restare sulla piattaforma', 'Non vendiamo lo stesso contatto a cinque tutor'];

export default function BecomeTutorPage() {
	return (
		<Page width="medium">
			<Breadcrumb items={[HOME_CRUMB, TUTORING_CRUMB, { label: 'Diventa tutor', path: PATH }]} />
			<header className="mb-12 grid items-start gap-8 lg:grid-cols-[1fr_auto]">
				<div className="space-y-4">
					<h1 className="text-4xl font-bold tracking-tight text-fg-strong sm:text-5xl">Dai ripetizioni con Sapiens</h1>
					<p className="max-w-2xl text-lg leading-relaxed text-fg-muted">Per studenti universitari e laureati in materie scientifiche. Apri un profilo, ricevi richieste da chi studia sulle nostre lezioni e organizza le lezioni direttamente con loro.</p>
					<p className="max-w-2xl text-sm text-fg-muted">Quando accetti una richiesta ricevi i contatti dello studente. In futuro questo contatto avrà un piccolo costo fisso, di pochi euro; nella fase di lancio è gratuito. Sulle lezioni non applichiamo mai commissioni.</p>
					<BecomeTutorButton withIcon />
				</div>
				<div className="hidden size-40 items-center justify-center rounded-2xl border border-edge bg-surface text-accent-fg shadow-sm lg:flex">
					<GraduationCap className="size-20" aria-hidden="true" />
				</div>
			</header>
			<section className="mb-12" aria-labelledby="come-funziona">
				<h2 id="come-funziona" className="mb-6 text-2xl font-semibold text-fg">Come funziona</h2>
				<HowItWorks steps={STEPS} />
			</section>
			<section className="mb-12 grid gap-5 md:grid-cols-2" aria-label="Cosa facciamo e cosa no">
				<Card className="border-emerald-200 p-6 dark:border-emerald-900/50">
					<h2 className="mb-3 text-lg font-semibold text-fg">Cosa trovi</h2>
					<ul className="space-y-2">
						{YES.map((item) => (
							<li key={item} className="flex items-start gap-2 text-sm text-fg-muted"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />{item}</li>
						))}
					</ul>
				</Card>
				<Card className="p-6">
					<h2 className="mb-3 text-lg font-semibold text-fg">Cosa non facciamo</h2>
					<ul className="space-y-2">
						{NO.map((item) => (
							<li key={item} className="flex items-start gap-2 text-sm text-fg-muted"><Ban className="mt-0.5 size-4 shrink-0 text-fg-faint" aria-hidden="true" />{item}</li>
						))}
					</ul>
				</Card>
			</section>
			<Card as="section" className="mb-12 space-y-3 p-6 sm:p-8" aria-labelledby="fisco">
				<h2 id="fisco" className="text-lg font-semibold text-fg">Tasse e contributi</h2>
				<p className="text-sm leading-relaxed text-fg-muted">Le lezioni le fatturi o le ricevi per conto tuo: come prestazione occasionale (ricevuta con marca da bollo sopra 77,47 euro, contributi INPS oltre 5.000 euro l&apos;anno) o con partita IVA se l&apos;attività è abituale. I docenti di ruolo possono usare l&apos;imposta sostitutiva del 15% sulle lezioni private. Sapiens non trattiene ritenute e non gestisce i pagamenti: sono informazioni orientative, per i casi particolari chiedi a un commercialista.</p>
			</Card>
			<div className="text-center">
				<BecomeTutorButton />
			</div>
		</Page>
	);
}
