'use client';

import { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { ELEMENTI } from '@/lib/tools/tavola-periodica';
import { boxOccupation, diagonalConfiguration, electronsBySublevel } from '@/lib/orbitali/configurazione';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, TINT, THIN, THICK, FONT } from '../kit';

/**
 * Lesson 53 (La configurazione elettronica): a box diagram the student fills. An element among the first thirty is
 * chosen, and a touch on a box adds an arrow up or down, or takes one away. The figure reads the diagram and names
 * the first rule it breaks: Pauli (two arrows of the same spin in a box), the filling order (an electron in a
 * sublevel while one of lower energy is not full), Hund (a pair while a box of the sublevel is empty, or single
 * arrows that are not parallel). Chromium and copper are accepted with their real configuration, and the one the
 * rule of the diagonal gives is answered with the exception.
 */

/** The sublevels drawn, in the order they fill: [name, boxes, row, x of the first box]. */
const B = 0.8;
const GAP = 0.3;
const ROW_Y = [1.75, 0];
const SUBS: { name: string; boxes: number; row: number; x: number }[] = (() => {
	const rows: [string, number][][] = [
		[['1s', 1], ['2s', 1], ['2p', 3], ['3s', 1], ['3p', 3]],
		[['4s', 1], ['3d', 5]]
	];
	const order = ['1s', '2s', '2p', '3s', '3p', '4s', '3d'];
	const out: { name: string; boxes: number; row: number; x: number }[] = [];
	rows.forEach((row, r) => {
		let x = 0;
		for (const [name, boxes] of row) {
			out.push({ name, boxes, row: r, x });
			x += boxes * B + GAP;
		}
	});
	return out.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
})();
const f = frame(-0.15, 8.55, -0.6, 2.85);
const MAX_Z = 30;

type Box = { up: number; down: number };
type Diagram = Box[][];
type Mode = 'su' | 'giu' | 'togli';

const empty = (): Diagram => SUBS.map((s) => Array.from({ length: s.boxes }, () => ({ up: 0, down: 0 })));
const total = (boxes: Box[]) => boxes.reduce((n, b) => n + b.up + b.down, 0);

/** The ground state of an element as a diagram, by Hund's rule, from the real configuration. */
function groundState(z: number): Diagram {
	const real = electronsBySublevel(ELEMENTI[z - 1]);
	return SUBS.map((s) => boxOccupation((s.boxes - 1) / 2, real.get(s.name) ?? 0).map((k) => ({ up: k > 0 ? 1 : 0, down: k > 1 ? 1 : 0 })));
}

/** The diagram the figure opens with: carbon with the two 2p electrons paired in one box. */
function initial(): Diagram {
	const d = empty();
	d[0][0] = { up: 1, down: 1 };
	d[1][0] = { up: 1, down: 1 };
	d[2][0] = { up: 1, down: 1 };
	return d;
}

const configTex = (counts: number[]) =>
	counts
		.map((k, i) => (k > 0 ? `${SUBS[i].name}^{${k}}` : ''))
		.filter(Boolean)
		.join('\\,') || '\\text{nessun elettrone}';

/** "il sodio", "l'ossigeno", "lo zolfo", "lo scandio" */
const art = (name: string) => (/^(z|s[^aeiou])/.test(name) ? `lo ${name}` : /^[aeiou]/.test(name) ? `l'${name}` : `il ${name}`);

interface Verdict {
	text: string;
	/** "i-j": the boxes to colour. */
	bad: Set<string>;
	ok: boolean;
}

