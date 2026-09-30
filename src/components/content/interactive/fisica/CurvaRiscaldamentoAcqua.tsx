'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, useFrameLoop, useReducedMotion, THICK, THIN, DASH, type V } from '../kit';
import { Axes } from '../fisica';
import { Liquid, Surface, Vessel, LIQUID } from './liquidi';
import { Ticks, Words } from './calore';

/**
 * Lesson 70 (I passaggi di stato e il calore latente): heat given to 0,50 kg of ice at -40 °C, as in the lesson's
 * TikZ graph (grafico-temperatura-calore-acqua). The student moves the heat Q with a slider, or plays it at a steady
 * pace; a point runs along the temperature-heat graph (ice warming with c = 2,1·10³, melting at 0 °C for
 * L_f m = 167 kJ, water warming with c = 4186, boiling at 100 °C for L_v m = 1130 kJ, steam warming with c = 2,0·10³,
 * up to 140 °C), and the beaker beside it shows what is inside: ice cubes, cubes floating in the water that grows,
 * water, water that boils and goes down, and at the end only steam (dots), which the caption says is kept in a closed
 * vessel. Numbers from the lesson; the graph is drawn for this figure, not the kit's cartesian plane.
 */

const M = 0.5;
const C_ICE = 2100, C_WATER = 4186, C_STEAM = 2000, LF = 3.34e5, LV = 2.26e6;
const T0 = -40, T_END = 140;
// Where each stretch ends, in kJ.
const Q1 = (M * C_ICE * (0 - T0)) / 1000; // 42
const Q2 = Q1 + (M * LF) / 1000; // 209
const Q3 = Q2 + (M * C_WATER * 100) / 1000; // 418,3
const Q4 = Q3 + (M * LV) / 1000; // 1548,3
const Q5 = Q4 + (M * C_STEAM * (T_END - 100)) / 1000; // 1588,3
const PLAY = 14; // seconds for the whole graph

type State = { t: number; ice: number; water: number; steam: number; phase: 'ghiaccio' | 'fusione' | 'acqua' | 'ebollizione' | 'vapore' };

/** Temperature and masses (kg) after Q kJ. */
function stateAt(Q: number): State {
	if (Q <= Q1) return { t: T0 + (Q * 1000) / (M * C_ICE), ice: M, water: 0, steam: 0, phase: 'ghiaccio' };
	if (Q < Q2) {
		const melted = ((Q - Q1) * 1000) / LF;
		return { t: 0, ice: M - melted, water: melted, steam: 0, phase: 'fusione' };
	}
	if (Q <= Q3) return { t: ((Q - Q2) * 1000) / (M * C_WATER), ice: 0, water: M, steam: 0, phase: 'acqua' };
	if (Q < Q4) {
		const gone = ((Q - Q3) * 1000) / LV;
		return { t: 100, ice: 0, water: M - gone, steam: gone, phase: 'ebollizione' };
	}
	return { t: 100 + ((Q - Q4) * 1000) / (M * C_STEAM), ice: 0, water: 0, steam: M, phase: 'vapore' };
}

// Graph: origin at (GX, 0); 1 cm per 250 kJ, 0,018 cm per °C (as the TikZ graph, narrower).
const GX = 2.65;
const gx = (Q: number) => GX + Q / 250;
const gy = (t: number) => t * 0.018;
const CORNERS: [number, number][] = [
	[0, T0],
	[Q1, 0],
	[Q2, 0],
	[Q3, 100],
	[Q4, 100],
	[Q5, T_END],
];

// Beaker: inner width 1,5 cm, bottom at y = -0.8; 0,5 kg of water fill 1,4 cm.
const BX0 = 0, BX1 = 1.5, BY = -0.8, FULL = 1.4, TOP = 2.2;
const f = frame(-0.2, 9.75, -1.35, 3.25);

