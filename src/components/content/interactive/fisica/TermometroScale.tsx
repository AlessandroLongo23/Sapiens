'use client';

import { useState } from 'react';
import { RotateCcw, Snowflake, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, K, THICK, THIN, DASH, FONT, INK, type V } from '../kit';
import { LIQUID, Vessel, Liquid } from './liquidi';

/**
 * Lesson 65 (La temperatura e le scale termometriche): a liquid thermometer to calibrate, then to read on three
 * scales side by side. At first the tube has no scale: the column rises and falls with the slider (−40 to 110 °C) but
 * reads nothing. Two buttons put the bulb in melting ice and in boiling water, and mark where the column stops; after
 * both marks the stretch between them is split into 100 degrees and the Celsius, Kelvin and Fahrenheit scales appear,
 * each with its own round ticks, all on the same heights (T = t + 273,15, t_F = 9/5 t + 32). A dashed line at the
 * column's top crosses the three scales, and the readout under the drawing gives the three readings.
 */

const T_MIN = -40;
const T_MAX = 110;
const S = 0.04; // cm of column per degree Celsius
const y = (t: number) => t * S;
const RED = '#ff8080'; // red!50, as the TikZ thermometers
const TUBE = 0.15; // half width of the tube
const BULB = v(0, -2.2);
const BULB_R = 0.36;
const TOP = y(T_MAX) + 0.35;
const XS = { C: 1.55, K: 3.25, F: 4.95 } as const;
const f = frame(-1.75, 5.85, -2.95, TOP + 0.75);

type Bath = 'ghiaccio' | 'bollente' | null;

/** One vertical scale: ticks every `every` of its own unit, numbers every `label`, placed at the Celsius height. */
function Scale({ x, unit, from, to, every, label, toC }: { x: number; unit: string; from: number; to: number; every: number; label: number; toC: (u: number) => number }) {
	const ticks: number[] = [];
	for (let u = Math.ceil(from / every) * every; u <= to + 1e-9; u += every) ticks.push(u);
	return (
		<g pointerEvents="none">
			<path d={f.path([v(x, y(T_MIN)), v(x, y(T_MAX))])} stroke="#000" strokeWidth={THICK} fill="none" />
			{ticks.map((u) => {
				const yy = y(toC(u));
				const big = Math.abs(u / label - Math.round(u / label)) < 1e-9;
				const p = f.px(v(x + 0.16, yy));
				return (
					<g key={u}>
						<path d={f.path([v(x, yy), v(x + (big ? 0.14 : 0.08), yy)])} stroke="#000" strokeWidth={THIN} />
						{big && (
							<text x={p.x} y={p.y} dy="0.35em" fontSize={11} fontFamily={FONT} fill="#000">
								{String(u).replace('-', '−')}
							</text>
						)}
					</g>
				);
			})}
			<text x={f.px(v(x, TOP)).x} y={f.px(v(x, TOP)).y} textAnchor="middle" fontSize={14} fontFamily={FONT} fill="#000">
				{unit}
			</text>
		</g>
	);
}

/** The thermometer: bulb, tube and the liquid up to the height of t. */
function Thermometer({ t }: { t: number }) {
	const s = Math.sqrt(BULB_R * BULB_R - TUBE * TUBE);
	const top = y(T_MAX) + 0.25;
	const c = f.px(BULB);
	const r = BULB_R * K;
	const a = f.px(v(-TUBE, BULB.y + s));
	const b = f.px(v(TUBE, BULB.y + s));
	const tl = f.px(v(-TUBE, top));
	const tr = f.px(v(TUBE, top));
	const outline = `M${a.x},${a.y} L${tl.x},${tl.y} A${TUBE * K},${TUBE * K} 0 0 1 ${tr.x},${tr.y} L${b.x},${b.y} A${r},${r} 0 1 1 ${a.x},${a.y} Z`;
	return (
		<g pointerEvents="none">
			<circle cx={c.x} cy={c.y} r={(BULB_R - 0.07) * K} fill={RED} />
			<path d={f.path([v(-0.06, BULB.y), v(0.06, BULB.y), v(0.06, y(t)), v(-0.06, y(t))], true)} fill={RED} />
			<path d={outline} fill="none" stroke="#000" strokeWidth={THICK} />
		</g>
	);
}

/** The bath around the bulb: melting ice or boiling water. */
function BathPot({ kind }: { kind: 'ghiaccio' | 'bollente' }) {
	const x0 = -0.8, x1 = 0.8, y0 = -2.85, y1 = -1.45;
	const cubes: V[] = [v(-0.55, -2.55), v(0.42, -2.4), v(-0.45, -1.95), v(0.5, -1.85)];
	const bubbles: V[] = [v(-0.5, -2.3), v(0.52, -2.1), v(-0.6, -1.8), v(0.45, -2.65), v(0.62, -1.7)];
	return (
		<g pointerEvents="none">
			<Liquid f={f} pts={[v(x0, y0), v(x1, y0), v(x1, y1 - 0.12), v(x0, y1 - 0.12)]} fill={LIQUID.acqua} />
			{kind === 'ghiaccio'
				? cubes.map((p, i) => <path key={i} d={f.path([v(p.x - 0.12, p.y - 0.12), v(p.x + 0.12, p.y - 0.12), v(p.x + 0.12, p.y + 0.12), v(p.x - 0.12, p.y + 0.12)], true)} fill="#fff" stroke="#000" strokeWidth={THIN} />)
				: bubbles.map((p, i) => <circle key={i} cx={f.px(p).x} cy={f.px(p).y} r={2.6} fill="none" stroke="#000" strokeWidth={THIN} />)}
			<Vessel f={f} pts={[v(x0, y1), v(x0, y0), v(x1, y0), v(x1, y1)]} />
		</g>
	);
}

