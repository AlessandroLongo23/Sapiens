'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, THICK, THIN } from '../kit';
import { C, H, N_A, ColourLayer, colourName, texSci, wavelengthCss } from './chim3-A-luce';

/**
 * Lesson 48 (La luce e gli spettri atomici), "L'energia della luce arriva a pacchetti": the student picks a
 * wavelength between 250 and 900 nm and reads the colour, the frequency (c = λν) and the energy of a photon
 * (E = hν), for one photon and for a mole of them. A wave above the band stretches and shrinks with λ.
 *
 * The band and the patch of colour are in a layer left out of the dark theme's inversion: the colours of light are
 * the same on both backgrounds, and ultraviolet and infrared are black because the eye does not see them.
 */

const MIN = 250, MAX = 900;
const BAND_Y0 = 0.25, BAND_Y1 = 0.95;
const WAVE_Y = 2.25, AMP = 0.45, WAVE_X1 = 8.2;
const f = frame(-0.35, 10.35, -1.2, 3.5);
const xOf = (nm: number) => ((nm - MIN) / (MAX - MIN)) * 10;

export default function LuceLunghezzaOnda({ alt }: { alt?: string }) {
	const [nm, setNm] = useState(530);
	const nu = C / (nm * 1e-9);
	const E = H * nu;
	const name = colourName(nm);
	const visible = nm >= 400 && nm <= 700;

	// One wavelength of the drawing is λ/250 cm: 1 cm at 250 nm, 3,6 cm at 900 nm.
	const L = nm / 250;
	const wave = Array.from({ length: 241 }, (_, i) => {
		const x = (i / 240) * WAVE_X1;
		return v(x, WAVE_Y + AMP * Math.cos((2 * Math.PI * x) / L));
	});
	const slices = Array.from({ length: 325 }, (_, i) => MIN + ((i + 0.5) / 325) * (MAX - MIN));
	const band = f.px(v(0, BAND_Y1));
	const bandW = f.px(v(10, 0)).x - band.x;
	const bandH = f.px(v(0, BAND_Y0)).y - band.y;
	const mark = f.px(v(xOf(nm), BAND_Y1 + 0.08));
	const patch = f.px(v(8.75, WAVE_Y + 0.6));
	const patchSide = f.px(v(9.95, 0)).x - patch.x;

	return (
		<Figure>
			<div className="relative max-w-full">
				<Drawing f={f} label={alt}>
					<path d={f.path([v(0, WAVE_Y), v(WAVE_X1, WAVE_Y)])} stroke="#808080" strokeWidth={THIN} />
					<path d={f.path(wave)} stroke="#000" strokeWidth={THICK} fill="none" />
					<path d={f.path([v(0, WAVE_Y + AMP + 0.2), v(L, WAVE_Y + AMP + 0.2)])} stroke="#000" strokeWidth={THIN} />
					<path d={f.path([v(0, WAVE_Y + AMP + 0.1), v(0, WAVE_Y + AMP + 0.3)])} stroke="#000" strokeWidth={THIN} />
					<path d={f.path([v(L, WAVE_Y + AMP + 0.1), v(L, WAVE_Y + AMP + 0.3)])} stroke="#000" strokeWidth={THIN} />
					<Label f={f} at={v(L / 2, WAVE_Y + AMP + 0.22)} dir={v(0, 1)}>
						λ
					</Label>
					<path d={`M${mark.x},${mark.y} l-5,-9 l10,0 Z`} fill="#000" />
					{[300, 400, 500, 600, 700, 800, 900].map((t) => (
						<g key={t}>
							<path d={f.path([v(xOf(t), BAND_Y0), v(xOf(t), BAND_Y0 - 0.12)])} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={v(xOf(t), BAND_Y0 - 0.12)} dir={v(0, -1)} upright size={12}>
								{t}
							</Label>
						</g>
					))}
					<Label f={f} at={v(5, BAND_Y0 - 0.62)} dir={v(0, -1)} upright size={12}>
						lunghezza d&apos;onda (nm)
					</Label>
					<Label f={f} at={v(9.35, WAVE_Y + 0.66)} dir={v(0, 1)} upright size={12}>
						{name}
					</Label>
				</Drawing>
				<ColourLayer f={f}>
					<rect x={band.x} y={band.y} width={bandW} height={bandH} fill="#000" />
					{slices.map((w) => (
						<rect key={w} x={f.px(v(xOf(w - 1), 0)).x} y={band.y} width={bandW / 325 + 0.5} height={bandH} fill={wavelengthCss(w)} />
					))}
					<text x={f.px(v(xOf(315), 0)).x} y={band.y + bandH / 2} dy="0.35em" textAnchor="middle" fontSize={11} fill="#fff">
						ultravioletto
					</text>
					<text x={f.px(v(xOf(825), 0)).x} y={band.y + bandH / 2} dy="0.35em" textAnchor="middle" fontSize={11} fill="#fff">
						infrarosso
					</text>
					<rect x={patch.x} y={patch.y} width={patchSide} height={patchSide} rx={6} fill="#000" />
					<rect x={patch.x + 4} y={patch.y + 4} width={patchSide - 8} height={patchSide - 8} rx={4} fill={wavelengthCss(nm)} />
				</ColourLayer>
			</div>
			<Readout>
				<Tex>{`\\lambda = ${nm}\\,\\text{nm}`}</Tex>
				<Tex>{`\\nu = ${texSci(nu)}\\,\\text{Hz}`}</Tex>
				<Tex>{`E = ${texSci(E)}\\,\\text{J}`}</Tex>
				<Tex>{`\\text{una mole: } ${Math.round((E * N_A) / 1000)}\\,\\text{kJ/mol}`}</Tex>
			</Readout>
			<Caption>
				{visible
					? `Luce di colore ${name}. Accorciando la lunghezza d'onda la frequenza e l'energia del fotone crescono.`
					: nm < 400
						? `Ultravioletto: l'occhio non lo vede. I suoi fotoni hanno più energia di quelli della luce violetta.`
						: `Infrarosso: l'occhio non lo vede. I suoi fotoni hanno meno energia di quelli della luce rossa.`}
			</Caption>
			<Controls>
				<Slider label="Lunghezza d'onda" value={nm} min={MIN} max={MAX} step={5} unit="nm" onChange={setNm} />
			</Controls>
		</Figure>
	);
}
