import Link from 'next/link';
import { ArrowRight, BookOpen, Check, GraduationCap } from 'lucide-react';
import elementi from '@/lib/tools/elementi.json';
import { familyName, type ChemElement } from '@/lib/tools/tavola-periodica';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { PenStroke } from '@/components/content/PageHeader';
import { SubjectObject } from '@/components/content/SubjectObject';
import { LinkButton } from '@/components/ui/Button';
import { LandingFaq, LandingPlans, TRIAL_NOTE } from '../common';
import { Reveal } from '../Reveal';
import { PenRing, SectionTitle } from '../ink';
import { SUBJECT_COPY, demoQuestions, tex, type LandingData } from '../data';
import { TrialSheet } from './Hero';
import { Bench, type BenchCard, type BenchElement } from './Bench';

/*
 * Version three of the landing page, "Prova": the page is the product. The hero is an
 * exercise the visitor answers before reading anything, with the lesson's path filling
 * under it; then a bench with three more things to try. It follows
 * vault/Decisioni/2026-09-23 Pratica con progressi come messaggio principale.md.
 */

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function benchElements(): BenchElement[] {
	return (elementi as ChemElement[]).map((e) => ({
		z: e.z,
		symbol: e.symbol,
		name: e.name,
		mass: e.mass,
		family: e.family,
		familyName: familyName(e.family),
		config: e.config.replace(/([spdf])(\d+)/g, (_m, shell: string, n: string) => shell + [...n].map((d) => SUP[Number(d)]).join('')),
		col: e.group ?? (e.series ?? 1) + 2,
		// the two series stand under the table, after a narrow gap
		row: e.group ? e.period : e.period + 3
	}));
}

function benchCards(): BenchCard[] {
	return [
		{ tone: 'math', subject: 'Matematica', front: 'Quando un’equazione di secondo grado ha due soluzioni reali e distinte?', back: `Quando il discriminante è positivo:<br>${tex('\\Delta = b^2 - 4ac > 0')}` },
		{ tone: 'math', subject: 'Matematica', front: 'Che cos’è un’equazione spuria?', back: `Un’equazione di secondo grado senza termine noto, ${tex('ax^2 + bx = 0')}.<br>Una soluzione è sempre ${tex('x = 0')}.` },
		{ tone: 'physics', subject: 'Fisica', front: 'Che cosa dice il secondo principio della dinamica?', back: `La forza risultante è massa per accelerazione:<br>${tex('\\vec{F} = m\\,\\vec{a}')}` },
		{ tone: 'chemistry', subject: 'Chimica', front: 'Quante particelle contiene una mole?', back: `Il numero di Avogadro:<br>${tex('N_A = 6{,}022 \\cdot 10^{23}')} particelle.` }
	];
}

const STEPS = [
	{ title: 'Leggi la lezione', text: 'Corta, una per idea, nell’ordine in cui gli argomenti arrivano in classe. Gli errori frequenti stanno accanto alla regola.' },
	{ title: 'Esercitati a livelli', text: 'Ogni livello aggiunge una sola difficoltà. Le domande cambiano a ogni ripetizione, e quando sbagli vedi i passaggi.' },
	{ title: 'Riparti da dove eri', text: 'I livelli superati restano tuoi. Quello che non ti riesce ancora torna nei ripassi, prima della verifica.' }
];

