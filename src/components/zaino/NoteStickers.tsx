'use client';

import { useEffect, useImperativeHandle, useRef, type Ref, type RefObject } from 'react';
import { StickerBoard, type BoardState } from '@/lib/zaino/sticker-board';
import { STICKERS, stickerArt, type PlacedSticker } from '@/lib/zaino/stickers';
import { Sheet } from '@/components/ui/Sheet';
import './stickers.css';

export interface StickerControls {
	pick: (stickerId: string) => void;
	putAway: () => void;
}

/**
 * The sticker layer of a note's sheet: mounts a StickerBoard on the sheet and
 * hands the editor a `pick`/`putAway` handle through its ref. The board takes the saved set
 * once, at mount; after that it is the source of truth and reports changes.
 */
export function NoteStickers({
	sheet,
	initial,
	onChange,
	onState,
	ref
}: {
	sheet: RefObject<HTMLDivElement | null>;
	/** The saved set, read once when the board mounts. */
	initial: () => PlacedSticker[];
	onChange: (stickers: PlacedSticker[]) => void;
	onState: (state: BoardState) => void;
	ref: Ref<StickerControls>;
}) {
	const layer = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const board = useRef<StickerBoard | null>(null);
	useImperativeHandle(ref, () => ({ pick: (id) => board.current?.pick(id), putAway: () => board.current?.putAway() }), []);
	// The latest callbacks, read by the board without remounting it.
	const handlers = useRef({ onChange, onState });
	useEffect(() => {
		handlers.current = { onChange, onState };
	});

	const seed = useRef(initial);
	useEffect(() => {
		const node = sheet.current;
		if (!node || !layer.current || !canvas.current) return;
		const mounted = new StickerBoard(node, layer.current, canvas.current, {
			initial: seed.current(),
			onChange: (s) => handlers.current.onChange(s),
			onState: (s) => handlers.current.onState(s)
		});
		board.current = mounted;
		return () => {
			board.current = null;
			mounted.destroy();
		};
	}, [sheet]);

	return (
		<>
			<div ref={layer} className="sticker-layer" aria-hidden="true" />
			<canvas ref={canvas} className="sticker-fx" aria-hidden="true" />
		</>
	);
}

/** The album: every sticker, free to use as many times as wanted (the MVP has no rewards yet). */
export function StickerAlbum({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (stickerId: string) => void }) {
	return (
		<Sheet open={open} onClose={onClose} title="Adesivi">
			<p className="text-sm text-fg-muted">Scegli un adesivo e attaccalo dove vuoi sul foglio.</p>
			<ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
				{STICKERS.map((d) => {
					const scale = Math.min(76 / d.w, 64 / d.h, 0.72);
					return (
						<li key={d.id}>
							<button
								type="button"
								onClick={() => onPick(d.id)}
								className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-edge bg-surface px-2 pb-2 pt-3 transition-colors hover:border-edge-strong focus-ring"
							>
								<span className="sticker-thumb" aria-hidden="true">
									{/* Static artwork from lib/zaino/stickers, never user input. */}
									<span
										style={{ width: d.w, height: d.h, ['--r' as string]: `${d.r}px`, transform: `translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(-4deg)` }}
										dangerouslySetInnerHTML={{ __html: stickerArt(d) }}
									/>
								</span>
								<span className="label-mono text-fg">{d.name}</span>
							</button>
						</li>
					);
				})}
			</ul>
		</Sheet>
	);
}
