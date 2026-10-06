'use client';

import { useEffect, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useTween, texNum, num, THICK, THIN, DASH, INK, TINT } from '../kit';
import { Axes } from '../fisica';
import { Piston } from './liquidi';
import { Ticks, Words } from './calore';

/**
 * Physics lesson 102 (la legge di Boyle): a gas in a vertical cylinder closed by a piston of area 10 cm², at room
 * temperature, with 0 to 10 weights of 1,0 kg on the piston. Each weight adds the same pressure, m g / S = 9,8 kPa,
 * to the atmospheric 101 kPa; the volume follows Boyle's law from 200 cm³ (the piston at 20 cm), so p V stays
 * 101 kPa · 200 cm³ = 20,2 J. Next to the cylinder, the pressure-volume plane with the isotherm and the states already
 * visited. The question of the lesson: does every weight lower the piston by the same amount? (No: 1,8 cm the first,
 * 0,5 cm the tenth.)
 *
 * The chemistry figure on Boyle (chimica/GasCilindro.tsx) moves the piston by hand and shows the particles; this one
 * gets the pressure from the forces on the piston and reads the steps on the isotherm.
 */

const P0 = 101; // kPa
const DP = 9.8; // kPa per weight: 1,0 kg · 9,8 m/s² / 10 cm²
const H0 = 20; // cm
const S = 10; // cm²
const K_MAX = 10;

const pressure = (k: number) => P0 + DP * k;
const height = (k: number) => (H0 * P0) / pressure(k);

// Drawing: the cylinder's inside from x = 0 to 2, 0,2 cm of drawing per centimetre of height.
const CW = 2;
const HS = 0.2;
const TOP = 4.75;
const WH = 0.15; // a weight's height
const G0 = v(3.75, 0.55); // the graph's origin
const GW = 3.3, GH = 3.6;
const V_MAX = 250, P_MAX = 250;
const f = frame(-1.0, 7.75, -0.35, 5.15);

const gx = (V: number) => G0.x + (V / V_MAX) * GW;
const gy = (p: number) => G0.y + (p / P_MAX) * GH;

