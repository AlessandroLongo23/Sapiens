'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, useFrameLoop, useReducedMotion, useTween, THICK, THIN, DASH, INK, type V } from '../kit';
import { Arrow, Axes, Ground } from '../fisica';
import { MATERIALS, Ticks, Words, heatTint } from './calore';

/**
 * Lesson 68 (L'equilibrio termico e il calorimetro): two bodies on a table, each with its material (water, aluminium,
 * iron, lead), mass and starting temperature chosen by the student. "Metti a contatto" slides them together and plays
 * the exchange: both temperatures move towards t_e = (c1 m1 t1 + c2 m2 t2) / (c1 m1 + c2 m2) as e^(-5p) (stretched to arrive at
 * p = 1), p going from 0 to 1 in four seconds, and the graph under the bodies draws them against time, with t_e dashed. The time axis has no
 * numbers: how fast the exchange goes depends on the contact, which the lesson does not treat; only the end matters.
 * The bodies' fill goes from a cold blue tint to a warm red one with the temperature (calore.tsx).
 */

type Mat = 'acqua' | 'alluminio' | 'ferro' | 'piombo';
const MATS: Mat[] = ['acqua', 'alluminio', 'ferro', 'piombo'];
const LABEL: Record<Mat, string> = { acqua: 'Acqua', alluminio: 'Alluminio', ferro: 'Ferro', piombo: 'Piombo' };
const COL1 = INK.orange;
const COL2 = INK.blue;

const BW = 2.3, BH = 1.2, GY = 4.0; // bodies' width, height, and the table's height
const GW = 6.2, GH = 2.8; // graph: time axis length, 100 °C height
const RATE = 5; // how fast the difference shrinks along the graph
const PLAY = 4; // seconds of the exchange

const f = frame(-0.95, 6.95, -0.75, 6.0);
const yOf = (t: number) => (t / 100) * GH;

function Body({ at, t, name, color }: { at: V; t: number; name: string; color: string }) {
	return (
		<g>
			<path d={f.path([at, v(at.x + BW, at.y), v(at.x + BW, at.y + BH), v(at.x, at.y + BH)], true)} fill={heatTint(t)} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
			<Words f={f} at={v(at.x + BW / 2, at.y + BH * 0.7)} size={12} color={color}>
				{name}
			</Words>
			<Words f={f} at={v(at.x + BW / 2, at.y + BH * 0.32)} size={14}>
				{`${num(t, 1)} °C`}
			</Words>
		</g>
	);
}