export default function TermometroScale({ alt }: { alt?: string }) {
	const [t, setT] = useState(22);
	const [zero, setZero] = useState(false);
	const [cento, setCento] = useState(false);
	const [bath, setBath] = useState<Bath>(null);
	const ready = zero && cento;

	const dip = (kind: 'ghiaccio' | 'bollente') => {
		setBath(kind);
		if (kind === 'ghiaccio') {
			setT(0);
			setZero(true);
		} else {
			setT(100);
			setCento(true);
		}
	};
	const move = (x: number) => {
		setBath(null);
		setT(x);
	};
	const reset = () => {
		setZero(false);
		setCento(false);
		setBath(null);
		setT(22);
	};

	const T = t + 273.15;
	const tF = (9 / 5) * t + 32;
	const yt = y(t);

	let caption: string;
	if (!zero && !cento) caption = 'Il termometro non ha ancora una scala: la colonna sale e scende, ma non dice che temperatura segna. Mettilo nel ghiaccio fondente e nell\'acqua bollente per segnare i punti fissi.';
	else if (!ready) caption = zero ? 'Hai segnato lo zero, dove la colonna si ferma nel ghiaccio fondente. Manca il segno dei 100 gradi, nell\'acqua bollente.' : 'Hai segnato i 100 gradi, dove la colonna si ferma nell\'acqua bollente. Manca lo zero, nel ghiaccio fondente.';
	else if (bath === 'ghiaccio') caption = 'Nel ghiaccio fondente: 0 °C, 273,15 K, 32 °F.';
	else if (bath === 'bollente') caption = 'Nell\'acqua bollente, alla pressione normale: 100 °C, 373,15 K, 212 °F.';
	else if (t === -40) caption = 'A −40 °C anche la scala Fahrenheit segna −40: è l\'unica temperatura in cui le due scale danno lo stesso numero.';
	else caption = `Tra i due segni ci sono 100 gradi Celsius, 100 kelvin e 180 gradi Fahrenheit: un grado Fahrenheit è 5/9 di grado Celsius. La colonna è a ${num(t, 0)} °C.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{bath && <BathPot kind={bath} />}
				<Thermometer t={t} />
				{zero && (
					<g pointerEvents="none">
						<path d={f.path([v(-TUBE - 0.3, 0), v(-TUBE, 0)])} stroke="#000" strokeWidth={THICK} />
						<text x={f.px(v(-TUBE - 0.36, 0)).x} y={f.px(v(0, 0)).y} dy="0.35em" textAnchor="end" fontSize={12} fontFamily={FONT} fill="#000">
							{ready ? '0 °C' : 'ghiaccio'}
						</text>
					</g>
				)}
				{cento && (
					<g pointerEvents="none">
						<path d={f.path([v(-TUBE - 0.3, y(100)), v(-TUBE, y(100))])} stroke="#000" strokeWidth={THICK} />
						<text x={f.px(v(-TUBE - 0.36, 0)).x} y={f.px(v(0, y(100))).y} dy="0.35em" textAnchor="end" fontSize={12} fontFamily={FONT} fill="#000">
							{ready ? '100 °C' : 'acqua bollente'}
						</text>
					</g>
				)}
				{ready && (
					<>
						{Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((u) => (
							<path key={u} d={f.path([v(-TUBE - 0.15, y(u)), v(-TUBE, y(u))])} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
						))}
						<Scale x={XS.C} unit="°C" from={T_MIN} to={T_MAX} every={10} label={20} toC={(u) => u} />
						<Scale x={XS.K} unit="K" from={T_MIN + 273.15} to={T_MAX + 273.15} every={10} label={20} toC={(u) => u - 273.15} />
						<Scale x={XS.F} unit="°F" from={-40} to={(9 / 5) * T_MAX + 32} every={10} label={40} toC={(u) => ((u - 32) * 5) / 9} />
						<path d={f.path([v(TUBE + 0.05, yt), v(XS.F + 0.05, yt)])} stroke={INK.orange} strokeWidth={THIN} strokeDasharray={DASH} fill="none" pointerEvents="none" />
						{[XS.C, XS.K, XS.F].map((x) => (
							<circle key={x} cx={f.px(v(x, yt)).x} cy={f.px(v(x, yt)).y} r={3} fill={INK.orange} pointerEvents="none" />
						))}
					</>
				)}
			</Drawing>

			{ready ? (
				<Readout>
					<Tex>{`t = ${texNum(t, 0)}\\,^\\circ\\text{C}`}</Tex>
					<Tex>{`T = t + 273{,}15 = ${texNum(T, 2)}\\,\\text{K}`}</Tex>
					<Tex>{`t_F = \\tfrac{9}{5}\\,t + 32 = ${texNum(tF, 1)}\\,^\\circ\\text{F}`}</Tex>
				</Readout>
			) : null}
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Temperatura (°C)" value={t} min={T_MIN} max={T_MAX} step={1} onChange={move} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => dip('ghiaccio')}>
						<Snowflake className="size-4" aria-hidden="true" />
						Nel ghiaccio fondente
					</Button>
					<Button variant="secondary" size="sm" onClick={() => dip('bollente')}>
						<Flame className="size-4" aria-hidden="true" />
						Nell&apos;acqua bollente
					</Button>
					<Button variant="secondary" size="sm" disabled={!zero && !cento} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Togli i segni
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
