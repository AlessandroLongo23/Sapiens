'use client';

import { Drawing, frame, v, THIN, FONT, FONT_MATH, FONT_SIZE, type V } from '@/components/content/interactive/kit';
import { Arrow, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A straight road as an oriented axis s, for the kinematics exercises of group 12 (lessons 38-41): numbered ticks,
 * the origin O, points with a name and a label above them ("s₁ = 25 m"), the legs of a trip as thin arrows stacked
 * above the axis (the way out, the way back), velocity arrows at a point, and, for the solution, the displacement as
 * a blue arrow just above the axis. The frame and the ticks are computed from the data. Like the lesson's TikZ
 * (38-fis-punto-materiale, figures `posizione-retta-orientata` and `andata-ritorno-spostamento-distanza`).
 *
 *   { type: 'strada-posizioni', data: {
 *       unita: 'm',
 *       punti: [{ s: 25, nome: 'A', etichetta: 's₁ = 25 m' }],
 *       tratti: [{ da: 20, a: 140 }, { da: 140, a: 65 }],
 *       velocita: [{ s: 0, verso: 1, nome: 'v', sub: 'A' }],
 *       spostamento: { da: 20, a: 65 } } }
 *
 * The problem's scene draws the data; the displacement (the answer) goes only in the solution's scene.
 */
type Pt = { s: number; nome?: string; etichetta?: string };
type Leg = { da: number; a: number };
type Vel = { s: number; verso: number; nome: string; sub?: string };

const W = 7; // cm for the range of the axis
const NICE = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
const fin = (x: unknown) => typeof x === 'number' && Number.isFinite(x);
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const fmt = (x: number) => String(Math.round(x * 1000) / 1000).replace('.', ',').replace('-', '−');

export default function StradaPosizioni({ data, alt }: SceneProps) {
	const punti = (Array.isArray(data.punti) ? data.punti : []).filter((p: Pt) => fin(p?.s)) as Pt[];
	const tratti = (Array.isArray(data.tratti) ? data.tratti : []).filter((l: Leg) => fin(l?.da) && fin(l?.a)) as Leg[];
	const vel = (Array.isArray(data.velocita) ? data.velocita : []).filter((w: Vel) => fin(w?.s)) as Vel[];
	const sp = data.spostamento as Leg | undefined;
	const unita = typeof data.unita === 'string' ? data.unita : 'm';

	const all = [0, ...punti.map((p) => p.s), ...tratti.flatMap((l) => [l.da, l.a]), ...vel.map((w) => w.s)];
	let lo = Math.min(...all), hi = Math.max(...all);
	if (hi - lo < 1e-9) hi = lo + 10;
	const step = NICE.find((n) => (hi - lo) / n <= 10) ?? 10000;
	lo = Math.floor(lo / step) * step;
	hi = Math.ceil(hi / step) * step;
	if (hi - lo < 4 * step) hi = lo + 4 * step;
	const k = W / (hi - lo);
	const X = (s: number) => r3((s - lo) * k);
	const every = (hi - lo) / step > 6 ? 2 : 1;

	const rows = tratti.length;
	const closeTo = (i: number) => punti.some((o, j) => j < i && Math.abs(o.s - punti[i].s) * k < 1.9);
	const anyClose = punti.some((_, i) => closeTo(i));
	const top = 0.55 + (vel.length ? 0.55 : 0) + rows * 0.42 + (punti.some((p) => p.etichetta || p.nome) ? 0.45 : 0.25) + (anyClose ? 0.4 : 0);
	const f = frame(-0.35, W + 1.25, -0.72, r3(top + 0.1));
	const ticks: string[] = [];
	const labels: { x: number; t: string }[] = [];
	for (let s = lo, i = 0; s <= hi + 1e-9; s += step, i++) {
		ticks.push(f.path([v(X(s), 0.07), v(X(s), -0.07)]));
		if (i % every === 0) labels.push({ x: X(s), t: fmt(s) });
	}
	const text = (p: V, s: string, anchor: 'start' | 'middle' | 'end', dy: string, size = 12, italic = false, color = '#000') => {
		const q = f.px(p);
		return (
			<text x={q.x} y={q.y} dy={dy} textAnchor={anchor} fontSize={size} fontStyle={italic ? 'italic' : 'normal'} fontFamily={italic ? FONT_MATH : FONT} fill={color}>
				{s}
			</text>
		);
	};

	// Heights: displacement just above the axis, then the legs, then the velocities, then the labels of the points.
	const ySp = 0.32;
	const yLeg = (i: number) => 0.62 + i * 0.42;
	const yVel = 0.62 + rows * 0.42 + 0.1;
	const yLab = yVel + (vel.length ? 0.45 : 0);

	return (
		<Drawing f={f} label={alt}>
			<g pointerEvents="none">
				<Arrow f={f} from={v(-0.3, 0)} to={v(W + 0.45, 0)} weight="thin" />
				<path d={ticks.join(' ')} stroke="#000" strokeWidth={THIN} />
				{labels.map((l, i) => (
					<g key={i}>{text(v(l.x, -0.12), l.t, 'middle', '0.8em')}</g>
				))}
				<text x={f.px(v(W + 0.55, 0)).x} y={f.px(v(W + 0.55, 0)).y} dy="0.35em" fontSize={FONT_SIZE - 2}>
					<tspan fontFamily={FONT_MATH} fontStyle="italic">s</tspan>
					<tspan fontFamily={FONT}> ({unita})</tspan>
				</text>
				{0 >= lo && 0 <= hi && text(v(X(0) - 0.08, 0.12), 'O', 'end', '0', 13, true)}
				{tratti.map((l, i) => (
					<Arrow key={i} f={f} from={v(X(l.da), yLeg(i))} to={v(X(l.a), yLeg(i))} weight="thin" />
				))}
				{vel.map((w, i) => (
					<g key={i}>
						<Arrow f={f} from={v(X(w.s), yVel)} to={v(X(w.s) + (w.verso < 0 ? -0.9 : 0.9), yVel)} color={QTY.velocita} />
						<text x={f.px(v(X(w.s) + (w.verso < 0 ? -0.45 : 0.45), yVel + 0.1)).x} y={f.px(v(0, yVel + 0.1)).y} textAnchor="middle" fontSize={FONT_SIZE - 1} fill={QTY.velocita}>
							<tspan fontFamily={FONT_MATH} fontStyle="italic">{w.nome}</tspan>
							{w.sub && (
								<tspan fontFamily={FONT} fontSize={FONT_SIZE - 5} dy="0.3em">
									{w.sub}
								</tspan>
							)}
						</text>
					</g>
				))}
				{sp && Math.abs(sp.a - sp.da) * k > 0.05 && (
					<g>
						<Arrow f={f} from={v(X(sp.da), ySp)} to={v(X(sp.a), ySp)} color={QTY.vettore} />
						{text(v((X(sp.da) + X(sp.a)) / 2, ySp + 0.08), 'Δs', 'middle', '0', 13, true, QTY.vettore)}
					</g>
				)}
				{punti.map((p, i) => {
					const q = f.px(v(X(p.s), 0));
					return <circle key={i} cx={q.x} cy={q.y} r={3} fill="#000" />;
				})}
				{punti.map((p, i) => {
					const close = closeTo(i);
					if (!p.nome && !p.etichetta) return null;
					const q = f.px(v(X(p.s), yLab + (close ? 0.4 : 0)));
					const letter = !!p.nome && /^[A-Z]$/.test(p.nome);
					return (
						<text key={i} x={q.x} y={q.y} textAnchor="middle" fontSize={12} fontFamily={FONT}>
							{p.nome && (
								<tspan fontStyle={letter ? 'italic' : 'normal'} fontFamily={letter ? FONT_MATH : FONT} fontSize={letter ? 14 : 12}>
									{p.nome}
								</tspan>
							)}
							{p.nome && p.etichetta ? ', ' : ''}
							{p.etichetta}
						</text>
					);
				})}
				{punti.map((p, i) =>
					p.etichetta ? <path key={i} d={f.path([v(X(p.s), 0.05), v(X(p.s), yLab - 0.18 + (closeTo(i) ? 0.4 : 0))])} stroke="#999" strokeWidth={THIN} strokeDasharray="2 2" /> : null
				)}
			</g>
		</Drawing>
	);
}
