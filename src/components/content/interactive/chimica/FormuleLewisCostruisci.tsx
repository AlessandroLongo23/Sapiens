'use client';

import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, add, sub, scale, unit, polar, FONT, THICK, type V } from '../kit';

/**
 * Lesson 67 (Le formule di Lewis delle molecole): the student builds a Lewis formula on a skeleton of single bonds. A
 * tap on an atom adds a lone pair to it (0, 1, 2, 3, then 0 again); a tap on a bond makes it double, triple, single
 * again. The readout counts the valence electrons to place, those placed and those around every atom; the symbol of an
 * atom turns green when its octet is complete (two electrons for hydrogen) and red when it has too many. "Controlla"
 * goes through the checks of the lesson in order: the total, no atom above its octet, every atom complete, the smallest
 * formal charges; once all the electrons are placed, the formal charges that are not zero are written next to the atoms.
 *
 * Only atoms of the first two periods, so the octet has no expanded exceptions; boron in BF₃ is complete with six.
 */

type Atom = { el: string; at: V; val: number; need: number };
type Item = {
	label: string;
	tex: string;
	charge: number;
	atoms: Atom[];
	bonds: [number, number][];
	/** The smallest sum of the absolute formal charges among the formulas that respect the octet. */
	best: number;
	how: string;
	/** Said when the octets are complete but the formal charges are not the smallest. */
	hint: string;
};

const H = (x: number, y: number): Atom => ({ el: 'H', at: v(x, y), val: 1, need: 2 });
const A = (el: string, val: number, x: number, y: number, need = 8): Atom => ({ el, at: v(x, y), val, need });
const D = 1.7;
const tri = (k: number) => polar(D, Math.PI / 2 + (k * 2 * Math.PI) / 3);

const ITEMS: Item[] = [
	{
		label: 'H₂O', tex: 'H_2O', charge: 0, best: 0,
		atoms: [A('O', 6, 0, 0.3), H(-1.45, -0.55), H(1.45, -0.55)],
		bonds: [[0, 1], [0, 2]],
		how: 'Due legami semplici e due coppie solitarie sull’ossigeno: 4 + 4 = 8 elettroni.',
		hint: '',
	},
	{
		label: 'NH₃', tex: 'NH_3', charge: 0, best: 0,
		atoms: [A('N', 5, 0, 0.3), H(-D, 0.3), H(D, 0.3), H(0, 0.3 - D)],
		bonds: [[0, 1], [0, 2], [0, 3]],
		how: 'Tre legami semplici e una coppia solitaria sull’azoto: 6 + 2 = 8 elettroni.',
		hint: '',
	},
	{
		label: 'CO₂', tex: 'CO_2', charge: 0, best: 0,
		atoms: [A('C', 4, 0, 0), A('O', 6, -D, 0), A('O', 6, D, 0)],
		bonds: [[0, 1], [0, 2]],
		how: 'Due doppi legami e due coppie solitarie su ogni ossigeno: 8 + 8 = 16 elettroni, e nessuna carica formale.',
		hint: 'Con un legame triplo e uno semplice un ossigeno ha carica formale +1 e l’altro −1. Prova con due legami doppi.',
	},
	{
		label: 'HCN', tex: 'HCN', charge: 0, best: 0,
		atoms: [A('C', 4, 0, 0), H(-D, 0), A('N', 5, D, 0)],
		bonds: [[0, 1], [0, 2]],
		how: 'Un legame semplice con l’idrogeno, un legame triplo con l’azoto e una coppia solitaria sull’azoto: 10 elettroni.',
		hint: '',
	},
	{
		label: 'CH₂O', tex: 'CH_2O', charge: 0, best: 0,
		atoms: [A('C', 4, 0, 0), A('O', 6, 0, D), H(-1.45, -0.85), H(1.45, -0.85)],
		bonds: [[0, 1], [0, 2], [0, 3]],
		how: 'Due legami semplici con gli idrogeni, un doppio legame con l’ossigeno e due coppie solitarie sull’ossigeno: 12 elettroni.',
		hint: '',
	},
	{
		label: 'CN⁻', tex: 'CN^-', charge: -1, best: 1,
		atoms: [A('C', 4, -D / 2, 0), A('N', 5, D / 2, 0)],
		bonds: [[0, 1]],
		how: 'Un legame triplo e una coppia solitaria su ciascun atomo: 6 + 4 = 10 elettroni. La carica formale −1 è sul carbonio.',
		hint: '',
	},
	{
		label: 'CO₃²⁻', tex: 'CO_3^{2-}', charge: -2, best: 2,
		atoms: [A('C', 4, 0, 0), A('O', 6, tri(0).x, tri(0).y), A('O', 6, tri(1).x, tri(1).y), A('O', 6, tri(2).x, tri(2).y)],
		bonds: [[0, 1], [0, 2], [0, 3]],
		how: 'Un doppio legame e due legami semplici: 24 elettroni. Il doppio legame può stare su uno qualunque dei tre ossigeni: sono tre formule di risonanza.',
		hint: '',
	},
	{
		label: 'BF₃', tex: 'BF_3', charge: 0, best: 0,
		atoms: [A('B', 3, 0, 0, 6), A('F', 7, tri(0).x, tri(0).y), A('F', 7, tri(1).x, tri(1).y), A('F', 7, tri(2).x, tri(2).y)],
		bonds: [[0, 1], [0, 2], [0, 3]],
		how: 'Tre legami semplici e tre coppie solitarie su ogni fluoro: 24 elettroni. Il boro resta con sei elettroni: è un’eccezione all’ottetto.',
		hint: 'Con un doppio legame il boro arriva a otto, ma il fluoro prende carica formale +1 e il boro −1. Il fluoro è l’elemento più elettronegativo e non cede elettroni: il boro resta con sei.',
	},
];

