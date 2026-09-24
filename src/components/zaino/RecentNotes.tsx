import Link from 'next/link';
import { Clock } from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NoteHit, NotebookColor } from '@/lib/zaino/config';
import { cn } from '@/lib/utils/cn';

const SPINE: Record<NotebookColor, string> = {
	zinc: 'bg-zinc-400 dark:bg-zinc-500',
	crimson: 'bg-crimson-500',
	amber: 'bg-amber-500',
	teal: 'bg-teal-500',
	sky: 'bg-sky-500',
	indigo: 'bg-indigo-500'
};

const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

/**
 * The last notes touched, above the shelf. A student coming back is far more
 * likely to want the note they were writing than the quaderno it lives in.
 */
export function RecentNotes({ notes }: { notes: NoteHit[] }) {
	if (notes.length === 0) return null;
	return (
		<section aria-labelledby="recenti" className="space-y-3">
			<h2 id="recenti" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
				<Clock className="size-4" aria-hidden="true" />
				Riprendi da dove eri
			</h2>
			<ul className="scroll-x no-scrollbar -mx-4 flex gap-3 px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
				{notes.map((note) => (
					<li key={note.id} className="w-56 shrink-0 sm:w-auto">
						<Link
							href={`${ZAINO_ROOT}/nota/${note.id}`}
							className="flex h-full flex-col gap-1.5 rounded-xl border border-edge bg-surface p-3.5 no-underline shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-edge hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-ring-offset"
						>
							<span className="flex items-center gap-2">
								<span className={cn('h-3 w-1 shrink-0 rounded-full', SPINE[note.notebook_color])} aria-hidden="true" />
								<span className="truncate text-xs text-fg-subtle">{note.notebook_title}</span>
							</span>
							<span className="truncate font-semibold leading-tight text-fg-strong">{note.title}</span>
							<span className="line-clamp-2 text-xs leading-relaxed text-fg-muted">{note.excerpt || 'Nota vuota'}</span>
							<span className="mt-auto pt-1 text-xs text-fg-faint">{when.format(new Date(note.updated_at))}</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
