'use client';

import type { ReactNode } from 'react';
import { THICK, THIN, v, add, sub, scale, len, unit, rot, type Frame, type V } from '../kit';
import { Arrow, type Weight } from '../fisica';

/**
 * Pieces shared by the figures of chemistry, third year, group G (lessons 69-71: molecole polari e apolari, legame di
 * valenza, ibridazione): atoms as the lessons' TikZ draws them (a tinted circle with the symbol), orbital lobes
 * (the teardrop of the TikZ figures, tinted by the sign of the wave function as in lesson 52), and the row of small
 * buttons that picks a case. Everything in TikZ centimetres, y upwards.
 */

/** Fills of the atoms, the TikZ tints of the lessons: O red!20, H blue!10, C gray!20, Cl green!20, S yellow!40. */
export const ATOM_FILL = { O: '#ffcccc', H: '#e6e6ff', C: '#e6e6e6', Cl: '#ccffcc', S: '#ffff99' } as const;
/** The two signs of the wave function: blue!10 and red!15, as in the TikZ of lessons 70 and 71. */
export const SIGN_FILL = { plus: '#e6e6ff', minus: '#ffd9d9' } as const;
/** Where two lobes of the same sign overlap (orange!50), and where two of opposite sign do (gray!40). */
export const OVERLAP = '#ffbf80';
export const CANCEL = '#999999';
/** A hybrid orbital and its box: orange!25. A lone pair's lobe: yellow!40. */
export const HYBRID = '#ffdfbf';
/** A bond dipole (TikZ `blue`) and the molecule's dipole, their sum (TikZ `orange!90!black`). */
export const DIPOLE = '#0000ff';
export const RESULTANT = '#e67300';

/** An atom: a tinted circle of radius r (cm) with its symbol. */
export function Atom({ f, at, r, fill, children }: { f: Frame; at: V; r: number; fill: string; children?: ReactNode }) {
	const p = f.px(at);
	const K = f.W / (f.x1 - f.x0);
	return (
		<g pointerEvents="none">
			<circle cx={p.x} cy={p.y} r={r * K} fill={fill} stroke="#000" strokeWidth={THICK} />
			{children !== undefined && (
				<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={Math.min(15, r * K * 1.15)} fontFamily="KaTeX_Main, 'Times New Roman', serif" fill="#000">
					{children}
				</text>
			)}
		</g>
	);
}

/**
 * The outline of a lobe that starts at the nucleus `at`, points in the direction `th` (radians) and is `L` long and
 * `w` wide at most on each side: the two Béziers of the lessons' TikZ.
 */
export function lobePath(f: Frame, at: V, th: number, L: number, w: number): string {
	const P = (x: number, y: number) => {
		const q = f.px(add(at, rot(v(x, y), th)));
		return `${q.x.toFixed(2)},${q.y.toFixed(2)}`;
	};
	return `M${P(0, 0)} C${P(0.25 * L, 1.1 * w)} ${P(L, w)} ${P(L, 0)} C${P(L, -w)} ${P(0.25 * L, -1.1 * w)} ${P(0, 0)} Z`;
}

/** The outline of a circle (an s orbital), as a path, so it can clip like a lobe. */
export function circlePath(f: Frame, at: V, r: number): string {
	const p = f.px(at);
	const R = (r * f.W) / (f.x1 - f.x0);
	return `M${(p.x - R).toFixed(2)},${p.y.toFixed(2)} a${R.toFixed(2)},${R.toFixed(2)} 0 1,0 ${(2 * R).toFixed(2)},0 a${R.toFixed(2)},${R.toFixed(2)} 0 1,0 ${(-2 * R).toFixed(2)},0 Z`;
}

/** A lobe drawn: filled and outlined. */
export function Lobe({ f, at, th, L, w, fill, opacity, thin = false }: { f: Frame; at: V; th: number; L: number; w: number; fill: string; opacity?: number; thin?: boolean }) {
	if (L < 0.02) return null;
	return <path d={lobePath(f, at, th, L, w)} fill={fill} stroke="#000" strokeWidth={thin ? THIN : THICK} opacity={opacity} pointerEvents="none" />;
}

/** A row of small round buttons, one pressed: for choices whose labels are too long for a ToggleGroup on a phone. */
export function Pills<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T | null; onChange: (x: T) => void }) {
	return (
		<div role="group" aria-label={label} className="flex flex-wrap justify-center gap-1.5">
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

/**
 * The arrow of a dipole moment as lesson 64 draws it: towards the more electronegative atom, with a small cross on the
 * tail, on the side of δ+.
 */
export function DipoleArrow({ f, from, to, color, weight = 'thick' }: { f: Frame; from: V; to: V; color: string; weight?: Weight }) {
	const L = len(sub(to, from));
	if (L < 0.05) return null;
	const u = unit(sub(to, from));
	const at = add(from, scale(u, Math.min(0.15, L * 0.25)));
	const n = scale(v(-u.y, u.x), 0.1);
	return (
		<g pointerEvents="none">
			<Arrow f={f} from={from} to={to} color={color} weight={weight} />
			<path d={f.path([add(at, n), sub(at, n)])} stroke={color} strokeWidth={weight === 'veryThick' ? 1.8 : THICK} />
		</g>
	);
}
