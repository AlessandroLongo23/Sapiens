'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	ArrowLeft,
	FolderInput,
	GraduationCap,
	Hash,
	Keyboard,
	MoreHorizontal,
	PanelBottom,
	BookOpen,
	ListTree,
	PanelLeft,
	PanelRight,
	PanelRightClose,
	PanelRightOpen,
	Printer,
	SwatchBook,
	Type
} from 'lucide-react';
import { ZAINO_ROOT } from '@/lib/config/site';
import type { NotebookRow } from '@/lib/zaino/config';
import type { Paper } from '@/lib/zaino/paper';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Sheet } from '@/components/ui/Sheet';
import { useLg, useMd } from '@/lib/hooks/use-media';
import { useNoteEditor, type EditorMode } from '@/lib/state/note-editor';
import { useNoteView, type ToolbarDock } from '@/lib/state/note-view';
import { cn } from '@/lib/utils/cn';
import { SaveStatus } from './SaveStatus';
import { useModKey } from './NoteViewControls';
import { MenuItem, MenuSeparator, Popover } from './Popover';
import { PaperPanel } from './PaperPanel';

const iconButton =
	'flex size-10 shrink-0 items-center justify-center rounded-xl text-fg-subtle transition duration-150 hover:bg-surface-3 hover:text-fg active:scale-95 focus-ring';

/**
 * The editor's only bar, one row: back to the quaderno, the outline (whose
 * panel opens on the left), the title with the quaderno before it and the save
 * state after it, then the mode (Semplice, Avanzata, Lettura), the paper, the
 * pages (whose panel opens on the right) and a menu with the rest. The site header is not shown above it (see
 * Shell), so the sheet gets the height. The title is an input that reads as a
 * heading and shows its edges only when pointed at or focused.
 */
