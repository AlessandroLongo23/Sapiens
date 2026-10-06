'use client';

import { useState } from 'react';
import { hydroxide, metal } from '@/lib/exercises/v2/chim3-i';
import { Caption, Controls, Drawing, Figure, K, Readout, THICK, TINT, Tex, frame, polar, v } from '../kit';
import { Line, NamesTable, Picker, Symbol, signedText } from './chim3-i-nomi';

/**
 * Lesson 79 (Gli idrossidi): the student picks a metal and one of its oxidation numbers. The drawing is that of the
 * TikZ figure of the lesson: the cation in the middle and as many hydroxide ions around it as its charge; under it
 * the formula (with brackets from two groups on), the ions of a formula unit and the three names.
 */

const SYMS = ['Na', 'K', 'Mg', 'Ca', 'Ba', 'Al', 'Zn', 'Fe', 'Cu', 'Sn', 'Pb', 'Cr'];
/** Where the hydroxide ions go around the cation, by how many they are. */
const ANGLES: Record<number, number[]> = { 1: [0], 2: [180, 0], 3: [180, 0, 90], 4: [180, 0, 90, -90] };
const f = frame(-2.35, 2.35, -1.75, 1.75);

const charge = (n: number, sign: string) => `${n === 1 ? '' : n}${sign}`;

export default function IdrossidiCostruisci({ alt }: { alt?: string }) {
	const [sym, setSym] = useState('Ca');
	const [n, setN] = useState(2);
	const m = metal(sym);
	const pick = (s: string) => {
		setSym(s);
		const next = metal(s).ox;
		setN(next.includes(n) ? n : next[0]);
	};
	const c = hydroxide(m, n);
	const o = f.px(v(0, 0));
	const ions = `\\mathrm{${sym}^{${charge(n, '+')}}} \\text{ e } ${n === 1 ? '' : `${n}\\,`}\\mathrm{OH^-}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{ANGLES[n].map((deg) => {
					const at = polar(deg % 180 === 0 ? 1.3 : 1.05, (deg * Math.PI) / 180);
					const p = f.px(at);
					return (
						<g key={deg}>
							<ellipse cx={p.x} cy={p.y} rx={0.62 * K} ry={0.42 * K} fill={TINT.red} stroke="#000" strokeWidth={THICK} />
							<Symbol f={f} at={v(at.x - 0.06, at.y)} sym="OH" sup="−" size={17} />
						</g>
					);
				})}
				<circle cx={o.x} cy={o.y} r={0.56 * K} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				<Symbol f={f} at={v(-0.08, 0)} sym={sym} sup={charge(n, '+')} size={17} />
			</Drawing>

			<p className="m-0 text-center text-lg text-fg">
				<Tex>{c.tex}</Tex>
			</p>
			<Readout>
				<Line label="cariche:">
					<Tex>{n === 1 ? '+1 + (-1) = 0' : `+${n} + ${n} \\cdot (-1) = 0`}</Tex>
				</Line>
				<Line label="ioni di un’unità formula:">
					<Tex>{ions}</Tex>
				</Line>
			</Readout>
			<NamesTable trad={c.trad} stock={c.stock} iupac={c.iupac} />
			<Caption>
				{n === 1
					? `Il catione ha una sola carica positiva: serve un solo ione idrossido, e la formula non ha parentesi.`
					: `Il catione ha ${n} cariche positive: servono ${n} ioni idrossido, e nella formula il gruppo OH va tra parentesi con l’indice ${n}.`}
			</Caption>

			<Controls>
				<Picker label="Metallo" items={SYMS} value={sym} onPick={pick} />
				<Picker label="Numero di ossidazione" items={m.ox} value={n} onPick={setN} text={signedText} />
			</Controls>
		</Figure>
	);
}
