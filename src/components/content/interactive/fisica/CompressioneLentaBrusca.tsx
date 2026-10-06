'use client';

import { useState } from 'react';
import { ChevronsLeft, ChevronLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, texNum, useFrameLoop, useReducedMotion, THICK, THIN, DASH, TINT } from '../kit';
import { Axes } from '../fisica';
import { Ticks, Words } from './calore';
import { Molecules, R_MOL, advance, cloneGas, makeGas, setRms, type Gas } from './molecole';

/**
 * Lesson 107 (Sistemi termodinamici e principio zero): why a slow compression is a line in the pressure-volume plane
 * and a sudden one is not. A gas kept at 300 K by its walls goes from A (4,0 L, 100 kPa) to B (2,0 L, 200 kPa). Slowly
 * (7 s): the molecules stay evenly spread, the two halves of the gas hold about the same number, and the state's
 * point slides along p = 400 J / V under the piston. At once (0,25 s): the piston sweeps the molecules before it, the
 * half near the piston holds many more than the other, there is no single pressure and no point, until the gas has
 * spread again (2,5 s) and the point appears in B. The cylinder stands over the graph with the same scale of
 * volumes, so the piston is always above the state's point.
 */

const CM_PER_L = 1.3;
const VA = 4, VB = 2, PV = 400; // litres, and p·V in kPa·L (that is, joules)
const H = 1.5, D = 1.6;
const CYL = v(0, 4.75); // lower left corner of the gas
const N = 90;
const R_DRAWN = 0.07; // ninety molecules: drawn a little smaller than in the lessons' figures
const SCREEN = 2.4; // cm/s of root-mean-square speed
const T_SLOW = 7, T_FAST = 0.25, T_SETTLE = 2.5;
const CM_PER_KPA = 0.013;

const f = frame(-0.75, 6.6, -0.75, 7.2);
const xOf = (V: number) => V * CM_PER_L;
const yOf = (p: number) => p * CM_PER_KPA;

type Phase = 'A' | 'slow' | 'fast' | 'settling' | 'B';
type Sim = { g: Gas; phase: Phase; t: number; how: 'slow' | 'fast' | null; trace: number[] };

const fresh = (V: number): Gas => makeGas(N, { W: xOf(V), H, D }, SCREEN, 5);
const start = (): Sim => ({ g: fresh(VA), phase: 'A', t: 0, how: null, trace: [] });

function step(prev: Sim, dt: number): Sim {
	const g = cloneGas(prev.g);
	const t = prev.t + dt;
	if (prev.phase === 'slow' || prev.phase === 'fast') {
		const total = prev.phase === 'slow' ? T_SLOW : T_FAST;
		const W = xOf(VA + (VB - VA) * Math.min(1, t / total));
		const u = (W - g.W) / dt;
		g.W = W;
		if (prev.phase === 'slow') {
			// a true bounce on the moving piston, which would warm the gas; the walls take that energy away at once
			advance(g, dt, { u, elastic: true });
			setRms(g, SCREEN);
		} else advance(g, dt, { u, elastic: false }); // swept along, as by a snowplough
		const trace = prev.phase === 'slow' ? [...prev.trace, W / CM_PER_L] : prev.trace;
		if (t >= total) return { g, phase: prev.phase === 'slow' ? 'B' : 'settling', t: 0, how: prev.how, trace };
		return { ...prev, g, t, trace };
	}
	advance(g, dt);
	if (prev.phase === 'settling' && t >= T_SETTLE) return { ...prev, g, phase: 'B', t: 0 };
	return { ...prev, g, t };
}