export function NoteHeader({
	notebookId,
	notebookTitle,
	notebooks,
	lesson,
	paper,
	pages,
	words,
	onPaperChange,
	onModeChange,
	onMove,
	onPrint,
	onShortcuts
}: {
	notebookId: string;
	notebookTitle: string;
	notebooks: NotebookRow[];
	lesson: { path: string; title: string } | null;
	paper: Paper;
	pages: number;
	words: number;
	onPaperChange: (paper: Paper) => void;
	onModeChange: (mode: EditorMode) => void;
	onMove: () => void;
	onPrint: () => void;
	onShortcuts: () => void;
}) {
	const { title, mode, setTitle } = useNoteEditor();
	const { pagesOpen, setPagesOpen, outlineOpen, setOutlineOpen, dock, setDock } = useNoteView();
	const md = useMd();
	const lg = useLg();
	const mod = useModKey();
	const [open, setOpen] = useState<'menu' | 'paper' | null>(null);
	const close = () => setOpen(null);

	const PagesIcon = pagesOpen ? PanelRightClose : PanelRightOpen;
	const modes: { value: EditorMode; label: string; icon: typeof Type }[] = [
		{ value: 'simple', label: 'Semplice', icon: Type },
		{ value: 'advanced', label: 'Avanzata', icon: Hash },
		{ value: 'reading', label: 'Lettura', icon: BookOpen }
	];
	const menuItems = (
		<>
			{!md && (
				<>
					<div role="group" aria-label="Modalità">
						<p aria-hidden="true" className="label-mono px-3 pb-1 pt-1.5 text-[11px] text-fg-subtle">Modalità</p>
						<div className="grid grid-cols-3 gap-1 px-1 pb-1">
							{modes.map(({ value, label, icon: Icon }) => (
								<button
									key={value}
									type="button"
									role="menuitemradio"
									aria-checked={mode === value}
									onClick={() => {
										close();
										onModeChange(value);
									}}
									className={cn(
										'flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
										mode === value ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg-muted hover:bg-surface-3'
									)}
								>
									<Icon className="size-4" aria-hidden="true" />
									{label}
								</button>
							))}
						</div>
					</div>
					{mode !== 'reading' && (
						<MenuItem icon={SwatchBook} onSelect={() => setOpen('paper')}>
							Carta
						</MenuItem>
					)}
					<MenuSeparator />
				</>
			)}
			{lesson && (
				<Link
					href={lesson.path}
					role="menuitem"
					className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-fg hover:bg-surface-3 focus-visible:bg-surface-3 focus-visible:outline-none"
				>
					<GraduationCap className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
					<span className="min-w-0 flex-1 truncate">Torna alla lezione</span>
				</Link>
			)}
			<MenuItem icon={FolderInput} disabled={notebooks.length <= 1} onSelect={() => { close(); onMove(); }}>
				Sposta in un altro quaderno
			</MenuItem>
			<MenuItem icon={Printer} hint={md ? `${mod} P` : undefined} onSelect={() => { close(); onPrint(); }}>
				Stampa o salva in PDF
			</MenuItem>
			{md && (
				<>
					<MenuSeparator />
					<div role="group" aria-label="Posizione della barra degli strumenti">
					<p aria-hidden="true" className="label-mono px-3 pb-1 pt-1.5 text-[11px] text-fg-subtle">Barra degli strumenti</p>
					<div className="grid grid-cols-3 gap-1 px-1 pb-1">
						{(
							[
								['left', 'Sinistra', PanelLeft],
								['bottom', 'In basso', PanelBottom],
								['right', 'Destra', PanelRight]
							] as [ToolbarDock, string, typeof PanelLeft][]
						).map(([value, label, Icon]) => (
							<button
								key={value}
								type="button"
								role="menuitemradio"
								aria-checked={dock === value}
								onClick={() => setDock(value)}
								className={cn(
									'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
									dock === value ? 'bg-accent-soft text-accent-soft-fg' : 'text-fg-muted hover:bg-surface-3'
								)}
							>
								<Icon className="size-4" aria-hidden="true" />
								{label}
							</button>
						))}
					</div>
					</div>
					<MenuItem icon={Keyboard} hint="?" onSelect={() => { close(); onShortcuts(); }}>
						Scorciatoie da tastiera
					</MenuItem>
				</>
			)}
			<MenuSeparator />
			<p role="none" className="label-mono px-3 pb-1.5 pt-1 text-[11px] text-fg-subtle">
				{words === 1 ? '1 parola' : `${words.toLocaleString('it-IT')} parole`} · {pages === 1 ? '1 pagina' : `${pages} pagine`}
			</p>
		</>
	);

	return (
		<header className="relative z-40 shrink-0 border-b border-edge bg-surface pt-safe">
			<div className="flex h-14 items-center gap-1 px-2 sm:gap-1.5 sm:px-3">
				<Link href={`${ZAINO_ROOT}/${notebookId}`} aria-label={`Torna a ${notebookTitle}`} title={`Torna a ${notebookTitle}`} className={iconButton}>
					<ArrowLeft className="size-5" aria-hidden="true" />
				</Link>
				<button
					type="button"
					onClick={() => {
						// Below lg there is room beside the sheet for one column, not two.
						if (!outlineOpen && !lg) setPagesOpen(false);
						setOutlineOpen(!outlineOpen);
					}}
					aria-pressed={outlineOpen}
					aria-label={outlineOpen ? 'Nascondi l’indice' : 'Mostra l’indice'}
					title={outlineOpen ? 'Nascondi l’indice' : 'Indice dei titoli'}
					className={cn(iconButton, outlineOpen && 'bg-surface-3 text-fg')}
				>
					<ListTree className="size-5" aria-hidden="true" />
				</button>

				<div className="flex min-w-0 flex-1 items-center gap-1 pl-1">
					<Link
						href={`${ZAINO_ROOT}/${notebookId}`}
						className="hidden max-w-44 shrink-0 truncate rounded-md px-1 text-sm text-fg-subtle transition-colors hover:text-fg focus-ring lg:block"
					>
						{notebookTitle}
					</Link>
					<span className="hidden text-fg-faint lg:block" aria-hidden="true">
						/
					</span>
					{/* Renaming is the title field; there is no separate dialog for it. */}
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						maxLength={120}
						aria-label="Titolo della nota"
						placeholder="Titolo della nota"
						className="min-w-0 max-w-full shrink truncate rounded-lg border-0 bg-transparent px-2 py-1 font-display text-lg font-semibold leading-tight tracking-tight text-fg-strong outline-none ring-0 transition-colors duration-150 [field-sizing:content] placeholder:font-normal placeholder:text-fg-faint hover:bg-surface-3 focus:bg-surface-3 focus:ring-2 focus:ring-accent/30 sm:text-xl"
					/>
					<SaveStatus compact />
				</div>

				{md && lesson && (
					<Link href={lesson.path} title={`Torna alla lezione: ${lesson.title}`} className={cn(iconButton, 'hidden xl:flex xl:w-auto xl:max-w-56 xl:gap-1.5 xl:px-2.5 xl:text-sm')}>
						<GraduationCap className="size-[18px] shrink-0" aria-hidden="true" />
						<span className="truncate">{lesson.title}</span>
					</Link>
				)}

				{md && (
					<div className="shrink-0">
						<ToggleGroup
							label="Modalità di scrittura"
							value={mode}
							onChange={onModeChange}
							labelClass="hidden lg:inline"
							compact
							options={modes}
						/>
					</div>
				)}

				{/* Reading changes nothing, the paper included. */}
				{md && mode !== 'reading' && (
					<div className="relative shrink-0">
						<button
							type="button"
							onClick={() => setOpen(open === 'paper' ? null : 'paper')}
							aria-haspopup="dialog"
							aria-expanded={open === 'paper'}
							aria-label="Carta"
							title="Carta: foglio, colore e dimensioni"
							className={cn(iconButton, 'w-auto gap-1.5 px-2.5 text-sm font-medium text-fg-muted', open === 'paper' && 'bg-surface-3 text-fg')}
						>
							<SwatchBook className="size-[18px]" aria-hidden="true" />
							<span className="hidden lg:inline">Carta</span>
						</button>
						<Popover open={open === 'paper'} onClose={close} label="Carta">
							<PaperPanel paper={paper} onChange={onPaperChange} />
						</Popover>
					</div>
				)}

				<button
					type="button"
					onClick={() => {
						if (!pagesOpen && !lg) setOutlineOpen(false);
						setPagesOpen(!pagesOpen);
					}}
					aria-pressed={pagesOpen}
					aria-label={pagesOpen ? 'Nascondi le pagine' : 'Mostra le pagine'}
					title={pagesOpen ? 'Nascondi le pagine' : 'Pagine'}
					className={cn(iconButton, pagesOpen && 'bg-surface-3 text-fg')}
				>
					<PagesIcon className="size-5" aria-hidden="true" />
				</button>

				<div className="relative shrink-0">
					<button
						type="button"
						onClick={() => setOpen(open === 'menu' ? null : 'menu')}
						aria-haspopup="menu"
						aria-expanded={open === 'menu'}
						aria-label="Altre azioni"
						title="Altre azioni"
						className={cn(iconButton, open === 'menu' && 'bg-surface-3 text-fg')}
					>
						<MoreHorizontal className="size-5" aria-hidden="true" />
					</button>
					{md && (
						<Popover open={open === 'menu'} onClose={close} label="Altre azioni" role="menu" className="w-72">
							{menuItems}
						</Popover>
					)}
				</div>
			</div>

			{!md && (
				<>
					<Sheet open={open === 'menu'} onClose={close} title="Nota" size="auto">
						<div role="menu" aria-label="Altre azioni" className="-mx-3">
							{menuItems}
						</div>
					</Sheet>
					<Sheet open={open === 'paper'} onClose={close} title="Carta" size="auto">
						<PaperPanel paper={paper} onChange={onPaperChange} />
					</Sheet>
				</>
			)}
		</header>
	);
}
