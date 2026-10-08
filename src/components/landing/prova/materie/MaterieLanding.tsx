import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { LinkButton } from '@/components/ui/Button';
import { LandingFaq, LandingPlans, TRIAL_NOTE } from '../common';
import { Reveal } from '../Reveal';
import { SectionTitle, after } from '../ink';
import { EXAMPLE_LESSONS, tex, type LandingData } from '../data';
import { ScrollStage } from './ScrollStage';
import { TikzFigure } from './TikzFigure';
import { EditorTool, OrbitalTool, PlotTool, SandboxTool } from './tools';

/*
 * Version four of the landing page, "Materie": one stage a subject, driven by the scroll
 * (ScrollStage.tsx). The subject's object comes in turning, fills half the screen and
 * leaves; in the other half a piece of a real lesson comes up, its TikZ figure drawn line
 * by line, and then the tool of that subject follows it, to try in place.
 * The words of each lesson are taken from the lesson named in EXAMPLE_LESSONS.
 */

/** A figure compiled from a lesson's TikZ, copied from the `figure` bucket into public/landing/figure; sized by its box. */
function figure(file: string): string {
	return readFileSync(path.join(process.cwd(), 'public', 'landing', 'figure', file), 'utf8').replace(/^<svg([^>]*?)\swidth="[^"]*"\sheight="[^"]*"/, '<svg$1');
}

const Tex = ({ children, display = false }: { children: string; display?: boolean }) => <span className="math-content" dangerouslySetInnerHTML={{ __html: tex(children, display) }} />;

interface Stage {
	slug: string;
	side: 'left' | 'right';
	label: string;
	blurb: string;
	lesson: ReactNode;
	tool: { name: string; line: string; href: string; node: ReactNode };
}

const STAGES: Stage[] = [
	{
		slug: 'math',
		side: 'left',
		label: 'Un compasso che traccia un cerchio su un foglio a quadretti',
		blurb: 'Dagli insiemi alle coniche, con i grafici da muovere dentro le lezioni.',
		lesson: (
			<>
				<p className="text-base leading-relaxed text-fg">
					Fissa un punto <Tex>F</Tex> e una retta <Tex>d</Tex>. La <strong>parabola</strong> di fuoco <Tex>F</Tex> e direttrice <Tex>d</Tex> è il luogo dei punti che hanno la stessa distanza da <Tex>F</Tex> e da <Tex>d</Tex>.
				</p>
				<TikzFigure svg={figure('parabola-fuoco-direttrice-luogo-de79c29c.svg')} width={330} alt="La parabola di fuoco F e direttrice d: un punto P della curva dista da F quanto dalla direttrice" />
				<p className="rounded-xl border border-tint-edge bg-tint-soft py-2.5 text-center text-lg">
					<Tex>{'\\overline{PF} = \\overline{PH}'}</Tex>
				</p>
			</>
		),
		tool: { name: 'Grafico di funzione', line: 'Trascina il vertice, apri e chiudi la curva.', href: '/strumenti/grafico-di-funzione', node: <PlotTool /> }
	},
	{
		slug: 'physics',
		side: 'right',
		label: 'Un pendolo di Newton che oscilla',
		blurb: 'Dalle grandezze alla termodinamica, con scene in cui le forze si vedono.',
		lesson: (
			<>
				<p className="text-base leading-relaxed text-fg">
					Su un piano liscio agiscono il peso <Tex>{'\\vec{P}'}</Tex> e la reazione <Tex>{'\\vec{F}_v'}</Tex> del piano. La componente del peso parallela al piano non la bilancia nessuno: è la <strong>forza totale</strong>.
				</p>
				<TikzFigure svg={figure('forze-blocco-piano-liscio-moto-15c9c3d7.svg')} width={300} alt="Un blocco su un piano inclinato liscio con il peso, la reazione del piano, la forza totale lungo il piano e l'accelerazione" />
				<p className="rounded-xl border border-tint-edge bg-tint-soft py-2.5 text-center text-lg">
					<Tex>{'a = g\\sin\\alpha'}</Tex>
				</p>
			</>
		),
		tool: { name: 'Sandbox di fisica', line: 'Cambia l’inclinazione e fai partire il blocco.', href: '/materiale/scuola-superiore/fisica', node: <SandboxTool /> }
	},
	{
		slug: 'chemistry',
		side: 'left',
		label: 'Un anello di benzene che gira',
		blurb: 'Dalla materia ai legami, con molecole e orbitali in tre dimensioni.',
		lesson: (
			<>
				<p className="text-base leading-relaxed text-fg">
					Un&apos;onda chiusa non può vibrare come vuole. La corda di una chitarra, fissata ai due estremi, vibra tutta intera, divisa in due metà o in tre parti, e in <strong>nessun modo intermedio</strong>.
				</p>
				<TikzFigure svg={figure('orbitali-corda-onde-stazionarie-3e882173.svg')} width={370} alt="Tre corde fissate agli estremi: la prima vibra intera, la seconda in due metà con un nodo al centro, la terza in tre parti con due nodi" />
				<p className="text-base leading-relaxed text-fg">
					Per l&apos;elettrone attorno al nucleo vale lo stesso: ogni forma ammessa è un <strong>orbitale</strong>.
				</p>
			</>
		),
		tool: { name: 'Orbitali atomici', line: 'Scegli un orbitale e gira la nuvola.', href: '/strumenti/orbitali-atomici', node: <OrbitalTool /> }
	},
	{
		slug: 'computer-science',
		side: 'right',
		label: 'Tre tasti di una tastiera premuti uno dopo l’altro',
		blurb: 'Dalla codifica agli algoritmi, con programmi che girano nel browser.',
		lesson: (
			<>
				<p className="text-base leading-relaxed text-fg">
					Un <strong>diagramma di flusso</strong> disegna un algoritmo: ogni passo è un blocco, e le frecce dicono in che ordine i passi si eseguono. La forma del blocco dice che tipo di passo è.
				</p>
				<TikzFigure svg={figure('diagramma-flusso-quattro-blocchi-124fb90f.svg')} width={400} alt="I quattro blocchi di un diagramma di flusso: l'ovale per inizio e fine, il parallelogramma per ingresso e uscita, il rettangolo per un'istruzione, il rombo per una condizione" />
				<p className="text-base leading-relaxed text-fg">
					Si disegna prima di scrivere il programma: sul disegno si vede subito dove l&apos;algoritmo decide e dove torna indietro.
				</p>
			</>
		),
		tool: { name: 'Editor di codice', line: 'Premi Esegui, poi cambia il programma.', href: '/strumenti/editor-di-codice', node: <EditorTool /> }
	}
];

