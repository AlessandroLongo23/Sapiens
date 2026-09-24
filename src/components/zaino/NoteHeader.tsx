'use client';

import Link from 'next/link';
import { ArrowLeft, FolderInput, GraduationCap, Hash, Type } from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NotebookRow } from '@/lib/zaino/config';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { useNoteEditor, type EditorMode } from '@/lib/state/note-editor';
import { SaveStatus } from './SaveStatus';

/**
 * The editor's own chrome: back to the quaderno, the title, the mode and the
 * save state. The title is an input that does not look like one — a note's
 * title is read far more often than it is changed, so it reads as a heading
 * and only shows its edges when pointed at or focused.
 */
export function NoteHeader({
	notebookId,
	notebookTitle,
	notebooks,
	lesson,
	onModeChange,
	onMove
}: {
	notebookId: string;
	notebookTitle: string;
	notebooks: NotebookRow[];
	lesson: { path: string; title: string } | null;
	onModeChange: (mode: EditorMode) => void;
	onMove: () => void;
}) {
	const { title, mode, setTitle } = useNoteEditor();
	return (
		<header className="shrink-0 border-b border-edge bg-surface/90 pt-safe backdrop-blur-sm">
			<div className="mx-auto flex max-w-3xl items-center gap-1.5 px-2 py-2 sm:gap-3 sm:px-4">
				<Link
					href={`${ZAINO_ROOT}/${notebookId}`}
					aria-label={`Torna a ${notebookTitle}`}
					title={notebookTitle}
					className="flex size-11 shrink-0 items-center justify-center rounded-full text-fg-subtle transition duration-150 hover:bg-surface-3 hover:text-fg active:scale-95 focus-ring"
				>
					<ArrowLeft className="size-5" aria-hidden="true" />
				</Link>

				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					{/* Renaming is the title field; there is no separate dialog for it. */}
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						maxLength={120}
						aria-label="Titolo della nota"
						placeholder="Titolo della nota"
						className="w-full truncate rounded-lg border-0 bg-transparent px-2 py-1 text-lg font-semibold leading-tight text-fg-strong outline-none ring-0 transition-colors duration-150 placeholder:font-normal placeholder:text-fg-faint hover:bg-surface-3 focus:bg-surface-3 focus:ring-2 focus:ring-crimson-500/30 sm:text-xl"
					/>
					<div className="flex min-w-0 items-center gap-2 px-2">
						<SaveStatus />
						{lesson && (
							<>
								<span className="text-fg-faint" aria-hidden="true">
									·
								</span>
								{/* Back to where the note was taken. */}
								<Link
									href={lesson.path}
									className="inline-flex min-w-0 items-center gap-1 rounded text-xs text-fg-subtle transition-colors hover:text-accent-fg focus-ring"
								>
									<GraduationCap className="size-3.5 shrink-0" aria-hidden="true" />
									<span className="truncate">{lesson.title}</span>
								</Link>
							</>
						)}
					</div>
				</div>

				{notebooks.length > 1 && (
					<button
						type="button"
						onClick={onMove}
						aria-label={`Sposta la nota. Ora in ${notebookTitle}.`}
						title={`In ${notebookTitle}`}
						className="hidden size-11 shrink-0 items-center justify-center rounded-full text-fg-subtle transition duration-150 hover:bg-surface-3 hover:text-fg active:scale-95 focus-ring sm:flex"
					>
						<FolderInput className="size-5" aria-hidden="true" />
					</button>
				)}

				<div className="shrink-0">
					<ToggleGroup
						label="Modalità di scrittura"
						value={mode}
						onChange={onModeChange}
						labelClass="hidden sm:inline"
						options={[
							{ value: 'simple', label: 'Semplice', icon: Type },
							{ value: 'advanced', label: 'Avanzata', icon: Hash }
						]}
					/>
				</div>
			</div>
		</header>
	);
}
