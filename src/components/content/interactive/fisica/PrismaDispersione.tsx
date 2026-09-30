'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, Handle, frame, v, add, sub, scale, dot, unit, clamp, num, texNum, THICK, THIN, TINT, type V } from '../kit';
import { Arrow } from '../fisica';
import { Normal, reflect, refract } from './ottica';

/**
 * Lesson 35 (La dispersione della luce e i colori), "L'indice di rifrazione dipende dal colore": an equilateral glass
 * prism; a ray of white light (black, as a line of the drawing) reaches the middle of its left face, and the student
 * drags the start of the ray, or uses the slider, to set the angle of incidence from the face's normal. Six colours
 * are traced through the prism with Snell's law (refract of ottica.tsx) and their own index, from a Cauchy fit
 * n(λ) = A + B/λ² to the flint glass F2 of the Schott catalogue (nC = 1,61503 at 656 nm, nF = 1,63208 at 486 nm; see
 * the lesson's notes: to be checked on the datasheet). A ray that meets the second face beyond its critical angle is
 * reflected inside and stops on the base. A toggle multiplies the differences between the indices by 3, to see the fan.
 *
 * The coloured rays are drawn in a second SVG laid exactly over the drawing and left out of the dark theme's
 * inversion (invert + hue-rotate turns yellow into brown and violet into pink): the spectrum keeps its colours on
 * both backgrounds, as a real one would on a dark screen.
 */

const A_CAUCHY = 1.59431;
const B_CAUCHY = 0.008924; // µm²
const COLOURS = [
	{ name: 'rosso', nm: 656, css: '#e0201b' },
	{ name: 'arancione', nm: 610, css: '#f07f13' },
	{ name: 'giallo', nm: 580, css: '#d9b300' },
	{ name: 'verde', nm: 530, css: '#2a9d3a' },
	{ name: 'azzurro', nm: 486, css: '#1f78d1' },
	{ name: 'violetto', nm: 420, css: '#8040e0' }
];
const nOf = (nm: number) => A_CAUCHY + B_CAUCHY / (nm / 1000) ** 2;
const N_D = nOf(589);

const S = 2.6; // side of the prism, cm
const PA = v(0, 0), PB = v(S, 0), PC = v(S / 2, (S * Math.sqrt(3)) / 2);
const FACES: { a: V; b: V; n: V }[] = [
	{ a: PB, b: PC, n: v(Math.sqrt(3) / 2, 0.5) }, // right face, outward normal
	{ a: PA, b: PB, n: v(0, -1) }, // base
	{ a: PC, b: PA, n: v(-Math.sqrt(3) / 2, 0.5) } // left face
];
const P = add(PA, scale(sub(PC, PA), 0.5)); // where the white light arrives
const IN_NORMAL = v(Math.sqrt(3) / 2, -0.5); // the left face's normal, pointing into the glass
const SCREEN = 6.0;
const f = frame(-1.9, SCREEN + 0.35, -1.45, 2.85);
const R = 1.7; // length of the incoming ray, cm
const DEG = Math.PI / 180;

/** Where the ray from p along d leaves the triangle, and through which face (p inside or on its border). */
function hitFace(p: V, d: V) {
	let best: { t: number; at: V; face: number } | null = null;
	FACES.forEach((F, i) => {
		const e = sub(F.b, F.a);
		const den = d.x * -e.y + e.x * d.y;
		if (Math.abs(den) < 1e-12) return;
		const w = sub(F.a, p);
		const t = (w.x * -e.y + e.x * w.y) / den;
		const s = (d.x * w.y - d.y * w.x) / den;
		if (t > 1e-6 && s >= -1e-9 && s <= 1 + 1e-9 && (!best || t < best.t)) best = { t, at: add(p, scale(d, t)), face: i };
	});
	return best as { t: number; at: V; face: number } | null;
}

/** The path of one colour: points inside the glass, then the way out to the screen or the frame's edge. */
function trace(d0: V, n: number): { inside: V[]; out: V | null; dir: V | null } {
	const t0 = refract(d0, IN_NORMAL, 1, n)!;
	const inside = [P];
	let p = P, d = t0;
	for (let k = 0; k < 3; k++) {
		const h = hitFace(p, d);
		if (!h) break;
		inside.push(h.at);
		const F = FACES[h.face];
		const o = refract(d, F.n, n, 1);
		if (o && h.face !== 1) {
			// Out of the glass: on to the screen, or to the bottom of the frame.
			const tx = o.x > 1e-6 ? (SCREEN - h.at.x) / o.x : Infinity;
			const ty = o.y < -1e-6 ? (f.y0 + 0.05 - h.at.y) / o.y : Infinity;
			const tt = Math.min(tx, ty, 12);
			return { inside, out: add(h.at, scale(o, tt)), dir: o };
		}
		if (o) return { inside, out: null, dir: null }; // it would leave through the base: stop the drawing there
		p = h.at;
		d = reflect(d, F.n);
	}
	return { inside, out: null, dir: null };
}

