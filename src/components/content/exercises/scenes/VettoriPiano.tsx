'use client';

import { Drawing, frame, v, add, sub, scale, unit, len, cross, dot, THIN, DASH, FONT, FONT_SIZE, type V } from '@/components/content/interactive/kit';
import { Arrow, Axes, QTY } from '@/components/content/interactive/fisica';
import { Grid, NamedVec, placeNames, segToBox, nameBox, type Seg, type NameReq } from '@/components/content/interactive/fisica/griglia';
import type { SceneProps } from '.';

/**
 * Vectors in the plane, for the exercises of the chapter "I vettori e le forze" (group 4): on a grid or on Cartesian
 * axes, each vector from `da` to `a` in grid units, with its name and, if given, a label with its modulus ("30 N");
 * an arc marks an angle between a vector and a reference direction, with its measure. The generator puts in `data`
 * only what the problem gives: the answer (the sum, a component) goes in `solutionScene`.
 *
 *   { type: 'vettori-piano', data: {
 *       u: 0.5,                                        // centimetres per grid unit
 *       griglia: { x0: 0, x1: 8, y0: 0, y1: 5 },       // optional, grid units
 *       assi: true,                                    // optional, axes through (0, 0) with the grid's extent, or their own
 *                                                      // extent { x0, x1, y0, y1 } without a grid
 *       vettori: [{ da: [0, 0], a: [3, 4], sopra: false, nome: 'F', sub: '1', meno: false, colore: 'forza', etichetta: '30 N', tratteggiato: false }],
 *       angoli: [{ vettore: 0, rif: 'x', testo: '35°', antiorario: true }],  // rif: x, -x, y, -y, a ray from the vector's
 *                                                      // origin; the arc goes the shorter way, or counterclockwise from rif
 *       punti: [{ at: [0, 0], nome: 'A' }] } }
 *
 * `sopra` puts a vector's names above it (stacked horizontal arrows). The frame is computed from the data, with room for the names; names are placed where they touch no line.
 */
type Vec = { da: [number, number]; a: [number, number]; sopra?: boolean; nome?: string; sub?: string; meno?: boolean; colore?: keyof typeof QTY; etichetta?: string; tratteggiato?: boolean };
type Ang = { vettore: number; rif: 'x' | '-x' | 'y' | '-y'; testo: string; antiorario?: boolean };
type Pt = { at: [number, number]; nome: string };
type Box = { x0: number; x1: number; y0: number; y1: number };

const REF: Record<Ang['rif'], V> = { x: v(1, 0), '-x': v(-1, 0), y: v(0, 1), '-y': v(0, -1) };
const ARC = 0.45;
/** Where a point's name goes, from the point: below left, like TikZ's `below left`. */
const PT_NAME = v(-0.25, -0.28);

