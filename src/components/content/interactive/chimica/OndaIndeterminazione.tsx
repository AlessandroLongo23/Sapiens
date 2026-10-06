'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, THICK, THIN, DASH, INK, type V } from '../kit';
import { H, texSci } from './chim3-A-luce';

/**
 * Lesson 51 (Dualismo onda-particella e principio di indeterminazione), "Il principio di indeterminazione": an
 * electron as a wave packet. The slider sets the uncertainty on the position, Δx, from 10 to 1000 pm; the packet
 * above gets narrower or wider, and the bell below, the spread of the velocities, does the opposite. Under the
 * drawing: Δx, the least Δv = h / (4π m Δx) with the lesson's constants, and Δv as a fraction of the electron's
 * speed on Bohr's first orbit, 2,19·10⁶ m/s.
 *
 * The widths of the two curves are schematic (the packet's on a logarithmic scale of Δx), but they are the inverse
 * of each other, as the Fourier transform of a Gaussian packet wants.
 */

const M_E = 9.11e-31;
const V_BOHR = 2.19e6;
const TOP = 3.3, BOTTOM = 0;
const f = frame(-0.3, 10.3, -1.0, 4.75);
const gauss = (x: number, s: number) => Math.exp(-(x * x) / (2 * s * s));

function curve(fn: (x: number) => number, y0: number): V[] {
	return Array.from({ length: 401 }, (_, i) => {
		const x = (i / 400) * 10;
		return v(x, y0 + fn(x - 5));
	});
}

function Span({ half, y, label }: { half: number; y: number; label: string }) {
	const a = f.px(v(5 - half, y)), b = f.px(v(5 + half, y));
	return (
		<g>
			<path d={`M${a.x},${a.y} L${b.x},${b.y} M${a.x},${a.y - 4} l0,8 M${b.x},${b.y - 4} l0,8`} stroke={INK.blue} strokeWidth={THICK} fill="none" />
			<Label f={f} at={v(5, y - 0.02)} dir={v(0, -1)} size={14} color={INK.blue}>
				{label}
			</Label>
		</g>
	);
}

export default function OndaIndeterminazione({ alt }: { alt?: string }) {
	const [pm, setPm] = useState(100);
	const dx = pm * 1e-12;
	const dv = H / (4 * Math.PI * M_E * dx);
	const s = 0.25 + Math.log10(pm / 10); // 10 pm → 0,25 cm; 1000 pm → 2,25 cm
	const sv = 0.56 / s; // the other width: 2,25 cm → 0,25 cm
	const packet = curve((x) => 0.85 * gauss(x, s) * Math.cos((2 * Math.PI * x) / 0.42), TOP);
	const envUp = curve((x) => 0.85 * gauss(x, s), TOP);
	const envDown = curve((x) => -0.85 * gauss(x, s), TOP);
	const bell = curve((x) => 1.25 * gauss(x, sv), BOTTOM);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0, TOP), v(10, TOP)])} stroke="#808080" strokeWidth={THIN} />
				<path d={f.path(envUp)} stroke="#808080" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path(envDown)} stroke="#808080" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				<path d={f.path(packet)} stroke="#000" strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(0, TOP + 1.1)} dir={v(1, 0)} upright size={12}>
					posizione: dove può trovarsi l&apos;elettrone
				</Label>
				<Span half={s} y={TOP - 1.05} label="Δx" />
				<path d={f.path([v(0, BOTTOM), v(10, BOTTOM)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path(bell)} stroke="#000" strokeWidth={THICK} fill="none" />
				<Label f={f} at={v(0, BOTTOM + 1.45)} dir={v(1, 0)} upright size={12}>
					velocità: quali valori può avere
				</Label>
				<Span half={sv} y={BOTTOM - 0.3} label="Δv" />
			</Drawing>
			<Readout>
				<Tex>{`\\Delta x = ${pm}\\,\\text{pm}`}</Tex>
				<Tex>{`\\Delta v \\geq ${texSci(dv, 2)}\\,\\text{m/s}`}</Tex>
				<span>{Math.round((dv / V_BOHR) * 100)}% della velocità nella prima orbita di Bohr</span>
			</Readout>
			<Caption>
				{dv >= V_BOHR
					? "Elettrone chiuso in una zona molto più piccola di un atomo: l'incertezza sulla velocità supera la velocità stessa che l'elettrone avrebbe nell'orbita di Bohr."
					: dv >= 0.1 * V_BOHR
						? "Elettrone localizzato in una zona grande più o meno quanto un atomo: l'incertezza sulla velocità è una parte importante della velocità stessa. Una traiettoria non si può tracciare."
						: "Lasciando all'elettrone una zona molto più grande di un atomo la velocità diventa meglio definita, ma non si sa più dove l'elettrone sia."}
			</Caption>
			<Controls>
				<Slider label="Incertezza Δx" value={pm} min={10} max={1000} step={10} unit="pm" onChange={setPm} />
			</Controls>
		</Figure>
	);
}
