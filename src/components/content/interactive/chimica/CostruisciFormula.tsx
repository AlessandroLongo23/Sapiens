'use client';

import { useState, type ReactNode } from 'react';
import { Minus, Plus, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Tex, frame, v, FONT } from '../kit';
import { Sphere } from './sfereDalton';

/**
 * Lesson 28 (La formula chimica e il suo significato): the student picks a formula and puts in the tray, with a plus
 * and a minus per element, the atoms of one molecule or formula unit. The tray shows one row of spheres per element.
 * "Controlla" says, row by row, whether the atoms are right, too many or too few, and with a wrong count on an element
 * inside brackets or in the water of a hydrate it says why; when all are right it tells how the count is made.
 */

type Item = { tex: string; label: string; atoms: [string, number][]; how: string; hint?: Record<string, string> };

const ITEMS: Item[] = [
	{ tex: 'H_2O', label: 'H₂O', atoms: [['H', 2], ['O', 1]], how: 'Indice 2 sull’idrogeno, indice 1 (non scritto) sull’ossigeno: 3 atomi.' },
	{ tex: 'CO_2', label: 'CO₂', atoms: [['C', 1], ['O', 2]], how: 'Il 2 vale solo per l’ossigeno, il simbolo che lo precede: 1 C e 2 O.' },
	{ tex: 'NH_3', label: 'NH₃', atoms: [['N', 1], ['H', 3]], how: 'Un atomo di azoto e tre di idrogeno: 4 atomi.' },
	{ tex: 'CH_4', label: 'CH₄', atoms: [['C', 1], ['H', 4]], how: 'Un atomo di carbonio e quattro di idrogeno: 5 atomi.' },
	{ tex: 'H_2SO_4', label: 'H₂SO₄', atoms: [['H', 2], ['S', 1], ['O', 4]], how: 'Ogni indice vale per il simbolo che lo precede: 2 H, 1 S, 4 O, 7 atomi.' },
	{
		tex: 'Ca(OH)_2',
		label: 'Ca(OH)₂',
		atoms: [['Ca', 1], ['O', 2], ['H', 2]],
		how: 'Il 2 fuori dalla parentesi moltiplica tutto quello che c’è dentro: 2 O e 2 H, più 1 Ca, 5 atomi.',
		hint: { O: 'L’ossigeno è dentro la parentesi: il 2 fuori vale anche per lui.', H: 'L’idrogeno è dentro la parentesi: il 2 fuori vale anche per lui.' },
	},
	{
		tex: 'Al_2(SO_4)_3',
		label: 'Al₂(SO₄)₃',
		atoms: [['Al', 2], ['S', 3], ['O', 12]],
		how: '2 Al; nella parentesi 1 S e 4 O, presi 3 volte: 3 S e 12 O, 17 atomi.',
		hint: { S: 'Lo zolfo è dentro la parentesi, che ha indice 3.', O: 'L’ossigeno ha indice 4 dentro la parentesi, e la parentesi ha indice 3: si moltiplicano.' },
	},
	{
		tex: 'CuSO_4 \\cdot 5H_2O',
		label: 'CuSO₄·5H₂O',
		atoms: [['Cu', 1], ['S', 1], ['O', 9], ['H', 10]],
		how: 'Nel sale 1 Cu, 1 S, 4 O; nelle 5 molecole d’acqua 10 H e 5 O: 9 O in tutto, 21 atomi.',
		hint: { O: 'L’ossigeno c’è nel sale e nelle cinque molecole d’acqua: si sommano.', H: 'L’idrogeno è nell’acqua: 2 atomi per molecola, e le molecole sono 5.' },
	},
];

const MAX = 13;
const STEP = 0.4;
const ROW = 0.62;
const f = frame(-0.15, 7.2, 0, 4 * ROW + 0.15);

