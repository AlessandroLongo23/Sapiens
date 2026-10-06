'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, num, TINT, THICK, THIN, INK } from '../kit';
import { H, texSci } from './chim3-A-luce';

/**
 * Lesson 51 (Dualismo onda-particella e principio di indeterminazione), "L'ipotesi di de Broglie": the student picks
 * an object (electron, proton, helium atom, a C60 molecule, a speck of dust, a tennis ball) and its speed, and reads
 * the de Broglie wavelength λ = h/(mv) with the lesson's h = 6,63·10⁻³⁴ J·s.
 *
 * Above: an atom 200 pm across and, beside it, the object's wave at the same scale (1 cm = 125 pm); when the wave is
 * too fine or too long to draw at that scale, a band or a flat line and a note say so. Below: a ruler of lengths in
 * powers of ten, from 10⁻³⁶ m to 10⁻⁶ m, with the nucleus, the atom and visible light marked, and a mark for λ.
 * The speed slider gives the exponent x of 10ˣ m/s, so that one slider reaches from 1 m/s to 3·10⁷ m/s.
 */

const OBJECTS = [
	{ nome: 'elettrone', kg: 9.11e-31, exp: 6.35 },
	{ nome: 'protone', kg: 1.67e-27, exp: 6.35 },
	{ nome: 'atomo di elio', kg: 6.65e-27, exp: 3.1 },
	{ nome: 'molecola di fullerene', kg: 1.2e-24, exp: 2.3 },
	{ nome: 'granello di polvere', kg: 1.0e-9, exp: 0 },
	{ nome: 'pallina da tennis', kg: 0.057, exp: 1.7 }
];
const MARKS = [
	{ nome: 'nucleo', m: 1e-15, up: 0.85 },
	{ nome: 'atomo', m: 1e-10, up: 0.85 },
	{ nome: 'luce visibile', m: 5e-7, up: 1.3 }
];
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const power = (e: number) => `10${e < 0 ? '⁻' : ''}${String(Math.abs(e)).split('').map((d) => SUP[Number(d)]).join('')}`;

const E0 = -36, E1 = -6;
const RULER_Y = -0.2;
const ATOM = v(1.0, 3.1), ATOM_R = 0.8; // 200 pm across
const CM_PER_M = 1.6 / 200e-12;
const WAVE_X0 = 2.5, WAVE_X1 = 10, WAVE_AMP = 0.5;
const f = frame(-0.35, 10.35, -1.3, 4.25);
const xOf = (m: number) => ((Math.log10(m) - E0) / (E1 - E0)) * 10;

