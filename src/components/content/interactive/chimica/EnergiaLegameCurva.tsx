'use client';

import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Arrow } from '../fisica';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, Dot, frame, v, num, useFrameLoop, useReducedMotion, INK, THICK, THIN, DASH } from '../kit';

/**
 * Lesson 62 (Energia di legame e regola dell'ottetto): two hydrogen atoms at a distance the student chooses, and the
 * energy of the pair on the curve below. The slider sets the distance between the nuclei (30 to 300 pm); the button
 * lets the atoms go, and they settle at 74 pm, the minimum. Read under the drawing: the distance, the energy, and
 * whether the atoms attract, repel or are at equilibrium.
 *
 * The curve is a Morse curve with the two numbers of the lesson, the minimum at 74 pm and a depth of 436 kJ/mol, and
 * the width of the real H2 curve (a = 0,0194 pm⁻¹): it has the right shape, and only the minimum is a measured value.
 * The arrows on the atoms are the force, the slope of the curve, drawn up to a fixed length.
 */

const R0 = 74; // pm
const D = 436; // kJ/mol
const A = 0.0194; // 1/pm
const energy = (r: number) => D * ((1 - Math.exp(-A * (r - R0))) ** 2 - 1);
/** dE/dr: positive when the atoms attract (the energy rises with the distance). */
const slope = (r: number) => 2 * D * A * (1 - Math.exp(-A * (r - R0))) * Math.exp(-A * (r - R0));

const f = frame(-1.45, 6.75, -2.85, 4.35);
const X = (r: number) => r / 50; // pm → cm on the graph
const Y = (e: number) => e / 200; // kJ/mol → cm on the graph
const ATOMS_Y = 3.25;
const ATOMS_X = 2.65;
const PM = 0.0125; // pm → cm between the two atoms drawn
const CLOUD = 0.8; // radius of an atom's cloud, cm

const CURVE = Array.from({ length: 136 }, (_, i) => 30 + i * 2).map((r) => v(X(r), Y(energy(r))));

