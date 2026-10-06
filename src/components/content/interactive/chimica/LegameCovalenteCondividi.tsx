'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, Readout, Label, Dot, frame, v, add, type V, INK } from '../kit';

/**
 * Lesson 63 (Il legame covalente): two atoms, picked among five pairs, and the pairs of electrons they share, which
 * the student sets from zero to three. The shared pairs are the red dots between the two symbols; what each atom
 * keeps is drawn around it as in a Lewis symbol, lone pairs and single electrons. Under each atom: how many electrons
 * it has around it, counting the shared pairs in full, against the eight it needs (two for hydrogen).
 *
 * Only one number of shared pairs gives both atoms what they need; then the figure names the bond and gives its
 * length and energy, the values of the tables of lessons 62 and 63.
 */

type Atom = { sym: string; nome: string; valence: number; target: number };
const H: Atom = { sym: 'H', nome: 'idrogeno', valence: 1, target: 2 };
const CL: Atom = { sym: 'Cl', nome: 'cloro', valence: 7, target: 8 };
const O: Atom = { sym: 'O', nome: 'ossigeno', valence: 6, target: 8 };
const N: Atom = { sym: 'N', nome: 'azoto', valence: 5, target: 8 };

const PAIRS: { label: string; a: Atom; b: Atom; length: number; energy: number }[] = [
	{ label: 'H e H', a: H, b: H, length: 74, energy: 436 },
	{ label: 'Cl e Cl', a: CL, b: CL, length: 199, energy: 243 },
	{ label: 'O e O', a: O, b: O, length: 121, energy: 498 },
	{ label: 'N e N', a: N, b: N, length: 110, energy: 945 },
	{ label: 'H e Cl', a: H, b: CL, length: 127, energy: 431 }
];

const ORDER_NAME = ['nessun legame', 'legame singolo', 'legame doppio', 'legame triplo'];
const BOND = ['', '−', '=', '≡'];

const f = frame(-3.4, 3.4, -1.75, 1.35);
const AX = -0.85;
const BX = 0.85;

/** What an atom keeps for itself with k electrons in the bonds: lone pairs and single electrons. */
function own(atom: Atom, k: number) {
	const unpaired = Math.min(atom.valence, 8 - atom.valence, atom.target === 2 ? 1 : 4);
	const left = atom.valence - k;
	if (k <= unpaired) return { pairs: (atom.valence - unpaired) / 2, singles: unpaired - k };
	return { pairs: Math.floor(left / 2), singles: left % 2 };
}

/** The dots around an atom at x: lone pairs on the outer side, above and below; single electrons from the inner side. */
function dots(x: number, side: 1 | -1, pairs: number, singles: number): V[] {
	const c = v(x, 0);
	const slots: { at: V; along: V }[] = [
		{ at: v(-side * 0.42, 0), along: v(0, 1) },
		{ at: v(0, 0.36), along: v(1, 0) },
		{ at: v(0, -0.36), along: v(1, 0) },
		{ at: v(side * 0.42, 0), along: v(0, 1) }
	];
	const out: V[] = [];
	for (let i = 0; i < pairs && i < 4; i++) {
		out.push(add(c, add(slots[i].at, v(slots[i].along.x * 0.09, slots[i].along.y * 0.09))));
		out.push(add(c, add(slots[i].at, v(-slots[i].along.x * 0.09, -slots[i].along.y * 0.09))));
	}
	for (let j = 0; j < singles; j++) {
		const slot = slots[3 - j];
		if (3 - j >= pairs) out.push(add(c, slot.at));
	}
	return out;
}

