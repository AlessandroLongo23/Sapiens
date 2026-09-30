'use client';

import { Drawing, frame, v, add, polar, THIN, DASH, FONT_SIZE, FONT, type V } from '@/components/content/interactive/kit';
import { Ball, Ground, Thread, Vector, along, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A body hanging from threads that meet at the body (lesson 20, "Un corpo appeso a due fili"). Each thread leaves the
 * body at `angolo` degrees from the x axis, counterclockwise (150 goes up and to the left, 0 is horizontal to the
 * right), and ends on a ceiling or on a wall. An angle can be marked from the horizontal or from the vertical on the
 * thread's side, with its text ('35°', or 'α' when the angle is what is asked). `forze` are optional arrows from the
 * body, to scale with `scala` cm per newton, for the solution.
 *
 *   { type: 'fili-corpo', data: { fili: [{ angolo: 150, supporto: 'soffitto', rif: 'orizzontale', testo: '30°' }, { angolo: 30, supporto: 'soffitto' }] } }
 */
type Filo = { angolo: number; supporto?: 'soffitto' | 'parete'; rif?: 'orizzontale' | 'verticale'; testo?: string };
type Force = { nome: string; sub?: string; modulo: number; angolo: number; colore?: keyof typeof QTY };

const RISE = 1.7; // how high the ceilings are above the body, cm
const MAX_LEN = 3; // no thread longer than this
const ARC = 0.55;
const DEG = Math.PI / 180;
/** Points rounded to 1/10000 cm: the page renders on the server too, and sine and cosine may differ in the last bit there. */
const rd = (p: V) => v(Math.round(p.x * 1e4) / 1e4, Math.round(p.y * 1e4) / 1e4);
const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default function FiliCorpo({ data, alt }: SceneProps) {
	const fili = ((data.fili as Filo[] | undefined) ?? []).slice(0, 3);
	const forces = (data.forze as Force[] | undefined) ?? [];
	const k = Number(data.scala ?? 0.03);
	const O = v(0, 0);
	const ends = fili.map((t) => {
		const s = Math.sin(t.angolo * DEG);
		const L = s > 0.05 ? Math.min(RISE / s, MAX_LEN) : 2.2;
		return rd(polar(L, t.angolo * DEG));
	});
	// Each thread's support, as the ends of a hatched segment (ticks on the side away from the body).
	const supports = fili.map((t, i) => {
		const e = ends[i];
		if ((t.supporto ?? 'soffitto') === 'parete') return e.x < 0 ? [add(e, v(0, 0.6)), add(e, v(0, -0.6))] : [add(e, v(0, -0.6)), add(e, v(0, 0.6))];
		return e.y >= 0 ? [add(e, v(0.6, 0)), add(e, v(-0.6, 0))] : [add(e, v(-0.6, 0)), add(e, v(0.6, 0))];
	});
	const tips = forces.map((F) => rd(along(O, F.angolo * DEG, F.modulo * k + 0.6)));
	const pts: V[] = [O, v(0, -0.5), ...supports.flat().map((p) => add(p, v(0, 0))), ...tips];
	const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
	const f = frame(r3(Math.min(...xs) - 0.4), r3(Math.max(...xs) + 0.4), r3(Math.min(...ys) - 0.3), r3(Math.max(...ys) + 0.35));

	return (
		<Drawing f={f} label={alt}>
			{supports.map(([a, b], i) => (
				<Ground key={`g${i}`} f={f} from={a} to={b} />
			))}
			{ends.map((e, i) => (
				<Thread key={`t${i}`} f={f} from={e} to={O} />
			))}
			{fili.map((t, i) => {
				if (!t.rif || !t.testo) return null;
				const dir = polar(1, t.angolo * DEG);
				const ref = t.rif === 'verticale' ? v(0, 1) : v(dir.x >= 0 ? 1 : -1, 0);
				// The arc goes counterclockwise from the first direction to the second.
				const ccw = dir.x * ref.y - dir.y * ref.x > 0;
				const [a, b] = ccw ? [dir, ref] : [ref, dir];
				const m0 = Math.atan2(a.y + b.y, a.x + b.x);
				// Two marks from the vertical sit close together: their texts go farther out, each inside its own angle.
				const fromVertical = Math.abs(90 - t.angolo);
				const outside = (t.angolo + (dir.x >= 0 ? -16 : 16)) * DEG; // beside the thread, away from the vertical
				const lab = rd(t.rif !== 'verticale' ? add(polar(ARC + 0.32, m0), v(0, 0.12)) : fromVertical >= 30 ? polar(ARC + 0.62, m0) : polar(ARC + 0.45, outside));
				return (
					<g key={`a${i}`}>
						<path d={f.path([O, add(O, polar(ARC + 0.45, Math.atan2(ref.y, ref.x)))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
						<path d={f.arc(O, a, b, ARC)} stroke="#000" strokeWidth={THIN} fill="none" />
						<text x={f.px(lab).x} y={f.px(lab).y} dy="0.35em" textAnchor="middle" fontSize={FONT_SIZE * 0.8} fontFamily={FONT} pointerEvents="none">
							{t.testo}
						</text>
					</g>
				);
			})}
			<Ball f={f} at={O} r={0.13} />
			{forces.map((F, i) => (
				<Vector key={`f${i}`} f={f} from={O} to={rd(along(O, F.angolo * DEG, F.modulo * k))} color={QTY[F.colore ?? 'forza']} name={F.nome} sub={F.sub} />
			))}
		</Drawing>
	);
}