export default function CompressioneLentaBrusca({ alt }: { alt?: string }) {
	const [sim, setSim] = useState<Sim>(start);
	const reduced = useReducedMotion();
	const moving = sim.phase === 'slow' || sim.phase === 'fast' || sim.phase === 'settling';
	useFrameLoop(moving, (dt) => setSim((prev) => step(prev, dt)));

	const compress = (how: 'slow' | 'fast') => {
		if (reduced) {
			// no animation: the end of the compression, with the whole line if it was slow
			const trace = how === 'slow' ? Array.from({ length: 41 }, (_, i) => VA + ((VB - VA) * i) / 40) : [];
			return setSim({ g: fresh(VB), phase: 'B', t: 0, how, trace });
		}
		setSim((prev) => ({ ...prev, phase: how, t: 0, how, trace: how === 'slow' ? [VA] : [] }));
	};

	const { g, phase, how, trace } = sim;
	const V = g.W / CM_PER_L;
	const inEquilibrium = phase !== 'fast' && phase !== 'settling';
	const p = PV / V;
	const left = g.x.filter((x) => x < g.W / 2).length;
	const right = g.x.length - left;
	const wallX = CYL.x + g.W + R_MOL;
	const top = CYL.y + H + R_MOL, bottom = CYL.y - R_MOL;

	let caption: string;
	if (phase === 'A') caption = 'Stato A: il gas è in equilibrio, con le molecole distribuite in modo uniforme. Comprimilo in uno dei due modi.';
	else if (phase === 'slow') caption = 'Il pistone avanza piano: le molecole restano distribuite in modo uniforme, e in ogni istante il gas ha una pressione. Il punto dello stato disegna una linea.';
	else if (phase === 'fast' || phase === 'settling') caption = 'Il pistone ha spinto le molecole davanti a sé: vicino al pistone il gas è più denso. Non c’è una sola pressione, e nel piano non c’è un punto da segnare.';
	else if (how === 'slow') caption = 'Stato B. La compressione lenta è passata solo per stati di equilibrio: è la linea da A a B.';
	else caption = 'Stato B: il gas è tornato uniforme. Della compressione brusca si possono segnare solo lo stato iniziale e quello finale.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the cylinder, open on the right, and the piston with its rod */}
				<path d={f.path([v(CYL.x - R_MOL, bottom), v(wallX, bottom), v(wallX, top), v(CYL.x - R_MOL, top)], true)} fill={TINT.blue} stroke="none" />
				<path d={f.path([v(6.3, top), v(CYL.x - R_MOL, top), v(CYL.x - R_MOL, bottom), v(6.3, bottom)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<path d={f.path([v(wallX, bottom), v(wallX + 0.22, bottom), v(wallX + 0.22, top), v(wallX, top)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([v(wallX + 0.22, CYL.y + H / 2), v(Math.max(wallX + 0.5, 6.5), CYL.y + H / 2)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(CYL.x + g.W / 2, bottom), v(CYL.x + g.W / 2, top)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.6} />
				<Molecules f={f} g={g} at={CYL} r={R_DRAWN} />
				<Words f={f} at={v(CYL.x + g.W / 4, top + 0.3)} size={13}>
					{left}
				</Words>
				<Words f={f} at={v(CYL.x + (3 * g.W) / 4, top + 0.3)} size={13}>
					{right}
				</Words>
				<Words f={f} at={v(CYL.x + g.W / 2, top + 0.72)} size={12}>
					molecole nelle due metà
				</Words>

				{/* the pressure-volume plane, with the volume on the cylinder's own scale */}
				<Axes f={f} x0={0} x1={6.2} y0={0} y1={3.55} xName="" yName="" />
				<Ticks f={f} xs={[1, 2, 3, 4].map(xOf)} xl={['1', '2', '3', '4']} ys={[100, 200].map(yOf)} yl={['100', '200']} />
				<Words f={f} at={v(6.2, -0.5)} anchor="end" size={12}>
					<tspan fontStyle="italic">V</tspan> (L)
				</Words>
				<Words f={f} at={v(0.15, 3.55)} anchor="start" size={12}>
					<tspan fontStyle="italic">p</tspan> (kPa)
				</Words>
				{trace.length > 1 && <path d={f.path(trace.map((x) => v(xOf(x), yOf(PV / x))))} stroke="#6666ff" strokeWidth={THICK} fill="none" />}
				<circle cx={f.px(v(xOf(VA), yOf(PV / VA))).x} cy={f.px(v(xOf(VA), yOf(PV / VA))).y} r={3} fill="#000" />
				<Label f={f} at={v(xOf(VA), yOf(PV / VA))} dir={v(0.7, 0.7)}>
					A
				</Label>
				{phase === 'B' && (
					<>
						<circle cx={f.px(v(xOf(VB), yOf(PV / VB))).x} cy={f.px(v(xOf(VB), yOf(PV / VB))).y} r={3} fill="#000" />
						<Label f={f} at={v(xOf(VB), yOf(PV / VB))} dir={v(0.7, 0.7)}>
							B
						</Label>
					</>
				)}
				{phase === 'slow' && <circle cx={f.px(v(xOf(V), yOf(p))).x} cy={f.px(v(xOf(V), yOf(p))).y} r={3.4} fill="#e67300" />}
				{!inEquilibrium && (
					<Words f={f} at={v(xOf(3), yOf(175))} size={22} color="#e67300">
						?
					</Words>
				)}
				{inEquilibrium && <path d={f.path([v(xOf(V), yOf(p)), v(xOf(V), bottom)])} stroke="#000" strokeWidth={THIN} strokeDasharray="1.5 3" fill="none" opacity={0.5} />}
			</Drawing>

			<Readout>
				<Tex>{`V = ${V.toFixed(1).replace('.', '{,}')}\\,\\text{L}`}</Tex>
				<Tex>{inEquilibrium ? `p = ${texNum(p, 0)}\\,\\text{kPa}` : 'p = \\;?'}</Tex>
				<Tex>{'T = 300\\,\\text{K}'}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={phase !== 'A'} onClick={() => compress('slow')}>
						<ChevronLeft className="size-4" aria-hidden="true" />
						Comprimi piano
					</Button>
					<Button variant="secondary" size="sm" disabled={phase !== 'A'} onClick={() => compress('fast')}>
						<ChevronsLeft className="size-4" aria-hidden="true" />
						Comprimi di colpo
					</Button>
					<Button variant="secondary" size="sm" disabled={phase === 'A'} onClick={() => setSim(start())}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Riporta il pistone
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