export default function LegameCovalenteCondividi({ alt }: { alt?: string }) {
	const [i, setI] = useState(1);
	const [k, setK] = useState(0);
	const pair = PAIRS[i];
	const max = Math.min(3, pair.a.valence, pair.b.valence);

	const around = (atom: Atom) => atom.valence - k + 2 * k;
	const na = around(pair.a);
	const nb = around(pair.b);
	const ok = na === pair.a.target && nb === pair.b.target;
	const oa = own(pair.a, k);
	const ob = own(pair.b, k);

	// the shared pairs, stacked between the two atoms
	const ys = k === 1 ? [0] : k === 2 ? [0.11, -0.11] : k === 3 ? [0.2, 0, -0.2] : [];
	const status = (atom: Atom, n: number) => (n === atom.target ? `${n} elettroni: a posto` : n < atom.target ? `${n} elettroni su ${atom.target}` : `${n} elettroni: troppi`);
	const colour = (atom: Atom, n: number) => (n === atom.target ? INK.green : n > atom.target ? INK.red : '#000');

	let caption: string;
	if (ok) {
		caption = `Con ${k === 1 ? 'una coppia' : k === 2 ? 'due coppie' : 'tre coppie'} in comune tutti e due gli atomi sono a posto: è un ${ORDER_NAME[k]}, ${pair.a.sym}${BOND[k]}${pair.b.sym}, lungo ${pair.length} pm e con un’energia di ${pair.energy} kJ/mol.`;
	} else if (k === 0) {
		const need = (a: Atom) => `${a.target - a.valence === 1 ? 'manca 1 elettrone' : `mancano ${a.target - a.valence} elettroni`}`;
		caption = pair.a === pair.b ? `Atomi separati: a ciascuno ${need(pair.a)}. Metti in comune una coppia.` : `Atomi separati: all’${pair.a.nome} ${need(pair.a)}, al ${pair.b.nome} ${need(pair.b)}. Metti in comune una coppia.`;
	} else if (na > pair.a.target || nb > pair.b.target) {
		caption = 'Troppe coppie in comune: un atomo ha intorno più elettroni di quelli che il suo livello esterno può tenere. Togline una.';
	} else {
		caption = 'Ancora troppo poche: agli atomi mancano elettroni. Ogni coppia in più ne porta uno a ciascuno.';
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Label f={f} at={v(AX, 0)} upright size={20}>
					{pair.a.sym}
				</Label>
				<Label f={f} at={v(BX, 0)} upright size={20}>
					{pair.b.sym}
				</Label>
				{dots(AX, 1, oa.pairs, oa.singles).map((p, j) => (
					<Dot key={`a${j}`} f={f} at={p} r={2.6} />
				))}
				{dots(BX, -1, ob.pairs, ob.singles).map((p, j) => (
					<Dot key={`b${j}`} f={f} at={p} r={2.6} />
				))}
				{ys.map((y) => (
					<g key={y}>
						<Dot f={f} at={v(-0.09, y)} r={2.6} color={INK.red} />
						<Dot f={f} at={v(0.09, y)} r={2.6} color={INK.red} />
					</g>
				))}
				<Label f={f} at={v(-1.75, -1.0)} upright size={13} color={colour(pair.a, na)}>
					{status(pair.a, na)}
				</Label>
				<Label f={f} at={v(1.75, -1.0)} upright size={13} color={colour(pair.b, nb)}>
					{status(pair.b, nb)}
				</Label>
				<Label f={f} at={v(0, -1.5)} upright size={12}>
					{k === 0 ? 'nessuna coppia in comune' : `${k === 1 ? '1 coppia' : `${k} coppie`} in comune (in rosso)`}
				</Label>
			</Drawing>

			<Readout>
				<span>ordine di legame: {k}</span>
				<span>{ORDER_NAME[k]}</span>
				{ok && (
					<span>
						{pair.length} pm, {pair.energy} kJ/mol
					</span>
				)}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex flex-wrap justify-center gap-1.5">
					{PAIRS.map((p, j) => (
						<button
							key={p.label}
							type="button"
							onClick={() => {
								setI(j);
								setK(0);
							}}
							aria-pressed={j === i}
							className={`rounded-full border px-3 py-1 text-sm transition-colors ${j === i ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
						>
							{p.label}
						</button>
					))}
				</div>
				<div className="flex items-center justify-center gap-3">
					<span className="text-sm text-fg">Coppie in comune</span>
					<Button variant="secondary" size="sm" aria-label="Togli una coppia in comune" disabled={k <= 0} onClick={() => setK(k - 1)}>
						<Minus className="size-4" aria-hidden="true" />
					</Button>
					<span className="w-6 text-center font-mono text-sm tabular-nums text-fg" aria-live="polite">
						{k}
					</span>
					<Button variant="secondary" size="sm" aria-label="Aggiungi una coppia in comune" disabled={k >= max} onClick={() => setK(k + 1)}>
						<Plus className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</Controls>
		</Figure>
	);
}
