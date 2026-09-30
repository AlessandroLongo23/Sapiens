'use client';

import { Drawing, Label, frame, v, THIN, TINT, FONT, FONT_MATH, type V } from '@/components/content/interactive/kit';
import { Ray, Normal, RAY } from '@/components/content/interactive/fisica/ottica';
import type { SceneProps } from '.';

/**
 * A ray between two media, for the exercises of "La rifrazione e la riflessione totale" (group 11): the surface
 * between the media is horizontal, the light comes from the upper one, the normal is dashed at the point of
 * incidence. The incident ray arrives from the upper left at `incidente` degrees from the normal; an arc marks the
 * angle given in the text, from the normal or from the surface. The refracted ray (lower right) and the reflected
 * ray (upper right) are drawn only if given: the generator puts them in `solutionScene`, or in the problem scene
 * when the text gives them (the index from two angles).
 *
 *   { type: 'raggio-due-mezzi', data: {
 *       sopra: { nome: 'vetro', n: '1,50' }, sotto: { nome: 'aria', n: '1,00' },
 *       incidente: 35,                                   // degrees from the normal
 *       arco: { rif: 'normale' | 'superficie', testo: '35°' },
 *       rifratto: { angolo: 59.4, testo: '59°' },        // optional: degrees from the normal, and its arc's text
 *       riflesso: true } }                               // optional: the reflected ray (total reflection)
 */
type Medium = { nome: string; n: string };
const FILL: Record<string, string | undefined> = { acqua: '#ccffff', ghiaccio: '#ccffff', 'alcol etilico': '#ccffff', vetro: TINT.blue, diamante: TINT.gray, plastica: TINT.blue, liquido: '#ccffff', materiale: TINT.blue };

const R = 1.8;
const W = 3.1;
const f = frame(-W, W, -2.1, 2.2);
const O = v(0, 0);
const DEG = Math.PI / 180;

export default function RaggioDueMezzi({ data, alt }: SceneProps) {
	const top = (data.sopra as Medium | undefined) ?? { nome: 'aria', n: '1,00' };
	const bottom = (data.sotto as Medium | undefined) ?? { nome: 'acqua', n: '1,33' };
	const t1 = Number(data.incidente ?? 45) * DEG;
	const arc = (data.arco as { rif: 'normale' | 'superficie'; testo: string } | undefined) ?? null;
	const refr = (data.rifratto as { angolo: number; testo?: string } | undefined) ?? null;
	const refl = data.riflesso === true;

	const start = v(-R * Math.sin(t1), R * Math.cos(t1));
	const t2 = refr ? refr.angolo * DEG : 0;
	const out = v(R * Math.sin(t2), -R * Math.cos(t2));
	const back = v(R * Math.sin(t1), R * Math.cos(t1));

	// The given angle: from the upward normal to the incident ray, or from the surface (on the left) to it.
	const rho = 0.62;
	let arcPath = '', arcAt: V = O;
	if (arc?.rif === 'superficie') {
		arcPath = f.arc(O, start, v(-1, 0), rho);
		const mid = (90 * DEG + t1 + 180 * DEG) / 2; // halfway between the ray's direction and the surface's
		arcAt = v((rho + 0.33) * Math.cos(mid), (rho + 0.33) * Math.sin(mid));
	} else if (arc) {
		arcPath = f.arc(O, v(0, 1), start, rho);
		// On the bisector, or past the ray when the angle is too narrow to hold the text.
		const a = t1 < 25 * DEG ? t1 + 14 * DEG : t1 / 2;
		arcAt = v(-(rho + 0.33) * Math.sin(a), (rho + 0.33) * Math.cos(a));
	}
	const arc2 = refr?.testo ? f.arc(O, v(0, -1), out, 0.72) : '';
	const b2 = t2 < 25 * DEG ? t2 + 14 * DEG : t2 / 2;
	const arc2At = v(1.05 * Math.sin(b2), -1.05 * Math.cos(b2));

	const fillTop = FILL[top.nome], fillBottom = FILL[bottom.nome];
	const y0 = f.px(O).y;
	const mediumText = (m: Medium, at: V, right: boolean) => (
		<Label f={f} at={at} dir={v(right ? -1 : 1, 0)} upright size={13}>
			{`${m.nome}, `}
			<tspan fontStyle="italic" fontFamily={FONT_MATH}>
				n
			</tspan>
			{` = ${m.n}`}
		</Label>
	);

	return (
		<Drawing f={f} label={alt}>
			{fillTop && <rect x={0} y={0} width={f.W} height={y0} fill={fillTop} />}
			{fillBottom && <rect x={0} y={y0} width={f.W} height={f.H - y0} fill={fillBottom} />}
			<path d={f.path([v(-W, 0), v(W, 0)])} stroke="#000" strokeWidth={THIN} fill="none" />
			<Normal f={f} at={O} n={v(0, 1)} length={2.0} />
			<Ray f={f} from={start} to={O} color={RAY} />
			{refr && <Ray f={f} from={O} to={out} color={RAY} />}
			{refl && <Ray f={f} from={O} to={back} color={RAY} />}
			{arc && <path d={arcPath} stroke="#000" strokeWidth={THIN} fill="none" />}
			{arc && (
				<text x={f.px(arcAt).x} y={f.px(arcAt).y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT} pointerEvents="none">
					{arc.testo}
				</text>
			)}
			{arc2 && <path d={arc2} stroke="#000" strokeWidth={THIN} fill="none" />}
			{refr?.testo && (
				<text x={f.px(arc2At).x} y={f.px(arc2At).y} dy="0.35em" textAnchor="middle" fontSize={13} fontFamily={FONT} pointerEvents="none">
					{refr.testo}
				</text>
			)}
			{mediumText(top, v(W + 0.12, 1.92), true)}
			{mediumText(bottom, v(-W - 0.12, -1.75), false)}
		</Drawing>
	);
}