export function ProvaLanding({ data }: { data: LandingData }) {
	const questions = demoQuestions();
	const figures = [
		{ value: data.lessons, label: 'lezioni online per le superiori' },
		{ value: data.withFlashcards, label: 'mazzi di flashcard' },
		{ value: data.tools, label: 'strumenti e calcolatori gratuiti' }
	].filter((f) => f.value > 0);
	return (
		<div className="lp lp-prova overflow-x-clip">
			{/* ---- hero ---- */}
			<section className="relative px-5 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
				<div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_35%,black_10%,transparent_70%)]" aria-hidden="true" />
				<div className="relative mx-auto grid w-full max-w-7xl items-start gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">
					<div className="lg:sticky lg:top-24 lg:pt-10">
						<p className="label-mono lp-in text-accent-fg" style={{ '--lp-d': '0s' } as React.CSSProperties}>
							Matematica, fisica, chimica e informatica delle superiori
						</p>
						<h1 className="lp-in mt-6 text-[2.9rem] font-semibold leading-[0.98] tracking-tight text-fg-strong sm:text-7xl xl:text-[5.4rem]" style={{ '--lp-d': '0.08s' } as React.CSSProperties}>
							Esercitati finché{' '}
							<span className="relative inline-block whitespace-nowrap italic text-accent-fg">
								ti riesce.
								<PenStroke className="absolute inset-x-0 -bottom-1.5" />
							</span>
						</h1>
						<p className="lp-in mt-7 max-w-xl text-lg leading-relaxed text-fg-muted" style={{ '--lp-d': '0.16s' } as React.CSSProperties}>
							Esercizi a livelli, corretti subito e spiegati quando sbagli. I progressi restano salvati, così sai sempre cosa ti riesce e da dove ripartire.
						</p>
						<div className="lp-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ '--lp-d': '0.24s' } as React.CSSProperties}>
							<LinkButton href="/pricing" size="lg" className="px-7 py-4">
								<GraduationCap className="size-5" aria-hidden="true" />
								Prova gratis per {TRIAL_DAYS} giorni
							</LinkButton>
							<LinkButton href="/materiale/scuola-superiore" variant="secondary" size="lg" className="px-7 py-4">
								<BookOpen className="size-5" aria-hidden="true" />
								Sfoglia le lezioni
							</LinkButton>
						</div>
						<p className="lp-in mt-3 text-sm text-fg-subtle" style={{ '--lp-d': '0.3s' } as React.CSSProperties}>
							{TRIAL_NOTE}
						</p>
						<ul className="lp-in mt-10 flex flex-wrap gap-x-6 gap-y-2" style={{ '--lp-d': '0.36s' } as React.CSSProperties}>
							{['Correzione immediata', 'Passaggi dopo ogni errore', 'Progressi salvati'].map((line) => (
								<li key={line} className="flex items-center gap-2 text-sm font-medium text-fg">
									<Check className="size-4 text-accent-fg" strokeWidth={2.75} aria-hidden="true" />
									{line}
								</li>
							))}
						</ul>
					</div>
					<div className="lp-in relative" style={{ '--lp-d': '0.2s' } as React.CSSProperties}>
						<p className="pencil pointer-events-none absolute -top-9 right-4 z-10 hidden rotate-[-3deg] items-end gap-1 text-2xl desk:flex" aria-hidden="true">
							rispondi qui, anche con i tasti 1, 2, 3, 4
							<svg viewBox="0 0 40 44" className="lp-draw -mb-6 h-11 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path pathLength={1} d="M5 4c16 1 26 10 27 33" />
								<path pathLength={1} d="M24 30l8 8 5-10" style={{ '--lp-d': '0.9s' } as React.CSSProperties} />
							</svg>
						</p>
						<TrialSheet questions={questions} />
					</div>
				</div>
			</section>

			{/* ---- how a level works ---- */}
			<section className="border-y border-edge bg-surface px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle eyebrow="Come si studia qui" title="Tre mosse, sempre le stesse" />
					<ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
						{STEPS.map((step, i) => (
							<Reveal as="li" key={step.title} delay={i * 0.12} className="relative">
								<div className="flex items-center gap-4">
									<PenRing>{i + 1}</PenRing>
									{i < STEPS.length - 1 && <span className="hidden h-px flex-1 border-t-2 border-dashed border-edge-strong md:block" aria-hidden="true" />}
								</div>
								<h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-fg-strong">{step.title}</h3>
								<p className="mt-2 max-w-sm text-base leading-relaxed text-fg-muted">{step.text}</p>
							</Reveal>
						))}
					</ol>
				</div>
			</section>

			{/* ---- the bench ---- */}
			<section className="relative px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle eyebrow="Banco di prova" title="Tocca quello che vuoi" lead="Tre cose del sito, da provare qui senza andare da nessuna parte. Quelle vere fanno molto di più." />
					<Reveal className="mt-12">
						<Bench cards={benchCards()} elements={benchElements()} />
					</Reveal>
				</div>
			</section>

			{/* ---- the subjects ---- */}
			{data.subjects.length > 0 && (
				<section className="px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
					<div className="mx-auto max-w-7xl">
						<SectionTitle eyebrow="Le materie" title="Quattro materie, lo stesso metodo" />
						<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{data.subjects.map((s, i) => (
								<Reveal key={s.slug} delay={i * 0.07} data-subject={s.tone} className="subject-card group">
									<Link href={s.href} className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-surface p-6 no-underline shadow-paper transition-[translate,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-tint-edge hover:shadow-lift focus-ring-offset">
										<span className="absolute inset-0 bg-linear-to-b from-tint-soft to-transparent to-60%" aria-hidden="true" />
										<span className="grid-paper absolute inset-0 [--grid:color-mix(in_oklab,var(--tint)_13%,transparent)] [mask-image:linear-gradient(black,transparent_55%)]" aria-hidden="true" />
										<SubjectObject id={s.object} className="subject-object pointer-events-none relative mx-auto -mt-2 size-40 select-none" />
										<h3 className="relative mt-2 font-display text-2xl font-semibold tracking-tight text-fg-strong">{s.title}</h3>
										<p className="relative mt-1 text-sm leading-snug text-fg-subtle">{SUBJECT_COPY[s.slug]?.inside}</p>
										<p className="label-mono relative mt-5 flex items-center justify-between text-fg-subtle">
											<span>{s.lessons} lezioni online</span>
											<ArrowRight className="size-4 text-tint-fg transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
										</p>
									</Link>
								</Reveal>
							))}
						</div>
						<p className="mt-8 text-sm text-fg-subtle">
							Ci sono anche i primi capitoli per la{' '}
							<Link href="/materiale/scuola-media" className="font-medium text-fg underline underline-offset-4 hover:text-accent-fg">
								scuola media
							</Link>{' '}
							e per l&apos;
							<Link href="/materiale/universita" className="font-medium text-fg underline underline-offset-4 hover:text-accent-fg">
								università
							</Link>
							.
						</p>
					</div>
				</section>
			)}

			{/* ---- the figures, on the blackboard ---- */}
			{figures.length > 0 && (
				<section className="relative overflow-hidden bg-ink-900 px-5 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
					<div className="grid-paper pointer-events-none absolute inset-0 [--grid:color-mix(in_oklab,white_6%,transparent)]" aria-hidden="true" />
					<dl className="relative mx-auto grid max-w-7xl gap-10 sm:grid-cols-3">
						{figures.map((f, i) => (
							<Reveal key={f.label} delay={i * 0.1} className="flex flex-col gap-2 sm:border-l sm:border-white/15 sm:pl-8 sm:first:border-l-0 sm:first:pl-0">
								<dd className="font-display text-6xl font-medium leading-none tracking-tight tabular-nums lg:text-7xl">{f.value}</dd>
								<dt className="label-mono text-ink-300">{f.label}</dt>
							</Reveal>
						))}
					</dl>
				</section>
			)}

			{/* ---- plans ---- */}
			<section className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered eyebrow="Prezzi" title={`Sette giorni di tutto, poi scegli`} lead={`Chi crea un account ha Studio gratis per ${TRIAL_DAYS} giorni, senza carta. Poi resta il piano Free, oppure continui con Studio.`} />
					<LandingPlans className="mt-14" />
				</div>
			</section>

			{/* ---- questions ---- */}
			<section className="border-t border-edge bg-surface px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered eyebrow="Domande" title="Prima di cominciare" />
					<LandingFaq className="mt-12" />
				</div>
			</section>

			{/* ---- the last call ---- */}
			<section className="relative overflow-hidden px-5 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
				<div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_60%,black_10%,transparent_65%)]" aria-hidden="true" />
				<Reveal className="relative mx-auto max-w-3xl">
					<h2 className="text-5xl font-semibold leading-[1.02] tracking-tight text-fg-strong sm:text-6xl">
						La prossima domanda è <span className="marker-hand">già pronta</span>.
					</h2>
					<p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">Crea un account e riparti dal livello 1, questa volta con i progressi che restano.</p>
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
