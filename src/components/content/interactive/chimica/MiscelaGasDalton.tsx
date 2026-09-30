'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Label, Tex, frame, v, useFrameLoop, useReducedMotion, FONT, FONT_MATH, THICK, THIN, type Frame, type V } from '../kit';
import { Arrow } from '../fisica';

/**
 * Chemistry lesson 38 (Miscele di gas e pressioni parziali): a closed vessel of 22,4 L with a mixture of nitrogen,
 * oxygen and carbon dioxide, whose moles (0 to 1 each) and temperature (0 to 100 °C) the student chooses. Each gas is
 * a set of coloured dots, twenty per mole, moving in straight lines and bouncing off the walls (an ideal gas: the dots
 * do not see each other), faster when the temperature rises and slower when the molecule is heavier (v ∝ √(T/M)).
 * Beside the vessel, one bar per gas shows its partial pressure p_i = n_i R T / V, and a fourth bar stacks the three
 * into the total (Dalton's law). "Guarda un gas" dims the other two, to see that each gas presses as if it were alone.
 * At 0 °C a mole in 22,4 L gives 1 atm, so the partial pressures read as the moles.
 */

const R = 0.0821;
const VOL = 22.4;
type Gas = 'N2' | 'O2' | 'CO2';
const GASES: Gas[] = ['N2', 'O2', 'CO2'];
const INFO: Record<Gas, { name: string; M: number; color: string; letter: string; sub: string }> = {
	N2: { name: 'azoto', M: 28.02, color: '#1f5fd1', letter: 'N', sub: '2' },
	O2: { name: 'ossigeno', M: 32.0, color: '#d1242f', letter: 'O', sub: '2' },
	CO2: { name: 'anidride carbonica', M: 44.01, color: '#2e8b3a', letter: 'CO', sub: '2' },
};
const PER_MOL = 20;
/** Two decimals for <Tex>: 0.8 → 0{,}80. */
const fix2 = (x: number) => x.toFixed(2).replace('.', '{,}');

// The vessel's inside and the bars, in TikZ centimetres.
const BW = 4.2, BH = 3.6;
const AX = 4.95; // the pressure axis
const PMAX = 4.5; // atm at the top of the axis
const SC = 3.6 / PMAX; // cm per atm
const BAR = 0.42;
const BX: Record<Gas | 'tot', number> = { N2: 5.25, O2: 5.85, CO2: 6.45, tot: 7.25 };
const f = frame(-0.35, 8.05, -0.75, 4.25);
const RAD = 2.6 / (f.W / (f.x1 - f.x0)); // a dot's radius in cm

/** Fixed pseudo-random numbers in [0, 1), the same on the server and in the browser. */
const rnd = (i: number) => {
	const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
};
/** Positions (cm) and directions of every dot that can exist: PER_MOL per gas. */
function initial(): Dots {
	const out: Dots = { N2: [], O2: [], CO2: [] };
	GASES.forEach((g, gi) => {
		for (let i = 0; i < PER_MOL; i++) {
			const k = gi * 100 + i * 3;
			const t = rnd(k + 2) * 2 * Math.PI;
			out[g].push({ p: v(RAD + rnd(k) * (BW - 2 * RAD), RAD + rnd(k + 1) * (BH - 2 * RAD)), d: v(Math.cos(t), Math.sin(t)) });
		}
	});
	return out;
}

type Dots = Record<Gas, { p: V; d: V }[]>;

