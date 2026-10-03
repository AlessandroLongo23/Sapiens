'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { ChartSpline, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { HOME, decodeState, stateOf, type PlotState } from '@/lib/grafico/documento';
import type { PlotBlockAttrs } from '@/lib/zaino/plot-block';
import { Modal } from '@/components/ui/Modal';

// The plotter arrives when a note has a graph, not with every note.
const Plotter = dynamic(() => import('@/components/grafico/Plotter').then((m) => m.Plotter), { ssr: false });

/** What an empty block opens on: a plane with one row to write in. */
const blank = (): PlotState => stateOf([''], { camera: HOME });
const stateFrom = (code: string): PlotState => (code && decodeState(code)) || blank();

/** Set by the command that adds a block: the block it adds opens at once, ready to write in. */
export const plotBlockIntent = { open: false };

/**
 * A graph in a note, as the Simple editor shows it: the plane of the graph, to look at and to move, and "Modifica",
 * which opens the whole plotter over the note. What is done there comes back into the block with "Fatto". The
 * plotter's own "I miei grafici" loads a saved graph into the block and saves the block's graph.
 */
export function PlotBlockView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
	const attrs = node.attrs as PlotBlockAttrs;
	const [open, setOpen] = useState(() => {
		const now = plotBlockIntent.open && !attrs.code;
		plotBlockIntent.open = false;
		return now;
	});
	// What the plotter holds while it is open: written into the note when it closes.
	const draft = useRef<PlotBlockAttrs>(attrs);
		// The editor makes the whole block draggable, and a drag begun on the plane would carry the block away as a
	// picture. The block is draggable only while its heading is held: anywhere else a drag is the plane's.
	const wrapper = useRef<HTMLDivElement>(null);
	const shell = () => wrapper.current?.closest<HTMLElement>('[draggable]') ?? wrapper.current?.parentElement ?? null;
	const hold = (on: boolean) => {
		const el = shell();
		if (el) el.draggable = on;
	};
	useEffect(() => {
		hold(false);
		const release = () => hold(false);
		window.addEventListener('pointerup', release);
		window.addEventListener('dragend', release);
		return () => {
			window.removeEventListener('pointerup', release);
			window.removeEventListener('dragend', release);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const edit = () => {
		draft.current = attrs;
		setOpen(true);
	};
	const done = () => {
		const { code, from, name } = draft.current;
		if (code !== attrs.code || from !== attrs.from || name !== attrs.name) updateAttributes({ code, from, name });
		setOpen(false);
	};

	return (
		<NodeViewWrapper ref={wrapper} data-type="plot-block" contentEditable={false} className={`note-plot my-4 overflow-hidden rounded-2xl border bg-surface ${selected ? 'border-accent' : 'border-edge'}`}>
			<div className="flex items-center gap-2 border-b border-edge-soft px-3 py-1.5 text-xs font-medium text-fg-subtle">
				{/* the block is taken by its heading: the plane under it is for moving the graph */}
				<div data-drag-handle onPointerDown={() => hold(true)} title="Trascina per spostare il grafico nella nota" className="-ml-1.5 flex min-w-0 flex-1 cursor-grab items-center gap-2 self-stretch rounded-lg pl-0.5 hover:bg-surface-2 active:cursor-grabbing">
					<GripVertical className="size-4 shrink-0 text-fg-faint" aria-hidden="true" />
					<ChartSpline className="size-3.5 shrink-0" aria-hidden="true" />
					<span className="min-w-0 flex-1 truncate">{attrs.name ?? 'Grafico'}</span>
				</div>
				<button type="button" onClick={edit} className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-fg-strong hover:bg-surface-3 focus-ring">
					<Pencil className="size-3.5" aria-hidden="true" />
					Modifica
				</button>
				<button type="button" onClick={deleteNode} aria-label="Togli il grafico dalla nota" title="Togli il grafico" className="flex size-8 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg-strong focus-ring">
					<Trash2 className="size-4" aria-hidden="true" />
				</button>
			</div>
			{attrs.code ? (
				<div className="h-80" onDragStart={(e) => e.preventDefault()}>
					{/* a new plotter for a new graph: it reads its state once */}
					<Plotter key={attrs.code} view initial={stateFrom(attrs.code)} read={[]} />
				</div>
			) : (
				<button type="button" onClick={edit} className="flex h-40 w-full flex-col items-center justify-center gap-1 text-sm text-fg-muted hover:bg-surface-2 focus-ring">
					<span className="font-medium text-fg-strong">Grafico vuoto</span>
					Apri per scrivere una funzione, o per caricare uno dei tuoi grafici.
				</button>
			)}

			<Modal open={open} onClose={done} className="sm:w-[min(96vw,84rem)]">
				<div role="dialog" aria-modal="true" aria-label="Modifica il grafico" className="flex flex-col gap-2 rounded-t-2xl bg-surface p-2 sm:rounded-2xl sm:p-3">
					<div className="flex items-center gap-2 px-1">
						<p className="m-0 min-w-0 flex-1 truncate text-sm text-fg-muted">Il grafico resta nella nota. Con “I miei grafici” lo salvi per ritrovarlo, o ne carichi uno.</p>
						<button type="button" onClick={done} className="h-9 rounded-lg bg-accent px-4 text-sm font-medium text-white hover:opacity-90 focus-ring">
							Fatto
						</button>
					</div>
					{open && (
						<Plotter
							initial={stateFrom(attrs.code)}
							read={[]}
							origin={attrs.from && attrs.name ? { id: attrs.from, title: attrs.name } : null}
							onState={(code) => (draft.current = { ...draft.current, code })}
							onOrigin={(origin) => (draft.current = { ...draft.current, from: origin?.id ?? null, name: origin?.title ?? null })}
						/>
					)}
				</div>
			</Modal>
		</NodeViewWrapper>
	);
}