/** The points of the graph up to Q. */
function traced(Q: number): V[] {
	const pts: V[] = [];
	for (let i = 0; i < CORNERS.length; i++) {
		const [q, t] = CORNERS[i];
		if (q <= Q) pts.push(v(gx(q), gy(t)));
		else {
			pts.push(v(gx(Q), gy(stateAt(Q).t)));
			break;
		}
	}
	return pts;
}

/** A fixed pseudo-random number in [0, 1) for the i-th dot of steam. */
const hash = (i: number) => {
	const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
	return x - Math.floor(x);
};

/** A cube of ice with side s, lower left corner at p. */
function Cube({ p, s }: { p: V; s: number }) {
	return <path d={f.path([p, v(p.x + s, p.y), v(p.x + s, p.y + s), v(p.x, p.y + s)], true)} fill="#f4fbff" stroke="#000" strokeWidth={THIN} />;
}

function Beaker({ s, Q }: { s: State; Q: number }) {
	const level = BY + (FULL * s.water) / M;
	// Six cubes when all is ice, fewer as it melts; they sit on the bottom, or float once there is enough water.
	const n = s.ice > 0 ? Math.max(1, Math.ceil((6 * s.ice) / M)) : 0;
	const side = 0.42;
	const slots: V[] = [v(0.1, 0), v(0.54, 0), v(0.98, 0), v(0.3, 0.44), v(0.74, 0.44), v(0.52, 0.88)];
	const lift = s.water > 0.2 ? Math.max(0, level - BY - side * 0.9) : 0;
	const bubbles = s.phase === 'ebollizione' && level - BY > 0.15 ? [0.3, 0.75, 1.15, 0.5, 1.0].map((x, i) => v(x, BY + ((Q * 0.7 + i * 0.37) % 1) * (level - BY - 0.1) + 0.05)) : [];
	const dots = s.steam > 0 ? Array.from({ length: Math.round((24 * s.steam) / M) }, (_, i) => v(BX0 + 0.12 + hash(i) * 1.26, Math.max(level, BY) + 0.12 + hash(i + 97) * (TOP - Math.max(level, BY) - 0.3))) : [];
	return (
		<g>
			{s.water > 0 && (
				<>
					<Liquid f={f} pts={[v(BX0, BY), v(BX1, BY), v(BX1, level), v(BX0, level)]} fill={LIQUID.acqua} />
					<Surface f={f} from={v(BX0, level)} to={v(BX1, level)} />
				</>
			)}
			{slots.slice(0, n).map((p, i) => (
				<Cube key={i} p={v(BX0 + p.x, BY + 0.02 + p.y + lift)} s={side} />
			))}
			{bubbles.map((b, i) => (
				<circle key={i} cx={f.px(b).x} cy={f.px(b).y} r={2.6} fill="#fff" stroke="#000" strokeWidth={0.5} />
			))}
			{dots.map((d, i) => (
				<circle key={i} cx={f.px(d).x} cy={f.px(d).y} r={1.6} fill="#808080" />
			))}
			<Vessel f={f} pts={[v(BX0, TOP), v(BX0, BY), v(BX1, BY), v(BX1, TOP)]} />
			{/* the burner under the beaker */}
			<path d={f.path([v(0.35, BY - 0.25), v(1.15, BY - 0.25)])} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(0.55, BY - 0.25), v(0.62, BY - 0.08), v(0.7, BY - 0.2), v(0.75, BY - 0.05), v(0.8, BY - 0.2), v(0.88, BY - 0.08), v(0.95, BY - 0.25)])} fill="#ffdfbf" stroke="#e67300" strokeWidth={THIN} />
		</g>
	);
}

