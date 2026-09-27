import type { ReactNode } from 'react';
import { Accent, Art, Dot, Fill, Ink, Label } from './primitives';

/** A thin grey line of a table or a scale, lighter than the ink of the figure. */
const Rule = ({ d }: { d: string }) => <path d={d} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />;

/** Five marks as columns: 7, 5, 8, 6, 9, six units a point, standing on y = 64. Their mean, 7, is at y = 22. */
const MARKS = [7, 5, 8, 6, 9];

/** The ticks of the two scales of the grade conversion, from x = 20 to x = 100: tenths above, twentieths below. */
const ticks = (n: number, y: number, dir: number) =>
	Array.from({ length: n + 1 }, (_, i) => {
		const x = 20 + (80 * i) / n;
		const len = i % (n / 2) === 0 ? 6 : 3.5;
		return `M${x.toFixed(2)},${y} V${y + dir * len}`;
	}).join(' ');

/** A point on the ring of the maturità drawing, at a fraction of the turn from the top, on a circle of radius r. */
const at = (f: number, r: number) => `${(60 + r * Math.sin(2 * Math.PI * f)).toFixed(2)},${(40 - r * Math.cos(2 * Math.PI * f)).toFixed(2)}`;

/** The drawings of the scuola tools, by slug. */
export const SCUOLA_ART: Record<string, ReactNode> = {
	'calcolo-media-voti': (
		<Art>
			{MARKS.map((m, i) => (
				<Fill key={i} d={`M${16 + 18 * i},64 V${64 - 6 * m} H${28 + 18 * i} V64`} />
			))}
			<Ink d="M10,64 H110" />
			<Accent d="M10,22 H110" />
			{MARKS.map((m, i) => (
				<Label key={i} x={22 + 18 * i} y={73} plain size={10}>
					{m}
				</Label>
			))}
		</Art>
	),
	'calcolo-crediti-scolastici': (
		<Art>
			{/* The ministry's table of credit bands, with the row of the student's mean. */}
			<Fill d="M20,8 H100 V20 H20 Z" />
			<Fill d="M20,44 H100 V56 H20 Z" />
			<Ink d="M20,8 H100 V68 H20 Z M20,20 H100" />
			<Rule d="M46.67,8 V68 M73.33,8 V68 M20,32 H100 M20,44 H100 M20,56 H100" />
			<Accent d="M20,44 H100 V56 H20 Z" />
			{['III', 'IV', 'V'].map((y, i) => (
				<Label key={y} x={33.33 + 26.67 * i} y={14.5} plain size={10}>
					{y}
				</Label>
			))}
			{['10', '11', '12'].map((c, i) => (
				<Label key={c} x={33.33 + 26.67 * i} y={50.5} plain accent size={10}>
					{c}
				</Label>
			))}
		</Art>
	),
	'calcolo-voto-maturita': (
		<Art>
			{/* The hundred points of the exam as a ring: credit 40, two written tests and the interview 20 each. */}
			<Fill fillRule="evenodd" d="M60,10 A30,30 0 1 1 60,70 A30,30 0 1 1 60,10 Z M60,23 A17,17 0 1 0 60,57 A17,17 0 1 0 60,23 Z" />
			<Ink d={`M${at(0, 17)} L${at(0, 30)} M${at(0.4, 17)} L${at(0.4, 30)} M${at(0.6, 17)} L${at(0.6, 30)} M${at(0.8, 17)} L${at(0.8, 30)}`} />
			<Accent d={`M${at(0, 35)} A35,35 0 1 1 ${at(0.9, 35)}`} />
			<Label x={60} y={40.5} plain size={10}>
				100
			</Label>
		</Art>
	),
	'conversione-voti': (
		<Art>
			{/* Two scales of the same length, in tenths and twentieths: a grade keeps its place from one to the other. */}
			<Ink d="M20,28 H100 M20,52 H100" />
			<path d={`${ticks(10, 28, -1)} ${ticks(20, 52, 1)}`} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />
			<Accent d="M76,28 V52" />
			<Dot x={76} y={28} accent />
			<Dot x={76} y={52} accent />
			<Label x={20} y={40} plain size={10}>
				0
			</Label>
			<Label x={100} y={14} plain size={10}>
				10
			</Label>
			<Label x={100} y={66} plain size={10}>
				20
			</Label>
		</Art>
	)
};
