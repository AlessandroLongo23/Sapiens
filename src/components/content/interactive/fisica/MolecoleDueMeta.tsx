'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, useFrameLoop, useReducedMotion, K, DASH, THICK, THIN, TINT } from '../kit';
import { particle, step, type Box, type Particle } from '../chimica/gas';
import { Words } from './calore';

/**
 * Lesson 119 (Entropia e disordine): N molecules in a box of two equal halves, all in the left half behind a wall.
 * "Togli la parete" lets them move in the whole box (straight lines and bounces, chimica/gas.tsx; no collisions between
 * them: a perfect gas). The macrostate is the number N_s of molecules on the left; under the box the bars show the
 * multiplicity Ω = N!/(N_s! N_d!) of every macrostate, with the present one highlighted, and the readout gives Ω, its
 * probability Ω/2^N and the share of the time spent with all the molecules on the left since the wall was removed:
 * about 6% with 4 molecules (1/16), nothing one can see with 40. With reduced motion the button draws a new microstate
 * at random instead of playing the motion, and the share is counted over the draws.
 */

const BOX: Box = { x0: 0, x1: 6.2, y0: 0.3, y1: 3.3 };
const MID = (BOX.x0 + BOX.x1) / 2;
const LEFT: Box = { ...BOX, x1: MID };
const R = 0.07;
const SPEED = 2.4; // mean speed, cm/s
const BASE = -2.25, TOP = 1.85; // the bars' base line and the height of the tallest one

const f = frame(-0.3, 6.5, -2.9, 3.5);

/** N!/(k!(N-k)!) as a float: exact up to 2^53, and close enough beyond for a readout with three figures. */
function multiplicity(n: number, k: number) {
	let c = 1;
	for (let i = 1; i <= Math.min(k, n - k); i++) c = (c * (n - i + 1)) / i;
	return Math.round(c);
}

/** A count or a probability for <Tex>: plain when it is short, otherwise m \cdot 10^{e} with three figures. */
function big(x: number) {
	if (x >= 1 && x < 1e6) return String(Math.round(x));
	const e = Math.floor(Math.log10(x));
	return `${texNum(x / 10 ** e, 2)} \\cdot 10^{${e}}`;
}

/** `time` and `allLeft` run from the first molecule that crosses the middle (`mixed`), so the start is not counted. */
type State = { ps: Particle[]; time: number; allLeft: number; mixed: boolean };
const start = (n: number): State => ({ ps: Array.from({ length: n }, () => particle(LEFT, R, SPEED)), time: 0, allLeft: 0, mixed: false });