/** One step of the dots: straight lines, mirrored at the walls; speed ∝ √(T/M), in cm per second. */
function move(prev: Dots, dt: number, T: number): Dots {
	const out = {} as Dots;
	for (const g of GASES) {
		const speed = 1.1 * Math.sqrt(T / 273) * Math.sqrt(28 / INFO[g].M);
		out[g] = prev[g].map(({ p, d }) => {
			let x = p.x + d.x * speed * dt, y = p.y + d.y * speed * dt;
			let dx = d.x, dy = d.y;
			if (x < RAD) { x = 2 * RAD - x; dx = Math.abs(dx); }
			if (x > BW - RAD) { x = 2 * (BW - RAD) - x; dx = -Math.abs(dx); }
			if (y < RAD) { y = 2 * RAD - y; dy = Math.abs(dy); }
			if (y > BH - RAD) { y = 2 * (BH - RAD) - y; dy = -Math.abs(dy); }
			return { p: v(x, y), d: v(dx, dy) };
		});
	}
	return out;
}

/** A chemical formula in the drawing: letters upright, the subscript smaller and lower. */
function Formula({ f: fr, at, letter, sub = '', color = '#000', size = 13 }: { f: Frame; at: V; letter: string; sub?: string; color?: string; size?: number }) {
	const q = fr.px(at);
	return (
		<text x={q.x} y={q.y} dy="0.8em" textAnchor="middle" fontSize={size} fontFamily={FONT} fill={color} pointerEvents="none">
			{letter}
			<tspan fontSize={size * 0.7} dy={size * 0.25}>
				{sub}
			</tspan>
		</text>
	);
}

