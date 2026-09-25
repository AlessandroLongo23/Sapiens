'use client';

import { useEffect, useImperativeHandle, useRef, type Ref, type RefObject } from 'react';
import { StickerBoard, type BoardState } from '@/lib/zaino/sticker-board';
import { Minus, Plus } from 'lucide-react';
import { MAX_SIZE, MIN_SIZE, STICKER_PACKS, STICKERS, stickerArt, type PlacedSticker } from '@/lib/zaino/stickers';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import './stickers.css';

export interface StickerControls {
	pick: (stickerId: string) => void;
	putAway: () => void;
	resize: (factor: number) => void;
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
	fluid = false,
	ref
}: {
	sheet: RefObject<HTMLDivElement | null>;
	/** The saved set, read once when the board mounts. */
	initial: () => PlacedSticker[];
	onChange: (stickers: PlacedSticker[]) => void;
	onState: (state: BoardState) => void;
	/** A board as wide as its element (see BoardOptions.fluid). */
	fluid?: boolean;
	ref: Ref<StickerControls>;
}) {
	const layer = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const board = useRef<StickerBoard | null>(null);
	useImperativeHandle(ref, () => ({ pick: (id) => board.current?.pick(id), putAway: () => board.current?.putAway(), resize: (f) => board.current?.scaleBy(f) }), []);
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
			onState: (s) => handlers.current.onState(s),
			fluid
		});
		board.current = mounted;
		return () => {
			board.current = null;
			mounted.destroy();
		};
	}, [sheet, fluid]);

	return (
		<>
			<div ref={layer} className="sticker-layer" aria-hidden="true" />
			<canvas ref={canvas} className="sticker-fx" aria-hidden="true" />
		</>
	);
}

/** What the hands can do while a sticker is held, the size, and the way out. */
export function HoldingHint({ state, coarse, onPutAway, onResize }: { state: BoardState; coarse: boolean; onPutAway: () => void; onResize: (factor: number) => void }) {
	const sizeButton = 'flex size-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent focus-ring';
	return (
		<div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-edge bg-surface/95 py-1.5 pl-4 pr-1.5 text-sm shadow-lift backdrop-blur-sm">
			<span className="min-w-0 text-fg-muted">
				{state.placing ? 'Trascina verso la freccia per stenderlo.' : coarse ? 'Tocca per attaccarlo, due dita per girarlo e ingrandirlo.' : 'Clic per attaccarlo, rotella per girarlo.'}
			</span>
			{!state.placing && (
				<span className="flex shrink-0 items-center" role="group" aria-label="Dimensione">
					<button type="button" className={sizeButton} onClick={() => onResize(1 / 1.15)} disabled={state.size <= MIN_SIZE + 0.001} aria-label="Più piccolo" title="Più piccolo (−)">
						<Minus className="size-4" aria-hidden="true" />
					</button>
					<button type="button" className={sizeButton} onClick={() => onResize(1.15)} disabled={state.size >= MAX_SIZE - 0.001} aria-label="Più grande" title="Più grande (+)">
						<Plus className="size-4" aria-hidden="true" />
					</button>
				</span>
			)}
			<Button size="sm" variant="secondary" onClick={onPutAway}>
				Rimetti via
			</Button>
		</div>
	);
}

/** The album: every sticker, pack by pack, free to use as many times as wanted (the beta has no rewards). */
export function StickerAlbum({
	open,
	onClose,
	onPick,
	description = 'Scegli un adesivo, poi attaccalo dove vuoi sul foglio.'
}: {
	open: boolean;
	onClose: () => void;
	onPick: (stickerId: string) => void;
	description?: string;
}) {
	return (
		<Sheet open={open} onClose={onClose} title="Adesivi" description={description}>
			<div className="space-y-6">
				{STICKER_PACKS.map((pack) => {
					const own = STICKERS.filter((d) => d.pack === pack.id);
					if (own.length === 0) return null;
					return (
						<section key={pack.id} aria-labelledby={`pack-${pack.id}`}>
							<h3 id={`pack-${pack.id}`} className="label-mono mb-2.5 text-fg-subtle">
								{pack.name}
							</h3>
							<ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
								{own.map((d) => {
									const scale = Math.min(84 / d.w, 60 / d.h, 0.7);
									return (
										<li key={d.id}>
											<button
												type="button"
												onClick={() => onPick(d.id)}
												className="group flex w-full flex-col items-center gap-2 rounded-2xl bg-surface-2 px-2 pb-2.5 pt-3 transition duration-150 hover:bg-surface-3 active:scale-[0.97] focus-ring"
											>
												<span className="sticker-thumb transition-transform duration-150 group-hover:-translate-y-0.5" aria-hidden="true">
													{/* Static artwork from lib/zaino/stickers, never user input. */}
													<span
														style={{ width: d.w, height: d.h, ['--r' as string]: `${d.r}px`, transform: `translate(-50%, -50%) scale(${scale.toFixed(3)}) rotate(-4deg)` }}
														dangerouslySetInnerHTML={{ __html: stickerArt(d) }}
													/>
												</span>
												<span className="text-xs font-medium text-fg-muted group-hover:text-fg">{d.name}</span>
											</button>
										</li>
									);
								})}
							</ul>
						</section>
					);
				})}
			</div>
		</Sheet>
	);
}