export default function BoylePistonePesetti({ alt }: { alt?: string }) {
	const [k, setK] = useState(0);
	const [seen, setSeen] = useState<boolean[]>(() => Array.from({ length: K_MAX + 1 }, (_, i) => i === 0));
	const [h, go] = useTween(H0, 450);

	useEffect(() => {
		void go(height(k));
	}, [k, go]);

	const set = (next: number) => {
		const n = Math.max(0, Math.min(K_MAX, Math.round(next)));
		setK(n);
		setSeen((s) => s.map((x, i) => x || i === n));
	};
	const reset = () => {
		setK(0);
		setSeen(Array.from({ length: K_MAX + 1 }, (_, i) => i === 0));
	};

	const p = pressure(k);
	const hk = height(k);
	const V = S * hk;
	const y = h * HS; // the piston's lower face in the drawing
	const drop = k > 0 ? height(k - 1) - hk : 0;

	const from = (P0 * H0 * S) / P_MAX;
	const curve = Array.from({ length: 61 }, (_, i) => from + ((V_MAX - from) * i) / 60).map((x) => v(gx(x), gy((P0 * H0 * S) / x)));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* gas */}
				<path d={f.path([v(0, 0), v(CW, 0), v(CW, y), v(0, y)], true)} fill={TINT.blue} />
				{/* where the piston was without weights */}
				<path d={f.path([v(-0.12, H0 * HS), v(CW + 0.12, H0 * HS)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				{/* ruler on the left wall, centimetres */}
				{[0, 5, 10, 15, 20].map((c) => (
					<g key={c}>
						<path d={f.path([v(-0.14, c * HS), v(0, c * HS)])} stroke="#000" strokeWidth={THIN} />
						<Words f={f} at={v(-0.2, c * HS)} anchor="end" size={11}>
							{c}
						</Words>
					</g>
				))}
				<Words f={f} at={v(-0.2, TOP - 0.15)} anchor="end" size={11}>
					cm
				</Words>
				{/* cylinder, piston and weights */}
				<path d={f.path([v(0, TOP), v(0, 0), v(CW, 0), v(CW, TOP)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<Piston f={f} x0={0} x1={CW} y={y} h={0.18} />
				{Array.from({ length: k }, (_, i) => {
					const y0 = y + 0.18 + i * WH;
					return <path key={i} d={f.path([v(0.45, y0), v(CW - 0.45, y0), v(CW - 0.45, y0 + WH), v(0.45, y0 + WH)], true)} fill="#b3b3b3" stroke="#000" strokeWidth={THIN} />;
				})}
				<Words f={f} at={v(CW / 2, Math.max(0.3, y / 2))} size={12}>
					gas
				</Words>

				{/* the pressure-volume plane */}
				<Axes f={f} o={G0} x0={G0.x} x1={G0.x + GW + 0.35} y0={G0.y} y1={G0.y + GH + 0.35} xName="" yName="" />
				<Ticks f={f} o={G0} xs={[50, 100, 150, 200, 250].map(gx)} xl={['50', '100', '150', '200', '250']} ys={[50, 100, 150, 200, 250].map(gy)} yl={['50', '100', '150', '200', '250']} size={10} />
				<Words f={f} at={v(G0.x + GW + 0.4, G0.y - 0.55)} anchor="end" size={11}>
					<tspan fontStyle="italic">V</tspan> (cm³)
				</Words>
				<Words f={f} at={v(G0.x + 0.12, G0.y + GH + 0.5)} anchor="start" size={11}>
					<tspan fontStyle="italic">p</tspan> (kPa)
				</Words>
				<path d={f.path(curve)} stroke="#6666ff" strokeWidth={THICK} fill="none" />
				{seen.map((s, i) => {
					if (!s || i === k) return null;
					const c = f.px(v(gx(S * height(i)), gy(pressure(i))));
					return <circle key={i} cx={c.x} cy={c.y} r={2.4} fill="#000" />;
				})}
				<path d={f.path([v(gx(V), G0.y), v(gx(V), gy(p)), v(G0.x, gy(p))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<circle cx={f.px(v(gx(V), gy(p))).x} cy={f.px(v(gx(V), gy(p))).y} r={3.6} fill={INK.orange} />
			</Drawing>

			<Readout>
				<Tex>{`p = ${texNum(p, 1)}\\,\\text{kPa}`}</Tex>
				<Tex>{`V = ${texNum(V, 0)}\\,\\text{cm}^3`}</Tex>
				<Tex>{`p \\cdot V = ${texNum((p * V) / 1000, 1)}\\,\\text{J}`}</Tex>
				<span>
					pistone a {num(hk, 1)} cm
				</span>
			</Readout>
			<Caption>
				{k === 0 ? (
					<>Senza pesetti il gas è alla pressione atmosferica, 101 kPa, e il pistone è a 20 cm. Aggiungi un pesetto da 1,0 kg: la pressione cresce di 9,8 kPa.</>
				) : (
					<>
						Con {k === 1 ? 'il primo pesetto' : `il pesetto numero ${k}`} la pressione è salita di 9,8 kPa, come con tutti gli altri, e il pistone è sceso di {num(drop, 1)} cm. Il prodotto <Tex>{'p \\cdot V'}</Tex> è rimasto 20,2 J.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Pesetti sul pistone" value={k} min={0} max={K_MAX} step={1} onChange={set} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={k >= K_MAX} onClick={() => set(k + 1)}>
						<Plus className="size-4" aria-hidden="true" />
						Aggiungi un pesetto
					</Button>
					<Button variant="secondary" size="sm" disabled={k === 0 && seen.filter(Boolean).length === 1} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Togli tutto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
