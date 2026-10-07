'use client';

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The layout pieces of the computer science figures on CSS (flexbox, media queries): a layout the browser itself
 * computes and the figure draws with a soft movement, a choice among several values that wraps on a phone, and a CSS
 * rule written out with the line that has just changed lit.
 *
 * The movement. A change of `justify-content` moves the elements at once, and CSS cannot ease a change of layout.
 * So the figure has the layout twice: a hidden copy laid out by the real CSS (the truth, measured here), and the
 * boxes the student sees, placed over it one by one at the measured places with a transition on place and size.
 */

export type Rett = { x: number; y: number; w: number; h: number };

const half = (x: number) => Math.round(x * 2) / 2;

/**
 * The places of the elements marked `data-posto="name"` inside the element of the ref, relative to it, measured
 * again whenever `chiave` changes or the element is resized. Empty until the first measure, which comes before the
 * first paint.
 */
export function usePosti<T extends HTMLElement>(chiave: unknown): [RefObject<T | null>, ReadonlyMap<string, Rett>] {
	const ref = useRef<T>(null);
	const [posti, setPosti] = useState<{ map: ReadonlyMap<string, Rett>; said: string }>({ map: new Map(), said: '' });
	useLayoutEffect(() => {
		const node = ref.current;
		if (!node) return;
		const measure = () => {
			const origin = node.getBoundingClientRect();
			const map = new Map<string, Rett>();
			for (const el of node.querySelectorAll<HTMLElement>('[data-posto]')) {
				const r = el.getBoundingClientRect();
				map.set(el.dataset.posto!, { x: half(r.left - origin.left), y: half(r.top - origin.top), w: half(r.width), h: half(r.height) });
			}
			const said = JSON.stringify([...map]);
			setPosti((now) => (now.said === said ? now : { map, said }));
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, [chiave]);
	return [ref, posti.map];
}

/** The width of an element, followed as it changes: 0 until it has been measured. */
export function useLarghezza<T extends HTMLElement>(): [RefObject<T | null>, number] {
	const ref = useRef<T>(null);
	const [width, setWidth] = useState(0);
	useLayoutEffect(() => {
		const node = ref.current;
		if (!node) return;
		const observer = new ResizeObserver(() => setWidth(node.clientWidth));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	return [ref, width];
}

/** How a box drawn over a measured place moves there: place and size together, briefly, and not at all for who asked for less motion. */
export const MOSSA = 'motion-safe:transition-[transform,width,height,opacity,background-color,border-color] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]';

/** The style that puts a box at a measured place. */
export const posto = (r: Rett, k = 1) => ({ transform: `translate(${r.x * k}px, ${r.y * k}px)`, width: r.w * k, height: r.h * k });

/**
 * One choice among a few values, each a small key in the monospaced font, with the name of what is chosen beside
 * them. Unlike ToggleGroup the keys go on a second line when they do not fit, so five values of `justify-content`
 * can be offered on a phone. A radio group: one Tab stop, the arrows move the choice.
 */
export function Scelta<T extends string>({ nome, value, options, onChange, codice = true }: { nome: string; value: T; options: readonly T[]; onChange: (value: T) => void; /** The name and the values are CSS, set in the monospaced font. */ codice?: boolean }) {
	const id = useId();
	const group = useRef<HTMLDivElement>(null);
	const arrows = (e: KeyboardEvent<HTMLDivElement>) => {
		const i = options.indexOf(value);
		const n = options.length;
		const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
		if (to === undefined) return;
		e.preventDefault();
		const next = (to + n) % n;
		onChange(options[next]);
		group.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
	};
	return (
		<div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3" data-scelta={nome}>
			<span id={id} className={cn('shrink-0 text-fg-muted sm:w-[8.5rem]', codice ? 'font-mono text-[12.5px] font-medium' : 'text-sm font-medium')}>
				{nome}
			</span>
			<div ref={group} role="radiogroup" aria-labelledby={id} onKeyDown={arrows} className="flex flex-wrap gap-1.5">
				{options.map((option) => {
					const on = option === value;
					return (
						<button
							key={option}
							type="button"
							role="radio"
							aria-checked={on}
							tabIndex={on ? 0 : -1}
							onClick={() => onChange(option)}
							className={cn(
								'min-h-9 rounded-lg border-[1.5px] px-2.5 whitespace-nowrap transition-colors duration-150 focus-ring',
								codice ? 'font-mono text-[12.5px]' : 'min-w-9 text-sm tabular-nums',
								on ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-semibold text-fg-strong' : 'border-edge bg-surface text-fg-muted hover:border-edge-strong hover:bg-surface-2'
							)}
						>
							{option}
						</button>
					);
				})}
			</div>
		</div>
	);
}

/**
 * A CSS rule written out as in a style sheet: the selector, one declaration per line, the closing brace. The
 * declaration named by `accesa` (the one the student has just changed) is lit.
 */
export function Regola({ selettore, righe, accesa, label }: { selettore: string; righe: readonly { proprieta: string; valore: string }[]; accesa?: string; label?: string }) {
	return (
		<pre aria-label={label ?? `La regola CSS di ${selettore}`} className="m-0 rounded-xl border border-edge bg-surface-2 px-3 py-2.5 font-mono text-[12.5px] leading-[1.7] text-fg-muted" data-regola>
			<span className="font-semibold text-fg-strong">{selettore}</span> {'{'}
			{righe.map(({ proprieta, valore }) => (
				<span key={proprieta} data-accesa={proprieta === accesa || undefined} className={cn('-mx-1.5 block rounded-md px-1.5 motion-safe:transition-colors motion-safe:duration-300', proprieta === accesa && 'bg-tint-soft')}>
					{'    '}
					{proprieta}: <span className={cn('font-semibold', proprieta === accesa ? 'text-tint-fg' : 'text-fg-strong')}>{valore}</span>;
				</span>
			))}
			{'}'}
		</pre>
	);
}
