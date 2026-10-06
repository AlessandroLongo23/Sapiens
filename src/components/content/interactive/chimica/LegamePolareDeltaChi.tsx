'use client';

import { useId, useState } from 'react';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, clamp, num, TINT, THICK, THIN } from '../kit';

/**
 * Lesson 64 (Legame covalente polare e legame dativo): two atoms picked among eleven elements, and the cloud of the
 * bonding pair between them. With equal electronegativities the cloud sits in the middle; as the difference grows it
 * moves towards the more electronegative atom and the partial charges appear; beyond 1,9 it sits on one atom and the
 * charges are those of two ions. Under the atoms, the scale of Δχ with the two thresholds of the lesson (0,4 and 1,9)
 * and a mark at the value of the pair.
 *
 * The thresholds are a rule of thumb, and the figure says where it does not hold: between two metals (a metallic
 * bond), and between a metal and a non-metal below 1,9, where the compound is often ionic all the same.
 * Electronegativities: Pauling's, from src/lib/tools/elementi.json.
 */

const ELEMENTS = [
	{ sym: 'H', nome: 'idrogeno', chi: 2.2, metal: false },
	{ sym: 'C', nome: 'carbonio', chi: 2.55, metal: false },
	{ sym: 'N', nome: 'azoto', chi: 3.04, metal: false },
	{ sym: 'O', nome: 'ossigeno', chi: 3.44, metal: false },
	{ sym: 'F', nome: 'fluoro', chi: 3.98, metal: false },
	{ sym: 'S', nome: 'zolfo', chi: 2.58, metal: false },
	{ sym: 'Cl', nome: 'cloro', chi: 3.16, metal: false },
	{ sym: 'Br', nome: 'bromo', chi: 2.96, metal: false },
	{ sym: 'Na', nome: 'sodio', chi: 0.93, metal: true },
	{ sym: 'Mg', nome: 'magnesio', chi: 1.31, metal: true },
	{ sym: 'K', nome: 'potassio', chi: 0.82, metal: true }
] as const;

const PURE = 0.4;
const IONIC = 1.9;
const MAX = 3.3;

const f = frame(-3.6, 3.6, -2.2, 1.7);
const AX = -1.1;
const BX = 1.1;
const SCALE_Y = -1.25;
const SX = (d: number) => -3 + (d / MAX) * 6; // Δχ → cm on the scale

