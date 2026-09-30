'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, Handle, frame, v, clamp, num, texNum, THIN, TINT, DOTTED, FONT_MATH, type V } from '../kit';
import { Ray, Normal, RAY, criticalAngle, refract } from './ottica';

/**
 * Lesson 34 (La rifrazione e la riflessione totale), after example 5: two media one above the other, separated by a
 * horizontal surface, with the normal dashed at the point of incidence. The student drags the start of the incident
 * ray (or uses the slider) to set the angle of incidence θ₁, from the normal, and picks each medium among air, water,
 * glass and diamond. The refracted ray follows Snell's law (refract of ottica.tsx); the reflected ray is always drawn,
 * faint while a refracted ray exists and full once the angle passes the critical angle, which is marked by a dotted
 * line when the light goes towards a less refracting medium. Under the drawing: θ₁, θ₂, n₁ sin θ₁ and n₂ sin θ₂, θL.
 */

type Medium = 'aria' | 'acqua' | 'vetro' | 'diamante';
const MEDIA: Record<Medium, { n: number; fill: string | null }> = {
	aria: { n: 1.0, fill: null },
	acqua: { n: 1.33, fill: '#ccffff' }, // cyan!20, as the lessons' water
	vetro: { n: 1.5, fill: TINT.blue }, // blue!10, as the lessons' glass
	diamante: { n: 2.42, fill: TINT.gray }
};
/** "dall'acqua", "all'acqua", "nell'acqua": the prepositions with the article, for the caption. */
const DA: Record<Medium, string> = { aria: "dall'aria", acqua: "dall'acqua", vetro: 'dal vetro', diamante: 'dal diamante' };
const A: Record<Medium, string> = { aria: "all'aria", acqua: "all'acqua", vetro: 'al vetro', diamante: 'al diamante' };
const IN: Record<Medium, string> = { aria: "nell'aria", acqua: "nell'acqua", vetro: 'nel vetro', diamante: 'nel diamante' };
const OPTIONS = (['aria', 'acqua', 'vetro', 'diamante'] as const).map((m) => ({ value: m, label: m }));

const R = 2; // length of the rays, cm
const W = 2.6;
const f = frame(-W, W, -2.35, 2.35);
const O = v(0, 0);
const DEG = Math.PI / 180;
const ARC1 = 0.62, ARC2 = 0.72;