function judge(d: Diagram, z: number): Verdict {
	const el = ELEMENTI[z - 1];
	const counts = d.map(total);
	const placed = counts.reduce((a, b) => a + b, 0);
	const bad = new Set<string>();

	// Pauli
	d.forEach((boxes, i) => boxes.forEach((b, j) => (b.up > 1 || b.down > 1) && bad.add(`${i}-${j}`)));
	if (bad.size) return { text: 'Principio di Pauli violato: in una casella ci sono due frecce con lo stesso verso. Due elettroni nello stesso orbitale devono avere spin opposto.', bad, ok: false };

	// the filling order, with the two exceptions
	const real = SUBS.map((s) => electronsBySublevel(el).get(s.name) ?? 0);
	const rule = SUBS.map((s) => diagonalConfiguration(z).get(s.name) ?? 0);
	const isReal = counts.every((k, i) => k === real[i]);
	const exception = real.some((k, i) => k !== rule[i]);
	if (!isReal) {
		for (let i = 0; i < SUBS.length; i++) {
			if (counts[i] >= SUBS[i].boxes * 2) continue;
			const later = counts.findIndex((k, j) => j > i && k > 0);
			if (later < 0) break;
			d[later].forEach((b, j) => b.up + b.down > 0 && bad.add(`${later}-${j}`));
			return { text: `Ordine di riempimento violato: c'è un elettrone nel ${SUBS[later].name}, ma ${SUBS[i].name === '1s' ? "l'1s" : `il ${SUBS[i].name}`}, che ha meno energia, non è pieno.`, bad, ok: false };
		}
	}

	// Hund
	for (let i = 0; i < SUBS.length; i++) {
		const boxes = d[i];
		if (boxes.length === 1) continue;
		const paired = boxes.some((b) => b.up + b.down === 2);
		const free = boxes.some((b) => b.up + b.down === 0);
		const singles = boxes.filter((b) => b.up + b.down === 1);
		const mixed = singles.some((b) => b.up) && singles.some((b) => b.down);
		if (paired && free) {
			boxes.forEach((b, j) => b.up + b.down === 2 && bad.add(`${i}-${j}`));
			return { text: `Regola di Hund violata: nel ${SUBS[i].name} due elettroni sono appaiati mentre c'è ancora una casella vuota. Prima un elettrone per casella.`, bad, ok: false };
		}
		if (mixed) {
			boxes.forEach((b, j) => b.up + b.down === 1 && bad.add(`${i}-${j}`));
			return { text: `Regola di Hund violata: nel ${SUBS[i].name} gli elettroni spaiati non hanno tutti lo stesso verso.`, bad, ok: false };
		}
	}

	const name = el.name.toLowerCase();
	const has = `${art(name)} ne ha ${z}`;
	if (placed < z) return { text: `Fin qui le tre regole sono rispettate, ma gli elettroni messi sono ${placed} e ${has}: ${z - placed === 1 ? 'ne manca uno' : `ne mancano ${z - placed}`}.`, bad, ok: false };
	if (placed > z) return { text: `Le tre regole sono rispettate, ma gli elettroni messi sono ${placed} e ${has}: ${placed - z === 1 ? "ce n'è uno" : `ce ne sono ${placed - z}`} di troppo.`, bad, ok: false };
	if (exception && !isReal) return { text: `È la configurazione che dà la regola della diagonale, ma ${art(name)} è un'eccezione: un elettrone del 4s sta nel 3d, che così è ${real[6] === 5 ? 'pieno a metà' : 'pieno'}. Spostalo.`, bad, ok: false };
	const unpaired = d.flat().filter((b) => b.up + b.down === 1).length;
	return {
		text: `È lo stato fondamentale ${art(name).replace(/^il /, 'del ').replace(/^lo /, 'dello ').replace(/^l'/, "dell'")}${exception ? ', una delle due eccezioni alla regola della diagonale' : ''}. Elettroni spaiati: ${unpaired}.`,
		bad,
		ok: true
	};
}

function Arrow({ x, y, up }: { x: number; y: number; up: boolean }) {
	const a = f.px(v(x, y - 0.24));
	const b = f.px(v(x, y + 0.24));
	const [from, to] = up ? [a, b] : [b, a];
	const s = up ? 1 : -1;
	return (
		<g pointerEvents="none">
			<line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#000" strokeWidth={THICK} />
			<path d={`M${to.x - 3.2},${to.y + 5 * s} L${to.x},${to.y - 1.5 * s} L${to.x + 3.2},${to.y + 5 * s}`} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" strokeLinecap="round" />
		</g>
	);
}

