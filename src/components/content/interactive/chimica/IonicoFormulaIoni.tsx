'use client';

import { useState, type ReactNode } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, FONT, K, THIN, THICK } from '../kit';

/**
 * Lesson 65 (Il legame ionico): the student picks a metal ion and a non-metal ion and adds ions of each kind with a
 * plus and a minus. The ions are drawn as spheres with their charge; under them two bars, one square per elementary
 * charge, compare the positive and the negative charge. When the two bars are equal the compound is neutral: with the
 * smallest numbers the formula appears, with a multiple of them the caption says that the ratio simplifies.
 *
 * Cations violet!25 and small, anions green!25 and large, as in the TikZ figures of the lesson; the sign is written on
 * every ion and on every bar, so the colour carries no information alone.
 */

type Ion = { el: string; q: number; label: string; name: string };

const CATIONS: Ion[] = [
	{ el: 'Na', q: 1, label: 'Na⁺', name: 'sodio' },
	{ el: 'K', q: 1, label: 'K⁺', name: 'potassio' },
	{ el: 'Mg', q: 2, label: 'Mg²⁺', name: 'magnesio' },
	{ el: 'Ca', q: 2, label: 'Ca²⁺', name: 'calcio' },
	{ el: 'Al', q: 3, label: 'Al³⁺', name: 'alluminio' },
];
const ANIONS: Ion[] = [
	{ el: 'F', q: 1, label: 'F⁻', name: 'fluoruro' },
	{ el: 'Cl', q: 1, label: 'Cl⁻', name: 'cloruro' },
	{ el: 'O', q: 2, label: 'O²⁻', name: 'ossido' },
	{ el: 'S', q: 2, label: 'S²⁻', name: 'solfuro' },
	{ el: 'N', q: 3, label: 'N³⁻', name: 'nitruro' },
];

const MAX = 6;
const FILL_CAT = '#dfbfdf'; // violet!25
const FILL_AN = '#bfffbf'; // green!25
const UNIT = 0.3; // one elementary charge on a bar, in cm
const X0 = 0.75;
const f = frame(0, 7.4, 0, 3.75);

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const sub = (n: number) => (n === 1 ? '' : `_${n}`);

function Ions({ ion, n, y, r, fill }: { ion: Ion; n: number; y: number; r: number; fill: string }) {
	return (
		<>
			{Array.from({ length: n }, (_, k) => {
				const p = f.px(v(X0 + 0.32 + k * 0.72, y));
				return (
					<g key={k}>
						<circle cx={p.x} cy={p.y} r={r * K} fill={fill} stroke="#000" strokeWidth={THICK} />
						<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={r > 0.3 ? 13 : ion.label.length > 3 ? 9.5 : 11} fontFamily={FONT} fill="#000">
							{ion.label}
						</text>
					</g>
				);
			})}
		</>
	);
}

function Bar({ sign, n, y, fill }: { sign: string; n: number; y: number; fill: string }) {
	const p = f.px(v(X0 - 0.3, y));
	const end = f.px(v(X0 + n * UNIT + 0.15, y));
	return (
		<g>
			<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={17} fontFamily={FONT} fill="#000">
				{sign}
			</text>
			<path d={f.path([v(X0, y - 0.24), v(X0, y + 0.24)])} stroke="#000" strokeWidth={THIN} />
			{Array.from({ length: n }, (_, k) => {
				const a = f.px(v(X0 + k * UNIT, y + 0.15));
				return <rect key={k} x={a.x} y={a.y} width={UNIT * K} height={0.3 * K} fill={fill} stroke="#000" strokeWidth={THIN} />;
			})}
			<text x={end.x} y={end.y} dy="0.35em" textAnchor="start" fontSize={14} fontFamily={FONT} fill="#000">
				{n}
			</text>
		</g>
	);
}

