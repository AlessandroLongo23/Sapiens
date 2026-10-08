import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { LinkButton } from '@/components/ui/Button';
import { TapedPhoto } from '@/components/lab/menu/TapedPhoto';
import { HeroSketch } from '@/components/landing/HeroSketch';
import { LandingFaq, LandingPlans, TRIAL_NOTE } from '../common';
import { Reveal } from '../Reveal';
import { PenRing, PenTick, SectionTitle, after } from '../ink';
import type { LandingData } from '../data';
import { ExerciseSheet, LessonSheet, MistakeSheet, ReviewSheet } from './sheets';

/*
 * Version one of the landing page, "Quaderno": the home page of today grown into a
 * story. The sketch of the hero stays, and as the visitor scrolls the other sheets of a
 * study session land on it one by one: the lesson, the exercise, the mistake put right,
 * the review before the test. Then the index of the subjects, as in a notebook, and
 * what is outside the notebook as photos taped to the page.
 */

const STEPS: { title: string; text: string; points: string[]; link: [string, string]; sheet: ReactNode }[] = [
	{
		title: 'Leggi una lezione corta',
		text: 'Una lezione per idea, nell’ordine in cui gli argomenti arrivano in classe. La regola, un esempio svolto e gli errori che costano mezzo voto, messi accanto alla regola.',
		points: ['Formulario di ogni lezione, gratis', 'Figure da muovere con le dita'],
		link: ['/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado', 'Guarda questa lezione'],
		sheet: <LessonSheet />
	},
	{
		title: 'Esercitati un livello alla volta',
		text: 'Ogni livello aggiunge una sola difficoltà. Otto domande a ripetizione, sempre diverse; a ogni giro crescono le risposte da scrivere al posto di quelle da scegliere.',
		points: ['Correzione immediata', 'I progressi restano salvati'],
		link: ['/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado/esercizi', 'Guarda il percorso dei livelli'],
		sheet: <ExerciseSheet />
	},
	{
		title: 'Sbaglia, e guarda dove',
		text: 'Dopo un errore non c’è un voto: ci sono i passaggi, uno per riga, fino al punto in cui la strada si è divisa. La domanda finisce tra quelle da rifare.',
		points: ['Niente voti, solo cosa ti riesce', 'Gli errori tornano con numeri nuovi'],
		link: ['/pricing', 'Prova con un account'],
		sheet: <MistakeSheet />
	},
	{
		title: 'Arriva alla verifica con il ripasso fatto',
		text: 'Segni la verifica sul diario, in una riga. Sapiens mette insieme le flashcard della lezione e i livelli che non ti riuscivano, così sai cosa aprire la sera prima.',
		points: ['Un mazzo di flashcard per lezione', 'Il diario tiene compiti e verifiche'],
		link: ['/diario', 'Apri il diario'],
		sheet: <ReviewSheet />
	}
];

const row = (n: number) => ({ '--row': String(n) }) as CSSProperties;

const PHOTOS = [
	{ src: '/landing/tavola-periodica-carbonio.webp', href: '/strumenti/tavola-periodica', caption: 'la tavola periodica, con le schede', alt: 'La tavola periodica interattiva di Sapiens', tilt: -1.6, ratio: 'aspect-[9/5]', className: 'lg:col-span-7' },
	{ src: '/lab/copertine/aula-finestre.webp', href: '/laboratorio', caption: 'il laboratorio di chimica, in 3D', alt: 'L’aula di chimica del laboratorio 3D', tilt: 2.2, ratio: 'aspect-[8/5]', className: 'lg:col-span-5 lg:mt-14' },
	{ src: '/landing/orbitali.webp', href: '/strumenti/orbitali-atomici', caption: 'un orbitale 2p da ruotare', alt: 'Il visualizzatore degli orbitali atomici', tilt: 1.4, ratio: 'aspect-[4/3]', className: 'lg:col-span-4 lg:-mt-6' },
	{ src: '/landing/grafico.webp', href: '/strumenti/grafico-di-funzione', caption: 'il grafico di funzione', alt: 'Lo strumento per il grafico di una funzione', tilt: -2.4, ratio: 'aspect-[2/1]', className: 'lg:col-span-8 lg:mt-4' }
];

