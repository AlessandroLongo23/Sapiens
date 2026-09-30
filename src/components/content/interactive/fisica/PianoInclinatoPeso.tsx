'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, scale, polar, texNum, num, useFrameLoop, useReducedMotion, THIN, DASH, THICK } from '../kit';
import { Block, Ground, Incline, Thread, Vector, blockCentre, onIncline, inclineEnds, QTY } from '../fisica';

/**
 * Lesson 21 (L'equilibrio sul piano inclinato): a block of 5,0 kg on an incline whose angle the student sets with a
 * slider, from 0° to 60°. The slope keeps its length, so the incline gets taller as it gets steeper. From the block's
 * centre: the weight, its dashed components along the slope (P sin α) and against it (P cos α), and the plane's
 * reaction (P cos α). Without friction a thread parallel to the slope, tied at the top, holds the block with a
 * tension equal to P sin α. With friction (two pairs of surfaces, the same as the friction figure of lesson 19) there
 * is no thread: static friction up the slope equals P sin α while tan α <= μs; past that the block slides down the
 * slope at a steady pace (no dynamics), with kinetic friction μd P cos α, until it reaches the foot or the slope gets
 * gentle enough (tan α <= μd) for it to stop. A button puts it back.
 */

const M = 5;
const P = M * 9.8; // 49 N
const L = 5.2; // length of the slope, cm
const K = 0.03; // arrow cm per newton
const BW = 0.8, BH = 0.6;
const D0 = 3.8; // where the block starts, cm from the foot (middle of its base)
const D_MIN = BW / 2 + 0.05;
const PACE = 1.2; // cm/s of a sliding block
const f = frame(-0.6, L + 0.55, -1.45, L * Math.sin(Math.PI / 3) + 0.45);

type Mode = 'liscio' | 'a' | 'b';
const MODES: Record<Mode, { label: string; mus?: number; mud?: number }> = {
	liscio: { label: 'Senza attrito' },
	a: { label: 'μs 0,40', mus: 0.4, mud: 0.3 },
	b: { label: 'Legno su legno', mus: 0.62, mud: 0.48 }
};

