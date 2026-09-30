'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, add, scale, lerp, num, useTween, THICK, THIN, DASH, type V } from '../kit';
import { Arrow, VecLabel, QTY } from '../fisica';

/**
 * Lesson 29 (La pressione atmosferica e la sua misura), "L'esperienza di Torricelli": a tube one metre long, full of
 * mercury, upside down in a basin of mercury. A slider tilts the tube from 0° to 60° from the vertical, four buttons
 * pick the altitude (sea level, 1000 m, 2000 m, 4800 m). The top of the column stays at the same vertical height h
 * above the basin's surface (760 mm at sea level; the other heights are the International Standard Atmosphere's mean
 * pressures, 899, 795 and 555 hPa, as mm of mercury), while the column inside the tilted tube is h / cos θ long, until
 * the mercury fills the whole tube. Drawn at the lesson's scale: 1 TikZ cm is 25 cm, the tube's bottom is 3 cm under
 * the surface, the mercury is `gray!60` as in the lesson's TikZ.
 */

type Quota = 'mare' | 'q1000' | 'q2000' | 'q4800';
const QUOTE: Record<Quota, { label: string; hPa: number; mm: number; where: string }> = {
	mare: { label: '0 m', hPa: 1013, mm: 760, where: 'al livello del mare' },
	q1000: { label: '1000 m', hPa: 899, mm: 674, where: 'a 1000 m' },
	q2000: { label: '2000 m', hPa: 795, mm: 596, where: 'a 2000 m' },
	q4800: { label: '4800 m', hPa: 555, mm: 416, where: 'a 4800 m' }
};

const CM = 1 / 25; // drawing centimetres per real centimetre
const TUBE = 100; // cm
const DEPTH = 3; // cm of tube under the basin's surface, measured along a vertical tube
const TW = 0.13; // half the tube's width, drawing cm
const SURFACE = 0.5;
const B: V = v(0.2, SURFACE - DEPTH * CM); // the middle of the tube's open end, the point it turns around
const BASIN = { l: -1.4, r: 1.4, rim: 0.8 };
const MERCURY = '#b3b3b3'; // gray!60
const DIM_X = -1.75;

const f = frame(-3.05, B.x + TUBE * CM * Math.sin(Math.PI / 3) + 0.35, -0.15, B.y + TUBE * CM + 0.2);

