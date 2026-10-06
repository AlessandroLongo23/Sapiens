'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, THICK, THIN, DASH, TINT, FONT, FONT_MATH, type V } from '../kit';
import { AssiPV, PuntoStato, Verso, lineaPV, puntoPV, tratto, type PianoPV, type Stato } from './pianoPV';
import { FLUSSO } from './flussiCalore';

/**
 * Lesson 116, the Carnot cycle to scale in the pressure-volume plane, with the two temperatures to change. A tenth of
 * a mole of monatomic perfect gas (n R = 0,831 J/K, γ = 5/3) starts at V_A = 1 L and doubles its volume along the hot
 * isotherm; the adiabats then fix C and D: V_C = V_B (T_c / T_f)^(3/2), V_D = V_A (T_c / T_f)^(3/2). Volumes in
 * litres and pressures in kilopascal, so that areas are joules. The heat absorbed is Q_c = n R T_c ln 2, the
 * efficiency 1 − T_f / T_c, and a bar shows Q_c split into W and Q_f. Starts from 500 K and 300 K, the numbers of the
 * lesson's examples; the plane's pieces are group 41's (pianoPV.tsx).
 */

const NR = 0.831; // J/K: 0,100 mol · 8,31 J/(mol·K)
const VA = 1, VB = 2; // litres
const GAMMA = 5 / 3;
const PIANO: PianoPV = { sx: 0.75, sy: 0.008, vMax: 8, pMax: 500, vPasso: 1, pPasso: 100, vOgni: 2, vUnita: 'L', pUnita: 'kPa' };
const f = frame(-1.15, 7.1, -0.95, 4.95);
const HOT = '#b3261a', COLD = '#1f3fb0';
/** Centimetres per joule in the bar: the largest Q_c (600 K) is 3,2 cm. */
const BAR = 3.2 / (NR * 600 * Math.LN2);

const pressure = (T: number, V: number) => (NR * T) / V; // J/L = kPa

function isotherm(T: number): Stato[] {
	const from = Math.max(0.35, (NR * T) / PIANO.pMax);
	return tratto('isoterma', { V: from, p: pressure(T, from) }, { V: PIANO.vMax, p: 0 });
}

const j = (x: number) => String(Math.round(x));

export default function CicloCarnot({ alt }: { alt?: string }) {
	const [tc, setTc] = useState(500);
	const [tf, setTf] = useState(300);

	const k = (tc / tf) ** (1 / (GAMMA - 1));
	const A: Stato = { V: VA, p: pressure(tc, VA) };
	const B: Stato = { V: VB, p: pressure(tc, VB) };
	const C: Stato = { V: VB * k, p: pressure(tf, VB * k) };
	const D: Stato = { V: VA * k, p: pressure(tf, VA * k) };
	const AB = tratto('isoterma', A, B);
	const BC = tratto('adiabatica', B, C, GAMMA);
	const CD = tratto('isoterma', C, D);
	const DA = tratto('adiabatica', D, A, GAMMA);
	const cycle = [...AB, ...BC.slice(1), ...CD.slice(1), ...DA.slice(1)].map((s) => puntoPV(PIANO, s));

	const eta = 1 - tf / tc;
	const qc = NR * tc * Math.LN2;
	const w = eta * qc;
	const qf = qc - w;

	// The bar of Q_c, split into W and Q_f, in the empty corner of the plane.
	const bar = (x0: number, x1: number, fill: string) => {
		const a = f.px(v(x0, 4.25)), b = f.px(v(x1, 3.85));
		return <rect x={a.x} y={a.y} width={Math.max(0, b.x - a.x)} height={b.y - a.y} fill={fill} stroke="#000" strokeWidth={THIN} />;
	};
	const X0 = 2.75;
	const word = (at: V, letter: string, sub: string | null, rest: string, anchor: 'start' | 'middle' | 'end' = 'middle', color = '#000') => {
		const p = f.px(at);
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={13} fill={color} pointerEvents="none">
				<tspan fontFamily={FONT_MATH} fontStyle="italic">{letter}</tspan>
				{sub && (
					<tspan fontFamily={FONT_MATH} fontStyle="italic" fontSize={9} dy="0.3em">
						{sub}
					</tspan>
				)}
				<tspan fontFamily={FONT} dy={sub ? '-0.21em' : undefined}>{rest}</tspan>
			</text>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<AssiPV f={f} a={PIANO} />
				<path d={lineaPV(f, PIANO, isotherm(tc))} stroke={HOT} strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={lineaPV(f, PIANO, isotherm(tf))} stroke={COLD} strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path(cycle, true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<Verso f={f} a={PIANO} stati={AB} />
				<Verso f={f} a={PIANO} stati={BC} />
				<Verso f={f} a={PIANO} stati={CD} />
				<Verso f={f} a={PIANO} stati={DA} />
				<PuntoStato f={f} at={puntoPV(PIANO, A)} nome="A" dir={v(-1, 0.2)} />
				<PuntoStato f={f} at={puntoPV(PIANO, B)} nome="B" dir={v(0.7, 0.7)} />
				<PuntoStato f={f} at={puntoPV(PIANO, C)} nome="C" dir={v(0.9, 0.45)} />
				<PuntoStato f={f} at={puntoPV(PIANO, D)} nome="D" dir={v(-0.7, -0.7)} />
				{/* The names of the two isotherms at their right ends, kept apart when the curves are close. */}
				{word(v(6.35, Math.max(pressure(tc, 8) * PIANO.sy + 0.2, pressure(tf, 8) * PIANO.sy + 0.4)), 'T', 'c', '', 'start', HOT)}
				{word(v(6.35, pressure(tf, 8) * PIANO.sy + 0.04), 'T', 'f', '', 'start', COLD)}
				{bar(X0, X0 + w * BAR, FLUSSO.lavoro)}
				{bar(X0 + w * BAR, X0 + qc * BAR, FLUSSO.calore)}
				{word(v(X0 - 0.12, 4.05), 'Q', 'c', '', 'end')}
				{word(v(X0 + (w * BAR) / 2, 4.5), 'W', null, '')}
				{word(v(X0 + (w + qf / 2) * BAR, 4.5), 'Q', 'f', '')}
			</Drawing>

			<Readout>
				<span>
					<Tex>{`\\eta = 1 - \\dfrac{T_f}{T_c} = 1 - \\dfrac{${tf}}{${tc}} = ${eta.toFixed(2).replace('.', '{,}')}`}</Tex>
				</span>
				<span>
					<Tex>{`Q_c = ${j(qc)}`}</Tex> J
				</span>
				<span>
					<Tex>{`W = ${j(w)}`}</Tex> J
				</span>
				<span>
					<Tex>{`Q_f = ${j(qf)}`}</Tex> J
				</span>
			</Readout>
			<Caption>
				L&apos;area del ciclo è il lavoro: {j(w)} J sui {j(qc)} J assorbiti lungo l&apos;isoterma <Tex>AB</Tex>. Più le due isoterme sono lontane, più il ciclo è alto e il rendimento grande.
			</Caption>

			<Controls>
				<Slider label="Sorgente calda (K)" value={tc} min={400} max={600} step={10} onChange={setTc} />
				<Slider label="Sorgente fredda (K)" value={tf} min={250} max={350} step={10} onChange={setTf} />
			</Controls>
		</Figure>
	);
}