export default function MiscelaGasDalton({ alt }: { alt?: string }) {
	const [n, setN] = useState<Record<Gas, number>>({ N2: 0.8, O2: 0.2, CO2: 0 });
	const [tc, setTc] = useState(0);
	const [focus, setFocus] = useState<'tutti' | Gas>('tutti');
	const [dots, setDots] = useState(initial);
	const reduced = useReducedMotion();

	const T = tc + 273;
	const p = { N2: (n.N2 * R * T) / VOL, O2: (n.O2 * R * T) / VOL, CO2: (n.CO2 * R * T) / VOL };
	const ptot = p.N2 + p.O2 + p.CO2;
	const ntot = n.N2 + n.O2 + n.CO2;
	const count = (g: Gas) => Math.round(n[g] * PER_MOL);

	useFrameLoop(!reduced, (dt) => setDots((prev) => move(prev, dt, T)));

	const bar = (x: number, y0: number, h: number, color: string, dim: boolean, key: string) => (
		<path key={key} d={f.path([v(x, y0), v(x + BAR, y0), v(x + BAR, y0 + h), v(x, y0 + h)], true)} fill={color} fillOpacity={dim ? 0.12 : 0.55} stroke={color} strokeOpacity={dim ? 0.3 : 1} strokeWidth={THIN} />
	);
	const stacked = GASES.map((g, i) => {
		const h = p[g] * SC;
		const y0 = GASES.slice(0, i).reduce((t, k) => t + p[k] * SC, 0);
		return h > 1e-6 ? bar(BX.tot, y0, h, INFO[g].color, focus !== 'tutti' && focus !== g, `t${g}`) : null;
	});

	const texOf = (g: Gas) => `\\mathrm{${g === 'CO2' ? 'CO_2' : g === 'N2' ? 'N_2' : 'O_2'}}`;
	let caption: string;
	if (ntot < 1e-9) caption = 'Il recipiente è vuoto: aggiungi un po’ di gas con i cursori.';
	else if (focus !== 'tutti') {
		const g = focus;
		caption = n[g] < 1e-9 ? `Nel recipiente non c’è ${INFO[g].name}: la sua pressione parziale è zero.` : `L’${INFO[g].name}, da solo, nello stesso recipiente e alla stessa temperatura, darebbe ${fix2(p[g]).replace('{,}', ',')} atm: è la sua pressione parziale, la sua parte della pressione totale.`;
	} else if (tc === 0) caption = 'A 0 °C una mole di gas in 22,4 L preme per 1 atm: ogni pressione parziale vale quanto le moli del suo gas, e la pressione totale quanto le moli in tutto.';
	else caption = 'Ogni gas preme sulle pareti come se fosse da solo: la pressione totale è la somma delle pressioni parziali. Scaldando, le molecole vanno più veloci e tutte le pressioni crescono nella stessa proporzione.';

	const ticks = [0, 1, 2, 3, 4];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the dots, then the walls over them */}
				{GASES.map((g) =>
					dots[g].slice(0, count(g)).map((d, i) => {
						const q = f.px(d.p);
						return <circle key={`${g}${i}`} cx={q.x} cy={q.y} r={2.6} fill={INFO[g].color} opacity={focus === 'tutti' || focus === g ? 1 : 0.15} />;
					}),
				)}
				<path d={f.path([v(0, 0), v(BW, 0), v(BW, BH), v(0, BH)], true)} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<Label f={f} at={v(BW / 2, BH)} dir={v(0, 1)} upright size={13}>
					<tspan fontStyle="italic" fontFamily={FONT_MATH}>V</tspan>
					{' = 22,4 L,  '}
					<tspan fontStyle="italic" fontFamily={FONT_MATH}>t</tspan>
					{` = ${tc} °C`}
				</Label>

				{/* pressure axis with its ticks */}
				<Arrow f={f} from={v(AX, 0)} to={v(AX, BH + 0.35)} weight="thin" />
				<path d={ticks.map((t) => f.path([v(AX - 0.06, t * SC), v(AX + 0.06, t * SC)])).join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
				{ticks.map((t) => (
					<Label key={t} f={f} at={v(AX - 0.08, t * SC)} dir={v(-1, 0)} upright size={11}>
						{t}
					</Label>
				))}
				<Label f={f} at={v(AX + 0.1, BH + 0.45)} dir={v(1, 0)} upright size={12}>
					<tspan fontStyle="italic" fontFamily={FONT_MATH}>p</tspan> (atm)
				</Label>
				<path d={f.path([v(AX, 0), v(BX.tot + BAR + 0.2, 0)])} stroke="#000" strokeWidth={THIN} fill="none" />

				{GASES.map((g) => (p[g] * SC > 1e-6 ? bar(BX[g], 0, p[g] * SC, INFO[g].color, focus !== 'tutti' && focus !== g, `b${g}`) : null))}
				{stacked}
				{GASES.map((g) => (
					<Formula key={`l${g}`} f={f} at={v(BX[g] + BAR / 2, -0.08)} letter={INFO[g].letter} sub={INFO[g].sub} color={INFO[g].color} size={11} />
				))}
				<Formula f={f} at={v(BX.tot + BAR / 2, -0.08)} letter="totale" size={11} />
			</Drawing>

			<Readout>
				{GASES.map((g) => (
					<Tex key={g}>{`p_{${texOf(g)}} = ${fix2(p[g])}\\,\\text{atm}`}</Tex>
				))}
				<Tex>{`p_{tot} = ${fix2(ptot)}\\,\\text{atm}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Azoto (mol)" value={n.N2} min={0} max={1} step={0.1} onChange={(x) => setN({ ...n, N2: x })} />
				<Slider label="Ossigeno (mol)" value={n.O2} min={0} max={1} step={0.1} onChange={(x) => setN({ ...n, O2: x })} />
				<Slider label="Anidride carbonica (mol)" value={n.CO2} min={0} max={1} step={0.1} onChange={(x) => setN({ ...n, CO2: x })} />
				<Slider label="Temperatura (°C)" value={tc} min={0} max={100} step={5} onChange={setTc} />
				<div className="flex justify-center">
					<ToggleGroup
						label="Guarda un gas"
						options={[
							{ value: 'tutti', label: 'Tutti' },
							{ value: 'N2', label: 'N₂' },
							{ value: 'O2', label: 'O₂' },
							{ value: 'CO2', label: 'CO₂' },
						]}
						value={focus}
						onChange={setFocus}
					/>
				</div>
			</Controls>
		</Figure>
	);
}
