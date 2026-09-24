'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus } from 'lucide-react';
import { hasMath } from '@/lib/content/note-markdown';
import { splitPages } from '@/lib/zaino/pages';
import type { Paper } from '@/lib/zaino/paper';
import type { PlacedSticker } from '@/lib/zaino/stickers';
import { effectiveZoom, stepZoom, useNoteView, ZOOM_STEPS } from '@/lib/state/note-view';
import { Sheet } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { StaticPage, useKatex } from './StaticPage';

/** "⌘" on Apple devices, "Ctrl" elsewhere, for the hints next to commands. */
export function useModKey(): string {
	return useSyncExternalStore(
		() => () => {},
		() => (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl'),
		() => 'Ctrl'
	);
}

const pill = 'flex items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg focus-ring disabled:opacity-35';

/**
 * The page in view and the zoom, in the corner of the sheet: − and + step
 * through the zoom levels, the percentage goes back to fitting the window.
 * Ctrl + and Ctrl − do the same (NoteEditor).
 */
export function ZoomControls({ pages }: { pages: number }) {
	const view = useNoteView();
	const mod = useModKey();
	const coarse = useCoarsePointer();
	const size = coarse ? 'h-11 min-w-11' : 'h-8 min-w-8';
	const zoom = effectiveZoom(view);
	const fitting = view.zoom === 'fit';
	return (
		<div className="tb-tip-below pointer-events-auto flex items-center gap-0.5 rounded-xl border border-edge bg-surface/95 p-0.5 text-xs shadow-paper backdrop-blur-sm" data-dock="bottom">
			<span className="label-mono px-2 text-[11px] text-fg-subtle" aria-live="polite">
				<span className="sr-only">Pagina </span>
				{view.page + 1}
				<span aria-hidden="true"> / </span>
				<span className="sr-only"> di </span>
				{pages}
			</span>
			<span className="h-4 w-px bg-edge" aria-hidden="true" />
			<button type="button" className={cn(pill, size, 'tb-tip')} data-tip={`Riduci · ${mod} −`} aria-label="Riduci lo zoom" disabled={zoom <= ZOOM_STEPS[0]} onClick={() => view.setZoom(stepZoom(zoom, -1))}>
				<Minus className="size-3.5" aria-hidden="true" />
			</button>
			<button
				type="button"
				className={cn(pill, size, 'tb-tip min-w-14 px-1.5 font-medium tabular-nums', fitting && 'text-fg-subtle')}
				data-tip={fitting ? 'Adattato alla finestra' : `Adatta alla finestra · ${mod} 0`}
				aria-label={`Zoom ${Math.round(zoom * 100)}%. ${fitting ? 'Adattato alla finestra.' : 'Adatta alla finestra.'}`}
				onClick={() => view.setZoom(fitting ? 1 : 'fit')}
			>
				{Math.round(zoom * 100)}%
			</button>
			<button type="button" className={cn(pill, size, 'tb-tip')} data-tip={`Ingrandisci · ${mod} +`} aria-label="Aumenta lo zoom" disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]} onClick={() => view.setZoom(stepZoom(zoom, 1))}>
				<Plus className="size-3.5" aria-hidden="true" />
			</button>
		</div>
	);
}

/**
 * The copy that goes to the printer: every page at full size, drawn from the
 * markdown with its paper and stickers, one A4 each (print CSS in
 * globals.css). Mounted only while printing; `onDone` unmounts it.
 */
export function NotePrint({ markdown, stickers, paper, onDone }: { markdown: string; stickers: PlacedSticker[]; paper: Paper; onDone: () => void }) {
	const katex = useKatex(hasMath(markdown));
	const ready = !hasMath(markdown) || !!katex;
	const [host] = useState(() => {
		const el = document.createElement('div');
		el.id = 'note-print';
		return el;
	});

	useEffect(() => {
		document.body.appendChild(host);
		return () => host.remove();
	}, [host]);

	useEffect(() => {
		if (!ready) return;
		const after = () => onDone();
		window.addEventListener('afterprint', after);
		// A frame for the copy to lay out, and the fonts to arrive, before the dialog freezes it.
		let frame = 0;
		document.fonts.ready.then(() => {
			frame = requestAnimationFrame(() => window.print());
		});
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('afterprint', after);
		};
	}, [ready, onDone]);

	const pages = splitPages(markdown);
	return createPortal(
		<>
			{pages.map((text, i) => (
				<StaticPage key={i} markdown={text} stickers={stickers.filter((s) => (s.page ?? 0) === i)} paper={paper} katex={katex} />
			))}
		</>,
		host
	);
}

/** What each command is, and its keys; `mod` stands for Ctrl or ⌘. */
const SHORTCUTS: [string, string[]][] = [
	['Grassetto', ['mod', 'B']],
	['Corsivo', ['mod', 'I']],
	['Barrato', ['mod', 'Maiusc', 'S']],
	['Annulla', ['mod', 'Z']],
	['Ripristina', ['mod', 'Maiusc', 'Z']],
	['Collegamento', ['mod', 'K']],
	['Formula nel testo', ['$x^2$']],
	['Nuova pagina', ['mod', 'Invio']],
	['Lettura, e ritorno a scrivere', ['mod', 'E']],
	['Pagina prima o dopo', ['↑', '↓']],
	['Zoom', ['mod', '+', '−']],
	['Adatta alla finestra', ['mod', '0']],
	['Mostra le pagine', ['mod', 'Maiusc', 'P']],
	['Stampa o salva in PDF', ['mod', 'P']],
	['Questo elenco', ['?']]
];

export function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
	const mod = useModKey();
	return (
		<Sheet open={open} onClose={onClose} title="Scorciatoie da tastiera" size="auto" width="sm" align="center">
			<dl className="divide-y divide-edge-soft">
				{SHORTCUTS.map(([what, keys]) => (
					<div key={what} className="flex items-center justify-between gap-4 py-2.5 text-sm">
						<dt className="text-fg-muted">{what}</dt>
						<dd className="flex shrink-0 gap-1">
							{keys.map((k) => (
								<kbd key={k} className="label-mono min-w-6 rounded-md border border-edge bg-surface-2 px-1.5 py-0.5 text-center text-[11px] text-fg shadow-paper">
									{k === 'mod' ? mod : k}
								</kbd>
							))}
						</dd>
					</div>
				))}
			</dl>
		</Sheet>
	);
}
