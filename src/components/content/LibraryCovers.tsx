import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ContentNode } from '@/lib/utils/tree';
import { countByType } from '@/lib/utils/tree';
import { toneFor } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
import { subjectNoun } from '@/lib/seo/meta';
import { plainTitle } from '@/lib/seo/slug';
import { Latex } from '@/components/ui/Latex';
import { SubjectObject } from './SubjectObject';

/*
 * The levels and the subjects of the library as cards, each with its object.
 * Both are fixed (three levels, a dozen and a half subjects), so what they say about
 * themselves is written here by hand; a subject not listed still gets a card from
 * its title and counts.
 */

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * A subject, keyed by `level/subject`: its name where space is short and what is
 * inside, in the words of its chapters.
 */
const SUBJECTS: Record<string, { short: string; inside: string }> = {
	'middle_school/math': { short: 'Matematica', inside: 'Numeri, frazioni, geometria, Pitagora, equazioni' },
	'middle_school/technology': { short: 'Tecnologia', inside: 'Disegno tecnico, materiali, energia, programmazione' },
	'middle_school/science': { short: 'Scienze', inside: 'Materia, viventi, corpo umano, Terra e Universo' },
	'high_school/math': { short: 'Matematica', inside: 'Algebra, geometria, funzioni, probabilità, analisi' },
	'high_school/physics': { short: 'Fisica', inside: 'Moto, forze, energia, onde, elettromagnetismo' },
	'high_school/computer-science': { short: 'Informatica', inside: 'Algoritmi, programmazione, web, basi di dati, reti' },
	'high_school/chemistry': { short: 'Chimica', inside: 'Atomi, legami, reazioni, equilibri, chimica organica' },
	'university/analisi-1': { short: 'Analisi I', inside: 'Successioni, limiti, derivate, integrali' },
	'university/analisi-2': { short: 'Analisi II', inside: 'Integrali doppi e tripli, serie di Taylor' },
	'university/fisica-1': { short: 'Fisica I', inside: 'Cinematica, dinamica, energia, corpo rigido' },
	'university/fisica-2': { short: 'Fisica II', inside: 'Termodinamica, elettromagnetismo, ottica' },
	'university/fondamenti-informatica': { short: 'Informatica', inside: 'Logica booleana, porte logiche, reti combinatorie e sequenziali' }
};

/** A level: who it is for, one line on what it holds. */
const LEVELS: Record<string, { who: string; blurb: string }> = {
	middle_school: { who: '11–14 anni', blurb: 'Dalle frazioni al teorema di Pitagora, dalla cellula al Sistema solare, dal disegno tecnico alle fonti di energia.' },
	high_school: { who: '14–19 anni', blurb: 'I cinque anni di matematica, fisica, informatica e chimica, dagli insiemi alle derivate.' },
	university: { who: 'Primi esami', blurb: 'Analisi, fisica e informatica dei primi anni di ingegneria e delle facoltà scientifiche.' }
};

/** The subjects whose object has a film of it moving (see SubjectObject), keyed like SUBJECTS. */
const LOOPS = new Set([
	'high_school/chemistry',
	'high_school/computer-science',
	'high_school/math',
	'high_school/physics',
	'middle_school/math',
	'middle_school/science',
	'middle_school/technology',
	'university/agenti-ia',
	'university/analisi-1',
	'university/analisi-2',
	'university/deep-learning',
	'university/fisica-1',
	'university/fisica-2',
	'university/fondamenti-informatica',
	'university/ia-classica',
	'university/ia-responsabile',
	'university/machine-learning',
	'university/modelli-linguistici'
]);

/** The areas the courses of the university are filtered by, each with the tone that colours it, in the order of the tabs. */
export const AREAS: { tone: string; label: string }[] = [
	{ tone: 'math', label: 'Matematica' },
	{ tone: 'physics', label: 'Fisica' },
	{ tone: 'cs', label: 'Informatica' },
	{ tone: 'ink', label: 'Intelligenza artificiale' }
];

/** A subject's name where space is short (Analisi I for Analisi matematica I). */
export function subjectShort(level: ContentNode, subject: ContentNode): string {
	return SUBJECTS[`${level.slug}/${subject.slug}`]?.short ?? plainTitle(subject.title);
}

/** How a card is laid out: the object over the text, beside it, or a row with a list (the chapters) at its end. */
export type CardLayout = 'stack' | 'side' | 'row';

