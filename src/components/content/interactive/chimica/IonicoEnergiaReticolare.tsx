'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, texNum, FONT, K, THIN, THICK, type V } from '../kit';

/**
 * Lesson 65 (Il legame ionico): the student picks a cation and an anion and sees the two ions touching, to scale, with
 * the distance d between their centres (the sum of the two ionic radii). Two bars compare the estimate of the
 * attraction, q₊·q₋/d, with that of sodium chloride, drawn underneath as the reference. For the compounds of the
 * lesson's table the measured lattice energy is given too.
 *
 * Ionic radii in pm (Shannon, coordination 6). Cations violet!25, anions green!25 as in the TikZ figures; every ion
 * carries its formula, so the colour carries no information alone.
 */

type Ion = { el: string; q: number; r: number; label: string };

const CATIONS: Ion[] = [
	{ el: 'Li', q: 1, r: 76, label: 'Li⁺' },
	{ el: 'Na', q: 1, r: 102, label: 'Na⁺' },
	{ el: 'K', q: 1, r: 138, label: 'K⁺' },
	{ el: 'Mg', q: 2, r: 72, label: 'Mg²⁺' },
	{ el: 'Ca', q: 2, r: 100, label: 'Ca²⁺' },
];
const ANIONS: Ion[] = [
	{ el: 'F', q: 1, r: 133, label: 'F⁻' },
	{ el: 'Cl', q: 1, r: 181, label: 'Cl⁻' },
	{ el: 'Br', q: 1, r: 196, label: 'Br⁻' },
	{ el: 'O', q: 2, r: 140, label: 'O²⁻' },
];
/** Measured lattice energies of the lesson's compounds, kJ/mol. */
const MEASURED: Record<string, number> = { LiF: 1036, NaF: 923, NaCl: 787, KCl: 715, KBr: 682, MgO: 3791, CaO: 3401 };

const FILL_CAT = '#dfbfdf';
const FILL_AN = '#bfffbf';
const PM = 0.0048; // cm per picometre
const REF = { cat: CATIONS[1], an: ANIONS[1] };
const estimate = (c: Ion, a: Ion) => (c.q * a.q) / (c.r + a.r);
const E0 = estimate(REF.cat, REF.an);
const BAR = 0.5; // cm of bar for the estimate of NaCl
const f = frame(0, 7.4, -0.6, 5);

function Pair({ cat, an, at, faint = false }: { cat: Ion; an: Ion; at: V; faint?: boolean }) {
	const d = (cat.r + an.r) * PM;
	const c = v(at.x - d / 2, at.y);
	const a = v(at.x + d / 2, at.y);
	const pc = f.px(c);
	const pa = f.px(a);
	const yb = at.y - Math.max(cat.r, an.r) * PM - 0.22;
	return (
		<g opacity={faint ? 0.75 : 1}>
			<circle cx={pc.x} cy={pc.y} r={cat.r * PM * K} fill={FILL_CAT} stroke="#000" strokeWidth={THICK} />
			<circle cx={pa.x} cy={pa.y} r={an.r * PM * K} fill={FILL_AN} stroke="#000" strokeWidth={THICK} />
			<text x={pc.x} y={pc.y} dy="0.35em" textAnchor="middle" fontSize={cat.r < 90 ? 10 : 12} fontFamily={FONT} fill="#000">
				{cat.label}
			</text>
			<text x={pa.x} y={pa.y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT} fill="#000">
				{an.label}
			</text>
			<path d={f.path([v(c.x, yb), v(a.x, yb)])} stroke="#000" strokeWidth={THIN} />
			<path d={`${f.path([v(c.x, yb - 0.08), v(c.x, yb + 0.08)])} ${f.path([v(a.x, yb - 0.08), v(a.x, yb + 0.08)])}`} stroke="#000" strokeWidth={THIN} />
			<text x={(pc.x + pa.x) / 2} y={f.px(v(0, yb - 0.1)).y} dy="0.75em" textAnchor="middle" fontSize={13} fontFamily={FONT} fill="#000">
				d = {cat.r + an.r} pm
			</text>
		</g>
	);
}

