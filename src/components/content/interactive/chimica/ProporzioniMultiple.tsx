'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, K, THIN, TINT, FONT } from '../kit';
import { Sphere } from './sfereDalton';

/**
 * Lesson 25 (La legge di Dalton delle proporzioni multiple): the compounds that an element X forms with oxygen, one
 * row each. Each row has the molecule drawn with Dalton's spheres and a bar as long as the mass of oxygen joined to the
 * mass m of X chosen with the slider. The longest bar is always as long, so that the ratios read at any m; the bars are cut into equal pieces, each the oxygen of one O atom for every L
 * atoms of X (L the least common multiple of the indices of X): every bar is a whole number of pieces, and those
 * numbers are the ratios of the law. Moving m, the masses change and the ratios stay.
 *
 * Masses from the table of lesson 01 (H 1,01; C 12,01; N 14,01; O 16,00; S 32,07; Fe 55,85).
 */

type Compound = { tex: string; a: number; b: number };
type Series = { x: string; nome: string; A: number; comps: Compound[] };

const O = 16.0;
const SERIES: Record<string, Series> = {
	C: { x: 'C', nome: 'carbonio', A: 12.01, comps: [{ tex: 'CO', a: 1, b: 1 }, { tex: 'CO_2', a: 1, b: 2 }] },
	N: {
		x: 'N',
		nome: 'azoto',
		A: 14.01,
		comps: [
			{ tex: 'N_2O', a: 2, b: 1 },
			{ tex: 'NO', a: 1, b: 1 },
			{ tex: 'N_2O_3', a: 2, b: 3 },
			{ tex: 'NO_2', a: 1, b: 2 },
			{ tex: 'N_2O_5', a: 2, b: 5 },
		],
	},
	S: { x: 'S', nome: 'zolfo', A: 32.07, comps: [{ tex: 'SO_2', a: 1, b: 2 }, { tex: 'SO_3', a: 1, b: 3 }] },
	H: { x: 'H', nome: 'idrogeno', A: 1.01, comps: [{ tex: 'H_2O', a: 2, b: 1 }, { tex: 'H_2O_2', a: 2, b: 2 }] },
	Fe: { x: 'Fe', nome: 'ferro', A: 55.85, comps: [{ tex: 'FeO', a: 1, b: 1 }, { tex: 'Fe_2O_3', a: 2, b: 3 }] },
};
const KEYS = ['C', 'N', 'S', 'H', 'Fe'] as const;
type Key = (typeof KEYS)[number];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

/** Grams of oxygen joined to 1 g of X in X_aO_b. */
const perGram = (s: Series, c: Compound) => (c.b * O) / (c.a * s.A);

/** Grams with two decimals and the decimal comma. */
const g2 = (x: number) => x.toFixed(2).replace('.', ',');

const ROW = 0.78;
const ROWS = 5;
const BAR0 = 3.6;
const BARMAX = 3.6; // cm, for the largest mass of the series
const M_MAX = 10;
const f = frame(-0.1, 8.75, 0, ROWS * ROW + 0.2);

/** A formula for SVG text: letters with the digits lowered. */
function FormulaText({ x, y, tex }: { x: number; y: number; tex: string }) {
	const parts = tex.split(/_(\d)/);
	const p = f.px(v(x, y));
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily={FONT} fill="#000" pointerEvents="none">
			{parts.map((s, i) =>
				i % 2 ? (
					<tspan key={i} fontSize={10} dy={4}>
						{s}
					</tspan>
				) : (
					<tspan key={i} dy={i ? -4 : 0}>
						{s}
					</tspan>
				),
			)}
		</text>
	);
}

/** The molecule X_aO_b as a row of overlapping spheres, centred on x. */
function Molecule({ s, c, x, y }: { s: Series; c: Compound; x: number; y: number }) {
	const atoms = [...Array(c.a).fill(s.x), ...Array(c.b).fill('O')] as string[];
	const step = 0.34;
	const x0 = x - ((atoms.length - 1) * step) / 2;
	return (
		<g>
			{atoms.map((el, i) => (
				<Sphere key={i} f={f} at={v(x0 + i * step, y)} el={el} r={0.2} />
			))}
		</g>
	);
}

export default function ProporzioniMultiple({ alt }: { alt?: string }) {
	const [key, setKey] = useState<Key>('C');
	const [m, setM] = useState(3);
	const s = SERIES[key];
	const L = s.comps.map((c) => c.a).reduce(lcm, 1);
	// pieces of each bar: oxygen atoms for L atoms of X
	const pieces = s.comps.map((c) => (c.b * L) / c.a);
	const g = pieces.reduce(gcd);
	const units = pieces.map((p) => p / g);
	const masses = s.comps.map((c) => m * perGram(s, c));
	const maxPer = Math.max(...s.comps.map((c) => perGram(s, c)));
	const cmPerGram = BARMAX / (m * maxPer);
	const n = s.comps.length;
	const top = f.y1 - 0.1 - ((ROWS - n) * ROW) / 2;
	const ratio = units.join(' : ');
	const smallest = masses[units.indexOf(Math.min(...units))];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{s.comps.map((c, i) => {
					const y = top - ROW * (i + 0.5);
					const len = masses[i] * cmPerGram;
					const piece = len / units[i];
					return (
						<g key={c.tex}>
							<Molecule s={s} c={c} x={1.2} y={y} />
							<FormulaText x={3.1} y={y} tex={c.tex} />
							<rect x={f.px(v(BAR0, y + 0.2)).x} y={f.px(v(BAR0, y + 0.2)).y} width={len * K} height={0.4 * K} fill={TINT.red} stroke="#000" strokeWidth={THIN * 1.6} />
							{Array.from({ length: units[i] - 1 }, (_, k) => (
								<path key={k} d={f.path([v(BAR0 + piece * (k + 1), y + 0.2), v(BAR0 + piece * (k + 1), y - 0.2)])} stroke="#000" strokeWidth={THIN} />
							))}
							<text x={f.px(v(BAR0 + len + 0.12, y)).x} y={f.px(v(0, y)).y} dy="0.35em" fontSize={13} fontFamily={FONT} fill="#000" pointerEvents="none">
								{g2(masses[i])} g
							</text>
						</g>
					);
				})}
			</Drawing>

			<Readout>
				{s.comps.map((c, i) => (
					<span key={c.tex}>
						<Tex>{`\\mathrm{${c.tex}}`}</Tex>: <Tex>{`${g2(masses[i]).replace(',', '{,}')}\\,\\text{g}`}</Tex> di O
					</span>
				))}
			</Readout>
			<Caption>
				Con {num(m, 1)} g di {s.nome} le masse di ossigeno stanno come {ratio}: ogni barra è fatta di tratti uguali, ognuno di {g2(smallest / Math.min(...units))} g di ossigeno, presi un numero intero di volte. Cambiando la massa di {s.nome} le masse cambiano, il rapporto no.
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Elemento unito all'ossigeno" options={KEYS.map((k) => ({ value: k, label: `${k} e O` }))} value={key} onChange={setKey} />
				</div>
				<Slider label={`Massa di ${s.nome} (g)`} value={m} min={1} max={M_MAX} step={0.5} onChange={setM} />
			</Controls>
		</Figure>
	);
}