export default function ConfigurazioneCaselle({ alt }: { alt?: string }) {
	const [z, setZ] = useState(6);
	const [d, setD] = useState<Diagram>(initial);
	const [mode, setMode] = useState<Mode>('su');

	const verdict = judge(d, z);
	const counts = d.map(total);
	const placed = counts.reduce((a, b) => a + b, 0);
	const el = ELEMENTI[z - 1];

	const touch = (i: number, j: number) =>
		setD((old) =>
			old.map((boxes, a) =>
				boxes.map((b, c) => {
					if (a !== i || c !== j) return b;
					if (mode === 'togli') return b.down > 0 ? { ...b, down: b.down - 1 } : b.up > 0 ? { ...b, up: b.up - 1 } : b;
					if (b.up + b.down >= 2) return b;
					return mode === 'su' ? { ...b, up: b.up + 1 } : { ...b, down: b.down + 1 };
				})
			)
		);

	const side = B * (f.W / (f.x1 - f.x0));
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{SUBS.map((s, i) => {
					const y = ROW_Y[s.row];
					return (
						<g key={s.name}>
							<Label f={f} at={v(s.x + (s.boxes * B) / 2, y + B / 2 + 0.28)} size={14}>
								<tspan fontFamily={FONT} fontStyle="normal">
									{s.name[0]}
								</tspan>
								{s.name[1]}
							</Label>
							{d[i].map((b, j) => {
								const x = s.x + j * B;
								const p = f.px(v(x, y + B / 2));
								const arrows = [...Array.from({ length: b.up }, () => true), ...Array.from({ length: b.down }, () => false)];
								const state = b.up + b.down === 0 ? 'vuota' : `${b.up + b.down === 1 ? 'un elettrone' : 'due elettroni'}`;
								return (
									<g key={j}>
										<rect
											x={p.x}
											y={p.y}
											width={side}
											height={side}
											fill={verdict.bad.has(`${i}-${j}`) ? TINT.red : 'transparent'}
											stroke="#000"
											strokeWidth={THIN}
											role="button"
											tabIndex={0}
											aria-label={`Casella ${j + 1} del sottolivello ${s.name}, ${state}`}
											className="cursor-pointer outline-none focus-visible:stroke-[2.5]"
											onClick={() => touch(i, j)}
											onKeyDown={(e) => {
												if (e.key !== 'Enter' && e.key !== ' ') return;
												e.preventDefault();
												touch(i, j);
											}}
										/>
										{arrows.map((up, k) => (
											<Arrow key={k} x={x + (arrows.length === 1 ? B / 2 : B * (k === 0 ? 0.33 : 0.67))} y={y} up={up} />
										))}
									</g>
								);
							})}
						</g>
					);
				})}
			</Drawing>

			<Readout>
				<span>
					{el.name} ({el.symbol}), <Tex>{`Z = ${z}`}</Tex>
				</span>
				<span>
					elettroni messi: {placed} su {z}
				</span>
				<span>
					<Tex>{configTex(counts)}</Tex>
				</span>
			</Readout>
			<Caption>
				{verdict.ok && <Check className="mr-1 inline size-4 align-text-bottom" aria-hidden="true" />}
				{verdict.text}
			</Caption>

			<Controls>
				<Slider label="Numero atomico Z" value={z} min={1} max={MAX_Z} step={1} onChange={setZ} />
				<div className="flex justify-center">
					<ToggleGroup
						label="Che cosa fa un tocco su una casella"
						options={[
							{ value: 'su', label: '↑ aggiungi' },
							{ value: 'giu', label: '↓ aggiungi' },
							{ value: 'togli', label: 'togli' }
						]}
						value={mode}
						onChange={setMode}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setD(empty())}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Svuota
					</Button>
					<Button variant="secondary" size="sm" onClick={() => setD(groundState(z))}>
						Mostra la soluzione
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
