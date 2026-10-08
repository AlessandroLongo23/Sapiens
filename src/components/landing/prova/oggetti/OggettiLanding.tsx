import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { cn } from '@/lib/utils/cn';
import { LinkButton } from '@/components/ui/Button';
import { ObjectCard } from '@/components/content/LibraryCovers';
import { SubjectObject } from '@/components/content/SubjectObject';
import { LandingFaq, LandingPlans, TRIAL_NOTE } from '../common';
import { Reveal } from '../Reveal';
import { SectionTitle, after } from '../ink';
import { SUBJECT_COPY, type LandingData } from '../data';
import { ExerciseSheet, LessonSheet, ReviewSheet } from '../quaderno/sheets';
import { HeroScene } from './HeroScene';
import { TileFilm } from './TileFilm';

/*
 * Version two of the landing page, "Oggetti": the objects modelled for the subject
 * cards carry the page. The hero is a still life of them, rendered as one scene; three
 * chapters follow, one for each verb of the title, then the subjects on their own cards
 * and a grid of what else is on the site.
 */

const CHAPTERS: { verb: string; object: string; tone: string; title: string; text: string; link: [string, string]; picture: ReactNode }[] = [
	{
		verb: 'Impara',
		object: 'level-high_school',
		tone: 'math',
		title: 'Lezioni corte, nell’ordine della classe',
		text: 'Una lezione per idea: la regola, un esempio svolto, gli errori frequenti accanto alla regola e figure da muovere. Ogni lezione ha il suo formulario, gratis.',
		link: ['/materiale/scuola-superiore', 'Sfoglia le lezioni'],
		picture: <LessonSheet />
	},
	{
		verb: 'Esercitati',
		object: 'level-middle_school',
		tone: 'physics',
		title: 'Esercizi a livelli, corretti subito',
		text: 'Ogni livello aggiunge una sola difficoltà e si supera con alcune ripetizioni da 8 domande, sempre diverse. Dopo un errore vedi i passaggi. I progressi restano salvati.',
		link: ['/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado/esercizi', 'Guarda un percorso di livelli'],
		picture: <ExerciseSheet />
	},
	{
		verb: 'Consolida',
		object: 'level-university',
		tone: 'chemistry',
		title: 'Flashcard e ripassi prima della verifica',
		text: 'Un mazzo di flashcard per lezione, il diario con compiti e verifiche in una riga, e il ripasso pronto la sera prima con quello che ancora non ti riusciva.',
		link: ['/diario', 'Apri il diario'],
		picture: <ReviewSheet />
	}
];

