'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SHEET_WIDTH } from '@/lib/zaino/stickers';
import type { Crumple } from '@/lib/zaino/paper-crumple';

/** Room around the sheet for the ball to turn and cast its shadow in. */
const PAD = 40;
/** The ball stays still this long once made, before it is thrown. */
const HOLD_MS = 120;
/** The throw into the trash, and the drop when the trash is not in view (`.zn-crumple.is-dropping`). */
const THROW_MS = 460;
const DROP_MS = 380;
/** Thrown before the preparation is done (a quick tap): the card waits this long for it, then goes without it. */
const WAIT_MAX_MS = 4000;
/** The card is the page shrunk to about a quarter, where the squares' lines are thinner than a pixel. The picture is
 *  taken at the page's own size and a half, so the lines and the text survive on the folds; within what any GPU takes. */
const PHOTO_WIDTH = SHEET_WIDTH * 1.5;
const MAX_TEXTURE = 2048;

/** An element's background as `#rrggbb`, whatever colour space the stylesheet wrote it in (the paper is in oklch). */
function backgroundHex(element: HTMLElement): string | undefined {
	const context = document.createElement('canvas').getContext('2d');
	if (!context) return undefined;
	context.fillStyle = getComputedStyle(element).backgroundColor;
	context.fillRect(0, 0, 1, 1);
	const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
	if (a === 0) return undefined;
	return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Loads, while the list sits idle, what the first crumple would otherwise wait for: the two modules and the fonts
 * the picture embeds (html-to-image keeps what it fetched). Called once the notes are on screen.
 */
export function warmUpCrumple(page: HTMLElement | null) {
	const run = async () => {
		if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		try {
			const [{ getFontEmbedCSS }] = await Promise.all([import('html-to-image'), import('@/lib/zaino/paper-crumple'), import('@/lib/zaino/page-photo')]);
			await getFontEmbedCSS(page, { preferredFontFormat: 'woff2' });
		} catch {
			// Only a head start: the crumple loads the same things itself.
		}
	};
	if ('requestIdleCallback' in window) requestIdleCallback(() => void run(), { timeout: 3000 });
	else setTimeout(() => void run(), 1500);
}

const findSheet = (noteId: string) => {
	const card = document.querySelector<HTMLElement>(`[data-note-id="${noteId}"]`);
	return { card, sheet: card?.querySelector<HTMLElement>('.zn-page') ?? card };
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Box {
	card: HTMLElement;
	/** Where the sheet is inside the card, and its size. */
	left: number;
	top: number;
	width: number;
	height: number;
	src: string;
	back?: string;
}

/**
 * What the note is doing: `ready`, prepared and hidden (the menu is open, or the note is being dragged); `held`,
 * crumpled over the trash and waiting (back to `ready` unfolds it); `thrown`, crumpled and thrown into the trash.
 */
export type CrumpleState = 'ready' | 'held' | 'thrown';

/**
 * A deleted note crumpled into a ball where it lay and thrown into the trash. The page is photographed
 * (lib/zaino/page-photo) and laid, flat and hidden, on a WebGL sheet (lib/zaino/paper-crumple) inside the card, so it
 * scrolls with the page, as soon as a delete is in sight: the note's menu is open, or the note is picked up. Held
 * over the trash it crumples and flattens again when it leaves; thrown, the ball flies in an arc to `target` (the
 * trash on screen) and `onLanded` lets the trash take it, or drops out of sight when the trash is not in view.
 * Without WebGL, or with reduced motion, `onDone` comes at once when thrown.
 */
export function NoteCrumple({
	noteId,
	state,
	target,
	onLanded,
	onDone
}: {
	noteId: string;
	state: CrumpleState;
	target?: () => HTMLElement | null;
	onLanded?: () => void;
	onDone: () => void;
}) {
	const [box, setBox] = useState<Box | null>(null);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const [shown, setShown] = useState(false);
	const [dropping, setDropping] = useState(false);
	const flight = useRef<HTMLDivElement>(null);
	const arc = useRef<HTMLDivElement>(null);
	const prepared = useRef<Crumple | null>(null);
	const failed = useRef(false);
	const callbacks = useRef({ target, onLanded, onDone });
	useEffect(() => {
		callbacks.current = { target, onLanded, onDone };
	});

	// As soon as a delete is in sight: photograph the page.
	useEffect(() => {
		let cancelled = false;
		(async () => {
			const { card, sheet } = findSheet(noteId);
			if (!card || !sheet || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				failed.current = true;
				return;
			}
			try {
				const { photographPage } = await import('@/lib/zaino/page-photo');
				const width = sheet.offsetWidth;
				const height = sheet.offsetHeight;
				const photo = Math.min(MAX_TEXTURE, Math.max(width * 2, PHOTO_WIDTH), (MAX_TEXTURE * width) / height);
				const src = await photographPage(sheet, photo);
				// Where the sheet is in the card, by layout: a card being dragged is tilted on screen.
				const left = sheet === card ? 0 : sheet.offsetLeft;
				const top = sheet === card ? 0 : sheet.offsetTop;
				if (!cancelled) setBox({ card, left, top, width, height, src, back: backgroundHex(sheet) });
			} catch {
				failed.current = true;
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [noteId]);

	// Then build the paper on the canvas, still hidden.
	useEffect(() => {
		if (!box || !canvas) return;
		let dispose = () => {};
		let cancelled = false;
		(async () => {
			try {
				const { prepareCrumple } = await import('@/lib/zaino/paper-crumple');
				if (cancelled) return;
				const run = prepareCrumple(canvas, box.src, { width: box.width, height: box.height, pad: PAD, backColor: box.back, duration: 0.45 });
				dispose = run.dispose;
				prepared.current = run;
			} catch {
				failed.current = true;
			}
		})();
		return () => {
			cancelled = true;
			prepared.current = null;
			dispose();
		};
	}, [box, canvas]);

	// Held, thrown, or back to waiting.
	useEffect(() => {
		let cancelled = false;
		const { card } = findSheet(noteId);
		const show = (on: boolean) => {
			setShown(on);
			if (on) card?.setAttribute('data-crumpled', '');
			else card?.removeAttribute('data-crumpled');
		};
		const waitForPaper = async () => {
			const start = performance.now();
			while (!prepared.current && !failed.current && performance.now() - start < WAIT_MAX_MS) await pause(16);
			const run = prepared.current;
			if (run) await run.ready;
			return run;
		};

		(async () => {
			if (state === 'ready') {
				// Back from over the trash: flat again, then the card itself.
				const run = prepared.current;
				if (!run || !card?.hasAttribute('data-crumpled')) return;
				await run.unfold();
				if (!cancelled) show(false);
				return;
			}
			const run = await waitForPaper().catch(() => null);
			if (cancelled) return;
			if (!run) {
				if (state === 'thrown') callbacks.current.onDone();
				return;
			}
			show(true);
			if (state === 'held') {
				await run.fold();
				return;
			}
			await run.fold();
			await pause(HOLD_MS);
			if (cancelled) return;
			const bin = callbacks.current.target?.();
			const to = bin?.getBoundingClientRect();
			const inView = to && to.bottom > 0 && to.top < window.innerHeight && to.width > 0;
			if (!to || !inView || !flight.current || !arc.current) {
				setDropping(true);
				await pause(DROP_MS);
				if (!cancelled) callbacks.current.onDone();
				return;
			}
			// A throw: sideways at an even pace, up then down as under gravity, shrinking into the trash.
			const from = flight.current.getBoundingClientRect();
			const dx = to.left + to.width / 2 - (from.left + from.width / 2);
			const dy = to.top + to.height / 2 - (from.top + from.height / 2);
			const rise = Math.min(90, Math.max(40, Math.abs(dx) * 0.25));
			flight.current.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }], { duration: THROW_MS, easing: 'linear', fill: 'forwards' });
			arc.current.animate(
				[
					{ transform: 'translateY(0) scale(1)', easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
					{ transform: `translateY(${Math.min(0, dy) - rise}px) scale(0.55)`, offset: 0.4, easing: 'cubic-bezier(0.55, 0, 0.9, 0.4)' },
					{ transform: `translateY(${dy}px) scale(0.12)`, opacity: 0.6 }
				],
				{ duration: THROW_MS, fill: 'forwards' }
			);
			await pause(THROW_MS);
			if (cancelled) return;
			callbacks.current.onLanded?.();
			callbacks.current.onDone();
		})();
		return () => {
			cancelled = true;
		};
	}, [state, noteId]);

	// Gone: the card, if it is still there (the delete failed), shows again.
	useEffect(() => () => findSheet(noteId).card?.removeAttribute('data-crumpled'), [noteId]);

	if (!box) return null;
	return createPortal(
		<div
			ref={flight}
			className={dropping ? 'zn-crumple is-dropping' : 'zn-crumple'}
			style={{ left: box.left - PAD, top: box.top - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2, visibility: shown ? 'visible' : 'hidden' }}
			aria-hidden="true"
		>
			<div ref={arc} className="size-full">
				<canvas ref={setCanvas} className="size-full" />
			</div>
		</div>,
		box.card
	);
}
