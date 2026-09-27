'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Lock, Sticker } from 'lucide-react';
import type { DiaryPage } from '@/lib/diary/page';
import { DIARY_PAGE_WIDTH, MAX_PAGE_TEXT } from '@/lib/diary/page';
import type { BoardState } from '@/lib/zaino/sticker-board';
import { MAX_STICKERS, type PlacedSticker } from '@/lib/zaino/stickers';
import type { Day } from '@/lib/diary/dates';
import { useCoarsePointer } from '@/lib/hooks/use-media';
import { HoldingHint, NoteStickers, StickerAlbum, type StickerControls } from '@/components/zaino/NoteStickers';
import { Button } from '@/components/ui/Button';
import '@/components/zaino/stickers.css';
import { send } from './api';

/** Text and stickers are saved a moment after the last change, as on a note. */
const SAVE_DEBOUNCE_MS = 700;

/** Saved on a page DIARY_PAGE_WIDTH wide, drawn at the page's real width. */
const toBoard = (s: PlacedSticker, width: number): PlacedSticker => ({
	...s,
	x: (s.x * width) / DIARY_PAGE_WIDTH
});
const toSaved = (s: PlacedSticker, width: number): PlacedSticker => ({
	...s,
	x: Math.round(((s.x * DIARY_PAGE_WIDTH) / width) * 10) / 10
});

type Status = 'idle' | 'saving' | 'saved' | 'error';

/**
 * The student's own page of the day, on the right of the open diary or on the back of the sheet on a phone: whatever they
 * want to write, and stickers, with the gesture of the notes. It is theirs alone (vault/Prodotti/Studenti/Diario
 * e calendario.md), which the page says.
 */
