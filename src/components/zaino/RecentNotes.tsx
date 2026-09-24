import Link from 'next/link';
import { Clock } from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NoteHit } from '@/lib/zaino/config';

const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

/**
 * The last notes touched, above the shelf. A student coming back is far more
 * likely to want the note they were writing than the quaderno it lives in.
 */
export function RecentNotes({ notes }: { notes: NoteHit[] }) {
	if (notes.length === 0) return null;
	return (
		<section aria-labelledby="recenti" className="space-y-3">
			<h2 id="recenti" className="label-mono flex items-center gap-2 text-fg-subtle">
				<Clock className="size-3.5" aria-hidden="true" />
				Riprendi da dove eri
			</h2>
			<ul className="scroll-x no-scrollbar -mx-4 flex gap-3 px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
				{notes.map((note) => (
					<li key={note.id} className="w-56 shrink-0 sm:w-auto">
						<Link
							href={`${ZAINO_ROOT}/nota/${note.id}`}
							data-notebook={note.notebook_color}
							className="relative flex h-full flex-col gap-1.5 overflow-hidden rounded-xl border border-edge bg-surface p-3.5 pl-5 no-underline shadow-paper transition duration-200 ease-out hover:-translate-y-0.5 hover:border-edge-strong hover:shadow-lift active:translate-y-0 active:scale-[0.99] focus-ring-offset"
						>
							{/* The quaderno's spine down the left edge of the page. */}
							<span className="absolute inset-y-0 left-0 w-1.5 bg-tint" aria-hidden="true" />
							<span className="label-mono truncate text-tint-fg">{note.notebook_title}</span>
							<span className="truncate font-display text-lg font-medium leading-tight tracking-tight text-fg-strong">{note.title}</span>
							<span className="line-clamp-2 text-xs leading-relaxed text-fg-muted">{note.excerpt || 'Nota vuota'}</span>
							<span className="mt-auto pt-1 font-mono text-[0.6875rem] text-fg-faint">{when.format(new Date(note.updated_at))}</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