export function MaterieLanding({ data }: { data: LandingData }) {
	return (
		<div className="lp lp-materie overflow-x-clip">
			{/* ---- hero ---- */}
			<section className="relative px-5 pb-10 pt-14 text-center sm:px-6 lg:px-8 lg:pb-16 lg:pt-24">
				<div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_30%,black_10%,transparent_70%)]" aria-hidden="true" />
				<div className="relative mx-auto max-w-5xl">
					<p className="label-mono lp-in text-accent-fg">Matematica, fisica, chimica e informatica delle superiori</p>
					<h1 className="lp-in mt-6 text-[2.9rem] font-semibold leading-[0.98] tracking-tight text-fg-strong sm:text-7xl lg:text-[6rem]" style={after(0.08)}>
						Ogni materia, <span className="italic text-accent-fg">da vicino.</span>
					</h1>
					<p className="lp-in mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted" style={after(0.16)}>
						Lezioni che si leggono in pochi minuti, esercizi a livelli con i progressi salvati e strumenti da usare con le mani. Scorri: di ogni materia vedi una lezione e ne provi uno.
					</p>
					<div className="lp-in mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={after(0.24)}>
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
				</div>
			</section>

			{/* ---- one stage a subject ---- */}
			{STAGES.map((stage, i) => {
				const subject = data.subjects.find((s) => s.slug === stage.slug);
				if (!subject) return null;
				const example = data.examples[stage.slug];
				return (
					<ScrollStage
						key={stage.slug}
						tone={subject.tone}
						side={stage.side}
						model={stage.slug}
						label={stage.label}
						head={
							<>
								<p className="label-mono text-tint-fg">
									0{i + 1} <span className="text-fg-faint">/ 0{STAGES.length}</span>
								</p>
								<div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
									<h2 className="text-5xl font-semibold leading-none tracking-tight text-fg-strong sm:text-6xl">{subject.title}</h2>
									<Link href={subject.href} className="group label-mono flex items-center gap-2 text-fg-subtle no-underline hover:text-tint-fg focus-ring">
										{subject.lessons} lezioni online
										<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
									</Link>
								</div>
								<p className="mt-3 text-lg leading-snug text-fg-muted">{stage.blurb}</p>
							</>
						}
						lesson={
							<article className="flex flex-col gap-4 rounded-3xl border border-edge bg-surface p-6 shadow-lift sm:p-7">
								<header>
									<p className="label-mono text-fg-subtle">
										Lezione{example ? ` · ${example.chapter}` : ''}
									</p>
									<h3 className="mt-1.5 w-fit border-b-[3px] border-tint pb-1 font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-fg-strong">
										{EXAMPLE_LESSONS[stage.slug]}
									</h3>
								</header>
								{stage.lesson}
								<Link href={example?.href ?? subject.href} className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-tint-fg no-underline focus-ring">
									<span className="underline decoration-tint-edge decoration-2 underline-offset-4 group-hover:decoration-tint">Leggi tutta la lezione</span>
									<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
								</Link>
							</article>
						}
						tool={
							<article className="rounded-3xl border border-edge bg-surface p-5 shadow-lift sm:p-6">
								<header className="mb-4 flex items-start justify-between gap-4">
									<div>
										<p className="label-mono text-fg-subtle">Strumento</p>
										<h3 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight text-fg-strong">{stage.tool.name}</h3>
										<p className="mt-0.5 text-sm text-fg-muted">{stage.tool.line}</p>
									</div>
									<Link href={stage.tool.href} aria-label={`Apri ${stage.tool.name}`} className="grid size-10 shrink-0 place-items-center rounded-full bg-tint-soft text-tint-fg no-underline transition-colors duration-300 hover:bg-tint-cover hover:text-tint-cover-fg focus-ring">
										<ArrowUpRight className="size-4" aria-hidden="true" />
									</Link>
								</header>
								{stage.tool.node}
							</article>
						}
					/>
				);
			})}

			{/* ---- plans ---- */}
			<section className="border-t border-edge bg-surface px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered eyebrow="Prezzi" title="Comincia gratis" lead={`Chi crea un account ha Studio per ${TRIAL_DAYS} giorni, senza carta. Poi resta il piano Free, oppure continui con Studio.`} />
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
					<h2 className="text-5xl font-semibold leading-[1.02] tracking-tight text-fg-strong sm:text-6xl">
						Adesso <span className="marker-hand">tocca a te</span>.
					</h2>
					<p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">Scegli una materia e fai il primo livello.</p>
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