function Picker({ label, value, onChange }: { label: string; value: number; onChange: (i: number) => void }) {
	return (
		<div className="flex flex-col items-center gap-1.5">
			<span className="text-sm font-medium text-fg-muted">{label}</span>
			<div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label={label}>
				{ELEMENTS.map((x, i) => (
					<button
						key={x.sym}
						type="button"
						onClick={() => onChange(i)}
						aria-pressed={i === value}
						aria-label={x.nome}
						className={`min-w-9 rounded-full border px-2 py-1 text-sm transition-colors ${i === value ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
					>
						{x.sym}
					</button>
				))}
			</div>
		</div>
	);
}

export default function LegamePolareDeltaChi({ alt }: { alt?: string }) {
	const [ia, setIa] = useState(0);
	const [ib, setIb] = useState(6);
	const two = (x: number) => x.toFixed(2).replace('.', '{,}');
	const id = useId();
	const a = ELEMENTS[ia];
	const b = ELEMENTS[ib];
	// in hundredths, so that 3,16 − 2,20 is exactly 0,96
	const d = Math.abs(Math.round(a.chi * 100) - Math.round(b.chi * 100)) / 100;
	const kind = d < PURE ? 'covalente puro' : d <= IONIC ? 'covalente polare' : 'ionico';
	const bothMetals = a.metal && b.metal;
	const oneMetal = a.metal !== b.metal;
	const toB = b.chi > a.chi;
	const neg = toB ? b : a;
	const pos = toB ? a : b;

	// where the cloud sits: 0 in the middle, 1 on the more electronegative atom
	const shift = kind === 'ionico' ? 1 : clamp(d / IONIC, 0, 1) * 0.5;
	const cx = (toB ? 1 : -1) * shift * BX;
	const rx = 1.5 - 0.9 * shift * shift;
	const ry = 0.62 + 0.1 * shift;
	const c = f.px(v(cx, 0.45));
	const unit = f.W / (f.x1 - f.x0);

	let caption: string;
	if (bothMetals) caption = `${a.sym} e ${b.sym} sono due metalli: tra loro il legame è metallico, e la regola della differenza di elettronegatività non si usa.`;
	else if (ia === ib) caption = `Due atomi uguali attirano la coppia con la stessa forza: la nuvola sta al centro, e il legame è covalente puro.`;
	else if (kind === 'covalente puro') caption = `Gli atomi sono diversi, ma le elettronegatività sono quasi uguali: la nuvola è spostata pochissimo, e il legame si considera covalente puro.${oneMetal ? ' Uno dei due però è un metallo, e qui la regola è poco affidabile.' : ''}`;
	else if (kind === 'covalente polare')
		caption = `La nuvola è spostata verso ${neg.sym}, il più elettronegativo, che prende la carica parziale δ−; ${pos.sym} resta con δ+.${oneMetal ? ' Attenzione: uno dei due è un metallo, e molti composti tra un metallo e un non metallo sono ionici anche con una differenza minore di 1,9. Qui la regola pratica è poco affidabile.' : ''}`;
	else caption = `La differenza è così grande che l’elettrone passa del tutto a ${neg.sym}: non c’è più una coppia in comune, ci sono lo ione positivo di ${pos.nome} e lo ione negativo di ${neg.nome}, che si attraggono.`;

	const pa = f.px(v(AX, 0.45));
	const pb = f.px(v(BX, 0.45));
	const mark = f.px(v(SX(Math.min(d, MAX)), SCALE_Y + 0.4));
	const chargeOf = (x: typeof a) => (bothMetals || d === 0 ? '' : kind === 'ionico' ? (x === neg ? '−' : '+') : x === neg ? 'δ−' : 'δ+');
	const band = (from: number, to: number, fill: string) => {
		const p = f.px(v(SX(from), SCALE_Y + 0.4));
		return <rect x={p.x} y={p.y} width={(SX(to) - SX(from)) * unit} height={0.4 * unit} fill={fill} />;
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<radialGradient id={`${id}-nube`}>
						<stop offset="0%" stopColor="#8080ff" stopOpacity={0.7} />
						<stop offset="60%" stopColor="#9999ff" stopOpacity={0.4} />
						<stop offset="100%" stopColor="#ccccff" stopOpacity={0} />
					</radialGradient>
				</defs>
				{!bothMetals && <ellipse cx={c.x} cy={c.y} rx={rx * unit} ry={ry * unit} fill={`url(#${id}-nube)`} />}
				{[
					{ p: pa, x: AX, el: a },
					{ p: pb, x: BX, el: b }
				].map(({ p, x, el }, k) => (
					<g key={k}>
						<circle cx={p.x} cy={p.y} r={0.32 * unit} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
						<Label f={f} at={v(x, 0.45)} upright>
							{el.sym}
						</Label>
						<Label f={f} at={v(x, 1.3)} upright size={chargeOf(el).startsWith('δ') ? 13 + 5 * clamp(d / IONIC, 0, 1) : 18}>
							{chargeOf(el)}
						</Label>
						<Label f={f} at={v(x, -0.3)} upright size={12}>
							{`χ = ${el.chi.toFixed(2).replace('.', ',')}`}
						</Label>
					</g>
				))}

				{/* the scale of Δχ */}
				{band(0, PURE, TINT.gray)}
				{band(PURE, IONIC, TINT.blue20)}
				{band(IONIC, MAX, TINT.orange)}
				<path d={f.path([v(SX(0), SCALE_Y), v(SX(MAX), SCALE_Y)])} stroke="#000" strokeWidth={THICK} />
				{[0, PURE, IONIC].map((x) => (
					<g key={x}>
						<path d={f.path([v(SX(x), SCALE_Y + 0.4), v(SX(x), SCALE_Y - 0.08)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(SX(x), SCALE_Y - 0.05)} dir={v(0, -1)} upright size={11}>
							{num(x, 1)}
						</Label>
					</g>
				))}
				<Label f={f} at={v(SX(0.2), SCALE_Y - 0.5)} dir={v(0, -1)} upright size={11}>
					puro
				</Label>
				<Label f={f} at={v(SX(1.15), SCALE_Y - 0.5)} dir={v(0, -1)} upright size={11}>
					covalente polare
				</Label>
				<Label f={f} at={v(SX(2.6), SCALE_Y - 0.5)} dir={v(0, -1)} upright size={11}>
					ionico
				</Label>
				{!bothMetals && <path d={`M${mark.x},${mark.y} l-6,-10 l12,0 Z`} fill="#000" />}
			</Drawing>

			<Readout>
				<Tex>{`\\chi(\\mathrm{${a.sym}}) = ${two(a.chi)}`}</Tex>
				<Tex>{`\\chi(\\mathrm{${b.sym}}) = ${two(b.chi)}`}</Tex>
				<Tex>{`\\Delta\\chi = ${two(d)}`}</Tex>
				<span>{bothMetals ? 'legame metallico' : `legame ${kind}`}</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Picker label="Primo atomo" value={ia} onChange={setIa} />
				<Picker label="Secondo atomo" value={ib} onChange={setIb} />
			</Controls>
		</Figure>
	);
}
