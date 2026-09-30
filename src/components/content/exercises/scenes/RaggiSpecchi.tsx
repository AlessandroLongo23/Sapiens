'use client';

import { Drawing, Label, frame, v, add, sub, scale, unit, THICK, THIN, TINT, FONT, FONT_MATH, type V, type Frame } from '@/components/content/interactive/kit';
import { OpticalAxis, PlaneMirror, SphericalMirror, AxisPoint, Arrowhead, RAY, RAY2 } from '@/components/content/interactive/fisica/ottica';
import { Raggio, Occhio } from '@/components/content/interactive/fisica/raggi';
import type { SceneProps } from '.';

/**
 * Rays, shadows and mirrors, for the exercises of the lessons 31-33 (group 10: ottica-geometrica, riflessione,
 * fis-specchi-sferici). The generator computes every point, in TikZ centimetres with y upwards, and lists what to
 * draw, in drawing order; this component only draws it, with the pieces of ottica.tsx and raggi.tsx, and fits the
 * frame around it with room for the labels. The problem scene has only the data; the rays found, the image and the
 * answer go in `solutionScene`.
 *
 *   { type: 'raggi-specchi', data: { elementi: [
 *       { tipo: 'asse', x0: -6, x1: 0.6 },                                  // optical axis, on y = 0
 *       { tipo: 'specchio', da: [0, -1], a: [0, 1] },                       // plane mirror, ticks on the right of da→a
 *       { tipo: 'sferico', vertice: [0, 0], raggio: 9, meta: 1.4, concavo: true },   // drawn radius
 *       { tipo: 'punto', at: [-1.5, 0], nome: 'F' },                        // a dot with its name below
 *       { tipo: 'raggio', da: [-4, 0.7], a: [0, 0.7], colore: 1, virtuale: false },  // colore 1, 2, 3
 *       { tipo: 'linea', da: [0, 0], a: [0, 1.5] },                         // thin dashed: a normal
 *       { tipo: 'angolo', o: [0, 0], da: [0, 1], a: [-0.6, 0.8], testo: '40°' },   // arc counterclockwise da→a
 *       { tipo: 'oggetto', piede: [-4, 0], h: 0.7 },
 *       { tipo: 'immagine', piede: [-2, 0], h: -0.35, virtuale: false },
 *       { tipo: 'quota', da: [-4, -1], a: [0, -1], testo: '30 cm' },         // label on the right of da→a
 *       { tipo: 'sorgente', at: [0, 0] },                                   // a point source
 *       { tipo: 'ostacolo', da: [2, -0.4], a: [2, 0.4] },                   // an opaque card, seen edgewise
 *       { tipo: 'schermo', da: [6, -2], a: [6, 2] },
 *       { tipo: 'zona', punti: [[2, 0.4], [6, 1.2], [6, -1.2], [2, -0.4]] },   // the shadow, grey
 *       { tipo: 'parete', da: [0, 0], a: [3, 0] },                          // a wall or the floor, ticks on the right
 *       { tipo: 'scatola', x0: 3, x1: 5, y0: -1, y1: 1, foro: 0 },          // camera obscura, hole in the left wall at y = foro
 *       { tipo: 'persona', piede: [-2, 0], h: 3.4, occhi: 3.2, virtuale: false },
 *       { tipo: 'occhio', at: [-3, 1] },
 *       { tipo: 'testo', at: [1, 1], testo: 'Luna', dir: [0, 1] },
 *   ] } }
 */
type P = [number, number];
type El =
	| { tipo: 'asse'; x0: number; x1: number }
	| { tipo: 'specchio' | 'ostacolo' | 'schermo' | 'parete' | 'linea'; da: P; a: P }
	| { tipo: 'sferico'; vertice: P; raggio: number; meta: number; concavo: boolean }
	| { tipo: 'punto'; at: P; nome: string }
	| { tipo: 'raggio'; da: P; a: P; colore?: 1 | 2 | 3; virtuale?: boolean }
	| { tipo: 'angolo'; o: P; da: P; a: P; testo: string; r?: number }
	| { tipo: 'oggetto'; piede: P; h: number }
	| { tipo: 'immagine'; piede: P; h: number; virtuale?: boolean }
	| { tipo: 'quota'; da: P; a: P; testo: string }
	| { tipo: 'sorgente'; at: P }
	| { tipo: 'zona'; punti: P[] }
	| { tipo: 'scatola'; x0: number; x1: number; y0: number; y1: number; foro: number }
	| { tipo: 'persona'; piede: P; h: number; occhi: number; virtuale?: boolean }
	| { tipo: 'occhio'; at: P }
	| { tipo: 'testo'; at: P; testo: string; dir?: P; corsivo?: boolean };

const COLOR = { 1: RAY, 2: RAY2, 3: '#008000' } as const;
const pt = (p: P) => v(p[0], p[1]);
const SMALL = 13;