export default function TorricelliTubo({ alt }: { alt?: string }) {
	const [quota, setQuota] = useState<Quota>('mare');
	const [deg, setDeg] = useState(0);
	const [h, go] = useTween(QUOTE.mare.mm, 600);
	useEffect(() => {
		void go(QUOTE[quota].mm);
	}, [quota, go]);

	const th = (deg * Math.PI) / 180;
	const u = v(Math.sin(th), Math.cos(th)); // along the tube, upwards
	const n = v(Math.cos(th), -Math.sin(th)); // across it, to the right
	const Lt = TUBE * CM;
	const left = (t: number) => add(add(B, scale(n, -TW)), scale(u, t));
	const right = (t: number) => add(add(B, scale(n, TW)), scale(u, t));
	// Where each wall meets the horizontal level y, as a length along the tube.
	const tAt = (P0: V, y: number) => (y - P0.y) / u.y;

	// The column's top: h above the surface, or the top of the tube when the tube is too short (tilted a lot).
	const room = (TUBE - DEPTH / Math.cos(th)) * Math.cos(th); // cm of vertical height the tube reaches above the surface
	const full = h / 10 > room + 1e-6;
	const Y = SURFACE + Math.min(h / 10, room) * CM;
	const tl = tAt(left(0), Y), tr = tAt(right(0), Y);
	const col: V[] = [left(0)];
	if (tl < Lt && tr < Lt) col.push(left(tl), right(tr));
	else if (tl >= Lt && tr >= Lt) col.push(left(Lt), right(Lt));
	else {
		const a = left(Lt), b = right(Lt);
		col.push(left(Math.min(tl, Lt)), lerp(a, b, (a.y - Y) / (a.y - b.y || 1)), right(Math.min(tr, Lt)));
	}
	col.push(right(0));

	const column = full ? (TUBE - DEPTH / Math.cos(th)) * 10 : h / Math.cos(th); // mm along the tube, above the surface
	const shownH = full ? room * 10 : h;
	const topLeft = left(Math.min(tl, Lt));
	const vacuum = !full && Lt - tl > 0.5;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* basin of mercury */}
				<path d={f.path([v(BASIN.l, 0), v(BASIN.r, 0), v(BASIN.r, SURFACE), v(BASIN.l, SURFACE)], true)} fill={MERCURY} />
				<path d={f.path([v(BASIN.l, SURFACE), v(BASIN.r, SURFACE)])} stroke="#000" strokeWidth={THIN} fill="none" />
				{/* the mercury in the tube, then the tube */}
				<path d={f.path(col, true)} fill={MERCURY} />
				<path d={f.path([left(0), left(Lt), right(Lt), right(0)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<path d={f.path([v(BASIN.l, BASIN.rim), v(BASIN.l, 0), v(BASIN.r, 0), v(BASIN.r, BASIN.rim)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				{/* the air on the basin */}
				{[-1.15, -0.8].map((x) => (
					<Arrow key={x} f={f} from={v(x, SURFACE + 0.7)} to={v(x, SURFACE + 0.04)} color={QTY.forza} />
				))}
				<VecLabel f={f} at={v(-0.975, SURFACE + 0.72)} dir={v(0, 1)} name="p" sub="0" bare color={QTY.forza} />
				{vacuum && (
					<Label f={f} at={add(left(Lt - 0.18), v(-0.05, 0))} dir={v(-1, 0)} upright size={11}>
						vuoto
					</Label>
				)}
				{/* the vertical height */}
				<path d={f.path([topLeft, v(DIM_X - 0.12, Y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path([v(BASIN.l, SURFACE), v(DIM_X - 0.12, SURFACE)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<Arrow f={f} from={v(DIM_X, (SURFACE + Y) / 2)} to={v(DIM_X, Y)} weight="thin" />
				<Arrow f={f} from={v(DIM_X, (SURFACE + Y) / 2)} to={v(DIM_X, SURFACE)} weight="thin" />
				<Label f={f} at={v(DIM_X, (SURFACE + Y) / 2)} dir={v(-1, 0)} upright size={13}>
					{`${num(shownH, 0)} mm`}
				</Label>
			</Drawing>

			<Readout>
				<span>pressione {QUOTE[quota].hPa} hPa</span>
				<span>
					altezza verticale <Tex>{`h = ${num(shownH, 0)}`}</Tex> mm
				</span>
				<span>mercurio nel tubo {num(column, 0)} mm</span>
			</Readout>
			<Caption>
				{full ? (
					<>Il tubo è così inclinato che il mercurio lo riempie tutto: la cima del tubo è a {num(shownH, 0)} mm di altezza, meno dei {QUOTE[quota].mm} mm che l&apos;aria può reggere {QUOTE[quota].where}. Raddrizza il tubo e si riforma il vuoto.</>
				) : deg === 0 ? (
					<>Tubo verticale: {QUOTE[quota].where} l&apos;aria regge una colonna di mercurio alta {QUOTE[quota].mm} mm. Inclina il tubo o cambia quota.</>
				) : (
					<>Il tubo è inclinato di {deg}°: il mercurio ne occupa {num(column, 0)} mm, ma la sua superficie è sempre {num(shownH, 0)} mm sopra quella della bacinella.</>
				)}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Quota" options={(Object.keys(QUOTE) as Quota[]).map((k) => ({ value: k, label: QUOTE[k].label }))} value={quota} onChange={setQuota} />
				</div>
				<Slider label="Inclinazione" unit="°" value={deg} min={0} max={60} step={1} onChange={(x) => setDeg(Math.round(x))} />
			</Controls>
		</Figure>
	);
}
