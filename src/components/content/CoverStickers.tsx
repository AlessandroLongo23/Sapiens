'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sticker } from 'lucide-react';
import { create } from 'zustand';
import { useAuth } from '@/lib/state/auth';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import type { BoardState } from '@/lib/zaino/sticker-board';
import { COVER_HEIGHT, COVER_WIDTH, MAX_STICKERS, STICKER_BY_ID, coverDefaults, stickerArt, type PlacedSticker } from '@/lib/zaino/stickers';
import { HoldingHint, NoteStickers, StickerAlbum, type StickerControls } from '@/components/zaino/NoteStickers';
import { Button } from '@/components/ui/Button';
import '@/components/zaino/stickers.css';

/** Stickers are saved a moment after the last one goes down or comes off, as on a note. */
const SAVE_DEBOUNCE_MS = 600;

/**
 * How far from the middle a saved x lands on a cover `width` px wide. Up to the width of the page's
 * content a sticker keeps its distance from the middle, so it stays by the same word of the title;
 * on a narrower screen the distances shrink with it, so a sticker at the content's edge stays at the edge.
 */
const squeeze = (width: number) => Math.min(1, width / COVER_WIDTH);
const toBoard = (s: PlacedSticker, width: number): PlacedSticker => ({ ...s, x: width / 2 + s.x * squeeze(width) });
const toSaved = (s: PlacedSticker, width: number): PlacedSticker => ({ ...s, x: Math.round(((s.x - width / 2) / squeeze(width)) * 10) / 10 });

/**
 * Between the cover, drawn over the band, and its button, which sits in the header's flow under the
 * figures so that it never covers the trail on a phone.
 */
const useCover = create<{ ready: boolean; full: boolean; open: boolean }>(() => ({ ready: false, full: false, open: false }));

/** Opens the album of the cover on this page, at the end of the trail; there for signed-in students only. */
export function CoverStickersButton() {
	const { user } = useAuth();
	const { ready, full } = useCover();
	if (!user) return null;
	return (
		<button
			type="button"
			onClick={() => useCover.setState({ open: true })}
			disabled={!ready || full}
			title={full ? `Al massimo ${MAX_STICKERS} adesivi: staccane uno per attaccarne un altro.` : 'Attacca un adesivo sulla copertina'}
			className="label-mono flex h-7 items-center gap-1.5 rounded-full border border-edge bg-surface/80 px-3 text-fg-muted shadow-xs backdrop-blur-sm transition-colors hover:border-edge-strong hover:text-fg disabled:opacity-50 focus-ring"
		>
			<Sticker className="size-3.5" aria-hidden="true" />
			Adesivi
		</button>
	);
}

/**
 * The stickers of a cover drawn as plain markup, at the same places as on the board: for visitors, and
 * while a student's own set loads. Rendered on the server too, so the cached page has them. The distance
 * from the middle shrinks as in `squeeze`, through the container's width.
 */
function StaticCover({ stickers }: { stickers: PlacedSticker[] }) {
	return (
		<div className="absolute inset-0 [container-type:inline-size]" aria-hidden="true">
			{stickers.map((s) => {
				const d = STICKER_BY_ID.get(s.sticker);
				if (!d) return null;
				return (
					<span
						key={s.id}
						className="absolute"
						style={{
							left: `calc(50cqw + ${s.x} * min(1px, 100cqw / ${COVER_WIDTH}))`,
							top: s.y,
							width: d.w,
							height: d.h,
							['--r' as string]: `${d.r}px`,
							transform: `translate(-50%, -50%) rotate(${s.r}deg) scale(${s.s ?? 1})`,
							filter: 'drop-shadow(0 0.6px 0.5px rgb(30 18 8 / 0.38)) drop-shadow(0 1px 2px rgb(30 18 8 / 0.12))'
						}}
						// Static artwork from lib/zaino/stickers, never user input.
						dangerouslySetInnerHTML={{ __html: stickerArt(d) }}
					/>
				);
			})}
		</div>
	);
}

/**
 * The squared paper at the top of a subject's page as a notebook's cover: the signed-in student sticks
 * stickers on it with the gesture of the notes (StickerBoard), and they are there on the next visit
 * (table cover_stickers, route /api/adesivi). The page is cached for everybody, so the stickers are
 * fetched in the browser. Until a student changes the cover it has coverDefaults(page), which is also what
 * visitors see, stuck on and still.
 */
