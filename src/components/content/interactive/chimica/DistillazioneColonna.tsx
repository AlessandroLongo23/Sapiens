'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, add, scale, rot, num, texNum, useFrameLoop, useReducedMotion, THICK, THIN, DASH, TINT, type V } from '../kit';
import { Axes } from '../fisica';
import { Liquid, Surface } from '../fisica/liquidi';
import { Ticks, Words } from '../fisica/calore';
import { Beuta, Flame, Thermometer, arcPts, flaskLiquid, sphereLevel } from './vetreria';

/**
 * Lesson 18 (Metodi di separazione dei miscugli), "La temperatura in testa alla colonna": the distillation apparatus
 * of the lesson's TikZ figure (separazione-distillazione-apparato) with 50 mL of a volatile liquid and 50 mL of water
 * in the flask, and beside it the graph of the temperature read by the thermometer at the head, in time. The student
 * picks the mixture (acetone and water, ethanol and water) and moves the time with a slider or plays it.
 *
 * The model is the lesson's, simplified, and written by hand: the mixture warms up for 2,5 minutes while the
 * thermometer reads the air (20 °C); the vapour reaches the bulb and the reading rises to the boiling point of the
 * volatile liquid; that liquid distils at a steady rate into the first flask, with the reading almost still (a
 * degree of drift for acetone, four for ethanol, whose first fraction keeps some water: ethanol and water form an
 * azeotrope at about 96 %, which the caption says without the word); then the reading rises to 100 °C, the flask
 * is changed, and water distils into the second one. The flask is never left to boil dry: the run stops at 18 min.
 */

type Mix = 'acetone' | 'etanolo';
const MIX: Record<Mix, { nome: string; T: number; rate: number; drift: number; trans: number }> = {
	acetone: { nome: 'acetone', T: 56, rate: 8, drift: 1, trans: 1.5 },
	etanolo: { nome: 'etanolo', T: 78, rate: 7, drift: 4, trans: 2.5 },
};
const V_A = 50, V_W = 50, RATE_W = 6, T_ROOM = 20;
const T_HEAT = 2.5, T_RISE = 0.7, END = 18, PLAY = 14;

type Phase = 'fermo' | 'scalda' | 'primo' | 'passaggio' | 'acqua';
type State = { T: number; beuta1: number; beuta2: number; flask: number; phase: Phase; dripping: boolean };

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

function stateAt(t: number, m: Mix): State {
	const M = MIX[m];
	const t1 = T_HEAT + T_RISE;
	const t2 = t1 + V_A / M.rate;
	const t3 = t2 + M.trans;
	if (t <= 0) return { T: T_ROOM, beuta1: 0, beuta2: 0, flask: V_A + V_W, phase: 'fermo', dripping: false };
	if (t < T_HEAT) return { T: T_ROOM, beuta1: 0, beuta2: 0, flask: V_A + V_W, phase: 'scalda', dripping: false };
	if (t < t1) return { T: T_ROOM + (M.T - T_ROOM) * smooth((t - T_HEAT) / T_RISE), beuta1: 0, beuta2: 0, flask: V_A + V_W, phase: 'scalda', dripping: false };
	if (t < t2) {
		const k = (t - t1) / (t2 - t1);
		const b1 = V_A * k;
		return { T: M.T + M.drift * k ** 3, beuta1: b1, beuta2: 0, flask: V_A + V_W - b1, phase: 'primo', dripping: true };
	}
	// During the change the distillate is a little of both, collected slowly in the second flask.
	const slow = 2;
	if (t < t3) {
		const b2 = slow * (t - t2);
		return { T: M.T + M.drift + (100 - M.T - M.drift) * smooth((t - t2) / M.trans), beuta1: V_A, beuta2: b2, flask: V_W - b2, phase: 'passaggio', dripping: true };
	}
	const b2 = slow * M.trans + RATE_W * (Math.min(t, END) - t3);
	return { T: 100, beuta1: V_A, beuta2: b2, flask: V_A + V_W - V_A - b2, phase: 'acqua', dripping: t < END };
}

// ---------------------------------------------------------------- apparatus (cm)

const C = v(0.9, 0.82), R = 0.62; // the flask
const NECK = 0.12; // half width of the neck
const ARM_Y = 2.55; // the side arm and the thermometer's bulb
const NECK_TOP = 3.05;
const ANG = (-22 * Math.PI) / 180;
const ARM0 = v(C.x + NECK, ARM_Y);
const along = (s: number, n = 0) => add(ARM0, add(rot(v(s, 0), ANG), rot(v(0, n), ANG)));
const TUBE = 3.25; // length of the tube along the condenser
const J0 = 0.45, J1 = 2.65; // the jacket, along the tube
const OUT = along(TUBE); // where the tube ends, above the receiver
const BENCH = -0.72;
const RX = OUT.x + 0.02; // receiver under the outlet
const RX_OLD = RX - 1.25; // where the first receiver goes when it is full

// ---------------------------------------------------------------- graph

const GX = 5.75, GY = 0;
const gx = (t: number) => GX + t * 0.23;
const gy = (T: number) => GY + (T - T_ROOM) * 0.034;
const f = frame(-0.5, 10.35, -1.2, 4.55);