export default function EquilibrioTermicoDueCorpi({ alt }: { alt?: string }) {
	const [mat1, setMat1] = useState<Mat>('ferro');
	const [m1, setM1] = useState(0.5);
	const [t1, setT1] = useState(90);
	const [mat2, setMat2] = useState<Mat>('acqua');
	const [m2, setM2] = useState(0.5);
	const [t2, setT2] = useState(20);
	const [p, setP] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [sep, goSep] = useTween(0, 600);
	const reduced = useReducedMotion();

	const C1 = MATERIALS[mat1].c * m1, C2 = MATERIALS[mat2].c * m2;
	const te = (C1 * t1 + C2 * t2) / (C1 + C2);
	// e^(-5q), stretched so that it reaches t_e exactly at q = 1
	const at = (t0: number, q: number) => te + ((t0 - te) * (Math.exp(-RATE * q) - Math.exp(-RATE))) / (1 - Math.exp(-RATE));
	const T1 = at(t1, p), T2 = at(t2, p);
	const Q = C1 * Math.abs(t1 - te);
	const started = p > 0 || playing;
	const done = p >= 1 - 1e-9;

	const reset = () => {
		setPlaying(false);
		setP(0);
		void goSep(0, 0);
	};
	const change = <T,>(set: (x: T) => void) => (x: T) => {
		set(x);
		reset();
	};

	useFrameLoop(playing, (dt) => {
		const next = Math.min(1, p + dt / PLAY);
		setP(next);
		if (next >= 1) setPlaying(false);
	});
	const start = async () => {
		if (done) return reset();
		await goSep(1);
		if (reduced) setP(1);
		else setPlaying(true);
	};

	// The bodies: apart at first, touching at x = 3.2 once in contact.
	const x1 = 0.2 + 0.7 * sep, x2 = 4.4 - 1.2 * sep;
	const left = v(x1, GY), right = v(x2, GY);
	const touching = sep > 0.999;

	// The curves up to p, and the heat arrow from the hotter body while they exchange.
	const curve = (t0: number) => Array.from({ length: 81 }, (_, i) => (i / 80) * p).map((q) => v(q * GW, yOf(at(t0, q))));
	const hot1 = T1 > T2;
	const exchanging = touching && Math.abs(T1 - T2) > 0.3;
	const ay = GY + BH + 0.35;
	const joint = x1 + BW;

	let caption: string;
	if (Math.abs(t1 - t2) < 1e-9) caption = 'I due corpi hanno già la stessa temperatura: sono in equilibrio termico, e a contatto non si scambiano calore.';
	else if (!started) caption = `Scegli i due corpi e premi «Metti a contatto». La temperatura di equilibrio sarà più vicina a quella del corpo con la capacità termica c·m più grande, il corpo ${C1 >= C2 ? 1 : 2}.`;
	else if (!done) caption = `Il corpo ${hot1 ? 1 : 2}, più caldo, cede calore al corpo ${hot1 ? 2 : 1}: le due temperature si avvicinano.`;
	else caption = `Equilibrio termico: tutti e due i corpi sono a ${num(te, 1)} °C. Il corpo ${t1 > t2 ? 1 : 2} ha ceduto ${num(Q / 1000, 1)} kJ, e il corpo ${t1 > t2 ? 2 : 1} li ha assorbiti.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(-0.3, GY)} to={v(6.9, GY)} />
				<Body at={left} t={T1} name={`1: ${MATERIALS[mat1].nome}`} color={COL1} />
				<Body at={right} t={T2} name={`2: ${MATERIALS[mat2].nome}`} color={COL2} />
				{exchanging && <Arrow f={f} from={v(hot1 ? joint - 0.6 : joint + 0.6, ay)} to={v(hot1 ? joint + 0.6 : joint - 0.6, ay)} color="#e67300" />}
				{exchanging && (
					<Words f={f} at={v(joint, ay + 0.28)} size={14}>
						<tspan fontStyle="italic">Q</tspan>
					</Words>
				)}

				<Axes f={f} x0={0} x1={GW + 0.4} y0={0} y1={GH + 0.45} xName="" yName="" />
				<Words f={f} at={v(GW + 0.4, -0.2)} anchor="end" dy="0.8em" size={12}>
					tempo
				</Words>
				<Words f={f} at={v(0.15, GH + 0.5)} anchor="start" size={12}>
					<tspan fontStyle="italic">t</tspan> (°C)
				</Words>
				<Ticks f={f} ys={[0, 20, 40, 60, 80, 100].map(yOf)} yl={['0', '20', '40', '60', '80', '100']} />
				{started && Math.abs(t1 - t2) > 1e-9 && (
					<>
						<path d={f.path([v(0, yOf(te)), v(GW, yOf(te))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
						<Words f={f} at={v(GW + 0.05, yOf(te))} anchor="start" size={13}>
							<tspan fontStyle="italic">t</tspan>
							<tspan fontSize={9} dy={3} fontStyle="italic">e</tspan>
						</Words>
						<path d={f.path(curve(t1))} stroke={COL1} strokeWidth={THICK} fill="none" />
						<path d={f.path(curve(t2))} stroke={COL2} strokeWidth={THICK} fill="none" />
					</>
				)}
				<circle cx={f.px(v(0, yOf(t1))).x} cy={f.px(v(0, yOf(t1))).y} r={2.6} fill={COL1} />
				<circle cx={f.px(v(0, yOf(t2))).x} cy={f.px(v(0, yOf(t2))).y} r={2.6} fill={COL2} />
			</Drawing>

			<Readout>
				<Tex>{`c_1 m_1 = ${texNum(C1, 0)}\\,\\text{J/}^\\circ\\text{C}`}</Tex>
				<Tex>{`c_2 m_2 = ${texNum(C2, 0)}\\,\\text{J/}^\\circ\\text{C}`}</Tex>
				<Tex>{`t_e = \\dfrac{c_1 m_1 t_1 + c_2 m_2 t_2}{c_1 m_1 + c_2 m_2} = ${texNum(te, 1)}\\,^\\circ\\text{C}`}</Tex>
				<Tex>{`Q = ${texNum(Q / 1000, 1)}\\,\\text{kJ}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<p className="m-0 text-center text-sm font-medium text-fg">
					Corpo 1
				</p>
				<div className="flex justify-center">
					<ToggleGroup label="Materiale del corpo 1" options={MATS.map((k) => ({ value: k, label: LABEL[k] }))} value={mat1} onChange={change(setMat1)} />
				</div>
				<Slider label="Massa m₁ (kg)" value={m1} min={0.1} max={2} step={0.05} onChange={change(setM1)} />
				<Slider label="Temperatura t₁ (°C)" value={t1} min={0} max={100} step={1} onChange={change(setT1)} />
				<p className="m-0 mt-2 text-center text-sm font-medium text-fg">
					Corpo 2
				</p>
				<div className="flex justify-center">
					<ToggleGroup label="Materiale del corpo 2" options={MATS.map((k) => ({ value: k, label: LABEL[k] }))} value={mat2} onChange={change(setMat2)} />
				</div>
				<Slider label="Massa m₂ (kg)" value={m2} min={0.1} max={2} step={0.05} onChange={change(setM2)} />
				<Slider label="Temperatura t₂ (°C)" value={t2} min={0} max={100} step={1} onChange={change(setT2)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={playing || Math.abs(t1 - t2) < 1e-9} onClick={start}>
						{done ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{done ? 'Separa i corpi' : 'Metti a contatto'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