const signedAngle = (a: V, b: V) => Math.atan2(a.x * b.y - a.y * b.x, dot(a, b));

export default function PrismaDispersione({ alt }: { alt?: string }) {
	const [theta, setTheta] = useState(54);
	const [wide, setWide] = useState<'vera' | 'ingrandita'>('ingrandita');
	const k = wide === 'ingrandita' ? 3 : 1;
	const t = theta * DEG;
	// The incoming direction: the inward normal turned up by θ.
	const d0 = v(IN_NORMAL.x * Math.cos(t) - IN_NORMAL.y * Math.sin(t), IN_NORMAL.x * Math.sin(t) + IN_NORMAL.y * Math.cos(t));
	const start = sub(P, scale(d0, R));
	const move = (q: V) => {
		const w = unit(sub(P, q));
		const a = signedAngle(IN_NORMAL, w) / DEG;
		setTheta(Math.round(clamp(a, 20, 85)));
	};

	const rays = COLOURS.map((c) => {
		const n = N_D + k * (nOf(c.nm) - N_D);
		const tr = trace(d0, n);
		const dev = tr.dir ? -signedAngle(d0, tr.dir) / DEG : null;
		return { ...c, n, ...tr, dev };
	});
	const red = rays[0], violet = rays[rays.length - 1];
	const lost = rays.filter((r) => r.dev === null);
	const line = (ps: V[]) => f.path(ps);

	return (
		<Figure>
			<div className="relative max-w-full">
				<Drawing f={f} label={alt}>
					<path d={f.path([PA, PB, PC], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
					<Normal f={f} at={P} n={IN_NORMAL} length={0.7} />
					<path d={line([v(SCREEN, f.y0 + 0.05), v(SCREEN, 2.3)])} stroke="#000" strokeWidth={THICK} fill="none" />
					<Label f={f} at={v(SCREEN - 0.05, 2.35)} dir={v(-1, 0)} upright size={12}>
						schermo
					</Label>
					<Arrow f={f} from={start} to={add(start, scale(d0, R * 0.55))} color="#000" />
					<path d={line([start, P])} stroke="#000" strokeWidth={THICK} fill="none" />
					<Label f={f} at={start} dir={v(0, -1)} upright size={12}>
						luce bianca
					</Label>
					<Handle f={f} at={start} onMove={move} label="Inizio del raggio di luce bianca" step={0.1} />
				</Drawing>
				<svg viewBox={`0 0 ${f.W.toFixed(1)} ${f.H.toFixed(1)}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
					{rays.map((r) => (
						<g key={r.name}>
							<path d={line(r.inside)} stroke={r.css} strokeWidth={THIN * 1.4} fill="none" strokeLinejoin="round" />
							{r.out && <path d={line([r.inside[r.inside.length - 1], r.out])} stroke={r.css} strokeWidth={THICK} fill="none" />}
						</g>
					))}
				</svg>
			</div>
			<Readout>
				<Tex>{`\\theta_1 = ${theta}^\\circ`}</Tex>
				<Tex>{`n_{\\text{rosso}} = ${texNum(red.n, 3)}`}</Tex>
				<Tex>{`n_{\\text{violetto}} = ${texNum(violet.n, 3)}`}</Tex>
				{red.dev !== null && <Tex>{`\\delta_{\\text{rosso}} \\approx ${texNum(red.dev, 1)}^\\circ`}</Tex>}
				{violet.dev !== null && <Tex>{`\\delta_{\\text{violetto}} \\approx ${texNum(violet.dev, 1)}^\\circ`}</Tex>}
				{red.dev !== null && violet.dev !== null && <Tex>{`\\text{differenza} \\approx ${texNum(violet.dev - red.dev, 1)}^\\circ`}</Tex>}
			</Readout>
			<Caption>
				{lost.length === rays.length
					? `Con questo angolo nessun colore esce dalla seconda faccia: la luce arriva oltre l'angolo limite e si riflette tutta dentro il prisma.`
					: lost.length > 0
						? `I colori con l'indice più grande, dal ${lost[0].name} in poi, non escono dalla seconda faccia: arrivano oltre l'angolo limite e si riflettono dentro il prisma.`
						: `Il violetto, con l'indice più grande, devia ${num(violet.dev! - red.dev!, 1)}° più del rosso. ${k === 1 ? 'Sono le deviazioni vere di questo vetro.' : 'Qui le differenze tra gli indici sono ingrandite 3 volte, per vedere meglio il ventaglio.'} δ è l'angolo tra il raggio che entra e quello che esce.`}
			</Caption>
			<Controls>
				<Slider label="Angolo θ₁ (°)" value={theta} min={20} max={85} step={1} onChange={setTheta} />
				<ToggleGroup
					label="Separazione dei colori"
					options={[
						{ value: 'vera', label: 'separazione vera' },
						{ value: 'ingrandita', label: 'ingrandita 3 volte' }
					]}
					value={wide}
					onChange={setWide}
				/>
			</Controls>
		</Figure>
	);
}