export default function MolecoleDueMeta({ alt }: { alt?: string }) {
	const [n, setN] = useState(4);
	const [state, setState] = useState<State>(() => start(4));
	const [open, setOpen] = useState(false);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	const left = state.ps.filter((p) => p.x < MID).length;
	const omega = multiplicity(n, left);
	const prob = omega / 2 ** n;
	const share = state.time > 0 ? state.allLeft / state.time : 0;

	useFrameLoop(playing, (dt) => {
		setState((s) => {
			const ps = s.ps.map((p) => {
				const q = { ...p };
				step(q, BOX, R, dt);
				return q;
			});
			const all = ps.every((p) => p.x < MID);
			const mixed = s.mixed || !all;
			return { ps, time: s.time + (mixed ? dt : 0), allLeft: s.allLeft + (mixed && all ? dt : 0), mixed };
		});
	});

	const reset = (count: number) => {
		setPlaying(false);
		setOpen(false);
		setState(start(count));
	};
	/** Reduced motion: a new microstate drawn at random, each molecule anywhere in the box. */
	const shuffle = () =>
		setState((s) => {
			const ps = Array.from({ length: n }, () => particle(BOX, R, SPEED));
			return { ps, time: s.time + 1, allLeft: s.allLeft + (ps.every((p) => p.x < MID) ? 1 : 0), mixed: true };
		});
	const main = () => {
		if (reduced) {
			setOpen(true);
			shuffle();
		} else if (!open) {
			setOpen(true);
			setPlaying(true);
		} else setPlaying(!playing);
	};

	const max = multiplicity(n, Math.floor(n / 2));
	const bw = (BOX.x1 - BOX.x0) / (n + 1);

	let caption: string;
	if (!open) caption = `Tutte le ${n} molecole sono a sinistra, dietro la parete: è un macrostato con un solo microstato. Togli la parete.`;
	else if (left === n) caption = `In questo istante le molecole sono tutte a sinistra, come all'inizio: con ${n} molecole capita ${n <= 6 ? 'abbastanza spesso' : 'molto di rado'}.`;
	else caption = `Ora le molecole a sinistra sono ${left} su ${n}: questo macrostato si realizza in ${omega < 1e6 ? omega : 'moltissimi'} modi. La scatola passa quasi tutto il tempo nei macrostati con le barre più alte.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={f.px(v(BOX.x0, BOX.y1)).x} y={f.px(v(BOX.x0, BOX.y1)).y} width={(BOX.x1 - BOX.x0) * K} height={(BOX.y1 - BOX.y0) * K} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				{open ? (
					<path d={f.path([v(MID, BOX.y0), v(MID, BOX.y1)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				) : (
					<path d={f.path([v(MID, BOX.y0), v(MID, BOX.y1)])} stroke="#000" strokeWidth={2.4} />
				)}
				{state.ps.map((p, i) => {
					const c = f.px(v(p.x, p.y));
					return <circle key={i} cx={c.x} cy={c.y} r={R * K} fill="#000099" />;
				})}

				{Array.from({ length: n + 1 }, (_, k) => {
					const h = Math.max((multiplicity(n, k) / max) * TOP, 0.03);
					const a = f.px(v(BOX.x0 + k * bw, BASE + h));
					return <rect key={k} x={a.x} y={a.y} width={bw * K} height={h * K} fill={k === left ? '#ff8000' : TINT.blue} stroke="#000" strokeWidth={n > 30 ? 0.4 : THIN} />;
				})}
				<path d={f.path([v(BOX.x0 - 0.1, BASE), v(BOX.x1 + 0.1, BASE)])} stroke="#000" strokeWidth={THICK} />
				<Words f={f} at={v(BOX.x0 + bw / 2, BASE - 0.12)} dy="0.8em" size={12}>
					0
				</Words>
				<Words f={f} at={v(BOX.x1 - bw / 2, BASE - 0.12)} dy="0.8em" size={12}>
					{n}
				</Words>
				<Words f={f} at={v(MID, BASE - 0.12)} dy="0.8em" size={12}>
					molecole a sinistra
				</Words>
				<Words f={f} at={v(BOX.x0, BASE + TOP + 0.22)} anchor="start" size={12}>
					microstati di ogni macrostato
				</Words>
			</Drawing>

			<Readout>
				<Tex>{`N_s = ${left}`}</Tex>
				<Tex>{`N_d = ${n - left}`}</Tex>
				<Tex>{`\\Omega = \\dfrac{${n}!}{${left}!\\,${n - left}!} = ${big(omega)}`}</Tex>
				<Tex>{`P = \\dfrac{\\Omega}{2^{${n}}} = ${prob >= 0.001 ? `${texNum(prob * 100, prob < 0.1 ? 2 : 1)}\\,\\%` : big(prob)}`}</Tex>
				{open && <span>tutte a sinistra: {num(share * 100, 1)} % {reduced ? 'delle estrazioni' : 'del tempo'}</span>}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Molecole N" value={n} min={4} max={60} step={2} onChange={(x) => { setN(x); reset(x); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={main}>
						{reduced ? <Shuffle className="size-4" aria-hidden="true" /> : playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{reduced ? (open ? 'Mescola ancora' : 'Togli la parete') : !open ? 'Togli la parete' : playing ? 'Ferma' : 'Riprendi'}
					</Button>
					<Button variant="secondary" size="sm" disabled={!open} onClick={() => reset(n)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Rimetti la parete
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
