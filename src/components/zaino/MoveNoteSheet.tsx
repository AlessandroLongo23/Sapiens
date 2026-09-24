'use client';

import { Check, FolderInput } from 'lucide-react';
import type { NotebookColor, NotebookRow } from '@/lib/zaino/config';
import { Sheet } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';

const SPINE: Record<NotebookColor, string> = {
	zinc: 'bg-zinc-400 dark:bg-zinc-500',
	crimson: 'bg-crimson-500',
	amber: 'bg-amber-500',
	teal: 'bg-teal-500',
	sky: 'bg-sky-500',
	indigo: 'bg-indigo-500'
};

/**
 * Where a note goes. The note's URL does not contain its quaderno (see the flat
 * /zaino/nota/[id] route), so a move changes nothing the student is looking at.
 */
export function MoveNoteSheet({
	open,
	notebooks,
	currentId,
	busy,
	onMove,
	onClose
}: {
	open: boolean;
	notebooks: NotebookRow[];
	currentId: string;
	busy: boolean;
	onMove: (notebookId: string) => void;
	onClose: () => void;
}) {
	return (
		<Sheet open={open} onClose={onClose} title="Sposta la nota" size="auto">
			{notebooks.length <= 1 ? (
				<p className="px-4 pb-4 text-sm text-fg-muted">
					Hai un solo quaderno. Creane un altro dallo Zaino per poter spostare le note.
				</p>
			) : (
				<ul className="px-2 pb-2">
					{notebooks.map((notebook) => {
						const here = notebook.id === currentId;
						return (
							<li key={notebook.id}>
								<button
									type="button"
									disabled={here || busy}
									onClick={() => onMove(notebook.id)}
									className={cn(
										'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150 focus-ring',
										here ? 'cursor-default text-fg-muted' : 'hover:bg-surface-3 active:bg-surface-3'
									)}
								>
									<span className={cn('h-7 w-1.5 shrink-0 rounded-full', SPINE[notebook.color])} aria-hidden="true" />
									<span className="min-w-0 flex-1 truncate font-medium text-fg">{notebook.title}</span>
									{here ? (
										<>
											<Check className="size-4 shrink-0 text-accent-fg" aria-hidden="true" />
											<span className="sr-only">quaderno attuale</span>
										</>
									) : (
										<FolderInput className="size-4 shrink-0 text-fg-faint" aria-hidden="true" />
									)}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</Sheet>
	);
}