export default function EnergiaLegameCurva({ alt }: { alt?: string }) {
	const [r, setR] = useState(250);
	const [falling, setFalling] = useState(false);
	const reduced = useReducedMotion();
	const id = useId();
	const current = useRef(250);
	const put = (x: number) => {
		current.current = x;
		setR(x);
	};

	useFrameLoop(falling, (dt) => {
		const next = current.current + (R0 - current.current) * Math.min(1, dt * 3.5);
		if (Math.abs(next - R0) < 0.6) {
			put(R0);
			setFalling(false);
		} else put(next);
	});

	const e = energy(r);
	const s = slope(r);
	const state = Math.abs(r - R0) <= 2 ? 'equilibrio' : r > R0 ? 'attrazione' : 'repulsione';

	const left = v(ATOMS_X - (r * PM) / 2, ATOMS_Y);
	const right = v(ATOMS_X + (r * PM) / 2, ATOMS_Y);
	// the force arrows: inwards when the atoms attract, outwards when they repel
	const arrow = Math.min(0.7, Math.abs(s) * 0.09);
	const dir = state === 'attrazione' ? 1 : -1;
	const p = v(X(r), Y(e));

	let caption: string;
	if (state === 'equilibrio') caption = 'A 74 pm l’energia è la più bassa possibile, −436 kJ/mol: è la lunghezza di legame. Gli atomi non si attraggono né si respingono, e per separarli servono 436 kJ per ogni mole di molecole.';
	else if (r >= 240) caption = 'Così lontani i due atomi quasi non si sentono: l’energia è vicina a zero. Avvicinali.';
	else if (state === 'attrazione') caption = 'Ogni nucleo attrae anche l’elettrone dell’altro atomo: i due atomi si attraggono, e avvicinandoli l’energia scende.';
	else if (e > 0) caption = 'I nuclei sono troppo vicini e si respingono con forza: l’energia è salita sopra lo zero, più alta di quella degli atomi separati.';
	else caption = 'I due nuclei, entrambi positivi, sono troppo vicini e si respingono: l’energia risale.';

	const cl = f.px(left), cr = f.px(right);
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<radialGradient id={`${id}-nube`}>
						<stop offset="0%" stopColor="#8080ff" stopOpacity={0.75} />
						<stop offset="55%" stopColor="#9999ff" stopOpacity={0.4} />
						<stop offset="100%" stopColor="#ccccff" stopOpacity={0} />
					</radialGradient>
				</defs>
				{/* the two atoms */}
				<circle cx={cl.x} cy={cl.y} r={CLOUD * (f.W / (f.x1 - f.x0))} fill={`url(#${id}-nube)`} />
				<circle cx={cr.x} cy={cr.y} r={CLOUD * (f.W / (f.x1 - f.x0))} fill={`url(#${id}-nube)`} />
				<Dot f={f} at={left} r={3} color={INK.red} />
				<Dot f={f} at={right} r={3} color={INK.red} />
				{state !== 'equilibrio' && arrow > 0.08 && (
					<>
						<Arrow f={f} from={v(left.x, ATOMS_Y - 0.95)} to={v(left.x + dir * arrow, ATOMS_Y - 0.95)} color={INK.orange} />
						<Arrow f={f} from={v(right.x, ATOMS_Y - 0.95)} to={v(right.x - dir * arrow, ATOMS_Y - 0.95)} color={INK.orange} />
					</>
				)}
				<path d={f.path([v(left.x, ATOMS_Y + 0.92), v(right.x, ATOMS_Y + 0.92)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(left.x, ATOMS_Y + 0.84), v(left.x, ATOMS_Y + 1)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(right.x, ATOMS_Y + 0.84), v(right.x, ATOMS_Y + 1)])} stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={v(6.1, ATOMS_Y + 0.92)} dir={v(-1, 0)} upright size={13}>
					{`${num(r, 0)} pm`}
				</Label>

				{/* the graph */}
				<path d={f.path([v(0, 0), v(6.5, 0)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(0, -2.7), v(0, 2.0)])} stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={v(6.6, 0.62)} dir={v(-1, 1)} upright size={12}>
					distanza (pm)
				</Label>
				<Label f={f} at={v(0, 2.05)} dir={v(1, 0)} upright size={12}>
					energia (kJ/mol)
				</Label>
				{[100, 200, 300].map((x) => (
					<g key={x}>
						<path d={f.path([v(X(x), -0.06), v(X(x), 0.06)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(X(x), 0.02)} dir={v(0, 1)} upright size={11}>
							{x}
						</Label>
					</g>
				))}
				{[-400, -200, 200].map((y) => (
					<g key={y}>
						<path d={f.path([v(-0.06, Y(y)), v(0.06, Y(y))])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(-0.05, Y(y))} dir={v(-1, 0)} upright size={11}>
							{String(y).replace('-', '−')}
						</Label>
					</g>
				))}
				<Label f={f} at={v(-0.05, 0)} dir={v(-1, 0)} upright size={11}>
					0
				</Label>
				<path d={f.path(CURVE)} fill="none" stroke={INK.blue} strokeWidth={THICK} />
				<path d={f.path([v(p.x, 0), p, v(0, p.y)])} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<Dot f={f} at={p} r={4} color={INK.red} />
			</Drawing>

			<Readout>
				<Tex>{`d = ${num(r, 0)}\\,\\text{pm}`}</Tex>
				<Tex>{`E = ${num(e, 0)}\\,\\text{kJ/mol}`}</Tex>
				<span>{state === 'equilibrio' ? 'equilibrio: atomi legati' : state === 'attrazione' ? 'gli atomi si attraggono' : 'gli atomi si respingono'}</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider
					label="Distanza tra i nuclei"
					unit="pm"
					value={Math.round(r)}
					min={30}
					max={300}
					step={2}
					onChange={(x) => {
						setFalling(false);
						put(x);
					}}
				/>
				<ButtonRow>
					<Button
						variant="secondary"
						size="sm"
						disabled={falling || r === R0}
						onClick={() => {
							if (reduced) put(R0);
							else setFalling(true);
						}}
					>
						Lascia liberi gli atomi
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
