import { NotebookPen } from 'lucide-react';
import type { CSSProperties } from 'react';
import './zaino.css';

const LABEL_TILTS = [-1.6, 1.1, -0.7, 1.5, -1.2];
const when = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' });

/** How many sheets show at the edge of a quaderno: more as it fills up. */
const fill = (notes: number) => (notes === 0 ? 0 : notes <= 2 ? 1 : notes <= 6 ? 2 : 3);

/**
 * The front of a quaderno, drawn inside an element with `zn-notebook` and `data-notebook`: the cover in the colour
 * the student chose, the spiral, the label with its number and the name in pen, the pages at the edge as it fills
 * up. `index` is its place on the shelf, from 0.
 */
export function NotebookCover({ title, index, notes, updated }: { title: string; index: number; notes: number; updated: string | null }) {
	return (
		<>
			<span className="zn-block" data-fill={fill(notes)} aria-hidden="true" />
			<span className="zn-cover" aria-hidden="true" />
			<span className="zn-holes" aria-hidden="true" />
			<span className="zn-spiral" aria-hidden="true" />
			<span className="relative z-[2] flex h-full flex-col px-3 pb-3 pl-5 pt-[22%] sm:px-4 sm:pb-4 sm:pl-6">
				<span className="zn-label block px-2.5 pb-2 pt-1.5 sm:px-3" style={{ '--label-tilt': `${LABEL_TILTS[index % LABEL_TILTS.length]}deg` } as CSSProperties}>
					<span className="label-mono block text-[0.6rem] text-tint-fg">Nº {String(index + 1).padStart(2, '0')}</span>
					<span className="zn-pen line-clamp-2 block text-[1.55rem] leading-7 [overflow-wrap:anywhere] sm:text-[1.7rem]">{title}</span>
				</span>
				<span className="mt-auto flex items-end gap-2">
					<span className="flex min-w-0 flex-col gap-0.5">
						<span className="label-mono inline-flex items-center gap-1.5 text-white/85">
							<NotebookPen className="size-3.5 shrink-0" aria-hidden="true" />
							{notes === 0 ? 'Vuoto' : notes === 1 ? '1 nota' : `${notes} note`}
						</span>
						{updated && <span className="truncate font-mono text-[0.625rem] text-white/60">scritto il {when.format(new Date(updated))}</span>}
					</span>
				</span>
			</span>
		</>
	);
}