interface ObjectCardProps {
	href: string;
	/** Colours the card (see `data-subject` in globals.css). */
	tone: string;
	/** The object's files in public/materie, without the extension. */
	object: string;
	/** Whether the object has a film of it moving. */
	loop?: boolean;
	eyebrow?: string;
	title: ReactNode;
	text?: string;
	/** Under the text: the subjects of a level, each with its colour. */
	chips?: { tone: string; label: string }[];
	/** The counts at the foot of the card. */
	meta: string[];
	/** For the row: what the card holds, listed at its end. */
	list?: string[];
	layout?: CardLayout;
}

const OBJECT = 'subject-object pointer-events-none select-none';

/**
 * How the subjects of a level are laid out: two or four of them fill rows of two wide cards,
 * object beside the text; any other number goes three to a row, object over the text.
 */
export const subjectLayout = (count: number): CardLayout => (count === 2 || count === 4 ? 'side' : 'stack');

/**
 * A level or a subject, as a card: its object (a render, see scripts/materie/icons.py)
 * on a wash of its colour, the title, what is inside and the counts. Under a mouse the
 * object comes forward (`subject-object` in globals.css) and, where it has a film, moves
 * (SubjectObject). On a phone every layout is the same row, object on the left, so a
 * screen holds several cards.
 */
export function ObjectCard({ href, tone, object, loop = false, eyebrow, title, text, chips, meta, list, layout = 'stack' }: ObjectCardProps) {
	const stack = layout === 'stack';
	const arrow = (
		<span className="grid size-9 shrink-0 place-items-center rounded-full bg-tint-soft text-tint-fg transition-colors duration-300 ease-out-soft group-hover:bg-tint-cover group-hover:text-tint-cover-fg max-sm:hidden" aria-hidden="true">
			<ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5" />
		</span>
	);
	const counts = (
		<p className="label-mono flex flex-wrap gap-x-3 gap-y-1 text-fg-subtle">
			{meta.map((m) => (
				<span key={m}>{m}</span>
			))}
		</p>
	);
	const words = (
		<>
			{eyebrow && <span className="label-mono mb-2 text-tint-fg max-sm:hidden">{eyebrow}</span>}
			<h3 className={cn('font-display font-semibold leading-[1.1] tracking-tight text-fg-strong max-sm:text-xl', layout === 'side' ? 'text-3xl' : 'text-[1.7rem]')}>{title}</h3>
			{text && <p className="mt-2 text-sm leading-snug text-fg-subtle max-sm:hidden">{text}</p>}
			{chips && (
				<ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 max-sm:hidden">
					{chips.map((chip) => (
						<li key={chip.label} data-subject={chip.tone} className="flex items-center gap-1.5 text-sm font-medium text-fg">
							<span className="size-2 rounded-[3px] bg-tint-cover" aria-hidden="true" />
							{chip.label}
						</li>
					))}
				</ul>
			)}
		</>
	);
	return (
		// In the stack and beside the text the object rises over the card's edge: the room above the card is for that.
		<div data-subject={tone} className={cn('subject-card group h-full max-sm:pt-0', stack && 'pt-12', layout === 'side' && 'pt-8')}>
			<Link
				href={href}
				className={cn(
					'relative isolate flex h-full rounded-3xl border border-edge bg-surface no-underline shadow-paper transition-[translate,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-tint-edge hover:shadow-lift focus-ring-offset max-sm:flex-row max-sm:items-center max-sm:rounded-2xl',
					stack ? 'flex-col' : 'items-stretch'
				)}
			>
				{/* The wash, squared like the page, and the light that comes up behind the object. */}
				<span
					className={cn(
						'absolute inset-0 -z-10 rounded-[inherit] from-tint-soft to-transparent max-sm:bg-linear-to-r max-sm:to-70%',
						stack ? 'bg-linear-to-b to-70%' : layout === 'side' ? 'bg-linear-to-l to-75%' : 'bg-linear-to-r to-45%'
					)}
					aria-hidden="true"
				/>
				<span
					className={cn(
						'grid-paper absolute inset-0 -z-10 rounded-[inherit] [--grid:color-mix(in_oklab,var(--tint)_13%,transparent)] max-sm:hidden',
						stack ? '[mask-image:linear-gradient(black,transparent_62%)]' : layout === 'side' ? '[mask-image:linear-gradient(to_left,black,transparent_60%)]' : '[mask-image:linear-gradient(to_right,black,transparent_38%)]'
					)}
					aria-hidden="true"
				/>
				<span
					className={cn(
						'absolute -z-10 size-44 rounded-full bg-tint opacity-0 blur-3xl transition-opacity duration-500 ease-out-soft group-hover:opacity-30 max-sm:hidden',
						stack ? 'left-1/2 top-2 -translate-x-1/2' : layout === 'side' ? 'right-6 top-0' : 'left-0 top-1/2 -translate-y-1/2'
					)}
					aria-hidden="true"
				/>
				{stack && (
					<>
						<div className="-mt-12 flex justify-center max-sm:mt-0 max-sm:shrink-0 max-sm:pl-2">
							<SubjectObject id={object} loop={loop} className={cn(OBJECT, '-mb-3 size-60 max-sm:mb-0 max-sm:size-24')} />
						</div>
						<div className="flex min-w-0 flex-1 flex-col px-6 pb-5 max-sm:px-3 max-sm:py-4">
							{words}
							<div className="mt-auto flex items-center justify-between gap-3 pt-5 max-sm:pt-2">
								{counts}
								{arrow}
							</div>
						</div>
					</>
				)}
				{layout === 'side' && (
					<>
						<div className="flex min-w-0 flex-1 flex-col justify-center py-6 pl-7 max-sm:order-2 max-sm:px-3 max-sm:py-4">
							{words}
							<div className="flex items-center gap-4 pt-5 max-sm:pt-2">
								{arrow}
								{counts}
							</div>
						</div>
						<div className="-mr-2 -mt-8 flex w-[46%] shrink-0 items-center justify-center max-sm:order-1 max-sm:m-0 max-sm:w-auto max-sm:pl-2">
							<SubjectObject id={object} loop={loop} className={cn(OBJECT, 'aspect-square w-full max-w-72 max-sm:size-24')} />
						</div>
					</>
				)}
				{layout === 'row' && (
					<>
						<div className="flex shrink-0 items-center pl-3 max-sm:pl-2">
							<SubjectObject id={object} loop={loop} className={cn(OBJECT, 'size-40 max-sm:size-24')} />
						</div>
						<div className="flex min-w-0 flex-1 flex-col justify-center py-5 pl-2 pr-6 max-sm:px-3 max-sm:py-4">
							{words}
							<div className="pt-3 max-sm:pt-2">{counts}</div>
						</div>
						{list && (
							<ol className="flex w-[34%] shrink-0 flex-col justify-center gap-1 border-l border-edge py-5 pl-6 pr-4 max-lg:hidden">
								{list.slice(0, 4).map((item, i) => (
									<li key={item} className="flex gap-3 text-sm text-fg">
										<span className="label-mono w-5 shrink-0 pt-0.5 text-tint-fg">{String(i + 1).padStart(2, '0')}</span>
										<span className="truncate">
											<Latex content={item} />
										</span>
									</li>
								))}
								{list.length > 4 && <li className="label-mono pl-8 pt-1 text-fg-faint">e altri {list.length - 4}</li>}
							</ol>
						)}
						<div className="flex items-center pr-6 max-sm:hidden">{arrow}</div>
					</>
				)}
			</Link>
		</div>
	);
}