/** A dimension line, as `\draw[|-|, thin] (da) -- (a) node[midway, …] {testo};` with the text on its right. */
function Quota({ f, da: d0, a: a0, testo }: { f: Frame; da: V; a: V; testo: string }) {
	// A horizontal dimension is always read left to right, with its text below.
	const [da, a] = Math.abs(a0.y - d0.y) < 1e-9 && a0.x < d0.x ? [a0, d0] : [d0, a0];
	const u = unit(sub(a, da));
	const n = v(u.y, -u.x);
	const bar = scale(v(-u.y, u.x), 0.08);
	const m = scale(add(da, a), 0.5);
	return (
		<g pointerEvents="none">
			<path d={`${f.path([da, a])} ${f.path([add(da, bar), sub(da, bar)])} ${f.path([add(a, bar), sub(a, bar)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
			<Label f={f} at={add(m, scale(n, 0.05))} dir={n} upright size={SMALL}>
				{testo}
			</Label>
		</g>
	);
}

/** The stick figure of the lessons' figure "specchio-meta-altezza": head, eye, body, arms, legs. */
function Persona({ f, piede, h, occhi, virtuale }: { f: Frame; piede: V; h: number; occhi: number; virtuale?: boolean }) {
	const r = h - occhi; // the head's radius: the eye at its centre, the top at h
	const x = piede.x, y = piede.y;
	const neck = y + occhi - r, hip = y + h * 0.44, sh = y + h * 0.79;
	const color = virtuale ? RAY2 : '#000';
	const dash = virtuale ? '4.5 4.5' : undefined;
	const c = f.px(v(x, y + occhi));
	const lines = [
		[v(x, neck), v(x, hip)],
		[v(x, hip), v(x - 0.15, y)],
		[v(x, hip), v(x + 0.15, y)],
		[v(x - 0.25, y + h * 0.56), v(x, sh), v(x + 0.25, y + h * 0.56)],
	];
	return (
		<g pointerEvents="none">
			{lines.map((l, i) => (
				<path key={i} d={f.path(l)} stroke={color} strokeWidth={THICK} strokeDasharray={dash} fill="none" />
			))}
			<circle cx={c.x} cy={c.y} r={r * (f.W / (f.x1 - f.x0))} stroke={color} strokeWidth={THICK} strokeDasharray={dash} fill="none" />
			<circle cx={c.x} cy={c.y} r={1.8} fill={color} />
		</g>
	);
}

function points(e: El): V[] {
	switch (e.tipo) {
		case 'asse':
			return [v(e.x0, 0), v(e.x1, 0)];
		case 'sferico':
			return [add(pt(e.vertice), v(-0.3, -e.meta)), add(pt(e.vertice), v(0.3, e.meta))];
		case 'punto':
			return [pt(e.at), add(pt(e.at), v(0, -0.5))];
		case 'angolo': {
			const b = (Math.atan2(e.da[1], e.da[0]) + Math.atan2(e.a[1], e.a[0])) / 2;
			const r = (e.r ?? 0.5) + 0.3;
			return [pt(e.o), add(pt(e.o), v(r * Math.cos(b) + Math.sign(Math.cos(b)) * 0.6, r * Math.sin(b)))];
		}
		case 'oggetto':
		case 'immagine':
			return [pt(e.piede), add(pt(e.piede), v(0, e.h))];
		case 'quota': {
			const [da, a] = e.da[1] === e.a[1] && e.a[0] < e.da[0] ? [pt(e.a), pt(e.da)] : [pt(e.da), pt(e.a)];
			const u = unit(sub(a, da));
			const n = v(u.y, -u.x);
			const m = scale(add(da, a), 0.5);
			const w = e.testo.length * 0.13;
			return [da, a, add(m, add(scale(n, 0.55), v(Math.abs(n.x) > 0.5 ? n.x * w : 0, 0)))];
		}
		case 'sorgente':
			return [pt(e.at)];
		case 'zona':
			return e.punti.map(pt);
		case 'scatola':
			return [v(e.x0, e.y0), v(e.x1, e.y1)];
		case 'persona':
			return [add(pt(e.piede), v(-0.3, 0)), add(pt(e.piede), v(0.3, e.h))];
		case 'occhio':
			return [add(pt(e.at), v(-0.35, -0.2)), add(pt(e.at), v(0.15, 0.2))];
		case 'testo':
			return [pt(e.at), add(pt(e.at), v((e.dir?.[0] ?? 0) * 0.3 + e.testo.length * 0.12 * Math.sign(e.dir?.[0] ?? 0), (e.dir?.[1] ?? 0) * 0.5))];
		default:
			return [pt(e.da), pt(e.a)];
	}
}

export default function RaggiSpecchi({ data, alt }: SceneProps) {
	const els = (data.elementi as El[] | undefined) ?? [];
	const all = els.flatMap(points);
	const xs = all.map((p) => p.x), ys = all.map((p) => p.y);
	const f = frame(Math.min(...xs) - 0.35, Math.max(...xs) + 0.35, Math.min(...ys) - 0.3, Math.max(...ys) + 0.3);

	return (
		<Drawing f={f} label={alt}>
			{els.map((e, i) => {
				switch (e.tipo) {
					case 'asse':
						return <OpticalAxis key={i} f={f} x0={e.x0} x1={e.x1} />;
					case 'specchio':
						return <PlaneMirror key={i} f={f} from={pt(e.da)} to={pt(e.a)} />;
					case 'parete':
						return <PlaneMirror key={i} f={f} from={pt(e.da)} to={pt(e.a)} />;
					case 'sferico':
						return <SphericalMirror key={i} f={f} vertex={pt(e.vertice)} R={e.raggio} half={e.meta} concave={e.concavo} />;
					case 'punto':
						return <AxisPoint key={i} f={f} at={pt(e.at)} name={e.nome} />;
					case 'raggio':
						return <Raggio key={i} f={f} from={pt(e.da)} to={pt(e.a)} color={COLOR[e.colore ?? 1]} virtual={e.virtuale} />;
					case 'linea':
						return <path key={i} d={f.path([pt(e.da), pt(e.a)])} stroke="#000" strokeWidth={THIN} strokeDasharray="4.5 4.5" fill="none" />;
					case 'angolo': {
						const o = pt(e.o), r = e.r ?? 0.5;
						const a0 = Math.atan2(e.da[1], e.da[0]);
						let a1 = Math.atan2(e.a[1], e.a[0]);
						if (a1 < a0) a1 += 2 * Math.PI;
						const b = (a0 + a1) / 2;
						const bx = Math.cos(b), by = Math.sin(b);
						// The text just outside the arc, anchored away from it (to the left of a bisector that points left).
						const at = add(o, v((r + 0.06) * bx, (r + 0.06) * by));
						const d = v(Math.abs(bx) < 0.5 ? (bx < 0 ? -0.5 : 0.5) : bx, by);
						return (
							<g key={i}>
								<path d={f.arc(o, pt(e.da), pt(e.a), r)} stroke="#000" strokeWidth={THIN} fill="none" />
								<Label f={f} at={at} dir={d} upright size={SMALL}>
									{e.testo}
								</Label>
							</g>
						);
					}
					case 'oggetto':
						return <Arrowhead key={i} f={f} foot={pt(e.piede)} h={e.h} />;
					case 'immagine':
						return <Arrowhead key={i} f={f} foot={pt(e.piede)} h={e.h} image virtual={e.virtuale} />;
					case 'quota':
						return <Quota key={i} f={f} da={pt(e.da)} a={pt(e.a)} testo={e.testo} />;
					case 'sorgente': {
						const c = f.px(pt(e.at));
						return <circle key={i} cx={c.x} cy={c.y} r={3} fill={RAY} />;
					}
					case 'ostacolo':
						return <path key={i} d={f.path([pt(e.da), pt(e.a)])} stroke="#000" strokeWidth={3} fill="none" />;
					case 'schermo': {
						const da = pt(e.da), a = pt(e.a);
						const u = unit(sub(a, da));
						const n = scale(v(u.y, -u.x), 0.12);
						return (
							<g key={i}>
								<path d={f.path([da, a, add(a, n), add(da, n)], true)} fill={TINT.gray} stroke="none" />
								<path d={f.path([da, a])} stroke="#000" strokeWidth={THICK} fill="none" />
							</g>
						);
					}
					case 'zona':
						return <path key={i} d={f.path(e.punti.map(pt), true)} fill="#b3b3b3" stroke="none" />;
					case 'scatola': {
						const g = 0.06;
						return (
							<g key={i}>
								<path d={f.path([v(e.x0, e.y0), v(e.x1, e.y0), v(e.x1, e.y1), v(e.x0, e.y1)], true)} fill={TINT.gray} stroke="none" opacity={0.6} />
								<path d={f.path([v(e.x0, e.foro + g), v(e.x0, e.y1), v(e.x1, e.y1), v(e.x1, e.y0), v(e.x0, e.y0), v(e.x0, e.foro - g)])} stroke="#000" strokeWidth={THICK} fill="none" />
							</g>
						);
					}
					case 'persona':
						return <Persona key={i} f={f} piede={pt(e.piede)} h={e.h} occhi={e.occhi} virtuale={e.virtuale} />;
					case 'occhio':
						return <Occhio key={i} f={f} at={pt(e.at)} />;
					case 'testo':
						return (
							<text key={i} x={f.px(add(pt(e.at), scale(pt(e.dir ?? [0, 0]), 0.2))).x} y={f.px(add(pt(e.at), scale(pt(e.dir ?? [0, 0]), 0.2))).y} dy="0.35em" textAnchor={(e.dir?.[0] ?? 0) > 0.3 ? 'start' : (e.dir?.[0] ?? 0) < -0.3 ? 'end' : 'middle'} fontSize={e.corsivo ? 15 : SMALL} fontFamily={e.corsivo ? FONT_MATH : FONT} fontStyle={e.corsivo ? 'italic' : 'normal'} pointerEvents="none">
								{e.testo}
							</text>
						);
					default:
						return null;
				}
			})}
		</Drawing>
	);
}