export function QuadernoLanding({ data }: { data: LandingData }) {
	return (
		<div className="lp lp-quaderno overflow-x-clip">
			{/* ---- the hero and the story ---- */}
			<section className="relative px-5 sm:px-6 lg:px-8">
				<div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[60rem] [mask-image:radial-gradient(ellipse_at_30%_30%,black_15%,transparent_70%)]" aria-hidden="true" />
				<div className="lp-story relative mx-auto max-w-7xl" style={{ '--steps': String(STEPS.length + 1) } as CSSProperties}>
					<div className="lp-story-text pt-10 max-lg:text-center" style={row(1)}>
						<p className="label-mono lp-in text-accent-fg">Per le superiori: matematica, fisica, chimica, informatica</p>
						<h1 className="lp-in mt-6 text-[2.7rem] font-semibold leading-[1] tracking-tight text-fg-strong sm:text-7xl xl:text-[5.2rem]" style={after(0.08)}>
							Si impara con la <span className="marker-hand whitespace-nowrap italic">penna in mano.</span>
						</h1>
						<p className="lp-in mt-7 max-w-xl text-lg leading-relaxed text-fg-muted max-lg:mx-auto" style={after(0.16)}>
							Sapiens è il quaderno che ti segue: lezioni corte, esercizi a livelli corretti all&apos;istante e progressi che restano dove li hai lasciati.
						</p>
						<div className="lp-in mt-8 flex flex-col gap-3 sm:flex-row max-lg:justify-center" style={after(0.24)}>
							<LinkButton href="/pricing" size="lg" className="px-7 py-4">
								<GraduationCap className="size-5" aria-hidden="true" />
								Prova gratis per {TRIAL_DAYS} giorni
							</LinkButton>
							<LinkButton href="/materiale/scuola-superiore" variant="secondary" size="lg" className="px-7 py-4">
								<BookOpen className="size-5" aria-hidden="true" />
								Sfoglia le lezioni
							</LinkButton>
						</div>
						<p className="lp-in mt-3 text-sm text-fg-subtle" style={after(0.3)}>
							{TRIAL_NOTE}
						</p>
						<p className="pencil lp-in mt-12 hidden items-center gap-2 text-2xl lg:flex" style={after(1.2)} aria-hidden="true">
							<svg viewBox="0 0 24 40" className="h-9 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M12 3c-3 10 4 16 0 32M5 27l7 9 7-9" />
							</svg>
							scorri: una sessione di studio, foglio dopo foglio
						</p>
					</div>
					<div className="lp-story-sheet" style={row(1)}>
						<HeroSketch className="lp-in w-full max-w-xl" />
					</div>
					{STEPS.map((step, i) => (
						<FragmentStep key={step.title} index={i} step={step} />
					))}
				</div>
			</section>

			{/* ---- the index ---- */}
			{data.subjects.length > 0 && (
				<section className="border-y border-edge bg-surface px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
					<div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
						<div>
							<SectionTitle eyebrow="Indice" title="Quattro materie, anno per anno" lead={`Oggi ci sono ${data.lessons} lezioni delle superiori, ognuna con teoria, formulario, flashcard ed esercizi. Gli anni che mancano arrivano un lotto alla volta.`} />
							<Reveal className="mt-8 text-sm text-fg-subtle">
								Sul sito trovi anche i primi capitoli per la{' '}
								<Link href="/materiale/scuola-media" className="font-medium text-fg underline underline-offset-4 hover:text-accent-fg">
									scuola media
								</Link>{' '}
								e per l&apos;
								<Link href="/materiale/universita" className="font-medium text-fg underline underline-offset-4 hover:text-accent-fg">
									università
								</Link>
								.
							</Reveal>
						</div>
						<ol className="border-t border-edge-strong">
							{data.subjects.map((s, i) => (
								<Reveal as="li" key={s.slug} delay={i * 0.07} data-subject={s.tone} className="border-b border-edge">
									<Link href={s.href} className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1 py-6 pl-5 no-underline focus-ring sm:py-7">
										<span className="absolute inset-y-3 left-0 w-1.5 rounded-full bg-tint-cover transition-[width] duration-300 ease-out-soft group-hover:w-2.5" aria-hidden="true" />
										<span className="font-mono text-sm text-fg-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
										<span className="flex items-baseline gap-4">
											<span className="nav-mark font-display text-3xl font-semibold tracking-tight text-fg-strong sm:text-4xl">{s.title}</span>
											<span className="mb-1.5 hidden flex-1 border-b-2 border-dotted border-edge-strong sm:block" aria-hidden="true" />
										</span>
										<span className="label-mono flex items-center gap-3 text-fg-subtle">
											{s.lessons} lezioni
											<ArrowRight className="size-4 text-tint-fg transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
										</span>
										<span className="col-start-2 col-end-4 text-sm leading-relaxed text-fg-subtle">{s.firstChapters.join(' · ')}…</span>
									</Link>
								</Reveal>
							))}
						</ol>
					</div>
				</section>
			)}

			{/* ---- outside the notebook ---- */}
			<section className="relative px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle eyebrow="Fuori dal quaderno" title="Quello che sulla carta non ci sta" lead={`${data.tools} strumenti gratuiti, dalla tavola periodica al grafico di funzione, e un laboratorio di chimica in cui si entra dal browser.`} />
					<div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-12">
						{PHOTOS.map((p, i) => (
							<Reveal key={p.src} delay={(i % 2) * 0.1} className={p.className}>
								<Link href={p.href} className="group block no-underline focus-ring-offset">
									<TapedPhoto src={p.src} alt={p.alt} caption={p.caption} tilt={p.tilt} ratio={p.ratio} sizes="(min-width: 1024px) 50vw, 92vw" position="object-top" className="group-hover:[--tilt:0deg] group-hover:shadow-[0_24px_48px_-20px_rgba(30,30,60,0.45)]" />
								</Link>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ---- plans ---- */}
			<section className="border-t border-edge bg-surface px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered eyebrow="Prezzi" title="Leggere è gratis" lead={`Teoria e formulari restano aperti a tutti. Chi crea un account ha Studio per ${TRIAL_DAYS} giorni, senza carta, e poi sceglie.`} />
					<LandingPlans className="mt-14" />
				</div>
			</section>

			{/* ---- questions ---- */}
			<section className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered eyebrow="Domande" title="Prima di cominciare" />
					<LandingFaq className="mt-12" />
				</div>
			</section>

			{/* ---- the last call ---- */}
			<section className="relative overflow-hidden border-t border-edge px-5 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
				<div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_60%,black_10%,transparent_65%)]" aria-hidden="true" />
				<Reveal className="relative mx-auto max-w-3xl">
					<p className="pencil text-3xl">pagina 1</p>
					<h2 className="mt-2 text-5xl font-semibold leading-[1.02] tracking-tight text-fg-strong sm:text-7xl">Apri il quaderno.</h2>
					<p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">La prima lezione è già scritta. Gli esercizi li fai tu.</p>
					<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<LinkButton href="/pricing" size="lg" className="px-8 py-4">
							Prova gratis per {TRIAL_DAYS} giorni
							<ArrowRight className="size-5" aria-hidden="true" />
						</LinkButton>
					</div>
					<p className="mt-3 text-sm text-fg-subtle">{TRIAL_NOTE}</p>
				</Reveal>
			</section>
		</div>
	);
}

/** One step of the story: its words in the left column, its sheet on the pile. */
function FragmentStep({ index, step }: { index: number; step: (typeof STEPS)[number] }) {
	return (
		<>
			<Reveal className="lp-story-text" threshold={0.5} style={row(index + 2)}>
				<PenRing>{index + 1}</PenRing>
				<h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.05] tracking-tight text-fg-strong sm:text-5xl">{step.title}</h2>
				<p className="mt-5 max-w-lg text-lg leading-relaxed text-fg-muted">{step.text}</p>
				<ul className="mt-6 flex flex-col gap-2.5">
					{step.points.map((point, k) => (
						<li key={point} className="flex items-center gap-3 text-base font-medium text-fg">
							<PenTick delay={0.3 + k * 0.2} className="h-4 w-5 shrink-0" />
							{point}
						</li>
					))}
				</ul>
				<Link href={step.link[0]} className="group mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent-fg no-underline focus-ring">
					<span className="underline decoration-accent-edge decoration-2 underline-offset-4 group-hover:decoration-accent">{step.link[1]}</span>
					<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
				</Link>
			</Reveal>
			<Reveal bare threshold={0.55} className="lp-story-sheet" style={row(index + 2)}>
				{step.sheet}
			</Reveal>
		</>
	);
}
