'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, THICK, THIN, DASH, INK } from '../kit';
import { C, H, RYDBERG_J, ColourLayer, colourName, texSci, wavelengthCss } from './chim3-A-luce';

/**
 * Lesson 49 (Il modello atomico di Bohr), "Le serie di Lyman, Balmer e Paschen": the hydrogen levels from n = 1 to
 * n = 6 (not to scale, as in the lesson's figure of the series) and, under them, an emission spectrum on a black band
 * from 80 to 2500 nm on a logarithmic scale. The student picks the starting and the arrival level: an arrow joins
 * them (down: a photon is emitted; up: it is absorbed), the line appears in the spectrum, and under the drawing one
 * reads ΔE, λ and the series. The lines found stay, dimmer, so a whole series can be built.
 *
 * The numbers are computed the way the lesson does: the level energies E_n = -2,18·10⁻¹⁸ J / n² rounded to three
 * figures, ΔE from those, λ = hc/ΔE with h = 6,63·10⁻³⁴ J·s and c = 3,00·10⁸ m/s, three figures. The visible lines
 * are drawn in their colour in a layer left out of the dark theme's inversion.
 */

const LEVEL_Y = [0, 0, 2.2, 3.3, 3.95, 4.4, 4.72]; // by n, cm; index 0 unused
const TOP_Y = 5.25; // n = ∞
const X0 = 1.3, X1 = 5.6;
const BAND = { y0: -2.05, y1: -1.35 };
const L_MIN = 80, L_MAX = 2500;
const f = frame(-0.3, 10.3, -3.25, 5.75);
const xOf = (nm: number) => (Math.log(nm / L_MIN) / Math.log(L_MAX / L_MIN)) * 10;

const round3 = (x: number) => Number((x * (1 + 1e-9)).toPrecision(3));
const levelE = (n: number) => -round3(RYDBERG_J / (n * n));
/** ΔE in joules and λ in nanometres for the jump between two levels, rounded as the lesson rounds them. */
function jump(a: number, b: number) {
	const dE = round3(Math.abs(levelE(a) - levelE(b)));
	const nm = round3(((H * C) / dE) * 1e9);
	return { dE, nm };
}
const SERIES: Record<number, string> = { 1: 'serie di Lyman', 2: 'serie di Balmer', 3: 'serie di Paschen' };
const lineColour = (nm: number) => (nm >= 400 && nm <= 700 ? wavelengthCss(nm) : '#d0d0d0');

