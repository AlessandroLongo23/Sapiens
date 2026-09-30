'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, useFrameLoop, useReducedMotion, THICK, THIN, DASH, TINT, type V } from '../kit';
import { Axes } from '../fisica';
import { Liquid, Surface, Vessel } from '../fisica/liquidi';
import { Ticks, Words } from '../fisica/calore';
import { Flame, Thermometer } from './vetreria';

/**
 * Lesson 20 (Curve di riscaldamento e di raffreddamento), "Sostanze pure e miscugli": a test tube with a solid and a
 * thermometer, heated in a water bath, beside the graph of its temperature in time, from 40 to 95 °C in 15 minutes.
 * The student picks the solid (pure naphthalene, naphthalene with some impurity, paraffin wax) and moves the time or
 * plays it. The pure substance has a plateau at 80 °C; the impure one melts between 74 and 78 °C, the paraffin
 * between 52 and 58 °C, with the temperature rising slowly while they melt.
 *
 * The curves are the lesson's model, piecewise linear and written by hand (constant heating, a melting interval
 * crossed at a steady pace); the intervals of the impure naphthalene and of the paraffin are indicative (the notes
 * say so: paraffins melt anywhere from about 45 to 65 °C). The drawing of the tube shows the solid shrinking and the
 * liquid above it.
 */

type Sub = 'puro' | 'impuro' | 'paraffina';
/** Corners [min, °C] of the curve: solid warming, melting, liquid warming. */
const SUBS: Record<Sub, { nome: string; pts: [number, number][] }> = {
	puro: { nome: 'naftalene puro', pts: [[0, 40], [5, 80], [11, 80], [15, 95]] },
	impuro: { nome: 'naftalene impuro', pts: [[0, 40], [4.25, 74], [10.25, 78], [15, 95]] },
	paraffina: { nome: 'paraffina', pts: [[0, 40], [1.5, 52], [8.5, 58], [15, 95]] },
};
const END = 15, PLAY = 12;

type State = { T: number; melted: number; phase: 'solido' | 'fusione' | 'liquido' };

function stateAt(t: number, s: Sub): State {
	const [a, b, c, d] = SUBS[s].pts;
	const lin = (p: [number, number], q: [number, number]) => p[1] + ((q[1] - p[1]) * (t - p[0])) / (q[0] - p[0]);
	if (t <= b[0]) return { T: lin(a, b), melted: 0, phase: 'solido' };
	if (t < c[0]) return { T: lin(b, c), melted: (t - b[0]) / (c[0] - b[0]), phase: 'fusione' };
	return { T: lin(c, d), melted: 1, phase: 'liquido' };
}

// Water bath: beaker 0..2.2, water up to 2.0; test tube inner 0.8..1.3, bottom (round) at 0.45, contents 1.4 high.
const BW = 2.2, WATER = 2.0, TX0 = 0.82, TX1 = 1.32, TB = 0.5, FILL = 1.3, TUBE_TOP = 3.0;
// Graph.
const GX = 3.3, GY = 0;
const gx = (t: number) => GX + t * 0.33;
const gy = (T: number) => GY + (T - 30) * 0.05;
const f = frame(-0.5, 9.1, -1.2, 4.25);

function arcBottom(c: V, r: number, n = 20): V[] {
	return Array.from({ length: n + 1 }, (_, i) => {
		const a = Math.PI + (Math.PI * i) / n;
		return v(c.x + r * Math.cos(a), c.y + r * Math.sin(a));
	});
}

