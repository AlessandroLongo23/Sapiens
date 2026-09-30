'use client';

import type { ReactNode } from 'react';
import { FONT, THIN, v, type Frame, type V } from '../kit';

/**
 * Pieces shared by the heat figures of the second year (group 20: lessons 68-70, equilibrio termico, propagazione del
 * calore, passaggi di stato): the tint of a body at a temperature, the data of the materials, and a graph's numbered
 * ticks. Everything in TikZ centimetres, y upwards, like the rest of the kit.
 *
 * Data of the materials: specific heats from Wikipedia, "Table of specific heat capacities" (at 25 °C), thermal
 * conductivities from "List of thermal conductivities" (around 20 °C), densities rounded; read on 30 September 2026.
 * Water's specific heat is the Amaldi's 4186 J/(kg·°C) (Fisica.verde, Zanichelli 2017, chapter 13).
 */

/** Mixes two #rrggbb colours: 0 gives a, 1 gives b. */
function mix(a: string, b: string, k: number) {
	const p = (s: string, i: number) => parseInt(s.slice(1 + 2 * i, 3 + 2 * i), 16);
	const c = [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * k));
	return `#${c.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

const COLD = '#b3c7ff'; // blue!30 on white, a little softened
const MILD = '#f2f2f2';
const HOT = '#ffb3a6'; // red!30 with a touch of orange

/**
 * The fill of a body at temperature t, between `lo` (a cold blue tint) and `hi` (a warm red tint), through a pale grey
 * halfway. Tints only: the dark theme's inversion keeps them tints.
 */
export function heatTint(t: number, lo = 0, hi = 100) {
	const k = Math.min(1, Math.max(0, (t - lo) / (hi - lo)));
	return k < 0.5 ? mix(COLD, MILD, k * 2) : mix(MILD, HOT, (k - 0.5) * 2);
}

/** A colour for a curve or a mark that has to read on a white ground: the same scale, darker. */
export function heatInk(t: number, lo = 0, hi = 100) {
	const k = Math.min(1, Math.max(0, (t - lo) / (hi - lo)));
	return k < 0.5 ? mix('#1f4fd6', '#6b6b6b', k * 2) : mix('#6b6b6b', '#d63a1f', (k - 0.5) * 2);
}

export type Material = { nome: string; c: number; lambda: number; densita: number };

/** Specific heat c in J/(kg·°C), thermal conductivity λ in W/(m·K), density in kg/m³. */
export const MATERIALS = {
	acqua: { nome: 'acqua', c: 4186, lambda: 0.6, densita: 1000 },
	alluminio: { nome: 'alluminio', c: 897, lambda: 237, densita: 2700 },
	ferro: { nome: 'ferro', c: 449, lambda: 80, densita: 7870 },
	rame: { nome: 'rame', c: 385, lambda: 401, densita: 8960 },
	piombo: { nome: 'piombo', c: 129, lambda: 35, densita: 11340 },
	acciaio: { nome: 'acciaio inox', c: 500, lambda: 16, densita: 8000 },
	vetro: { nome: 'vetro', c: 840, lambda: 1.0, densita: 2500 },
	legno: { nome: 'legno', c: 1700, lambda: 0.12, densita: 500 },
} as const satisfies Record<string, Material>;

/** Plain text in the drawing (numbers, words), upright, centred on `at` or anchored like SVG. */
export function Words({ f, at, children, anchor = 'middle', size = 13, color = '#000', dy = '0.35em' }: { f: Frame; at: V; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; color?: string; dy?: string }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy={dy} textAnchor={anchor} fontSize={size} fontFamily={FONT} fill={color} pointerEvents="none">
			{children}
		</text>
	);
}

/**
 * The numbered ticks of a graph drawn inside a figure: on the x axis at `xs` (cm) with `xl` as their text, on the y
 * axis at `ys` with `yl`. The axes themselves are fisica.tsx's Axes.
 */
export function Ticks({ f, o = v(0, 0), xs = [], xl = [], ys = [], yl = [], size = 11 }: { f: Frame; o?: V; xs?: number[]; xl?: string[]; ys?: number[]; yl?: string[]; size?: number }) {
	const d: string[] = [];
	xs.forEach((x) => d.push(f.path([v(x, o.y + 0.06), v(x, o.y - 0.06)])));
	ys.forEach((y) => d.push(f.path([v(o.x + 0.06, y), v(o.x - 0.06, y)])));
	return (
		<g pointerEvents="none">
			<path d={d.join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
			{xs.map((x, i) => (
				<Words key={`x${i}`} f={f} at={v(x, o.y - 0.12)} dy="0.8em" size={size}>
					{xl[i]}
				</Words>
			))}
			{ys.map((y, i) => (
				<Words key={`y${i}`} f={f} at={v(o.x - 0.12, y)} anchor="end" size={size}>
					{yl[i]}
				</Words>
			))}
		</g>
	);
}