export default function BohrLivelliSalto({ alt }: { alt?: string }) {
	const [from, setFrom] = useState(3);
	const [to, setTo] = useState(2);
	const [found, setFound] = useState<string[]>([]);
	const same = from === to;
	const lo = Math.min(from, to), hi = Math.max(from, to);
	const key = `${lo}-${hi}`;
	const emission = from > to;
	const j = same ? null : jump(from, to);
	const all = same || found.includes(key) ? found : [...found, key];
	const remember = (a: number, b: number) => {
		if (a === b) return;
		const k = `${Math.min(a, b)}-${Math.max(a, b)}`;
		setFound((list) => (list.includes(k) ? list : [...list, k]));
	};
	const pick = (a: number, b: number) => {
		// The jump shown until now joins the ones found before the levels change.
		remember(from, to);
		setFrom(a);
		setTo(b);
	};

	const band = f.px(v(0, BAND.y1));
	const bandW = f.px(v(10, 0)).x - band.x;
	const bandH = f.px(v(0, BAND.y0)).y - band.y;
	const ax = 3.45;
	const y0 = LEVEL_Y[from], y1 = LEVEL_Y[to];
	const tip = f.px(v(ax, y1 + (emission ? 0.05 : -0.05)));
	const tail = f.px(v(ax, y0));
	const dir = emission ? 1 : -1; // on screen: down is +y
	const wave = Array.from({ length: 61 }, (_, i) => v(6.2 + (i / 60) * 1.6, (y0 + y1) / 2 + 0.11 * Math.sin((i / 60) * 2 * Math.PI * 5)));
	const region = j ? colourName(j.nm) : '';

	return (
		<Figure>
			<div className="relative max-w-full">
				<Drawing f={f} label={alt}>
					{[1, 2, 3, 4, 5, 6].map((n) => (
						<g key={n}>
							<path d={f.path([v(X0, LEVEL_Y[n]), v(X1, LEVEL_Y[n])])} stroke="#000" strokeWidth={n === from || n === to ? THICK * 1.6 : THICK} />
							<Label f={f} at={v(X0 - 0.05, LEVEL_Y[n])} dir={v(-1, 0)} upright size={n > 4 ? 11 : 13}>
								{`n = ${n}`}
							</Label>
						</g>
					))}
					<path d={f.path([v(X0, TOP_Y), v(X1, TOP_Y)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
					<Label f={f} at={v(X0 - 0.05, TOP_Y)} dir={v(-1, 0)} upright size={13}>
						n = ∞
					</Label>
					{!same && (
						<g>
							<path d={`M${tail.x},${tail.y} L${tip.x},${tip.y - dir * 7}`} stroke={INK.blue} strokeWidth={THICK * 1.5} />
							<path d={`M${tip.x},${tip.y} l-4.5,${-dir * 9} l9,0 Z`} fill={INK.blue} />
							<circle cx={tail.x} cy={tail.y} r={4} fill="#e6e6ff" stroke="#000" strokeWidth={THIN} />
							<path d={f.path(wave)} stroke="#000" strokeWidth={THIN * 1.5} fill="none" />
							<path d={emission ? `M${f.px(v(8.05, 0)).x},${f.px(v(0, (y0 + y1) / 2)).y} l-8,-4 l0,8 Z` : `M${f.px(v(5.95, 0)).x},${f.px(v(0, (y0 + y1) / 2)).y} l8,-4 l0,8 Z`} fill="#000" />
							<Label f={f} at={v(7, (y0 + y1) / 2 + 0.2)} dir={v(0, 1)} upright size={12}>
								{emission ? 'fotone emesso' : 'fotone assorbito'}
							</Label>
						</g>
					)}
					{[100, 200, 400, 700, 1000, 2000].map((t) => (
						<g key={t}>
							<path d={f.path([v(xOf(t), BAND.y0), v(xOf(t), BAND.y0 - 0.12)])} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={v(xOf(t), BAND.y0 - 0.12)} dir={v(0, -1)} upright size={12}>
								{t}
							</Label>
						</g>
					))}
					<Label f={f} at={v(5, BAND.y0 - 0.62)} dir={v(0, -1)} upright size={12}>
						lunghezza d&apos;onda (nm)
					</Label>
					<path d={f.path([v(xOf(400), BAND.y1 + 0.22), v(xOf(400), BAND.y1 + 0.1), v(xOf(700), BAND.y1 + 0.1), v(xOf(700), BAND.y1 + 0.22)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<Label f={f} at={v(xOf(530), BAND.y1 + 0.12)} dir={v(0, 1)} upright size={12}>
						visibile
					</Label>
					<Label f={f} at={v(xOf(180), BAND.y1 + 0.12)} dir={v(0, 1)} upright size={12}>
						ultravioletto
					</Label>
					<Label f={f} at={v(xOf(1400), BAND.y1 + 0.12)} dir={v(0, 1)} upright size={12}>
						infrarosso
					</Label>
					{j && <path d={`M${f.px(v(xOf(j.nm), 0)).x},${band.y - 1} l-4.5,-8 l9,0 Z`} fill="#000" />}
				</Drawing>
				<ColourLayer f={f}>
					<rect x={band.x} y={band.y} width={bandW} height={bandH} fill="#000" />
					{all.map((k) => {
						const [a, b] = k.split('-').map(Number);
						const nm = jump(a, b).nm;
						const now = k === key && !same;
						return <rect key={k} x={f.px(v(xOf(nm), 0)).x - (now ? 1.5 : 1)} y={band.y} width={now ? 3 : 2} height={bandH} fill={lineColour(nm)} fillOpacity={now ? 1 : 0.55} />;
					})}
				</ColourLayer>
			</div>
			{j ? (
				<Readout>
					<Tex>{`E_{${from}} = ${texSci(levelE(from))}\\,\\text{J}`}</Tex>
					<Tex>{`E_{${to}} = ${texSci(levelE(to))}\\,\\text{J}`}</Tex>
					<Tex>{`\\Delta E = ${texSci(j.dE)}\\,\\text{J}`}</Tex>
					<Tex>{`\\lambda = ${j.nm}\\,\\text{nm}`}</Tex>
				</Readout>
			) : (
				<Readout>
					<Tex>{`E_{${from}} = ${texSci(levelE(from))}\\,\\text{J}`}</Tex>
				</Readout>
			)}
			<Caption>
				{same
					? 'Partenza e arrivo coincidono: nessun salto, nessun fotone. Scegli due livelli diversi.'
					: `Salto ${from} → ${to}: l'atomo ${emission ? 'emette' : 'assorbe'} un fotone ${region === 'ultravioletto' || region === 'infrarosso' ? `nell'${region}` : `di luce visibile, di colore ${region}`}. ${SERIES[lo] ? `La riga appartiene alla ${SERIES[lo]}.` : `Il livello più basso è il ${lo}: una serie nell'infrarosso, oltre quella di Paschen.`} Righe trovate: ${all.length}.`}
			</Caption>
			<Controls>
				<Slider label="Livello di partenza" value={from} min={1} max={6} step={1} onChange={(x) => pick(x, to)} />
				<Slider label="Livello di arrivo" value={to} min={1} max={6} step={1} onChange={(x) => pick(from, x)} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setFound([])}>
						Cancella le righe
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
