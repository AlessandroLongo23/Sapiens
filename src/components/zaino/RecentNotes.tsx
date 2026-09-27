import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NoteHit } from '@/lib/zaino/config';
import './zaino.css';

const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

const TILTS = [-1.4, 0.9, -0.6, 1.3];
const TAPE_TILTS = [-4, 3, -2, 5];

/**
 * The last notes touched, above the shelf, as sheets torn out of their quaderni and taped on top of the backpack:
 * a student coming back is far more likely to want the note they were writing than the quaderno it lives in. The
 * tape is the colour of the quaderno the sheet came from.
 */
export function RecentNotes({ notes }: { notes: NoteHit[] }) {
	if (notes.length === 0) return null;
	return (
		<section aria-labelledby="recenti" className="space-y-4">
			<h2 id="recenti" className="label-mono flex items-center gap-2 text-fg-subtle">
				<Clock className="size-3.5" aria-hidden="true" />
				Riprendi da dove eri
			</h2>
			<ul className="-mx-4 flex gap-5 px-4 pb-4 pt-3 max-sm:scroll-x max-sm:no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:px-1 lg:grid-cols-4">
				{notes.map((note, i) => (
					<li key={note.id} className="note-in w-60 shrink-0 sm:w-auto" style={{ '--i': i } as CSSProperties}>
						<Link
							href={`${ZAINO_ROOT}/nota/${note.id}`}
							data-notebook={note.notebook_color}
							className="zn-sheet-wrap rounded no-underline focus-ring-offset"
							style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, '--tape-tilt': `${TAPE_TILTS[i % TAPE_TILTS.length]}deg` } as CSSProperties}
						>
							<span className="zn-tape" aria-hidden="true" />
							<span className="zn-sheet min-h-44 gap-1.5 px-4 pb-4 pt-6">
								<span className="label-mono truncate text-tint-fg">{note.notebook_title}</span>
								<span className="line-clamp-2 font-display text-xl font-medium leading-tight tracking-tight text-fg-strong">{note.title}</span>
								<span className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{note.excerpt || 'Nota vuota'}</span>
								<span className="mt-auto pr-5 pt-2 font-mono text-[0.6875rem] text-fg-faint">{when.format(new Date(note.updated_at))}</span>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