export default function CostruisciFormula({ alt }: { alt?: string }) {
	const [i, setI] = useState(0);
	const [counts, setCounts] = useState<Record<string, number>>({});
	const [checked, setChecked] = useState(false);
	const item = ITEMS[i];
	const els = item.atoms.map(([e]) => e);
	const target = Object.fromEntries(item.atoms);
	const count = (e: string) => counts[e] ?? 0;
	const change = (e: string, d: number) => {
		setCounts({ ...counts, [e]: Math.max(0, Math.min(MAX, count(e) + d)) });
		setChecked(false);
	};
	const pick = (k: number) => {
		setI(k);
		setCounts({});
		setChecked(false);
	};
	const right = els.every((e) => count(e) === target[e]);
	const total = els.reduce((s, e) => s + count(e), 0);
	const top = f.y1 - 0.1 - ((4 - els.length) * ROW) / 2;
	const verdict = (e: string) => (count(e) === target[e] ? 'giusti' : count(e) > target[e] ? 'troppi' : 'mancano');

	let caption: ReactNode;
	if (checked && right) caption = <>Giusto. {item.how}</>;
	else if (checked) {
		const wrong = els.filter((e) => count(e) !== target[e]);
		const hint = wrong.map((e) => item.hint?.[e]).find(Boolean);
		caption = (
			<>
				Non ancora: {wrong.map((e) => `${verdict(e) === 'troppi' ? 'troppi' : 'troppo pochi'} atomi di ${e}`).join(', ')}. {hint ?? 'Rileggi l’indice che segue il simbolo.'}
			</>
		);
	} else if (total === 0)
		caption = (
			<>
				Metti nel vassoio gli atomi di <Tex>{`\\mathrm{${item.tex}}`}</Tex> con i bottoni + e −, poi premi Controlla.
			</>
		);
	else
		caption = (
			<>
				Nel vassoio ci sono {total} atomi. Quando pensi di avere quelli di <Tex>{`\\mathrm{${item.tex}}`}</Tex>, premi Controlla.
			</>
		);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{els.map((e, r) => {
					const y = top - ROW * (r + 0.5);
					const p = f.px(v(0.2, y));
					const end = f.px(v(7.1, y));
					return (
						<g key={e}>
							<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily={FONT} fill="#000">
								{e}
							</text>
							<path d={f.path([v(0.55, y - 0.27), v(0.55, y + 0.27)])} stroke="#000" strokeWidth={0.6} />
							{Array.from({ length: count(e) }, (_, k) => (
								<Sphere key={k} f={f} at={v(0.85 + k * STEP, y)} el={e} r={0.19} />
							))}
							{checked && (
								<text x={end.x} y={end.y} dy="0.35em" textAnchor="end" fontSize={13} fontFamily={FONT} fill={count(e) === target[e] ? '#008000' : '#ff0000'}>
									{verdict(e)}
								</text>
							)}
						</g>
					);
				})}
			</Drawing>

			<p className="m-0 text-center text-lg text-fg">
				<Tex>{`\\mathrm{${item.tex}}`}</Tex>
			</p>
			<Caption>{caption}</Caption>

			<Controls>
				<ButtonRow>
					{ITEMS.map((it, k) => (
						<Button key={it.tex} variant={k === i ? 'primary' : 'secondary'} size="sm" aria-pressed={k === i} onClick={() => pick(k)}>
							{it.label}
						</Button>
					))}
				</ButtonRow>
				<div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
					{els.map((e) => (
						<div key={e} className="flex items-center gap-1.5">
							<Button variant="secondary" size="sm" aria-label={`Togli un atomo di ${e}`} disabled={count(e) === 0} onClick={() => change(e, -1)}>
								<Minus className="size-4" aria-hidden="true" />
							</Button>
							<span className="min-w-[2.5rem] text-center text-sm text-fg">
								{e}: {count(e)}
							</span>
							<Button variant="secondary" size="sm" aria-label={`Aggiungi un atomo di ${e}`} disabled={count(e) === MAX} onClick={() => change(e, 1)}>
								<Plus className="size-4" aria-hidden="true" />
							</Button>
						</div>
					))}
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={total === 0} onClick={() => setChecked(true)}>
						<Check className="size-4" aria-hidden="true" />
						Controlla
					</Button>
					<Button variant="secondary" size="sm" disabled={total === 0} onClick={() => pick(i)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Svuota
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