export function CoverStickers({ page }: { page: string }) {
	const { user, ready } = useAuth();
	const userId = user?.id ?? null;
	const coarse = useCoarsePointer();
	const cover = useRef<HTMLDivElement>(null);
	const controls = useRef<StickerControls>(null);
	/** The saved set, in saved coordinates; null until it has been read. */
	const [loaded, setLoaded] = useState<{ user: string; page: string } | null>(null);
	const set = useRef<PlacedSticker[]>([]);
	const [count, setCount] = useState(0);
	const [state, setState] = useState<BoardState>({ holding: null, placing: false, hovering: false, size: 1 });
	const album = useCover((s) => s.open);
	const setAlbum = (open: boolean) => useCover.setState({ open });
	const [error, setError] = useState(false);
	// The board is laid out in CSS px, so it is mounted again when the cover changes width.
	const [width, setWidth] = useState(0);

	useEffect(() => {
		if (!ready || !userId) return;
		let live = true;
		fetch(`/api/adesivi?pagina=${encodeURIComponent(page)}`, { cache: 'no-store' })
			.then((res) => (res.ok ? res.json() : null))
			.catch(() => null)
			.then((body: { stickers: PlacedSticker[] | null } | null) => {
				// Without the saved set there is no cover to stick on: a save would overwrite it.
				if (!live || !body) return;
				// null: never changed, so the cover still has what it comes with.
				set.current = body.stickers ?? coverDefaults(page);
				setCount(set.current.length);
				setLoaded({ user: userId, page });
			});
		return () => {
			live = false;
		};
	}, [ready, userId, page]);
	const active = loaded !== null && loaded.user === userId && loaded.page === page;
	useEffect(() => {
		useCover.setState({ ready: active, full: count >= MAX_STICKERS });
	}, [active, count]);
	useEffect(() => () => useCover.setState({ ready: false, full: false, open: false }), []);

	useEffect(() => {
		const node = cover.current;
		if (!node || !active) return;
		let timer: ReturnType<typeof setTimeout> | null = null;
		const measure = () => setWidth(Math.round(node.getBoundingClientRect().width));
		measure();
		const observer = new ResizeObserver(() => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(measure, 150);
		});
		observer.observe(node);
		return () => {
			observer.disconnect();
			if (timer) clearTimeout(timer);
		};
	}, [active]);

	// Saves run one after another, so the last set sent is the one that stays.
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const queue = useRef<Promise<void>>(Promise.resolve());
	const save = useCallback(
		(keepalive = false) => {
			if (timer.current) clearTimeout(timer.current);
			timer.current = null;
			const body = JSON.stringify({ pagina: page, stickers: set.current });
			queue.current = queue.current.then(async () => {
				try {
					const response = await fetch('/api/adesivi', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive });
					setError(!response.ok);
				} catch {
					setError(true);
				}
			});
		},
		[page]
	);
	const onChange = useCallback(
		(next: PlacedSticker[]) => {
			const w = cover.current?.getBoundingClientRect().width ?? COVER_WIDTH;
			set.current = next.map((s) => toSaved(s, w));
			setCount(next.length);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => save(), SAVE_DEBOUNCE_MS);
		},
		[save]
	);
	const initial = useCallback(() => {
		const w = cover.current?.getBoundingClientRect().width ?? COVER_WIDTH;
		return set.current.map((s) => toBoard(s, w));
	}, []);
	// A pending save goes out when the page is left or hidden.
	useEffect(() => {
		const flush = () => timer.current && save(true);
		const onHidden = () => document.visibilityState === 'hidden' && flush();
		document.addEventListener('visibilitychange', onHidden);
		window.addEventListener('pagehide', flush);
		return () => {
			document.removeEventListener('visibilitychange', onHidden);
			window.removeEventListener('pagehide', flush);
			flush();
		};
	}, [save]);

	const board = userId !== null && active && width > 0;
	const layer = (
		<div ref={cover} className="sticker-cover pointer-events-none absolute inset-x-0 top-0 z-20" style={{ height: COVER_HEIGHT }}>
			{board ? <NoteStickers key={width} sheet={cover} initial={initial} onChange={onChange} onState={setState} fluid ref={controls} /> : <StaticCover stickers={coverDefaults(page)} />}
		</div>
	);
	if (!userId) return layer;

	return (
		<>
			{layer}

			{(state.holding || error) && (
				<div className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h,64px)+0.75rem)] z-40 flex justify-center px-3">
					{state.holding ? (
						<HoldingHint state={state} coarse={coarse} onPutAway={() => controls.current?.putAway()} onResize={(f) => controls.current?.resize(f)} />
					) : (
						<div role="alert" className="pointer-events-auto flex items-center gap-3 rounded-full border border-edge bg-surface/95 py-1.5 pl-4 pr-1.5 text-sm shadow-lift backdrop-blur-sm">
							<span className="text-fg-muted">Gli adesivi non sono stati salvati.</span>
							<Button size="sm" variant="secondary" onClick={() => save()}>
								Riprova
							</Button>
						</div>
					)}
				</div>
			)}

			<StickerAlbum
				open={album}
				onClose={() => setAlbum(false)}
				description="Scegli un adesivo, poi attaccalo dove vuoi sulla copertina."
				onPick={(id) => {
					setAlbum(false);
					controls.current?.pick(id);
				}}
			/>
		</>
	);
}
