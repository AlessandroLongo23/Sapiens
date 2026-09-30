'use client';

import { Drawing, frame, v, THICK, THIN, TINT } from '@/components/content/interactive/kit';
import { Arrow } from '@/components/content/interactive/fisica';
import { Words } from '@/components/content/interactive/fisica/calore';
import type { SceneProps } from '.';

/**
 * A paper chromatogram of a chemistry exercise (group 23: chim-separazione-miscugli), drawn like the TikZ figure of
 * lesson 18 (separazione-cromatografia-carta): the strip, the pencil start line (dashed) `partenza` cm above the
 * lower edge, the solvent front `fronte` cm above the start line, and the spots at their distance `d` from the start
 * line, each with its letter. Dimension lines give the measures the exercise states: the front, each spot in
 * `quote`, and the start line's height when `quotaBordo` is true. Lengths in centimetres of the real strip.
 *
 *   { type: 'cromatogramma', data: { partenza: 1.5, fronte: 8.0, macchie: [{ nome: 'A', d: 2.4 }, { nome: 'B', d: 6.0 }], quote: ['A'], quotaBordo: true } }
 *
 * The spots are grey: the exercise names them by letter. The scene draws the measures, never the R_f.
 */
const S = 0.36; // drawing cm per real cm

type Spot = { nome: string; d: number };
const isSpot = (x: unknown): x is Spot => !!x && typeof x === 'object' && typeof (x as Spot).nome === 'string' && Number.isFinite((x as Spot).d);
const cm = (x: number) => `${x.toFixed(1).replace('.', ',')} cm`;

export default function Cromatogramma({ data, alt }: SceneProps) {
	const front = Number(data.fronte);
	const base = Number(data.partenza ?? 1.5);
	const spots = (Array.isArray(data.macchie) ? data.macchie : []).filter(isSpot);
	if (!(front > 0) || !(base > 0)) return <p className="sr-only">{alt}</p>;
	const quoted = new Set(Array.isArray(data.quote) ? data.quote.map(String) : []);
	const edge = data.quotaBordo === true;
	const top = (base + front + 1.0) * S;
	const Y = (d: number) => (base + d) * S; // height of a distance from the start line
	const X0 = 0, X1 = 0.9;
	const q = [...spots.filter((s) => quoted.has(s.nome))];
	// Dimension lines to the left, one column each: the front first, then the quoted spots.
	const cols = [{ label: cm(front), y0: Y(0), y1: Y(front) }, ...q.map((s) => ({ label: cm(s.d), y0: Y(0), y1: Y(s.d) }))];
	const left = -0.35 - 1.3 * cols.length - (edge ? 1.3 : 0);
	const f = frame(left - 0.2, X1 + 1.1, -0.3, top + 0.35);
	const colX = (i: number) => -0.35 - 1.3 * i;

	return (
		<Drawing f={f} label={alt}>
			<path d={f.path([v(X0, 0), v(X1, 0), v(X1, Y(front)), v(X0, Y(front))], true)} fill={TINT.blue} stroke="none" />
			<path d={f.path([v(X0, 0), v(X1, 0), v(X1, top), v(X0, top)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(X0, Y(0)), v(X1, Y(0))])} stroke="#000" strokeWidth={THIN} strokeDasharray="3 2.5" fill="none" />
			<path d={f.path([v(X0, Y(front)), v(X1, Y(front))])} stroke="#000" strokeWidth={THIN} fill="none" />
			{spots.map((s) => {
				const c = f.px(v((X0 + X1) / 2, Y(s.d)));
				return (
					<g key={s.nome}>
						<ellipse cx={c.x} cy={c.y} rx={7} ry={5} fill="#808080" />
						<Words f={f} at={v(X1 + 0.15, Y(s.d))} anchor="start" size={13}>
							{s.nome}
						</Words>
					</g>
				);
			})}
			<Words f={f} at={v(X1 + 0.15, Y(front) + 0.02)} anchor="start" size={11} dy="-0.2em">
				fronte
			</Words>
			{cols.map((c, i) => {
				const x = colX(i);
				return (
					<g key={i}>
						<path d={f.path([v(x - 0.05, c.y1), v(X0 - 0.05, c.y1)])} stroke="#999" strokeWidth={0.4} fill="none" />
						<Arrow f={f} from={v(x, (c.y0 + c.y1) / 2)} to={v(x, c.y1)} weight="thin" />
						<Arrow f={f} from={v(x, (c.y0 + c.y1) / 2)} to={v(x, c.y0)} weight="thin" />
						<Words f={f} at={v(x - 0.08, (c.y0 + c.y1) / 2)} anchor="end" size={12}>
							{c.label}
						</Words>
					</g>
				);
			})}
			<path d={f.path([v(colX(cols.length - 1) - 0.05, Y(0)), v(X0 - 0.05, Y(0))])} stroke="#999" strokeWidth={0.4} fill="none" />
			{edge && (
				<g>
					<Arrow f={f} from={v(colX(cols.length), Y(0) / 2)} to={v(colX(cols.length), Y(0))} weight="thin" />
					<Arrow f={f} from={v(colX(cols.length), Y(0) / 2)} to={v(colX(cols.length), 0)} weight="thin" />
					<path d={f.path([v(colX(cols.length) - 0.05, 0), v(X0, 0)])} stroke="#999" strokeWidth={0.4} fill="none" />
					<Words f={f} at={v(colX(cols.length) - 0.08, Y(0) / 2)} anchor="end" size={12}>
						{cm(base)}
					</Words>
				</g>
			)}
		</Drawing>
	);
}
