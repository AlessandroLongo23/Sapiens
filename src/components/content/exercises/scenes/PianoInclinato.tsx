'use client';

import { Drawing, Label, frame, v, add, sub, scale, polar, lerp, FONT_SIZE, THICK, type V } from '@/components/content/interactive/kit';
import { Block, Incline, Thread, Vector, blockCentre, onIncline, inclineEnds, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A block on an inclined plane (lesson 21), the slope rising to the right at `angolo` degrees. `testoAngolo` is written
 * by the angle at the foot ('30°', or 'α' when the angle is unknown and the drawing is not to scale), `altezza` and
 * `lunghezza` beside the height and the slope ('1,2 m'). With `filo` a thread parallel to the slope holds the block
 * from a peg at the top. `forze` are optional arrows from the block's centre, to scale with `scala` cm per newton,
 * each along a direction tied to the slope: 'giu' (vertical, down), 'su-piano' and 'giu-piano' (along the slope),
 * 'fuori' and 'dentro' (perpendicular to it); `tratteggiata` for a component.
 *
 *   { type: 'piano-inclinato', data: { angolo: 30, testoAngolo: '30°', forze: [{ nome: 'P', direzione: 'giu', modulo: 49 }], scala: 0.03 } }
 */
type Dir = 'giu' | 'su-piano' | 'giu-piano' | 'fuori' | 'dentro';
type Force = { nome: string; sub?: string; modulo: number; direzione: Dir; tratteggiata?: boolean; colore?: keyof typeof QTY };

const L = 4.2; // slope length, cm
const BW = 0.9, BH = 0.6;
/** Points rounded to 1/10000 cm: the page renders on the server too, and sine and cosine may differ in the last bit there. */
const rd = (p: V) => v(Math.round(p.x * 1e4) / 1e4, Math.round(p.y * 1e4) / 1e4);
const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default function PianoInclinato({ data, alt }: SceneProps) {
	const deg = Math.min(80, Math.max(3, Number(data.angolo ?? 30)));
	const a = (deg * Math.PI) / 180;
	const forces = (data.forze as Force[] | undefined) ?? [];
	const k = Number(data.scala ?? 0.03);
	const base = L * Math.cos(a);
	const corner = v(base, 0);
	const { foot, top } = inclineEnds(corner, base, a);
	const { at, rotation } = onIncline(corner, base, a, L * 0.58);
	const c = rd(blockCentre(at, BH, rotation));
	const up = polar(1, a), out = polar(1, a + Math.PI / 2);
	const dirs: Record<Dir, V> = { giu: v(0, -1), 'su-piano': up, 'giu-piano': scale(up, -1), fuori: out, dentro: scale(out, -1) };
	const tips = forces.map((F) => rd(add(c, scale(dirs[F.direzione] ?? v(0, -1), F.modulo * k))));
	const face = add(at, add(scale(up, BW / 2), scale(out, BH / 2)));
	const peg = rd(add(top, scale(out, BH / 2)));
	const pts = [foot, top, v(base + 0.3, 0), peg, ...tips.map((p) => add(p, scale(sub(p, c), 0.6 / (Math.hypot(p.x - c.x, p.y - c.y) || 1))))];
	const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
	const hasH = typeof data.altezza === 'string', hasL = typeof data.lunghezza === 'string';
	const f = frame(r3(Math.min(...xs) - 0.5), r3(Math.max(...xs) + (hasH ? 1.7 : 0.5)), r3(Math.min(-0.35, ...ys) - 0.2), r3(Math.max(...ys) + 0.35));

	return (
		<Drawing f={f} label={alt}>
			<Incline f={f} corner={corner} base={base} angle={a} />
			{typeof data.testoAngolo === 'string' && (
				<Label f={f} at={rd(add(foot, polar(deg < 12 ? 1.5 : 0.95, deg < 12 ? a + 0.1 : a / 2)))} upright={data.testoAngolo !== 'α'} size={FONT_SIZE * 0.85}>
					{data.testoAngolo}
				</Label>
			)}
			{hasH && (
				<Label f={f} at={rd(v(base, top.y / 2))} dir={v(1, 0)} upright size={FONT_SIZE * 0.85}>
					{`h = ${data.altezza}`}
				</Label>
			)}
			{hasL && (
				<Label f={f} at={rd(add(lerp(foot, top, 0.3), scale(out, 0.1)))} dir={rd(v(-Math.sin(a), Math.cos(a)))} upright size={FONT_SIZE * 0.85}>
					{`l = ${data.lunghezza}`}
				</Label>
			)}
			{data.filo === true && (
				<>
					<Thread f={f} from={face} to={peg} />
					<path d={f.path([top, peg])} stroke="#000" strokeWidth={THICK} fill="none" />
					<circle cx={f.px(peg).x} cy={f.px(peg).y} r={2.2} fill="#000" />
				</>
			)}
			<Block f={f} at={at} w={BW} h={BH} angle={rotation} />
			{forces.map((F, i) => (
				<Vector key={i} f={f} from={c} to={tips[i]} color={QTY[F.colore ?? 'forza']} name={F.nome} sub={F.sub} dashed={F.tratteggiata} />
			))}
		</Drawing>
	);
}
