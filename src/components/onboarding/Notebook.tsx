'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { cn } from '@/lib/utils/cn';
import { Slot, type ObjectId } from './Stage';

export interface StickerArt {
	url: string;
	w: number;
	h: number;
	cut: boolean;
}

/** What is written on the label: a value in ink once chosen, or in pencil while the pointer is over an answer. */
export interface LabelLine {
	name: string;
	value: string;
	pencil?: string;
	/** Typed letter by letter (the name): it appears as it is typed, without the stroke of the pen. */
	typed?: boolean;
	/** A long value (the lesson) may take two lines. */
	wrap?: boolean;
}

const NBSP = String.fromCharCode(160);

function Hand({ line }: { line: LabelLine }) {
	if (line.value) {
		return (
			<span key={line.value} className="ob-hand" data-wrap={line.wrap ? '' : undefined} data-written={line.typed ? undefined : ''}>
				{line.value}
			</span>
		);
	}
	return (
		<span className="ob-hand" data-wrap={line.wrap ? '' : undefined} data-pencil="">
			{line.pencil ?? NBSP}
		</span>
	);
}

function Sticker({ art, className, turn }: { art: StickerArt; className?: string; turn: number }) {
	return (
		<span className={cn('ob-sticker', className)} data-edge={art.cut ? undefined : ''} style={{ '--r': `${turn}deg` } as CSSProperties}>
			{/* Sized in the notebook's `em` (16px on the full-size one), so it shrinks with a smaller cover. */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={art.url} width={art.cut ? art.w : art.w - 8} height={art.cut ? art.h : art.h - 8} alt="" draggable={false} style={{ width: `${(art.cut ? art.w : art.w - 8) / 16}em`, height: 'auto' }} />
		</span>
	);
}

/**
 * The cover is card, not a board: it is cut into this many vertical strips, each hinged on the one before, so it
 * can bend while it turns.
 */
const STRIPS = 8;
/** How far it opens, in degrees: flat on the table to the left of the pages, a hair short of it. */
const OPEN = 178;

/**
 * Turns the cover between closed and open as a sheet of card would go: the free edge leaves first and curls,
 * the rest follows from the spine, it falls flat and gives a small bounce. Each strip shows its outer face
 * until it stands edge-on to the viewer and its inner face after: the page decides which, strip by strip (a
 * browser asked to hide the back of the outer face lets the label and the stickers through). The shade on each
 * strip follows its angle, which is what makes the bend read as one. With reduced motion it is simply open or
 * closed.
 */
function useCover(open: boolean) {
	const cover = useRef<HTMLDivElement>(null);
	const state = useRef({ p: 0, v: 0, frame: 0 });

	useEffect(() => {
		const root = cover.current;
		if (!root) return;
		const strips = [...root.querySelectorAll<HTMLElement>('.ob-strip')];
		const book = root.closest<HTMLElement>('.ob-book');
		const weights = strips.map((_, i) => (i / (STRIPS - 1)) ** 1.6);
		const total = weights.reduce((a, b) => a + b, 0);
		const s = state.current;
		const target = open ? 1 : 0;
		const from = s.p;

		const draw = () => {
			// How far along this turn is, whichever way it goes: the edge leads at the start of either.
			const along = Math.abs(target - from) < 0.001 ? 1 : Math.min(Math.max((s.p - from) / (target - from), 0), 1);
			const lead = (target > from ? 1 : -1) * 34 * Math.sin(Math.PI * Math.min(along / 0.55, 1)) ** 2 * (1 - along);
			const lag = Math.max(-30, Math.min(30, s.v * 14));
			const bend = lead - lag;
			let angle = 0;
			strips.forEach((strip, i) => {
				const turn = i === 0 ? s.p * OPEN : (bend * weights[i]) / total;
				angle += turn;
				strip.style.transform = `rotateY(${-turn}deg)`;
				const inner = angle > 90;
				(strip.children[0] as HTMLElement).style.visibility = inner ? 'hidden' : 'visible';
				(strip.children[1] as HTMLElement).style.visibility = inner ? 'visible' : 'hidden';
				// Edge-on to the lamp it is at its darkest; flat, either way up, it is lit.
				(strip.children[2] as HTMLElement).style.opacity = String(0.3 * Math.abs(Math.sin((angle * Math.PI) / 180)) ** 1.3);
			});
			book?.style.setProperty('--ob-cast', String(Math.sin(Math.min(s.p, 0.5) * 2 * Math.PI)));
			book?.toggleAttribute('data-open', s.p > 0.5);
		};

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			s.p = target;
			s.v = 0;
			draw();
			return;
		}
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min((now - last) / 1000, 1 / 30);
			last = now;
			s.v += (15 * (target - s.p) - 4.6 * s.v) * dt;
			s.p += s.v * dt;
			// It lands on the table (or on the pages) and gives a little.
			if (s.p > 1 || s.p < 0) {
				s.p = Math.max(0, Math.min(1, s.p));
				s.v *= -0.28;
			}
			draw();
			if (Math.abs(target - s.p) < 0.0008 && Math.abs(s.v) < 0.01) {
				s.p = target;
				s.v = 0;
				draw();
				return;
			}
			s.frame = requestAnimationFrame(tick);
		};
		s.frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(s.frame);
	}, [open]);

	return cover;
}