export default function OndaDeBroglie({ alt }: { alt?: string }) {
	const [which, setWhich] = useState(0);
	const [exp, setExp] = useState(OBJECTS[0].exp);
	const obj = OBJECTS[which];
	const speed = 10 ** exp;
	const lambda = H / (obj.kg * speed);
	const L = lambda * CM_PER_M; // the wavelength in the drawing, cm
	const fine = L < 0.07;
	const long = L > 40;
	const samples = Math.min(1500, Math.max(200, Math.ceil(((WAVE_X1 - WAVE_X0) / L) * 16)));
	const wave = Array.from({ length: samples + 1 }, (_, i) => {
		const x = WAVE_X0 + (i / samples) * (WAVE_X1 - WAVE_X0);
		return v(x, ATOM.y + WAVE_AMP * Math.cos((2 * Math.PI * (x - WAVE_X0)) / L));
	});
	const mx = Math.min(10, Math.max(0, xOf(lambda)));
	const mark = f.px(v(mx, RULER_Y + 0.06));
	const band = f.px(v(WAVE_X0, ATOM.y + WAVE_AMP));
	const bandEnd = f.px(v(WAVE_X1, ATOM.y - WAVE_AMP));
	const atomC = f.px(ATOM);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={atomC.x} cy={atomC.y} r={ATOM_R * (f.W / (f.x1 - f.x0))} fill={TINT.blue} stroke="#000" strokeWidth={THIN} />
				<circle cx={atomC.x} cy={atomC.y} r={2} fill="#000" />
				<Label f={f} at={v(ATOM.x, ATOM.y - ATOM_R - 0.05)} dir={v(0, -1)} upright size={12}>
					atomo, 200 pm
				</Label>
				{fine ? (
					<rect x={band.x} y={band.y} width={bandEnd.x - band.x} height={bandEnd.y - band.y} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				) : (
					<path d={f.path(wave)} stroke="#000" strokeWidth={THICK} fill="none" />
				)}
				<Label f={f} at={v((WAVE_X0 + WAVE_X1) / 2, ATOM.y - ATOM_R - 0.05)} dir={v(0, -1)} upright size={12}>
					{fine ? "l'onda, alla stessa scala: troppo fitta per disegnarla" : long ? "l'onda, alla stessa scala: molto più lunga del disegno" : `l'onda ${which === 0 ? "dell'elettrone" : "dell'oggetto"}, alla stessa scala`}
				</Label>
				<path d={f.path([v(0, RULER_Y), v(10, RULER_Y)])} stroke="#000" strokeWidth={THICK} />
				{Array.from({ length: 31 }, (_, i) => E0 + i).map((e) => (
					<g key={e}>
						<path d={f.path([v(xOf(10 ** e), RULER_Y), v(xOf(10 ** e), RULER_Y - (e % 6 === 0 ? 0.14 : 0.07))])} stroke="#000" strokeWidth={THIN} />
						{e % 6 === 0 && (
							<Label f={f} at={v(xOf(10 ** e), RULER_Y - 0.14)} dir={v(0, -1)} upright size={12}>
								{power(e)}
							</Label>
						)}
					</g>
				))}
				<Label f={f} at={v(5, RULER_Y - 0.62)} dir={v(0, -1)} upright size={12}>
					lunghezza (m)
				</Label>
				{MARKS.map((k) => (
					<g key={k.nome}>
						<path d={f.path([v(xOf(k.m), RULER_Y), v(xOf(k.m), RULER_Y + k.up)])} stroke="#000" strokeWidth={THIN} strokeDasharray="2 2" />
						<Label f={f} at={v(xOf(k.m) + (k.m > 1e-8 ? 0.1 : 0), RULER_Y + k.up)} dir={v(k.m > 1e-8 ? -1 : 0, 1)} upright size={12}>
							{k.nome}
						</Label>
					</g>
				))}
				<path d={`M${mark.x},${mark.y} l-5.5,-10 l11,0 Z`} fill={INK.orange} stroke="#000" strokeWidth={0.5} />
				<Label f={f} at={v(mx, RULER_Y + 0.32)} dir={v(0, 1)} size={14}>
					λ
				</Label>
			</Drawing>
			<Readout>
				<Tex>{`m = ${texSci(obj.kg)}\\,\\text{kg}`}</Tex>
				<Tex>{`v = ${texSci(speed, 2)}\\,\\text{m/s}`}</Tex>
				<Tex>{`\\lambda = ${texSci(lambda, 2)}\\,\\text{m}${lambda >= 1e-12 && lambda < 1e-9 ? ` = ${num(lambda * 1e12, lambda < 1e-11 ? 1 : 0)}\\,\\text{pm}` : ''}`}</Tex>
			</Readout>
			<Caption>
				{`${obj.nome[0].toUpperCase()}${obj.nome.slice(1)}: `}
				{lambda > 2e-9
					? "la lunghezza d'onda è più grande di un atomo. A questa velocità il comportamento da onda è evidente."
					: lambda >= 1e-11
						? "la lunghezza d'onda è confrontabile con un atomo e con le distanze tra gli atomi di un cristallo: l'onda si osserva con la diffrazione."
						: lambda >= 1e-15
							? "la lunghezza d'onda è più piccola di un atomo. Osservare l'onda è molto difficile."
							: "la lunghezza d'onda è più piccola di un nucleo: nessun esperimento può rivelarla, e l'oggetto si comporta come una particella."}
			</Caption>
			<Controls>
				<div className="flex flex-wrap justify-center gap-1.5">
					{OBJECTS.map((o, i) => (
						<button
							key={o.nome}
							type="button"
							onClick={() => {
								setWhich(i);
								setExp(o.exp);
							}}
							aria-pressed={which === i}
							className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${which === i ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
						>
							{o.nome}
						</button>
					))}
				</div>
				<Slider label="Velocità (10ˣ m/s)" value={exp} min={0} max={7.5} step={0.05} onChange={setExp} />
			</Controls>
		</Figure>
	);
}