function Bath({ st, t }: { st: State; t: number }) {
	const r = (TX1 - TX0) / 2;
	const cx = (TX0 + TX1) / 2;
	const bottom = arcBottom(v(cx, TB), r * 0.9);
	const solidTop = TB + FILL * (1 - st.melted);
	const liquidTop = TB + FILL * (1 - 0.1 * st.melted); // the liquid takes a little less room than the powder
	const flameOn = t > 0 && t < END;
	const g = 0.05;
	return (
		<g>
			<Liquid f={f} pts={[v(0.05, 0.05), v(BW - 0.05, 0.05), v(BW - 0.05, WATER), v(0.05, WATER)]} />
			<Surface f={f} from={v(0.05, WATER)} to={v(BW - 0.05, WATER)} />
			{/* contents of the tube: liquid above, what is left of the solid below */}
			{st.melted > 0 && <path d={f.path([v(TX0 + g, TB), ...bottom.slice(1, -1), v(TX1 - g, TB), v(TX1 - g, liquidTop), v(TX0 + g, liquidTop)], true)} fill={TINT.yellow} />}
			{st.melted > 0 && <path d={f.path([v(TX0 + g, liquidTop), v(TX1 - g, liquidTop)])} stroke="#000" strokeWidth={THIN} />}
			{st.melted < 1 && <path d={f.path([v(TX0 + g, TB), ...bottom.slice(1, -1), v(TX1 - g, TB), v(TX1 - g, solidTop), v(TX0 + g, solidTop)], true)} fill="#d9d9d9" stroke="#808080" strokeWidth={0.5} />}
			<Thermometer f={f} bottom={v(cx, TB)} len={3.0} k={(st.T - 20) / 90} />
			<path d={f.path([v(TX0, TUBE_TOP), v(TX0, TB), ...bottom.map((p) => v(p.x + (p.x - cx) * 0.11, p.y - 0.02)), v(TX1, TB), v(TX1, TUBE_TOP)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<Vessel f={f} pts={[v(-0.1, 2.6), v(0, 2.5), v(0, 0), v(BW, 0), v(BW, 2.5), v(BW + 0.1, 2.6)]} />
			<path d={f.path([v(0.45, -0.95), v(0.5, -0.03), v(BW - 0.5, -0.03), v(BW - 0.45, -0.95)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			<Flame f={f} tip={v(BW / 2, -0.1)} h={0.42} on={flameOn} />
			<path d={f.path([v(-0.4, -0.95), v(2.6, -0.95)])} stroke="#000" strokeWidth={THICK} />
			<Words f={f} at={v(cx + 0.15, TB + 3.0 - 0.05)} anchor="start" size={12}>
				{`${num(st.T, 0)} °C`}
			</Words>
		</g>
	);
}

const TEXT = (s: Sub, st: State) => {
	const [, b, c] = SUBS[s].pts;
	if (st.phase === 'solido') return 'Il solido si scalda: la temperatura sale.';
	if (st.phase === 'liquido') return 'Tutto il solido è fuso, e il liquido si scalda.';
	return s === 'puro'
		? `Il naftalene fonde, e la temperatura resta ferma a ${b[1]} °C finché non è fuso tutto: è la sosta termica di una sostanza pura.`
		: `${s === 'impuro' ? 'Il naftalene impuro' : 'La paraffina'} fonde tra ${b[1]} e ${c[1]} °C, e mentre fonde la temperatura sale piano: non c’è sosta, perché non è una sostanza pura.`;
};

export default function FusionePuraMiscuglio({ alt }: { alt?: string }) {
	const [s, setS] = useState<Sub>('puro');
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	const st = stateAt(t, s);
	const [, b, c] = SUBS[s].pts;

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

	const all = SUBS[s].pts.map(([ti, T]) => v(gx(ti), gy(T)));
	const upTo = [...SUBS[s].pts.filter(([ti]) => ti < t).map(([ti, T]) => v(gx(ti), gy(T))), v(gx(t), gy(st.T))];
	const here = v(gx(t), gy(st.T));
	const temps = b[1] === c[1] ? [b[1]] : [b[1], c[1]];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Bath st={st} t={t} />
				<Axes f={f} o={v(GX, GY)} x0={GX - 0.1} x1={gx(END) + 0.4} y0={GY - 0.1} y1={gy(100) + 0.4} xName="" yName="" />
				<Ticks f={f} o={v(GX, GY)} xs={[5, 10, 15].map(gx)} xl={['5', '10', '15']} ys={[...temps, 40].map(gy)} yl={[...temps, 40].map(String)} />
				<Words f={f} at={v(gx(END) + 0.4, GY - 0.55)} anchor="end" size={12}>
					tempo (min)
				</Words>
				<Words f={f} at={v(GX + 0.12, gy(100) + 0.45)} anchor="start" size={12}>
					<tspan fontStyle="italic">t</tspan> (°C)
				</Words>
				{temps.map((T) => (
					<path key={T} d={f.path([v(GX, gy(T)), v(gx(END), gy(T))])} stroke="#999" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				))}
				<path d={f.path(all)} stroke="#b3b3b3" strokeWidth={THICK} fill="none" />
				<path d={f.path(upTo)} stroke="#1a1ab3" strokeWidth={THICK * 1.6} fill="none" strokeLinejoin="round" />
				<circle cx={f.px(here).x} cy={f.px(here).y} r={3.4} fill="#e67300" />
			</Drawing>

			<Readout>
				<span>tempo {num(t, 1)} min</span>
				<Tex>{`t = ${texNum(st.T, 1)}\\,^\\circ\\text{C}`}</Tex>
				<span>fuso: {num(st.melted * 100, 0)}%</span>
			</Readout>
			<Caption>{t === 0 ? `${SUBS[s].nome.charAt(0).toUpperCase() + SUBS[s].nome.slice(1)} in polvere, a 40 °C, nella provetta a bagnomaria. Avvia il riscaldamento o sposta il tempo con il cursore.` : TEXT(s, st)}</Caption>

			<Controls>
				<ToggleGroup
					label="Sostanza"
					options={[
						{ value: 'puro', label: 'naftalene puro' },
						{ value: 'impuro', label: 'naftalene impuro' },
						{ value: 'paraffina', label: 'paraffina' },
					]}
					value={s}
					onChange={(x) => {
						setPlaying(false);
						setT(0);
						setS(x);
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