/** The traced graph up to time t, sampled every 0,05 min. */
function traced(t: number, m: Mix): V[] {
	const pts: V[] = [];
	const n = Math.max(1, Math.round(t / 0.05));
	for (let i = 0; i <= n; i++) {
		const ti = (t * i) / n;
		pts.push(v(gx(ti), gy(stateAt(ti, m).T)));
	}
	return pts;
}

function Apparatus({ s, t }: { s: State; t: number }) {
	const level = C.y - R + sphereLevel(s.flask / 250, R);
	const liquid = flaskLiquid(C, R, level);
	// The flask: neck, round body, neck, with a gap on the right for the side arm.
	const bodyL = (Math.acos(NECK / R) * 180) / Math.PI; // angle where the neck meets the body
	const body = arcPts(C, R, 180 - bodyL, 360 + bodyL, 64);
	const neckL = [v(C.x - NECK, NECK_TOP), v(C.x - NECK, body[0].y)];
	const glass = [...neckL, ...body.slice(1), v(C.x + NECK, ARM_Y - 0.07)];
	const w1 = along(J0 + 0.25, 0.2), w2 = along(J1 - 0.25, -0.2); // water out (top) and in (bottom)
	const flameOn = s.phase !== 'fermo' && t < END;
	const drop = s.dripping ? v(OUT.x + 0.02, OUT.y - 0.5 - ((t * 3) % 1) * 0.35) : null;
	const bubbles = flameOn && s.phase !== 'scalda' ? [0.25, 0.55, 0.8].map((k, i) => v(C.x - 0.3 + k * 0.6, C.y - R + 0.12 + ((t * 1.7 + i * 0.33) % 1) * Math.max(0.05, level - (C.y - R) - 0.2))) : [];
	return (
		<g>
			{liquid && (
				<>
					<Liquid f={f} pts={liquid.pts} />
					<Surface f={f} from={liquid.left} to={liquid.right} />
				</>
			)}
			{bubbles.map((b, i) => (
				<circle key={i} cx={f.px(b).x} cy={f.px(b).y} r={2.2} fill="none" stroke="#000" strokeWidth={0.5} />
			))}
			<path d={f.path(glass)} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<path d={f.path([v(C.x + NECK, ARM_Y + 0.07), v(C.x + NECK, NECK_TOP)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([v(C.x - NECK - 0.05, NECK_TOP), v(C.x + NECK + 0.05, NECK_TOP), v(C.x + NECK + 0.05, NECK_TOP + 0.16), v(C.x - NECK - 0.05, NECK_TOP + 0.16)], true)} fill="#b3b3b3" stroke="#000" strokeWidth={THICK} />
			<Thermometer f={f} bottom={v(C.x, ARM_Y)} len={1.7} k={(s.T - 0) / 120} />
			<Words f={f} at={v(C.x + 0.12, ARM_Y + 1.62)} anchor="start" size={12}>
				{`${num(s.T, 0)} °C`}
			</Words>

			{/* the condenser: jacket with cold water, inner tube, water in at the bottom and out at the top */}
			<path d={f.path([along(J0, 0.2), along(J1, 0.2), along(J1, -0.2), along(J0, -0.2)], true)} fill={TINT.blue} stroke="none" />
			<path d={f.path([along(0, 0.06), along(TUBE, 0.06)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([along(0, -0.06), along(TUBE - 0.12, -0.06)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([along(J0, 0.06), along(J0, 0.2), along(J1, 0.2), along(J1, 0.06)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([along(J0, -0.06), along(J0, -0.2), along(J1, -0.2), along(J1, -0.06)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([w1, add(w1, scale(rot(v(0, 1), ANG), 0.3))])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([w2, add(w2, scale(rot(v(0, -1), ANG), 0.3))])} stroke="#000" strokeWidth={THICK} fill="none" />
			<Words f={f} at={add(w1, v(0.05, 0.5))} size={11}>
				acqua
			</Words>
			<Words f={f} at={add(w2, v(0.2, -0.5))} size={11}>
				acqua
			</Words>
			{/* the outlet into the receiver */}
			<path d={f.path([along(TUBE, 0.06), v(along(TUBE, 0.06).x, BENCH + 1.45)])} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([along(TUBE - 0.12, -0.06), v(along(TUBE - 0.12, -0.06).x, BENCH + 1.45)])} stroke="#000" strokeWidth={THICK} fill="none" />
			{drop && <circle cx={f.px(drop).x} cy={f.px(drop).y} r={2} fill="#66cccc" />}

			{/* receivers: the first under the outlet, moved aside when the reading starts to rise */}
			<Beuta f={f} x={s.phase === 'passaggio' || s.phase === 'acqua' ? RX_OLD : RX} y0={BENCH} k={s.beuta1 / 70} h={1.25} w={0.95} neck={0.34} />
			<Words f={f} at={v(s.phase === 'passaggio' || s.phase === 'acqua' ? RX_OLD : RX, BENCH - 0.28)} size={11}>
				1
			</Words>
			{(s.phase === 'passaggio' || s.phase === 'acqua') && (
				<>
					<Beuta f={f} x={RX} y0={BENCH} k={s.beuta2 / 70} h={1.25} w={0.95} neck={0.34} />
					<Words f={f} at={v(RX, BENCH - 0.28)} size={11}>
						2
					</Words>
				</>
			)}
			{/* tripod with its gauze under the flask */}
			<path d={f.path([v(C.x - 0.55, BENCH), v(C.x - 0.5, C.y - R - 0.03), v(C.x + 0.5, C.y - R - 0.03), v(C.x + 0.55, BENCH)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<Flame f={f} tip={v(C.x, C.y - R - 0.1)} h={0.42} on={flameOn} />
			<path d={f.path([v(-0.4, BENCH), v(5.0, BENCH)])} stroke="#000" strokeWidth={THICK} />
		</g>
	);
}

const TEXT: Record<Phase, (m: Mix) => string> = {
	fermo: () => 'Nel pallone ci sono 50 mL di ciascun liquido. Accendi la fiamma con Avvia, o sposta il tempo con il cursore.',
	scalda: () => 'Il miscuglio si scalda. Finché il vapore non arriva al bulbo, il termometro segna la temperatura dell’aria.',
	primo: (m) => `Distilla l’${MIX[m].nome}: il termometro resta intorno a ${MIX[m].T} °C, e nella beuta 1 si raccoglie ${MIX[m].nome}.${m === 'etanolo' ? ' Con l’etanolo la temperatura sale un poco già adesso: una sola distillazione non lo separa del tutto dall’acqua.' : ''}`,
	passaggio: (m) => `L’${MIX[m].nome} è quasi finito: la temperatura sale verso 100 °C e si cambia beuta. Quello che distilla adesso è un po’ dell’uno e un po’ dell’altro.`,
	acqua: () => 'Distilla l’acqua, a 100 °C, e si raccoglie nella beuta 2. Nel pallone si lascia sempre un po’ di liquido: non si distilla mai a secco.',
};

export default function DistillazioneColonna({ alt }: { alt?: string }) {
	const [m, setM] = useState<Mix>('acetone');
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	const s = stateAt(t, m);
	const M = MIX[m];

	useFrameLoop(playing, (dt) => {
		const next = Math.min(END, t + (dt * END) / PLAY);
		setT(next);
		if (next >= END) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(t >= END ? 0 : END);
		if (t >= END) setT(0);
		setPlaying(true);
	};

	const all = traced(END, m);
	const here = v(gx(t), gy(s.T));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Apparatus s={s} t={t} />
				<Axes f={f} o={v(GX, GY)} x0={GX - 0.1} x1={gx(END) + 0.4} y0={GY - 0.1} y1={gy(110) + 0.35} xName="" yName="" />
				<Ticks f={f} o={v(GX, GY)} xs={[5, 10, 15].map(gx)} xl={['5', '10', '15']} ys={[gy(M.T), gy(100)]} yl={[String(M.T), '100']} />
				<Words f={f} at={v(GX - 0.12, GY)} anchor="end" size={11}>
					20
				</Words>
				<Words f={f} at={v(gx(END) + 0.4, GY - 0.55)} anchor="end" size={12}>
					tempo (min)
				</Words>
				<Words f={f} at={v(GX + 0.12, gy(110) + 0.4)} anchor="start" size={12}>
					<tspan fontStyle="italic">t</tspan> (°C)
				</Words>
				<path d={f.path([v(GX, gy(M.T)), v(gx(END), gy(M.T))])} stroke="#999" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(GX, gy(100)), v(gx(END), gy(100))])} stroke="#999" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path(all)} stroke="#b3b3b3" strokeWidth={THICK} fill="none" />
				<path d={f.path(traced(t, m))} stroke="#1a1ab3" strokeWidth={THICK * 1.6} fill="none" strokeLinejoin="round" />
				<circle cx={f.px(here).x} cy={f.px(here).y} r={3.4} fill="#e67300" />
			</Drawing>

			<Readout>
				<span>tempo {num(t, 1)} min</span>
				<Tex>{`t = ${texNum(s.T, 0)}\\,^\\circ\\text{C}`}</Tex>
				<span>beuta 1: {num(s.beuta1, 0)} mL</span>
				<span>beuta 2: {num(s.beuta2, 0)} mL</span>
			</Readout>
			<Caption>{TEXT[s.phase](m)}</Caption>

			<Controls>
				<ToggleGroup
					label="Miscuglio"
					options={[
						{ value: 'acetone', label: 'acetone e acqua' },
						{ value: 'etanolo', label: 'etanolo e acqua' },
					]}
					value={m}
					onChange={(x) => {
						setPlaying(false);
						setT(0);
						setM(x);
					}}
				/>
				<Slider label="Tempo (min)" value={Math.round(t * 10) / 10} min={0} max={END} step={0.1} onChange={(x) => { setPlaying(false); setT(Math.min(END, Math.max(0, x))); }} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t >= END ? 'Riparti' : t > 0 ? 'Continua' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