export default function RifrazioneDueMezzi({ alt }: { alt?: string }) {
	const [theta, setTheta] = useState(45);
	const [top, setTop] = useState<Medium>('aria');
	const [bottom, setBottom] = useState<Medium>('acqua');
	const n1 = MEDIA[top].n, n2 = MEDIA[bottom].n;
	const t1 = theta * DEG;

	const start = v(-R * Math.sin(t1), R * Math.cos(t1));
	const move = (p: V) => {
		// The angle from the upward normal to the pointer, on the left side, whole degrees.
		const a = Math.atan2(-p.x, Math.max(p.y, 0.001)) / DEG;
		setTheta(Math.round(clamp(a, 0, 89)));
	};

	const d = v(Math.sin(t1), -Math.cos(t1)); // travelling down and to the right
	const out = refract(d, v(0, 1), n1, n2);
	const reflected = v(Math.sin(t1), Math.cos(t1));
	const theta2 = out ? Math.asin(clamp(out.x, -1, 1)) / DEG : null;
	const crit = criticalAngle(n1, n2);
	const critDeg = crit === null ? null : crit / DEG;
	const total = out === null;

	// Arcs of θ₁ (from the upward normal to the incident ray, on the left) and θ₂ (from the downward normal).
	const arc1 = f.arc(O, v(0, 1), start, ARC1);
	const arc2 = out && theta2! > 0.5 ? f.arc(O, v(0, -1), out, ARC2) : null;
	const lab1 = v(-(ARC1 + 0.28) * Math.sin(t1 / 2), (ARC1 + 0.28) * Math.cos(t1 / 2));
	const lab2 = theta2 !== null ? v((ARC2 + 0.3) * Math.sin((theta2 * DEG) / 2), -(ARC2 + 0.3) * Math.cos((theta2 * DEG) / 2)) : null;

	// The medium's name and index in a corner no ray reaches: the upper one on the right, the lower one on the left.
	const mediumText = (m: Medium, n: number, y: number, right: boolean) => (
		<>
			<Label f={f} at={v(right ? W + 0.12 : -W - 0.12, y)} dir={v(right ? -1 : 1, 0)} upright size={13}>
				{m}
			</Label>
			<Label f={f} at={v(right ? W + 0.12 : -W - 0.12, y - 0.36)} dir={v(right ? -1 : 1, 0)} upright size={13}>
				<tspan fontStyle="italic" fontFamily={FONT_MATH}>n</tspan>
				{` = ${n.toFixed(2).replace('.', ',')}`}
			</Label>
		</>
	);

	let caption: string;
	if (total) caption = `L'angolo di incidenza supera l'angolo limite di ${num(critDeg!, 1)}°: non c'è raggio rifratto, e tutta la luce si riflette ${IN[top]}. È la riflessione totale.`;
	else if (theta === 0) caption = 'Il raggio arriva lungo la normale e passa senza deviare.';
	else if (n1 === n2) caption = 'I due mezzi hanno lo stesso indice: il raggio non devia.';
	else if (n2 > n1) caption = `La luce entra in un mezzo più rifrangente e si avvicina alla normale: θ₂ è più piccolo di θ₁. Passando ${DA[top]} ${A[bottom]} la riflessione totale non può succedere.`;
	else caption = `La luce entra in un mezzo meno rifrangente e si allontana dalla normale. Oltre l'angolo limite di ${num(critDeg!, 1)}°, la linea a puntini, il raggio rifratto sparisce.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{MEDIA[top].fill && <rect x={0} y={0} width={f.W} height={f.px(O).y} fill={MEDIA[top].fill!} />}
				{MEDIA[bottom].fill && <rect x={0} y={f.px(O).y} width={f.W} height={f.H - f.px(O).y} fill={MEDIA[bottom].fill!} />}
				<path d={f.path([v(-W, 0), v(W, 0)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<Normal f={f} at={O} n={v(0, 1)} length={2.25} />
				{critDeg !== null && <path d={f.path([O, v(-R * Math.sin(crit!), R * Math.cos(crit!))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DOTTED} strokeLinecap="round" fill="none" />}
				{critDeg !== null && (
					<Label f={f} at={v(-(R + 0.12) * Math.sin(crit!), (R + 0.12) * Math.cos(crit!))} dir={v(-Math.sin(crit!), Math.cos(crit!))} size={14}>
						θ<tspan fontSize={10} dy={3}>L</tspan>
					</Label>
				)}
				<g opacity={total ? 1 : 0.35}>
					<Ray f={f} from={O} to={v(R * reflected.x, R * reflected.y)} color={RAY} />
				</g>
				<Ray f={f} from={start} to={O} color={RAY} />
				{out && <Ray f={f} from={O} to={v(R * out.x, R * out.y)} color={RAY} />}
				{theta > 0.5 && <path d={arc1} stroke="#000" strokeWidth={THIN} fill="none" />}
				{arc2 && <path d={arc2} stroke="#000" strokeWidth={THIN} fill="none" />}
				{theta >= 8 && (
					<Label f={f} at={lab1} size={14}>
						θ<tspan fontSize={10} dy={3}>1</tspan>
					</Label>
				)}
				{lab2 && theta2! >= 8 && (
					<Label f={f} at={lab2} size={14}>
						θ<tspan fontSize={10} dy={3}>2</tspan>
					</Label>
				)}
				{mediumText(top, n1, 2.08, true)}
				{mediumText(bottom, n2, -1.62, false)}
				<Handle f={f} at={start} onMove={move} label="Inizio del raggio incidente" color={RAY} step={0.1} />
			</Drawing>
			<Readout>
				<Tex>{`\\theta_1 = ${theta}^\\circ`}</Tex>
				<Tex>{theta2 === null ? '\\text{nessun raggio rifratto}' : `\\theta_2 \\approx ${texNum(theta2, 1)}^\\circ`}</Tex>
				<Tex>{`n_1 \\sin\\theta_1 = ${texNum(n1 * Math.sin(t1), 3)}`}</Tex>
				{theta2 !== null && <Tex>{`n_2 \\sin\\theta_2 = ${texNum(n2 * Math.sin(theta2 * DEG), 3)}`}</Tex>}
				{critDeg !== null && <Tex>{`\\theta_L \\approx ${texNum(critDeg, 1)}^\\circ`}</Tex>}
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<Slider label="Angolo θ₁ (°)" value={theta} min={0} max={89} step={1} onChange={setTheta} />
				<div className="flex flex-col gap-1.5">
					<span className="text-sm text-fg-muted">Mezzo sopra, da cui arriva la luce</span>
					<ToggleGroup label="Mezzo sopra" options={OPTIONS} value={top} onChange={setTop} />
				</div>
				<div className="flex flex-col gap-1.5">
					<span className="text-sm text-fg-muted">Mezzo sotto</span>
					<ToggleGroup label="Mezzo sotto" options={OPTIONS} value={bottom} onChange={setBottom} />
				</div>
			</Controls>
		</Figure>
	);
}
