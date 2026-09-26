import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { cn } from '@/lib/utils/cn';
import { Latex } from '@/components/ui/Latex';
import { PenStroke } from './PageHeader';
import { ProgressMeta, type RowProgress } from './ProgressMeta';
import { SubjectTextbook, subjectShort } from './LibraryCovers';
import { LevelSheet } from './LevelSheet';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * A chapter or a lesson, as a line in a table of contents: its number, the
 * title, what it holds, an arrow. A lesson not written yet stays a link (the
 * page says it is coming) but reads as pencil, not ink.
 */
function Row({ node, href, index, progress }: { node: ContentNode; href: string; index: number; progress?: RowProgress }) {
	// A chapter is pencil too while none of its lessons is written.
	const ready = node.type === 'chapter' ? node.children.some((lesson) => lesson.has_theory !== false) : node.has_theory !== false;
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
				{(() => {
					const label = <span className={cn('label-mono shrink-0', ready ? 'text-fg-subtle' : 'italic text-fg-faint', ready && node.type !== 'chapter' && 'app:max-md:hidden')}>{meta}</span>;
					// The student's progress replaces the label once known; unlike "Vai alla lezione", it shows in the app too.
					return progress && ready ? <ProgressMeta progress={progress} fallback={label} /> : label;
				})()}
				<ArrowRight className="size-4 shrink-0 self-center text-fg-faint transition-[transform,color] duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-tint-fg" aria-hidden="true" />
			</Link>
		</li>
	);
}

/**
 * A level, subject, chapter or lesson on an index page: a level is a sheet, a subject a textbook (pass its `level`),
 * chapters and lessons are numbered rows (render those inside a list). `progress` names what the row can show the student's progress for.
 */
export function NodeCard({ node, href, index = 0, progress, level }: { node: ContentNode; href: string; index?: number; progress?: RowProgress; level?: ContentNode }) {
	if (node.type === 'level') return <LevelSheet level={node} href={href} index={index} short={(subject) => subjectShort(node, subject)} />;
	if (node.type === 'subject') return <SubjectTextbook level={level} subject={node} href={href} />;
	return <Row node={node} href={href} index={index} progress={progress} />;
}
