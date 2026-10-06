'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Label, frame, v, useTween, THICK, THIN, INK, FONT } from '../kit';

/**
 * Lesson 50 (Livelli e sottolivelli di energia), "L'ordine di energia dei sottolivelli": the sublevels of the first
 * four levels, one column for each kind (s, p, d, f), energy upwards, not to scale. A toggle goes from hydrogen,
 * where the sublevels of a level have the same energy, to an atom with many electrons, where each level fans out
 * (s below p below d below f) and 4s ends below 3d. The lines slide from one arrangement to the other.
 *
 * The heights are schematic: only the order is meant, which is the one of the lesson's sequence
 * 1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 4d < 4f for the sublevels drawn here.
 */

type Kind = 's' | 'p' | 'd' | 'f';
const COLUMN: Record<Kind, number> = { s: 1.7, p: 3.9, d: 6.1, f: 8.3 };
const CAPACITY: Record<Kind, number> = { s: 2, p: 6, d: 10, f: 14 };
const HYDROGEN = [0, 0, 2.3, 3.5, 4.3]; // by n
const MANY: Record<string, number> = { '1s': 0, '2s': 1.4, '2p': 1.95, '3s': 2.7, '3p': 3.15, '4s': 3.6, '3d': 3.95, '4p': 4.4, '4d': 4.95, '4f': 5.5 };
const SUBLEVELS = Object.keys(MANY).map((name) => ({ name, n: Number(name[0]), kind: name[1] as Kind }));
const HALF = 0.62;
const f = frame(-1.1, 9.9, -0.55, 6.85);

export default function LivelliSottolivelliOrdine({ alt }: { alt?: string }) {
	const [atom, setAtom] = useState<'idrogeno' | 'altri'>('idrogeno');
	const [t, go] = useTween(0, 700);
	const pick = (a: 'idrogeno' | 'altri') => {
		setAtom(a);
		void go(a === 'altri' ? 1 : 0);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-0.45, -0.3), v(-0.45, 6.1)])} stroke="#000" strokeWidth={THIN} />
				<path d={`M${f.px(v(-0.45, 6.25)).x},${f.px(v(-0.45, 6.25)).y} l-4,8 l8,0 Z`} fill="#000" />
				<Label f={f} at={v(-0.45, 6.3)} dir={v(0, 1)} upright size={12}>
					energia
				</Label>
				{(Object.keys(COLUMN) as Kind[]).map((kind) => (
					<Label key={kind} f={f} at={v(COLUMN[kind], 6.35)} dir={v(0, 0)} upright size={12}>
						{`${kind}: ${CAPACITY[kind]} elettroni`}
					</Label>
				))}
				{SUBLEVELS.map(({ name, n, kind }) => {
					const y = HYDROGEN[n] + (MANY[name] - HYDROGEN[n]) * t;
					const mark = atom === 'altri' && (name === '4s' || name === '3d');
					return (
						<g key={name}>
							<path d={f.path([v(COLUMN[kind] - HALF, y), v(COLUMN[kind] + HALF, y)])} stroke={mark ? INK.orange : '#000'} strokeWidth={mark ? THICK * 2 : THICK} />
							<Label f={f} at={v(COLUMN[kind] + HALF + 0.02, y)} dir={v(1, 0)} size={13}>
								<tspan fontStyle="normal" fontFamily={FONT}>
									{n}
								</tspan>
								{kind}
							</Label>
						</g>
					);
				})}
			</Drawing>
			<Caption>
				{atom === 'idrogeno'
					? "Idrogeno, un solo elettrone: l'energia dipende solo dal livello, e i sottolivelli di uno stesso livello stanno alla stessa altezza."
					: 'Atomo con più elettroni: ogni livello si apre, con s più in basso, poi p, d e f. Il 4s scende sotto il 3d. Ordine dei sottolivelli disegnati: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 4d, 4f.'}
			</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Atomo"
						options={[
							{ value: 'idrogeno', label: 'idrogeno' },
							{ value: 'altri', label: 'più elettroni' }
						]}
						value={atom}
						onChange={pick}
					/>
				</div>
			</Controls>
		</Figure>
	);
}
