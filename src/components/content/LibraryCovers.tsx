import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { countByType } from '@/lib/utils/tree';
import { toneFor } from '@/lib/utils/icons';
import { plainTitle } from '@/lib/seo/slug';
import { cn } from '@/lib/utils/cn';
import { Latex } from '@/components/ui/Latex';
import { SubjectFigure } from './CoverFigures';

/*
 * The subjects of the library as textbook covers (levels are sheets, see LevelSheet).
 * Subjects are fixed (a dozen), so what they say about themselves is written here by
 * hand; a subject not listed still gets a plain cover from its title and counts.
 */

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * A subject, keyed by `level/subject`: its name where space is short, the years
 * its book covers, and what is inside, in the words of its chapters.
 */
const SUBJECTS: Record<string, { short: string; years: string; inside: string }> = {
	'middle_school/math': { short: 'Matematica', years: '1ª–3ª media', inside: 'Numeri, frazioni, geometria, Pitagora, equazioni' },
	'middle_school/technology': { short: 'Tecnologia', years: '1ª–3ª media', inside: 'Disegno tecnico, materiali, energia, programmazione' },
	'middle_school/science': { short: 'Scienze', years: '1ª–3ª media', inside: 'Materia, viventi, corpo umano, Terra e Universo' },
	'high_school/math': { short: 'Matematica', years: '1ª–5ª superiore', inside: 'Algebra, geometria, funzioni, probabilità, analisi' },
	'high_school/physics': { short: 'Fisica', years: '1ª–5ª superiore', inside: 'Moto, forze, energia, onde, elettromagnetismo' },
	'high_school/computer-science': { short: 'Informatica', years: '1ª–5ª superiore', inside: 'Algoritmi, programmazione, web, basi di dati, reti' },
	'high_school/chemistry': { short: 'Chimica', years: '1ª–5ª superiore', inside: 'Atomi, legami, reazioni, equilibri, chimica organica' },
	'university/analisi-1': { short: 'Analisi I', years: 'Università', inside: 'Successioni, limiti, derivate, integrali' },
	'university/analisi-2': { short: 'Analisi II', years: 'Università', inside: 'Integrali doppi e tripli, serie di Taylor' },
	'university/fisica-1': { short: 'Fisica I', years: 'Università', inside: 'Cinematica, dinamica, energia, corpo rigido' },
	'university/fisica-2': { short: 'Fisica II', years: 'Università', inside: 'Termodinamica, elettromagnetismo, ottica' },
	'university/fondamenti-informatica': { short: 'Informatica', years: 'Università', inside: 'Logica booleana, porte logiche, reti combinatorie e sequenziali' }
};

/** A subject's name where space is short (Analisi I for Analisi matematica I). */
export function subjectShort(level: ContentNode, subject: ContentNode): string {
	return SUBJECTS[`${level.slug}/${subject.slug}`]?.short ?? plainTitle(subject.title);
}

const ARROW = 'size-5 shrink-0 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5';

/**
 * A subject, as the front of its textbook: the subject's colour over squared
 * paper, a chalk figure, the years it covers and what is inside. The pages show
 * at the edge; hovered, the cover swings open towards the reader on its spine and the pen finishes
 * the figure.
 */
export function SubjectTextbook({ level, subject, href }: { level: ContentNode | undefined; subject: ContentNode; href: string }) {
	const id = `${level?.slug}/${subject.slug}`;
	const book = SUBJECTS[id];
	const c = countByType(subject.children);
	return (
		<Link href={href} className="group relative isolate block rounded-2xl no-underline [perspective:3000px] hover:z-20 focus-ring-offset">
			{/* The block of pages under the cover: its edge shows on the right, and more of it when the cover opens. */}
			<span className="absolute inset-y-1.5 -right-1.5 left-3 -z-10 rounded-r-xl bg-surface shadow-paper ring-1 ring-edge" aria-hidden="true">
				<span className="absolute inset-y-2 right-1 w-1 bg-[repeating-linear-gradient(90deg,var(--edge)_0_1px,transparent_1px_2px)]" />
				<span className="ruled-paper absolute inset-y-4 left-6 right-4 opacity-70 [--rule:14px] [--rule-at:13px]" />
			</span>
			<div
				data-subject={toneFor(subject)}
				className="relative flex h-full min-h-64 origin-left flex-col overflow-hidden rounded-2xl rounded-l-lg bg-tint-cover p-6 pl-8 text-tint-cover-fg shadow-paper transition-[transform,box-shadow] duration-500 ease-out-soft [transform-style:preserve-3d] group-hover:shadow-lift group-hover:[transform:rotateY(-32deg)] group-active:scale-[0.99] motion-reduce:transition-none motion-reduce:group-hover:transform-none sm:min-h-72 app:max-md:min-h-52"
			>
				<span className="grid-paper absolute inset-0 -z-10 opacity-60 [--grid:color-mix(in_oklab,white_14%,transparent)]" aria-hidden="true" />
				{/* The spine and the hinge the cover turns on. */}
				<span className="absolute inset-y-0 left-0 -z-10 w-3.5 bg-black/20" aria-hidden="true" />
				<span className="absolute inset-y-0 left-5 -z-10 w-px bg-black/15" aria-hidden="true" />
				<div className="flex items-start justify-between gap-4">
					<span className="label-mono text-white/75">{book?.years ?? 'Materia'}</span>
					<ArrowUpRight className={cn(ARROW, 'text-white/70 group-hover:text-white app:max-md:hidden')} aria-hidden="true" />
				</div>
				<SubjectFigure id={id} className="pointer-events-none -mr-1 mt-1 mb-4 h-28 w-auto self-end text-white/80 sm:h-32 app:max-md:h-24" />
				<h3 className="mt-auto font-display text-4xl font-semibold leading-none tracking-tight">
					<Latex content={subject.title} />
				</h3>
				{book && <p className="mt-3 max-w-xs text-sm leading-snug text-white/85">{book.inside}</p>}
				<div className="mt-5 flex items-end justify-between gap-4 border-t border-white/20 pt-3">
					<p className="label-mono flex flex-wrap gap-x-3 gap-y-1 text-white/80">
						<span>{plural(c.chapter, 'capitolo', 'capitoli')}</span>
						<span>{plural(c.topic, 'lezione', 'lezioni')}</span>
					</p>
					{/* The publisher's mark, at the foot of the cover. */}
					<span className="font-display text-sm font-semibold italic text-white/60">Sapiens</span>
				</div>
			</div>
		</Link>
	);
}