const f = frame(-3.1, 3.1, -2.1, 2.5);
const GREEN = '#008000', RED = '#ff0000';

/** Directions for the lone pairs of an atom: the free ones farthest from its bonds and from each other. */
function pairDirections(bonds: number[], n: number): number[] {
	const cand = Array.from({ length: 12 }, (_, k) => (k * Math.PI) / 6);
	const taken = [...bonds];
	const out: number[] = [];
	const gap = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
	for (let i = 0; i < n; i++) {
		let best = cand[0], score = -1;
		for (const c of cand) {
			// with no bond the first pair goes above, like the dots of a Lewis symbol
			const s = taken.length ? Math.min(...taken.map((t) => gap(c, t))) : c === Math.PI / 2 ? 9 : 0;
			if (s > score + 1e-9) {
				score = s;
				best = c;
			}
		}
		out.push(best);
		taken.push(best);
	}
	return out;
}

const press = (fn: () => void) => (e: KeyboardEvent<SVGGElement>) => {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		fn();
	}
};

export default function FormuleLewisCostruisci({ alt }: { alt?: string }) {
	const [i, setI] = useState(0);
	const item = ITEMS[i];
	const [orders, setOrders] = useState<number[]>(item.bonds.map(() => 1));
	const [pairs, setPairs] = useState<number[]>(item.atoms.map(() => 0));
	const [checked, setChecked] = useState(false);

	const pick = (k: number) => {
		setI(k);
		setOrders(ITEMS[k].bonds.map(() => 1));
		setPairs(ITEMS[k].atoms.map(() => 0));
		setChecked(false);
	};
	const cycleBond = (b: number) => {
		setOrders(orders.map((o, k) => (k === b ? (o % 3) + 1 : o)));
		setChecked(false);
	};
	const cyclePairs = (a: number) => {
		setPairs(pairs.map((p, k) => (k === a ? (p + 1) % 4 : p)));
		setChecked(false);
	};

	const total = item.atoms.reduce((s, a) => s + a.val, 0) - item.charge;
	const bonded = item.atoms.map((_, a) => item.bonds.reduce((s, [p, q], b) => s + (p === a || q === a ? orders[b] : 0), 0));
	const around = item.atoms.map((_, a) => 2 * pairs[a] + 2 * bonded[a]);
	const formal = item.atoms.map((at, a) => at.val - 2 * pairs[a] - bonded[a]);
	const used = 2 * orders.reduce((s, o) => s + o, 0) + 2 * pairs.reduce((s, p) => s + p, 0);
	const full = (a: number) => (item.atoms[a].el === 'H' ? 2 : 8);
	const name = (a: number) => item.atoms[a].el;

	let verdict: ReactNode = null;
	let right = false;
	if (checked) {
		const over = item.atoms.findIndex((_, a) => around[a] > full(a));
		const under = item.atoms.findIndex((at, a) => around[a] < at.need);
		if (used > total) verdict = `Hai sistemato ${used} elettroni, ma quelli di valenza sono ${total}: ce ne sono ${used - total} di troppo.`;
		else if (used < total) verdict = `Hai sistemato ${used} elettroni su ${total}: ne restano ${total - used}, cioè ${(total - used) / 2 === 1 ? 'una coppia' : `${(total - used) / 2} coppie`}.`;
		else if (over >= 0) verdict = `Il conto degli elettroni torna, ma ${name(over)} ne ha intorno ${around[over]}: il massimo è ${full(over)}.`;
		else if (under >= 0) verdict = `Il conto degli elettroni torna, ma ${name(under)} ne ha intorno solo ${around[under]}. Sposta una coppia solitaria di un atomo vicino tra i due atomi: diventa un legame in più.`;
		else if (formal.reduce((s, c) => s + Math.abs(c), 0) > item.best) verdict = `Il conto torna, ma le cariche formali non sono le più piccole possibili. ${item.hint}`;
		else {
			right = true;
			verdict = `Giusto. ${item.how}`;
		}
	}

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{item.bonds.map(([p, q], b) => {
					const P = item.atoms[p].at, Q = item.atoms[q].at;
					const u = unit(sub(Q, P));
					const n = v(-u.y, u.x);
					const s = add(P, scale(u, 0.36)), e = sub(Q, scale(u, 0.36));
					const offs = orders[b] === 1 ? [0] : orders[b] === 2 ? [-0.07, 0.07] : [-0.12, 0, 0.12];
					const label = `Legame tra ${name(p)} e ${name(q)}: ${['semplice', 'doppio', 'triplo'][orders[b] - 1]}. Premi per cambiarlo`;
					return (
						<g key={b} role="button" tabIndex={0} aria-label={label} className="cursor-pointer outline-none" onClick={() => cycleBond(b)} onKeyDown={press(() => cycleBond(b))}>
							<path d={f.path([s, e])} stroke="transparent" strokeWidth={26} />
							{offs.map((o) => (
								<path key={o} d={f.path([add(s, scale(n, o)), add(e, scale(n, o))])} stroke="#000" strokeWidth={THICK * 1.4} strokeLinecap="round" />
							))}
						</g>
					);
				})}
				{item.atoms.map((at, a) => {
					const p = f.px(at.at);
					const dirs = pairDirections(
						item.bonds.flatMap(([x, y]) => (x === a ? [Math.atan2(item.atoms[y].at.y - at.at.y, item.atoms[y].at.x - at.at.x)] : y === a ? [Math.atan2(item.atoms[x].at.y - at.at.y, item.atoms[x].at.x - at.at.x)] : [])),
						pairs[a]
					);
					const color = around[a] > full(a) ? RED : around[a] === full(a) ? GREEN : '#000';
					const fc = f.px(add(at.at, v(0.62, 0.55)));
					return (
						<g key={a} role="button" tabIndex={0} aria-label={`${at.el}: ${pairs[a]} coppie solitarie, ${around[a]} elettroni intorno. Premi per aggiungere una coppia`} className="cursor-pointer outline-none" onClick={() => cyclePairs(a)} onKeyDown={press(() => cyclePairs(a))}>
							<circle cx={p.x} cy={p.y} r={16} fill="transparent" />
							<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={22} fontFamily={FONT} fill={color}>
								{at.el}
							</text>
							{dirs.map((t, k) => {
								const c = add(at.at, polar(0.4, t));
								const w = polar(0.09, t + Math.PI / 2);
								const a1 = f.px(add(c, w)), a2 = f.px(sub(c, w));
								return (
									<g key={k} fill="#000">
										<circle cx={a1.x} cy={a1.y} r={2.4} />
										<circle cx={a2.x} cy={a2.y} r={2.4} />
									</g>
								);
							})}
							{used === total && formal[a] !== 0 && (
								<text x={fc.x} y={fc.y} textAnchor="middle" fontSize={12} fontFamily={FONT} fill="#0000ff">
									{formal[a] > 0 ? `+${formal[a]}` : `−${-formal[a]}`}
								</text>
							)}
						</g>
					);
				})}
			</Drawing>
			<p className="m-0 text-center text-lg text-fg">
				<Tex>{`\\mathrm{${item.tex}}`}</Tex>
			</p>
			<Readout>
				<span>elettroni di valenza: {total}</span>
				<span>sistemati: {used}</span>
				<span>
					intorno a ogni atomo:{' '}
					{item.atoms.map((at, a) => `${at.el} ${around[a]}`).join(', ')}
				</span>
			</Readout>
			<Caption>
				{verdict ?? (
					<>
						Tocca un atomo per dargli una coppia solitaria, tocca un legame per farlo diventare doppio o triplo. Quando hai sistemato tutti i {total} elettroni compaiono in blu le cariche formali diverse da zero: premi Controlla.
					</>
				)}
			</Caption>
			<Controls>
				<ButtonRow>
					{ITEMS.map((it, k) => (
						<Button key={it.tex} variant={k === i ? 'primary' : 'secondary'} size="sm" aria-pressed={k === i} onClick={() => pick(k)}>
							{it.label}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={right} onClick={() => setChecked(true)}>
						<Check className="size-4" aria-hidden="true" />
						Controlla
					</Button>
					<Button variant="secondary" size="sm" onClick={() => pick(i)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