const PHASE_TEXT: Record<State['phase'], string> = {
	ghiaccio: 'Il ghiaccio si scalda: la temperatura sale.',
	fusione: 'Il ghiaccio fonde a 0 °C: la temperatura resta ferma finché non si è sciolto tutto, e il calore fornito è calore latente di fusione.',
	acqua: 'Tutto il ghiaccio è diventato acqua, che si scalda: la salita è meno ripida, perché il calore specifico dell’acqua è circa il doppio di quello del ghiaccio.',
	ebollizione: 'L’acqua bolle a 100 °C: la temperatura resta ferma finché tutta l’acqua non è diventata vapore. È il pianerottolo più lungo, perché Lv è quasi sette volte Lf.',
	vapore: 'Tutta l’acqua è diventata vapore, che, raccolto in un recipiente chiuso, continua a scaldarsi.',
};

export default function CurvaRiscaldamentoAcqua({ alt }: { alt?: string }) {
	const [Q, setQ] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	const s = stateAt(Q);

	useFrameLoop(playing, (dt) => {
		const next = Math.min(Q5, Q + (dt * Q5) / PLAY);
		setQ(next);
		if (next >= Q5) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setQ(Q >= Q5 ? 0 : Q5);
		if (Q >= Q5) setQ(0);
		setPlaying(true);
	};

	const all = CORNERS.map(([q, t]) => v(gx(q), gy(t)));
	const here = v(gx(Q), gy(s.t));
	const g = (x: number) => num(x * 1000, 0);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Beaker s={s} Q={Q} />

				<Axes f={f} o={v(GX, 0)} x0={GX - 0.15} x1={gx(Q5) + 0.45} y0={gy(T0) - 0.2} y1={gy(T_END) + 0.4} xName="" yName="" />
				<Ticks f={f} o={v(GX, 0)} xs={[400, 800, 1200, 1600].map(gx)} xl={['400', '800', '1200', '1600']} ys={[gy(-40), gy(100), gy(140)]} yl={['−40', '100', '140']} />
				<Words f={f} at={v(GX - 0.12, 0.13)} anchor="end" size={11}>
					0
				</Words>
				<Words f={f} at={v(gx(Q5) + 0.45, 0.2)} anchor="end" dy="0" size={12}>
					<tspan fontStyle="italic">Q</tspan> (kJ)
				</Words>
				<Words f={f} at={v(GX + 0.12, gy(T_END) + 0.45)} anchor="start" size={12}>
					<tspan fontStyle="italic">t</tspan> (°C)
				</Words>
				<path d={f.path(all)} stroke="#b3b3b3" strokeWidth={THICK} fill="none" />
				<path d={f.path(traced(Q))} stroke="#1a1ab3" strokeWidth={THICK * 1.6} fill="none" strokeLinejoin="round" />
				<path d={f.path([v(here.x, 0), here])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<circle cx={f.px(here).x} cy={f.px(here).y} r={3.4} fill="#e67300" />
				<Words f={f} at={v(gx((Q1 + Q2) / 2) + 0.1, -0.25)} size={11}>
					fusione
				</Words>
				<Words f={f} at={v(gx((Q3 + Q4) / 2), gy(100) + 0.2)} size={11}>
					ebollizione
				</Words>
			</Drawing>

			<Readout>
				<Tex>{`Q = ${texNum(Q, 0)}\\,\\text{kJ}`}</Tex>
				<Tex>{`t = ${texNum(s.t, 1)}\\,^\\circ\\text{C}`}</Tex>
				<span>ghiaccio {g(s.ice)} g</span>
				<span>acqua {g(s.water)} g</span>
				<span>vapore {g(s.steam)} g</span>
			</Readout>
			<Caption>{Q === 0 ? 'Mezzo chilogrammo di ghiaccio a −40 °C. Fornisci calore con il cursore o con Avvia.' : PHASE_TEXT[s.phase]}</Caption>

			<Controls>
				<Slider label="Calore fornito Q (kJ)" value={Math.round(Q)} min={0} max={Math.ceil(Q5)} step={1} onChange={(x) => { setPlaying(false); setQ(Math.min(Q5, x)); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : Q >= Q5 ? 'Riparti' : Q > 0 ? 'Continua' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={Q === 0} onClick={() => { setPlaying(false); setQ(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