export function OggettiLanding({ data }: { data: LandingData }) {
	const figures = [
		{ value: data.lessons, label: 'lezioni online' },
		{ value: data.withFlashcards, label: 'mazzi di flashcard' },
		{ value: data.tools, label: 'strumenti gratuiti' },
		{ value: TRIAL_DAYS, label: 'giorni di prova', more: ', senza carta' }
	];
	return (
		<div className="lp lp-oggetti overflow-x-clip">
			{/* ---- hero ----
			    On a phone it is one screen, laid out like the first screen of an app: the scene on top, from edge to
			    edge, then the title, one sentence, one button, its note as a caption and the second link as plain text. */}
			<section className="relative px-5 pt-1 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
				<div className="grid-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_80%,transparent)]" aria-hidden="true" />
				<div className="relative mx-auto flex max-w-7xl flex-col text-center">
					{/* From `sm` the title is one line: its size follows the width of the screen, up to 6rem. The serif is wider at small sizes: the line is about 13em long at 45px and 11.2em at 96px. */}
					<h1 className="lp-in mx-auto text-[3.25rem] font-semibold leading-[0.94] tracking-tight text-fg-strong sm:whitespace-nowrap sm:text-[length:calc((100vw-3rem)/13.6)] lg:text-[length:min(6rem,calc((100vw-4rem)/11.7))] sm:leading-[0.98]" style={after(0.08)}>
						<span className="max-sm:block">Impara.</span> <span className="max-sm:block">Esercitati.</span> <span className="italic text-accent-fg max-sm:block">Consolida.</span>
					</h1>
					<p className="lp-in mx-auto mt-4 max-w-3xl text-balance text-[1.0625rem] leading-[1.5] text-fg-muted sm:mt-7 sm:text-lg sm:leading-relaxed" style={after(0.16)}>
						Lezioni del programma, esercizi a livelli con i progressi salvati, flashcard e formulari.<span className="max-sm:hidden"> Tutto quello che serve per studiare le materie scientifiche, in un posto solo.</span>
					</p>
					<div className="lp-in mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row" style={after(0.24)}>
						<LinkButton href="/pricing" size="lg" className="px-7 py-4">
							<GraduationCap className="size-5" aria-hidden="true" />
							<span>
								Prova gratis per {TRIAL_DAYS} giorni
								<span className="max-sm:hidden" aria-hidden="true">
									*
								</span>
							</span>
						</LinkButton>
						<LinkButton href="/materiale/scuola-superiore" variant="secondary" size="lg" className="px-7 py-4 max-sm:hidden">
							<BookOpen className="size-5" aria-hidden="true" />
							Sfoglia le lezioni
						</LinkButton>
					</div>
					{/* Below `lg` the note stays under the buttons; the corner of the screen is the tab bar's. On a phone it is the button's caption, so it needs no asterisk. */}
					<p className="lp-in mx-auto mt-2.5 max-w-[19rem] text-[0.8125rem] leading-snug text-fg-subtle sm:mt-3 sm:max-w-none sm:text-sm lg:hidden" style={after(0.3)}>
						<span className="max-sm:hidden">* </span>
						{TRIAL_NOTE}
					</p>
					<Link href="/materiale/scuola-superiore" className="lp-in group mx-auto mt-1 inline-flex min-h-11 items-center gap-1.5 px-3 text-[0.9375rem] font-semibold text-fg no-underline focus-ring sm:hidden" style={after(0.34)}>
						<span className="underline decoration-edge-strong decoration-2 underline-offset-4">Sfoglia le lezioni</span>
						<ArrowRight className="size-4 text-fg-subtle" aria-hidden="true" />
					</Link>
					<HeroScene className="mx-auto mt-6 max-w-6xl max-sm:order-first max-sm:-mx-5 max-sm:-mt-3 max-sm:mb-2 max-sm:w-auto lg:mt-2" />
				</div>
				{/* The note of the asterisk, in the bottom right corner of the first screen (or of the hero, on a screen taller than it). */}
				<p className="lp-in absolute right-8 top-[min(calc(100dvh-var(--header-h,64px)-3.25rem),calc(100%-3.25rem))] hidden max-w-[17rem] text-right text-xs leading-snug text-fg-subtle lg:block" style={after(0.3)}>
					* {TRIAL_NOTE}
				</p>
			</section>

			{/* ---- the figures ---- */}
			{/* On a phone the four figures are one row, like the counts at the head of a profile. */}
			<section className="border-y border-edge bg-surface px-2 py-5 sm:px-6 sm:py-10 lg:px-8">
				<dl className="mx-auto grid max-w-7xl grid-cols-4 max-sm:divide-x max-sm:divide-edge sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4">
					{figures.map((f, i) => (
						<Reveal key={f.label} delay={i * 0.07} className="flex flex-col gap-1.5 border-edge-strong px-2 max-sm:items-center max-sm:px-1 max-sm:text-center lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0">
							<dd className="font-display text-[1.75rem] font-medium leading-none tracking-tight text-fg-strong tabular-nums sm:text-5xl">{f.value}</dd>
							<dt className="label-mono text-fg-subtle max-sm:text-[0.5938rem] max-sm:leading-[0.8125rem] max-sm:tracking-[0.04em]">
								{f.label}
								{f.more && <span className="max-sm:hidden">{f.more}</span>}
							</dt>
						</Reveal>
					))}
				</dl>
			</section>

			{/* ---- the three verbs ---- */}
			<section className="px-5 pb-24 pt-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
				<div className="mx-auto flex max-w-7xl flex-col gap-20 sm:gap-24 lg:gap-36">
					{CHAPTERS.map((c, i) => (
						<div key={c.verb} data-subject={c.tone} className={cn('grid items-center gap-9 sm:gap-10 lg:grid-cols-2 lg:gap-20', i % 2 === 1 && 'lg:[&>*:first-child]:order-2')}>
							<Reveal>
								<p className="font-display text-[2.75rem] font-semibold italic leading-none tracking-tight text-tint-fg sm:text-8xl">{c.verb}.</p>
								<h2 className="mt-4 max-w-lg text-2xl font-semibold leading-[1.15] tracking-tight text-fg-strong sm:mt-6 sm:text-4xl sm:leading-[1.1]">{c.title}</h2>
								<p className="mt-3 max-w-lg text-[1.0625rem] leading-[1.55] text-fg-muted sm:mt-4 sm:text-lg sm:leading-relaxed">{c.text}</p>
								<Link href={c.link[0]} className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-tint-fg no-underline focus-ring sm:mt-7 sm:min-h-0 sm:text-sm">
									<span className="underline decoration-tint-edge decoration-2 underline-offset-4 group-hover:decoration-tint">{c.link[1]}</span>
									<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
								</Link>
							</Reveal>
							<Reveal bare threshold={0.45} className="subject-card relative">
								{/* a wash of the chapter's colour under the sheet: a band from edge to edge on a phone, where the object always hangs on the right, clear of the next verb */}
								<span className="absolute -inset-x-5 -inset-y-10 -z-10 bg-linear-to-b from-transparent via-tint-soft via-30% to-transparent sm:-inset-x-6 sm:-inset-y-8 sm:rounded-[2.5rem] sm:bg-linear-to-br sm:from-tint-soft sm:via-transparent" aria-hidden="true" />
								<div className="mx-auto max-w-[34rem]">{c.picture}</div>
								<div className={cn('lp-drift pointer-events-none absolute -bottom-16 size-28 sm:-bottom-20 sm:size-56', i % 2 === 1 ? 'max-sm:-right-3 sm:-left-4 lg:-left-24' : '-right-3 sm:-right-4 lg:-right-24')}>
									<SubjectObject id={c.object} className="subject-object size-full select-none" />
								</div>
							</Reveal>
						</div>
					))}
				</div>
			</section>

			{/* ---- the subjects ---- */}
			{data.subjects.length > 0 && (
				<section className="border-t border-edge bg-surface px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
					<div className="mx-auto max-w-7xl">
						<SectionTitle title="Scegli da dove cominciare" lead="Ogni lezione ha teoria, formulario, flashcard ed esercizi. Gli anni che mancano arrivano un lotto alla volta." />
						<div className="mt-7 grid gap-x-6 gap-y-3 sm:mt-10 sm:gap-y-2 lg:grid-cols-2">
							{data.subjects.map((s, i) => (
								<Reveal key={s.slug} delay={(i % 2) * 0.08}>
									<ObjectCard href={s.href} tone={s.tone} object={s.object} title={s.title} text={SUBJECT_COPY[s.slug]?.inside} meta={[`${s.chapters} capitoli`, `${s.lessons} lezioni online`]} layout="side" />
								</Reveal>
							))}
						</div>
					</div>
				</section>
			)}

			{/* ---- what else ---- */}
			<section className="px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle title="Strumenti didattici" lead={`${Math.floor(data.tools / 100) * 100}+ strumenti gratuiti e senza registrazione, un laboratorio virtuale e un posto per i tuoi appunti.`} />
					{/* Below `lg` the tiles are a row to swipe, the next one showing at the edge of the screen; from `lg` a grid. */}
					<div className="no-scrollbar -mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-6 pt-2 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-12 lg:gap-5 lg:overflow-visible lg:p-0">
						<Tile href="/strumenti/tavola-periodica" tone="chemistry" label="Strumenti" title="Tavola periodica" text="I 118 elementi con schede, andamenti e isotopi." className="lg:col-span-7" image="/landing/tavola-periodica-carbonio.webp" ratio="lg:aspect-[9/5]" />
						<Tile href="/laboratorio" tone="chemistry" label="Laboratorio 3D" title="Laboratorio di chimica" text="Cristalli, saggi alla fiamma, titolazioni: da soli o con la classe." className="lg:col-span-5" image="/lab/copertine/banco-singolo.webp" ratio="lg:aspect-[14/11]" cover position="object-center" />
						<Tile href="/strumenti/orbitali-atomici" tone="physics" label="Strumenti" title="Orbitali atomici" text="Nuvole di punti da ruotare, con i nodi." className="lg:col-span-3" film="orbitali" ratio="lg:aspect-[4/3]" cover compact />
						<Tile href="/strumenti/grafico-di-funzione" tone="math" label="Strumenti" title="Grafico di funzione" text="Zeri, massimi, intersezioni e parametri con i cursori." className="lg:col-span-3" film="grafico" ratio="lg:aspect-[4/3]" cover compact />
						<Tile href="/strumenti/sandbox-di-fisica" tone="physics" label="Strumenti" title="Sandbox di fisica" text="Masse, piani inclinati, corde e carrucole, con le forze disegnate." className="lg:col-span-3" film="sandbox" ratio="lg:aspect-[4/3]" cover compact />
						<Tile href="/strumenti/editor-di-codice" tone="cs" label="Strumenti" title="Editor di codice" text="Python, C, C++ e JavaScript eseguiti nel browser." className="lg:col-span-3" film="editor" ratio="lg:aspect-[4/3]" cover compact />
					</div>
				</div>
			</section>

			{/* ---- plans ---- */}
			<section className="border-t border-edge bg-surface px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered title="Comincia gratis" lead={`Chi crea un account ha Studio per ${TRIAL_DAYS} giorni, senza carta. Poi resta il piano Free, oppure continui con Studio.`} />
					<LandingPlans className="mt-9 sm:mt-14" />
				</div>
			</section>

			{/* ---- questions ---- */}
			<section className="px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
				<div className="mx-auto max-w-7xl">
					<SectionTitle centered title="Prima di cominciare" />
					<LandingFaq className="mt-7 sm:mt-12" />
				</div>
			</section>

			{/* ---- the last call ---- */}
			<section className="px-5 pb-14 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
				<Reveal className="subject-card relative mx-auto flex max-w-7xl flex-col items-center gap-5 overflow-hidden rounded-3xl bg-ink-900 px-6 pb-8 pt-7 text-center text-white sm:gap-8 sm:rounded-[2rem] sm:px-12 sm:py-16 lg:flex-row lg:py-20 lg:text-left">
					<span className="grid-paper pointer-events-none absolute inset-0 [--grid:color-mix(in_oklab,white_6%,transparent)]" aria-hidden="true" />
					<div className="relative flex-1 max-sm:w-full">
						<h2 className="text-[2rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl">Il primo livello ti aspetta.</h2>
						<p className="mt-3 max-w-xl text-[0.9375rem] leading-normal text-ink-100 max-lg:mx-auto sm:mt-5 sm:text-lg sm:leading-relaxed">{TRIAL_NOTE}</p>
						<LinkButton href="/pricing" size="lg" className="mt-6 px-8 py-4 max-sm:w-full sm:mt-8">
							Prova gratis per {TRIAL_DAYS} giorni
							<ArrowRight className="size-5" aria-hidden="true" />
						</LinkButton>
					</div>
					{/* On a phone the object opens the card, as the scene opens the page. */}
					<SubjectObject id="level-high_school" className="subject-object pointer-events-none size-36 shrink-0 select-none max-lg:order-first sm:size-72" />
				</Reveal>
			</section>
		</div>
	);
}