export default function IonicoFormulaIoni({ alt }: { alt?: string }) {
	const [ci, setCi] = useState(4);
	const [ai, setAi] = useState(2);
	const [nc, setNc] = useState(1);
	const [na, setNa] = useState(1);
	const cat = CATIONS[ci];
	const an = ANIONS[ai];
	const pos = nc * cat.q;
	const neg = na * an.q;
	const lcm = (cat.q * an.q) / gcd(cat.q, an.q);
	const bestC = lcm / cat.q;
	const bestA = lcm / an.q;
	const formula = `\\mathrm{${cat.el}${sub(bestC)}${an.el}${sub(bestA)}}`;
	const name = `${an.name} di ${cat.name}`;
	const pick = (c: number, a: number) => {
		setCi(c);
		setAi(a);
		setNc(1);
		setNa(1);
	};

	let caption: ReactNode;
	if (nc === 0 && na === 0) caption = <>Aggiungi ioni {cat.label} e ioni {an.label} finché le due barre sono lunghe uguali.</>;
	else if (pos > neg)
		caption = (
			<>
				Le cariche positive sono {pos}, le negative {neg}: {pos - neg === 1 ? 'manca una carica negativa' : `mancano ${pos - neg} cariche negative`}. Aggiungi ioni {an.label}, che ne portano {an.q === 1 ? 'una' : an.q} ciascuno.
			</>
		);
	else if (neg > pos)
		caption = (
			<>
				Le cariche negative sono {neg}, le positive {pos}: {neg - pos === 1 ? 'manca una carica positiva' : `mancano ${neg - pos} cariche positive`}. Aggiungi ioni {cat.label}, che ne portano {cat.q === 1 ? 'una' : cat.q} ciascuno.
			</>
		);
	else if (nc === bestC && na === bestA)
		caption = (
			<>
				Neutro con i numeri più piccoli possibili: {nc === 1 ? 'uno ione' : `${nc} ioni`} {cat.label} e {na === 1 ? 'uno ione' : `${na} ioni`} {an.label}. La formula è <Tex>{formula}</Tex>, {name}.
			</>
		);
	else
		caption = (
			<>
				Neutro, ma {nc} e {na} si semplificano per {nc / bestC}: il rapporto è ancora {bestC} a {bestA}, e la formula resta <Tex>{formula}</Tex>.
			</>
		);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ions ion={cat} n={nc} y={3.3} r={0.26} fill={FILL_CAT} />
				<Ions ion={an} n={na} y={2.45} r={0.33} fill={FILL_AN} />
				<Bar sign="+" n={pos} y={1.3} fill={FILL_CAT} />
				<Bar sign="−" n={neg} y={0.55} fill={FILL_AN} />
			</Drawing>
			<Readout>
				<span>
					cariche positive: {nc} · {cat.q} = {pos}
				</span>
				<span>
					cariche negative: {na} · {an.q} = {neg}
				</span>
				<span>carica totale: {pos - neg > 0 ? `+${pos - neg}` : pos - neg < 0 ? `−${neg - pos}` : '0'}</span>
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<ButtonRow>
					{CATIONS.map((c, k) => (
						<Button key={c.el} variant={k === ci ? 'primary' : 'secondary'} size="sm" aria-pressed={k === ci} onClick={() => pick(k, ai)}>
							{c.label}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{ANIONS.map((a, k) => (
						<Button key={a.el} variant={k === ai ? 'primary' : 'secondary'} size="sm" aria-pressed={k === ai} onClick={() => pick(ci, k)}>
							{a.label}
						</Button>
					))}
				</ButtonRow>
				<div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
					{(
						[
							[cat, nc, setNc],
							[an, na, setNa],
						] as const
					).map(([ion, n, set]) => (
						<div key={ion.el} className="flex items-center gap-1.5">
							<Button variant="secondary" size="sm" aria-label={`Togli uno ione ${ion.label}`} disabled={n === 0} onClick={() => set(n - 1)}>
								<Minus className="size-4" aria-hidden="true" />
							</Button>
							<span className="min-w-[3.5rem] text-center text-sm text-fg">
								{ion.label}: {n}
							</span>
							<Button variant="secondary" size="sm" aria-label={`Aggiungi uno ione ${ion.label}`} disabled={n === MAX} onClick={() => set(n + 1)}>
								<Plus className="size-4" aria-hidden="true" />
							</Button>
						</div>
					))}
					<Button variant="secondary" size="sm" disabled={nc === 0 && na === 0} onClick={() => pick(ci, ai)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</div>
			</Controls>
		</Figure>
	);
}
