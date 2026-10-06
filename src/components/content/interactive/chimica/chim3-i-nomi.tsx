'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { FONT, type Frame, type V } from '../kit';

/**
 * What the interactive figures of the lessons on nomenclature share (chemistry, third year, group I: lessons 76-79):
 * a row of buttons to pick an element or an oxidation number, the three names of a compound one under the other, and
 * a chemical symbol with its subscript and its oxidation number drawn in the SVG. The names themselves come from
 * src/lib/exercises/v2/chim3-i.ts, the same module the exercises use.
 */

/** A labelled row of small buttons, one pressed: elements, oxidation numbers, formulas. It wraps on a phone. */
export function Picker<T extends string | number>({ label, items, value, onPick, text }: { label: string; items: readonly T[]; value: T; onPick: (x: T) => void; text?: (x: T) => string }) {
	return (
		<div className="flex flex-col items-center gap-1.5">
			<span className="text-sm text-fg-muted">{label}</span>
			<div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label={label}>
				{items.map((x) => (
					<Button key={x} variant={x === value ? 'primary' : 'secondary'} size="sm" aria-pressed={x === value} className="min-w-[2.75rem] px-2" onClick={() => onPick(x)}>
						{text ? text(x) : x}
					</Button>
				))}
			</div>
		</div>
	);
}

/** The three names of a compound, in the order of the lessons: traditional, Stock, IUPAC. */
export function NamesTable({ trad, stock, iupac }: { trad: string; stock: string; iupac: string }) {
	const rows: [string, string][] = [
		['Tradizionale', trad],
		['Stock', stock],
		['IUPAC', iupac],
	];
	return (
		<dl className="m-0 grid w-full max-w-sm grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm" aria-live="polite">
			{rows.map(([k, name]) => (
				<div key={k} className="contents">
					<dt className="text-fg-muted">{k}</dt>
					<dd className="m-0 font-medium text-fg">{name}</dd>
				</div>
			))}
		</dl>
	);
}

/** One line of a readout: a label and what it says. */
export function Line({ label, children }: { label: string; children: ReactNode }) {
	return (
		<span>
			<span className="text-fg-muted">{label} </span>
			{children}
		</span>
	);
}

export const POS = '#ff0000';
export const NEG = '#0000ff';
/** The colour of an oxidation number: red if positive, blue if negative. The sign is written, so the colour is extra. */
export const signColor = (n: number) => (n > 0 ? POS : n < 0 ? NEG : '#000');
/** +2, −1, 0, with a real minus sign for the drawing. */
export const signedText = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');

/**
 * A symbol in the drawing, centred at `at`: an optional subscript after it (not written when 1), an optional
 * superscript (the charge of an ion), and an optional oxidation number above it.
 */
export function Symbol({ f, at, sym, sub = 1, sup, ox, size = 22 }: { f: Frame; at: V; sym: string; sub?: number; sup?: string; ox?: number; size?: number }) {
	const p = f.px(at);
	return (
		<g pointerEvents="none">
			<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={size} fontFamily={FONT} fill="#000">
				{sym}
				{sup && (
					<tspan dy={-size * 0.38} fontSize={size * 0.62}>
						{sup}
					</tspan>
				)}
				{sub !== 1 && (
					<tspan dy={size * 0.25} fontSize={size * 0.62}>
						{sub}
					</tspan>
				)}
			</text>
			{ox !== undefined && (
				<text x={p.x} y={p.y - size * 0.95} textAnchor="middle" fontSize={size * 0.68} fontFamily={FONT} fill={signColor(ox)}>
					{signedText(ox)}
				</text>
			)}
		</g>
	);
}