/**
 * A tile of the grid: a picture of the tool, its name and a line, the whole of it a link. The first two share a row,
 * so their pictures have the same height (9/5 on seven columns, 14/11 on five). A tile with a `film` shows its still
 * and plays the film over it (TileFilm.tsx); one without an `href` is a tool that has no page yet.
 */
function Tile({ href, tone, label, title, text, image, film, ratio, className, cover = false, compact = false, position = 'object-top' }: { href?: string; tone: string; label: string; title: string; text: string; image?: string; /** The name of the files in public/landing/film. */ film?: string; ratio: string; className?: string; cover?: boolean; /** One of four in a row: no room for the arrow until `xl`. */ compact?: boolean; position?: string }) {
	const fit = cover ? cn('object-cover', position) : 'object-contain';
	const frame = 'group flex h-full flex-col overflow-hidden rounded-3xl border border-edge bg-surface no-underline shadow-paper';
	const inside = (
		<>
			<div className={cn('relative aspect-[4/3] overflow-hidden border-b border-edge bg-paper-50', ratio, !cover && 'p-3 lg:p-4')} style={{ minHeight: 0 } as CSSProperties}>
				<Image src={film ? `/landing/film/${film}.webp` : (image ?? '')} alt="" width={film ? 800 : 1600} height={film ? 600 : 800} sizes="(min-width: 1024px) 50vw, (min-width: 640px) 44vw, 78vw" className={cn('size-full transition-transform duration-700 ease-out-soft', !film && 'group-hover:scale-[1.03]', fit)} />
				{film && <TileFilm name={film} className={fit} />}
			</div>
			<div className={cn('flex flex-1 items-start justify-between gap-3 p-4 lg:items-end lg:gap-4', compact ? 'lg:p-5' : 'lg:p-6')}>
				<div>
					<p className="label-mono text-tint-fg">{label}</p>
					<h3 className="mt-1.5 font-display text-xl font-semibold leading-tight tracking-tight text-fg-strong lg:text-2xl">{title}</h3>
					<p className="mt-1 text-sm leading-snug text-fg-subtle">{text}</p>
				</div>
				{href && (
					<span className={cn('grid size-10 shrink-0 place-items-center rounded-full bg-tint-soft text-tint-fg transition-colors duration-300 group-hover:bg-tint-cover group-hover:text-tint-cover-fg', compact ? 'max-xl:hidden' : 'max-lg:hidden')} aria-hidden="true">
						<ArrowUpRight className="size-4" />
					</span>
				)}
			</div>
		</>
	);
	return (
		// In the row to swipe a tile is already there when it comes on screen: a fade would lag behind the finger.
		<Reveal data-subject={tone} data-tile="" className={cn('w-[78%] shrink-0 snap-start max-lg:translate-none! max-lg:opacity-100! sm:w-[44%] lg:w-auto', className)}>
			{href ? (
				<Link href={href} className={cn(frame, 'transition-[translate,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1 hover:border-tint-edge hover:shadow-lift focus-ring-offset')}>
					{inside}
				</Link>
			) : (
				<div className={frame}>{inside}</div>
			)}
		</Reveal>
	);
}
