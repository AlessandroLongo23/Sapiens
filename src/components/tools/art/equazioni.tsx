import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Ink, Label } from './primitives';

/** The points of y = f(x) on the drawing grid, as a path: "M x,y L x,y …". */
const plotPath = (f: (x: number) => number, from: number, to: number, steps = 48) =>
	Array.from({ length: steps + 1 }, (_, i) => {
		const x = from + ((to - from) * i) / steps;
		return `${i ? 'L' : 'M'}${x.toFixed(1)},${f(x).toFixed(1)}`;
	}).join(' ');

/** A small open circle, for an end that is not in the set. */
const HollowDot = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3} className="fill-surface stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />;

export const EQUAZIONI_ART: Record<string, ReactNode> = {
	'equazioni-fratte': (
		<Art>
			{/* The graph of k/(x − a): the value that makes the denominator zero is the dashed asymptote, left out; the
			    solution is where the curve meets the horizontal line. */}
			<Axes ox={16} oy={50} />
			<Dashed d="M64,4 V76" />
			<Ink d={plotPath((x) => 50 - 160 / (x - 64), 68, 112)} />
			<Ink d={plotPath((x) => 50 - 160 / (x - 64), 20, 57.8)} />
			<Dashed d="M8,34 H112" />
			<Dot x={74} y={34} accent />
		</Art>
	),
	'equazioni-biquadratiche': (
		<Art>
			{/* The curve of x⁴ − 5x² + 4, a W symmetric about the y axis, and its four zeros. */}
			<Axes ox={60} oy={44} />
			<Ink d={plotPath((X) => {
				const u = (X - 60) / 18;
				return 44 - 6 * (u ** 4 - 5 * u ** 2 + 4);
			}, 17.9, 102.1)} />
			<Dot x={24} y={44} accent />
			<Dot x={42} y={44} accent />
			<Dot x={78} y={44} accent />
			<Dot x={96} y={44} accent />
		</Art>
	),
	'equazioni-valore-assoluto': (
		<Art>
			{/* The V of |x − a| cut by a slanted line: the two cases give the two meeting points. */}
			<Axes ox={24} oy={66} />
			<Ink d="M14,6 L64,66 L114,6" />
			<Dashed d="M14,60 L114,20" />
			<Dot x={47.8} y={46.5} accent />
			<Dot x={96.5} y={27} accent />
		</Art>
	),
	'disequazioni-fratte': (
		<Art>
			{/* The table of signs: a solid line where a factor is positive, a dashed one where it is negative, and under
			    the rule the solutions of N/D ≥ 0, with the zero of D left out. */}
			<Label x={10} y={18} size={11}>
				N
			</Label>
			<Label x={10} y={34} size={11}>
				D
			</Label>
			<path d="M46,8 V70 M80,8 V70" className="stroke-fg-muted" strokeWidth={1} strokeDasharray="1 3" vectorEffect="non-scaling-stroke" />
			<Dashed d="M18,18 H46" />
			<Ink d="M46,18 H112" />
			<Dashed d="M18,34 H80" />
			<Ink d="M80,34 H112" />
			<path d="M16,46 H112" className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />
			<Accent d="M18,60 H46 M83,60 H112" />
			<Dot x={46} y={60} accent />
			<HollowDot x={80} y={60} />
		</Art>
	)
};
