'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, add, sub, scale, polar, num, texNum, DASH, THIN } from '../kit';
import { Atom, ATOM_FILL, DipoleArrow, DIPOLE, RESULTANT } from './chim3-g-pezzi';

/**
 * Lesson 69 (Molecole polari e apolari): a molecule AX₂ whose angle the student changes. Each bond carries its dipole,
 * an arrow towards the more electronegative atom (the oxygens of CO₂ and SO₂, the central oxygen of water); on the
 * right the two arrows are added tail to tail with the parallelogram, and the orange arrow is their sum, the
 * molecule's dipole moment: 2 μ_leg cos(θ/2), zero at 180°.
 *
 * Picking a molecule sets its measured angle (CO₂ 180°, SO₂ 119°, H₂O 104,5°) and shows its measured dipole moment
 * (0, 1,63 D, 1,85 D: CRC Handbook, to be checked); the slider then bends it, to see what CO₂ would be if it were
 * bent. The bonds are plain sticks: the figure is about directions, not about bond orders.
 */

type Mol = 'co2' | 'so2' | 'h2o';
const MOLS: Record<Mol, { label: string; tex: string; centre: 'C' | 'S' | 'O'; outer: 'O' | 'H'; angle: number; mu: number; inward: boolean; nome: string }> = {
	co2: { label: 'CO₂', tex: '\\mathrm{CO_2}', centre: 'C', outer: 'O', angle: 180, mu: 0, inward: false, nome: 'il diossido di carbonio' },
	so2: { label: 'SO₂', tex: '\\mathrm{SO_2}', centre: 'S', outer: 'O', angle: 119, mu: 1.63, inward: false, nome: 'il diossido di zolfo' },
	h2o: { label: 'H₂O', tex: '\\mathrm{H_2O}', centre: 'O', outer: 'H', angle: 104.5, mu: 1.85, inward: true, nome: "l'acqua" },
};

const f = frame(-2.15, 5.95, -2.2, 2.0);
const BOND = 1.45; // centre to outer atom
const ARROW = 1.0; // length of a bond dipole
const Q = v(4.15, 0); // where the arrows are added

export default function PolaritaSommaDipoli({ alt }: { alt?: string }) {
	const [mol, setMol] = useState<Mol>('h2o');
	const [angle, setAngle] = useState(MOLS.h2o.angle);
	const m = MOLS[mol];
	const half = (angle / 2) * (Math.PI / 180);
	// the outer atoms sit below the centre, on the two sides of the downward bisector
	const dirs = [polar(1, -Math.PI / 2 - half), polar(1, -Math.PI / 2 + half)];
	const centre = v(0, 0.55);
	const outer = dirs.map((d) => add(centre, scale(d, BOND)));
	const sign = m.inward ? -1 : 1; // towards the outer atoms, or towards the centre
	const dipoles = dirs.map((d) => scale(d, sign * ARROW));
	const sum = add(dipoles[0], dipoles[1]);
	const ratio = 2 * Math.cos(half);
	const polare = ratio > 0.005;
	const real = Math.abs(angle - m.angle) < 1e-9;

	// the arrows beside the bonds, on the outer side
	const side = dirs.map((d, i) => scale(v(-d.y, d.x), (i === 0 ? -1 : 1) * 0.42));
	const along = (i: number) => {
		const a = add(add(centre, scale(dirs[i], 0.3)), side[i]);
		const b = add(add(centre, scale(dirs[i], 0.3 + ARROW)), side[i]);
		return m.inward ? { from: b, to: a } : { from: a, to: b };
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the molecule */}
				{outer.map((o, i) => (
					<path key={i} d={f.path([centre, o])} stroke="#000" strokeWidth={2.2} />
				))}
				{outer.map((o, i) => (
					<Atom key={i} f={f} at={o} r={m.outer === 'H' ? 0.28 : 0.36} fill={ATOM_FILL[m.outer]}>
						{m.outer}
					</Atom>
				))}
				<Atom f={f} at={centre} r={0.4} fill={ATOM_FILL[m.centre]}>
					{m.centre}
				</Atom>
				{[0, 1].map((i) => (
					<DipoleArrow key={i} f={f} {...along(i)} color={DIPOLE} />
				))}
				{angle < 179.9 && <path d={f.arc(centre, dirs[0], dirs[1], 0.62)} stroke="#000" strokeWidth={THIN} fill="none" />}
				{/* the sum, tail to tail */}
				<path d={f.path([v(2.55, -2.0), v(2.55, 1.8)])} stroke="#000" strokeWidth={THIN} strokeDasharray="1 4" />
				{polare && <path d={f.path([add(Q, dipoles[0]), add(Q, sum), add(Q, dipoles[1])])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
				<DipoleArrow f={f} from={Q} to={add(Q, dipoles[0])} color={DIPOLE} />
				<DipoleArrow f={f} from={Q} to={add(Q, dipoles[1])} color={DIPOLE} />
				{polare && <DipoleArrow f={f} from={Q} to={add(Q, sum)} color={RESULTANT} weight="veryThick" />}
				<circle cx={f.px(Q).x} cy={f.px(Q).y} r={2.2} fill="#000" />
				<text x={f.px(v(4.15, 1.78)).x} y={f.px(v(4.15, 1.78)).y} textAnchor="middle" fontSize={12} fill="#000" fontFamily="KaTeX_Main, serif">
					{polare ? 'somma dei dipoli' : 'somma zero'}
				</text>
				<text x={f.px(sub(centre, v(0, -0.95))).x} y={f.px(sub(centre, v(0, -0.95))).y} textAnchor="middle" fontSize={12} fill="#000" fontFamily="KaTeX_Main, serif">
					{`${num(angle, 1)}°`}
				</text>
			</Drawing>
			<Readout>
				<Tex>{`\\theta = ${texNum(angle, 1)}^\\circ`}</Tex>
				<Tex>{`\\mu = 2\\,\\mu_{leg}\\cos\\tfrac{\\theta}{2} = ${texNum(ratio, 2)}\\,\\mu_{leg}`}</Tex>
				<span>{polare ? 'molecola polare' : 'molecola apolare'}</span>
			</Readout>
			<Caption>
				{real
					? `Con l'angolo vero, ${num(m.angle, 1)}°, ${m.nome} ${m.mu === 0 ? 'ha momento dipolare zero: le due frecce sono uguali e opposte.' : `ha un momento dipolare misurato di ${num(m.mu, 2)} D.`}`
					: polare
						? `Se ${m.nome} avesse un angolo di ${num(angle, 1)}°, le due frecce non si annullerebbero: la somma varrebbe ${num(ratio, 2)} volte il dipolo di un legame.`
						: `Con i due legami in linea retta le frecce sono uguali e opposte: la somma è zero.`}
			</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Molecola"
						options={(Object.keys(MOLS) as Mol[]).map((k) => ({ value: k, label: MOLS[k].label }))}
						value={mol}
						onChange={(k) => {
							setMol(k);
							setAngle(MOLS[k].angle);
						}}
					/>
				</div>
				<Slider label="Angolo tra i legami (°)" value={angle} min={90} max={180} step={0.5} onChange={setAngle} />
			</Controls>
		</Figure>
	);
}
