'use client';

import type { ReactNode } from 'react';
import { FONT, add, scale, v, type Frame, type V } from '../kit';

/**
 * Pieces shared by the figures of chemistry, third year, group H (lessons 72-75: intermolecular forces, the hydrogen
 * bond, liquids, solids): a row of pills to pick one of several things without the sideways scrolling a ToggleGroup
 * with long labels causes on a phone, and a chemical formula set in SVG or in HTML with its subscripts.
 */

/** "Cl2" → Cl, 2 (a subscript), and so on: letters and digits in turn. A "+" or "-" at the end is a charge. */
function pieces(formula: string): { text: string; kind: 'base' | 'sub' | 'sup' }[] {
	const out: { text: string; kind: 'base' | 'sub' | 'sup' }[] = [];
	const m = formula.match(/^(.*?)(\d*[+−-])?$/);
	const body = m?.[1] ?? formula;
	const charge = m?.[2];
	for (const part of body.match(/\d+|[^\d]+/g) ?? []) out.push({ text: part, kind: /^\d+$/.test(part) ? 'sub' : 'base' });
	if (charge) out.push({ text: charge.replace('-', '−'), kind: 'sup' });
	return out;
}

/** A formula in running HTML text: C₅H₁₂ with real subscripts. */
export function Formula({ children }: { children: string }) {
	return (
		<span className="whitespace-nowrap">
			{pieces(children).map((p, i) => (p.kind === 'sub' ? <sub key={i}>{p.text}</sub> : p.kind === 'sup' ? <sup key={i}>{p.text}</sup> : <span key={i}>{p.text}</span>))}
		</span>
	);
}

/** A formula inside a drawing, as a TikZ node would set `$\mathrm{Cl_2}$`. `dir` works as in the kit's Label. */
export function FormulaLabel({ f, at, dir = v(0, 0), size = 13, color = '#000', weight, children }: { f: Frame; at: V; dir?: V; size?: number; color?: string; weight?: number; children: string }) {
	const p = f.px(add(at, scale(dir, 0.2)));
	const anchor = dir.x > 0.3 ? 'start' : dir.x < -0.3 ? 'end' : 'middle';
	const dy = dir.y > 0.3 ? '0' : dir.y < -0.3 ? '0.75em' : '0.35em';
	const ps = pieces(children);
	return (
		<text x={p.x} y={p.y} dy={dy} textAnchor={anchor} fontSize={size} fontFamily={FONT} fontWeight={weight} fill={color} pointerEvents="none">
			{ps.map((piece, i) => {
				const before = i > 0 ? ps[i - 1].kind : 'base';
				// Each tspan moves the baseline from where the one before left it.
				const from = before === 'sub' ? 0.25 : before === 'sup' ? -0.4 : 0;
				const to = piece.kind === 'sub' ? 0.25 : piece.kind === 'sup' ? -0.4 : 0;
				return (
					<tspan key={i} dy={i === 0 ? undefined : `${((to - from) * size).toFixed(1)}`} fontSize={piece.kind === 'base' ? size : size * 0.72}>
						{piece.text}
					</tspan>
				);
			})}
		</text>
	);
}

/** One of several, as small round buttons that wrap on a narrow screen. */
export function Pills<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: ReactNode }[]; value: T; onChange: (value: T) => void }) {
	return (
		<div role="group" aria-label={label} className="flex flex-wrap items-center justify-center gap-1.5">
			<span className="mr-1 text-xs text-fg-muted">{label}</span>
			{options.map((o) => (
				<button
					key={o.value}
					type="button"
					onClick={() => onChange(o.value)}
					aria-pressed={value === o.value}
					className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${value === o.value ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
				>
					{o.label}
				</button>
			))}
		</div>
	);
}
