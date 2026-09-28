'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SHEET_WIDTH } from '@/lib/zaino/stickers';

/** Room around the sheet for the ball to turn and cast its shadow in. */
const PAD = 40;
/** How long the ball stays in view once made, then how long it takes to drop out (`.zn-crumple.is-dropping`). */
const HOLD_MS = 450;
const DROP_MS = 380;
/** Confirmed before the preparation is done (a quick tap): the card waits this long for it, then goes without it. */
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
 * A deleted note crumpled into a ball where it lay, then dropped. Mounted when the confirmation opens: while the
 * student reads it, the page is photographed (lib/zaino/page-photo) and laid, flat and hidden, on a WebGL sheet
 * (lib/zaino/paper-crumple) inside the card, so it scrolls with the page. When `play` turns true the card hides and
 * the sheet folds on the next frame. Unmounted before `play` (the student cancelled), it only frees what it prepared.
 * Without WebGL, or with reduced motion, `onDone` comes at once.
 */
export function NoteCrumple({ noteId, play, onDone }: { noteId: string; play: boolean; onDone: () => void }) {
	const [box, setBox] = useState<Box | null>(null);
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const [shown, setShown] = useState(false);
	const [dropping, setDropping] = useState(false);
	const prepared = useRef<{ ready: Promise<void>; play: () => Promise<void> } | null>(null);
	const failed = useRef(false);
	const done = useRef(onDone);
	useEffect(() => {
		done.current = onDone;
	});

	// While the confirmation is read: photograph the page. The confirmation's entrance is a transform the compositor
	// runs, so the work here does not make it stutter.
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
				const rect = sheet.getBoundingClientRect();
				const width = Math.min(MAX_TEXTURE, Math.max(rect.width * 2, PHOTO_WIDTH), (MAX_TEXTURE * rect.width) / rect.height);
				const src = await photographPage(sheet, width);
				const origin = card.getBoundingClientRect();
				if (!cancelled) setBox({ card, left: rect.left - origin.left, top: rect.top - origin.top, width: rect.width, height: rect.height, src, back: backgroundHex(sheet) });
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
				const run = prepareCrumple(canvas, box.src, { width: box.width, height: box.height, pad: PAD, backColor: box.back });
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

	// On confirm: crumple, hold the ball a moment, drop it.
	useEffect(() => {
		if (!play) return;
		let cancelled = false;
		const { card } = findSheet(noteId);
		const start = performance.now();
		(async () => {
			while (!prepared.current && !failed.current && performance.now() - start < WAIT_MAX_MS) await new Promise((r) => setTimeout(r, 16));
			const run = prepared.current;
			if (cancelled) return;
			if (!run) return done.current();
			try {
				await run.ready;
				if (cancelled) return;
				setShown(true);
				card?.setAttribute('data-crumpled', '');
				await run.play();
				await new Promise((r) => setTimeout(r, HOLD_MS));
				if (cancelled) return;
				setDropping(true);
				setTimeout(() => !cancelled && done.current(), DROP_MS);
			} catch {
				if (!cancelled) done.current();
			}
		})();
		return () => {
			cancelled = true;
			// Stopped halfway (the delete failed): the card comes back. Finished, it is already out of the list.
			card?.removeAttribute('data-crumpled');
		};
	}, [play, noteId]);

	if (!box) return null;
	return createPortal(
		<div
			className={dropping ? 'zn-crumple is-dropping' : 'zn-crumple'}
			style={{ left: box.left - PAD, top: box.top - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2, visibility: shown ? 'visible' : 'hidden' }}
			aria-hidden="true"
		>
			<canvas ref={setCanvas} className="size-full" />
		</div>,
		box.card
	);
}