export default function VettoriPiano({ data, alt }: SceneProps) {
	const u = Number(data.u ?? 0.5);
	const grid = data.griglia as Box | undefined;
	const axesBox = data.assi === true ? grid : ((data.assi as Box | undefined) ?? undefined);
	const axes = !!axesBox;
	const vecs = (data.vettori as Vec[] | undefined) ?? [];
	const angs = (data.angoli as Ang[] | undefined) ?? [];
	const pts = (data.punti as Pt[] | undefined) ?? [];
	const P = (p: [number, number]) => v(p[0] * u, p[1] * u);

	// The frame: everything drawn, plus room for the names around it.
	const xs: number[] = [], ys: number[] = [];
	const put = (p: V) => (xs.push(p.x), ys.push(p.y));
	for (const b of [grid, axesBox]) if (b) [v(b.x0, b.y0), v(b.x1, b.y1)].forEach((p) => put(scale(p, u)));
	vecs.forEach((w) => (put(P(w.da)), put(P(w.a))));
	pts.forEach((p) => put(P(p.at)));
	const f = frame(Math.min(...xs) - 0.8, Math.max(...xs) + 0.8, Math.min(...ys) - 0.7, Math.max(...ys) + 0.7);

	// Reference rays and arcs of the angles.
	const arcs = angs.map((g) => {
		const w = vecs[g.vettore];
		const o = P(w.da), d = unit(sub(P(w.a), o)), r = REF[g.rif];
		// The shorter way from the reference to the vector.
		const [from, to] = g.antiorario || cross(r, d) >= 0 ? [r, d] : [d, r];
		const t0 = Math.atan2(from.y, from.x);
		let t1 = Math.atan2(to.y, to.x);
		if (t1 < t0) t1 += 2 * Math.PI;
		const bis = v(Math.cos((t0 + t1) / 2), Math.sin((t0 + t1) / 2));
		const reach = Math.max(0.9, len(sub(P(w.a), o)) * 0.55);
		// Wide enough at the text's distance to hold it, for a narrow angle; the usual 0.45 otherwise.
		const span = t1 - t0;
		const textW = nameBox(g.testo.length * 0.62).w;
		const rad = span >= Math.PI ? ARC : Math.min(1.6, Math.max(ARC, textW / (2 * Math.sin(span / 2)) - 0.2));
		return { o, from, to, t0, t1, bis, rad, ray: { a: o, b: add(o, scale(r, reach)) }, text: g.testo, onAxis: axes && dot(o, o) < 1e-9 && (g.rif === 'x' || g.rif === 'y' || g.rif === '-x' || g.rif === '-y') };
	});

	const segs: Seg[] = vecs.map((w) => ({ a: P(w.da), b: P(w.a) }));
	if (axesBox) segs.push({ a: v(axesBox.x0 * u, 0), b: v(axesBox.x1 * u, 0) }, { a: v(0, axesBox.y0 * u), b: v(0, axesBox.y1 * u) });
	for (const g of arcs) {
		if (!g.onAxis) segs.push(g.ray);
		for (let i = 0; i < 6; i++) {
			const a0 = g.t0 + ((g.t1 - g.t0) * i) / 6, a1 = g.t0 + ((g.t1 - g.t0) * (i + 1)) / 6;
			segs.push({ a: add(g.o, v(g.rad * Math.cos(a0), g.rad * Math.sin(a0))), b: add(g.o, v(g.rad * Math.cos(a1), g.rad * Math.sin(a1))) });
		}
	}
	// Where the axes write x and y (fisica.tsx, Axes): kept free like the points' names.
	const axisNames = axesBox ? [v(axesBox.x1 * u, -0.3), v(-0.3, axesBox.y1 * u)] : [];
	// Angle texts on the bisector just past their arc (the arc grows until the text fits between the two sides), a
	// little farther out if a line still crosses them.
	const angleAt = arcs.map((g) => {
		const box = nameBox(g.text.length * 0.62);
		const base = g.rad + 0.32;
		let best = add(g.o, scale(g.bis, base)), bestClear = -Infinity;
		search: for (const r of [base, base + 0.25, base + 0.5])
			for (const k of [0.5, 0.35, 0.65, 0.25, 0.75]) {
				const th = g.t0 + (g.t1 - g.t0) * k;
				const c = add(g.o, v(r * Math.cos(th), r * Math.sin(th)));
				let clear = Infinity;
				for (const sg of segs) clear = Math.min(clear, segToBox(sg, c, box.w / 2, box.h / 2));
				for (const q of axisNames) clear = Math.min(clear, Math.hypot(c.x - q.x, c.y - q.y) - 0.35);
				if (clear > bestClear) {
					bestClear = clear;
					best = c;
				}
				if (clear > 0.06) break search;
			}
		return best;
	});
	const reqs: NameReq[] = [];
	const who: { i: number; kind: 'nome' | 'etichetta' }[] = [];
	vecs.forEach((w, i) => {
		if (w.nome) {
			reqs.push({ seg: i, chars: (w.meno ? 1.8 : 1) + (w.sub ? 0.7 : 0), up: w.sopra });
			who.push({ i, kind: 'nome' });
		}
		if (w.etichetta) {
			reqs.push({ seg: i, chars: w.etichetta.length * 0.68, up: w.sopra });
			who.push({ i, kind: 'etichetta' });
		}
	});
	// The angle texts as short lines as wide as they are, so no name lands on them.
	const textSegs: Seg[] = angleAt.map((c, i) => {
		const hw = nameBox(arcs[i].text.length * 0.62).w / 2;
		return { a: add(c, v(-hw, 0)), b: add(c, v(hw, 0)) };
	});
	const centres = placeNames(f, [...segs, ...textSegs], reqs, [...axisNames, ...pts.flatMap((p) => [P(p.at), add(P(p.at), PT_NAME)])]);

	return (
		<Drawing f={f} label={alt}>
			{grid && <Grid f={f} u={u} {...grid} />}
			{axesBox && <Axes f={f} x0={axesBox.x0 * u} x1={axesBox.x1 * u} y0={axesBox.y0 * u} y1={axesBox.y1 * u} />}
			{arcs.map((g, i) => (
				<g key={`a${i}`}>
					{!g.onAxis && <path d={f.path([g.ray.a, g.ray.b])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
					<path d={f.arc(g.o, g.from, g.to, g.rad)} stroke="#000" strokeWidth={THIN} fill="none" />
					<Text f={f} at={angleAt[i]} size={FONT_SIZE * 0.85}>
						{g.text}
					</Text>
				</g>
			))}
			{vecs.map((w, i) => (
				<Arrow key={`v${i}`} f={f} from={P(w.da)} to={P(w.a)} color={QTY[w.colore ?? 'vettore']} dashed={w.tratteggiato} />
			))}
			{pts.map((p, i) => (
				<g key={`p${i}`}>
					<circle cx={f.px(P(p.at)).x} cy={f.px(P(p.at)).y} r={2.2} fill="#000" />
					<Text f={f} at={add(P(p.at), PT_NAME)} italic>
						{p.nome}
					</Text>
				</g>
			))}
			{who.map(({ i, kind }, k) => {
				const w = vecs[i];
				const color = QTY[w.colore ?? 'vettore'];
				return kind === 'nome' ? (
					<NamedVec key={`n${k}`} f={f} at={centres[k]} dir={v(0, 0)} name={w.nome ?? ''} sub={w.sub} minus={w.meno} color={color} />
				) : (
					<Text key={`n${k}`} f={f} at={centres[k]} color={color} size={FONT_SIZE * 0.9}>
						{w.etichetta ?? ''}
					</Text>
				);
			})}
		</Drawing>
	);
}

/** Upright text centred at `at` (a modulus, an angle), or italic for a point's name. */
function Text({ f, at, children, color = '#000', size = FONT_SIZE, italic = false }: { f: ReturnType<typeof frame>; at: V; children: string; color?: string; size?: number; italic?: boolean }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={size} fontFamily={italic ? "KaTeX_Math, 'Times New Roman', serif" : FONT} fontStyle={italic ? 'italic' : 'normal'} fill={color} pointerEvents="none">
			{children}
		</text>
	);
}