/** The strips of the cover, each inside the one before: a slice of the outer face, the matching slice of the inner one, and its shade. */
function Strips({ index = 0, front, back }: { index?: number; front: ReactNode; back: ReactNode }) {
	const slice = { width: `${STRIPS * 100}%` };
	return (
		<div className="ob-strip" data-first={index === 0 ? '' : undefined} data-last={index === STRIPS - 1 ? '' : undefined} style={index === 0 ? { width: `${100 / STRIPS}%` } : undefined}>
			<div className="ob-face" aria-hidden={index > 0 ? true : undefined}>
				<div className="ob-cover-front" style={{ ...slice, left: `${-index * 100}%` }}>
					{front}
				</div>
			</div>
			<div className="ob-face ob-face-inner" style={{ visibility: 'hidden' }} aria-hidden={index > 0 ? true : undefined}>
				<div className="ob-cover-back" style={{ ...slice, left: `${-(STRIPS - 1 - index) * 100}%` }}>
					{back}
				</div>
			</div>
			<div className="ob-shade" />
			{index < STRIPS - 1 && <Strips index={index + 1} front={front} back={back} />}
		</div>
	);
}

/** What is on the outside of a cover: the label, the stickers pressed on it, the name of the house. */
function CoverFront({ lines, sticker, stamp }: { lines: LabelLine[]; sticker: StickerArt | null; stamp?: StickerArt | null }) {
	return (
		<>
			<div className="ob-label">
				{lines.map((line) => (
					<div key={line.name} className="ob-line" data-wrap={line.wrap ? '' : undefined}>
						<span className="ob-line-name">{line.name}</span>
						<Hand line={line} />
					</div>
				))}
			</div>
			{sticker && <Sticker key={sticker.url} art={sticker} turn={-8} className="bottom-[19%] right-[10%]" />}
			{stamp && <Sticker key={stamp.url} art={stamp} turn={9} className="bottom-[9%] left-[22%]" />}
			<span className="ob-wordmark">Sapiens</span>
		</>
	);
}

/**
 * A notebook, as it stands beside the questions on a computer: one for each subject, in the subject's colour
 * (`subject`; without one it is the plain notebook of the first questions). The label on its cover fills in with
 * the answers, a sticker goes on when a lesson is chosen, and `open` turns the cover to show the first page
 * (`page`) with the inside of the cover (`inside`) lying to its left. The object chosen on the first screen sits
 * on its corner; the subject's own object joins it (`object`).
 */
export function Notebook({ ref, subject, lines, open, sticker, stamp, companion, object, page, inside, className }: { ref?: Ref<HTMLDivElement>; subject: string | null; lines: LabelLine[]; open: boolean; sticker: StickerArt | null; stamp: StickerArt | null; companion: ObjectId; object: ObjectId | null; page: ReactNode; inside: ReactNode; className?: string }) {
	const cover = useCover(open);
	const front = <CoverFront lines={lines} sticker={sticker} stamp={stamp} />;
	return (
		<div ref={ref} className={cn('ob-book', className)} data-subject={subject ?? undefined}>
			<div className="ob-leaves" />
			<div className="ob-leaf">
				{page}
				<div className="ob-cast" />
			</div>
			<div ref={cover} className="ob-cover">
				<Strips front={front} back={inside} />
			</div>
			<Slot id={companion} className="absolute -right-14 -top-16 w-40" />
			{object && <Slot id={object} className={cn('absolute -bottom-9 w-32', open ? '-right-14' : '-left-16')} />}
		</div>
	);
}

/** A closed notebook to be picked among others: its cover as it stands, and its subject's object on the corner. */
export function CoverCard({ subject, lines, sticker, object, className, ...rest }: { subject: string; lines: LabelLine[]; sticker: StickerArt | null; object: ObjectId } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button type="button" className={cn('ob-cover-card', className)} data-subject={subject} data-stage-hover="" {...rest}>
			<span className="ob-cover-card-in">
				<span className="ob-cover-front" style={{ left: 0, width: '100%' }}>
					<CoverFront lines={lines} sticker={sticker} />
				</span>
			</span>
			<Slot id={object} className="absolute -bottom-[9%] -left-[13%] w-[36%]" />
		</button>
	);
}

/** The same notebook on a phone: the object and the label, in a strip above the question. */
export function NotebookStrip({ subject, lines, companion, className }: { subject: string | null; lines: LabelLine[]; companion: ObjectId; className?: string }) {
	const written = lines.filter((line) => line.value);
	return (
		<div className={cn('flex items-center gap-3', className)}>
			<Slot id={companion} className="w-20 shrink-0" />
			<div className="ob-strip-label min-w-0 flex-1 px-3.5 py-2" data-subject={subject ?? undefined}>
				{written.length ? (
					written.slice(-2).map((line) => (
						<div key={line.name} className="flex items-baseline gap-2">
							<span className="ob-line-name">{line.name}</span>
							<Hand line={{ ...line, wrap: false }} />
						</div>
					))
				) : (
					<div className="flex items-baseline gap-2">
						<span className="ob-line-name">Quaderno</span>
						<span className="ob-hand" data-pencil="">
							lo compiliamo insieme
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
