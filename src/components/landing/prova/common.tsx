import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS, TRIAL_DAYS, formatPrice } from '@/lib/stripe/config';
import { FREE_NOTEBOOKS, FREE_NOTES } from '@/lib/zaino/config';
import { cn } from '@/lib/utils/cn';
import { LinkButton } from '@/components/ui/Button';
import { FaqRow } from './FaqRow';
import { Reveal } from './Reveal';

/* What the three trial landing pages have in common: the two plans, the questions, the switch between versions. */

export const VERSIONS = [
	{ slug: 'quaderno', name: 'Quaderno', line: 'Una pagina di quaderno che si scrive mentre scorri.' },
	{ slug: 'oggetti', name: 'Oggetti', line: 'Gli oggetti in tre dimensioni delle materie, in scena.' },
	{ slug: 'prova', name: 'Prova', line: 'La pagina è il prodotto: si risponde prima di leggere.' },
	{ slug: 'materie', name: 'Materie', line: 'Una materia per schermo: lo scroll muove il suo oggetto, scrive una lezione e apre uno strumento.' }
] as const;
export type VersionSlug = (typeof VERSIONS)[number]['slug'];

/** A small bar at the foot of the screen to pass from one version to the next. Only on the trial pages. */
export function VersionSwitch({ current }: { current: VersionSlug }) {
	return (
		<nav aria-label="Versioni della landing" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 max-md:bottom-[calc(var(--tabbar-h)+var(--safe-b)+0.5rem)]">
			<div className="pointer-events-auto flex items-center gap-1 rounded-full border border-edge-strong bg-surface/90 p-1 shadow-lift backdrop-blur">
				<Link href="/prova-home" className="label-mono rounded-full px-3 py-2 text-fg-subtle no-underline hover:text-fg focus-ring">
					Versioni
				</Link>
				{VERSIONS.map((v, i) => (
					<Link
						key={v.slug}
						href={`/prova-home/${v.slug}`}
						aria-current={v.slug === current ? 'page' : undefined}
						className={cn('rounded-full px-3.5 py-2 text-sm font-semibold no-underline transition-colors focus-ring', v.slug === current ? 'bg-inverse text-inverse-fg' : 'text-fg-muted hover:bg-surface-3 hover:text-fg')}
					>
						<span className="font-mono text-xs opacity-60">{i + 1}</span> {v.name}
					</Link>
				))}
			</div>
		</nav>
	);
}

const FREE = [`Teoria e formulari di tutte le lezioni`, 'Una sessione di esercizi al giorno, con i progressi salvati', `${FREE_NOTEBOOKS} quaderno e ${FREE_NOTES} note nello Zaino`, 'Strumenti e calcolatori'];
const STUDIO = ['Esercizi senza limiti, con i ripassi', 'Flashcard di ogni lezione', 'Zaino senza limiti', 'Sapiens AI sulle lezioni'];