function Bar({ y, value, label, fill }: { y: number; value: number; label: string; fill: string }) {
	const a = f.px(v(3.75, y + 0.16));
	const w = (value / E0) * BAR;
	const t = f.px(v(3.75 + w + 0.12, y));
	const l = f.px(v(3.75, y + 0.42));
	return (
		<g>
			<text x={l.x} y={l.y} textAnchor="start" fontSize={13} fontFamily={FONT} fill="#000">
				{label}
			</text>
			<rect x={a.x} y={a.y} width={w * K} height={0.32 * K} fill={fill} stroke="#000" strokeWidth={THIN} />
			<text x={t.x} y={t.y} dy="0.35em" textAnchor="start" fontSize={13} fontFamily={FONT} fill="#000">
				× {(value / E0).toFixed(2).replace('.', ',')}
			</text>
		</g>
	);
}

const sub = (n: number) => (n === 1 ? '' : `_${n}`);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export default function IonicoEnergiaReticolare({ alt }: { alt?: string }) {
	const [ci, setCi] = useState(3);
	const [ai, setAi] = useState(3);
	const cat = CATIONS[ci];
	const an = ANIONS[ai];
	const g = gcd(cat.q, an.q);
	const nc = an.q / g;
	const na = cat.q / g;
	const plain = `${cat.el}${nc === 1 ? '' : nc}${an.el}${na === 1 ? '' : na}`;
	const formula = `\\mathrm{${cat.el}${sub(nc)}${an.el}${sub(na)}}`;
	const e = estimate(cat, an);
	const ratio = e / E0;
	const d = cat.r + an.r;
	const measured = MEASURED[plain];
	const isRef = cat === REF.cat && an === REF.an;

	const why = isRef
		? 'È il riferimento: le due barre sono uguali.'
		: `Rispetto al cloruro di sodio il prodotto delle cariche è ${cat.q * an.q === 1 ? 'lo stesso, 1' : `${cat.q * an.q} invece di 1`}, e la distanza è ${d === 283 ? 'la stessa' : d < 283 ? `più piccola, ${d} pm invece di 283` : `più grande, ${d} pm invece di 283`}: l'attrazione stimata è ${ratio.toFixed(2).replace('.', ',')} volte quella del cloruro di sodio.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Pair cat={cat} an={an} at={v(1.75, 3.9)} />
				<Pair cat={REF.cat} an={REF.an} at={v(1.75, 1.05)} faint />
				<Bar y={3.75} value={e} label={`${cat.label} e ${an.label}`} fill={FILL_AN} />
				<Bar y={0.9} value={E0} label="Na⁺ e Cl⁻ (riferimento)" fill="#e6e6e6" />
			</Drawing>
			<Readout>
				<span>
					<Tex>{`q_+ \\cdot q_- = ${cat.q} \\cdot ${an.q} = ${cat.q * an.q}`}</Tex>
				</span>
				<span>
					<Tex>{`d = ${cat.r} + ${an.r} = ${d}\\,\\text{pm}`}</Tex>
				</span>
				<span>
					composto: <Tex>{formula}</Tex>
					{measured ? (
						<>
							, energia reticolare misurata <Tex>{`${texNum(measured, 0)}\\,\\text{kJ/mol}`}</Tex>
						</>
					) : null}
				</span>
			</Readout>
			<Caption>{why}</Caption>
			<Controls>
				<ButtonRow>
					{CATIONS.map((c, k) => (
						<Button key={c.el} variant={k === ci ? 'primary' : 'secondary'} size="sm" aria-pressed={k === ci} onClick={() => setCi(k)}>
							{c.label}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{ANIONS.map((a, k) => (
						<Button key={a.el} variant={k === ai ? 'primary' : 'secondary'} size="sm" aria-pressed={k === ai} onClick={() => setAi(k)}>
							{a.label}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