/** A subject, as a card (pass its `level`). */
export function SubjectCard({ level, subject, href, layout = subjectLayout(level?.children.length ?? 0) }: { level: ContentNode | undefined; subject: ContentNode; href: string; layout?: CardLayout }) {
	const id = `${level?.slug}/${subject.slug}`;
	const c = countByType(subject.children);
	return (
		<ObjectCard
			href={href}
			tone={toneFor(subject)}
			object={id.replace('/', '-')}
			loop={LOOPS.has(id)}
			title={<Latex content={subject.title} />}
			text={SUBJECTS[id]?.inside}
			meta={[plural(c.chapter, 'capitolo', 'capitoli'), plural(c.topic, 'lezione', 'lezioni')]}
			list={subject.children.map((chapter) => chapter.title)}
			layout={layout}
		/>
	);
}

/** A level, as a card: who it is for, what it holds, and its subjects in their colours. */
export function LevelCard({ level, href, layout }: { level: ContentNode; href: string; layout?: CardLayout }) {
	const about = LEVELS[level.slug];
	const c = countByType(level.children);
	return (
		<ObjectCard
			href={href}
			tone="ink"
			object={`level-${level.slug}`}
			loop
			eyebrow={about?.who}
			title={<Latex content={level.title} />}
			text={about?.blurb}
			chips={level.children.map((subject) => ({ tone: toneFor(subject), label: subjectShort(level, subject) }))}
			meta={[plural(c.subject, ...subjectNoun(level)), plural(c.chapter, 'capitolo', 'capitoli'), plural(c.topic, 'lezione', 'lezioni')]}
			list={level.children.map((subject) => subject.title)}
			layout={layout}
		/>
	);
}
