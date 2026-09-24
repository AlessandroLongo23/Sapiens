import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { countByType } from '@/lib/utils/tree';
import { toneFor } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';
import { NodeIcon } from '@/components/ui/NodeIcon';
import { Latex } from '@/components/ui/Latex';
import { PenStroke } from './PageHeader';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The counts line of a level or subject cover. */
function counts(node: ContentNode): string[] {
	const c = countByType(node.children);
	const parts = node.type === 'level' ? [plural(c.subject, 'materia', 'materie'), plural(c.chapter, 'capitolo', 'capitoli')] : [plural(c.chapter, 'capitolo', 'capitoli')];
	return [...parts, plural(c.topic, 'lezione', 'lezioni')];
}

/**
 * A level or a subject, as the cover of a textbook: a block of the subject's
 * colour over squared paper, its icon drawn large and cropped by the edge.
 */
function Cover({ node, href }: { node: ContentNode; href: string }) {
	return (
		<Link
			href={href}
			data-subject={toneFor(node)}
			className="group relative isolate flex min-h-44 flex-col overflow-hidden rounded-2xl bg-tint-cover p-6 text-tint-cover-fg no-underline shadow-paper transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift focus-ring-offset active:scale-[0.98] sm:min-h-64 app:max-md:min-h-36"
		>
			<span className="grid-paper absolute inset-0 -z-10 opacity-60 [--grid:color-mix(in_oklab,white_14%,transparent)]" aria-hidden="true" />
			{/* The spine: a darker band down the left edge, as on a bound book. */}
			<span className="absolute inset-y-0 left-0 -z-10 w-3 bg-black/15" aria-hidden="true" />
			<NodeIcon node={node} strokeWidth={1.1} className="absolute -bottom-8 -right-6 -z-10 size-48 text-white/15 transition-transform duration-500 ease-out-soft group-hover:-rotate-6 group-hover:scale-105" aria-hidden="true" />
			<div className="flex items-start justify-between gap-4 pl-2">
				<span className="label-mono text-white/75">{node.type === 'level' ? 'Livello' : 'Materia'}</span>
				<ArrowUpRight className="size-5 text-white/70 app:max-md:hidden transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
			</div>
			<h3 className="mt-auto pl-2 font-display text-4xl font-semibold leading-none tracking-tight">
				<Latex content={node.title} />
			</h3>
			<p className="label-mono mt-4 flex flex-wrap gap-x-3 gap-y-1 pl-2 text-white/80">
				{counts(node).map((part) => (
					<span key={part}>{part}</span>
				))}
			</p>
		</Link>
	);
}

/**
 * A chapter or a lesson, as a line in a table of contents: its number, the
 * title, what it holds, an arrow. A lesson not written yet stays a link (the
 * page says it is coming) but reads as pencil, not ink.
 */
function Row({ node, href, index }: { node: ContentNode; href: string; index: number }) {
	const ready = node.type === 'chapter' ? node.children.length > 0 : node.has_theory !== false;
	const meta = node.type === 'chapter' ? (ready ? plural(node.children.length, 'lezione', 'lezioni') : 'In arrivo') : ready ? 'Vai alla lezione' : 'In arrivo';
	return (
		<li className="border-b border-edge">
			<Link href={href} className="group -mx-3 flex items-baseline gap-4 rounded-xl px-3 py-4 no-underline focus-ring sm:gap-5 sm:py-5">
				<span className={cn('w-7 shrink-0 font-mono text-sm tabular-nums', ready ? 'text-tint-fg' : 'text-fg-faint')}>{String(index + 1).padStart(2, '0')}</span>
				<span className={cn('min-w-0 flex-1 font-display text-xl font-medium leading-snug tracking-tight sm:text-2xl', ready ? 'text-fg-strong' : 'text-fg-subtle')}>
					{/* Hovered, the title gets the pen stroke the page title has: red ink for a lesson, pencil for one still to come. */}
					<span className="relative inline-block max-w-full">
						<Latex content={node.title} />
						<PenStroke onHover className={cn('absolute inset-x-0 -bottom-1.5 h-2', !ready && 'text-fg-faint')} />
					</span>
				</span>
				{/* "Vai alla lezione" says what a tap does anyway; in the app on a phone the row and its arrow say it. */}
				<span className={cn('label-mono shrink-0', ready ? 'text-fg-subtle' : 'italic text-fg-faint', ready && node.type !== 'chapter' && 'app:max-md:hidden')}>{meta}</span>
				<ArrowRight className="size-4 shrink-0 self-center text-fg-faint transition-[transform,color] duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-tint-fg" aria-hidden="true" />
			</Link>
		</li>
	);
}

/** A level, subject, chapter or lesson on an index page: levels and subjects are covers, chapters and lessons are numbered rows (render those inside a list). */
export function NodeCard({ node, href, index = 0 }: { node: ContentNode; href: string; index?: number }) {
	return node.type === 'level' || node.type === 'subject' ? <Cover node={node} href={href} /> : <Row node={node} href={href} index={index} />;
}
