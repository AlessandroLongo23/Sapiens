'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, texNum, THIN, FONT } from '../kit';
import { Ground } from '../fisica';
import { QuantityText } from './liquidi';

/**
 * Lesson 66 (La dilatazione termica): a bar 1,000 m long at 20 °C, its left end against a wall, heated evenly up to
 * 220 °C. The student picks the material (the lesson's table: aluminium, copper, steel, Pyrex, Invar) and moves the
 * temperature; the bar lengthens by Δl = λ l0 Δt. The bar is drawn at 5 cm per metre, where millimetres would not show,
 * so its lengthening is drawn 60 times larger than the bar's scale: a millimetre ruler at the same enlargement sits
 * under the free end, the cold end stays marked with a dashed line and a dimension gives Δl. The bar's fill warms
 * from blue to orange with the temperature.
 */

const L0 = 1; // m
const T0 = 20;
const BAR = 5; // cm drawn for the metre
const ZOOM = 60; // how much larger the lengthening is drawn than the bar
const MM = (BAR / 1000) * ZOOM; // drawn cm per real mm: 0,3
const RULER = 5; // mm on the ruler
const Y0 = 0.9, H = 0.36; // the bar's lower side and thickness
const f = frame(-0.55, BAR + RULER * MM + 0.75, -0.85, 1.85);

type Mat = 'al' | 'cu' | 'fe' | 'py' | 'in';
const MATS: Record<Mat, { label: string; name: string; lambda: number; tex: string }> = {
	al: { label: 'Alluminio', name: "d'alluminio", lambda: 2.3e-5, tex: '2{,}3 \\cdot 10^{-5}' },
	cu: { label: 'Rame', name: 'di rame', lambda: 1.7e-5, tex: '1{,}7 \\cdot 10^{-5}' },
	fe: { label: 'Acciaio', name: "d'acciaio", lambda: 1.2e-5, tex: '1{,}2 \\cdot 10^{-5}' },
	py: { label: 'Pyrex', name: 'di vetro pyrex', lambda: 3.3e-6, tex: '3{,}3 \\cdot 10^{-6}' },
	in: { label: 'Invar', name: "d'invar", lambda: 1.2e-6, tex: '1{,}2 \\cdot 10^{-6}' },
};

/** blue!10 at 20 °C to orange!40 at 220 °C. */
function warm(k: number) {
	const a = [0xe6, 0xe6, 0xff], b = [0xff, 0xcc, 0x99];
	return `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * k)).join(',')})`;
}

export default function DilatazioneSbarra({ alt }: { alt?: string }) {
	const [mat, setMat] = useState<Mat>('al');
	const [t, setT] = useState(120);
	const m = MATS[mat];
	const dt = t - T0;
	const dl = m.lambda * L0 * 1000 * dt; // mm
	const end = BAR + dl * MM;
	const txt = (x: number, y: number, s: string, anchor: 'start' | 'middle' | 'end' = 'middle', size = 12) => {
		const p = f.px(v(x, y));
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={size} fontFamily={FONT} fill="#000" pointerEvents="none">
				{s}
			</text>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(0, -0.3)} to={v(0, 1.75)} />
				<path d={f.path([v(0, Y0), v(end, Y0), v(end, Y0 + H), v(0, Y0 + H)], true)} fill={warm(dt / 200)} stroke="#000" strokeWidth={1.2} pointerEvents="none" />
				{/* the cold end, and the dimension of the bar */}
				<path d={f.path([v(BAR, Y0 + H + 0.1), v(BAR, 0.55)])} stroke="#000" strokeWidth={THIN} strokeDasharray="3 3" fill="none" pointerEvents="none" />
				<QuantityText f={f} at={v(BAR / 2, Y0 + H + 0.3)} text="l_0 = 1,000 m a 20 °C" />
				{/* the ruler under the free end, in real millimetres drawn 60 times larger */}
				<path d={f.path([v(BAR, 0.35), v(BAR + RULER * MM, 0.35)])} stroke="#000" strokeWidth={THIN} fill="none" pointerEvents="none" />
				{Array.from({ length: RULER * 2 + 1 }, (_, i) => i / 2).map((x) => (
					<path key={x} d={f.path([v(BAR + x * MM, 0.35), v(BAR + x * MM, Number.isInteger(x) ? 0.55 : 0.46)])} stroke="#000" strokeWidth={THIN} pointerEvents="none" />
				))}
				{Array.from({ length: RULER + 1 }, (_, i) => i).map((x) => (
					<g key={x}>{txt(BAR + x * MM, 0.16, String(x), 'middle', 11)}</g>
				))}
				{txt(BAR + RULER * MM + 0.12, 0.16, 'mm', 'start', 11)}
				{dl * MM > 0.08 && (
					<g pointerEvents="none">
						<path d={f.path([v(BAR, -0.2), v(end, -0.2)])} stroke="#e67300" strokeWidth={1.2} fill="none" />
						<path d={f.path([v(end, Y0), v(end, -0.3)])} stroke="#e67300" strokeWidth={THIN} fill="none" />
					</g>
				)}
				<QuantityText f={f} at={v(BAR - 0.1, -0.2)} anchor="end" text={`Δl = ${num(dl, 2)} mm`} />
				{txt(BAR - 0.1, -0.6, `allungamento ingrandito ${ZOOM} volte`, 'end', 11)}
			</Drawing>

			<Readout>
				<Tex>{`\\Delta t = ${t} - 20 = ${dt}\\,^\\circ\\text{C}`}</Tex>
				<Tex>{`\\lambda = ${m.tex}\\,^\\circ\\text{C}^{-1}`}</Tex>
				<Tex>{`\\Delta l = \\lambda\\, l_0\\, \\Delta t = ${texNum(dl, 2)}\\,\\text{mm}`}</Tex>
			</Readout>
			<Caption>
				{dt === 0
					? 'A 20 °C la sbarra è lunga un metro esatto. Scaldala con il cursore.'
					: `La sbarra ${m.name}, scaldata di ${dt} °C, si allunga di ${num(dl, 2)} mm. ${mat === 'in' ? "L'invar si dilata così poco che si usa per gli strumenti di precisione." : mat === 'py' ? 'Il vetro pyrex si dilata poco, e per questo non si rompe quando lo si scalda in fretta.' : ''}`}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Materiale" options={(Object.keys(MATS) as Mat[]).map((k) => ({ value: k, label: MATS[k].label }))} value={mat} onChange={setMat} />
				</div>
				<Slider label="Temperatura (°C)" value={t} min={20} max={220} step={5} onChange={setT} />
			</Controls>
		</Figure>
	);
}
