'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Sticker } from 'lucide-react';
import { create } from 'zustand';
import { useAuth } from '@/lib/state/auth';
import { clearCovers, coversStore } from '@/lib/state/covers';
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
const useCover = create<{ ready: boolean; full: boolean; open: boolean; wanted: boolean }>(() => ({ ready: false, full: false, open: false, wanted: false }));

/**
 * Opens the album of the cover on this page, at the end of the trail. A visitor gets it too: it asks
 * them to sign up, and the album opens once their cover is ready (vault/Decisioni/2026-09-26 Gli
 * adesivi sono per tutti gli iscritti.md). Nothing is saved without an account.
 */
export function CoverStickersButton() {
	const { user, openModal } = useAuth();
	const { ready, full } = useCover();
	const onClick = () => {
		if (user) useCover.setState({ open: true });
		else openModal({ register: true, next: () => useCover.setState({ wanted: true }) });
	};
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={!!user && (!ready || full)}
			title={!user ? 'Crea un account per attaccare adesivi sulla copertina' : full ? `Al massimo ${MAX_STICKERS} adesivi: staccane uno per attaccarne un altro.` : 'Attacca un adesivo sulla copertina'}
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
 * from the middle shrinks as in `squeeze`, through the container's width. `defaults` marks the set every
 * page comes with, which a signed-in student does not see (html.signed-in, set before the first paint in
 * the root layout): their own cover may have different stickers, and those would flash and go.
 */
function StaticCover({ stickers, defaults = false }: { stickers: PlacedSticker[]; defaults?: boolean }) {
	return (
		<div className={`absolute inset-0 [container-type:inline-size] ${defaults ? 'cover-defaults' : ''}`} aria-hidden="true">
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
 * The squared paper at the top of a page of the material as a notebook's cover: the signed-in student
 * sticks stickers on it with the gesture of the notes (StickerBoard), and they are there on the next
 * visit (table cover_stickers, route /api/adesivi). The page is cached for everybody, so the covers are
 * fetched in the browser, all of them at once (lib/state/covers), with a copy kept in the browser: a
 * page draws the student's stickers from the copy at once, and the board takes over when the server has
 * answered. Until a student changes the cover it has coverDefaults(page), which is what visitors see.
 */
export function CoverStickers({ page }: { page: string }) {
	const { user, ready } = useAuth();
	const userId = user?.id ?? null;
	const coarse = useCoarsePointer();
	const cover = useRef<HTMLDivElement>(null);
	const controls = useRef<StickerControls>(null);
	const covers = coversStore((s) => s.covers);
	const coversUser = coversStore((s) => s.user);
	const fresh = coversStore((s) => s.fresh);
	const [state, setState] = useState<BoardState>({ holding: null, placing: false, hovering: false, size: 1 });
	const album = useCover((s) => s.open);
	const setAlbum = (open: boolean) => useCover.setState({ open });
	const [error, setError] = useState(false);
	// The board is laid out in CSS px, so it is mounted again when the cover changes width.
	const [width, setWidth] = useState(0);
	const hinted = coversStore((s) => s.hinted);

	// Before the first paint after hydration: the browser's copy, so a student's own stickers show at once.
	useLayoutEffect(() => coversStore.getState().restore(), []);
	useEffect(() => {
		if (!ready) return;
		document.documentElement.classList.toggle('signed-in', !!userId);
		if (userId) coversStore.getState().load(userId);
		else if (coversStore.getState().covers) clearCovers();
	}, [ready, userId]);

	/** The cover as saved, in saved coordinates: the student's, or what the page comes with. */
	const own = covers && (userId ? coversUser === userId : !ready && hinted) ? (covers[page] ?? coverDefaults(page)) : null;
	const active = userId !== null && fresh && coversUser === userId;
	const set = useRef<PlacedSticker[]>([]);
	const count = own?.length ?? 0;
	useEffect(() => {
		useCover.setState({ ready: active, full: count >= MAX_STICKERS });
	}, [active, count]);
	// Signed up from the button: the album opens as soon as the new student's cover is on the board.
	const wanted = useCover((s) => s.wanted);
	useEffect(() => {
		if (active && wanted) useCover.setState({ wanted: false, open: true });
	}, [active, wanted]);
	useEffect(() => () => useCover.setState({ ready: false, full: false, open: false, wanted: false }), []);

	// Measured before the paint, so the board replaces the still stickers in the same frame.
	useLayoutEffect(() => {
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
			// The shared copy follows at once, so this page and its copy in the browser are right on the next visit.
			if (userId) coversStore.getState().put(userId, page, set.current);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => save(), SAVE_DEBOUNCE_MS);
		},
		[save, userId, page]
	);
	// Read once, when the board mounts: the cover as the server last gave it.
	const initial = useCallback(() => {
		const w = cover.current?.getBoundingClientRect().width ?? COVER_WIDTH;
		set.current = coversStore.getState().covers?.[page] ?? coverDefaults(page);
		return set.current.map((s) => toBoard(s, w));
	}, [page]);
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

	const board = active && width > 0;
	const layer = (
		<div ref={cover} className="sticker-cover pointer-events-none absolute inset-x-0 top-0 z-20" style={{ height: COVER_HEIGHT }}>
			{board ? (
				<NoteStickers key={`${page}:${width}`} sheet={cover} initial={initial} onChange={onChange} onState={setState} fluid ref={controls} />
			) : own ? (
				<StaticCover stickers={own} />
			) : (
				<StaticCover stickers={coverDefaults(page)} defaults />
			)}
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