export default function PianoInclinatoPeso({ alt }: { alt?: string }) {
	const [deg, setDeg] = useState(20);
	const [mode, setMode] = useState<Mode>('liscio');
	const [d, setD] = useState(D0);
	const [sliding, setSliding] = useState(false);
	const reduced = useReducedMotion();

	const a = (deg * Math.PI) / 180;
	const { mus, mud } = MODES[mode];
	const rough = mus !== undefined && mud !== undefined;
	const tan = Math.tan(a);
	const atFoot = d <= D_MIN + 1e-6;

	/** The new angle: a still block starts sliding past the limit angle, a sliding one stops where kinetic friction wins. */
	const setAngle = (x: number) => {
		setDeg(x);
		if (!rough) return;
		const t = Math.tan((x * Math.PI) / 180);
		if (!sliding && !atFoot && t > mus! + 1e-9) setSliding(true);
		else if (sliding && t <= mud! + 1e-9) setSliding(false);
	};
	const reset = (m: Mode = mode) => {
		setMode(m);
		setD(D0);
		const t = Math.tan(a);
		setSliding(m !== 'liscio' && t > MODES[m].mus! + 1e-9);
	};

	useFrameLoop(sliding, (dt) => {
		const next = reduced ? D_MIN : Math.max(D_MIN, d - PACE * dt);
		setD(next);
		if (next <= D_MIN) setSliding(false);
	});

	const base = L * Math.cos(a);
	const corner = v(base, 0);
	const { at, rotation } = onIncline(corner, base, a, d);
	const c = blockCentre(at, BH, rotation);
	const up = polar(1, a); // up the slope
	const out = polar(1, a + Math.PI / 2); // out of the slope
	const Ppar = P * Math.sin(a), Pperp = P * Math.cos(a);
	const tipPar = add(c, scale(up, -Ppar * K));
	const tipPerp = add(c, scale(out, -Pperp * K));
	const tipP = add(c, v(0, -P * K));
	const friction = rough ? (sliding ? mud! * Pperp : Ppar) : 0;
	const { top } = inclineEnds(corner, base, a);
	// The thread of the frictionless case: from the middle of the block's upper face to a peg at the top of the slope.
	const face = add(at, add(scale(up, BW / 2), scale(out, BH / 2)));
	const peg = add(top, scale(out, BH / 2));
	const showForces = !(rough && atFoot && tan > mus!);

	let caption: string;
	if (!rough) caption = deg === 0 ? 'Piano orizzontale: il peso non ha componente lungo il piano, e il filo non tira.' : `Senza attrito il filo tiene fermo il blocco con una tensione uguale alla componente parallela del peso, P sin α = ${num(Ppar, 1)} N; la reazione del piano, ${num(Pperp, 1)} N, è più piccola del peso.`;
	else if (sliding) caption = `tan α = ${num(tan, 2)} supera μs = ${num(mus!, 2)}: l'attrito statico non basta, e il blocco scivola, frenato dall'attrito dinamico di ${num(friction, 1)} N.`;
	else if (atFoot && tan > mus!) caption = 'Il blocco è scivolato fino in fondo al piano: rimettilo in cima.';
	else caption = `tan α = ${num(tan, 2)} non supera μs = ${num(mus!, 2)}: il blocco resta fermo, e l'attrito statico è uguale alla componente parallela del peso, ${num(Ppar, 1)} N. L'angolo limite è ${num((Math.atan(mus!) * 180) / Math.PI, 1)}°.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{deg > 0 ? <Incline f={f} corner={corner} base={base} angle={a} /> : <Ground f={f} from={v(-0.3, 0)} to={v(L + 0.3, 0)} />}
				{deg >= 8 && <Label f={f} at={polar(0.95, a / 2)} size={13}>α</Label>}
				{!rough && (
					<>
						<Thread f={f} from={face} to={peg} />
						<path d={f.path([top, peg])} stroke="#000" strokeWidth={THICK} fill="none" />
						<circle cx={f.px(peg).x} cy={f.px(peg).y} r={2.2} fill="#000" />
					</>
				)}
				<Block f={f} at={at} w={BW} h={BH} angle={rotation} />
				{showForces && (
					<>
						{Ppar * K > 0.05 && (
							<>
								<path d={f.path([tipP, tipPar])} stroke={QTY.forza} strokeWidth={THIN} strokeDasharray={DASH} opacity={0.7} fill="none" />
								<path d={f.path([tipP, tipPerp])} stroke={QTY.forza} strokeWidth={THIN} strokeDasharray={DASH} opacity={0.7} fill="none" />
								<Vector f={f} from={c} to={tipPar} color={QTY.forza} dashed name="P" sub="∥" labelDir={out} />
							</>
						)}
						<Vector f={f} from={c} to={tipPerp} color={QTY.forza} dashed name="P" sub="⊥" labelDir={up} />
						<Vector f={f} from={c} to={tipP} color={QTY.forza} name="P" labelDir={v(-1, 0)} />
						<Vector f={f} from={c} to={add(c, scale(out, Pperp * K))} color={QTY.forza} name="F" sub="v" />
						{!rough && Ppar * K > 0.05 && <Vector f={f} from={c} to={add(c, scale(up, Ppar * K))} color={QTY.forza} name="T" labelDir={out} />}
						{rough && friction * K > 0.05 && <Vector f={f} from={c} to={add(c, scale(up, friction * K))} color={QTY.forza} name="F" sub={sliding ? 'd' : 's'} labelDir={out} />}
					</>
				)}
			</Drawing>

			<Readout>
				<Tex>{`\\alpha = ${deg}^\\circ`}</Tex>
				<Tex>{`P = ${texNum(P, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`P_\\parallel = P\\sin\\alpha = ${texNum(Ppar, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`P_\\perp = P\\cos\\alpha = ${texNum(Pperp, 1)}\\,\\text{N}`}</Tex>
				<Tex>{`F_v = ${texNum(Pperp, 1)}\\,\\text{N}`}</Tex>
				{rough ? <Tex>{`\\tan\\alpha = ${texNum(tan, 2)}`}</Tex> : <Tex>{`T = ${texNum(Ppar, 1)}\\,\\text{N}`}</Tex>}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Superfici" options={(Object.keys(MODES) as Mode[]).map((k) => ({ value: k, label: MODES[k].label }))} value={mode} onChange={(m) => reset(m)} />
				</div>
				<Slider label="Inclinazione α (gradi)" value={deg} min={0} max={60} step={1} onChange={setAngle} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={d === D0} onClick={() => reset()}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti il blocco
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
