'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { IONIZATION, shells } from '@/lib/exercises/v2/chim3-a';
import { Drawing, Figure, Caption, Controls, Readout, Label, frame, v, num, TINT, THICK, THIN, VERY_THIN } from '../kit';

/**
 * Lesson 50 (Livelli e sottolivelli di energia), "Le undici energie del sodio": the successive ionisation energies
 * of an element from hydrogen to calcium as columns on a logarithmic scale (each tick ten times the one below). A
 * slider picks the element, another the ionisation to read: its value and the ratio with the one before. The columns
 * of one level share a tint and a bracket with the level's name, so the tint carries nothing by itself; the big jumps
 * fall where the level changes. Under the drawing: the electrons level by level, from the nucleus.
 *
 * Data: IONIZATION of src/lib/exercises/v2/chim3-a.ts (kJ/mol), the same the exercises use.
 */

const NAMES = ['idrogeno', 'elio', 'litio', 'berillio', 'boro', 'carbonio', 'azoto', 'ossigeno', 'fluoro', 'neon', 'sodio', 'magnesio', 'alluminio', 'silicio', 'fosforo', 'zolfo', 'cloro', 'argon', 'potassio', 'calcio'];
const SYMBOLS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
const TINTS = [TINT.blue20, TINT.orange, TINT.green, TINT.red];

const PLOT_W = 9.4, PLOT_H = 5;
const LOG0 = 2.5, LOG1 = 6;
const f = frame(-1.0, 9.9, -1.75, 5.85);
const yOf = (e: number) => ((Math.log10(e) - LOG0) / (LOG1 - LOG0)) * PLOT_H;
/** 13354 → "13 354", with a narrow no-break space from 10 000 on. */
const thousands = (n: number) => (n < 10000 ? String(n) : String(n).replace(/\B(?=(\d{3})+$)/g, ' '));

export default function LivelliIonizzazioni({ alt }: { alt?: string }) {
	const [z, setZ] = useState(11);
	const [picked, setPicked] = useState(2);
	const energies = IONIZATION[z - 1];
	const k = Math.min(picked, z);
	const levels = shells(z); // from the nucleus
	// The k-th electron removed belongs to this level: the outermost goes first.
	const levelOf = (i: number) => {
		let left = i;
		for (let n = levels.length; n >= 1; n--) {
			if (left <= levels[n - 1]) return n;
			left -= levels[n - 1];
		}
		return 1;
	};
	const slot = Math.min(0.85, PLOT_W / z);
	const xOf = (i: number) => (i - 0.5) * slot + (PLOT_W - slot * z) / 2;
	const groups: { n: number; from: number; to: number }[] = [];
	for (let i = 1; i <= z; i++) {
		const n = levelOf(i);
		const last = groups.at(-1);
		if (last && last.n === n) last.to = i;
		else groups.push({ n, from: i, to: i });
	}
	const ratio = k > 1 ? energies[k - 1] / energies[k - 2] : null;
	const jump = k > 1 && levelOf(k) !== levelOf(k - 1);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{[3, 4, 5, 6].map((p) => (
					<g key={p}>
						<path d={f.path([v(0, yOf(10 ** p)), v(PLOT_W, yOf(10 ** p))])} stroke="#b0b0b0" strokeWidth={VERY_THIN} />
						<Label f={f} at={v(-0.05, yOf(10 ** p))} dir={v(-1, 0)} upright size={12}>
							{`10${['³', '⁴', '⁵', '⁶'][p - 3]}`}
						</Label>
					</g>
				))}
				<Label f={f} at={v(-0.9, PLOT_H + 0.35)} dir={v(1, 1)} upright size={12}>
					energia (kJ/mol)
				</Label>
				{energies.map((e, i) => {
					const x = xOf(i + 1);
					const top = f.px(v(x - slot * 0.36, yOf(e)));
					const base = f.px(v(x + slot * 0.36, 0));
					const sel = i + 1 === k;
					return <rect key={i} x={top.x} y={top.y} width={base.x - top.x} height={base.y - top.y} fill={TINTS[(levelOf(i + 1) - 1) % TINTS.length]} stroke="#000" strokeWidth={sel ? THICK * 1.6 : THIN} />;
				})}
				<path d={f.path([v(0, PLOT_H + 0.2), v(0, 0), v(PLOT_W, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(xOf(k), yOf(energies[k - 1]) + 0.05)} dir={v(0, 1)} upright size={12}>
					{thousands(energies[k - 1])}
				</Label>
				{energies.map((_, i) =>
					z <= 12 || (i + 1) % 2 === 1 || i + 1 === z ? (
						<Label key={i} f={f} at={v(xOf(i + 1), -0.05)} dir={v(0, -1)} upright size={11}>
							{i + 1}
						</Label>
					) : null
				)}
				{groups.map((g) => {
					const a = xOf(g.from) - slot * 0.42, b = xOf(g.to) + slot * 0.42;
					return (
						<g key={g.n}>
							<path d={f.path([v(a, -0.62), v(a, -0.74), v(b, -0.74), v(b, -0.62)])} stroke="#000" strokeWidth={THIN} fill="none" />
							<Label f={f} at={v((a + b) / 2, -0.76)} dir={v(0, -1)} upright size={11}>
								{`n = ${g.n}`}
							</Label>
						</g>
					);
				})}
				<Label f={f} at={v(PLOT_W / 2, -1.25)} dir={v(0, -1)} upright size={12}>
					ionizzazione
				</Label>
			</Drawing>
			<Readout>
				<span>
					{NAMES[z - 1]} ({SYMBOLS[z - 1]}), {z} {z === 1 ? 'elettrone' : 'elettroni'}
				</span>
				<span>elettroni per livello, dal nucleo: {levels.join(', ')}</span>
				<span>
					{k}ª ionizzazione: {thousands(energies[k - 1])} kJ/mol
				</span>
				{ratio !== null && (
					<span>
						rapporto con la {k - 1}ª: {num(ratio, 1)}
					</span>
				)}
			</Readout>
			<Caption>
				{k === 1
					? `La prima ionizzazione toglie l'elettrone più esterno, del livello n = ${levelOf(1)}.`
					: jump
						? `Qui c'è un salto: l'energia è ${num(ratio!, 1)} volte la precedente, perché questo elettrone è del livello n = ${levelOf(k)}, più vicino al nucleo.`
						: `Stesso livello dell'elettrone precedente (n = ${levelOf(k)}): l'energia cresce di poco, ${num(ratio!, 1)} volte.`}
			</Caption>
			<Controls>
				<Slider label="Elemento (Z)" value={z} min={1} max={20} step={1} onChange={setZ} />
				<Slider label="Ionizzazione" value={k} min={1} max={Math.max(z, 2)} step={1} onChange={(x) => setPicked(Math.min(x, z))} />
			</Controls>
		</Figure>
	);
}