/** The two plans of the beta, as on /pricing, in the room of one section. */
export function LandingPlans({ className }: { className?: string }) {
	return (
		<div className={cn('mx-auto grid w-full max-w-4xl gap-5 sm:gap-6 md:grid-cols-2', className)}>
			<Reveal className="flex flex-col rounded-3xl border border-edge bg-surface p-6 shadow-paper sm:p-7">
				<p className="label-mono text-fg-subtle">Free</p>
				<p className="mt-2 font-display text-[2.5rem] font-semibold leading-none tracking-tight text-fg-strong sm:mt-3 sm:text-5xl">Gratis</p>
				<p className="mt-3 text-sm leading-relaxed text-fg-muted">Per leggere e cominciare ad allenarsi. Resta gratis.</p>
				<ul className="mt-5 flex flex-1 flex-col gap-3 sm:mt-6">
					{FREE.map((line) => (
						<li key={line} className="flex gap-3 text-sm leading-snug text-fg">
							<Check className="mt-0.5 size-4 shrink-0 text-fg-subtle" strokeWidth={2.5} aria-hidden="true" />
							{line}
						</li>
					))}
				</ul>
				<LinkButton href="/pricing" variant="secondary" size="lg" className="mt-6 w-full sm:mt-7">
					Crea un account
				</LinkButton>
			</Reveal>
			<Reveal delay={0.08} className="relative flex flex-col rounded-3xl border-2 border-accent bg-surface p-6 shadow-lift sm:p-7">
				<span className="label-mono absolute -top-3 right-6 flex rotate-[-2deg] items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-white shadow-key">
					<Sparkles className="size-3.5" aria-hidden="true" />
					{TRIAL_DAYS} giorni gratis
				</span>
				<p className="label-mono text-accent-fg">Studio</p>
				<p className="mt-2 flex items-baseline gap-2 font-display text-[2.5rem] font-semibold leading-none tracking-tight text-fg-strong sm:mt-3 sm:text-5xl">
					{formatPrice(SUBSCRIPTION_PLANS.STUDIO.price)}
					<span className="font-sans text-base font-normal tracking-normal text-fg-muted">/mese</span>
				</p>
				<p className="mt-3 text-sm leading-relaxed text-fg-muted">Per chi si allena con regolarità. Tutto quello che c&apos;è in Free, e in più:</p>
				<ul className="mt-5 flex flex-1 flex-col gap-3 sm:mt-6">
					{STUDIO.map((line) => (
						<li key={line} className="flex gap-3 text-sm leading-snug text-fg">
							<Check className="mt-0.5 size-4 shrink-0 text-accent-fg" strokeWidth={2.5} aria-hidden="true" />
							{line}
						</li>
					))}
				</ul>
				<LinkButton href="/pricing" size="lg" className="mt-6 w-full sm:mt-7">
					Prova gratis per {TRIAL_DAYS} giorni
					<ArrowRight className="size-5" aria-hidden="true" />
				</LinkButton>
			</Reveal>
		</div>
	);
}

export const TRIAL_NOTE = `Senza carta di credito. Dopo ${TRIAL_DAYS} giorni resti nel piano Free, con i tuoi progressi.`;

const QUESTIONS: [string, string][] = [
	['Quanto costa?', `Teoria e formulari sono gratis e lo restano. Con un account gratuito hai anche una sessione di esercizi al giorno, con i progressi salvati. Studio costa ${formatPrice(SUBSCRIPTION_PLANS.STUDIO.price)} al mese e toglie i limiti a esercizi e Zaino, con le flashcard e Sapiens AI.`],
	[`Cosa succede dopo i ${TRIAL_DAYS} giorni di prova?`, 'Niente da disdire, perché non chiediamo la carta. L’account passa al piano Free e i progressi fatti restano dove sono.'],
	['Per quali classi è?', 'Per le superiori: matematica, fisica, chimica e informatica, nell’ordine in cui i capitoli si incontrano in classe. Gli anni che mancano arrivano un lotto alla volta; sul sito trovi anche i primi capitoli per le medie e per l’università.'],
	['Come funzionano gli esercizi?', 'Ogni lezione ha un percorso di livelli, e ogni livello aggiunge una sola difficoltà. Un livello si supera con alcune ripetizioni da 8 domande, sempre diverse; a ogni ripetizione crescono le risposte da scrivere al posto di quelle da scegliere. Quando sbagli vedi subito i passaggi.'],
	['Serve installare qualcosa?', 'No. Sapiens si apre nel browser, dal telefono e dal computer, e si può aggiungere alla schermata Home come un’app.']
];

/** The questions a visitor asks before signing up, as rows that open. */
export function LandingFaq({ className }: { className?: string }) {
	return (
		<div className={cn('mx-auto w-full max-w-3xl divide-y divide-edge border-y border-edge', className)}>
			{QUESTIONS.map(([question, answer], i) => (
				<FaqRow key={question} index={i} question={question} answer={answer} />
			))}
		</div>
	);
}