export function OwnPage({ day, today, page }: { day: Day; today: Day; page: DiaryPage }) {
	const sheet = useRef<HTMLDivElement>(null);
	const area = useRef<HTMLTextAreaElement>(null);
	const controls = useRef<StickerControls>(null);
	const coarse = useCoarsePointer();
	const [text, setText] = useState(page.text);
	const [status, setStatus] = useState<Status>('idle');
	const [album, setAlbum] = useState(false);
	const [board, setBoard] = useState<BoardState>({
		holding: null,
		placing: false,
		hovering: false,
		size: 1
	});
	const [count, setCount] = useState(page.stickers.length);
	const [width, setWidth] = useState(0);
	const stickers = useRef<PlacedSticker[]>(page.stickers);
	const pending = useRef<{ text?: string; stickers?: PlacedSticker[] }>({});
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const queue = useRef<Promise<void>>(Promise.resolve());

	// Saves run one after another, so the last one sent is the one that stays.
	const flush = useCallback(
		(keepalive = false) => {
			if (timer.current) clearTimeout(timer.current);
			timer.current = null;
			const body = { day, ...pending.current };
			if (body.text === undefined && body.stickers === undefined) return;
			pending.current = {};
			setStatus('saving');
			queue.current = queue.current.then(() =>
				send('PUT', '/api/diario/pagina', body, keepalive).then(
					() => setStatus('saved'),
					() => {
						// Kept for the next try, unless something newer has been written since.
						pending.current = { ...body, ...pending.current };
						setStatus('error');
					}
				)
			);
		},
		[day]
	);
	const schedule = useCallback(
		(change: { text?: string; stickers?: PlacedSticker[] }) => {
			pending.current = { ...pending.current, ...change };
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => flush(), SAVE_DEBOUNCE_MS);
		},
		[flush]
	);
	// Leaving the page or the day sends what is still waiting.
	useEffect(() => {
		const onHidden = () => document.visibilityState === 'hidden' && flush(true);
		document.addEventListener('visibilitychange', onHidden);
		window.addEventListener('pagehide', onHidden);
		return () => {
			document.removeEventListener('visibilitychange', onHidden);
			window.removeEventListener('pagehide', onHidden);
			flush(true);
		};
	}, [flush]);

	// The text grows with what is written, so the page is as long as it needs.
	useLayoutEffect(() => {
		const node = area.current;
		if (!node) return;
		node.style.height = '0px';
		node.style.height = `${Math.max(node.scrollHeight, 28 * 6)}px`;
	}, [text, width]);

	// The board is laid out in CSS px: it is mounted again when the page changes width.
	useLayoutEffect(() => {
		const node = sheet.current;
		if (!node) return;
		let t: ReturnType<typeof setTimeout> | null = null;
		const measure = () => setWidth(Math.round(node.getBoundingClientRect().width));
		measure();
		const observer = new ResizeObserver(() => {
			if (t) clearTimeout(t);
			t = setTimeout(measure, 150);
		});
		observer.observe(node);
		return () => {
			observer.disconnect();
			if (t) clearTimeout(t);
		};
	}, []);

	const initial = useCallback(() => stickers.current.map((s) => toBoard(s, sheet.current?.getBoundingClientRect().width ?? DIARY_PAGE_WIDTH)), []);
	const onStickers = useCallback(
		(next: PlacedSticker[]) => {
			const w = sheet.current?.getBoundingClientRect().width ?? DIARY_PAGE_WIDTH;
			stickers.current = next.map((s) => toSaved(s, w));
			setCount(next.length);
			schedule({ stickers: stickers.current });
		},
		[schedule]
	);

	const full = count >= MAX_STICKERS;
	const past = day < today;

	return (
		<div ref={sheet} className="diary-own relative flex min-h-full flex-col px-4 pb-14 pt-6 sm:px-8 lg:pt-7">
			<div className="relative z-[7] flex items-center justify-between gap-3">
				<h2 className="flex items-center gap-2">
					<span className="pencil text-2xl">La mia pagina</span>
					<span className="label-mono flex items-center gap-1 text-[0.6rem] text-fg-faint" title="Solo tu vedi questa pagina: né i docenti né i genitori.">
						<Lock className="size-3" aria-hidden="true" />
						solo tua
					</span>
					<span className="text-xs text-fg-faint" aria-live="polite">
						{status === 'saving' ? 'Salvo…' : status === 'saved' ? 'Salvato' : ''}
					</span>
				</h2>
				<button
					type="button"
					onClick={() => setAlbum(true)}
					disabled={full || width === 0}
					title={full ? `Al massimo ${MAX_STICKERS} adesivi: staccane uno per attaccarne un altro.` : 'Attacca un adesivo sulla pagina'}
					className="label-mono relative flex h-8 items-center gap-1.5 rounded-full border before:absolute before:-inset-y-1.5 before:inset-x-0 border-edge bg-surface/80 px-3 text-fg-muted shadow-xs backdrop-blur-sm transition-colors hover:border-edge-strong hover:text-fg disabled:opacity-50 focus-ring"
				>
					<Sticker className="size-3.5" aria-hidden="true" />
					Adesivi
				</button>
			</div>

			<label htmlFor={`own-${day}`} className="sr-only">
				La tua pagina di {day}
			</label>
			<textarea
				ref={area}
				id={`own-${day}`}
				value={text}
				maxLength={MAX_PAGE_TEXT}
				onChange={(e) => {
					setText(e.target.value);
					schedule({ text: e.target.value });
				}}
				placeholder={past ? 'Com’è stata la giornata?' : 'Scrivi quello che vuoi: un pensiero, una lista, una frase da ricordare. E attacca gli adesivi.'}
				className="diary-pen relative z-[4] mt-3 w-full flex-1 resize-none border-0 bg-transparent p-0 placeholder:text-fg-faint placeholder:opacity-80 focus:outline-none focus:ring-0"
				style={{ lineHeight: '28px' }}
			/>

			{width > 0 && <NoteStickers key={`${day}:${width}`} sheet={sheet} initial={initial} onChange={onStickers} onState={setBoard} fluid ref={controls} />}

			{/* In a portal: the page turns in 3D, and a fixed element inside a transformed one would move with it. */}
			{(board.holding || status === 'error') &&
				createPortal(
					<div className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h,64px)+0.75rem)] z-40 flex justify-center px-3">
						{board.holding ? (
							<HoldingHint state={board} coarse={coarse} onPutAway={() => controls.current?.putAway()} onResize={(f) => controls.current?.resize(f)} />
						) : (
							<div role="alert" className="pointer-events-auto flex items-center gap-3 rounded-full border border-edge bg-surface/95 py-1.5 pl-4 pr-1.5 text-sm shadow-lift backdrop-blur-sm">
								<span className="text-fg-muted">La tua pagina non è stata salvata.</span>
								<Button size="sm" variant="secondary" onClick={() => flush()}>
									Riprova
								</Button>
							</div>
						)}
					</div>,
					document.body
				)}

			<StickerAlbum
				open={album}
				onClose={() => setAlbum(false)}
				description="Scegli un adesivo, poi attaccalo dove vuoi sulla tua pagina."
				onPick={(id) => {
					setAlbum(false);
					controls.current?.pick(id);
				}}
			/>
		</div>
	);
}
